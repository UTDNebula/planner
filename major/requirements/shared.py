""" Definitions for shared requirements """

from __future__ import annotations
import json

from pydantic import Json
from .base import AbstractRequirement
import utils

from typing import Any, TypedDict


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


class OtherRequirement(AbstractRequirement):
    """Requirement which cannot be fulfilled automatically and is intended for users to manually verify and bypass if filled.

    Parameters
    __________
    description: str
        A description of the requirement to be shown to the user

    """
    def __init__(
        self,
        description: str,
        metadata: dict[str, str] = {},
    ) -> None:
        self.metadata = metadata
        self.override_filled = False
        self.description = description

    def is_fulfilled(self) -> bool:
        return self.override_filled
    
    def attempt_fulfill(self, course: str) -> bool:
        return False

    def override_fill(self, index: str) -> bool:
        if self.metadata["id"] == index:
            self.override_filled = True
            return True
        return False
    
    class JSON(TypedDict):
        description: str
        metadata: dict[str, Any]

    @classmethod
    def from_json(cls, json: JSON) -> OtherRequirement:
        """
        {
            "description": "Select any 3 semester credit hours from any 4000 level ARTS studio course"
        }
        """

        return cls(json["description"], json["metadata"])

    def to_json(self) -> Json[Any]:
        return json.dumps(
            {
                "matcher": "Other",
                "metadata": self.metadata,
                "filled": self.is_fulfilled()
            }
        )

    def __str__(self) -> str:
        s = f"""{OtherRequirement.__name__} - {self.is_fulfilled()}
        metadata: {self.metadata}
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


class MultiGroupElectiveRequirement(AbstractRequirement):
    """
    Similar to an SelectRequirement, but requires at least 1 requirement to meet or exceed the minimum count of hours.

    Parameters
    __________
    requirement_count: int
        Minimum # of requirements that must be fulfilled before the parent requirement is fulfilled

    requirements: list[AbstractRequirement]
        List of child requirements
    
    minimum_hours_in_area: int
        Minimum # of credit hours that must be fulfilled in an area before the parent requirement is fulfilled. If None, then no minimum is required. Defaults to 1.

    """
    class Req(TypedDict):
        matcher: str

    class JSON(TypedDict):
        requirement_count: int
        requirements: list[MultiGroupElectiveRequirement.Req]
        minimum_hours_in_area: int
        metadata: dict[str, Any]
    
    def __init__(
        self, requirements: list[AbstractRequirement], requirement_count: int, minimum_hours_in_area: int = 1, metadata: dict[str, Any] = {}
    ) -> None:
        self.requirements = requirements
        self.requirement_count = requirement_count
        self.minimum_hours_in_area = minimum_hours_in_area
        self.metadata = metadata
        self.req_hrs: dict[str, int] = {}
        self.override_filled = False

    @classmethod
    def from_json(cls, json: JSON) -> MultiGroupElectiveRequirement:
        from .map import REQUIREMENTS_MAP
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
            json["metadata"],
        )
    
    def is_fulfilled(self) -> bool:
        if self.override_filled:
            return True
        return (
            self.get_num_fulfilled_requirements() >= self.requirement_count
            and max(self.req_hrs.values()) >= self.minimum_hours_in_area
        )
    
    def to_json(self) -> Json[Any]:
        return json.dumps({
            "matcher": "MultiGroupElectiveRequirement",
            "requirement_count": self.requirement_count,
            "requirements": [req.to_json() for req in self.requirements],
            "minimum_hours_in_area": self.minimum_hours_in_area,
            "metadata": self.metadata,
        })

    def attempt_fulfill(self, course: str) -> bool:
        if self.is_fulfilled():
            return False

        for requirement in self.requirements:
            fulfilled = requirement.attempt_fulfill(course)
            if fulfilled:
                try:
                    hrs = utils.get_hours_from_course(course)
                    id = requirement["metadata"]["id"] # type: ignore
                    if id in self.req_hrs:
                        self.req_hrs[id] += hrs
                    else:
                        self.req_hrs[id] = hrs
                except ValueError:
                    pass
                finally:
                    return True
        return False

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
    