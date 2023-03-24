from major.requirements import (
    CourseRequirement,
    AndRequirement,
    OrRequirement,
    HoursRequirement,
    FreeElectiveRequirement,
    SelectRequirement,
    PrefixBucketRequirement,
    OtherRequirement,
    MultiGroupElectiveRequirement,
)
import json

from major.requirements.edge_cases.business_administration import SomeRequirement


def test_course_requirement() -> None:
    course_req = CourseRequirement("HIST 1301")
    course_req.attempt_fulfill("HIST 1301")

    assert course_req.is_fulfilled()

    data = json.loads(
        """
        {
            "matcher": "CourseRequirement",
            "metadata": {"id": 1},
            "course": "HIST 1301"
        }
        """
    )
    course_req = CourseRequirement.from_json(data)

    assert course_req.course == "HIST 1301"


def test_and_requirement() -> None:
    and_req = AndRequirement(
        [
            CourseRequirement("HIST 1301"),
            CourseRequirement("HIST 1302"),
        ]
    )
    assert and_req.attempt_fulfill("HIST 1301")
    assert and_req.attempt_fulfill("HIST 1302")
    assert and_req.is_fulfilled()

    data = json.loads(
        """
        {
            "matcher": "AndRequirement",
            "metadata": {"id": 1},
            "requirements": [
                {
                    "matcher": "CourseRequirement",
                    "metadata": {"id": 2},
                    "course": "HIST 1301"
                },
                {
                    "matcher": "CourseRequirement",
                    "metadata": {"id": 3},
                    "course": "HIST 1302"
                }
            ]
        }
        """
    )

    and_req = AndRequirement.from_json(data)

    assert and_req.attempt_fulfill("HIST 1301")
    assert and_req.attempt_fulfill("HIST 1302")
    assert and_req.is_fulfilled()


def test_or_requirement() -> None:
    or_req = OrRequirement(
        [
            CourseRequirement("HIST 1301"),
            CourseRequirement("HIST 1302"),
        ]
    )
    assert or_req.attempt_fulfill("HIST 1301")
    assert or_req.is_fulfilled()

    data = json.loads(
        """
        {
            "matcher": "OrRequirement",
            "metadata": {"id": 1},
            "requirements": [
                {
                    "matcher": "CourseRequirement",
                    "metadata": {"id": 2},
                    "course": "HIST 1301"
                },
                {
                    "matcher": "CourseRequirement",
                    "metadata": {"id": 3},
                    "course": "HIST 1302"
                }
            ]
        }
        """
    )

    or_req = OrRequirement.from_json(data)

    assert or_req.attempt_fulfill("HIST 1301")
    assert or_req.is_fulfilled()


def test_hours_requirement() -> None:
    hours_req = HoursRequirement(
        12,
        [
            CourseRequirement("ACCT 3322"),
            CourseRequirement("ACCT 4301"),
            CourseRequirement("ACCT 4302"),
            CourseRequirement("ACCT 4336"),
            CourseRequirement("ACCT 4337"),
            CourseRequirement("ACCT 4340"),
            CourseRequirement("FIN 3330"),
            CourseRequirement("FIN 3360"),
            CourseRequirement("FIN 3380"),
            CourseRequirement("FIN 3390"),
            CourseRequirement("ITSS 4340"),
            CourseRequirement("OPRE 4350"),
        ],
    )

    assert hours_req.get_fulfilled_hours() == 0
    assert hours_req.is_fulfilled() == False

    hours_req.attempt_fulfill("ACCT 3322")
    hours_req.attempt_fulfill("FFFF 1111")

    assert hours_req.get_fulfilled_hours() == 3
    assert hours_req.is_fulfilled() == False

    hours_req.attempt_fulfill("ACCT 3322")
    assert hours_req.get_fulfilled_hours() == 3
    assert hours_req.is_fulfilled() == False

    hours_req.attempt_fulfill("ACCT 4301")
    hours_req.attempt_fulfill("FIN 3380")
    hours_req.attempt_fulfill("FIN 3390")

    assert hours_req.get_fulfilled_hours() == 12
    assert hours_req.is_fulfilled() == True

    hours_req.attempt_fulfill("FIN 3330")
    assert hours_req.get_fulfilled_hours() == 12
    assert hours_req.is_fulfilled() == True

    data = json.loads(
        """
        {
            "matcher": "HoursRequirement",
            "metadata": {"id": 1},
            "required_hours": 3,
            "requirements": [  
                {
                    "matcher": "CourseRequirement",
                    "metadata": {"id": 2},
                    "course": "HIST 1301"
                },
                {
                    "matcher": "CourseRequirement",
                    "metadata": {"id": 3},
                    "course": "HIST 1302"
                }
            ]
        }
        """
    )

    hours_req = HoursRequirement.from_json(data)
    hours_req.attempt_fulfill("HIST 1301")

    assert hours_req.get_fulfilled_hours() == 3
    assert hours_req.is_fulfilled() == True


def test_free_elective_requirement() -> None:
    free_elective_req = FreeElectiveRequirement(10, ["HIST 1301", "HIST 1302"])
    free_elective_req.attempt_fulfill("HIST 1301")
    free_elective_req.attempt_fulfill("HIST 1302")

    assert free_elective_req.fulfilled_hours == 0

    assert free_elective_req.attempt_fulfill("CS 9999")
    assert free_elective_req.fulfilled_hours == 9

    assert free_elective_req.attempt_fulfill("CS 9199")
    assert free_elective_req.attempt_fulfill("CS 9199") == False  # already at 10 hours
    assert free_elective_req.is_fulfilled()

    data = json.loads(
        """
        {
            "matcher": "FreeElectiveRequirement",
            "metadata": {"id": 1},
            "required_hours": 10,
            "excluded_courses": ["HIST 1301", "HIST 1302"]
        }
        """
    )

    free_elective_req = FreeElectiveRequirement.from_json(data)
    free_elective_req.attempt_fulfill("HIST 1301")

    assert free_elective_req.fulfilled_hours == 0


def test_select_requirement() -> None:
    select_req = SelectRequirement(
        2,
        [
            CourseRequirement("BA 1310"),
            CourseRequirement("BA 1320"),
            CourseRequirement("ECON 2301"),
            CourseRequirement("ECON 2302"),
        ],
    )
    assert select_req.fulfilled_count == 0
    assert select_req.is_fulfilled() == False

    select_req.attempt_fulfill("GANG 1000")
    assert select_req.fulfilled_count == 0
    assert select_req.is_fulfilled() == False

    select_req.attempt_fulfill("BA 1320")
    assert select_req.fulfilled_count == 1
    assert select_req.is_fulfilled() == False

    select_req.attempt_fulfill("BA 1310")
    assert select_req.fulfilled_count == 2
    assert select_req.is_fulfilled() == True

    select_req.attempt_fulfill("ECON 2301")
    assert select_req.fulfilled_count == 2
    assert select_req.is_fulfilled() == True

    data = json.loads(
        """
        {
            "matcher": "SelectRequirement",
            "metadata": {"id": 1},
            "required_count": 2,
            "requirements": [
                {
                    "matcher": "CourseRequirement",
                    "metadata": {"id": 2},
                    "course": "HIST 1301"
                },
                {
                    "matcher": "CourseRequirement",
                    "metadata": {"id": 3},
                    "course": "HIST 1302"
                },
                {
                    "matcher": "CourseRequirement",
                    "metadata": {"id": 4},
                    "course": "HIST 3301"
                }
            ]
        }
        """
    )

    select_req = SelectRequirement.from_json(data)

    assert select_req.attempt_fulfill("HIST 1301")
    assert select_req.is_fulfilled() == False
    assert select_req.fulfilled_count == 1


def test_prefix_bucket_requirement() -> None:
    prefix_req = PrefixBucketRequirement("CS")
    assert prefix_req.filled == False

    prefix_req.attempt_fulfill("BCOM 1000")
    assert prefix_req.filled == False

    prefix_req.attempt_fulfill("CS 1336")
    assert prefix_req.filled == True


def test_other_requirement() -> None:
    other_req = OtherRequirement("Other Requirement")
    assert other_req.is_fulfilled() == False

    other_req.attempt_fulfill("CS 1336")
    assert other_req.is_fulfilled() == False

    data = json.loads(
        """
        {
            "matcher": "OtherRequirement",
            "metadata": {"id": "1"},
            "description": "Other Requirement"
        }
        """
    )

    other_req = OtherRequirement.from_json(data)
    assert other_req.is_fulfilled() == False

    other_req.attempt_fulfill("CS 1336")
    assert other_req.is_fulfilled() == False

    other_req.override_fill("1")
    assert other_req.is_fulfilled()


def test_multi_group_elective_requirement() -> None:
    valid_req_with_no_hrs_requirement = MultiGroupElectiveRequirement(
        [
            CourseRequirement(
                "ATCM 2330", False, {"id": "41b3882e-ba4e-414c-b2fe-20d86e729bca"}
            ),
            CourseRequirement(
                "ATCM 2303", False, {"id": "9a91a68b-ef2e-4a92-a447-94b783a81dc6"}
            ),
            CourseRequirement(
                "ATCM 2334", False, {"id": "83258a8d-c71c-44e4-b713-a1e63fcf50cf"}
            ),
        ],
        2,
        0,
    )

    # Shouldn't be fulfilled on instantiation
    assert valid_req_with_no_hrs_requirement.is_fulfilled() == False


    for course in [
        "ATCM 2330",
        "ATCM 2303",
    ]:
        assert valid_req_with_no_hrs_requirement.attempt_fulfill(course)

    assert valid_req_with_no_hrs_requirement.is_fulfilled() == True

    # This requirement should not fulfill because we are looking for 6 hrs in one group, but each group can only take 3 hrs
    req_with_invalid_hrs_requirement = MultiGroupElectiveRequirement(
        [
            CourseRequirement(
                "ATCM 2330", False, {"id": "41b3882e-ba4e-414c-b2fe-20d86e729bca"}
            ),
            CourseRequirement(
                "ATCM 2303", False, {"id": "9a91a68b-ef2e-4a92-a447-94b783a81dc6"}
            ),
            CourseRequirement(
                "ATCM 2334", False, {"id": "83258a8d-c71c-44e4-b713-a1e63fcf50cf"}
            ),
        ],
        2,
        6
    )

    for course in [
        "ATCM 2330",
        "ATCM 2303",
    ]:
        assert req_with_invalid_hrs_requirement.attempt_fulfill(course)

    assert req_with_invalid_hrs_requirement.is_fulfilled() == False
    
    req_with_valid_hrs_requirement = MultiGroupElectiveRequirement(
        [
            CourseRequirement(
                "ATCM 2330", False, {"id": "41b3882e-ba4e-414c-b2fe-20d86e729bca"}
            ),
            CourseRequirement(
                "ATCM 2303", False, {"id": "9a91a68b-ef2e-4a92-a447-94b783a81dc6"}
            ),
            CourseRequirement(
                "ATCM 2334", False, {"id": "83258a8d-c71c-44e4-b713-a1e63fcf50cf"}
            ),
        ],
        2,
        3
    )

    for course in [
        "ATCM 2330",
        "ATCM 2303",
    ]:
        assert req_with_valid_hrs_requirement.attempt_fulfill(course)

    assert req_with_valid_hrs_requirement.is_fulfilled() == True


    dat = {
            "matcher": "MultiGroupElectiveRequirement",
            "requirement_count": 2,
            "requirements": [
              {
                "matcher": "SomeRequirement",
                "requirements": [
                  {
                    "matcher": "CourseRequirement",
                    "course": "ATCM 3305",
                    "metadata": { "id": "006c6d6c-14e3-4fe6-bb62-719c77907f82" }
                  },
                  {
                    "matcher": "CourseRequirement",
                    "course": "ATCM 3306",
                    "metadata": { "id": "6c34c3cc-e826-4e2e-a3e4-e409025a9811" }
                  },
                ],
                "metadata": {
                  "id": "eb2f3604-fca7-4981-abe1-5bb9fadfc6f6"
                }
              },
              {
                "matcher": "SomeRequirement",
                "requirements": [
                  {
                    "matcher": "CourseRequirement",
                    "course": "ATCM 3315",
                    "metadata": { "id": "6af07aa1-deb4-45c3-abf4-95e068eb3647" }
                  },
                  {
                    "matcher": "CourseRequirement",
                    "course": "ATCM 3320",
                    "metadata": { "id": "9bacebdb-4400-4e14-8b26-a9ad121399ca" }
                  },
                ],
                "metadata": {
                  "id": "7ad01eac-fe39-4112-917d-cd224ec64894"
                }
              },
              {
                "matcher": "SomeRequirement",
                "requirements": [
                  {
                    "matcher": "CourseRequirement",
                    "course": "ATCM 3336",
                    "metadata": { "id": "6bb2b9e7-c062-4ac6-ba71-51ccc46eb04a" }
                  },
                  {
                    "matcher": "CourseRequirement",
                    "course": "ATCM 3337",
                    "metadata": { "id": "b4f1e2d5-1686-4ecc-855c-8f3d929c41bd" }
                  },
                ],
                "metadata": {
                  "id": "4597d751-626f-43cf-b168-a035af70651f"
                }
              },
              {
                "matcher": "SomeRequirement",
                "requirements": [
                  {
                    "matcher": "CourseRequirement",
                    "course": "ATCM 3346",
                    "metadata": { "id": "9cff514f-a531-4ce1-aed7-6a8356dcc092" }
                  },
                  {
                    "matcher": "CourseRequirement",
                    "course": "ATCM 3350",
                    "metadata": { "id": "c21336f9-2b76-43ab-8812-2f1e5d0923ff" }
                  },
                ],
                "metadata": {
                  "id": "37dca0a9-f954-4c04-8bec-fc93fa54539c"
                }
              }
            ],
            "minimum_hours_in_area": 6,
            "metadata": {
              "id": "4d066b30-77e1-4a17-9cea-7a3fb4246fe0"
            }
          }
    
    valid_atec_req = MultiGroupElectiveRequirement.from_json(dat) # type: ignore

    assert valid_atec_req.is_fulfilled() == False

    for course in ["ATCM 3315", "ATCM 3337", "ATCM 3336"]:
        assert valid_atec_req.attempt_fulfill(course)

    assert valid_atec_req.is_fulfilled()

    unfillable_atec_req = MultiGroupElectiveRequirement.from_json(dat) # type: ignore
    assert unfillable_atec_req.is_fulfilled() == False
    for course in ["ATCM 3315", "ATCM 3337"]:
        assert unfillable_atec_req.attempt_fulfill(course)
    assert unfillable_atec_req.is_fulfilled() == False

    
