from .base import AbstractRequirement
from .shared import *
from .edge_cases import computer_science, business_administration
from typing import Type

REQUIREMENTS_MAP: dict[str, Type[AbstractRequirement]] = {
    # Shared requirements
    "CourseRequirement": CourseRequirement,
    "AndRequirement": AndRequirement,
    "OrRequirement": OrRequirement,
    "FreeElectiveRequirement": FreeElectiveRequirement,
    "SelectRequirement": SelectRequirement,
    "HoursRequirement": HoursRequirement,
    "PrefixRequirement": PrefixRequirement,
    # Computer Science Edge Cases
    "CS_MajorGuidedElectiveRequirement": computer_science.MajorGuidedElectiveRequirement,
    # Business Administration Edge Cases
    "BA_ElectiveRequirement": business_administration.BusinessAdministrationElectiveRequirement,
    "SomeRequirement": business_administration.SomeRequirement,
    "PrefixBucketRequirement": business_administration.PrefixBucketRequirement,
}
