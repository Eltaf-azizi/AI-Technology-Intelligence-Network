from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, UserLearningProgress, SavedLearningPath
from app.schemas.schemas import UserProgressResponse, UserProgressUpdate, SavedPathResponse, AuditLogResponse
from app.core.security import require_auth
from app.services.knowledge_graph import AuditService

router = APIRouter(tags=["users"])


@router.get("/users/progress", response_model=list[UserProgressResponse])
async def get_progress(user_id: int = Depends(require_auth), db: Session = Depends(get_db)):
    return db.query(UserLearningProgress).filter(UserLearningProgress.user_id == user_id).all()


@router.post("/users/progress", response_model=UserProgressResponse)
async def update_progress(progress: UserProgressUpdate, user_id: int = Depends(require_auth), db: Session = Depends(get_db)):
    existing = db.query(UserLearningProgress).filter(
        UserLearningProgress.user_id == user_id, UserLearningProgress.technology_slug == progress.technology_slug).first()
    if existing:
        existing.status = progress.status; existing.score = progress.score
        if progress.status == "completed" and not existing.completed_at:
            existing.completed_at = datetime.now(timezone.utc)
        db.commit(); db.refresh(existing); return existing
    record = UserLearningProgress(user_id=user_id, technology_slug=progress.technology_slug, status=progress.status,
                                  score=progress.score,
                                  started_at=datetime.now(timezone.utc) if progress.status == "in_progress" else None,
                                  completed_at=datetime.now(timezone.utc) if progress.status == "completed" else None)
    db.add(record); db.commit(); db.refresh(record); return record


@router.get("/users/saved-paths", response_model=list[SavedPathResponse])
async def get_saved_paths(user_id: int = Depends(require_auth), db: Session = Depends(get_db)):
    return db.query(SavedLearningPath).filter(SavedLearningPath.user_id == user_id).order_by(SavedLearningPath.created_at.desc()).all()


@router.post("/users/saved-paths", response_model=SavedPathResponse)
async def save_path(title: str, goal: str, path_data: dict,
                    user_id: int = Depends(require_auth), db: Session = Depends(get_db)):
    path = SavedLearningPath(user_id=user_id, title=title, goal=goal, path_data=path_data)
    db.add(path); db.commit(); db.refresh(path); return path


@router.delete("/users/saved-paths/{path_id}")
async def delete_saved_path(path_id: int, user_id: int = Depends(require_auth), db: Session = Depends(get_db)):
    path = db.query(SavedLearningPath).filter(SavedLearningPath.id == path_id, SavedLearningPath.user_id == user_id).first()
    if not path:
        raise HTTPException(status_code=404, detail="Saved path not found")
    db.delete(path); db.commit()
    return {"message": "Path deleted"}


@router.get("/users/audit-logs", response_model=list[AuditLogResponse])
async def get_audit_logs(skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                         user_id: int = Depends(require_auth), db: Session = Depends(get_db)):
    return AuditService.get_user_logs(db, user_id, skip=skip, limit=limit)
