from __future__ import annotations
from collections import defaultdict, Counter
import numpy as np
from ortools.graph.python import max_flow
from .mock_data import MockData
from .models import (
    CollectionRequirement,
    CoreRequirement,
    CourseRequirement,
    Degree,
    RequirementTypes,
)
from .utils import *
from typing import List
from functools import reduce
import os
from dotenv import load_dotenv

load_dotenv()


class AssignmentStore:
    def __init__(self):
        # req -> course -> hours
        self.reqs_to_courses: dict[Requirement, dict[Course, float]] = defaultdict(
            Counter
        )

    def assert_requirement(self, requirement: Requirement):
        """Initialize requirement in store if not already initialized"""
        _ = self.reqs_to_courses[requirement]

    def add(
        self, course: Course, requirement: Requirement, hours: float, overwrite=False
    ):
        if overwrite:
            self.reqs_to_courses[requirement][course] = hours
        else:
            self.reqs_to_courses[requirement][course] += hours

    def update(self, other: AssignmentStore):
        """Merge another AssignmentStore into this one"""
        for req, req_fills in other.reqs_to_courses.items():
            # Note: abuses Counter's .update() which adds instead of replacing
            self.reqs_to_courses[req].update(req_fills)

    def get_unfilled_reqs(self):
        unfilled_reqs = []
        for req, req_fills in self.reqs_to_courses.items():
            hours_filled = self._get_req_hours_filled(req)
            if hours_filled < req.hours:
                unfilled_reqs.append((req, hours_filled))
        return unfilled_reqs

    def can_graduate(self):
        print([req[0] for req in self.get_unfilled_reqs()], "R")
        return len(self.get_unfilled_reqs()) == 0

    def to_json(self):
        return {
            req.name: {
                "courses": list_matcher_requirements(req.course_matcher),
                "hours": req.hours,
                "isfilled": self._get_req_hours_filled(req) >= req.hours,
                "validCourses": [c.name for c in req_fills.keys()],
            }
            for req, req_fills in self.reqs_to_courses.items()
        }

    def _get_req_hours_filled(self, req: Requirement):
        """Returns sum of hours filled for a requirement"""
        req_fills = self.reqs_to_courses[req]
        return sum(list(zip(*req_fills.items()))[1]) if req_fills else 0

    def __str__(self):
        str_bldr = []
        for req, req_fills in self.reqs_to_courses.items():
            hours_filled = self._get_req_hours_filled(req)
            str_bldr.append(f"{req.name} ({hours_filled}/{req.hours} hrs filled)\n")

            for course, hours in sorted(req_fills.items()):
                # Display how many hours were used if the course did not go entirely into one req
                if hours != course.hours:
                    hours_string = f" ({hours}/{course.hours} hrs used)"
                else:
                    hours_string = ""
                str_bldr.append(f"  {course.name}{hours_string}\n")
        return "".join(str_bldr)


class GraduationRequirementsSolver:
    GRANULARITY_FACTOR = 100

    def __init__(self):
        self.requirements_dict: dict[str, Requirement] = {}
        self.groups: list[list[Requirement]] = []

    def validate(self):
        """Ensures that all REQUIRE are used in GROUP"""
        # TODO: ensure no duplicates
        requirements_names = set(self.requirements_dict.keys())
        groups_names = set(req.name for group in self.groups for req in group)

        return requirements_names == groups_names

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

    def _course_requirements_to_name_list_matcher(
        self, courses: List[CourseRequirement]
    ):
        matcher = Matcher.Builder("NameList")
        # for reference in courses:
        #     course_data = requests.get(headers={"X-Api-Key": os.environ["NEBULA_API_KEY"]}, url=f"https://api.utdnebula.com/course/{reference.course_id}").json()
        #     matcher.add_arg(course_data.data.name)
        return matcher.build()

    def _collection_requirement_to_matcher(self, o: CollectionRequirement):
        # TODO: revisit matcher selection logic, this is hacky at best
        builder: Matcher.Builder = Matcher.Builder(
            "Or"
            if o.required == 1 and len(o.options) == 2
            else "And"
            if o.required == len(o.options)
            else "And"
        )
        total_hrs = 0
        # TODO: correctly tabulate total hours considering required number of options
        course_reqs: List[CourseRequirement] = []
        for option in o.options:
            hours = 0
            if option.type == RequirementTypes.core:
                matcher: Matcher = self._core_requirement_to_matcher(option)
                hours += option.hours
                builder.add_arg(matcher)
            elif option.type == RequirementTypes.collection:
                matcher, hrs = self._collection_requirement_to_matcher(option)
                total_hrs += hrs
                builder.add_arg(matcher)
            elif option.type == RequirementTypes.course:
                course_reqs.append(option)
            total_hrs += hours
        if len(course_reqs) > 0:
            builder.add_arg(self._course_requirements_to_name_list_matcher(course_reqs))
        return builder.build(), total_hrs

    def load_requirements_from_degree(self, degree: Degree):
        minimum_cumulative_hours = Requirement(
            "Minimum Cumulative Hours", degree.minimum_credit_hours, AnyMatcher()
        )
        self.requirements_dict[minimum_cumulative_hours.name] = minimum_cumulative_hours
        self.groups.append([minimum_cumulative_hours])

        for o in degree.requirements.options:
            if o.type == RequirementTypes.collection:
                # TODO: I'm assuming that every top level requirement is a collection, need to handle other requirement types too (I think only core and course requirements need to be handled)
                matcher, hours = self._collection_requirement_to_matcher(o)
                requirement = Requirement(o.name, hours, matcher)
                self.requirements_dict[o.name] = requirement
                self.groups.append([requirement])
        self.validate()

    def load_requirements_from_file(self, filename: str) -> None:
        req_file = open(filename, "r")

        defines = {}
        requirements = {}
        for i, line in enumerate(req_file, start=1):
            line = line.strip()

            # Skip comments
            if line.startswith("#") or not line:
                continue

            # Process commands
            command: str
            args: str
            command, args = line.split(maxsplit=1)
            match command:
                case "DEFINE":
                    k, v = args.split(maxsplit=1)
                    # Unpack defines before adding, to prevent ever having to unpack multiple layers
                    v = GraduationRequirementsSolver._unpack_defines(defines, v)
                    defines[k] = v

                case "REQUIRE":
                    # Split the requirement name with the rest of the args
                    if args[0] == '"':
                        # Handle req names wrapped in quotes (because they might have spaces)
                        end_quote_idx = args.index('"', 1)
                        if end_quote_idx == -1:
                            raise ParseException(
                                "REQUIRE name contains start quote but no end quote found"
                            )
                        req_name, args = (
                            args[1:end_quote_idx],
                            args[end_quote_idx + 1 :].strip(),
                        )
                    else:
                        req_name, args = args.split(maxsplit=1)

                    # Parse all components
                    req_key, req_hrs, matcher_str = args.split(maxsplit=2)
                    # ASSUMPTION: No FP hour requirements
                    req_hrs = int(req_hrs)
                    matcher_str = GraduationRequirementsSolver._unpack_defines(
                        defines, matcher_str
                    )
                    matcher = GraduationRequirementsSolver._parse_matcher_str(
                        matcher_str
                    )
                    # Build and store requirement
                    requirement = Requirement(req_name, req_hrs, matcher)
                    requirements[req_key] = requirement

                case "GROUP":
                    group_reqs: list[Requirement] = []
                    for req_key in args.split():
                        if req_key not in requirements:
                            raise ParseException(
                                f"Unknown Requirement key {req_key} encountered"
                            )
                        group_reqs.append(requirements[req_key])
                    self.groups.append(group_reqs)

                case _:
                    raise ParseException(f'"{command}" is not a supported command')

        req_file.close()

        # Store requirements keyed by requirement name, rather than the key in file
        self.requirements_dict = {r.name: r for r in requirements.values()}

        # Ensure requirements are valid
        self.validate()

    def solve(self, courses: list[str], bypasses: list[SingleAssignment]):
        # Convert list of str into list of courses
        newCourses = []
        for course in courses:
            sub_prefix, course_num = course.split(" ")
            newCourses.append(Course(course, int(course_num[0]), int(course_num[1]), sub_prefix))
        courses = newCourses

        # Pre-process bypasses into an assignment, and validate them
        bypass_assignments = AssignmentStore()
        courses_dict: dict[str, Course] = {course.name: course for course in courses}
        for course_name, req_name, hours in bypasses:
            if course_name not in courses_dict:
                raise KeyError(
                    f"Could not find course name {course_name} specified in bypass"
                )
            if req_name not in self.requirements_dict:
                raise KeyError(
                    f"Could not find requirement name {req_name} specified in bypass"
                )
            course = courses_dict[course_name]
            req = self.requirements_dict[req_name]
            bypass_assignments.add(course, req, hours)

        # Initialize assignment store with all requirements
        all_assignments = AssignmentStore()
        for req in self.requirements_dict.values():
            all_assignments.assert_requirement(req)

        # Run max flow on all groups and aggregate results
        for i, reqs in enumerate(self.groups, start=1):
            print(f"\nRunning on requirement group {i}/{len(self.groups)}...")
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

    @staticmethod
    def _unpack_defines(defines: dict[str, str], s: str):
        for k, v in defines.items():
            s = s.replace(k, v)
        return s

    @staticmethod
    def _parse_matcher_str(matcher_str: str) -> Matcher:
        """Function to parse a matcher string to a Matcher object tree"""
        stack: list[Matcher | Matcher.Builder | list] = []

        def process_end_of_arg():
            # Pop off the arg (must be Matcher or list)
            if not stack or type(stack[-1]) == Matcher.Builder:
                raise ParseException("Unexpected comma or close parentheses")
            arg = stack.pop()
            if type(arg) == list:  # Build un-combined string to string
                arg = "".join(arg)
            # Add arg to builder
            if not stack or type(stack[-1]) != Matcher.Builder:
                raise ParseException("Unexpected comma or close parentheses")
            stack[-1].add_arg(arg)

        for i, c in enumerate(matcher_str):
            # End of matcher type: Create builder
            if c == "(":
                if not stack or type(stack[-1]) != list:
                    raise ParseException("Unexpected open parentheses")
                if len(stack) >= 2 and type(stack[-2]) != Matcher.Builder:
                    raise ParseException("Unexpected new matcher")
                stack[-1] = Matcher.Builder("".join(stack[-1]))

            # End of arg: Create builder
            elif c == ",":
                process_end_of_arg()

            # End of matcher arg(s)
            elif c == ")":
                # If the previous element is a builder with no args, don't try to process arg
                if not stack or type(stack[-1]) != Matcher.Builder or stack[-1].args:
                    process_end_of_arg()
                stack[-1] = stack[-1].build()

            # Build string, which might be part of matcher type or arg
            else:
                if not stack or type(stack[-1]) != list:
                    stack.append([])
                stack[-1].append(c)

        if len(stack) != 1 or not issubclass(type(stack[0]), Matcher):
            raise ParseException("Unable to parse malformed matcher string")
        return stack[0]
