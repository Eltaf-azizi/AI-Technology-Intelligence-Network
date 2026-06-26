from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import AnalyticsDashboard
from app.services.knowledge_graph import AnalyticsService

router = APIRouter(tags=["analytics"])


@router.get("/analytics/dashboard", response_model=AnalyticsDashboard)
async def get_dashboard(db: Session = Depends(get_db)):
    return AnalyticsService.get_dashboard(db)


@router.get("/analytics/summary")
async def get_summary(db: Session = Depends(get_db)):
    data = AnalyticsService.get_dashboard(db)
    return data["summary"]
