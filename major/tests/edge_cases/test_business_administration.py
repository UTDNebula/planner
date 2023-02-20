from major.requirements.edge_cases.business_administration import (
    BusinessAdministrationElectiveRequirement,
    SomeRequirement,
)
import json

from major.requirements.shared import PrefixBucketRequirement


def test_major_guided_elective_requirement() -> None:
    req = BusinessAdministrationElectiveRequirement(
        2,
        9,
        [
            SomeRequirement(
                [PrefixBucketRequirement("CS"), PrefixBucketRequirement("SE")]
            ),
            SomeRequirement(
                [PrefixBucketRequirement("PHIL"), PrefixBucketRequirement("ECON")]
            ),
        ],
    )

    assert req.is_fulfilled() == False
    assert req.fulfilled_count == 0
    assert req.fulfilled_hours == 0

    req.attempt_fulfill("HIST 1301")

    assert req.is_fulfilled() == False
    assert req.fulfilled_count == 0
    assert req.fulfilled_hours == 0

    req.attempt_fulfill("CS 3300")
    assert req.is_fulfilled() == False
    assert req.fulfilled_hours == 3
    assert req.fulfilled_count == 1

    req.attempt_fulfill("CS 4322")
    assert req.is_fulfilled() == False
    assert req.fulfilled_count == 1
    assert req.fulfilled_hours == 6

    req.attempt_fulfill("PHIL 4322")
    assert req.is_fulfilled() == True
    assert req.fulfilled_count == 2
    assert req.fulfilled_hours == 9

    data = json.loads(
        """
        {
            "matcher": "BA_ElectiveRequirement",
            "required_count": 2,
            "required_hours": 15,
            "prefix_groups": [
            {
                "matcher": "SomeRequirement",
                "requirements": [
                {
                    "matcher": "PrefixBucketRequirement",
                    "prefix": "MKT"
                }
                ]
            },
            {
                "matcher": "SomeRequirement",
                "requirements": [
                {
                    "matcher": "PrefixBucketRequirement",
                    "prefix": "ACCT"
                },
                {
                    "matcher": "PrefixBucketRequirement",
                    "prefix": "ENGY"
                }
                ]
            }]
        }
        """
    )

    req = BusinessAdministrationElectiveRequirement.from_json(data)

    req.attempt_fulfill("MKT 4325")
    req.attempt_fulfill("ACCT 4351")
    req.attempt_fulfill("ENGY 4324")
    req.attempt_fulfill("ACCT 3351")
    req.attempt_fulfill("ENGY 3324")

    assert req.is_fulfilled()
