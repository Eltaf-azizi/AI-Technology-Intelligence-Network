from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: str = Field(min_length=5, max_length=120)
    password: str = Field(min_length=6, max_length=100)


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    is_admin: bool
    created_at: datetime
    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshRequest(BaseModel):
    refresh_token: str


class TechnologyBase(BaseModel):
    slug: str
    name: str
    category: str
    description: str
    difficulty: str = "Intermediate"
    learning_time: str = "3-6 months"
    prerequisites: List[str] = []
    skills: List[str] = []
    applications: List[str] = []
    companies: List[str] = []
    future_outlook: str = "Growing"
    growth_rate: int = 80
    popularity: int = 80
    icon: str = ""
    color: str = "#6366f1"


class TechnologyResponse(TechnologyBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}


class TechnologyList(BaseModel):
    technologies: List[TechnologyResponse]
    total: int
    page: int = 1
    per_page: int = 50


class RelationshipResponse(BaseModel):
    id: int
    source_id: int
    target_id: int
    type: str
    strength: int
    source_slug: str = ""
    target_slug: str = ""
    source_name: str = ""
    target_name: str = ""
    model_config = {"from_attributes": True}


class GraphResponse(BaseModel):
    nodes: List[dict]
    edges: List[dict]


class CareerResponse(BaseModel):
    id: int
    title: str
    description: str
    demand: str
    salary_range: str
    skills: List[str]
    learning_order: List[str]
    projects: List[dict]
    estimated_time: str
    growth: str
    model_config = {"from_attributes": True}


class CareerList(BaseModel):
    careers: List[CareerResponse]
    total: int


class TrendResponse(BaseModel):
    id: int
    name: str
    category: str
    growth: float
    momentum: str
    stage: str
    description: str
    model_config = {"from_attributes": True}


class TrendSummary(BaseModel):
    total: int
    emerging: int
    growing: int
    mature: int
    declining: int
    average_growth: float


class ResearchPaperResponse(BaseModel):
    id: int
    title: str
    summary: str
    technologies: List[str]
    concepts: List[str]
    difficulty: str
    uploaded_at: datetime
    model_config = {"from_attributes": True}


class MentorMessage(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str


class MentorChatRequest(BaseModel):
    message: str
    history: List[MentorMessage] = []


class MentorChatResponse(BaseModel):
    reply: str
    response: str
    suggestions: List[str] = []


class LearningPathRequest(BaseModel):
    goal: str = Field(min_length=3, max_length=200)
    current_skills: List[str] = []
    time_available: str = "medium"
    difficulty: str = "Intermediate"


class LearningPathResponse(BaseModel):
    id: str
    title: str
    goal: str
    steps: List[dict]
    total_time: str
    difficulty: str


class ComparisonResponse(BaseModel):
    tech1: str
    tech2: str
    strengths: Dict[str, str]
    weaknesses: Dict[str, str]
    use_cases: Dict[str, str]
    learning_curve: Dict[str, str]
    adoption: Dict[str, str]
    recommendation: str


class AnalyticsDashboard(BaseModel):
    summary: dict
    category_distribution: dict
    difficulty_distribution: dict
    outlook_distribution: dict
    top_by_popularity: List[dict]
    fastest_growing: List[dict]


class UserProgressResponse(BaseModel):
    id: int
    technology_slug: str
    status: str
    score: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    model_config = {"from_attributes": True}


class UserProgressUpdate(BaseModel):
    technology_slug: str
    status: str = Field(pattern="^(not_started|in_progress|completed)$")
    score: int = 0


class SavedPathResponse(BaseModel):
    id: int
    title: str
    goal: str
    path_data: dict
    created_at: datetime
    model_config = {"from_attributes": True}


class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    action: str
    resource: Optional[str] = None
    details: Optional[str] = None
    ip_address: Optional[str] = None
    created_at: datetime
    model_config = {"from_attributes": True}


class SearchResponse(BaseModel):
    technologies: List[TechnologyResponse] = []
    total: int
    query: str
