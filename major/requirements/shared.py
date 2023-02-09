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
