from __future__ import annotations
from abc import ABC


class NameDefinedClass(ABC):
    """Interface for classes hashable by a single string."""

    name: str

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, NameDefinedClass):
            raise NotImplementedError
        return self.name == other.name

    def __lt__(self, other: NameDefinedClass) -> bool:
        return self.name < other.name

    def __hash__(self) -> int:
        return hash(self.name)

    def __str__(self) -> str:
        return self.name
