"""Defines base classes to be used all requirements"""

from __future__ import annotations
from abc import abstractmethod, ABC
from dataclasses import dataclass
from typing import Any

from pydantic import Json


class AbstractRequirement(ABC):
    """Base class all requirements should inherit from

    When implementing, define your own TypedDict dervied type to override from_json()
    """

    @abstractmethod
    def attempt_fulfill(
        self,
        course: str,
        available_hours: int = 0,
    ) -> bool:
        pass

    @abstractmethod
    def is_fulfilled(self) -> bool:
        pass

    @abstractmethod
    def override_fill(self, index: str) -> bool:
        pass

    @dataclass
    class JSON(ABC):
        matcher: str
        metadata: dict[str, Any]

    @classmethod
    @abstractmethod
    def from_json(cls, json: Any) -> AbstractRequirement:
        """Creates a requirement from a json map
        Takes in json map with the structure of { "matcher": "SomeMatcher", ... }
        """
        pass

    @abstractmethod
    def to_json(self) -> Json[Any]:
        """Converts the requirement into JSON-serializable format
        Includes all the attributes within a Requirement class
        """
        pass
