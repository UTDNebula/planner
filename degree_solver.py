from __future__ import annotations
from collections import defaultdict
from enum import Enum
import json
from pydantic import Json

from pyparsing import Any
from core.solver import AssignmentStore, GraduationRequirementsSolver
from major.requirements import AbstractRequirement
from dataclasses import dataclass

from major.requirements.map import REQUIREMENTS_MAP
import json

from major.requirements.shared import (
    CourseRequirement,
    HoursRequirement,
)


@dataclass
class Bypass:
    name: str
    requirement: str
    hours: int


@dataclass
class DegreeRequirementsInput:
    core: bool
    majors: list[str]  # TODO: Change to Enum in the future
    minors: list[str]  # TODO: Change to Enum in the future
    other: list[str]  # TODO: Change to Enum in the future


class DegreeRequirementType(Enum):
    core = "core"
    major = "major"
    minor = "minor"
    other = "other"


@dataclass
class DegreeRequirement:
    name: str
    type: DegreeRequirementType
    requirements: list[AbstractRequirement]

    def get_num_fulfilled_requirements(self) -> int:
        return sum([1 for req in self.requirements if req.is_fulfilled()])

    def to_json(self) -> Json:
        return json.dumps(
            {
                "name": self.name,
                "type": self.type.value,
                "num_fulfilled_requirements": self.get_num_fulfilled_requirements(),
                "num_requirements": len(self.requirements),
                "requirements": [
                    json.loads(req.to_json()) for req in self.requirements
                ],
            }
        )


@dataclass
class DegreeRequirementsOutput:
    can_graduate: bool
    requirements: list[DegreeRequirementOutput]


@dataclass
class DegreeRequirementOutput:
    name: str
    type: str
    requirements: list[RequirementOutput]


@dataclass
class RequirementOutput:
    requirement_name: str
    is_fulfilled: bool
    valid_courses: list[str]
    bypasses: list[Bypass]


class DegreeRequirementsSolver:
    def __init__(
        self,
        courses: list[str],
        requirements: DegreeRequirementsInput,
        bypasses: list[Bypass],
    ) -> None:
        self.courses = set(courses)
        self.degree_requirements = self.load_requirements(requirements)
        self.validate_core = requirements.core
        self.bypasses = bypasses
        self.solved_core = AssignmentStore()

    def load_core(self) -> GraduationRequirementsSolver:
        core_solver = GraduationRequirementsSolver()
        filename = "./core/requirements/core.req"
        core_solver.load_requirements_from_file(filename)
        return core_solver

    def load_requirements(
        self, degree_requirements_input: DegreeRequirementsInput
    ) -> list[DegreeRequirement]:
        degree_requirements = []

        # Logic for adding majors
        for input_req in degree_requirements_input.majors:
            major_req = DegreeRequirement(input_req, DegreeRequirementType.major, [])

            # Get major data from json
            data = json.loads(open(f"degree_data/{input_req}.json", "r").read())
            requirements_data = data["requirements"]["major"]

            # Add requirements
            for req_data in requirements_data:
                major_req.requirements.append(
                    REQUIREMENTS_MAP[req_data["matcher"]].from_json(req_data)
                )
            degree_requirements.append(major_req)

        # TODO: Logic for adding minors & other

        return degree_requirements

    def solve(self) -> DegreeRequirementsSolver:
        # Run for major
        if self.validate_core:
            core_solver = self.load_core()
            self.solved_core = core_solver.solve(
                [course for course in self.courses], []
            )  # Convert to list
        # Run for major
        for degree_req in self.degree_requirements:
            for course in self.courses:
                for requirement in degree_req.requirements:
                    fulfilled = requirement.attempt_fulfill(course)
                    if fulfilled:
                        break

        return self

    def can_graduate(self) -> bool:

        # TODO: Maybe change logic in future
        # Run core on demand if needed

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

    def to_json(cls) -> Json:
        degree_reqs = []
        # Add core first
        core_reqs = format_core_reqs(cls.solved_core.to_json())

        degree_reqs.append(
            json.loads(
                DegreeRequirement(
                    "Core Curriculum", DegreeRequirementType.core, core_reqs
                ).to_json()
            )
        )

        # Add majors
        for degree_req in cls.degree_requirements:
            degree_reqs.append(json.loads(degree_req.to_json()))

        degree_reqs_output: DegreeRequirementsOutput = DegreeRequirementsOutput(
            cls.can_graduate(),
            degree_reqs,
        )
        return json.dumps(degree_reqs_output)

    def __str__(self) -> str:
        return "\n".join(str(req) for req in self.degree_requirements)


def format_core_reqs(reqs: dict[str, dict[str, Any]]) -> list[AbstractRequirement]:
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
            {"name": req_name},
        )

        core_reqs.append(core_req)
    return core_reqs
