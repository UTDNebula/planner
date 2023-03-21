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
