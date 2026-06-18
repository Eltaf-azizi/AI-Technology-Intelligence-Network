from pydantic import BaseModel
from typing import List, Optional

class Technology(BaseModel):
    id: str
    name: str
    category: str
    description: str
    difficulty: str
    learningTime: str
    prerequisites: List[str]
    skills: List[str]
    applications: List[str]
    companies: List[str]
    futureOutlook: str
    growthRate: int
    popularity: int
    icon: str
    color: str

class Relationship(BaseModel):
    source: str
    target: str
    type: str
    strength: int

class Career(BaseModel):
    id: str
    title: str
    description: str
    demand: str
    salaryRange: str
    skills: List[str]
    learningOrder: List[str]
    projects: List[str]
    estimatedTime: str
    growth: int

class TrendData(BaseModel):
    name: str
    category: str
    growth: int
    momentum: int
    stage: str

class MentorRequest(BaseModel):
    message: str
    context: Optional[List[dict]] = None

class MentorResponse(BaseModel):
    response: str
    technologies: Optional[List[str]] = None

class ResearchPaper(BaseModel):
    id: str
    title: str
    year: str
    field: str
    summary: str
    technologies: List[str]
    concepts: List[str]
    relatedTechnologies: List[str]
