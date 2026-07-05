from app.agents.agents import ResearchAgent, TrendAgent, LearningAgent, CareerAgent
from app.seed import seed_database


class TestResearchAgent:
    def test_analyze_paper(self, seeded_db):
        from app.models.models import ResearchPaper
        paper = seeded_db.query(ResearchPaper).first()
        if paper:
            result = ResearchAgent.analyze_paper(seeded_db, paper)
            assert "title" in result
            assert "technologies" in result
            assert "concepts" in result
            assert "difficulty" in result
            assert result["title"] == paper.title

    def test_find_related_papers(self, seeded_db):
        from app.models.models import ResearchPaper
        papers = seeded_db.query(ResearchPaper).all()
        if len(papers) >= 2:
            related = ResearchAgent.find_related_papers(seeded_db, papers[0].id)
            assert isinstance(related, list)


class TestTrendAgent:
    def test_analyze_market(self, seeded_db):
        result = TrendAgent.analyze_market(seeded_db)
        assert "market_health" in result
        assert "average_growth_rate" in result
        assert "hot_technologies" in result
        assert len(result["hot_technologies"]) > 0

    def test_predict_emerging(self, seeded_db):
        emerging = TrendAgent.predict_emerging(seeded_db)
        assert isinstance(emerging, list)
        if emerging:
            assert isinstance(emerging[0], str)


class TestLearningAgent:
    def test_generate_path(self, seeded_db):
        result = LearningAgent.generate_path(
            seeded_db,
            goal="machine learning",
            current_skills=["Python"],
            time_available="high",
            difficulty="Intermediate",
        )
        assert "id" in result
        assert "title" in result
        assert "steps" in result
        assert len(result["steps"]) > 0

    def test_generate_path_no_match(self, seeded_db):
        result = LearningAgent.generate_path(
            seeded_db,
            goal="zzzzzz",
            current_skills=[],
            time_available="medium",
        )
        assert len(result["steps"]) > 0


class TestCareerAgent:
    def test_analyze_career_path(self, seeded_db):
        from app.models.models import Career
        career = seeded_db.query(Career).first()
        if career:
            result = CareerAgent.analyze_career_path(seeded_db, career.id)
            assert result is not None
            assert "career" in result
            assert "demand" in result
            assert "technologies_to_learn" in result

    def test_get_market_demand(self, seeded_db):
        result = CareerAgent.get_market_demand(seeded_db)
        assert len(result) > 0
        assert "title" in result[0]
        assert "demand" in result[0]
