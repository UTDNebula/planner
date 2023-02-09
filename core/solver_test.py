from .mock_data import MockData
from .models import Degree
from .solver import *


def test_solver():
    REQUIREMENTS_FILE = "./core/requirements/computer_science_bs.req"
    DEGREE_FILE = "./core/requirements/literature_final1.json"
    # MOCK_COURSES_FCN = MockData.get_real_courses_ezhang
    MOCK_COURSES_FCN = MockData.get_real_courses_missing_physics

    g = GraduationRequirementsSolver()
    degree = Degree.parse_file(DEGREE_FILE)
    g.load_requirements_from_degree(degree)

    # g.load_requirements_from_file(REQUIREMENTS_FILE)
    result = g.solve(*MOCK_COURSES_FCN())

    unfilled_reqs = result.get_unfilled_reqs()

    if unfilled_reqs:
        print(
            "\n--------------------------------\nUnsatisfied requirements (cannot graduate):"
        )
        for req, hours in unfilled_reqs:
            print(f"  {req.name}: ({hours}/{req.hours})")

    else:
        print(
            "\n--------------------------------\nAll requirements filled. You can graduate!"
        )
