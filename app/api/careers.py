from fastapi import APIRouter
from app.models import Career

router = APIRouter()

careers_db = [
    Career(id="ai-engineer", title="AI Engineer", demand="High", salaryRange="$120K - $250K", growth=35,
           description="Builds and deploys AI models and systems. Combines software engineering with machine learning.",
           skills=["Python", "Machine Learning", "Deep Learning", "MLOps", "Cloud Platforms"],
           learningOrder=["python", "mathematics", "statistics", "machine-learning", "deep-learning", "mlops", "llm-engineering"],
           projects=["Build an ML pipeline", "Deploy a model to production", "Create a RAG system"],
           estimatedTime="12-18 months"),
    Career(id="cybersecurity-analyst", title="Cybersecurity Analyst", demand="High", salaryRange="$90K - $180K", growth=32,
           description="Protects organizational systems and data from cyber threats.",
           skills=["Networking", "Linux", "Cryptography", "Threat Analysis", "Penetration Testing"],
           learningOrder=["networking", "linux", "python", "cybersecurity"],
           projects=["Set up a security monitoring system", "Conduct a penetration test"],
           estimatedTime="8-14 months"),
    Career(id="cloud-engineer", title="Cloud Engineer", demand="High", salaryRange="$110K - $200K", growth=28,
           description="Designs and manages cloud infrastructure.",
           skills=["Cloud Platforms", "Networking", "Docker", "Kubernetes", "CI/CD"],
           learningOrder=["networking", "linux", "cloud-computing", "docker", "kubernetes", "ci-cd"],
           projects=["Deploy a web app on AWS", "Set up Kubernetes cluster", "Build a CI/CD pipeline"],
           estimatedTime="8-14 months"),
    Career(id="data-scientist", title="Data Scientist", demand="High", salaryRange="$100K - $200K", growth=25,
           description="Extracts insights from data using statistical analysis and machine learning.",
           skills=["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization"],
           learningOrder=["python", "mathematics", "statistics", "sql", "data-science", "machine-learning"],
           projects=["Analyze a dataset and present findings", "Build a prediction model"],
           estimatedTime="10-16 months"),
    Career(id="mlops-engineer", title="MLOps Engineer", demand="High", salaryRange="$130K - $260K", growth=40,
           description="Bridges ML and operations. Ensures ML models are reliably deployed and monitored.",
           skills=["Python", "ML", "Docker", "Kubernetes", "Cloud", "CI/CD"],
           learningOrder=["python", "docker", "cloud-computing", "machine-learning", "mlops", "kubernetes"],
           projects=["Build an ML pipeline", "Set up model monitoring", "Create a feature store"],
           estimatedTime="12-18 months"),
]

@router.get("", response_model=list[Career])
async def get_all_careers():
    return careers_db

@router.get("/{career_id}")
async def get_career(career_id: str):
    career = next((c for c in careers_db if c.id == career_id), None)
    if not career:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Career not found")
    return career
