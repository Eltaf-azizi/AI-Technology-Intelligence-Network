from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import CareerResponse, CareerList
from app.services.knowledge_graph import CareerService

router = APIRouter(tags=["careers"])


@router.get("/careers", response_model=CareerList)
async def list_careers(db: Session = Depends(get_db)):
    careers = CareerService.get_all(db)
    return CareerList(careers=careers, total=len(careers))


@router.get("/careers/{career_id}", response_model=CareerResponse)
async def get_career(career_id: int, db: Session = Depends(get_db)):
    career = CareerService.get_by_id(db, career_id)
    if not career:
        raise HTTPException(status_code=404, detail="Career not found")
    return career


@router.get("/careers/{career_id}/path")
async def get_career_path(career_id: int, db: Session = Depends(get_db)):
    result = CareerService.get_path(db, career_id)
    if not result:
        raise HTTPException(status_code=404, detail="Career not found")
    return result
