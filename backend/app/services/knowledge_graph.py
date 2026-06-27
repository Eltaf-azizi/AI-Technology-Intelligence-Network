from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.models import Technology, Relationship, Career, Trend, AuditLog


class TechnologyService:
    @staticmethod
    def get_all(db: Session, category: Optional[str] = None, skip: int = 0, limit: int = 50) -> List[Technology]:
        q = db.query(Technology)
        if category:
            q = q.filter(Technology.category == category)
        return q.offset(skip).limit(limit).all()

    @staticmethod
    def get_by_slug(db: Session, slug: str) -> Optional[Technology]:
        return db.query(Technology).filter(Technology.slug == slug).first()

    @staticmethod
    def search(db: Session, query: str, skip: int = 0, limit: int = 20) -> List[Technology]:
        q = f"%{query}%"
        return db.query(Technology).filter(or_(Technology.name.ilike(q), Technology.description.ilike(q), Technology.category.ilike(q))).offset(skip).limit(limit).all()

    @staticmethod
    def get_categories(db: Session) -> List[str]:
        return sorted([r[0] for r in db.query(Technology.category).distinct().all()])

    @staticmethod
    def count(db: Session, category: Optional[str] = None) -> int:
        q = db.query(Technology)
        if category:
            q = q.filter(Technology.category == category)
        return q.count()


class RelationshipService:
    @staticmethod
    def get_all(db: Session) -> List[Relationship]:
        return db.query(Relationship).all()

    @staticmethod
    def get_graph(db: Session) -> dict:
        techs = db.query(Technology).all()
        rels = db.query(Relationship).all()
        return {
            "nodes": [{"id": t.slug, "name": t.name, "category": t.category, "difficulty": t.difficulty, "popularity": t.popularity, "growth_rate": t.growth_rate, "icon": t.icon, "color": t.color} for t in techs],
            "edges": [{"source": r.source_tech.slug, "target": r.target_tech.slug, "type": r.type, "strength": r.strength} for r in rels],
        }

    @staticmethod
    def get_by_technology(db: Session, tech_slug: str) -> List[Relationship]:
        tech = db.query(Technology).filter(Technology.slug == tech_slug).first()
        if not tech:
            return []
        return db.query(Relationship).filter(or_(Relationship.source_id == tech.id, Relationship.target_id == tech.id)).all()

    @staticmethod
    def get_related(db: Session, tech_slug: str) -> List[dict]:
        tech = db.query(Technology).filter(Technology.slug == tech_slug).first()
        if not tech:
            return []
        result = []
        for rel in db.query(Relationship).filter(or_(Relationship.source_id == tech.id, Relationship.target_id == tech.id)).all():
            other = rel.target_tech if rel.source_id == tech.id else rel.source_tech
            result.append({"slug": other.slug, "name": other.name, "category": other.category, "icon": other.icon, "relationship_type": rel.type, "strength": rel.strength})
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
        return {"total": total, "emerging": sum(1 for t in trends if t.stage.lower() == "emerging"),
                "growing": sum(1 for t in trends if t.stage.lower() == "growth"),
                "mature": sum(1 for t in trends if t.stage.lower() == "mature"),
                "declining": sum(1 for t in trends if t.stage.lower() == "declining"),
                "average_growth": round(sum(t.growth for t in trends) / total, 1) if total else 0}


class AnalyticsService:
    @staticmethod
    def get_dashboard(db: Session) -> dict:
        techs = db.query(Technology).all()
        cats = {}
        for t in techs:
            c = t.category
            if c not in cats:
                cats[c] = {"count": 0, "sum_growth": 0, "sum_popularity": 0}
            cats[c]["count"] += 1; cats[c]["sum_growth"] += t.growth_rate; cats[c]["sum_popularity"] += t.popularity
        return {"summary": {"total_technologies": len(techs), "total_relationships": db.query(Relationship).count(),
                            "total_categories": len(cats), "total_careers": db.query(Career).count()},
                "category_distribution": {k: {"count": v["count"], "avg_growth": round(v["sum_growth"]/v["count"], 1), "avg_popularity": round(v["sum_popularity"]/v["count"], 1)} for k, v in sorted(cats.items())},
                "difficulty_distribution": {d: sum(1 for t in techs if t.difficulty == d) for d in sorted(set(t.difficulty for t in techs))},
                "outlook_distribution": {o: sum(1 for t in techs if t.future_outlook == o) for o in sorted(set(t.future_outlook for t in techs))},
                "top_by_popularity": [{"slug": t.slug, "name": t.name, "icon": t.icon, "popularity": t.popularity} for t in sorted(techs, key=lambda x: x.popularity, reverse=True)[:10]],
                "fastest_growing": [{"slug": t.slug, "name": t.name, "icon": t.icon, "growth_rate": t.growth_rate} for t in sorted(techs, key=lambda x: x.growth_rate, reverse=True)[:10]]}


class ComparisonService:
    @staticmethod
    def compare(db: Session, tech1_slug: str, tech2_slug: str) -> Optional[dict]:
        t1 = db.query(Technology).filter(Technology.slug == tech1_slug).first()
        t2 = db.query(Technology).filter(Technology.slug == tech2_slug).first()
        if not t1 or not t2:
            return None
        s1 = ", ".join(t1.skills[:3]) if t1.skills else str(t1.growth_rate)
        s2 = ", ".join(t2.skills[:3]) if t2.skills else str(t2.growth_rate)
        rec = t1.name if t1.popularity > t2.popularity else t2.name
        if t1.growth_rate > t2.growth_rate and t1.difficulty != "Advanced":
            rec = t1.name
        elif t2.popularity > t1.popularity + 5:
            rec = t2.name
        return {"tech1": t1.name, "tech2": t2.name, "strengths": {t1.name: s1, t2.name: s2},
                "weaknesses": {t1.name: t1.difficulty, t2.name: t2.difficulty},
                "use_cases": {t1.name: str(t1.applications[:3]), t2.name: str(t2.applications[:3])},
                "learning_curve": {t1.name: t1.learning_time, t2.name: t2.learning_time},
                "adoption": {t1.name: f"Popularity: {t1.popularity}/100", t2.name: f"Popularity: {t2.popularity}/100"},
                "recommendation": f"Based on current trends, {rec} has the edge."}


class AuditService:
    @staticmethod
    def log(db: Session, user_id: Optional[int], action: str, resource: Optional[str] = None, resource_id: Optional[int] = None, details: Optional[str] = None, ip_address: Optional[str] = None):
        entry = AuditLog(user_id=user_id, action=action, resource=resource, resource_id=resource_id, details=details, ip_address=ip_address)
        db.add(entry); db.commit(); return entry

    @staticmethod
    def get_user_logs(db: Session, user_id: int, skip: int = 0, limit: int = 50) -> List[AuditLog]:
        return db.query(AuditLog).filter(AuditLog.user_id == user_id).order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()
