from __future__ import annotations
import re
from abc import ABC, abstractmethod
from typing import NamedTuple, TypedDict

from course import Course
from utils import hashable

# TODO: actually implement this exception to give good error messages
ParseException = Exception



class Matcher(ABC):
    """Abstract class for matcher"""

    @abstractmethod
    def match(self, course: Course) -> bool:
        pass

    class Builder:
        def __init__(self, matcher_type: str):
            if matcher_type not in (
                "And",
                "Or",
                "Not",
                "NameList",
                "Regex",
                "Level",
                "Department",
                "Any",
            ):
                raise ParseException(
                    f"'{matcher_type}' is not a supported Matcher type"
                )
            self.matcher_type = matcher_type
            self.args = []

        def _assert_single_arg(self):
            if len(self.args) != 0:
                raise ParseException(
                    f"'{self.matcher_type}' matcher only takes one argument"
                )

        def _assert_type(self, arg: Matcher | str, t: type):
            if not issubclass(type(arg), t):
                raise ParseException(
                    f"Invalid argument passed into '{self.matcher_type}' matcher"
                )

        def add_arg(self, arg: Matcher | str):
            match self.matcher_type:
                case "And" | "Or":
                    self._assert_type(arg, Matcher)
                    self.args.append(arg)
                case "Not":
                    self._assert_single_arg()
                    self._assert_type(arg, Matcher)
                    self.args.append(arg)
                case "NameList":
                    self._assert_type(arg, str)
                    m = re.match(r"(.*)(\d[\dVv]\d\d)", arg)
                    if not m:
                        raise ParseException(
                            f"Unable to parse course name passed into '{self.matcher_type}' matcher"
                        )
                    course_str = m.group(1) + " " + m.group(2).replace("v", "V")
                    self.args.append(course_str)
                case "Regex":
                    self._assert_single_arg()
                    self._assert_type(arg, str)
                    try:
                        r = re.compile(arg)
                    except re.error as e:
                        raise ParseException(
                            f"Unable to compile regex passed into '{self.matcher_type}' matcher: {e}"
                        )
                    self.args.append(r)
                case "Level":
                    if type(arg) != str or not arg.isdigit() or not 0 <= int(arg) <= 9:
                        raise ParseException(
                            f"Invalid argument passed into '{self.matcher_type}' matcher"
                        )
                    self.args.append(int(arg))
                case "Department":
                    self._assert_single_arg()
                    self._assert_type(arg, str)
                    self.args.append(arg)
                case "Any":
                    raise ParseException(
                        f"'{self.matcher_type}' matcher does not take arguments"
                    )
                case _:
                    raise Exception("Unhandled matcher type")

        def build(self) -> Matcher:
            match self.matcher_type:
                case "And":
                    return AndMatcher(*self.args)
                case "Or":
                    return OrMatcher(*self.args)
                case "Not":
                    return NotMatcher(self.args[0])
                case "NameList":
                    return NameListMatcher(*self.args)
                case "Regex":
                    return RegexMatcher(self.args[0])
                case "Level":
                    return LevelMatcher(*self.args)
                case "Department":
                    return DepartmentMatcher(self.args[0])
                case "Any":
                    return AnyMatcher()
                case _:
                    raise Exception("Unhandled matcher type")


class AndMatcher(Matcher):
    def __init__(self, *matchers: Matcher):
        self.matchers = matchers

    def match(self, course):
        return all(m.match(course) for m in self.matchers)


class OrMatcher(Matcher):
    def __init__(self, *matchers: Matcher):
        self.matchers = matchers

    def match(self, course):
        return any(m.match(course) for m in self.matchers)


class NotMatcher(Matcher):
    def __init__(self, matcher: Matcher):
        self.matcher = matcher

    def match(self, course):
        return not self.matcher.match(course)


class NameListMatcher(Matcher):
    def __init__(self, *name_list: str):
        self.name_list = name_list

    def match(self, course):
        return course.name in self.name_list


class RegexMatcher(Matcher):
    def __init__(self, pattern: re.Pattern):
        self.pattern = pattern

    def match(self, course):
        return self.pattern.match(course.name) is not None


class LevelMatcher(Matcher):
    def __init__(self, *levels: int):
        self.levels = levels

    def match(self, course):
        return course.level in self.levels


class DepartmentMatcher(Matcher):
    def __init__(self, department: str):
        self.department = department

    def match(self, course):
        return course.department == self.department


class AnyMatcher(Matcher):
    def match(self, course):
        _ = course  # just to get linter to stop complaining
        return True


class SingleAssignment(NamedTuple):
    course: str
    requirement: str
    hours: float

    def to_json(self):
        return {
            "course": self.course,
            "requirement": self.requirement,
            "hours": self.hours,
        }

    class JSON(TypedDict):
        course: str
        requirement: str
        hours: float

    @classmethod
    def from_json(cls, d: JSON) -> SingleAssignment:
        course = d["course"]
        requirement = d["requirement"]
        hours = d["hours"]
        return cls(course, requirement, hours)


def list_matcher_requirements(matcher: Matcher):
    """
    Only supports NameList atm
    """
    if type(matcher).__name__ == "NameListMatcher":
        return [course for course in matcher.name_list]
    return "all"
