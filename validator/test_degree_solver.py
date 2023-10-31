from degree_solver import BypassInput, DegreeRequirementsSolver, DegreeRequirementsInput

input = DegreeRequirementsInput(2022, ["Computer Science(BS)"], [], [])

GRADUATEABLE_COURSES = [
    "ATCM 2340",
    "COMM 1311",
    "MATH 1306",
    "BIOL 1300",
    "BIOL 1318",
    "AMS 2300",
    "AHST 1303",
    "HIST 1301",
    "HIST 1302",
    "GOVT 2306",
    "GOVT 2305",
    "BA 1310",
    "ARAB 1311",
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


solver = DegreeRequirementsSolver(
    GRADUATEABLE_COURSES,
    input,
    BypassInput([], {"Computer Science(BS)": ["Computer Science(BS)-0"]}),
)


solver.solve()

# assert not solver.can_graduate()

print(solver.to_json())
