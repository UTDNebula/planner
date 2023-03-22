""" Definitions for shared requirements """

from __future__ import annotations
import json

from pydantic import Json
from .base import AbstractRequirement
import utils

from typing import Any, TypedDict
from major.requirements import AbstractRequirement, map
from functools import reduce

class CourseRequirement(AbstractRequirement):
    """1 to 1 course requirement
    CS 1200 fills -> CS 1200 requirement
    """

    def __init__(
        self, course: str, filled: bool = False, metadata: dict[str, Any] = {}
    ) -> None:
        self.course = course
        self.metadata = metadata
        self.filled = filled

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

    def override_fill(self, index: str) -> bool:
        if self.metadata["id"] == index:
            self.filled = True
            return True
        return False

    class JSON(TypedDict):
        course: str
        metadata: dict[str, Any]

    @classmethod
    def from_json(cls, json: JSON) -> CourseRequirement:
        return cls(json["course"], False, json["metadata"])

    def to_json(self) -> Json[Any]:
        return json.dumps(
            {
                "matcher": "Course",
                "metadata": self.metadata,
                "course": self.course,
                "filled": self.filled,
            }
        )

    def __str__(self) -> str:
        return f"""{self.course} - {self.is_fulfilled()}
                metadata: {self.metadata}"""


class AndRequirement(AbstractRequirement):
    """Requires all requirements to be fulfilled
    CS 1200 and HIST 1301 and CS 1337 -> must fulfill all courses
    """

    def __init__(
        self, requirements: list[AbstractRequirement], metadata: dict[str, Any] = {}
    ) -> None:
        self.requirements = requirements
        self.metadata = metadata
        self.override_filled = False

    def attempt_fulfill(self, course: str) -> bool:
        if self.is_fulfilled():
            return False

        for requirement in self.requirements:
            if requirement.attempt_fulfill(course):
                return True

        return False

    def is_fulfilled(self) -> bool:
        return self.override_filled or all(
            requirement.is_fulfilled() for requirement in self.requirements
        )

    def get_num_fulfilled_requirements(self) -> int:
        return sum([1 for req in self.requirements if req.is_fulfilled()])

    def override_fill(self, index: str) -> bool:
        if self.metadata["id"] == index:
            self.override_filled = True
            return True
        for requirement in self.requirements:
            if requirement.override_fill(index):
                return True
        return False

    class Req(TypedDict):
        matcher: str

    class JSON(TypedDict):
        requirements: list[AndRequirement.Req]
        metadata: dict[str, Any]

    @classmethod
    def from_json(cls, json: JSON) -> AndRequirement:
        from .map import REQUIREMENTS_MAP

        # Get all requirements that are inside AndRequirement
        requirements: list[AbstractRequirement] = []
        for requirement_data in json["requirements"]:
            requirement = REQUIREMENTS_MAP[requirement_data["matcher"]].from_json(
                requirement_data
            )
            requirements.append(requirement)

        return cls(requirements, json["metadata"])

    def to_json(self) -> Json[Any]:
        return json.dumps(
            {
                "matcher": "And",
                "metadata": self.metadata,
                "num_fulfilled_requirements": self.get_num_fulfilled_requirements(),
                "num_requirements": len(self.requirements),
                "filled": self.is_fulfilled(),
                "requirements": [
                    json.loads(req.to_json()) for req in self.requirements
                ],
            }
        )

    def __str__(self) -> str:
        return f"({' and '.join([str(req) for req in self.requirements])}) -> {self.is_fulfilled()}"


class OrRequirement(AbstractRequirement):
    """Requires one requirement to fulfilled
    CS 1200 fills -> HIST 1301 or CS 1200 requirement
    """

    def __init__(
        self, requirements: list[AbstractRequirement], metadata: dict[str, Any] = {}
    ) -> None:
        self.requirements = requirements
        self.metadata = metadata
        self.override_filled = False  # use this as override fill

    def attempt_fulfill(self, course: str) -> bool:
        if self.is_fulfilled():
            return False

        for requirement in self.requirements:
            if requirement.attempt_fulfill(course):
                return True

        return False

    def is_fulfilled(self) -> bool:
        return self.override_filled or any(
            requirement.is_fulfilled() for requirement in self.requirements
        )

    def override_fill(self, index: str) -> bool:
        if self.metadata["id"] == index:
            self.override_filled = True
            return True
        for requirement in self.requirements:
            if requirement.override_fill(index):
                return True
        return False

    class Req(TypedDict):
        matcher: str

    class JSON(TypedDict):
        requirements: list[OrRequirement.Req]
        metadata: dict[str, Any]

    @classmethod
    def from_json(cls, json: JSON) -> OrRequirement:
        from .map import REQUIREMENTS_MAP

        requirements: list[AbstractRequirement] = []
        for requirement_data in json["requirements"]:
            requirement = REQUIREMENTS_MAP[requirement_data["matcher"]].from_json(
                requirement_data
            )
            requirements.append(requirement)

        metadata = {}
        if "metadata" in json:
            metadata = json["metadata"]
        return cls(requirements, metadata)

    def to_json(self) -> Json[Any]:
        return json.dumps(
            {
                "matcher": "Or",
                "metadata": self.metadata,
                "filled": self.is_fulfilled(),
                "requirements": [
                    json.loads(req.to_json()) for req in self.requirements
                ],
            }
        )

    def __str__(self) -> str:
        return f"({' or '.join([str(req) for req in self.requirements])}) -> {self.is_fulfilled()}"


class SelectRequirement(AbstractRequirement):
    """Matches x requirements out of a list to be fulfilled

    Requires minimum of required_count # of requirements to be fulfilled

    Parameters
    __________
    required_count: int
        Minimum # of fulfillments before requirement is fulfilled
    """

    def __init__(
        self,
        required__count: int,
        requirements: list[AbstractRequirement],
        metadata: dict[str, Any] = {},
    ) -> None:
        self.required_count = required__count
        self.fulfilled_count = 0
        self.requirements = requirements
        self.metadata = metadata
        self.override_filled = False

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
        return self.override_filled or curr >= self.required_count

    def override_fill(self, index: str) -> bool:
        if self.metadata["id"] == index:
            self.override_filled = True
            return True
        for requirement in self.requirements:
            if requirement.override_fill(index):
                return True
        return False

    class Req(TypedDict):
        matcher: str

    class JSON(TypedDict):
        requirements: list[AndRequirement.Req]
        required_count: int

    @classmethod
    def from_json(cls, json: JSON) -> SelectRequirement:
        from .map import REQUIREMENTS_MAP

        requirements: list[AbstractRequirement] = []
        for requirement_data in json["requirements"]:
            requirement = REQUIREMENTS_MAP[requirement_data["matcher"]].from_json(
                requirement_data
            )
            requirements.append(requirement)

        return cls(json["required_count"], requirements)

    def to_json(self) -> Json[Any]:
        return json.dumps(
            {
                "matcher": "Select",
                "metadata": self.metadata,
                "fulfilled_count": self.fulfilled_count,
                "required_count": self.required_count,
                "filled": self.is_fulfilled(),
                "requirements": [
                    json.loads(req.to_json()) for req in self.requirements
                ],
            }
        )

    def __str__(self) -> str:
        s = f"""{SelectRequirement.__name__} - {self.is_fulfilled()}
        metadata: {self.metadata}
        status: {self.fulfilled_count}/{self.required_count} requirements
        requirements: {self.requirements}
        """
        return s


class HoursRequirement(AbstractRequirement):
    """Any requirement with minimum # hours

    Requires minimum of required_hours to be fulfilled

    Parameters
    __________
    required_hours: int
        Minimum # of hours before requirement is fulfilled

    """

    def __init__(
        self,
        required_hours: int,
        requirements: list[AbstractRequirement],
        valid_courses: dict[str, int] = {},
        metadata: dict[str, Any] = {},
    ) -> None:
        self.required_hours = required_hours
        self.requirements = requirements
        self.valid_courses: dict[
            str, int
        ] = valid_courses  # Stores map of course & # hours fulfilled (i.e. {"CS 1200": 2}). This is done due to course splitting (1 course can be used to satisfy multiple requirements)
        self.metadata: dict[str, Any] = metadata
        self.override_filled = False

    def attempt_fulfill(self, course: str) -> bool:
        if self.is_fulfilled():
            return False

        for requirement in self.requirements:
            if requirement.attempt_fulfill(course):
                course_hrs = utils.get_hours_from_course(course)
                self.valid_courses[course] = course_hrs

        return False

    def get_fulfilled_hours(self) -> int:
        return sum(self.valid_courses.values())

    def is_fulfilled(self) -> bool:
        return self.override_filled or self.get_fulfilled_hours() >= self.required_hours

    def override_fill(self, index: str) -> bool:
        if self.metadata["id"] == index:
            self.override_filled = True
            return True
        for requirement in self.requirements:
            if requirement.override_fill(index):
                return True
        return False

    class Req(TypedDict):
        matcher: str

    class JSON(TypedDict):
        required_hours: int
        requirements: list[HoursRequirement.Req]
        metadata: dict[str, Any]

    @classmethod
    def from_json(cls, json: JSON) -> HoursRequirement:
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

        requirements: list[AbstractRequirement] = []
        for requirement_data in json["requirements"]:
            requirement = REQUIREMENTS_MAP[requirement_data["matcher"]].from_json(
                requirement_data
            )
            requirements.append(requirement)

        # Check if there's any metadata
        metadata = json["metadata"] if "metadata" in json else {}

        return cls(json["required_hours"], requirements, {}, metadata)

    def to_json(self) -> Json[Any]:
        return json.dumps(
            {
                "matcher": "Hours",
                "metadata": self.metadata,
                "fulfilled_hours": self.get_fulfilled_hours(),
                "required_hours": self.required_hours,
                "filled": self.is_fulfilled(),
                "requirements": [
                    json.loads(req.to_json()) for req in self.requirements
                ],
                "valid_courses": self.valid_courses,
            }
        )

    def __str__(self) -> str:
        s = f"""{HoursRequirement.__name__} - {self.is_fulfilled()}
        status: {self.get_fulfilled_hours()}/{self.required_hours} hours
        valid_courses: {self.valid_courses}
        requirements: {self.requirements}
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

    def __init__(
        self,
        required_hours: int,
        excluded_courses: list[str],
        metadata: dict[str, str] = {},
    ) -> None:
        self.required_hours = required_hours
        self.excluded_courses = set(excluded_courses)
        self.fulfilled_hours = 0
        self.valid_courses: dict[str, int] = {}
        self.metadata = metadata
        self.override_filled = False

    def attempt_fulfill(self, course: str) -> bool:
        if self.is_fulfilled():
            return False

        if not course in self.excluded_courses:
            course_hrs = utils.get_hours_from_course(course)
            self.fulfilled_hours += course_hrs
            self.valid_courses[course] = course_hrs
            return True

        return False

    def is_fulfilled(self) -> bool:
        return self.override_filled or self.fulfilled_hours >= self.required_hours

    def override_fill(self, index: str) -> bool:
        if self.metadata["id"] == index:
            self.override_filled = True
            return True
        return False

    class JSON(TypedDict):
        excluded_courses: list[str]
        required_hours: int
        metadata: dict[str, Any]

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

        return cls(json["required_hours"], json["excluded_courses"], json["metadata"])

    def to_json(self) -> Json[Any]:
        return json.dumps(
            {
                "matcher": "FreeElectives",
                "metadata": self.metadata,
                "fulfilled_hours": self.fulfilled_hours,
                "required_hours": self.required_hours,
                "filled": self.is_fulfilled(),
                "excluded_courses": list(self.excluded_courses),
                "valid_courses": self.valid_courses,
            }
        )

    def __str__(self) -> str:
        s = f"""{FreeElectiveRequirement.__name__} - {self.is_fulfilled()}
        status: {self.fulfilled_hours}/{self.required_hours} hours
        metadata: {self.metadata}
        excluded_courses: {", ".join(self.excluded_courses)}
        valid_courses: {self.valid_courses} 
        """
        return s


class PrefixBucketRequirement(AbstractRequirement):
    """Matches course requirement if it starts with a certain prefix

    i.e. PrefixRequirement("CS") will match any course that begins with "CS"

    NOTE: This requirement is generally used with HoursRequirement, as it allows
    an infinite number of courses to satisfy it

    NOTE: No metadata here

    Parameters
    __________
    prefix: str
        Course name prefix
    """

    def __init__(self, prefix: str) -> None:
        self.prefix = prefix
        self.filled = False
        self.valid_courses: dict[str, int] = {}

    # NOTE: This allows courses to satisfy the requirement even after it's filled,
    # as it doesn't check for whether or not the requirement has been filled
    def attempt_fulfill(self, course: str) -> bool:
        if course.startswith(self.prefix):
            self.filled = True
            self.valid_courses[course] = utils.get_hours_from_course(course)
            return True

        return False

    def is_fulfilled(self) -> bool:
        return self.filled

    def override_fill(self, index: str) -> bool:
        return False

    class JSON(TypedDict):
        prefix: str

    @classmethod
    def from_json(cls, json: JSON) -> PrefixBucketRequirement:
        return cls(json["prefix"])

    def to_json(self) -> Json[Any]:
        return json.dumps(
            {
                "matcher": "Prefix",
                "prefix": self.prefix,
                "filled": self.is_fulfilled(),
                "valid_courses": self.valid_courses,
            }
        )

    def __str__(self) -> str:
        return f"""{PrefixBucketRequirement.__name__} - {self.filled}
        prefix: {self.prefix}
        valid_courses: {self.valid_courses}
        """

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
                    self.valid_courses.append(course)

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
            also_fulfills.append(
                map.REQUIREMENTS_MAP[requirement["matcher"]].from_json(requirement)
            )

        return cls(
            json["required_count"], json["starts_with"], also_fulfills, json["metadata"]
        )

    def to_json(self) -> Json[Any]:
        return json.dumps(
            {
                "matcher": "Guided Electives",
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
