from requirements import REQUIREMENTS_MAP
import json
import os


# ensure degree data's are valid
def test_degrees() -> None:
    for file in os.scandir("./degree_data"):
        data = json.loads(open(file, "r").read())

        requirements = data["requirements"]["major"]

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
