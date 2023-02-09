from major.requirements.edge_cases.computer_science import (
    MajorGuidedElectiveRequirement,
)
from major.requirements import CourseRequirement
import json


def test_or_requirement() -> None:
    req = MajorGuidedElectiveRequirement(
        3,
        "CS 43",
        [
            CourseRequirement("HIST 1301"),
            CourseRequirement("HIST 1302"),
        ],
    )

    assert req.attempt_fulfill("HIST 1301")
    assert req.attempt_fulfill("HIST 1302")
    assert not req.attempt_fulfill("HIST 1302")
    req.attempt_fulfill("CS 3000")

    assert req.is_fulfilled() == False

    req.attempt_fulfill("CS 4322")

    assert req.is_fulfilled()

    data = json.loads(
        """
        {
            "matcher": "MajorGuidedElectiveRequirement",
            "required_course_count": 3,
            "starts_with": "CS 43",
            "also_fulfills": [
                {
                    "matcher": "CourseRequirement",
                    "course": "EE 4325"
                },
                {
                    "matcher": "CourseRequirement",
                    "course": "SE 4351"
                }
            ]
        }
        """
    )

    req = MajorGuidedElectiveRequirement.from_json(data)

    req.attempt_fulfill("EE 4325")
    req.attempt_fulfill("SE 4351")
    req.attempt_fulfill("CS 4324")

    assert req.is_fulfilled()
