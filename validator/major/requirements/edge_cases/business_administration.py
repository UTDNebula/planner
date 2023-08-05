from __future__ import annotations
import json

from pydantic import Json
from major.requirements import AbstractRequirement, map

from functools import reduce
from typing import Any, TypedDict
from major.requirements.shared import OrRequirement

import utils

"""
Note: assuming BA 4V90 & BA 4090 cover one of the groups
"""


class SomeRequirement(OrRequirement):
    """Requires one requirement to fulfilled
    CS 1200 fills -> HIST 1301 or CS 1200 requirement
    NOTE: Allows attempt_filled to work even if is_fulfilled() is true
    """

    def attempt_fulfill(self, course: str) -> bool:
        for requirement in self.requirements:
            if requirement.attempt_fulfill(course):
                return True

        return False


class BusinessAdministrationElectiveRequirement(AbstractRequirement):
    """Matches Business Administration Electives

    Requires minimum of required_count # of requirements to be fulfilled

    Requires upper division courses only

    Requires courses from at least x different groups where each group is unique department

    Parameters
    __________
    required_count: int
        Minimum # of groups needed to fulfill requirement

    required_hours: int
        Minimum # of credit hours needed to fulfill requirement

    prefix_groups: list[list[str]]
        Groups of department prefixes
    """

    def __init__(
        self,
        required_count: int,
        required_hours: int,
        prefix_groups: list[AbstractRequirement],
        metadata: dict[str, Any] = {},
    ) -> None:
        self.prefix_groups = prefix_groups
        self.required_count = required_count
        self.fulfilled_count = 0
        self.required_hours = required_hours
        self.fulfilled_hours = 0
        self.valid_courses: dict[str, int] = {}
        self.metadata = metadata
        self.override_filled = False

    def attempt_fulfill(self, course: str) -> bool:
        if self.is_fulfilled():
            return False

        # First check if upper level elective
        if utils.get_level_from_course(course) < 3:
            return False

        # Now check if course satisfies a group
        for group in self.prefix_groups:
            if group.attempt_fulfill(course):
                course_hrs = utils.get_hours_from_course(course)
                self.fulfilled_hours += course_hrs
                self.fulfilled_count = self.get_fulfilled_count()
                self.valid_courses[course] = course_hrs
                return True

        return False

    def get_fulfilled_count(self) -> int:
        count = 0

        for group in self.prefix_groups:
            if group.is_fulfilled():
                count += 1
        return count

    def is_fulfilled(self) -> bool:
        return self.override_filled or (
            self.get_fulfilled_count() >= self.required_count
            and self.fulfilled_hours >= self.required_hours
        )

    def override_fill(self, index: str) -> bool:
        if self.metadata["id"] == index:
            self.override_filled = True
            return True
        return False

    class JSON(TypedDict):
        required_count: int
        required_hours: int
        prefix_groups: list[OrRequirement.Req]
        metadata: dict[str, Any]

    @classmethod
    def from_json(cls, json: JSON) -> BusinessAdministrationElectiveRequirement:
        """
        {
            "matcher": "BAGuidedElectiveRequirement",
            "required_count": 3,
            "required_hours": 15,
            "prefix_groups": [
            {
                "matcher": "SomeRequirement",
                "requirements": [
                {
                    "matcher": "PrefixBucketRequirement",
                    "prefix": "MKT"
                }
                ]
            },
            {
                "matcher": "SomeRequirement",
                "requirements": [
                {
                    "matcher": "PrefixBucketRequirement",
                    "prefix": "ACCT"
                },
                {
                    "matcher": "PrefixBucketRequirement",
                    "prefix": "ENGY"
                }
                ]
            }]
        }
        """

        requirements: list[AbstractRequirement] = []
        for requirement_data in json["prefix_groups"]:
            requirement = map.REQUIREMENTS_MAP[requirement_data["matcher"]].from_json(
                requirement_data
            )
            requirements.append(requirement)

        return cls(
            json["required_count"],
            json["required_hours"],
            requirements,
            json["metadata"],
        )

    def to_json(self) -> Json[Any]:
        return json.dumps(
            {
                "matcher": "BA General Business Electives",
                "fulfilled_count": self.fulfilled_count,
                "fulfilled_hours": self.fulfilled_hours,
                "required_count": self.required_count,
                "required_hours": self.required_hours,
                "prefix_groups": [
                    json.loads(req.to_json()) for req in self.prefix_groups
                ],
                "valid_courses": self.valid_courses,
            }
        )

    def __str__(self) -> str:
        s = f"""{BusinessAdministrationElectiveRequirement.__name__} 
        required_count: {self.required_count}
        required_hours: {self.required_hours}
        fulfilled_count: {self.fulfilled_count}
        fulfilled_hours: {self.fulfilled_hours}
        _______________
        Required fulfilled: {self.is_fulfilled()}
        """
        return s