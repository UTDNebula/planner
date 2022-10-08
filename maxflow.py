from __future__ import annotations
import re
from collections import defaultdict
import numpy as np
from ortools.graph.python import max_flow
from abc import ABC, abstractmethod


class NameDefinedClass(ABC):
    """Interface for classes defined by a single string"""
    name: str

    def __eq__(self, other: NameDefinedClass):
        return self.name == other.name

    def __lt__(self, other):
        return self.name < other.name

    def __hash__(self):
        return hash(self.name)

    def __str__(self):
        return self.name


class Course(NameDefinedClass):
    def __init__(self, name, prerequisites=None, bypass_hours=None, bypass_reqs=None, department=None,
                 parse_name=True):
        if prerequisites is None:
            prerequisites = []
        if bypass_reqs is None:
            bypass_reqs = []

        self.name = name
        self.prerequisites = prerequisites
        self.reqs = {}
        self.bypass_reqs = set(bypass_reqs)

        if parse_name:
            self.department, course_num = name.split()

            if bypass_hours is None:
                hr_str = course_num[1]
                if hr_str == 'V':
                    self.hours = 3
                else:
                    self.hours = int(hr_str)
            else:
                self.hours = bypass_hours

            self.level = int(course_num[0])
        else:
            self.department = department if department is not None else 'UNK'
            self.hours = bypass_hours if bypass_hours is not None else 0
            self.level = 0


class Requirement(NameDefinedClass):
    def __init__(self, name, hours, course_matcher: Matcher):
        self.name = name
        self.hours = hours
        self.course_matcher = course_matcher

    def match(self, course):
        if course.bypass_reqs:
            return self.name in course.bypass_reqs
        return self.course_matcher.match(course)


class Matcher(ABC):
    """Abstract class for matcher"""

    @abstractmethod
    def match(self, course: Course):
        pass


class AndMatcher(Matcher):
    def __init__(self, *matchers):
        self.matchers = matchers

    def match(self, course):
        return all(m.match(course) for m in self.matchers)


class OrMatcher(Matcher):
    def __init__(self, *matchers):
        self.matchers = matchers

    def match(self, course):
        return any(m.match(course) for m in self.matchers)


class NotMatcher(Matcher):
    def __init__(self, matcher):
        self.matcher = matcher

    def match(self, course):
        return not self.matcher.match(course)


class NameListMatcher(Matcher):
    def __init__(self, *name_list):
        self.name_list = name_list

    def match(self, course):
        return course.name in self.name_list


class RegexMatcher(Matcher):
    def __init__(self, pattern):
        self.pattern = pattern

    def match(self, course):
        return re.match(self.pattern, course.name) is not None


class LevelMatcher(Matcher):
    def __init__(self, *levels):
        self.levels = levels

    def match(self, course):
        return course.level in self.levels


class DepartmentMatcher(Matcher):
    def __init__(self, department):
        self.department = department

    def match(self, course):
        return course.department == self.department


class AnyMatcher(Matcher):
    def match(self, course):
        _ = course  # just to get linter to stop complaining
        return True


class MockData:
    @staticmethod
    def get_unrealistic_courses_1():
        course_names = ['RHET 1302', 'ECS 3390', 'MATH 2413', 'MATH 2417', 'PHYS 2325', 'PHYS 2326', 'GOVT 2305',
                        'GOVT 2306', 'MATH 2413', 'MATH 2417', 'MATH 2419', 'PHYS 2125', 'ECS 1100', 'CS 1200',
                        'CS 1136', 'CS 1336', 'CS 1337', 'CS 2305', 'CS 2336', 'CS 2340', 'MATH 2413', 'MATH 2414',
                        'MATH 2417', 'MATH 2419', 'MATH 2418', 'PHYS 2125', 'PHYS 2126', 'PHYS 2325', 'PHYS 2326',
                        'CS 3162', 'CS 3305', 'CS 3341', 'CS 3345', 'CS 3354', 'CS 3377', 'ECS 3390', 'CS 4141',
                        'CS 4337', 'CS 4341', 'CS 4347', 'CS 4348', 'CS 4349', 'CS 4384', 'CS 4485', 'CS 4314',
                        'CS 4315', 'CS 4334', 'CS 4336', 'CS 4352', 'CS 4353', 'CS 4361', 'CS 4365', 'CS 4375',
                        'CS 4376', 'CS 4386', 'CS 4389', 'CS 4390', 'CS 4391', 'CS 4392', 'CS 4393', 'CS 4394',
                        'CS 4395', 'CS 4396', 'CS 4397', 'CS 4398', 'CS 4399', 'EE 4325', 'SE 4351', 'SE 4352',
                        'SE 4367', 'SE 4381', 'ECS 1100', 'CS 2305', 'CS 2340', 'CS 3305', 'CS 3341', 'CS 3345',
                        'CS 3354', 'CS 4141', 'CS 4337', 'CS 4341', 'CS 4348', 'CS 4349', 'CS 4384', 'CS 4485',
                        'CS 1337', 'CS 2305', 'CS 2336', 'CS 3305', 'CS 3345', 'CS 3354', 'CS 4390', 'CS 1337',
                        'CS 2305', 'CS 2336', 'CS 3305', 'CS 3345', 'CS 4347', 'CS 4348', 'CS 4389', 'CS 4393',
                        'CS 4398', 'CS 4389', 'CS 4393', 'CS 4398']
        courses = [Course(c, None) for c in set(course_names)]

        engl = Course('ENGL 1301', bypass_hours=3, bypass_reqs={'Core - Communication (010)'}, department='ENGL',
                      parse_name=False)
        courses.append(engl)

        return courses

    @staticmethod
    def get_real_courses_ezhang():
        course_names = ['CS 1200', 'CS 2336', 'CS 2340', 'CS 3341', 'ECS 1100', 'AMS 2341', 'UNIV 1010', 'CS 3305',
                        'CS 4384', 'CS 3345', 'ECS 3390', 'CS 4337', 'CS 3377', 'CS 3354', 'CS 4348', 'CS 4349',
                        'CS 4375', 'AHST 2331', 'CS 4390', 'CS 4341', 'CS 4141', 'CS 4485', 'CS 3162', 'CS 4365',
                        'CS 4V98', 'CS 6378']
        courses = [Course(c, None) for c in set(course_names)]

        courses.append(Course('CS 6360', bypass_hours=3, bypass_reqs=['Major Core Courses'], department='CS',
                              parse_name=False))

        return courses

    @staticmethod
    def get_real_courses_sguan():
        course_names = ['CHEM 1405', 'CS 1336', 'CS 1337', 'CS 2305', 'CS 2336', 'ECON 2301', 'ECON 2302', 'GOVT 2305',
                        'HIST 1301', 'HIST 1302', 'MATH 2413', 'MATH 2414', 'MATH 2415', 'MATH 2418', 'MATH 2420',
                        'MUSI 1306', 'PHIL 1306', 'PHYS 2125', 'PHYS 2325', 'RHET 1302', 'CS 1200', 'CS 3341',
                        'CS 3345', 'ECS 1100', 'GOVT 2306', 'MATH 3323', 'MUSI 3120', 'UNIV 1010', 'CS 2340', 'CS 3305',
                        'CS 3377', 'CS 4365', 'PHYS 2126', 'PHYS 2326', 'CS 4347', 'CS 4348', 'CS 3162', 'CS 3354',
                        'CS 4141', 'CS 4337', 'CS 4341', 'CS 4384', 'ECS 3390', 'CS 4349', 'CS 4371', 'CS 4375',
                        'CS 4485']
        courses = [Course(c, None) for c in set(course_names)]

        courses.append(Course('CS 4390', bypass_reqs=['Computer Science Preparatory Courses']))

        return courses

    @staticmethod
    def get_cs_reqs():
        computer_science_preparatory_courses_matcher = OrMatcher(
            NameListMatcher('CS 1136', 'CS 1336', 'CS 1337', 'CS 2305', 'CS 2340', 'MATH 2418', 'PHYS 2125',
                            'PHYS 2126', 'ECS 1100', 'CS 1200'),
            OrMatcher(
                NameListMatcher('CS 2336'),
                NameListMatcher('CS 2337'),
            ),
            OrMatcher(
                NameListMatcher('MATH 2413'),
                NameListMatcher('MATH 2417'),
            ),
            OrMatcher(
                NameListMatcher('MATH 2414'),
                NameListMatcher('MATH 2419'),
            ),
            OrMatcher(
                NameListMatcher('PHYS 2325'),
                NameListMatcher('PHYS 2421'),
            ),
            OrMatcher(
                NameListMatcher('PHYS 2326'),
                NameListMatcher('PHYS 2422'),
            ),
        )

        major_core_courses_matcher = NameListMatcher('CS 3305', 'CS 4337', 'CS 4349', 'CS 4384', 'CS 4485', 'ECS 3390',
                                                     'CS 3341', 'CS 3345', 'CS 3354', 'CS 4141', 'CS 4348', 'CS 4341',
                                                     'CS 3377', 'CS 4347', 'CS 3162')

        free_electives_matcher = NotMatcher(OrMatcher(
            computer_science_preparatory_courses_matcher,
            major_core_courses_matcher
        ))

        major_guided_electives_matcher = AndMatcher(
            LevelMatcher(4),
            DepartmentMatcher('CS'),
            free_electives_matcher
        )

        lone_reqs = [
            Requirement('Upper Level Hour Requirement', 51, LevelMatcher(3, 4)),
            Requirement('Minimum Cumulative Hours', 124, AnyMatcher()),
            Requirement('Computer Science Preparatory Courses', 39, computer_science_preparatory_courses_matcher),
            Requirement('Major Core Courses', 42, major_core_courses_matcher),
            Requirement('Major Guided Electives', 9, major_guided_electives_matcher),
            Requirement('Free Electives', 10, AnyMatcher()),
        ]

        cores = [
            Requirement('Core - Communication (010)', 6,
                        NameListMatcher('ATCM 2340', 'COMM 1311', 'COMM 1315', 'ECS 3390', 'RHET 1302', 'RHET 2302')),
            Requirement('Core - Mathematics (020)', 3,
                        NameListMatcher('MATH 1306', 'MATH 1314', 'MATH 1316', 'MATH 1325', 'MATH 2306', 'MATH 2312',
                                        'MATH 2413', 'MATH 2414', 'MATH 2415', 'MATH 2417', 'PHIL 2303', 'PSY 2317',
                                        'STAT 1342', 'STAT 2332')),
            Requirement('Core - Life and Physical Sciences (030)', 6,
                        NameListMatcher('BIOL 1300', 'BIOL 1318', 'BIOL 2311', 'BIOL 2312', 'BIOL 2350', 'CGS 2301',
                                        'CHEM 1311', 'CHEM 1312', 'CHEM 1315', 'CHEM 1316', 'ENVR 2302', 'GEOG 2302',
                                        'GEOS 1303', 'GEOS 1304', 'GEOS 2302', 'GEOS 2310', 'GEOS 2321', 'GEOS 2332',
                                        'GEOS 2333', 'GEOS 2409', 'ISNS 2359', 'ISNS 2367', 'ISNS 2368', 'NATS 1311',
                                        'NATS 2330', 'NATS 2333', 'PHIL 2304', 'PHYS 1301', 'PHYS 1302', 'PHYS 2125',
                                        'PHYS 2325', 'PHYS 2326', 'PHYS 2421', 'PHYS 2422', 'PSY 2364')),
            Requirement('Core - Language, Philosophy and Culture (040)', 3, NameListMatcher('AMS 2300', 'AMS 2341',
                                                                                            'ATCM 2300', 'FILM 1303',
                                                                                            'HIST 2340', 'HIST 2341',
                                                                                            'HIST 2350', 'HIST 2360',
                                                                                            'HIST 2370', 'HUMA 1301',
                                                                                            'LIT 1301', 'LIT 2322',
                                                                                            'LIT 2329', 'LIT 2331',
                                                                                            'PHIL 1301', 'PHIL 1305',
                                                                                            'PHIL 1306', 'PHIL 2316',
                                                                                            'PHIL 2317', 'RELS 1325')),
            Requirement('Core - Creative Arts (050)', 3,
                        NameListMatcher('AHST 1303', 'AHST 1304', 'AHST 2331', 'ARTS 1301', 'DANC 1305', 'DANC 1310',
                                        'FILM 2332', 'MUSI 1306', 'MUSI 2321', 'MUSI 2322', 'PHIL 1307', 'THEA 1310')),
            Requirement('Core - American History (060)', 6,
                        NameListMatcher('HIST 1301', 'HIST 1302', 'HIST 2301', 'HIST 2330', 'HIST 2381', 'HIST 2384')),
            Requirement('Core - Government/Political Science (070)', 6,
                        NameListMatcher('GOVT 2107', 'GOVT 2305', 'GOVT 2306')),
            Requirement('Core - Social and Behavioral Sciences (080)', 3,
                        NameListMatcher('BA 1310', 'BA 1320', 'CLDP 2314', 'CRIM 1301', 'CRIM 1307', 'ECON 2301',
                                        'ECON 2302', 'GEOG 2303', 'GST 2300', 'PA 2325', 'PSY 2301', 'PSY 2314',
                                        'SOC 1301', 'SOC 2300', 'SOC 2320')),
            Requirement('Core - Component Area Option (090)', 6, NameListMatcher('ARAB 1311', 'ARAB 1312', 'ARAB 2311',
                                                                                 'ARAB 2312', 'ARHM 2340', 'ARHM 2342',
                                                                                 'ARHM 2343', 'ARHM 2344', 'CHEM 1111',
                                                                                 'CHEM 1115', 'CHIN 2311', 'CHIN 2312',
                                                                                 'EPPS 2301', 'EPPS 2302', 'FREN 1311',
                                                                                 'FREN 1312', 'FREN 2311', 'FREN 2312',
                                                                                 'GERM 1311', 'GERM 1312', 'GERM 2311',
                                                                                 'GERM 2312', 'JAPN 1311', 'JAPN 1312',
                                                                                 'JAPN 2311', 'JAPN 2312', 'KORE 2311',
                                                                                 'KORE 2312', 'MATH 1326', 'MATH 2419',
                                                                                 'SPAN 1311', 'SPAN 1312', 'SPAN 2310',
                                                                                 'SPAN 2311', 'SPAN 2312', 'ATCM 2340',
                                                                                 'COMM 1311', 'COMM 1315', 'RHET 1302',
                                                                                 'MATH 1306', 'MATH 1314', 'MATH 1316',
                                                                                 'MATH 1325', 'MATH 2306', 'MATH 2312',
                                                                                 'MATH 2413', 'MATH 2414', 'MATH 2415',
                                                                                 'MATH 2417', 'PHIL 2303', 'PSY 2317',
                                                                                 'STAT 1342', 'STAT 2332', 'BIOL 1300',
                                                                                 'BIOL 2311', 'BIOL 2312', 'BIOL 2350',
                                                                                 'CGS 2301', 'CHEM 1311', 'CHEM 1312',
                                                                                 'CHEM 1315', 'CHEM 1316', 'ENVR 2302',
                                                                                 'GEOG 2302', 'GEOS 1303', 'GEOS 1304',
                                                                                 'GEOS 2302', 'GEOS 2310', 'GEOS 2321',
                                                                                 'GEOS 2332', 'GEOS 2333', 'GEOS 2409',
                                                                                 'ISNS 2359', 'ISNS 2367', 'ISNS 2368',
                                                                                 'NATS 1311', 'NATS 2330', 'NATS 2333',
                                                                                 'PHIL 2304', 'PHYS 1301', 'PHYS 1302',
                                                                                 'PHYS 2125', 'PHYS 2325', 'PHYS 2326',
                                                                                 'PHYS 2421', 'PHYS 2422', 'PSY 2364',
                                                                                 'ATCM 2300', 'FILM 1303', 'HIST 2340',
                                                                                 'HIST 2341', 'HIST 2350', 'HIST 2360',
                                                                                 'HIST 2370', 'HUMA 1301', 'LIT 1301',
                                                                                 'LIT 2322', 'LIT 2329', 'LIT 2331',
                                                                                 'PHIL 1301', 'PHIL 1305', 'PHIL 1306',
                                                                                 'PHIL 2316', 'PHIL 2317', 'RELS 1325',
                                                                                 'AHST 1303', 'AHST 1304', 'AHST 2331',
                                                                                 'ARTS 1301', 'DANC 1305', 'DANC 1310',
                                                                                 'FILM 2332', 'MUSI 1306', 'MUSI 2321',
                                                                                 'PHIL 1307', 'THEA 1310', 'HIST 1301',
                                                                                 'HIST 1302', 'HIST 2301', 'HIST 2330',
                                                                                 'HIST 2381', 'HIST 2384', 'BA 1310',
                                                                                 'BA 1320', 'CLDP 2314', 'ECON 2301',
                                                                                 'ECON 2302', 'PSY 2301', 'PSY 2314')),
        ]

        return [(req.name, [req]) for req in lone_reqs] + [('Cores', cores)]


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
    print('\nTotal hours assigned:', smf.optimal_flow())
    print('Optimal assignments:')

    reqs_to_courses = defaultdict(set)

    # Go through the arcs and aggregate them by course and req
    for i in range(smf.num_arcs()):
        if smf.flow(i) > 0 and smf.tail(i) != SOURCE and smf.head(i) != SINK:
            course_id = smf.tail(i) - COURSE_OFFSET
            req_id = smf.head(i) - REQ_OFFSET
            hours = smf.flow(i)
            reqs_to_courses[req_id].add((course_id, hours))

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

    # Return solution graph
    return reqs_to_courses


def solve_all(course_fcn, req_fcn):
    courses = course_fcn()
    req_groups = req_fcn()

    graph = defaultdict(list)
    unfilled_reqs = []
    for name, reqs in req_groups:
        print(f'\n--------------------------------\nRunning on {name}...')
        reqs_to_courses = solve_one(courses, reqs)

        # TODO: This is pretty redundant, just convert everything to numpy arrays representing adj matrix instead
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
