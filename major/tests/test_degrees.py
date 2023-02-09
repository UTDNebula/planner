from requirements import REQUIREMENTS_MAP
import json


# just make sure none of the matchers throw an error
def test_computer_science():
    data = json.loads(open("./degree_data/computer_science.json", "r").read())

    requirements = data["requirements"]["major"]

    # make sure all requirements are parseable
    for requirement in requirements:
        REQUIREMENTS_MAP[requirement["matcher"]].from_json(requirement)
