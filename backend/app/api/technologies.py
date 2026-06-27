from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import TechnologyResponse, TechnologyList, SearchResponse
from app.services.knowledge_graph import TechnologyService

router = APIRouter(tags=["technologies"])


@router.get("/technologies", response_model=TechnologyList)
async def list_technologies(category: Optional[str] = Query(None), page: int = Query(1, ge=1), per_page: int = Query(50, ge=1, le=100), db: Session = Depends(get_db)):
    skip = (page - 1) * per_page
    return TechnologyList(technologies=TechnologyService.get_all(db, category=category, skip=skip, limit=per_page), total=TechnologyService.count(db, category=category), page=page, per_page=per_page)


@router.get("/technologies/{slug}", response_model=TechnologyResponse)
async def get_technology(slug: str, db: Session = Depends(get_db)):
    tech = TechnologyService.get_by_slug(db, slug)
    if not tech:
        raise HTTPException(status_code=404, detail="Technology not found")
    return tech


@router.get("/search", response_model=SearchResponse)
async def search_technologies(q: str = Query(default="", min_length=1), page: int = Query(1, ge=1), per_page: int = Query(20, ge=1, le=50), db: Session = Depends(get_db)):
    skip = (page - 1) * per_page
    results = TechnologyService.search(db, q, skip=skip, limit=per_page)
    return SearchResponse(technologies=results, total=len(results), query=q)


@router.get("/categories")
async def get_categories(db: Session = Depends(get_db)):
    cats = TechnologyService.get_categories(db)
    return {"categories": cats, "total": len(cats)}


@router.get("/categories/{category}", response_model=TechnologyList)
async def get_technologies_by_category(category: str, page: int = Query(1, ge=1), per_page: int = Query(50, ge=1, le=100), db: Session = Depends(get_db)):
    skip = (page - 1) * per_page
    return TechnologyList(technologies=TechnologyService.get_all(db, category=category, skip=skip, limit=per_page), total=TechnologyService.count(db, category=category), page=page, per_page=per_page)
