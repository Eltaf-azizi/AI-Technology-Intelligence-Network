from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import RelationshipResponse, GraphResponse
from app.services.knowledge_graph import RelationshipService

router = APIRouter(tags=["relationships"])


@router.get("/relationships", response_model=list[RelationshipResponse])
async def list_relationships(db: Session = Depends(get_db)):
    return [RelationshipResponse(id=r.id, source_id=r.source_id, target_id=r.target_id, type=r.type, strength=r.strength,
                                  source_slug=r.source_tech.slug, target_slug=r.target_tech.slug,
                                  source_name=r.source_tech.name, target_name=r.target_tech.name) for r in RelationshipService.get_all(db)]


@router.get("/graph", response_model=GraphResponse)
async def get_graph(db: Session = Depends(get_db)):
    return RelationshipService.get_graph(db)


@router.get("/technologies/{slug}/relationships")
async def get_technology_relationships(slug: str, db: Session = Depends(get_db)):
    return {"slug": slug, "relationships": RelationshipService.get_by_technology(db, slug)}


@router.get("/technologies/{slug}/related")
async def get_related_technologies(slug: str, db: Session = Depends(get_db)):
    return {"slug": slug, "related": RelationshipService.get_related(db, slug)}
