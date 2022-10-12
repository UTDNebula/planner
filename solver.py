from collections import defaultdict

import numpy as np
from ortools.graph.python import max_flow

from utils import *


class GraduationRequirementsSolverResult:
    def __init__(self):
        self.reqs_to_courses: dict[Requirement, set[tuple[Course, int]]] = {}

    def get_unfilled_reqs(self):
        unfilled_reqs = []
        for req, req_fills in self.reqs_to_courses.items():
            hours_filled = sum(list(zip(*req_fills))[1])
            if hours_filled < req.hours:
                unfilled_reqs.append((req, hours_filled))
        return unfilled_reqs

    def can_graduate(self):
        return len(self.get_unfilled_reqs()) == 0

    def __str__(self):
        str_bldr = []
        for req, req_fills in self.reqs_to_courses.items():
            hours_filled = sum(list(zip(*req_fills))[1])
            str_bldr.append(f'{req.name} ({hours_filled}/{req.hours} hrs filled)\n')

            for course, hours in sorted(req_fills):
                # Display how many hours were used if the course did not go entirely into one req
                if hours != course.hours:
                    hours_string = f' ({hours}/{course.hours} hrs used)'
                else:
                    hours_string = ''
                str_bldr.append(f'  {course.name}{hours_string}\n')
        return ''.join(str_bldr)


class GraduationRequirementsSolver:
    def __init__(self):
        self.requirements: dict[str, Requirement] = {}
        self.groups: list[list[Requirement]] = []
        self.views: dict[str, list[Requirement]] = {}

    def validate(self):
        """Ensures that all REQUIREMENT are used in GROUP and VIEW"""
        # TODO: ensure no duplicates
        requirements_names = set(self.requirements.keys())
        groups_names = set(req.name for group in self.groups for req in group)
        views_names = set(req.name for group in self.views.values() for req in group)

        return requirements_names == groups_names == views_names

    def load_requirements_from_file(self, filename):
        req_file = open(filename, 'r')

        defines = {}
        for i, line in enumerate(req_file, start=1):
            line = line.strip()

            # Skip comments
            if line.startswith('#') or not line:
                continue

            # Process commands
            command: str
            args: str
            command, args = line.split(maxsplit=1)
            match command:
                case 'DEFINE':
                    k, v = args.split(maxsplit=1)
                    # Unpack defines before adding, to prevent ever having to unpack multiple layers
                    v = GraduationRequirementsSolver._unpack_defines(defines, v)
                    defines[k] = v

                case 'REQUIREMENT':
                    # Split the requirement name with the rest of the args
                    if args[0] == '"':
                        # Handle view names wrapped in quotes (because they might have spaces)
                        end_quote_idx = args.index('"', 1)
                        if end_quote_idx == -1:
                            raise ParseException("VIEW name contains start quote but no end quote found")
                        req_name, args = args[1:end_quote_idx], args[end_quote_idx + 1:].strip()
                    else:
                        req_name, args = args.split(maxsplit=1)

                    # Parse all components
                    req_key, req_hrs, matcher_str = args.split(maxsplit=2)
                    req_hrs = int(req_hrs)  # ASSUMPTION: No FP hour requirements
                    matcher_str = GraduationRequirementsSolver._unpack_defines(defines, matcher_str)
                    matcher = GraduationRequirementsSolver._parse_matcher_str(matcher_str)
                    # Build and store requirement
                    requirement = Requirement(req_name, req_hrs, matcher)
                    self.requirements[req_key] = requirement

                case 'GROUP':
                    group_reqs: list[Requirement] = []
                    for req_key in args.split():
                        if req_key not in self.requirements:
                            raise ParseException(
                                f"Unknown Requirement key {req_key} encountered")
                        group_reqs.append(self.requirements[req_key])
                    self.groups.append(group_reqs)

                case _:
                    raise ParseException(f'"{command}" is not a supported command.')

        req_file.close()
        self.validate()

    def solve(self, courses: list[Course]):
        result = GraduationRequirementsSolverResult()

        # Run max flow on all groups
        for i, reqs in enumerate(self.groups, start=1):
            print(f'\nRunning on requirement group {i}/{len(self.groups)}...')
            reqs_to_courses = GraduationRequirementsSolver._solve_group(courses, reqs)
            result.reqs_to_courses |= reqs_to_courses

        return result

    @staticmethod
    def _solve_group(courses: list[Course], reqs: list[Requirement]) -> dict[Requirement, set[tuple[Course, int]]]:
        # Define some IDs and ID offsets/prefixes to use for the graph
        SOURCE = 0
        SINK = 1
        COURSE_OFFSET = 1000  # First course will have node ID 1000
        REQ_OFFSET = 2000  # First req will have node ID 2000

        smf = max_flow.SimpleMaxFlow()

        # Add source -> course nodes, with hour capacity
        smf.add_arcs_with_capacity(
            np.repeat(SOURCE, len(courses)),
            np.array(range(COURSE_OFFSET, COURSE_OFFSET + len(courses))),
            np.array([c.hours for c in courses]),
        )

        # Add req -> sink nodes, with hour capacity
        smf.add_arcs_with_capacity(
            np.array(range(REQ_OFFSET, REQ_OFFSET + len(reqs))),
            np.repeat(SINK, len(reqs)),
            np.array([r.hours for r in reqs]),
        )

        # Add course -> req nodes, with "infinite" capacity
        for i, course in enumerate(courses):
            for j, req in enumerate(reqs):
                if req.match(course):
                    smf.add_arc_with_capacity(COURSE_OFFSET + i, REQ_OFFSET + j, 1000)

        # Solve max flow
        status = smf.solve(SOURCE, SINK)
        if status != smf.OPTIMAL:
            raise Exception(f'There was an issue with the max flow input.\nStatus: {status}')

        # Go through the arcs and aggregate them by course and req
        reqs_to_courses: dict[Requirement, set] = defaultdict(set)
        for i in range(smf.num_arcs()):
            if smf.flow(i) > 0 and smf.tail(i) != SOURCE and smf.head(i) != SINK:
                course_id = smf.tail(i) - COURSE_OFFSET
                course = courses[course_id]
                req_id = smf.head(i) - REQ_OFFSET
                req = reqs[req_id]
                hours = smf.flow(i)
                reqs_to_courses[req].add((course, hours))

        # Return solution graph
        return reqs_to_courses

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
                arg = ''.join(arg)
            # Add arg to builder
            if not stack or type(stack[-1]) != Matcher.Builder:
                raise ParseException("Unexpected comma or close parentheses")
            stack[-1].add_arg(arg)

        for i, c in enumerate(matcher_str):
            # End of matcher type: Create builder
            if c == '(':
                if not stack or type(stack[-1]) != list:
                    raise ParseException("Unexpected open parentheses")
                if len(stack) >= 2 and type(stack[-2]) != Matcher.Builder:
                    raise ParseException("Unexpected new matcher")
                stack[-1] = Matcher.Builder(''.join(stack[-1]))

            # End of arg: Create builder
            elif c == ',':
                process_end_of_arg()

            # End of matcher arg(s)
            elif c == ')':
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
