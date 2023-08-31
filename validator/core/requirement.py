from utils import hashable
import core.utils as core_utils

from course import Course


class Requirement(hashable.NameDefinedClass):
    """Requirement represents a graduation requirement (specified via REQUIRED in .req files) and is used to create edges on the graph."""

    def __init__(self, name: str, hours: float, course_matcher: core_utils.Matcher):
        self.name = name
        self.hours = hours
        self.course_matcher = course_matcher

    def match(self, course: Course) -> bool:
        return self.course_matcher.match(course)
