from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class Technology(Base):
    __tablename__ = "technologies"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(20), default="Intermediate")
    learning_time = Column(String(50), default="3-6 months")
    prerequisites = Column(JSON, default=list)
    skills = Column(JSON, default=list)
    applications = Column(JSON, default=list)
    companies = Column(JSON, default=list)
    future_outlook = Column(String(50), default="Growing")
    growth_rate = Column(Integer, default=80)
    popularity = Column(Integer, default=80)
    icon = Column(String(10), default="")
    color = Column(String(7), default="#6366f1")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    relationships_as_source = relationship("Relationship", foreign_keys="Relationship.source_id", back_populates="source_tech")
    relationships_as_target = relationship("Relationship", foreign_keys="Relationship.target_id", back_populates="target_tech")


class Relationship(Base):
    __tablename__ = "relationships"
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("technologies.id"), nullable=False)
    target_id = Column(Integer, ForeignKey("technologies.id"), nullable=False)
    type = Column(String(50), nullable=False)
    strength = Column(Integer, default=5)
    source_tech = relationship("Technology", foreign_keys=[source_id], back_populates="relationships_as_source")
    target_tech = relationship("Technology", foreign_keys=[target_id], back_populates="relationships_as_target")


class Career(Base):
    __tablename__ = "careers"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    demand = Column(String(50), default="High")
    salary_range = Column(String(100), default="$100k-$150k")
    skills = Column(JSON, default=list)
    learning_order = Column(JSON, default=list)
    projects = Column(JSON, default=list)
    estimated_time = Column(String(50), default="12-18 months")
    growth = Column(String(20), default="High")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Trend(Base):
    __tablename__ = "trends"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(100), default="General")
    growth = Column(Float, default=0.0)
    momentum = Column(String(20), default="Stable")
    stage = Column(String(30), default="Growth")
    description = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class ResearchPaper(Base):
    __tablename__ = "research_papers"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    summary = Column(Text, default="")
    technologies = Column(JSON, default=list)
    concepts = Column(JSON, default=list)
    difficulty = Column(String(20), default="Intermediate")
    file_path = Column(String(500), nullable=True)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class UserLearningProgress(Base):
    __tablename__ = "user_learning_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    technology_slug = Column(String(100), nullable=False)
    status = Column(String(20), default="not_started")
    score = Column(Integer, default=0)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    user = relationship("User")


class SavedLearningPath(Base):
    __tablename__ = "saved_learning_paths"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    goal = Column(String(200), nullable=False)
    path_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    user = relationship("User")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String(100), nullable=False)
    resource = Column(String(100), nullable=True)
    resource_id = Column(Integer, nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
