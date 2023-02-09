from major.requirements import AbstractRequirement


class MajorRequirementsSolver:
    def __init__(
        self, courses: list[str], requirements: list[AbstractRequirement]
    ) -> None:
        self.courses = courses
        self.requirements = requirements

    def solve(self) -> None:
        for course in self.courses:
            for requirement in self.requirements:
                requirement.attempt_fulfill(course)

    def print(self) -> None:
        for requirement in self.requirements:
            print(str(requirement))
