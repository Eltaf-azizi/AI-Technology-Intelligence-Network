from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User
from app.schemas.schemas import UserCreate, UserLogin, TokenResponse, RefreshRequest
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token, get_current_user_id
from app.core.rate_limit import limiter, limit
from app.services.knowledge_graph import AuditService

router = APIRouter(tags=["auth"])


@router.post("/register", response_model=TokenResponse)
@limit("5/minute")
async def register(request: Request, user_data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter((User.username == user_data.username) | (User.email == user_data.email)).first():
        raise HTTPException(status_code=400, detail="Username or email already exists")
    user = User(username=user_data.username, email=user_data.email, hashed_password=get_password_hash(user_data.password))
    db.add(user); db.commit(); db.refresh(user)
    at = create_access_token({"sub": str(user.id)}); rt = create_refresh_token({"sub": str(user.id)})
    AuditService.log(db, user.id, "register", "user", user.id, f"User {user.username} registered", request.client.host)
    return TokenResponse(access_token=at, refresh_token=rt, user=user)


@router.post("/login", response_model=TokenResponse)
@limit("10/minute")
async def login(request: Request, creds: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == creds.username).first()
    if not user or not verify_password(creds.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    at = create_access_token({"sub": str(user.id)}); rt = create_refresh_token({"sub": str(user.id)})
    AuditService.log(db, user.id, "login", "user", user.id, f"User {user.username} logged in", request.client.host)
    return TokenResponse(access_token=at, refresh_token=rt, user=user)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(refresh_data: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(refresh_data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return TokenResponse(access_token=create_access_token({"sub": str(user.id)}), refresh_token=create_refresh_token({"sub": str(user.id)}), user=user)


@router.get("/me", response_model=TokenResponse)
async def get_me(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return TokenResponse(access_token=create_access_token({"sub": str(user.id)}), refresh_token=create_refresh_token({"sub": str(user.id)}), user=user)
