from pydantic import BaseModel, Field
from typing_extensions import Annotated
from enum import Enum
from typing import Literal, Union

# Adapted from:
# https://www.utdnebula.com/docs/maintainers/Nebula%20API/Models/requirement
# https://www.utdnebula.com/docs/maintainers/Nebula%20API/Models/degree


class RequirementTypes(str, Enum):
    collection = "collection"
    course = "course"
    section = "section"
    major = "major"
    minor = "minor"
    exam = "exam"
    gpa = "gpa"
    hours = "hours"
    consent = "consent"
    limit = "limit"
    core = "core"
    other = "other"


class CourseRequirement(BaseModel):
    type: Literal[RequirementTypes.course]
    class_reference: str
    minimum_grade: str


class SectionRequirement(BaseModel):
    type: Literal[RequirementTypes.section]
    section_reference: str


class MajorRequirement(BaseModel):
    type: Literal[RequirementTypes.major]
    major: str


class MinorRequirement(BaseModel):
    type: Literal[RequirementTypes.minor]
    minor: str


class ExamRequirement(BaseModel):
    type: Literal[RequirementTypes.exam]
    exam_reference: str
    minimum_score: int


class GPARequirement(BaseModel):
    type: Literal[RequirementTypes.gpa]
    minimum: float
    subset: str


class HoursRequirement(BaseModel):
    type: Literal[RequirementTypes.hours]
    required: int
    options: list[CourseRequirement]


class LimitRequirement(BaseModel):
    type: Literal[RequirementTypes.limit]
    max_hours: int


class ConsentRequirement(BaseModel):
    type: Literal[RequirementTypes.consent]
    granter: str


class CoreRequirement(BaseModel):
    type: Literal[RequirementTypes.core]
    core_flag: Literal["010"] | Literal["020"] | Literal["030"] | Literal[
        "040"
    ] | Literal["050"] | Literal["060"] | Literal["070"] | Literal["080"] | Literal[
        "090"
    ] | str
    hours: int


class OtherRequirement(BaseModel):
    type: Literal[RequirementTypes.other]
    description: str
    condition: str


class CollectionRequirement(BaseModel):
    type: Literal[RequirementTypes.collection]
    name: str
    required: int
    options: list[
        Annotated[
            Union[
                CourseRequirement,
                SectionRequirement,
                MajorRequirement,
                MinorRequirement,
                ExamRequirement,
                GPARequirement,
                HoursRequirement,
                LimitRequirement,
                ConsentRequirement,
                CoreRequirement,
                OtherRequirement,
                "CollectionRequirement",
            ],
            Field(discriminator="type"),
        ]
    ]


class Degree(BaseModel):
    _id: str
    subtype: str
    school: str
    name: str
    year: str
    abbreviation: str
    minimum_credit_hours: int
    catalog_uri: str
    requirements: CollectionRequirement
