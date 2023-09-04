from flask import Flask, Response, request, make_response
from flask_cors import CORS

from degree_solver import BypassInput, DegreeRequirementsInput, DegreeRequirementsSolver


class APIError(Exception):
    def __init__(self, message: str, http_response_code: int = 400) -> None:
        self.message = message
        self.http_response_code = http_response_code
        super().__init__(self.message)


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


@app.route("/test-validate", methods=["POST"])
def test_validate() -> Response:
    try:
        j = request.get_json()
        if not j:
            raise APIError("bad request", 400)

        courses: list[str] = j["courses"]
        rawReqs = j["requirements"]
        requirements = DegreeRequirementsInput(rawReqs["majors"], rawReqs["minors"], [])
        rawBypasses = j["bypasses"]
        bypasses = BypassInput([], {rawReqs["majors"][0]: [i for i in rawBypasses]})
        # bypasses = [SingleAssignment.from_json(b) for b in j["bypasses"]]
        # bypasses = BypassInput([], {})

        print(bypasses)
        solver = DegreeRequirementsSolver(courses, requirements, bypasses)
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
            500,
        )
