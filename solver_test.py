from mock_data import MockData
from solver import *

REQUIREMENTS_FILE = "requirements/computer_science_ug/definition.txt"
# MOCK_COURSES_FCN = MockData.get_real_courses_ezhang
MOCK_COURSES_FCN = MockData.get_real_courses_sguan

g = GraduationRequirementsSolver()
g.load_requirements_from_file(REQUIREMENTS_FILE)
result = g.solve(MOCK_COURSES_FCN())

print(result)

unfilled_reqs = result.get_unfilled_reqs()

if unfilled_reqs:
    print('\n--------------------------------\nUnsatisfied requirements (cannot graduate):')
    for req, hours in unfilled_reqs:
        print(f'  {req.name}: ({hours}/{req.hours})')

else:
    print('\n--------------------------------\nAll requirements filled. You can graduate!')