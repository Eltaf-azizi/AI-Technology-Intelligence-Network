from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import ResearchPaper
from app.schemas.schemas import ResearchPaperResponse
from app.core.security import get_current_user_id

router = APIRouter(tags=["research"])


@router.get("/research", response_model=list[ResearchPaperResponse])
async def list_papers(db: Session = Depends(get_db)):
    return db.query(ResearchPaper).order_by(ResearchPaper.uploaded_at.desc()).all()


@router.get("/research/{paper_id}", response_model=ResearchPaperResponse)
async def get_paper(paper_id: int, db: Session = Depends(get_db)):
    paper = db.query(ResearchPaper).filter(ResearchPaper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper


@router.post("/research/upload", response_model=ResearchPaperResponse)
async def upload_paper(title: str, summary: str = "", technologies: str = "", concepts: str = "", difficulty: str = "Intermediate", user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
    paper = ResearchPaper(title=title, summary=summary, technologies=[t.strip() for t in technologies.split(",") if t.strip()], concepts=[c.strip() for c in concepts.split(",") if c.strip()], difficulty=difficulty)
    db.add(paper); db.commit(); db.refresh(paper)
    return paper


@router.delete("/research/{paper_id}")
async def delete_paper(paper_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
    paper = db.query(ResearchPaper).filter(ResearchPaper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    db.delete(paper); db.commit()
    return {"message": "Paper deleted"}
