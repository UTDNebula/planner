""" Definitions for shared requirements """

from __future__ import annotations
from .base import AbstractRequirement
import utils

from typing import TypedDict


class CourseRequirement(AbstractRequirement):
    """1 to 1 course requirement
    CS 1200 fills -> CS 1200 requirement
    """

    def __init__(self, course: str) -> None:
        self.course = course
        self.filled = False

    def attempt_fulfill(self, course: str) -> bool:
        # fail duplicate attempt to fulfill
        if self.is_fulfilled():
            return False

        if course == self.course:
            self.filled = True
            return True

        return False

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

    def attempt_fulfill(self, course: str) -> bool:
        if self.is_fulfilled():
            return False

        filled_one = False
        for requirement in self.requirements:
            filled_one = filled_one or requirement.attempt_fulfill(course)

        return filled_one

    def is_fulfilled(self) -> bool:
        return all(requirement.is_fulfilled() for requirement in self.requirements)

    class Req(TypedDict):
        matcher: str

    class JSON(TypedDict):
        requirements: list[AndRequirement.Req]

    @classmethod
    def from_json(cls, json: JSON) -> AndRequirement:
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

    def attempt_fulfill(self, course: str) -> bool:
        if self.is_fulfilled():
            return False

        filled_one = False
        for requirement in self.requirements:
            filled_one = filled_one or requirement.attempt_fulfill(course)

        return filled_one

    def is_fulfilled(self) -> bool:
        return any(requirement.is_fulfilled() for requirement in self.requirements)

    class Req(TypedDict):
        matcher: str

    class JSON(TypedDict):
        requirements: list[OrRequirement.Req]

    @classmethod
    def from_json(cls, json: JSON) -> OrRequirement:
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


class HoursRequirement(AbstractRequirement):
    """Any requirement with minimum # hours

    Requires minimum of required_hours to be fulfilled

    Parameters
    __________
    required_hours: int
        Minimum # of hours before requirement is fulfilled

    """

    def __init__(
        self, required_hours: int, requirements: list[AbstractRequirement]
    ) -> None:
        self.required_hours = required_hours
        self.fulfilled_hours = 0
        self.requirements = set(requirements)
        print(self.requirements)

    def attempt_fulfill(self, course: str) -> bool:
        if self.is_fulfilled():
            return False

        for requirement in self.requirements:
            if requirement.attempt_fulfill(course):
                self.fulfilled_hours += utils.get_hours_from_course(course)
                return True

        return False

    def is_fulfilled(self) -> bool:
        return self.fulfilled_hours >= self.required_hours

    class Req(TypedDict):
        matcher: str

    class JSON(TypedDict):
        required_hours: int
        requirements: list[HoursRequirement.Req]

    @classmethod
    def from_json(cls, json: JSON) -> AbstractRequirement:
        """
        {
            "required_hours": 10,
            "requirements": [
              {
                        "matcher": "CourseRequirement",
                        "course": "ACCT 4V80"
                      },
                      {
                        "matcher": "CourseRequirement",
                        "course": "BA 4090"
                      }
            ]
        """

        from .map import REQUIREMENTS_MAP

        matchers: list[AbstractRequirement] = []
        for requirement_data in json["requirements"]:
            matcher = REQUIREMENTS_MAP[requirement_data["matcher"]].from_json(
                requirement_data
            )
            matchers.append(matcher)

        return cls(json["required_hours"], matchers)

    def __str__(self) -> str:
        s = f"""{HoursRequirement.__name__} 
        required_hours: {self.required_hours}
        fulfilled_hours: {self.fulfilled_hours}
        """
        return s


class FreeElectiveRequirement(AbstractRequirement):
    """Defines Major Free Electives

    Requires minimum of required_hours to be fulfilled

    Parameters
    __________
    required_hours: int
        Minimum # of hours before requirement is fulfilled

    excluded_courses: list[str]
        Courses that cannot fulfill this requirement
    """

    def __init__(self, required_hours: int, excluded_courses: list[str]) -> None:
        self.required_hours = required_hours
        self.excluded_courses = set(excluded_courses)
        self.fulfilled_hours = 0

    def attempt_fulfill(self, course: str) -> bool:
        if self.is_fulfilled():
            return False

        if not course in self.excluded_courses:
            self.fulfilled_hours += utils.get_hours_from_course(course)
            return True

        return False

    def is_fulfilled(self) -> bool:
        return self.fulfilled_hours >= self.required_hours

    class JSON(TypedDict):
        excluded_courses: list[str]
        required_hours: int

    @classmethod
    def from_json(cls, json: JSON) -> FreeElectiveRequirement:
        """
        {
            "required_hours": 10,
            "excluded_courses": [
                "CS 1200",
                "ECS 1100"
            ]
        """

        return cls(json["required_hours"], json["excluded_courses"])

    def __str__(self) -> str:
        s = f"""{FreeElectiveRequirement.__name__} 
        required_hours: {self.required_hours}
        excluded_courses: {", ".join(self.excluded_courses)}
        fulfilled_hours: {self.fulfilled_hours}
        """
        return s


class SelectRequirement(AbstractRequirement):
    """Matches x requirements out of a list to be fulfilled

    Requires minimum of required_count # of requirements to be fulfilled

    Parameters
    __________
    required_count: int
        Minimum # of fulfillments before requirement is fulfilled
    """

    def __init__(
        self, required_count: int, requirements: list[AbstractRequirement]
    ) -> None:
        self.required_count = required_count
        self.fulfilled_count = 0
        self.requirements = set(requirements)

    def attempt_fulfill(self, course: str) -> bool:
        if self.is_fulfilled():
            return False

        for requirements in self.requirements:
            if requirements.attempt_fulfill(course):
                self.fulfilled_count += 1
                return True

        return False

    def is_fulfilled(self) -> bool:
        curr = 0

        for requirement in self.requirements:
            if requirement.is_fulfilled():
                curr += 1
        return curr >= self.required_count

    class Req(TypedDict):
        matcher: str

    class JSON(TypedDict):
        requirements: list[AndRequirement.Req]
        required_course_count: int

    @classmethod
    def from_json(cls, json: JSON) -> AbstractRequirement:
        from .map import REQUIREMENTS_MAP

        matchers: list[AbstractRequirement] = []
        for requirement_data in json["requirements"]:
            matcher = REQUIREMENTS_MAP[requirement_data["matcher"]].from_json(
                requirement_data
            )
            matchers.append(matcher)

        return cls(json["required_course_count"], matchers)

    def __str__(self) -> str:
        return f"({' or '.join([str(req) for req in self.requirements])}) -> {self.is_fulfilled()}"


class PrefixRequirement(AbstractRequirement):
    """Matches course requirement if it starts with a certain prefix

    i.e. PrefixRequirement("CS") will match any course that begins with "CS"

    Parameters
    __________
    prefix: str
        Course name prefix
    """

    def __init__(self, prefix: str) -> None:
        self.prefix = prefix
        self.filled = False

    def attempt_fulfill(self, course: str) -> bool:
        # fail duplicate attempt to fulfill
        if self.is_fulfilled():
            return False

        if course.startswith(self.prefix):
            self.filled = True
            return True

        return False

    def is_fulfilled(self) -> bool:
        return self.filled

    class JSON(TypedDict):
        prefix: str

    @classmethod
    def from_json(cls, json: JSON) -> PrefixRequirement:
        return cls(json["prefix"])

    def __str__(self) -> str:
        return f"{self.prefix} - {self.is_fulfilled()}"


class PrefixBucketRequirement(PrefixRequirement):
    def attempt_fulfill(self, course: str) -> bool:
        if course.startswith(self.prefix):
            self.filled = True
            return True

        return False
