from __future__ import annotations
import json

from pydantic import Json
from major.requirements import AbstractRequirement

from functools import reduce
from typing import Any, TypedDict

import utils
from major.requirements import loader


class MajorGuidedElectiveRequirement(AbstractRequirement):
    """Matches CS Major Guided Electives

    Requires minimum of required_count # of requirements to be fulfilled

    Is aware of duplicate also_fulfills requirements but not starts_with
    So if you pass CS 4312 twice and the starts_with = 'CS 43', the requirement will count both

    Parameters
    __________
    required_count: int
        Minimum # of fulfillments before requirement is fulfilled

    starts_with: str
        String that a course can start with to be fulfilled

    also_fulfills: list[AbstractRequirement]
        Requirements that can also be fulfilled in addition to a course that starts_width
    """

    def __init__(
        self,
        required_count: int,
        starts_with: str,
        also_fulfills: list[AbstractRequirement],
        metadata: dict[str, Any] = {},
    ) -> None:
        self.required_count = required_count
        self.starts_with = starts_with
        self.also_fulfills = also_fulfills
        self.fulfilled_count = 0
        self.valid_courses: dict[str, int] = {}
        self.metadata = metadata
        self.override_filled = False

    def attempt_fulfill(self, course: str) -> bool:
        if self.is_fulfilled():
            return False

        if course.startswith(self.starts_with):
            self.fulfilled_count += 1
            self.valid_courses[course] = utils.get_hours_from_course(course)
            return True
        else:
            for requirement in self.also_fulfills:
                if requirement.attempt_fulfill(course):
                    return True

            return False

    def __true_fulfilled_total(self) -> int:
        # real_count is fulfilled_count + # of courses that fulfilled self.also_match requirements
        return self.fulfilled_count + reduce(
            lambda total, req: total + 1 if req.is_fulfilled() else total,
            self.also_fulfills,
            0,
        )

    def is_fulfilled(self) -> bool:
        return (
            self.override_filled or self.__true_fulfilled_total() >= self.required_count
        )

    def override_fill(self, index: str) -> bool:
        if self.metadata["id"] == index:
            self.override_filled = True
            return True
        for requirement in self.also_fulfills:
            if requirement.override_fill(index):
                return True
        return False

    class JSONReq(TypedDict):
        matcher: str

    class JSON(TypedDict):
        required_count: int
        starts_with: str
        also_fulfills: list[MajorGuidedElectiveRequirement.JSONReq]
        metadata: dict[str, Any]

    @classmethod
    def from_json(cls, json: JSON) -> MajorGuidedElectiveRequirement:
        """
        {
            "required_count": 3,
            "starts_with": "CS 43",
            "also_fulfills": [
                {
                    "matcher": "CourseRequirement",
                    "course": "EE 4325"
                },
                {
                    "matcher": "CourseRequirement",
                    "course": "SE 4351"
                }
            ]
        """

        also_fulfills: list[AbstractRequirement] = []
        for requirement in json["also_fulfills"]:
            also_fulfills.append(loader.Loader().requirement_from_json(requirement))

        return cls(
            json["required_count"], json["starts_with"], also_fulfills, json["metadata"]
        )

    def to_json(self) -> Json[Any]:
        return json.dumps(
            {
                "matcher": "CS Guided Electives",
                "metadata": self.metadata,
                "starts_with": self.starts_with,
                "also_fulfills": [
                    json.loads(req.to_json()) for req in self.also_fulfills
                ],
                "fulfilled_count": self.fulfilled_count,
                "required_count": self.required_count,
                "valid_courses": self.valid_courses,
            }
        )

    def __str__(self) -> str:
        s = f"""{MajorGuidedElectiveRequirement.__name__} 
        required_count: {self.required_count}
        starts_with: '{self.starts_with}' or
        is one of the following: ({[str(req) for req in self.also_fulfills]})
        fulfilled_count: {self.__true_fulfilled_total()}
        """
        return s
