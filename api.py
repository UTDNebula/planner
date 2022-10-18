from collections import defaultdict
from flask import Flask, request

from solver import GraduationRequirementsSolver
from utils import Course, SingleAssignment

# Enumerate degree plans available in requirements/. No auto detection for now.
DEGREE_PLANS = ['computer_science_ug']

# Load all degree plans
solvers = defaultdict(GraduationRequirementsSolver)
for degree_plan in set(DEGREE_PLANS):
    filename = f'requirements/{degree_plan}.req'
    solvers[degree_plan].load_requirements_from_file(filename)

app = Flask(__name__)


@app.route('/', methods=['GET'])
def root_():
    return "UTD Degree Validator API"


@app.route('/list-degree-plans', methods=['GET'])
def list_degree_plans():
    return {
        'degree_plans': DEGREE_PLANS
    }


@app.route('/validate-degree-plan', methods=['POST'])
def validate_degree_plan():
    REQUIRED_FIELDS = {'version', 'degree', 'courses', 'bypasses'}
    VERSION = '0.0'

    try:
        print('Received request')
        j = request.get_json()

        if REQUIRED_FIELDS != set(j):
            raise Exception('Unexpected top-level fields')
        if j['version'] != VERSION:
            raise Exception('Unsupported version')
        if j['degree'] not in solvers:
            raise Exception(f"Degree {j['degree']} not found")

        solver = solvers[j['degree']]
        courses = [Course.from_json(c) for c in j['courses']]
        bypasses = [SingleAssignment.from_json(b) for b in j['bypasses']]

        assignment = solver.solve(courses, bypasses)

        return assignment.to_json()
    except Exception as e:
        return {
            'message': 'Error in validate_degree_plan',
            'error': str(e),
        }
