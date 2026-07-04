from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.models import Technology, Relationship, Career, Trend, AuditLog


class TechnologyService:
    @staticmethod
    def get_all(db: Session, category: Optional[str] = None, skip: int = 0, limit: int = 50) -> List[Technology]:
        query = db.query(Technology)
        if category:
            query = query.filter(Technology.category == category)
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def get_by_slug(db: Session, slug: str) -> Optional[Technology]:
        return db.query(Technology).filter(Technology.slug == slug).first()

    @staticmethod
    def get_by_id(db: Session, tech_id: int) -> Optional[Technology]:
        return db.query(Technology).filter(Technology.id == tech_id).first()

    @staticmethod
    def search(db: Session, query: str, skip: int = 0, limit: int = 20) -> List[Technology]:
        q = f"%{query}%"
        return db.query(Technology).filter(
            or_(Technology.name.ilike(q), Technology.description.ilike(q), Technology.category.ilike(q))
        ).offset(skip).limit(limit).all()

    @staticmethod
    def get_categories(db: Session) -> List[str]:
        results = db.query(Technology.category).distinct().all()
        return sorted([r[0] for r in results])

    @staticmethod
    def count(db: Session, category: Optional[str] = None) -> int:
        query = db.query(Technology)
        if category:
            query = query.filter(Technology.category == category)
        return query.count()

    @staticmethod
    def create(db: Session, data: dict) -> Technology:
        tech = Technology(**data)
        db.add(tech); db.commit(); db.refresh(tech)
        return tech

    @staticmethod
    def delete(db: Session, tech_id: int) -> bool:
        tech = db.query(Technology).filter(Technology.id == tech_id).first()
        if not tech:
            return False
        db.query(Relationship).filter(or_(Relationship.source_id == tech_id, Relationship.target_id == tech_id)).delete()
        db.delete(tech); db.commit()
        return True

