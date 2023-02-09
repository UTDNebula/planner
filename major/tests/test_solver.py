from solver import MajorRequirementsSolver
from requirements import AbstractRequirement, REQUIREMENTS_MAP
import json


def test_computer_science_solver() -> None:
    courses = [
        "CS 1200",
        "MATH 2413",
        "MATH 2414",
        "CS 4337",
        "EE 4325",
    ]
    data = json.loads(open("degree_data/computer_science.json", "r").read())

    requirements_data = data["requirements"]["major"]

    requirements: list[AbstractRequirement] = []

    for req_data in requirements_data:
        requirements.append(REQUIREMENTS_MAP[req_data["matcher"]].from_json(req_data))

    solver = MajorRequirementsSolver(courses, requirements)
    solver.solve()
    solver.print()
