from __future__ import annotations
from major.requirements import AbstractRequirement


class MajorRequirementsSolver:
    def __init__(
        self, courses: list[str], requirements: list[AbstractRequirement]
    ) -> None:
        self.courses = courses
        self.requirements = requirements

    def solve(self) -> MajorRequirementsSolver:
        for course in self.courses:
            for requirement in self.requirements:
                fulfilled = requirement.attempt_fulfill(course)
                if fulfilled:
                    break

        return self

    def can_graduate(self) -> bool:
        return all(requirement.is_fulfilled() for requirement in self.requirements)

    def __str__(self) -> str:
        return "\n".join(str(req) for req in self.requirements)
