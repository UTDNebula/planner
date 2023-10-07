from __future__ import annotations
from enum import Enum
from glob import glob
from collections import Counter, defaultdict
from pathlib import Path

from pydantic import Json

from typing import Any, DefaultDict

import core
from major.requirements import AbstractRequirement, FreeElectiveRequirement
from dataclasses import dataclass

from major.requirements import loader
import json

from major.requirements.shared import (
    CourseRequirement,
    HoursRequirement,
)
from course import Course

LOADER = loader.Loader()

# Read all degree plan JSON files and store their contents in a hashmap
# This is so that we can avoid reading all the files each time we want to get the data for a certain course
degree_plans: DefaultDict[str, DefaultDict[str, dict[str, Any]]] = defaultdict(
    lambda: defaultdict(dict)
)

for fname in glob("degree_data/*/*.json"):
    with open(fname, "r") as f:
        data = json.load(f)
        degree_plans[Path(fname).parts[1]][data["display_name"]] = data


@dataclass
class Bypass:
    """Sometimes, we may want to manually assign a course to a requirement.
    For example, to specify what would be an arbitrary choice to the algorithm,
    or to allow something that doesn't normally happen. One common example
    of this is replacing CS 1136 with hours from a different CS course.

    Each bypass contains a course, total # of hours, and a mapping of requirements to hours.

    TODO: THIS IS CURRENTLY NOT BEING USED

    """

    name: str
    requirements: dict[
        str, int
    ]  # Each requirement is denoted by its id & takes in a certain # of hours
    hours: int


@dataclass
class BypassInput:
    core: list[str]  # Contains name of each core requirement
    major: dict[str, list[str]]  # Contains index of each major requirement


class DegreeRequirementType(Enum):
    core = "core"
    major = "major"
    minor = "minor"
    other = "other"


@dataclass
class RequirementOutput:
    requirement_name: str
    is_fulfilled: bool
    valid_courses: list[str]


@dataclass
class DegreeRequirementsInput:
    """This tells the solver what Degree Requirements to attempt
    to solve with the given courses and bypasses input.

    Sample DegreeRequirementsInput:
        core: true
        year: 2022
        majors: ["Computer Science(BS)"]
        minors: ["History"]
        other: []

    This tells the solver to attempt to solve for the Core Curriculum,
    Computer Science, and History requirements.
    """

    year: int  # We use an int for year because we perform arithmetic to find a fallback year
    majors: list[str]  # TODO: Change to Enum in the future
    minors: list[str]  # TODO: Change to Enum in the future
    other: list[str]  # TODO: Change to Enum in the future


@dataclass
class DegreeRequirementOutput:
    name: str
    type: str
    requirements: list[RequirementOutput]


@dataclass
class DegreeRequirement:
    """A DegreeRequirement is a substantial grouping of requirements, like the
    Core Curriulum, a major (i.e. Psychology(BS)), or a minor (i.e. Music)
    """

    name: str
    type: DegreeRequirementType
    requirements: list[AbstractRequirement]
    min_hours: int

    def get_num_fulfilled_requirements(self) -> int:
        return sum([1 for req in self.requirements if req.is_fulfilled()])

    def to_json(self) -> Json[Any]:
        return json.dumps(
            {
                "name": self.name,
                "type": self.type.value,
                "min_hours": self.min_hours,
                "num_fulfilled_requirements": self.get_num_fulfilled_requirements(),
                "num_requirements": len(self.requirements),
                "requirements": [
                    json.loads(req.to_json()) for req in self.requirements
                ],
            }
        )


@dataclass
class DegreeRequirementsSolverOutput:
    can_graduate: bool
    requirements: list[DegreeRequirementOutput]


class DegreeRequirementsSolverException(Exception):
    """Exception raised for errors in the DegreeRequirementsSolver."""

    pass


class DegreeRequirementsSolver:
    def __init__(
        self,
        courses: list[str],
        requirements: DegreeRequirementsInput,
        bypasses: BypassInput,
    ) -> None:
        self.courses = set([Course.from_name(course) for course in courses])
        self.degree_requirements = self.load_requirements(requirements)
        self.solved_core: core.store.AssignmentStore | None = None
        self.bypasses = bypasses

    # TODO(NP-99): SolverInput should only be loaded once, then deepcopied.
    def load_core(self) -> core.solver.GraduationRequirementsSolver:
        filename = "./core/requirements/core.req"
        file = open(filename, "r")
        output = core.parser.Parser(file.read()).parse()
        solver_input = core.input.SolverInput(
            {
                r.name: r for r in output.requirements.values()
            },  # The parser output uses requirement keys as keys. The solver needs the key to be the name.
            output.requirement_groups,
        )
        file.close()

        return core.solver.GraduationRequirementsSolver(solver_input)

    # TODO(NP-99): Requirements should only be loaded once, then deepcopied.
    def load_requirements(
        self, degree_requirements_input: DegreeRequirementsInput
    ) -> list[DegreeRequirement]:
        degree_requirements = []

        # Logic for adding majors
        for input_req in degree_requirements_input.majors:
            # Get major data from json
            year = degree_requirements_input.year
            if input_req not in degree_plans[str(year)]:
                # Check if the years before this one have it
                y = year
                while str(y := y - 1) in degree_plans:
                    if input_req in degree_plans[str(y)]:
                        year = y
                        break
                if (
                    year != degree_requirements_input.year
                ):  # The using_year has been replaced to a working year
                    break
                # Check if the years after this one have it
                y = year
                while str(y := y + 1) in degree_plans:
                    if input_req in degree_plans[str(y)]:
                        year = y
                        break
                if (
                    year != degree_requirements_input.year
                ):  # The using_year has been replaced to a working year
                    break
                print("Error: degree plan not found!")
                return []
            requirements_data = degree_plans[str(year)][input_req]["requirements"][
                "major"
            ]

            major_req = DegreeRequirement(
                input_req,
                DegreeRequirementType.major,
                [],
                data["minimum_credit_hours"],
            )

            # Add requirements
            for req_data in requirements_data:
                major_req.requirements.append(LOADER.requirement_from_json(req_data))
            degree_requirements.append(major_req)
            # We don't need to check the other JSON files
            break

        # TODO: Logic for adding minors & other

        return degree_requirements

    def solve(self) -> DegreeRequirementsSolver:
        # Run for core
        core_solver = self.load_core()
        self.solved_core = core_solver.solve(list(self.courses), [])

        # Counter of the core courses and their used hours, so they won't be considered as free electives.
        used_core_courses: Counter[Course] = Counter()
        if self.solved_core is not None:
            for req_fill in self.solved_core.reqs_to_courses.values():
                used_core_courses.update(req_fill)

        # Run for major
        for degree_req in self.degree_requirements:
            for course in self.courses:
                for requirement in degree_req.requirements:
                    # Free elective requirements are special, since they can take left over hours from core courses.
                    if type(requirement) == FreeElectiveRequirement:
                        if requirement.attempt_fulfill(
                            course.name,
                            available_hours=(
                                int(course.hours) - used_core_courses[course]
                            ),
                        ):
                            break
                    elif requirement.attempt_fulfill(course.name):
                        break

            # Handle requirements bypasses for major
            if not degree_req.name in self.bypasses.major:
                continue
            major_bypasses = self.bypasses.major[degree_req.name]
            # Iterate through all of the requirements
            # Mark it as fulfilled if it's in the list
            for requirement in degree_req.requirements:
                for bypass_idx in major_bypasses:
                    requirement.override_fill(bypass_idx)

        return self

    def can_graduate(self) -> bool:
        # TODO: Maybe change logic in future
        # Run core on demand if needed

        if self.solved_core is None:
            raise DegreeRequirementsSolverException(
                "Core should always be solved before calling can_graduate()."
            )

        return (
            all(
                (
                    all(
                        [
                            requirement.is_fulfilled()
                            for requirement in degree_req.requirements
                        ]
                    )
                    for degree_req in self.degree_requirements
                )
            )
            and self.solved_core.can_graduate()
        )

    def to_json(cls) -> Json[Any]:
        if cls.solved_core is None:
            raise DegreeRequirementsSolverException(
                "Core should always be solved before calling to_json()."
            )

        degree_reqs = []
        # Add core first
        core_reqs = format_core_reqs(cls.solved_core.to_json())

        degree_reqs.append(
            json.loads(
                DegreeRequirement(
                    "Core Curriculum",
                    DegreeRequirementType.core,
                    core_reqs,
                    42,  # Core Curriculum takes 42 credit hours
                ).to_json()
            )
        )

        # Add majors
        for degree_req in cls.degree_requirements:
            degree_reqs.append(json.loads(degree_req.to_json()))

        degree_reqs_output = {
            "can_graduate": cls.can_graduate(),
            "requirements": degree_reqs,
        }

        return json.dumps(degree_reqs_output)

    def __str__(self) -> str:
        return "\n".join(str(req) for req in self.degree_requirements)


def format_core_reqs(
    reqs: dict[str, core.store.AssignmentStoreJSON]
) -> list[AbstractRequirement]:
    core_reqs = []
    for req_name, req_info in reqs.items():
        # Create set for all valid courses
        valid_courses = req_info["valid_courses"]

        # Create AndRequirement
        core_req: AbstractRequirement = HoursRequirement(
            req_info["hours"],
            [
                CourseRequirement(course, course in valid_courses.keys())
                for course in req_info["courses"]
            ],
            valid_courses,
            {"name": req_name, "id": req_name},
        )

        core_reqs.append(core_req)
    return core_reqs
