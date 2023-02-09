from requirements.shared import CourseRequirement
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
