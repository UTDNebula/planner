from collections import defaultdict
from typing import Any

from flask import Flask, Response, request, make_response

# from flask_limiter import Limiter, RequestLimit
# from flask_limiter.util import get_remote_address
from flask_cors import CORS

from core import GraduationRequirementsSolver, Course, SingleAssignment
from major.solver import MajorRequirementsSolver


class APIError(Exception):
    def __init__(self, message: str, http_response_code: int = 400) -> None:
        self.message = message
        self.http_response_code = http_response_code
        super().__init__(self.message)


# Enumerate degree plans available in requirements/. No auto detection for now.
DEGREE_PLANS = [
    "computer_science_ug",  # for backwards compatibility
    "computer_science_bs",
    "biology_bs",
]

# Load all degree plans
solvers: defaultdict[str, GraduationRequirementsSolver] = defaultdict(
    GraduationRequirementsSolver
)

for degree_plan in set(DEGREE_PLANS):
    filename = f"./core/requirements/{degree_plan}.req"
    solvers[degree_plan].load_requirements_from_file(filename)


# def _ratelimit_callback(request_limit: RequestLimit):
#     print(f"RATELIMIT_BREACH key({request_limit.key})")
#     return make_response({
#         'message': "Ratelimit exceeded. If you believe you need a higher limit, please contact a developer.",
#     }, 429)


def _validate_json_fields(
    required_fields: list[str], request_json: dict[str, Any]
) -> None:
    if set(required_fields) != set(request_json):
        raise APIError(
            f"Unexpected top-level fields in json. Expected {required_fields}.", 400
        )


def _try_get_solver(degree: str) -> GraduationRequirementsSolver:
    if degree not in solvers:
        raise APIError(f"Degree {degree} not found", 404)
    return solvers[degree]


# Instantiate flask app and ratelimiter
app = Flask(__name__)
CORS(app)
# limiter = Limiter(
#     app,
#     key_func=get_remote_address,
#     default_limits=["100/hour"],
#     headers_enabled=True,
#     storage_uri="redis://localhost:6379",  # TODO: read from environment variable
#     on_breach=_ratelimit_callback,
# )


@app.route("/", methods=["GET"])
def root_() -> Response:
    return make_response(
        {
            "message": "UTD Degree Validator API is online.",
        },
        200,
    )


@app.route("/list-degree-plans", methods=["GET"])
def list_degree_plans() -> Response:
    return make_response(
        {"message": f"Supported degree plans.", "degree_plans": DEGREE_PLANS}, 200
    )


@app.route("/get-degree-requirements", methods=["GET"])
def get_degree_requirements() -> Response:
    try:
        j = request.get_json()
        if not j:
            raise APIError("bad request", 400)

        _validate_json_fields(["degree"], j)
        solver = _try_get_solver(j["degree"])
        reqs_to_hours = {
            name: req.hours for name, req in solver.requirements_dict.items()
        }

        return make_response(
            {
                "message": f"Degree requirements and their required hours for {j['degree']}",
                "requirements": reqs_to_hours,
            },
            200,
        )

    except APIError as e:
        return make_response(
            {
                "message": "Error in get-degree-requirements",
                "error": str(e),
            },
            e.http_response_code,
        )
    except Exception as e:
        return make_response(
            {
                "message": "Error in get-degree-requirements",
                "error": str(e),
            },
            500,
        )


@app.route("/validate-degree-plan", methods=["POST"])
# @limiter.limit('1/2 second;100/hour;200/day')
def validate_degree_plan() -> Response:
    try:
        j = request.get_json()
        if not j:
            raise APIError("bad request", 400)

        _validate_json_fields(["degree", "courses", "bypasses"], j)
        solver = _try_get_solver(j["degree"])
        courses = [Course.from_json(c) for c in j["courses"]]
        bypasses = [SingleAssignment.from_json(b) for b in j["bypasses"]]

        assignment = solver.solve(courses, bypasses)

        # TODO: breaking change, wrap in json with message component
        return make_response(assignment.to_json(), 200)

    except APIError as e:
        return make_response(
            {
                "message": "Error in validate-degree-plan",
                "error": str(e),
            },
            e.http_response_code,
        )
    except Exception as e:
        return make_response(
            {
                "message": "Error in validate-degree-plan",
                "error": str(e),
            },
            500,
        )
