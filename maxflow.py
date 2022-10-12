from __future__ import annotations
from collections import defaultdict
import numpy as np
from ortools.graph.python import max_flow
from mock_data import *


def solve_one(courses, reqs):
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

    # Show results
    # print('\nTotal hours assigned:', smf.optimal_flow())
    # print('Optimal assignments:')

    # Go through the arcs and aggregate them by course and req
    reqs_to_courses = defaultdict(set)
    for i in range(smf.num_arcs()):
        if smf.flow(i) > 0 and smf.tail(i) != SOURCE and smf.head(i) != SINK:
            course_id = smf.tail(i) - COURSE_OFFSET
            req_id = smf.head(i) - REQ_OFFSET
            hours = smf.flow(i)
            reqs_to_courses[req_id].add((course_id, hours))

    # Return solution graph
    return reqs_to_courses


def print_solution(courses, reqs, reqs_to_courses):
    # Show what courses were used for each req
    for req_id in range(len(reqs)):
        course_ids = reqs_to_courses[req_id]
        req = reqs[req_id]
        courses_used = [(courses[course_id], hours) for course_id, hours in course_ids]

        course_hour_sum = sum(hours for c, hours in courses_used)
        print(f'{req.name} ({course_hour_sum}/{req.hours} hrs filled)')

        for course, hours in sorted(courses_used, key=lambda x: x[0].name):
            # Display how many hours were used if the course did not go entirely into one req
            if hours != course.hours:
                hours_string = f' ({hours}/{course.hours} hrs used)'
            else:
                hours_string = ''
            print(f'  {course.name}{hours_string}')


def solve_all(course_fcn, req_fcn):
    courses = course_fcn()
    req_groups = req_fcn()

    graph = defaultdict(list)
    unfilled_reqs = []
    for name, reqs in req_groups:
        print(f'\n--------------------------------\nRunning on {name}...')
        reqs_to_courses = solve_one(courses, reqs)
        print_solution(courses, reqs, reqs_to_courses)

        for req_id in range(len(reqs)):
            req = reqs[req_id]
            course_hour_sum = 0
            for course_id, hours in reqs_to_courses[req_id]:
                course_name = courses[course_id].name
                graph[course_name].append((req.name, hours))
                course_hour_sum += hours
            if course_hour_sum < req.hours:
                unfilled_reqs.append((req, course_hour_sum))

    print('\n--------------------------------\nFinal course assignments:')
    for course in sorted(courses, key=lambda x: x.name):
        if not graph[course.name]:
            reqs_str = 'UNUSED'
        else:
            reqs_str = ', '.join(f'{req} ({hours} hrs)' for req, hours in graph[course.name])
        print(f'{course.name}: {reqs_str}')

    if unfilled_reqs:
        print('\n--------------------------------\nUnsatisfied requirements (cannot graduate):')
        for req, hours in unfilled_reqs:
            print(f'  {req.name}: ({hours}/{req.hours})')

    else:
        print('\n--------------------------------\nAll requirements filled. You can graduate!')


solve_all(MockData.get_real_courses_sguan, MockData.get_cs_reqs)
