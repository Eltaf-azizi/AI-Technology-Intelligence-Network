from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.models import Technology, Trend, ResearchPaper, Career


class LearningAgent:
    @staticmethod
    def generate_path(db: Session, goal: str, current_skills: List[str], time_available: str = "medium", difficulty: str = "Intermediate") -> dict:
        techs = db.query(Technology).all()
        matched = []
        for t in techs:
            score = 0
            if goal.lower() in t.name.lower(): score += 10
            if goal.lower() in t.category.lower(): score += 5
            if goal.lower() in t.description.lower(): score += 3
            for skill in current_skills:
                if skill.lower() in [s.lower() for s in t.skills]: score += 2
            if t.difficulty == difficulty: score += 1
            if score > 0:
                matched.append((score, t))
        matched.sort(key=lambda x: -x[0])
        selected = [t for _, t in matched[:8]] or techs[:6]
        time_map = {"low": "2-4 weeks", "medium": "1-3 months", "high": "3-6 months"}
        steps = [{"id": f"step-{i+1}", "technology_slug": t.slug, "name": t.name, "difficulty": t.difficulty,
                  "estimated_time": t.learning_time, "resources": [f"Official {t.name} documentation", f"Hands-on {t.name} projects"]}
                 for i, t in enumerate(selected)]
        return {"id": f"path-{hash(goal) % 10000}", "title": f"Learning Path: {goal.title()}", "goal": goal,
                "steps": steps, "total_time": time_map.get(time_available, "3-6 months"), "difficulty": difficulty}


class TrendAgent:
    @staticmethod
    def analyze_market(db: Session) -> dict:
        techs = db.query(Technology).all()
        avg = sum(t.growth_rate for t in techs) / len(techs) if techs else 0
        return {"market_health": "Booming" if avg > 80 else "Stable", "average_growth_rate": round(avg, 1),
                "hot_technologies": [t.name for t in techs if t.growth_rate >= 90],
                "trend_count": db.query(Trend).count()}


class CareerAgent:
    @staticmethod
    def analyze_career_path(db: Session, career_id: int) -> Optional[dict]:
        career = db.query(Career).filter(Career.id == career_id).first()
        if not career:
            return None
        techs = []
        for slug in career.learning_order:
            t = db.query(Technology).filter(Technology.slug == slug).first()
            if t:
                techs.append({"name": t.name, "difficulty": t.difficulty, "time": t.learning_time})
        return {"career": career.title, "demand": career.demand, "salary_range": career.salary_range,
                "estimated_time": career.estimated_time, "technologies_to_learn": techs}
