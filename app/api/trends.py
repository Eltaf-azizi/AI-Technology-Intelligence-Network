from fastapi import APIRouter
from app.models import TrendData

router = APIRouter()

trends_db = [
    TrendData(name="LLM Engineering", category="AI", growth=100, momentum=98, stage="Growing"),
    TrendData(name="RAG", category="AI", growth=98, momentum=95, stage="Growing"),
    TrendData(name="AI Agents", category="AI", growth=97, momentum=96, stage="Emerging"),
    TrendData(name="Computer Vision", category="AI", growth=85, momentum=78, stage="Mature"),
    TrendData(name="MLOps", category="DevOps", growth=92, momentum=88, stage="Growing"),
    TrendData(name="Cybersecurity AI", category="Security", growth=94, momentum=90, stage="Growing"),
    TrendData(name="Quantum Computing", category="Emerging", growth=88, momentum=82, stage="Emerging"),
    TrendData(name="Edge AI", category="AI", growth=90, momentum=85, stage="Growing"),
    TrendData(name="WebAssembly", category="Infrastructure", growth=75, momentum=72, stage="Growing"),
    TrendData(name="Blockchain", category="Emerging", growth=55, momentum=45, stage="Declining"),
    TrendData(name="Flutter", category="Mobile", growth=78, momentum=72, stage="Mature"),
    TrendData(name="Rust", category="Languages", growth=88, momentum=85, stage="Growing"),
    TrendData(name="Web3", category="Emerging", growth=45, momentum=38, stage="Declining"),
    TrendData(name="Kubernetes", category="DevOps", growth=82, momentum=78, stage="Mature"),
    TrendData(name="Prompt Engineering", category="AI", growth=96, momentum=92, stage="Growing"),
]

@router.get("", response_model=list[TrendData])
async def get_all_trends():
    return trends_db

@router.get("/rising")
async def get_rising_trends():
    return sorted(trends_db, key=lambda t: t.growth, reverse=True)[:5]

@router.get("/emerging")
async def get_emerging_trends():
    return [t for t in trends_db if t.stage == "Emerging"]
