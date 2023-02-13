from major.requirements import (
    CourseRequirement,
    AndRequirement,
    OrRequirement,
    HoursRequirement,
    FreeElectiveRequirement,
    SelectRequirement,
    PrefixRequirement,
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
            "requirements": [
                {
                    "matcher": "CourseRequirement",
                    "course": "HIST 1301"
                },
                {
                    "matcher": "CourseRequirement",
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
            "requirements": [
                {
                    "matcher": "CourseRequirement",
                    "course": "HIST 1301"
                },
                {
                    "matcher": "CourseRequirement",
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

    assert hours_req.fulfilled_hours == 0
    assert hours_req.is_fulfilled() == False

    hours_req.attempt_fulfill("ACCT 3322")
    hours_req.attempt_fulfill("FFFF 1111")

    assert hours_req.fulfilled_hours == 3
    assert hours_req.is_fulfilled() == False

    hours_req.attempt_fulfill("ACCT 3322")
    assert hours_req.fulfilled_hours == 3
    assert hours_req.is_fulfilled() == False

    hours_req.attempt_fulfill("ACCT 4301")
    hours_req.attempt_fulfill("FIN 3380")
    hours_req.attempt_fulfill("FIN 3390")

    assert hours_req.fulfilled_hours == 12
    assert hours_req.is_fulfilled() == True

    hours_req.attempt_fulfill("FIN 3330")
    assert hours_req.fulfilled_hours == 12
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


def test_prefix_requirement() -> None:
    prefix_req = PrefixRequirement("CS")
    assert prefix_req.filled == False

    prefix_req.attempt_fulfill("BCOM 1000")
    assert prefix_req.filled == False

    prefix_req.attempt_fulfill("CS 1336")
    assert prefix_req.filled == True
