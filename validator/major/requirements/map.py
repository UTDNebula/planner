from .base import AbstractRequirement
from .shared import *
from .edge_cases import business_administration, computer_science, arts_technology_emerging_communication
from typing import Type

REQUIREMENTS_MAP: dict[str, Type[AbstractRequirement]] = {
    # Shared requirements
    "CourseRequirement": CourseRequirement,
    "AndRequirement": AndRequirement,
    "OrRequirement": OrRequirement,
    "FreeElectiveRequirement": FreeElectiveRequirement,
    "SelectRequirement": SelectRequirement,
    "HoursRequirement": HoursRequirement,
    "PrefixBucketRequirement": PrefixBucketRequirement,
    "OtherRequirement": OtherRequirement,
    # Computer Science Edge Cases
    "CSGuidedElectiveRequirement": computer_science.MajorGuidedElectiveRequirement,
    # Business Administration Edge Cases
    "BAGuidedElectiveRequirement": business_administration.BusinessAdministrationElectiveRequirement,
    "SomeRequirement": business_administration.SomeRequirement,
    "MultiGroupElectiveRequirement": MultiGroupElectiveRequirement,
    "ATECPrescribedElectiveRequirement": arts_technology_emerging_communication.ATECPrescribedElectiveRequirement,
}
