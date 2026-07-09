import os
import sys
from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.config import settings
from app.database import init_db, SessionLocal, get_db
from app.seed import seed_database
from app.core.logger import logger
from app.core.rate_limit import limiter

from app.api import (
    auth,
    technologies,
    relationships,
    careers,
    trends,
    mentor,
    research,
    learning_paths,
    comparison,
    analytics,
    users,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} v{settings.VERSION}")
    if not os.getenv("ATIN_TESTING"):
        init_db()
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
        logger.info("Database initialized and seeded")
    yield
    if not os.getenv("ATIN_TESTING"):
        logger.info("Shutting down")


app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered platform that maps the entire technology ecosystem",
    version=settings.VERSION,
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"{request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"{request.method} {request.url.path} -> {response.status_code}")
    return response


@app.get("/api/health")
async def health_check(db: Session = Depends(get_db)):
    from app.models.models import Technology, Relationship
    tech_count = db.query(Technology).count()
    rel_count = db.query(Relationship).count()
    return {
        "status": "online",
        "version": settings.VERSION,
        "name": settings.APP_NAME,
        "technologies_in_graph": tech_count,
        "relationships_in_graph": rel_count,
    }


@app.get("/api")
async def api_root():
    return {
        "name": settings.APP_NAME,
        "version": settings.VERSION,
        "endpoints": {
            "auth": "/api/auth/*",
            "technologies": "/api/technologies/*",
            "relationships": "/api/relationships/*",
            "graph": "/api/graph",
            "careers": "/api/careers/*",
            "trends": "/api/trends/*",
            "mentor": "/api/mentor/*",
            "research": "/api/research/*",
            "learning": "/api/learning/*",
            "compare": "/api/compare/*",
            "analytics": "/api/analytics/*",
            "search": "/api/search*",
        }
    }


app.include_router(auth.router, prefix="/api/auth")
app.include_router(technologies.router, prefix="/api")
app.include_router(relationships.router, prefix="/api")
app.include_router(careers.router, prefix="/api")
app.include_router(trends.router, prefix="/api")
app.include_router(mentor.router, prefix="/api")
app.include_router(research.router, prefix="/api")
app.include_router(learning_paths.router, prefix="/api")
app.include_router(comparison.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(users.router, prefix="/api")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
