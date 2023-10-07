import json
from glob import glob
from flask import Flask, Response, request, make_response
from http import HTTPStatus
from flask_cors import CORS

from degree_solver import (
    BypassInput,
    DegreeRequirementsInput,
    DegreeRequirementsSolver,
    DegreeNotFoundException,
)


class APIError(Exception):
    def __init__(self, message: str, http_response_code: int = 400) -> None:
        self.message = message
        self.http_response_code = http_response_code
        super().__init__(self.message)


# Load the list of degree plans that we support
plans: set[str] = set()
for fname in glob("./degree_data/*/*.json"):
    with open(fname, "r") as f:
        data = json.load(f)
        plans.add(data["display_name"])


# Instantiate flask app and ratelimiter
app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def root_() -> Response:
    return make_response(
        {
            "message": "UTD Degree Validator API is online.",
        },
        200,
    )


@app.route("/get-degree-plans", methods=["GET"])
def get_degree_plans() -> Response:
    # Returns a list of degree plans that validator supports. This is just a list of the display names of all the JSON
    # plans we have.
    return make_response(
        {"message": f"Supported degree plans.", "degree_plans": list(plans)}, 200
    )


@app.route("/validate", methods=["POST"])
def validate() -> Response:
    try:
        j = request.get_json()
        if (
            not j
            or not "courses" in j
            or not "bypasses" in j
            or not "requirements" in j
            or not "majors" in j["requirements"]
            or not "minors" in j["requirements"]
        ):
            raise APIError("bad request", HTTPStatus.BAD_REQUEST)

        for major in j["requirements"]["majors"]:
            if not major in plans:
                raise APIError("unsupported degree plan", HTTPStatus.NOT_FOUND)

        courses: list[str] = j["courses"]
        year = j["requirements"]["year"]
        majors = j["requirements"]["majors"]
        majors[0] = "jfoiewfj"
        minors = j["requirements"]["minors"]
        raw_bypasses = j["bypasses"]

        requirements = DegreeRequirementsInput(year, majors, minors, [])
        bypasses = BypassInput([], {majors[0]: [i for i in raw_bypasses]})

        try:
            solver = DegreeRequirementsSolver(courses, requirements, bypasses)
        except DegreeNotFoundException:
            raise APIError("Degree plan not found!", HTTPStatus.NOT_FOUND)
        solver.solve()

        return make_response(solver.to_json(), 200)

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
            HTTPStatus.BAD_REQUEST,
        )


@app.route("/health")
def health() -> Response:
    return make_response({"ok": True}, 200)
