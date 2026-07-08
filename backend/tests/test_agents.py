from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base
from app.agents.agents import TrendAgent, LearningAgent, CareerAgent
from app.models.models import Career
from app.seed import seed_database

_engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool)
_Session = sessionmaker(autocommit=False, autoflush=False, bind=_engine)


def _seeded_session():
    Base.metadata.create_all(bind=_engine)
    db = _Session()
    seed_database(db)
    db.close()
    return _Session()


class TestTrendAgent:
    def test_analyze_market(self):
        db = _seeded_session()
        try:
            result = TrendAgent.analyze_market(db)
            assert "market_health" in result
            assert "average_growth_rate" in result
            assert "hot_technologies" in result
        finally:
            db.close()


class TestLearningAgent:
    def test_generate_path(self):
        db = _seeded_session()
        try:
            result = LearningAgent.generate_path(
                db, goal="machine learning", current_skills=["Python"],
                time_available="high", difficulty="Intermediate",
            )
            assert "id" in result and "title" in result and "steps" in result
            assert len(result["steps"]) > 0
        finally:
            db.close()

    def test_generate_path_no_match(self):
        db = _seeded_session()
        try:
            result = LearningAgent.generate_path(
                db, goal="zzzzzz", current_skills=[], time_available="medium",
            )
            assert len(result["steps"]) > 0
        finally:
            db.close()


class TestCareerAgent:
    def test_analyze_career_path(self):
        db = _seeded_session()
        try:
            career = db.query(Career).first()
            if career:
                result = CareerAgent.analyze_career_path(db, career.id)
                assert result is not None
                assert "career" in result and "demand" in result
                assert "technologies_to_learn" in result
        finally:
            db.close()

    def test_get_market_demand(self):
        db = _seeded_session()
        try:
            result = CareerAgent.get_market_demand(db)
            assert len(result) > 0
            assert "title" in result[0] and "demand" in result[0]
        finally:
            db.close()
