from fastapi import APIRouter, HTTPException
from app.models import Relationship

router = APIRouter()

relationships_db = [
    Relationship(source="python", target="machine-learning", type="used-in", strength=95),
    Relationship(source="python", target="data-science", type="used-in", strength=92),
    Relationship(source="python", target="deep-learning", type="used-in", strength=90),
    Relationship(source="python", target="computer-vision", type="used-in", strength=85),
    Relationship(source="python", target="natural-language-processing", type="used-in", strength=88),
    Relationship(source="python", target="llm-engineering", type="used-in", strength=90),
    Relationship(source="python", target="mlops", type="used-in", strength=85),
    Relationship(source="machine-learning", target="deep-learning", type="subset-of", strength=95),
    Relationship(source="machine-learning", target="computer-vision", type="used-in", strength=85),
    Relationship(source="machine-learning", target="natural-language-processing", type="used-in", strength=85),
    Relationship(source="machine-learning", target="mlops", type="requires", strength=80),
    Relationship(source="deep-learning", target="computer-vision", type="used-in", strength=92),
    Relationship(source="deep-learning", target="natural-language-processing", type="used-in", strength=88),
    Relationship(source="deep-learning", target="llm-engineering", type="foundation-for", strength=90),
    Relationship(source="natural-language-processing", target="llm-engineering", type="foundation-for", strength=92),
    Relationship(source="llm-engineering", target="rag", type="uses", strength=90),
    Relationship(source="llm-engineering", target="prompt-engineering", type="includes", strength=85),
    Relationship(source="javascript", target="typescript", type="superset-of", strength=90),
    Relationship(source="javascript", target="react", type="used-in", strength=95),
    Relationship(source="typescript", target="react", type="used-in", strength=90),
    Relationship(source="docker", target="kubernetes", type="precedes", strength=88),
    Relationship(source="docker", target="mlops", type="used-in", strength=85),
    Relationship(source="docker", target="ci-cd", type="used-in", strength=82),
    Relationship(source="kubernetes", target="mlops", type="used-in", strength=80),
    Relationship(source="networking", target="cybersecurity", type="foundation-for", strength=85),
    Relationship(source="networking", target="cloud-computing", type="foundation-for", strength=80),
    Relationship(source="networking", target="kubernetes", type="prerequisite", strength=70),
    Relationship(source="linux", target="docker", type="prerequisite", strength=85),
    Relationship(source="linux", target="kubernetes", type="prerequisite", strength=80),
    Relationship(source="linux", target="cybersecurity", type="used-in", strength=82),
    Relationship(source="cloud-computing", target="aws", type="includes", strength=90),
    Relationship(source="cloud-computing", target="kubernetes", type="related-to", strength=75),
    Relationship(source="cloud-computing", target="mlops", type="used-in", strength=80),
    Relationship(source="statistics", target="data-science", type="foundation-for", strength=90),
    Relationship(source="statistics", target="machine-learning", type="foundation-for", strength=85),
    Relationship(source="mathematics", target="statistics", type="foundation-for", strength=80),
    Relationship(source="mathematics", target="linear-algebra", type="foundation-for", strength=85),
    Relationship(source="linear-algebra", target="machine-learning", type="foundation-for", strength=88),
    Relationship(source="linear-algebra", target="deep-learning", type="foundation-for", strength=90),
    Relationship(source="linear-algebra", target="computer-vision", type="foundation-for", strength=85),
    Relationship(source="linear-algebra", target="quantum-computing", type="foundation-for", strength=90),
    Relationship(source="data-science", target="machine-learning", type="related-to", strength=85),
    Relationship(source="data-engineering", target="data-science", type="foundation-for", strength=80),
    Relationship(source="data-engineering", target="machine-learning", type="supports", strength=75),
    Relationship(source="sql", target="data-engineering", type="used-in", strength=85),
    Relationship(source="sql", target="data-science", type="used-in", strength=80),
    Relationship(source="git", target="ci-cd", type="used-in", strength=85),
    Relationship(source="react", target="typescript", type="commonly-used-with", strength=88),
    Relationship(source="robotics", target="computer-vision", type="uses", strength=80),
    Relationship(source="robotics", target="machine-learning", type="uses", strength=75),
    Relationship(source="robotics", target="electronics", type="requires", strength=82),
    Relationship(source="electronics", target="robotics", type="foundation-for", strength=85),
    Relationship(source="cybersecurity", target="blockchain", type="related-to", strength=65),
    Relationship(source="quantum-computing", target="cybersecurity", type="impacts", strength=70),
]

@router.get("", response_model=list[Relationship])
async def get_all_relationships():
    return relationships_db

@router.get("/technology/{tech_id}")
async def get_relationships_for_technology(tech_id: str):
    return [r for r in relationships_db if r.source == tech_id or r.target == tech_id]
