from pydantic import Json
from typing import Any, TypedDict
from major.requirements import base
import utils
import json


class PsychologyPrefixesOrCourses(base.AbstractRequirement):
    required_hours: int = 0
    fulfilled_hours: int = 0
    accepted_prefixes: list[str] = []
    accepted_courses: list[str] = []
    metadata: dict[str, Any] = {}

    def __init__(
        self,
        required_hours: int,
        accepted_prefixes: list[str],
        accepted_courses: list[str],
        metadata: dict[str, Any] = {},
    ) -> None:
        self.required_hours = required_hours
        self.accepted_prefixes = accepted_prefixes
        self.accepted_courses = accepted_courses
        self.metadata = metadata

    def attempt_fulfill(self, course: str, _: int = 0) -> bool:
        if self.is_fulfilled():
            return False

        hours = utils.get_hours_from_course(course)
        if course in self.accepted_courses:
            self.fulfilled_hours += hours
            return True

        for prefix in self.accepted_prefixes:
            if course.startswith(prefix):
                self.fulfilled_hours += hours
                return True

        return False

    def is_fulfilled(self) -> bool:
        return self.fulfilled_hours >= self.required_hours

    def override_fill(self, index: str) -> bool:
        if self.metadata["id"] != index:
            return False

        self.fulfilled_hours = self.required_hours
        return True

    def to_json(self) -> Json[Any]:
        return json.dumps(
            {
                "matcher": "PsychologyPrefixOrCourses",
                "metadata": self.metadata,
                "accepted_courses": self.accepted_courses,
                "accepted_prefixes": self.accepted_prefixes,
                "filled": self.is_fulfilled(),
            }
        )

    class JSON(TypedDict):
        required_hours: int
        accepted_courses: list[str]
        accepted_prefixes: list[str]

    @classmethod
    def from_json(cls, json: JSON) -> base.AbstractRequirement:
        """
        {
            "required_hours": 10,
            "accepted_courses": ["HIST 1301", "HIST 1303"],
            "accepted_prefixes": ["HIST", "CS"],
        """
        return PsychologyPrefixesOrCourses(
            required_hours=json["required_hours"],
            accepted_courses=json["accepted_courses"],
            accepted_prefixes=json["accepted_prefixes"],
        )
