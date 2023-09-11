""" This module contains the classes and functions used to represent the input to the solver. """ ""
from core.requirement import Requirement


class SolverInputException(Exception):
    """Exception raised for errors in the input."""


class SolverInput:
    requirements: dict[str, Requirement]
    requirement_groups: list[list[Requirement]]

    def __init__(
        self,
        requirements: dict[str, Requirement],
        requirement_groups: list[list[Requirement]],
    ) -> None:
        self.requirements = requirements
        self.requirement_groups = requirement_groups
        self._validate()

    def _validate(self) -> None:
        """Ensures that all REQUIRE are used in GROUP"""
        # TODO: ensure no duplicates
        requirements_names = set(self.requirements.keys())
        groups_names = set(
            req.name for group in self.requirement_groups for req in group
        )

        if not requirements_names == groups_names:
            raise SolverInputException("Not all requirements are used in groups.")
