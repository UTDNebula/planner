"""Defines base classes to be used all requirements"""

from __future__ import annotations
from abc import abstractmethod, ABC
import json

from typing import Any


class AbstractRequirement(ABC):
    """Base class all requirements should inherit from

    When implementing, define your own TypedDict dervied type to override from_json()
    """

    @abstractmethod
    def attempt_fulfill(self, course: str) -> bool:
        pass

    @abstractmethod
    def is_fulfilled(self) -> bool:
        pass

    @classmethod
    @abstractmethod
    def from_json(cls, json: Any) -> AbstractRequirement:
        """Creates a requirement from a json map
        Takes in json map with the structure of { "matcher": "SomeMatcher", ... }
        """
        pass

    @classmethod
    @abstractmethod
    def to_json(self) -> json:
        """Converts the requirement into JSON-serializable format
        Includes all the attributes within a Requirement class
        """
        pass
