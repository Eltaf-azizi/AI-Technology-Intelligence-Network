from fastapi import APIRouter, HTTPException
from app.models import Relationship

router = APIRouter()

relationships_db = [
    Relationship(source="python", target="machine-learning", type="used-in", strength=95),
    Relationship(source="python", target="deep-learning", type="used-in", strength=90),
    Relationship(source="machine-learning", target="deep-learning", type="subset-of", strength=95),
    Relationship(source="deep-learning", target="computer-vision", type="used-in", strength=92),
    Relationship(source="deep-learning", target="nlp", type="used-in", strength=88),
    Relationship(source="javascript", target="typescript", type="superset-of", strength=90),
    Relationship(source="javascript", target="react", type="used-in", strength=95),
    Relationship(source="docker", target="kubernetes", type="precedes", strength=88),
    Relationship(source="docker", target="mlops", type="used-in", strength=85),
    Relationship(source="networking", target="cybersecurity", type="foundation-for", strength=85),
    Relationship(source="networking", target="cloud-computing", type="foundation-for", strength=80),
    Relationship(source="linux", target="docker", type="prerequisite", strength=85),
    Relationship(source="linux", target="kubernetes", type="prerequisite", strength=80),
    Relationship(source="statistics", target="data-science", type="foundation-for", strength=90),
    Relationship(source="statistics", target="machine-learning", type="foundation-for", strength=85),
    Relationship(source="mathematics", target="statistics", type="foundation-for", strength=80),
    Relationship(source="linear-algebra", target="machine-learning", type="foundation-for", strength=88),
    Relationship(source="linear-algebra", target="deep-learning", type="foundation-for", strength=90),
    Relationship(source="nlp", target="llm-engineering", type="foundation-for", strength=92),
    Relationship(source="llm-engineering", target="rag", type="uses", strength=90),
    Relationship(source="cloud-computing", target="aws", type="includes", strength=90),
    Relationship(source="cloud-computing", target="mlops", type="used-in", strength=80),
    Relationship(source="sql", target="data-engineering", type="used-in", strength=85),
    Relationship(source="git", target="ci-cd", type="used-in", strength=85),
]

@router.get("", response_model=list[Relationship])
async def get_all_relationships():
    return relationships_db

@router.get("/technology/{tech_id}")
async def get_relationships_for_technology(tech_id: str):
    return [r for r in relationships_db if r.source == tech_id or r.target == tech_id]
