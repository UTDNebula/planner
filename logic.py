# Logic for course requirement validation, with only "pick N of M" rules
from __future__ import annotations
import re
from collections import defaultdict, deque
from typing import List, Set, Deque
from abc import ABC, abstractmethod


# pretend that the courses given are the only courses available in the catalog. So, we can easily convert regex into an exact course set.

# Course = namedtuple('Course', ['name', 'hours', 'prerequisites', 'constraints', 'manual_constraints'])

class Course:
    def __init__(self, name, prerequisites=None, bypass_hours=None, bypass_constraints=None, parse_name=True):
        if prerequisites is None:
            prerequisites = []
        if bypass_constraints is None:
            bypass_constraints = []

        self.name = name
        self.prerequisites = prerequisites
        self.constraints = {}
        self.bypass_constraints = set(bypass_constraints)

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
            self.department = 'UNK'
            self.hours = bypass_hours if bypass_hours is not None else 0
            self.level = 0


class Constraint:
    def __init__(self, name, hours, course_matcher):
        self.name = name
        self.hours = hours
        self.course_matcher = course_matcher


class AndMatcher:
    def __init__(self, matchers):
        self.matchers = matchers

    def match(self, course):
        return all(m.match(course) for m in self.matchers)


class OrMatcher:
    def __init__(self, matchers):
        self.matchers = matchers

    def match(self, course):
        return any(m.match(course) for m in self.matchers)


class NameListMatcher:
    def __init__(self, name_list):
        self.name_list = name_list

    def match(self, course):
        return course in self.name_list


class RegexMatcher:
    def __init__(self, pattern):
        self.pattern = pattern

    def match(self, course):
        return re.match(self.pattern, course.name) is not None


class LevelMatcher:
    def __init__(self, levels):
        self.levels = levels

    def match(self, course):
        return course.level in self.levels


class DepartmentMatcher:
    def __init__(self, department):
        self.department = department

    def match(self, course):
        return course.department == self.department


def get_courses():
    course_names = [
        'RHET 1302',
        'ECS 3390',
        'MATH 2413',
        'MATH 2417',
        'PHYS 2325',
        'PHYS 2326',
        'GOVT 2305',
        'GOVT 2306',
        'MATH 2413',
        'MATH 2417',
        'MATH 2419',
        'PHYS 2125',
        'ECS 1100',
        'CS 1200',
        'CS 1136',
        'CS 1336',
        'CS 1337',
        'CS 2305',
        'CS 2336',
        'CS 2340',
        'MATH 2413',
        'MATH 2414',
        'MATH 2417',
        'MATH 2419',
        'MATH 2418',
        'PHYS 2125',
        'PHYS 2126',
        'PHYS 2325',
        'PHYS 2326',
        'CS 3162',
        'CS 3305',
        'CS 3341',
        'CS 3345',
        'CS 3354',
        'CS 3377',
        'ECS 3390',
        'CS 4141',
        'CS 4337',
        'CS 4341',
        'CS 4347',
        'CS 4348',
        'CS 4349',
        'CS 4384',
        'CS 4485',
        'CS 4314',
        'CS 4315',
        'CS 4334',
        'CS 4336',
        'CS 4352',
        'CS 4353',
        'CS 4361',
        'CS 4365',
        'CS 4375',
        'CS 4376',
        'CS 4386',
        'CS 4389',
        'CS 4390',
        'CS 4391',
        'CS 4392',
        'CS 4393',
        'CS 4394',
        'CS 4395',
        'CS 4396',
        'CS 4397',
        'CS 4398',
        'CS 4399',
        'EE 4325',
        'SE 4351',
        'SE 4352',
        'SE 4367',
        'SE 4381',
        'ECS 1100',
        'CS 2305',
        'CS 2340',
        'CS 3305',
        'CS 3341',
        'CS 3345',
        'CS 3354',
        'CS 4141',
        'CS 4337',
        'CS 4341',
        'CS 4348',
        'CS 4349',
        'CS 4384',
        'CS 4485',
        'CS 1337',
        'CS 2305',
        'CS 2336',
        'CS 3305',
        'CS 3345',
        'CS 3354',
        'CS 4390',
        'CS 1337',
        'CS 2305',
        'CS 2336',
        'CS 3305',
        'CS 3345',
        'CS 4347',
        'CS 4348',
        'CS 4389',
        'CS 4393',
        'CS 4398',
        'CS 4389',
        'CS 4393',
        'CS 4398',
    ]
    courses = [Course(c, None) for c in course_names]

    engl = Course('ENGL 1301', bypass_hours=3, bypass_constraints={'Core - Communication (010)'}, parse_name=False)
    courses.append(engl)

    return courses


def get_rules():
    single_group_constraints = [
        Constraint('Upper Level Hour Requirement', 51, LevelMatcher((3, 4))),
    ]

    cores = [
        Constraint('Core - Communication (010)', 6,
                   NameListMatcher(('ATCM 2340', 'COMM 1311', 'COMM 1315', 'ECS 3390', 'RHET 1302', 'RHET 2302'))),
        Constraint('Core - Mathematics (020)', 3, NameListMatcher(('MATH 1306', 'MATH 1314', 'MATH 1316', 'MATH 1325',
                                                                   'MATH 2306', 'MATH 2312', 'MATH 2413', 'MATH 2414',
                                                                   'MATH 2415', 'MATH 2417', 'PHIL 2303', 'PSY 2317',
                                                                   'STAT 1342', 'STAT 2332'))),
        Constraint('Core - Life and Physical Sciences (030)', 6, NameListMatcher(('BIOL 1300', 'BIOL 1318', 'BIOL 2311',
                                                                                  'BIOL 2312', 'BIOL 2350', 'CGS 2301',
                                                                                  'CHEM 1311', 'CHEM 1312', 'CHEM 1315',
                                                                                  'CHEM 1316', 'ENVR 2302', 'GEOG 2302',
                                                                                  'GEOS 1303', 'GEOS 1304', 'GEOS 2302',
                                                                                  'GEOS 2310', 'GEOS 2321', 'GEOS 2332',
                                                                                  'GEOS 2333', 'GEOS 2409', 'ISNS 2359',
                                                                                  'ISNS 2367', 'ISNS 2368', 'NATS 1311',
                                                                                  'NATS 2330', 'NATS 2333', 'PHIL 2304',
                                                                                  'PHYS 1301', 'PHYS 1302', 'PHYS 2125',
                                                                                  'PHYS 2325', 'PHYS 2326', 'PHYS 2421',
                                                                                  'PHYS 2422', 'PSY 2364'))),
        Constraint('Core - Language, Philosophy and Culture (040)', 3, NameListMatcher(('AMS 2300', 'AMS 2341',
                                                                                        'ATCM 2300', 'FILM 1303',
                                                                                        'HIST 2340', 'HIST 2341',
                                                                                        'HIST 2350', 'HIST 2360',
                                                                                        'HIST 2370', 'HUMA 1301',
                                                                                        'LIT 1301', 'LIT 2322',
                                                                                        'LIT 2329', 'LIT 2331',
                                                                                        'PHIL 1301', 'PHIL 1305',
                                                                                        'PHIL 1306', 'PHIL 2316',
                                                                                        'PHIL 2317', 'RELS 1325'))),
        Constraint('Core - Creative Arts (050)', 3, NameListMatcher(('AHST 1303', 'AHST 1304', 'AHST 2331', 'ARTS 1301',
                                                                     'DANC 1305', 'DANC 1310', 'FILM 2332', 'MUSI 1306',
                                                                     'MUSI 2321', 'MUSI 2322', 'PHIL 1307',
                                                                     'THEA 1310'))),
        Constraint('Core - American History (060)', 6,
                   NameListMatcher(('HIST 1301', 'HIST 1302', 'HIST 2301', 'HIST 2330', 'HIST 2381', 'HIST 2384'))),
        Constraint('Core - Government/Political Science (070)', 6,
                   NameListMatcher(('GOVT 2107', 'GOVT 2305', 'GOVT 2306'))),
        Constraint('Core - Social and Behavioral Sciences (080)', 3, NameListMatcher(('BA 1310', 'BA 1320', 'CLDP 2314',
                                                                                      'CRIM 1301', 'CRIM 1307',
                                                                                      'ECON 2301', 'ECON 2302',
                                                                                      'GEOG 2303', 'GST 2300',
                                                                                      'PA 2325', 'PSY 2301', 'PSY 2314',
                                                                                      'SOC 1301', 'SOC 2300', 'SOC 2320'
                                                                                      ))),
        Constraint('Core - Component Area Option (090)', 6, NameListMatcher(('ARAB 1311', 'ARAB 1312', 'ARAB 2311',
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
                                                                             'ECON 2302', 'PSY 2301', 'PSY 2314'))),
    ]

    return single_group_constraints, [cores]


'''
class CourseNode:
    def __init__(self, course, idx):
        self.course: Course = course
        self.idx: int = idx
        self.constraint: ConstraintNode | None = None
        self.possible_constraints: Set[ConstraintNode] = set()
        self._key: str = course.name + '-' + str(idx)

    def assigned(self):
        return self.constraint is not None

    def prunable(self):
        return len(self.possible_constraints) <= 1 or self.assigned()

    def __eq__(self, other: CourseNode):
        return self._key == other._key

    def __hash__(self):
        return hash(self._key)

    def __str__(self):
        return self._key


class ConstraintNode:
    def __init__(self, constraint: Constraint):
        self.constraint: Constraint = constraint
        self.courses: Set[CourseNode] = set()
        self.possible_courses: Set[CourseNode] = set()
        self._key: str = constraint.name

    def match(self, course_node: CourseNode):
        course = course_node.course
        return self.constraint.course_matcher.match(course) or self.constraint.name in course.bypass_constraints

    def overfillable(self):
        return len(self.possible_courses) > self.constraint.hours

    def filled(self):
        return len(self.courses) >= self.constraint.hours

    def finished(self):
        return self.filled() or len(self.possible_courses) == 0

    def prunable(self):
        return not self.overfillable() or self.filled()

    def add_course(self, course_node):
        self.possible_courses.remove(course_node)
        self.courses.add(course_node)

    def __eq__(self, other: ConstraintNode):
        return self._key == other._key

    def __hash__(self):
        return hash(self._key)

    def __str__(self):
        return self._key


def assign_course_to_constraint(course_node: CourseNode, constraint_node: ConstraintNode):
    # Assert validity
    if constraint_node.filled():
        raise Exception(f'Tried to assign course {course_node} to {constraint_node} but constraint is already filled.')
    if course_node not in constraint_node.possible_courses:
        raise Exception(f'Tried to assign course {course_node} to {constraint_node} but course is not in set of possible courses.')
    if constraint_node not in course_node.possible_constraints:
        raise Exception(f'Tried to assign course {course_node} to {constraint_node} but constraint is not in set of possible constraints.')

    # Remove edges from this course to constraints
    for possible_constraint_node in course_node.possible_constraints:
        possible_constraint_node.possible_courses.remove(course_node)
    course_node.possible_constraints.clear()

    # Assign course to correct constraint node
    constraint_node.courses.add(course_node)

    # Remove constraint from remaining courses that could have been filled into it
    if constraint_node.filled():
        for course_node in constraint_node.possible_courses:
            course_node.possible_constraints.remove(constraint_node)
        return True
    return False


def prune_courses(unassigned_course_nodes: Set[CourseNode], assigned_course_nodes: Set[CourseNode]):
    """
    Prune courses that are only eligible to be assigned to one or fewer constraints.
    Note that there may be more prune-able courses, if any constraints get filled during this process.
    :return: Whether any courses were pruned.
    """
    pruned_course = False
    for course_node in list(unassigned_course_nodes):
        if len(course_node.possible_constraints) == 1:
            constraint_node = course_node.possible_constraints.pop()
            assign_course_to_constraint(course_node, constraint_node)
        if len(course_node.possible_constraints) == 0:
            # Will hit if previous if statement is hit, or was already empty
            unassigned_course_nodes.remove(course_node)
            assigned_course_nodes.add(course_node)
            pruned_course = True

    return pruned_course


def prune_constraints(constraint_nodes: List[ConstraintNode], unassigned_course_nodes: Set[CourseNode], assigned_course_nodes: Set[CourseNode]):
    """
    Prune constraints which, even if every eligible course is assigned to it, will not be overfilled.
    Note that there may be more prune-able constraints, if any courses get assigned during this process.
    :return: Whether any courses were pruned.
    """
    pruned_constraint = False
    for constraint_node in constraint_nodes:
        if constraint_node.finished() or constraint_node.overfillable():
            continue
        # Constraint node can take all courses
        for course_node in list(constraint_node.possible_courses):
            assign_course_to_constraint(course_node, constraint_node)
        assert constraint_node.finished()
        pruned_constraint = True

    return pruned_constraint


def solve(courses: List[Course], constraints: List[Constraint]):
    # Initialize nodes
    constraint_nodes: List[ConstraintNode] = [ConstraintNode(c) for c in constraints]
    course_nodes = [CourseNode(c, idx) for c in courses for idx in range(c.hours)]

    # Join course and constraint nodes with each match() producing an edge.
    unassigned_course_nodes: Set[CourseNode] = set()  # courses that have not been assigned to a constraint yet
    assigned_course_nodes: Set[CourseNode] = set()    # courses that have been assigned to a constraint
    for course_node in course_nodes:
        for constraint_node in constraint_nodes:
            if constraint_node.match(course_node):
                course_node.possible_constraints.add(constraint_node)
                constraint_node.possible_courses.add(course_node)
            # Handle constraint bypasses
            if constraint_node.constraint.name in course_node.course.bypass_constraints:
                constraint_node.assign_course(course_node) # TODO
                course_node.constraint = constraint_node
        # Only continue to process nodes which can be assigned to a constraint
        if len(course_node.possible_constraints) == 0:
            assigned_course_nodes.add(course_node)
        else:
            unassigned_course_nodes.add(course_node)

    while prune_courses(constraint_nodes, unassigned_course_nodes, assigned_course_nodes):
        continue

    def dfs(course_node_idx=0):
        pass



def solve2(courses: List[Course], constraints: List[Constraint]):
    constraint_nodes: List[ConstraintNode] = [ConstraintNode(c) for c in constraints]
    course_nodes = [CourseNode(c, idx) for c in courses for idx in range(c.hours)]
    #
    # forward: defaultdict[CourseNode, Set[ConstraintNode]]  = defaultdict(set)
    # backward: defaultdict[ConstraintNode, Set[CourseNode]] = defaultdict(set)

    unassigned_courses: Set[CourseNode] = set()
    unassigned_constraints: Set[ConstraintNode] = set()
    for course_node in course_nodes:
        for constraint_node in constraint_nodes:
            if constraint_node.match(course_node):
                course_node.possible_constraints.add(constraint_node)
                constraint_node.possible_courses.add(course_node)

    # Determine what is prunable
    prunable = deque()
    for course_node in unassigned_courses:
        if course_node.prunable():
            prunable.append(course_node)
    for constraint_node in unassigned_constraints:
        if constraint_node.prunable():
            prunable.append(constraint_node)

    def try_prune_course(course_node: CourseNode):
        if course_node not in unassigned_courses:
            return None
        unassigned_courses.remove(course_node)

        possible_constraints = course_node.possible_constraints
        if len(possible_constraints) == 0:
            pass
        elif len(possible_constraints) == 1:
            constraint_node = possible_constraints.pop()
            constraint_node.add_course(course_node)
            if constraint_node.prunable():
                prunable.append(constraint_node)
        else:
            raise Exception(f'Unhandled prunable course: {course_node}')
        return course_node

    def try_prune_constraint(constraint: ConstraintNode):
        if constraint_node not in unassigned_constraints:
            return None
        unassigned_constraints.remove(constraint_node)

        if constraint_node.finished():
            pass
        elif not constraint_node.overfillable():
            for course_node in constraint_node.possible_courses:
                constraint_node.add_course(course_node)
                course_node.constraint = constraint_node
                course_node.constraint
        else:
            raise Exception(f'Unhandled prunable constraint: {constraint_node}')

        pass

    def try_prune():
        if not prunable:
            return None
        node = prunable.popleft()
        if type(node) == CourseNode:
            return try_prune_course(node)
        else:
            return try_prune_constraint(node)


    while forward or backward:
        # Prune as much as possible first
        while prunable:
            to_prune = prunable.popleft()
            if type(to_prune) == CourseNode:

'''


class PruneQueue:
    def __init__(self):
        self.q: Deque[Node] = deque()
        self.s: Set[Node] = set()

    def add(self, node):
        if not self.has(node):
            return False
        self.s.add(node)
        self.q.append(node)
        return True

    def pop(self):
        if not self.q:
            return None
        node = self.q.popleft()
        self.s.remove(node)
        return node

    def has(self, node):
        return node in self.s


class Node(ABC):
    def __init__(self, _key):
        self._key = _key

    @abstractmethod
    def prunable(self):
        pass

    @abstractmethod
    def prune(self, prune_queue: PruneQueue):
        pass

    def __eq__(self, other: Node):
        return self._key == other._key

    def __hash__(self):
        return hash(self._key)

    def __str__(self):
        return self._key


class CourseNode(Node):
    def __init__(self, course, idx):
        self.course: Course = course
        self.idx: int = idx
        self.constraint: ConstraintNode | None = None
        self.possible_constraints: Set[ConstraintNode] = set()
        _key: str = course.name + '-' + str(idx)


    def assigned(self):
        return self.constraint is not None

    def prunable(self):
        return len(self.possible_constraints) <= 1 or self.assigned()


class ConstraintNode:
    def __init__(self, constraint: Constraint):
        self.constraint: Constraint = constraint
        self.courses: Set[CourseNode] = set()
        self.possible_courses: Set[CourseNode] = set()
        self._key: str = constraint.name

    def match(self, course_node: CourseNode):
        course = course_node.course
        return self.constraint.course_matcher.match(course) or self.constraint.name in course.bypass_constraints

    def overfillable(self):
        return len(self.possible_courses) > self.constraint.hours

    def filled(self):
        return len(self.courses) >= self.constraint.hours

    def finished(self):
        return self.filled() or len(self.possible_courses) == 0

    def prunable(self):
        return not self.overfillable() or self.filled()

    def add_course(self, course_node):
        self.possible_courses.remove(course_node)
        self.courses.add(course_node)
