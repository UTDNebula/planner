from __future__ import annotations
from utils import hashable
from typing import TypedDict


class CourseParseException(Exception):
    """Exception raised when a course cannot be parsed"""


class Course(hashable.NameDefinedClass):
    def __init__(
        self, name: str, level: int = 0, hours: float = 0, department: str = "UNK"
    ):
        # Validate args
        if type(name) != str:
            raise CourseParseException("Course name must be a string")
        if type(level) != int or not 0 <= level <= 9:
            raise CourseParseException("Course level must be a single-digit integer")
        if type(hours) not in (int, float):
            raise CourseParseException("Course hours must be a float")
        if type(department) != str:
            raise CourseParseException("Course department must be a string")

        # Save to class
        self.name = name
        self.level = level
        self.hours = hours
        self.department = department

    def to_json(self) -> dict[str, str | int | float]:
        return {
            "name": self.name,
            "level": self.level,
            "hours": self.hours,
            "department": self.department,
        }

    @classmethod
    def from_name(cls, name: str) -> Course:
        """Parse course properties from just the name. Mostly for testing/mock data"""
        department, course_num = name.split()
        level = int(course_num[0])
        hr_str = course_num[1]
        if hr_str == "V":
            hours = 3
        else:
            hours = int(hr_str)
        return cls(name, level, hours, department)

    class JSON(TypedDict):
        name: str
        level: int
        hours: float
        department: str

    @classmethod
    def from_json(cls, d: JSON) -> Course:
        """Retrieve course properties from json dictionary"""
        name = d["name"]
        level = d["level"]
        hours = d["hours"]
        department = d["department"]

        return cls(name, level, hours, department)
