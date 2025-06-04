"""Requirement represents a degree requirements."""

from utils import hashable
from core import matchers

from course import Course


class Requirement(hashable.NameDefinedClass):
    """Requirement represents a graduation requirement (specified via REQUIRE in .req files).

    This is used to create edges with capacity on the graph.
    """

    def __init__(self, name: str, hours: int, course_matcher: matchers.Matcher):
        self.name = name
        self.hours = hours
        self.course_matcher = course_matcher

    def match(self, course: Course) -> bool:
        """Used to determine when edges should be created between a course and requirement."""
        return self.course_matcher.match(course)
