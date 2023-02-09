from .base import AbstractRequirement
from .shared import *
from typing import Type

REQUIREMENTS_MAP: dict[str, Type[AbstractRequirement]] = {
    "CourseRequirement": CourseRequirement,
    "AndRequirement": AndRequirement,
    "OrRequirement": OrRequirement,
}
