from requirements import (
    CourseRequirement,
    AndRequirement,
    OrRequirement,
    FreeElectiveRequirement,
)
import json


def test_course_requirement():
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


def test_and_requirement():
    and_req = AndRequirement(
        [
            CourseRequirement("HIST 1301"),
            CourseRequirement("HIST 1302"),
        ]
    )
    and_req.attempt_fulfill("HIST 1301")
    and_req.attempt_fulfill("HIST 1302")

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

    and_req.attempt_fulfill("HIST 1301")
    and_req.attempt_fulfill("HIST 1302")

    assert and_req.is_fulfilled()


def test_or_requirement():
    or_req = OrRequirement(
        [
            CourseRequirement("HIST 1301"),
            CourseRequirement("HIST 1302"),
        ]
    )
    or_req.attempt_fulfill("HIST 1301")

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

    or_req.attempt_fulfill("HIST 1301")

    assert or_req.is_fulfilled()


def test_free_elective_requirement():
    free_elective_req = FreeElectiveRequirement(10, ["HIST 1301", "HIST 1302"])
    free_elective_req.attempt_fulfill("HIST 1301")
    free_elective_req.attempt_fulfill("HIST 1302")

    assert free_elective_req.fulfilled_hours == 0

    free_elective_req.attempt_fulfill("CS 9999")
    assert free_elective_req.fulfilled_hours == 9

    free_elective_req.attempt_fulfill("CS 9199")
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
