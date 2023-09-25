from typing import Type, Literal, get_args, Mapping, TypeGuard

RequirementNameT = Literal[
    "CourseRequirement",
    "AndRequirement",
    "OrRequirement",
    "FreeElectiveRequirement",
    "SelectRequirement",
    "HoursRequirement",
    "PrefixBucketRequirement",
    "OtherRequirement",
    "CSGuidedElectiveRequirement",
    "BAGuidedElectiveRequirement",
    "SomeRequirement",
    "MultiGroupElectiveRequirement",
    "ATECPrescribedElectiveRequirement",
    "PsychologyPrefixesOrCourses",
]
RequirementNames: list[RequirementNameT] = list(get_args(RequirementNameT))


class Loader:
    from major.requirements.base import AbstractRequirement

    def __init__(self) -> None:
        from major.requirements import shared
        from .edge_cases import (
            business_administration,
            computer_science,
            arts_technology_emerging_communication,
            psychology,
        )

        self.REQUIREMENTS_MAP: dict[
            RequirementNameT,
            Type[Loader.AbstractRequirement],
        ] = {
            # Shared requirements
            "CourseRequirement": shared.CourseRequirement,
            "AndRequirement": shared.AndRequirement,
            "OrRequirement": shared.OrRequirement,
            "FreeElectiveRequirement": shared.FreeElectiveRequirement,
            "SelectRequirement": shared.SelectRequirement,
            "HoursRequirement": shared.HoursRequirement,
            "PrefixBucketRequirement": shared.PrefixBucketRequirement,
            "OtherRequirement": shared.OtherRequirement,
            # Computer Science Edge Cases
            "CSGuidedElectiveRequirement": computer_science.MajorGuidedElectiveRequirement,
            # Business Administration Edge Cases
            "BAGuidedElectiveRequirement": business_administration.BusinessAdministrationElectiveRequirement,
            "SomeRequirement": business_administration.SomeRequirement,
            "MultiGroupElectiveRequirement": shared.MultiGroupElectiveRequirement,
            "ATECPrescribedElectiveRequirement": arts_technology_emerging_communication.ATECPrescribedElectiveRequirement,
            # Psychology
            "PsychologyPrefixesOrCourses": psychology.PsychologyPrefixesOrCourses,
        }

    def requirement_from_json(self, json: Mapping) -> AbstractRequirement:
        if not "matcher" in json:
            raise ValueError(f"Invalid requirement: {json}, missing 'matcher' key.")
        if not self._is_valid_requirement(json["matcher"]):
            raise ValueError(f"Invalid requirement: {json}")

        return self.REQUIREMENTS_MAP[json["matcher"]].from_json(json)

    def _is_valid_requirement(self, requirement: str) -> TypeGuard[RequirementNameT]:
        return requirement in self.REQUIREMENTS_MAP
