from solver import MajorRequirementsSolver
from requirements import AbstractRequirement, REQUIREMENTS_MAP
import json

from functools import reduce
import utils


def test_computer_science_solver() -> None:
    courses = [
        "ECS 1100",
        "CS 1200",
        "CS 1136",
        "CS 1336",
        "CS 1337",
        "CS 2305",
        "CS 2336",
        "CS 2340",
        "MATH 2413",
        "MATH 2414",
        "MATH 2418",
        "PHYS 2125",
        "PHYS 2126",
        "PHYS 2325",
        "PHYS 2326",
        "CS 3162",
        "CS 3305",
        "CS 3341",
        "CS 3345",
        "CS 3354",
        "CS 3377",
        "ECS 3390",
        "CS 4141",
        "CS 4337",
        "CS 4341",
        "CS 4347",
        "CS 4348",
        "CS 4349",
        "CS 4384",
        "CS 4485",
        "CS 4314",
        "CS 4315",
        "CS 4334",
        "CS 4336",
        "CS 4352",
        "CS 4353",
        "CS 4361",
        # "CS 4365",
        # "CS 4375",
        # "CS 4376",
        # "CS 4386",
        # "CS 4389",
        # "CS 4390",
        # "CS 4391",
        # "CS 4392",
        # "CS 4393",
        # "CS 4394",
        # "CS 4395",
        # "CS 4396",
        # "CS 4397",
        # "CS 4398",
        # "CS 4399",
        # "EE 4325",
        # "SE 4351",
        # "SE 4352",
        # "SE 4367",
        # "SE 4381",
        # "ECS 1100",
        # "CS 2305",
        # "CS 2340",
        # "CS 3305",
        # "CS 3341",
        # "CS 3345",
        # "CS 3354",
        # "CS 4141",
        # "CS 4337",
        # "CS 4341",
        # "CS 4348",
        # "CS 4349",
        # "CS 4384",
        # "CS 4485",
        # "CS 1337",
        # "CS 2305",
        # "CS 2336",
        # "CS 3305",
        # "CS 3345",
        # "CS 3354",
        # "CS 4390",
        # "CS 1337",
        # "CS 2305",
        # "CS 2336",
        # "CS 3305",
        # "CS 3345",
        # "CS 4347",
        # "CS 4348",
        # "CS 4389",
        # "CS 4393",
        # "CS 4398",
        # "CS 4389",
        # "CS 4393",
        # "CS 4398",
    ]

    print(
        "IDK"
        + str(
            reduce(
                lambda total, course: total + utils.get_hours_from_course(course),
                courses,
                0,
            )
        )
    )

    data = json.loads(open("degree_data/computer_science.json", "r").read())

    requirements_data = data["requirements"]["major"]

    requirements: list[AbstractRequirement] = []

    for req_data in requirements_data:
        requirements.append(REQUIREMENTS_MAP[req_data["matcher"]].from_json(req_data))

    solver = MajorRequirementsSolver(courses, requirements)
    solver.solve()
    solver.print()

    assert solver.can_graduate()
