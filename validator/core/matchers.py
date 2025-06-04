"""Course to requirement matchers."""

from __future__ import annotations
import re
from abc import ABC, abstractmethod
from typing import NamedTuple, TypedDict, TypeGuard, Pattern, Union

from course import Course


class MatcherParseException(Exception):
    """Exception raised when a matcher fails to parse arguments"""


class MatcherBuildException(Exception):
    """Exception raised when a matcher fails to build. Usually occurs when matcher is given invalid arguments."""


class Matcher(ABC):
    """A matcher is used to determine if a course would fulfill a requirement."""

    @abstractmethod
    def match(self, course: Course) -> bool:
        pass

    class Builder:
        ArgList = list[Union["Matcher", str, int, Pattern[str]]]

        matcher_type: str
        args: ArgList

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
                raise MatcherParseException(
                    f"'{matcher_type}' is not a supported Matcher type"
                )
            self.matcher_type = matcher_type
            self.args = []

        def _assert_single_arg(self) -> None:
            if len(self.args) != 0:
                raise MatcherParseException(
                    f"'{self.matcher_type}' matcher only takes one argument"
                )

        def add_arg(self, arg: Matcher | str) -> None:
            match self.matcher_type:
                case "And" | "Or":
                    if not issubclass(type(arg), Matcher):
                        raise MatcherParseException(
                            f"Invalid argument passed into '{self.matcher_type}' matcher. Expected Matcher, got {type(arg)}."
                        )
                    self.args.append(arg)
                case "Not":
                    self._assert_single_arg()
                    if not issubclass(type(arg), Matcher):
                        raise MatcherParseException(
                            f"Invalid argument passed into '{self.matcher_type}' matcher. Expected Matcher, got {type(arg)}."
                        )

                    self.args.append(arg)
                case "NameList":
                    if not isinstance(arg, str):
                        raise MatcherParseException(
                            f"Invalid argument passed into '{self.matcher_type}' matcher. Expected string, got {type(arg)}."
                        )

                    m = re.match(r"(.*)(\d[\dVv]\d\d)", arg)
                    if not m:
                        raise MatcherParseException(
                            f"Unable to parse course name passed into '{self.matcher_type}' matcher"
                        )
                    course_str = m.group(1) + " " + m.group(2).replace("v", "V")
                    self.args.append(course_str)
                case "Regex":
                    self._assert_single_arg()
                    if not isinstance(arg, str):
                        raise MatcherParseException(
                            f"Invalid argument passed into '{self.matcher_type}' matcher. Expected string, got {type(arg)}."
                        )
                    try:
                        r = re.compile(arg)
                    except re.error as e:
                        raise MatcherParseException(
                            f"Unable to compile regex passed into '{self.matcher_type}' matcher: {e}"
                        )
                    self.args.append(r)
                case "Level":
                    if type(arg) != str or not arg.isdigit() or not 0 <= int(arg) <= 9:
                        raise MatcherParseException(
                            f"Invalid argument passed into '{self.matcher_type}' matcher"
                        )
                    self.args.append(int(arg))
                case "Department":
                    self._assert_single_arg()
                    if not isinstance(arg, str):
                        raise MatcherParseException(
                            f"Invalid argument passed into '{self.matcher_type}' matcher. Expected string, got {type(arg)}."
                        )
                    self.args.append(arg)
                case "Any":
                    raise MatcherParseException(
                        f"'{self.matcher_type}' matcher does not take arguments"
                    )
                case _:
                    raise Exception("Unhandled matcher type")

        def _is_matcher_list(self, args: ArgList) -> TypeGuard[list[Matcher]]:
            return all(isinstance(a, Matcher) for a in args)

        def _is_str_list(self, arg: ArgList) -> TypeGuard[list[str]]:
            return all(isinstance(a, str) for a in arg)

        def _is_int_list(self, arg: ArgList) -> TypeGuard[list[int]]:
            return all(isinstance(a, int) for a in arg)

        def build(self) -> Matcher:
            match self.matcher_type:
                case "And":
                    if not self._is_matcher_list(self.args):
                        raise MatcherBuildException(
                            f"'{self.matcher_type}' matcher requires a list of matchers, instead got: {self.args}."
                        )
                    return AndMatcher(*self.args)
                case "Or":
                    if not self._is_matcher_list(self.args):
                        raise MatcherBuildException(
                            f"'{self.matcher_type}' matcher requires a list of matchers, instead got: {self.args}."
                        )
                    return OrMatcher(*self.args)
                case "Not":
                    if len(self.args) == 0:
                        raise MatcherBuildException(
                            f"'{self.matcher_type}' matcher requires a single matcher, but no arguments were found."
                        )
                    if not isinstance(self.args[0], Matcher):
                        raise MatcherBuildException(
                            f"'{self.matcher_type}' matcher requires a single matcher, instead got: {self.args[0]}."
                        )
                    return NotMatcher(self.args[0])
                case "NameList":
                    if not self._is_str_list(self.args):
                        raise MatcherBuildException(
                            f"'{self.matcher_type}' matcher requires a list of strings, instead got: {self.args}."
                        )
                    return NameListMatcher(*self.args)
                case "Regex":
                    if len(self.args) == 0:
                        raise MatcherBuildException(
                            f"'{self.matcher_type}' matcher requires a single pattern, but no arguments were found."
                        )
                    if not isinstance(self.args[0], Pattern):
                        raise MatcherBuildException(
                            f"'{self.matcher_type}' matcher requires a single pattern, instead got: {self.args[0]}."
                        )
                    return RegexMatcher(self.args[0])
                case "Level":
                    if not self._is_int_list(self.args):
                        raise MatcherBuildException(
                            f"'{self.matcher_type}' matcher requires a list of integers, instead got: {self.args}."
                        )
                    return LevelMatcher(*self.args)
                case "Department":
                    if len(self.args) == 0:
                        raise MatcherBuildException(
                            f"'{self.matcher_type}' matcher requires a string argument, but no arguments were found."
                        )
                    if not isinstance(self.args[0], str):
                        raise MatcherBuildException(
                            f"'{self.matcher_type}' matcher requires a string argument, instead got: {self.args[0]}."
                        )
                    return DepartmentMatcher(self.args[0])
                case "Any":
                    return AnyMatcher()
                case _:
                    raise Exception("Unhandled matcher type")


class AndMatcher(Matcher):
    def __init__(self, *matchers: Matcher):
        self.matchers = matchers

    def match(self, course: Course) -> bool:
        return all(m.match(course) for m in self.matchers)


class OrMatcher(Matcher):
    def __init__(self, *matchers: Matcher):
        self.matchers = matchers

    def match(self, course: Course) -> bool:
        return any(m.match(course) for m in self.matchers)


class NotMatcher(Matcher):
    def __init__(self, matcher: Matcher):
        self.matcher = matcher

    def match(self, course: Course) -> bool:
        return not self.matcher.match(course)


class NameListMatcher(Matcher):
    def __init__(self, *name_list: str):
        self.name_list = name_list

    def match(self, course: Course) -> bool:
        return course.name in self.name_list


class RegexMatcher(Matcher):
    def __init__(self, pattern: re.Pattern[str]):
        self.pattern = pattern

    def match(self, course: Course) -> bool:
        return self.pattern.match(course.name) is not None


class LevelMatcher(Matcher):
    def __init__(self, *levels: int):
        self.levels = levels

    def match(self, course: Course) -> bool:
        return course.level in self.levels


class DepartmentMatcher(Matcher):
    def __init__(self, department: str):
        self.department = department

    def match(self, course: Course) -> bool:
        return course.department == self.department


class AnyMatcher(Matcher):
    def match(self, _: Course) -> bool:
        return True


class SingleAssignmentJSON(TypedDict):
    course: str
    requirement: str
    hours: int


class SingleAssignment(NamedTuple):
    course: str
    requirement: str
    hours: int

    def to_json(self) -> SingleAssignmentJSON:
        return {
            "course": self.course,
            "requirement": self.requirement,
            "hours": self.hours,
        }

    @classmethod
    def from_json(cls, d: SingleAssignmentJSON) -> SingleAssignment:
        course = d["course"]
        requirement = d["requirement"]
        hours = d["hours"]
        return cls(course, requirement, hours)


def list_matcher_requirements(matcher: Matcher) -> list[str]:
    """
    Only supports NameList atm
    """
    if not isinstance(matcher, NameListMatcher):
        raise NotImplementedError
    return [course for course in matcher.name_list]
