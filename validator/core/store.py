from __future__ import annotations
from collections import defaultdict, Counter

from typing import TypedDict

from core.requirement import Requirement
from course import Course
import core.utils as core_utils


class AssignmentStoreJSON(TypedDict):
    courses: list[str]
    hours: float
    filled: bool
    valid_courses: dict[str, float]


class AssignmentStore:
    """A mapping of requirements to courses that fulfill them, and the hours used. This is used to map the output of the solver."""

    # req -> course -> hours
    reqs_to_courses: dict[Requirement, Counter[Course]]

    def __init__(self) -> None:
        self.reqs_to_courses = defaultdict(Counter)

    def assert_requirement(self, requirement: Requirement) -> None:
        """Initialize requirement in store if not already initialized"""
        _ = self.reqs_to_courses[requirement]

    def add(
        self,
        course: Course,
        requirement: Requirement,
        hours: float,
        overwrite: bool = False,
    ) -> None:
        if overwrite:
            self.reqs_to_courses[requirement][course] = hours  # type: ignore
        else:
            self.reqs_to_courses[requirement][course] += hours  # type: ignore

    def update(self, other: AssignmentStore) -> None:
        """Merge another AssignmentStore into this one"""
        for req, req_fills in other.reqs_to_courses.items():
            # Note: abuses Counter's .update() which adds instead of replacing
            self.reqs_to_courses[req].update(req_fills)

    def get_unfilled_reqs(self) -> list[tuple[Requirement, int]]:
        unfilled_reqs: list[tuple[Requirement, int]] = []
        for req, _ in self.reqs_to_courses.items():
            hours_filled = self._get_req_hours_filled(req)
            if hours_filled < req.hours:
                unfilled_reqs.append((req, hours_filled))
        return unfilled_reqs

    def can_graduate(self) -> bool:
        return len(self.get_unfilled_reqs()) == 0

    def to_json(self) -> dict[str, AssignmentStoreJSON]:
        return {
            req.name: {
                "courses": core_utils.list_matcher_requirements(req.course_matcher),
                "hours": req.hours,
                "filled": self._get_req_hours_filled(req) >= req.hours,
                "valid_courses": {c.name: hours for c, hours in req_fills.items()},
            }
            for req, req_fills in self.reqs_to_courses.items()
        }

    def _get_req_hours_filled(self, req: Requirement) -> int:
        """Returns sum of hours filled for a requirement"""
        req_fills = self.reqs_to_courses[req]
        return sum(list(zip(*req_fills.items()))[1]) if req_fills else 0

    def __str__(self) -> str:
        str_bldr: list[str] = []
        for req, req_fills in self.reqs_to_courses.items():
            hours_filled = self._get_req_hours_filled(req)
            str_bldr.append(f"{req.name} ({hours_filled}/{req.hours} hrs filled)\n")

            for course, hours in sorted(req_fills.items()):
                # Display how many hours were used if the course did not go entirely into one req
                if hours != course.hours:
                    hours_string = f" ({hours}/{course.hours} hrs used)"
                else:
                    hours_string = ""
                str_bldr.append(f"  {course.name}{hours_string}\n")
        return "".join(str_bldr)
