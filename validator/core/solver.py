from __future__ import annotations
from collections import defaultdict
import numpy as np
from ortools.graph.python import max_flow
from .mock_data import MockData
from .models import (
    CoreRequirement,
    Degree,
)
from .utils import *
from dotenv import load_dotenv

from course import Course
from core.requirement import Requirement
from core.store import AssignmentStore
from core.input import SolverInput

load_dotenv()


class GraduationRequirementsSolver:
    GRANULARITY_FACTOR = 100

    input: SolverInput

    def __init__(self, input: SolverInput):
        self.input = input

    def _core_requirement_to_matcher(self, option: CoreRequirement):
        matcher: Matcher
        match option.core_flag:
            case "090":
                matcher = MockData.core_090_matcher()
            case "080":
                matcher = MockData.core_080_matcher()
            case "070":
                matcher = MockData.core_070_matcher()
            case "060":
                matcher = MockData.core_060_matcher()
            case "050":
                matcher = MockData.core_050_matcher()
            case "040":
                matcher = MockData.core_040_matcher()
            case "030":
                matcher = MockData.core_030_matcher()
            case "020":
                matcher = MockData.core_020_matcher()
            case "010":
                matcher = MockData.core_010_matcher()
            case _:
                matcher = AnyMatcher()
        return matcher

    def load_requirements_from_degree(self, degree: Degree):
        raise NotImplemented

    def solve(self, courses: list[Course], bypasses: list[SingleAssignment]):
        # Pre-process bypasses into an assignment, and validate them
        bypass_assignments = AssignmentStore()
        courses_dict: dict[str, Course] = {course.name: course for course in courses}
        for course_name, req_name, hours in bypasses:
            if course_name not in courses_dict:
                raise KeyError(
                    f"Could not find course name {course_name} specified in bypass"
                )
            if req_name not in self.input.requirements:
                raise KeyError(
                    f"Could not find requirement name {req_name} specified in bypass"
                )
            course = courses_dict[course_name]
            req = self.input.requirements[req_name]
            bypass_assignments.add(course, req, hours)

        # Initialize assignment store with all requirements
        all_assignments = AssignmentStore()
        for req in self.input.requirements.values():
            all_assignments.assert_requirement(req)

        # Run max flow on all groups and aggregate results
        for i, reqs in enumerate(self.input.requirement_groups, start=1):
            print(
                f"\nRunning on requirement group {i}/{len(self.input.requirement_groups)}..."
            )
            group_assignments = GraduationRequirementsSolver._solve_group(
                courses, reqs, bypass_assignments
            )
            all_assignments.update(group_assignments)

        # Add bypasses to the assignments
        all_assignments.update(bypass_assignments)

        return all_assignments

    @staticmethod
    def _solve_group(
        courses: list[Course], reqs: list[Requirement], bypasses: AssignmentStore
    ) -> AssignmentStore:
        """Build and solve a max flow problem"""
        # Determine pre-assigned hours after applying bypasses. Remaining hours are assignable
        bypassed_hrs = defaultdict(float)
        for req in reqs:
            if req in bypasses.reqs_to_courses:
                for course, hours in bypasses.reqs_to_courses[req].items():
                    bypassed_hrs[course] += hours
                    bypassed_hrs[req] += hours

        def get_adjusted_hours(entity: Course | Requirement):
            remaining = entity.hours - bypassed_hrs[entity]
            granulated = int(
                GraduationRequirementsSolver.GRANULARITY_FACTOR * remaining
            )
            return max(0, granulated)

        # Define some IDs and ID offsets/prefixes to use for the graph
        SOURCE = 0
        SINK = 1
        COURSE_OFFSET = 1000  # First course will have node ID 1000
        REQ_OFFSET = 2000  # First req will have node ID 2000

        smf = max_flow.SimpleMaxFlow()

        # Add source -> course nodes, with "assignable" hour capacity
        smf.add_arcs_with_capacity(
            np.repeat(SOURCE, len(courses)),
            np.array(range(COURSE_OFFSET, COURSE_OFFSET + len(courses))),
            np.array([get_adjusted_hours(c) for c in courses]),
        )

        # Add req -> sink nodes, with "assignable" hour capacity
        smf.add_arcs_with_capacity(
            np.array(range(REQ_OFFSET, REQ_OFFSET + len(reqs))),
            np.repeat(SINK, len(reqs)),
            np.array([get_adjusted_hours(r) for r in reqs]),
        )

        # Add course -> req nodes, with "infinite" capacity
        for i, req in enumerate(reqs):
            for j, course in enumerate(courses):
                if req.match(course):
                    smf.add_arc_with_capacity(COURSE_OFFSET + j, REQ_OFFSET + i, 1000)

        # Solve max flow
        status = smf.solve(SOURCE, SINK)
        if status != smf.OPTIMAL:
            raise Exception(
                f"There was an issue with the max flow input.\nStatus: {status}"
            )

        # Go through the arcs and aggregate them by course and req
        group_assignments = AssignmentStore()
        for i in range(smf.num_arcs()):
            if smf.flow(i) > 0 and smf.tail(i) != SOURCE and smf.head(i) != SINK:
                course_id = smf.tail(i) - COURSE_OFFSET
                course = courses[course_id]
                req_id = smf.head(i) - REQ_OFFSET
                req = reqs[req_id]
                hours = smf.flow(i) / GraduationRequirementsSolver.GRANULARITY_FACTOR
                # Convert back to integer if integer, to save some formatting pain later on
                if hours == int(hours):
                    hours = int(hours)
                group_assignments.add(course, req, hours)

        # Return solution graph
        return group_assignments
