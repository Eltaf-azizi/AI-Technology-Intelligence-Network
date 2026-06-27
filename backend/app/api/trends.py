from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import TrendResponse, TrendSummary
from app.services.knowledge_graph import TrendService

router = APIRouter(tags=["trends"])


@router.get("/trends", response_model=list[TrendResponse])
async def list_trends(db: Session = Depends(get_db)):
    return TrendService.get_all(db)


@router.get("/trends/summary", response_model=TrendSummary)
async def trends_summary(db: Session = Depends(get_db)):
    return TrendService.get_summary(db)


@router.get("/trends/{stage}", response_model=list[TrendResponse])
async def get_trends_by_stage(stage: str, db: Session = Depends(get_db)):
    return TrendService.get_by_stage(db, stage)
