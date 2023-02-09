from .requirement import AbstractRequirement
from typing import Type

REQUIREMENTS_MAP: dict[str, Type[AbstractRequirement]] = {
    "CousreRequirement": AbstractRequirement
}

__all__ = ["AbstractRequirement", "REQUIREMENTS_MAP"]
