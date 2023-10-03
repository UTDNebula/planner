from __future__ import annotations

from collections import Counter

from course import Course
from major.requirements import AbstractRequirement, FreeElectiveRequirement


class MajorRequirementsSolver:
    def __init__(
        self,
        courses: list[str],
        requirements: list[AbstractRequirement],
        used_core_courses: Counter[Course],
    ) -> None:
        self.courses = set([Course.from_name(course) for course in courses])
        self.requirements = requirements
        self.used_core_courses = used_core_courses

    def solve(self) -> MajorRequirementsSolver:
        for course in self.courses:
            for requirement in self.requirements:
                if type(requirement) == FreeElectiveRequirement:
                    if requirement.attempt_fulfill(
                        course.name,
                        available_hours=(
                            int(course.hours) - self.used_core_courses[course]
                        ),
                    ):
                        break
                elif requirement.attempt_fulfill(course.name):
                    break

        return self

    def can_graduate(self) -> bool:
        return all(requirement.is_fulfilled() for requirement in self.requirements)

    def __str__(self) -> str:
        return "\n".join(str(req) for req in self.requirements)
