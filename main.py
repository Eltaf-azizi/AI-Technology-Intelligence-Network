from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api import technologies, relationships, careers, trends, mentor, research, comparisons

app = FastAPI(
    title="ATIN - AI Technology Intelligence Network API",
    description="Backend API for the ATIN platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(technologies.router, prefix="/api/technologies", tags=["technologies"])
app.include_router(relationships.router, prefix="/api/relationships", tags=["relationships"])
app.include_router(careers.router, prefix="/api/careers", tags=["careers"])
app.include_router(trends.router, prefix="/api/trends", tags=["trends"])
app.include_router(mentor.router, prefix="/api/mentor", tags=["mentor"])
app.include_router(research.router, prefix="/api/research", tags=["research"])
app.include_router(comparisons.router, prefix="/api/comparisons", tags=["comparisons"])

@app.get("/api/health")
async def health_check():
    return {"status": "online", "version": "1.0.0", "name": "ATIN API"}
