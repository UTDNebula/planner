from degree_solver import DegreeRequirementsSolver, DegreeRequirementsInput

input = DegreeRequirementsInput(False, ["computer_science"], [], [])

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


solver = DegreeRequirementsSolver(GRADUATEABLE_COURSES, input, [])


solver.solve()

print(solver.can_graduate())
