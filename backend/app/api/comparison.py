from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import ComparisonResponse
from app.services.knowledge_graph import ComparisonService
from app.models.models import Technology

router = APIRouter(tags=["comparison"])


@router.get("/compare/available")
async def get_comparison_candidates(db: Session = Depends(get_db)):
    return {"technologies": [{"slug": t.slug, "name": t.name, "category": t.category} for t in db.query(Technology).all()]}


@router.get("/compare", response_model=ComparisonResponse)
async def compare_technologies(tech1: str = Query(...), tech2: str = Query(...), db: Session = Depends(get_db)):
    result = ComparisonService.compare(db, tech1, tech2)
    if not result:
        raise HTTPException(status_code=404, detail="One or both technologies not found")
    return result
