from __future__ import annotations
from collections import defaultdict
from enum import Enum
import json
from core.solver import AssignmentStore, GraduationRequirementsSolver
from major.requirements import AbstractRequirement
from dataclasses import dataclass

from major.requirements.map import REQUIREMENTS_MAP

"""
TODO: 
"""


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
            core_solver = self.load_core()  # type: ignore
            self.solved_core = core_solver.solve(
                [course for course in self.courses], []
            )  # Convert to list
        
            print(self.solved_core)
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

        return all(
            (
            all([requirement.is_fulfilled() for requirement in degree_req.requirements])
            for degree_req in self.degree_requirements)
        ) and self.solved_core.can_graduate()

    # def to_json(self) -> DegreeRequirementOutput:
    #     return {
    #         req.name: {
    #             "courses": list_matcher_requirements(req.course_matcher),
    #             "hours": req.hours,
    #             "isfilled": self._get_req_hours_filled(req) >= req.hours,
    #             "validCourses": [c.name for c in req_fills.keys()],
    #         }
    #         for req, req_fills in self.requirements
    #     }

    def __str__(self) -> str:
        return "\n".join(str(req) for req in self.requirements)


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
    # courses: list[str] # Change to be more complex output later?
    # filter: list[str]
