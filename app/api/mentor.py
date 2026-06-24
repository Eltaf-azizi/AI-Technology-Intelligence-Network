from fastapi import APIRouter
from app.models import MentorRequest, MentorResponse

router = APIRouter()

MENTOR_RESPONSES = {
    "python": ("Great question! After Python, your next step depends on your goal:\n\n"
               "**For AI/ML:** Study Mathematics → Statistics → Machine Learning → Deep Learning\n"
               "**For Web:** Learn JavaScript → TypeScript → React\n"
               "**For Data Science:** SQL → Statistics → Data Science\n"
               "**For Automation:** Docker → Linux → Cloud\n\n"
               "I'd recommend starting with **Mathematics** and **SQL** - they're foundational for most paths.", 
               ["mathematics", "statistics", "machine-learning", "sql"]),
    "kubernetes": ("Think of Kubernetes as a hotel manager for your apps:\n\n"
                   "- **Docker** creates the 'guests' (containers)\n"
                   "- **Kubernetes** decides which room (server) each guest stays in\n"
                   "- If a guest leaves, it finds a new room\n"
                   "- If too many guests arrive, it books more rooms\n"
                   "- It keeps the hotel running 24/7\n\n"
                   "Prerequisites: Linux, Networking, Docker, Cloud Fundamentals",
                   ["docker", "linux", "networking", "cloud-computing"]),
    "ai engineer": ("Here's your personalized learning plan:\n\n"
                    "**Phase 1 - Foundations (3-4 months)**\n"
                    "- Python - Master it\n"
                    "- Mathematics (Linear Algebra, Calculus)\n"
                    "- Statistics & Probability\n\n"
                    "**Phase 2 - Core ML (4-5 months)**\n"
                    "- Machine Learning algorithms\n"
                    "- Deep Learning with neural networks\n"
                    "- Natural Language Processing\n\n"
                    "**Phase 3 - Engineering (3-4 months)**\n"
                    "- MLOps for deploying models\n"
                    "- Docker & Cloud platforms\n"
                    "- RAG systems & LLMs\n\n"
                    "**Phase 4 - Specialize (ongoing)**\n"
                    "- Pick a domain (CV, NLP, or Robotics)\n"
                    "- Build a portfolio of projects",
                    ["python", "mathematics", "statistics", "machine-learning", "deep-learning", "llm-engineering"]),
}

@router.post("/chat", response_model=MentorResponse)
async def mentor_chat(request: MentorRequest):
    message = request.message.lower()
    response = ""
    recommended_techs = []

    if "python" in message and ("after" in message or "next" in message):
        response, recommended_techs = MENTOR_RESPONSES["python"]
    elif "kubernetes" in message and "beginner" in message:
        response, recommended_techs = MENTOR_RESPONSES["kubernetes"]
    elif "ai engineer" in message or ("become" in message and "ai" in message):
        response, recommended_techs = MENTOR_RESPONSES["ai engineer"]
    elif "sql" in message and "nosql" in message:
        response = ("**SQL vs NoSQL - Quick Comparison:**\n\n"
                    "**SQL** (PostgreSQL, MySQL): Structured data, strict schemas, ACID compliance.\n"
                    "**NoSQL** (MongoDB, Redis): Flexible schemas, horizontal scaling.\n\n"
                    "Use SQL when data integrity is critical. Use NoSQL when scaling horizontally matters more.")
        recommended_techs = ["sql"]
    elif "cloud engineer" in message:
        response = ("**Cloud Engineer Roadmap:**\n\n"
                    "1. Networking - TCP/IP, DNS\n"
                    "2. Linux - Command line, shell scripting\n"
                    "3. Cloud Platform - AWS/Azure/GCP\n"
                    "4. Docker - Containerization\n"
                    "5. Kubernetes - Container orchestration\n"
                    "6. CI/CD - Automated pipelines\n\n"
                    "**Estimated time:** 8-14 months.")
        recommended_techs = ["networking", "linux", "cloud-computing", "docker", "kubernetes"]
    elif "machine learning" in message or ("ml" in message and "path" in message):
        response = ("**Machine Learning Learning Path:**\n\n"
                    "1. Python (2-3 months)\n"
                    "2. Mathematics - Linear Algebra, Calculus (2-3 months)\n"
                    "3. Statistics (1-2 months)\n"
                    "4. ML Basics - Scikit-learn, algorithms (3-4 months)\n"
                    "5. Deep Learning - Neural networks (3-4 months)\n"
                    "6. MLOps - Model deployment (2-3 months)\n\n"
                    "**Total:** ~14-18 months to job-ready.")
        recommended_techs = ["python", "mathematics", "statistics", "machine-learning", "deep-learning"]
    else:
        response = ("That's a great question! Based on the ATIN knowledge graph, "
                    "I recommend starting with the fundamentals: Python programming, "
                    "understanding basic networking, and Linux. From there, follow your "
                    "interests - whether it's AI, cloud, security, or data science. "
                    "Each path has unique learning journeys, and the knowledge graph "
                    "can help you visualize the connections.")
        recommended_techs = ["python", "linux", "networking"]

    return MentorResponse(response=response, technologies=recommended_techs)
