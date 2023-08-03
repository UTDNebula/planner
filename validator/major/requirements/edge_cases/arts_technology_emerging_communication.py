import json
from typing import Any, TypedDict

from pydantic import Json
from major.requirements.base import AbstractRequirement
from major.requirements.shared import MultiGroupElectiveRequirement
import utils


class ATECPrescribedElectiveRequirement(MultiGroupElectiveRequirement):
    """
    Similar to a MultiGroupElectiveRequirement, but additionally requires X number of courses to be 4000 level courses before the requirement is fulfilled.

    Parameters
    __________
    requirement_count: int
        Minimum # of requirements that must be fulfilled before the parent requirement is fulfilled

    requirements: list[AbstractRequirement]
        List of child requirements

    minimum_hours_in_area: int
        Minimum # of credit hours that must be fulfilled in an area before the parent requirement is fulfilled. If set to 0, then no minimum is required. Defaults to 0.

    required_4000_level_courses: int
        Minimum # of 4000 level courses that must be fulfilled before the parent requirement is fulfilled. If set to 0, then no minimum is required. Defaults to 0.
    """

    class JSON(MultiGroupElectiveRequirement.JSON):
        required_4000_level_courses: int

    def __init__(
        self,
        requirements: list[AbstractRequirement],
        requirement_count: int,
        minimum_hours_in_area: int = 0,
        required_4000_level_courses: int = 0,
        metadata: dict[str, Any] = {},
    ) -> None:
        super().__init__(
            requirements, requirement_count, minimum_hours_in_area, metadata
        )
        self.required_4000_level_courses = required_4000_level_courses
        self.fulfilled_4000_level_courses = 0

    @classmethod
    def from_json(cls, json: JSON) -> MultiGroupElectiveRequirement:  # type: ignore[override]
        from ..map import REQUIREMENTS_MAP

        requirements: list[AbstractRequirement] = []
        for requirement_data in json["requirements"]:
            requirement = REQUIREMENTS_MAP[requirement_data["matcher"]].from_json(
                requirement_data
            )
            requirements.append(requirement)

        return cls(
            requirements,
            json["requirement_count"],
            json["minimum_hours_in_area"],
            json["required_4000_level_courses"],
            json["metadata"],
        )

    def is_fulfilled(self) -> bool:
        return (
            self.fulfilled_4000_level_courses >= self.required_4000_level_courses
            and super().is_fulfilled()
        )

    def to_json(self) -> Json[Any]:
        return json.dumps(
            {
                "matcher": "ATECPrescribedElectiveRequirement",
                "requirement_count": self.requirement_count,
                "requirements": [req.to_json() for req in self.requirements],
                "minimum_hours_in_area": self.minimum_hours_in_area,
                "metadata": self.metadata,
                "req_hrs": self.req_hrs,
                "filled": self.is_fulfilled(),
                "num_fulfilled_requirements": self.get_num_fulfilled_requirements(),
                "requirements": [
                    json.loads(req.to_json()) for req in self.requirements
                ],
                "required_4000_level_courses": self.required_4000_level_courses,
                "fulfilled_4000_level_courses": self.fulfilled_4000_level_courses,
            }
        )

    def attempt_fulfill(self, course: str) -> bool:
        fulfilled = super().attempt_fulfill(course)
        if fulfilled:
            if utils.get_level_from_course(course) == 4:
                self.fulfilled_4000_level_courses += 1
        return fulfilled

    def __str__(self) -> str:
        return (
            f"{ATECPrescribedElectiveRequirement.__name__} - {self.is_fulfilled()}\n"
            + "".join(super().__str__().splitlines(True)[1:])
            + f"{self.fulfilled_4000_level_courses}/{self.required_4000_level_courses} 4000 level courses complete"
        )
