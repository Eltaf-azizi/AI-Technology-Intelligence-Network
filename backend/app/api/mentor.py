from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import MentorChatRequest, MentorChatResponse
from app.services.mentor_service import MentorService

router = APIRouter(tags=["mentor"])
ms = MentorService()


@router.post("/mentor/chat", response_model=MentorChatResponse)
async def chat_with_mentor(req: MentorChatRequest, db: Session = Depends(get_db)):
    result = ms.chat(req.message, [{"role": m.role, "content": m.content} for m in req.history])
    return MentorChatResponse(reply=result["reply"], suggestions=result["suggestions"])


@router.get("/mentor/suggestions")
async def get_mentor_suggestions():
    return {"suggestions": ["What should I learn as a beginner?", "How do I start with machine learning?", "What's the best cloud platform?", "Tell me about career paths", "What are current tech trends?"]}
