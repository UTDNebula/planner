from requirements import REQUIREMENTS_MAP
import json


# just make sure none of the matchers throw an error
def test_computer_science() -> None:
    data = json.loads(open("./degree_data/computer_science.json", "r").read())

    requirements = data["requirements"]["major"]

    # make sure all requirements are parseable
    for requirement in requirements:
        REQUIREMENTS_MAP[requirement["matcher"]].from_json(requirement)


def test_accounting() -> None:
    data = json.loads(open("./degree_data/accounting.json", "r").read())

    requirements = data["requirements"]["major"]

    # make sure all requirements are parseable
    for requirement in requirements:
        REQUIREMENTS_MAP[requirement["matcher"]].from_json(requirement)


"""Add tests for:

Business administration & all the variants
Business analytics
Finanace
Global business and all the variants
Healthcare Management and all the variants
Information Technology and Systems
Marketing
Supply Chain Management
All the double majors

"""
