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

class RelationshipService:
    @staticmethod
    def get_all(db: Session) -> List[Relationship]:
        return db.query(Relationship).all()

    @staticmethod
    def get_by_technology(db: Session, tech_slug: str) -> List[Relationship]:
        tech = db.query(Technology).filter(Technology.slug == tech_slug).first()
        if not tech:
            return []
        return db.query(Relationship).filter(
            or_(Relationship.source_id == tech.id, Relationship.target_id == tech.id)
        ).all()

    @staticmethod
    def get_graph(db: Session) -> dict:
        techs = db.query(Technology).all()
        rels = db.query(Relationship).all()
        nodes = [{"id": t.slug, "name": t.name, "category": t.category, "difficulty": t.difficulty,
                  "popularity": t.popularity, "growth_rate": t.growth_rate, "icon": t.icon, "color": t.color} for t in techs]
        edges = [{"source": rel.source_tech.slug, "target": rel.target_tech.slug,
                  "type": rel.type, "strength": rel.strength} for rel in rels]
        return {"nodes": nodes, "edges": edges}

    @staticmethod
    def get_related(db: Session, tech_slug: str) -> List[dict]:
        tech = db.query(Technology).filter(Technology.slug == tech_slug).first()
        if not tech:
            return []
        rels = db.query(Relationship).filter(
            or_(Relationship.source_id == tech.id, Relationship.target_id == tech.id)
        ).all()
        result = []
        for rel in rels:
            other = rel.target_tech if rel.source_id == tech.id else rel.source_tech
            result.append({"slug": other.slug, "name": other.name, "category": other.category,
                           "icon": other.icon, "relationship_type": rel.type, "strength": rel.strength})
        return result


class CareerService:
    @staticmethod
    def get_all(db: Session) -> List[Career]:
        return db.query(Career).all()

    @staticmethod
    def get_by_id(db: Session, career_id: int) -> Optional[Career]:
        return db.query(Career).filter(Career.id == career_id).first()

    @staticmethod
    def get_path(db: Session, career_id: int) -> Optional[dict]:
        career = db.query(Career).filter(Career.id == career_id).first()
        if not career:
            return None
        steps = []
        for slug in career.learning_order:
            tech = db.query(Technology).filter(Technology.slug == slug).first()
            if tech:
                steps.append({"slug": tech.slug, "name": tech.name, "difficulty": tech.difficulty, "learning_time": tech.learning_time, "skills": tech.skills})
        return {"career": career, "steps": steps}


class TrendService:
    @staticmethod
    def get_all(db: Session) -> List[Trend]:
        return db.query(Trend).all()

    @staticmethod
    def get_by_stage(db: Session, stage: str) -> List[Trend]:
        return db.query(Trend).filter(Trend.stage.ilike(stage)).all()

    @staticmethod
    def get_summary(db: Session) -> dict:
        trends = db.query(Trend).all()
        total = len(trends)
        emerging = sum(1 for t in trends if t.stage.lower() == "emerging")
        growing = sum(1 for t in trends if t.stage.lower() == "growth")
        mature = sum(1 for t in trends if t.stage.lower() == "mature")
        declining = sum(1 for t in trends if t.stage.lower() == "declining")
        avg_growth = sum(t.growth for t in trends) / total if total > 0 else 0
        return {"total": total, "emerging": emerging, "growing": growing, "mature": mature, "declining": declining, "average_growth": round(avg_growth, 1)}

