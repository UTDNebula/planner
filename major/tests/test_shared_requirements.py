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
            "metadata": {"id": 1},
            "description": "Other Requirement"
        }
        """
    )

    other_req = OtherRequirement.from_json(data)
    assert other_req.is_fulfilled() == False

    other_req.attempt_fulfill("CS 1336")
    assert other_req.is_fulfilled() == False


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
