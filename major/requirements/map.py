from .base import AbstractRequirement
from .shared import *
from .edge_cases import computer_science
from typing import Type

REQUIREMENTS_MAP: dict[str, Type[AbstractRequirement]] = {
    # Shared requirements
    "CourseRequirement": CourseRequirement,
    "AndRequirement": AndRequirement,
    "OrRequirement": OrRequirement,
    "FreeElectiveRequirement": FreeElectiveRequirement,
    # Computer Science Edge Cases
    "CS_MajorGuidedElectiveRequirement": computer_science.MajorGuidedElectiveRequirement,
}
