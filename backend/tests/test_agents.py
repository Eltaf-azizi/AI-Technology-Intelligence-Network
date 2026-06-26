from app.agents.agents import ResearchAgent, TrendAgent, LearningAgent, CareerAgent
from app.models.models import ResearchPaper


class TestResearchAgent:
    def test_analyze_paper(self, seeded_db):
        db = seeded_db()
        paper = db.query(ResearchPaper).first()
        if paper:
            r = ResearchAgent.analyze_paper(db, paper)
            assert "title" in r and "technologies" in r
        db.close()

    def test_find_related(self, seeded_db):
        db = seeded_db()
        papers = db.query(ResearchPaper).all()
        if len(papers) >= 2:
            r = ResearchAgent.find_related_papers(db, papers[0].id)
            assert isinstance(r, list)
        db.close()


class TestTrendAgent:
    def test_analyze_market(self, seeded_db):
        db = seeded_db()
        r = TrendAgent.analyze_market(db)
        assert "market_health" in r and "hot_technologies" in r
        db.close()

    def test_predict_emerging(self, seeded_db):
        db = seeded_db()
        r = TrendAgent.predict_emerging(db)
        assert isinstance(r, list)
        db.close()


class TestLearningAgent:
    def test_generate_path(self, seeded_db):
        db = seeded_db()
        r = LearningAgent.generate_path(db, "machine learning", ["Python"], "high", "Intermediate")
        assert len(r["steps"]) > 0
        db.close()

    def test_generate_no_match(self, seeded_db):
        db = seeded_db()
        r = LearningAgent.generate_path(db, "zzzzzz", [])
        assert len(r["steps"]) > 0
        db.close()


class TestCareerAgent:
    def test_analyze(self, seeded_db):
        db = seeded_db()
        from app.models.models import Career
        c = db.query(Career).first()
        if c:
            r = CareerAgent.analyze_career_path(db, c.id)
            assert r and "career" in r
        db.close()

    def test_market_demand(self, seeded_db):
        db = seeded_db()
        r = CareerAgent.get_market_demand(db)
        assert len(r) > 0
        db.close()
