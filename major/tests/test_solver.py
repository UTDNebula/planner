from major.solver import MajorRequirementsSolver
from major.requirements import AbstractRequirement, REQUIREMENTS_MAP
import json
import copy


def test_computer_science_solver() -> None:
    MISSING_FREE_ELECTIVES = [
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
        # Major Guided Electives
        "CS 4314",
        "CS 4315",
        "CS 4334",
        # Free Electives, missing 1 hr
        "ABC 9999",
    ]

    GRADUATEABLE_COURSES = [
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
        # Major Guided Electives
        "CS 4314",
        "CS 4315",
        "CS 4334",
        # Free Electives
        "ABC 9999",
        "DEF 9199",
    ]

    data = json.loads(open("degree_data/computer_science.json", "r").read())

    requirements_data = data["requirements"]["major"]

    requirements: list[AbstractRequirement] = []

    for req_data in requirements_data:
        requirements.append(REQUIREMENTS_MAP[req_data["matcher"]].from_json(req_data))

    solver = MajorRequirementsSolver(
        MISSING_FREE_ELECTIVES, copy.deepcopy(requirements)
    ).solve()
    print(str(solver))

    assert solver.can_graduate() == False

    solver = MajorRequirementsSolver(
        GRADUATEABLE_COURSES, copy.deepcopy(requirements)
    ).solve()
    print(str(solver))

    assert solver.can_graduate()


def test_accounting_solver() -> None:
    MISSING_FREE_ELECTIVES = [
        "MATH 1325",
        "OPRE 3340",
        "ACCT 2301",
        "ACCT 2302",
        "BLAW 2301",
        "CS 2305",
        "OPRE 3360",
        "BA 1310",
        "BA 1320",
        "BCOM 1300",
        "BCOM 4300",
        "IMS 3310",
        "FIN 3320",
        "ITSS 3300",
        "OPRE 3310",
        "OBHR 3310",
        "MKT 3300",
        "ENTP 4395",
        "ACCT 3312",
        "ACCT 3331",
        "ACCT 3332",
        "ACCT 3341",
        "ACCT 3350",
        "ACCT 4334",
        "ACCT 4342",
        "BA 4090",
        "ACCT 3322",
        "ACCT 4301",
        "ACCT 4302",
        "ACCT 4336",
    ]

    GRADUATEABLE_COURSES = [
        "MATH 1325",
        "OPRE 3340",
        "ACCT 2301",
        "ACCT 2302",
        "BLAW 2301",
        "CS 2305",
        "OPRE 3360",
        "BA 1310",
        "BA 1320",
        "BCOM 1300",
        "BCOM 4300",
        "IMS 3310",
        "FIN 3320",
        "ITSS 3300",
        "OPRE 3310",
        "OBHR 3310",
        "MKT 3300",
        "ENTP 4395",
        "ACCT 3312",
        "ACCT 3331",
        "ACCT 3332",
        "ACCT 3341",
        "ACCT 3350",
        "ACCT 4334",
        "ACCT 4342",
        "BA 4090",
        "ACCT 3322",
        "ACCT 4301",
        "ACCT 4302",
        "ACCT 4336",
        "MKT 4360",
    ]

    data = json.loads(open("degree_data/accounting.json", "r").read())

    requirements_data = data["requirements"]["major"]

    requirements: list[AbstractRequirement] = []

    for req_data in requirements_data:
        requirements.append(REQUIREMENTS_MAP[req_data["matcher"]].from_json(req_data))

    solver = MajorRequirementsSolver(
        MISSING_FREE_ELECTIVES, copy.deepcopy(requirements)
    ).solve()
    print(str(solver))

    assert solver.can_graduate() == False

    solver = MajorRequirementsSolver(
        GRADUATEABLE_COURSES, copy.deepcopy(requirements)
    ).solve()
    print(str(solver))

    assert solver.can_graduate()


def test_software_engineering_solver() -> None:
    MISSING_GUIDED_ELECTIVE = [
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
        "SE 2340",
        "MATH 2415",
        "SE 3162",
        "SE 3306",
        "SE 3341",
        "SE 3345",
        "SE 3354",
        "SE 3377",
        "ECS 3390",
        "SE 4347",
        "SE 4348",
        "SE 4351",
        "SE 4352",
        "SE 4367",
        "SE 4381",
        "SE 4485",
        # Major Guided Electives, missing 2 hours
        "CS 4141",
        "CS 4314",
        "CS 4315",
        # Free Electives
        "ABC 4499",
    ]

    GRADUATEABLE_COURSES = [
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
        "SE 2340",
        "MATH 2415",
        "SE 3162",
        "SE 3306",
        "SE 3341",
        "SE 3345",
        "SE 3354",
        "SE 3377",
        "ECS 3390",
        "SE 4347",
        "SE 4348",
        "SE 4351",
        "SE 4352",
        "SE 4367",
        "SE 4381",
        "SE 4485",
        # Major Guided Electives
        "CS 4141",
        "CS 4314",
        "CS 4315",
        "CS 4334",
        "SE 4399",
        # Free Electives
        "ABC 4499",
    ]

    data = json.loads(open("degree_data/software_engineering.json", "r").read())

    requirements_data = data["requirements"]["major"]

    requirements: list[AbstractRequirement] = []

    for req_data in requirements_data:
        requirements.append(REQUIREMENTS_MAP[req_data["matcher"]].from_json(req_data))

    solver = MajorRequirementsSolver(
        MISSING_GUIDED_ELECTIVE, copy.deepcopy(requirements)
    ).solve()
    print(str(solver))

    assert solver.can_graduate() == False

    solver = MajorRequirementsSolver(
        GRADUATEABLE_COURSES, copy.deepcopy(requirements)
    ).solve()
    print(str(solver))

    assert solver.can_graduate()
