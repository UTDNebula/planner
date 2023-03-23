from typing import Any

from jsonschema import Draft7Validator, validate
from major.requirements import REQUIREMENTS_MAP
import json
from os import DirEntry, scandir
import pytest


DEGREE_DATA_FILES = list(scandir("./degree_data"))


# ensure degree data's are valid
@pytest.mark.parametrize(
    "file", DEGREE_DATA_FILES, ids=lambda file: "file={}".format(file)
)
def test_degrees(file: DirEntry[str]) -> None:
    data = json.loads(open(file, "r").read())

    requirements = data["requirements"]["major"]

    for requirement in requirements:
        REQUIREMENTS_MAP[requirement["matcher"]].from_json(requirement)

@pytest.mark.parametrize(
    "file", DEGREE_DATA_FILES, ids=lambda file: "file={}".format(file)
)
def test_degrees_include_first_year_seminar(file: DirEntry[str]) -> None:
    f = open(file, "r").read()
    data = json.loads(f)
    first_year_seminar_courses = {
        "School of Arts, Humanities, and Technology": ["ARHM 1100"],
        "School of Arts and Humanities": ["ARHM 1100"],
        "School of Natural Sciences and Mathematics": ["NATS 1101"],
        "Erik Jonsson School of Engineering and Computer Science": ["ECS 1100"],
        "Naveen Jindal School of Management": ["BCOM 1300", "BCOM 3300"],
    }

    school = data["school"]
    if school not in first_year_seminar_courses:
        return
    degree_includes_first_year_seminar = False
    for course in first_year_seminar_courses[school]:
        degree_includes_first_year_seminar = degree_includes_first_year_seminar or (course in f)
    
    assert degree_includes_first_year_seminar


@pytest.mark.parametrize(
    "file", DEGREE_DATA_FILES, ids=lambda file: "file={}".format(file)
)
def test_req_metadata(file: DirEntry[str]) -> None:
    data = json.loads(open(file, "r").read())

    requirements = data["requirements"]["major"]

    def check_metadata(requirement: dict[str, Any]) -> None:
        assert "metadata" in requirement
        assert "id" in requirement["metadata"]
        if "requirements" in requirement:
            for req in requirement["requirements"]:
                check_metadata(req)
        
    for requirement in requirements:
        check_metadata(requirement)

schema = json.loads(open(".vscode/major.schema.json", "r").read())

@pytest.mark.parametrize(
    "file", DEGREE_DATA_FILES, ids=lambda file: "file={}".format(file)
)
def test_degree_schema(file: DirEntry[str]) -> None:
    # NOTE: if this test fails, there's probably something wrong with the format of the degree data. In VSCode, make an edit to the degree data file and save it. This will trigger the schema validation, then any errors will be highlighted and displayed in the Problems tab.
    # The schema generation is kinda jank so feel free to ignore/disable this test if it's being annoying
    data = json.loads(open(file, "r").read())
    validate(
        instance=data,
        schema=schema,
        format_checker=Draft7Validator.FORMAT_CHECKER,
    )
    # TODO: Test that metadata matches up to the catalog_uri?


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
