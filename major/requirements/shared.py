""" Definitions for shared requirements """

from __future__ import annotations
from .base import AbstractRequirement

from typing import TypedDict


class CourseRequirement(AbstractRequirement):
    """1 to 1 course requirement
    CS 1200 fills -> CS 1200 requirement
    """

    def __init__(self, course: str) -> None:
        self.course = course
        self.filled = False

    def attempt_fulfill(self, course: str) -> None:
        if course == self.course:
            self.filled = True

    def is_fulfilled(self) -> bool:
        return self.filled

    class JSON(TypedDict):
        course: str

    @classmethod
    def from_json(cls, json: JSON) -> CourseRequirement:
        return cls(json["course"])

    def __str__(self) -> str:
        return f"{self.course} - {self.is_fulfilled()}"


class AndRequirement(AbstractRequirement):
    """Requires all requirements to be fulfilled
    CS 1200 and HIST 1301 and CS 1337 -> must fulfill all courses
    """

    def __init__(self, requirements: list[AbstractRequirement]) -> None:
        self.requirements = set(requirements)

    def attempt_fulfill(self, course: str) -> None:
        for requirements in self.requirements:
            requirements.attempt_fulfill(course)

    def is_fulfilled(self) -> bool:
        return all(requirement.is_fulfilled() for requirement in self.requirements)

    class Req(TypedDict):
        matcher: str

    class JSON(TypedDict):
        requirements: list[AndRequirement.Req]

    @classmethod
    def from_json(cls, json: JSON) -> AbstractRequirement:
        from .map import REQUIREMENTS_MAP

        matchers: list[AbstractRequirement] = []
        for requirement_data in json["requirements"]:
            matcher = REQUIREMENTS_MAP[requirement_data["matcher"]].from_json(
                requirement_data
            )
            matchers.append(matcher)

        return cls(matchers)

    def __str__(self) -> str:
        return f"({' and '.join([str(req) for req in self.requirements])}) -> {self.is_fulfilled()}"


class OrRequirement(AbstractRequirement):
    """Requires one requirement to fulfilled
    CS 1200 fills -> HIST 1301 or CS 1200 requirement
    """

    def __init__(self, requirements: list[AbstractRequirement]) -> None:
        self.requirements = set(requirements)

    def attempt_fulfill(self, course: str) -> None:
        for requirements in self.requirements:
            requirements.attempt_fulfill(course)

    def is_fulfilled(self) -> bool:
        return any(requirement.is_fulfilled() for requirement in self.requirements)

    class Req(TypedDict):
        matcher: str

    class JSON(TypedDict):
        requirements: list[AndRequirement.Req]

    @classmethod
    def from_json(cls, json: JSON) -> AbstractRequirement:
        from .map import REQUIREMENTS_MAP

        matchers: list[AbstractRequirement] = []
        for requirement_data in json["requirements"]:
            matcher = REQUIREMENTS_MAP[requirement_data["matcher"]].from_json(
                requirement_data
            )
            matchers.append(matcher)

        return cls(matchers)

    def __str__(self) -> str:
        return f"({' or '.join([str(req) for req in self.requirements])}) -> {self.is_fulfilled()}"
