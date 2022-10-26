from collections import defaultdict
from flask import Flask, request, make_response
from flask_limiter import Limiter, RequestLimit
from flask_limiter.util import get_remote_address
from flask_cors import CORS

from solver import GraduationRequirementsSolver
from utils import Course, SingleAssignment

# Enumerate degree plans available in requirements/. No auto detection for now.
DEGREE_PLANS = ['computer_science_ug']

# Load all degree plans
solvers = defaultdict(GraduationRequirementsSolver)
for degree_plan in set(DEGREE_PLANS):
    filename = f'requirements/{degree_plan}.req'
    solvers[degree_plan].load_requirements_from_file(filename)


def ratelimit_callback(request_limit: RequestLimit):
    print(f"RATELIMIT_BREACH key({request_limit.key})")
    return make_response({
        'message': "Ratelimit exceeded. If you believe you need a higher limit, please contact a developer.",
    }, 429)


# Instantiate flask app and ratelimiter
app = Flask(__name__)
CORS(app)
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["100/hour"],
    headers_enabled=True,
    storage_uri="redis://localhost:6379",  # TODO: read from environment variable
    on_breach=ratelimit_callback,
)


@app.route('/', methods=['GET'])
def root_():
    return make_response({
        'message': "UTD Degree Validator API is online.",
    }, 200)


@app.route('/list-degree-plans', methods=['GET'])
def list_degree_plans():
    return make_response({
        'message': f"Supported degree plans.",
        'degree_plans': DEGREE_PLANS
    }, 200)


@app.route('/validate-degree-plan', methods=['POST'])
@limiter.limit('1/2 second;100/hour;200/day')
def validate_degree_plan():
    REQUIRED_FIELDS = {'degree', 'courses', 'bypasses'}

    try:
        print('Received request')
        j = request.get_json()

        if REQUIRED_FIELDS != set(j):
            raise Exception('Unexpected top-level fields')
        if j['degree'] not in solvers:
            raise Exception(f"Degree {j['degree']} not found")

        solver = solvers[j['degree']]
        courses = [Course.from_json(c) for c in j['courses']]
        bypasses = [SingleAssignment.from_json(b) for b in j['bypasses']]

        assignment = solver.solve(courses, bypasses)

        return make_response(assignment.to_json(), 200)

    except Exception as e:
        return make_response({
            'message': 'Error in validate-degree-plan',
            'error': str(e),
        }, 400)
