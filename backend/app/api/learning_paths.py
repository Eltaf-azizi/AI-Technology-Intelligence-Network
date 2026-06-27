from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import LearningPathRequest, LearningPathResponse
from app.agents.agents import LearningAgent

router = APIRouter(tags=["learning"])


@router.post("/learning/generate", response_model=LearningPathResponse)
async def generate_learning_path(req: LearningPathRequest, db: Session = Depends(get_db)):
    return LearningPathResponse(**LearningAgent.generate_path(db, goal=req.goal, current_skills=req.current_skills, time_available=req.time_available, difficulty=req.difficulty))
