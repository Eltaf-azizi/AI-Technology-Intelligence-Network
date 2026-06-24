from fastapi import APIRouter, HTTPException
from app.models import Career

router = APIRouter()

careers_db = [
    Career(id="ai-engineer", title="AI Engineer", demand="High", salaryRange="$120K - $250K", growth=35,
           description="Builds and deploys AI models and systems. Combines software engineering with machine learning to create intelligent applications.",
           skills=["Python", "Machine Learning", "Deep Learning", "MLOps", "Cloud Platforms", "Data Engineering"],
           learningOrder=["python", "mathematics", "statistics", "machine-learning", "deep-learning", "mlops", "llm-engineering"],
           projects=["Build an ML pipeline", "Deploy a model to production", "Create a RAG system", "Fine-tune an LLM"],
           estimatedTime="12-18 months"),
    Career(id="cybersecurity-analyst", title="Cybersecurity Analyst", demand="High", salaryRange="$90K - $180K", growth=32,
           description="Protects organizational systems and data from cyber threats. Monitors networks, investigates incidents, and implements security measures.",
           skills=["Networking", "Linux", "Cryptography", "Threat Analysis", "Penetration Testing", "SIEM Tools"],
           learningOrder=["networking", "linux", "python", "cybersecurity"],
           projects=["Set up a security monitoring system", "Conduct a penetration test", "Build a firewall", "Create an incident response plan"],
           estimatedTime="8-14 months"),
    Career(id="cloud-engineer", title="Cloud Engineer", demand="High", salaryRange="$110K - $200K", growth=28,
           description="Designs and manages cloud infrastructure. Ensures scalable, secure, and cost-effective cloud operations.",
           skills=["Cloud Platforms", "Networking", "Linux", "Docker", "Kubernetes", "CI/CD", "Infrastructure as Code"],
           learningOrder=["networking", "linux", "cloud-computing", "aws", "docker", "kubernetes", "ci-cd"],
           projects=["Deploy a web app on AWS", "Set up Kubernetes cluster", "Build a CI/CD pipeline", "Design a cloud architecture"],
           estimatedTime="8-14 months"),
    Career(id="data-scientist", title="Data Scientist", demand="High", salaryRange="$100K - $200K", growth=25,
           description="Extracts insights from data using statistical analysis, machine learning, and visualization. Drives data-informed decision making.",
           skills=["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization", "Data Engineering"],
           learningOrder=["python", "mathematics", "statistics", "sql", "data-science", "machine-learning"],
           projects=["Analyze a dataset and present findings", "Build a prediction model", "Create a data dashboard", "Design an A/B test"],
           estimatedTime="10-16 months"),
    Career(id="fullstack-developer", title="Full-Stack Developer", demand="High", salaryRange="$90K - $180K", growth=20,
           description="Builds both frontend and backend of web applications. Handles everything from user interfaces to server logic and databases.",
           skills=["JavaScript", "TypeScript", "React", "Node.js", "SQL", "Git", "Cloud"],
           learningOrder=["javascript", "typescript", "react", "sql", "git", "cloud-computing"],
           projects=["Build a full-stack web app", "Create a REST API", "Build a real-time dashboard", "Deploy a production app"],
           estimatedTime="8-14 months"),
    Career(id="mlops-engineer", title="MLOps Engineer", demand="High", salaryRange="$130K - $260K", growth=40,
           description="Bridges ML and operations. Ensures ML models are reliably deployed, monitored, and maintained in production environments.",
           skills=["Python", "ML", "Docker", "Kubernetes", "Cloud", "CI/CD", "Data Engineering"],
           learningOrder=["python", "docker", "cloud-computing", "machine-learning", "mlops", "kubernetes", "ci-cd"],
           projects=["Build an ML pipeline", "Set up model monitoring", "Create a feature store", "Automate model retraining"],
           estimatedTime="12-18 months"),
    Career(id="robotics-engineer", title="Robotics Engineer", demand="Medium", salaryRange="$100K - $200K", growth=22,
           description="Designs and builds robotic systems. Integrates hardware, software, and AI to create machines that interact with the physical world.",
           skills=["Python", "C++", "ROS", "Computer Vision", "Control Systems", "Electronics"],
           learningOrder=["python", "mathematics", "electronics", "computer-vision", "machine-learning", "robotics"],
           projects=["Build a line-following robot", "Implement SLAM", "Create a robotic arm controller", "Design an autonomous drone"],
           estimatedTime="18-24 months"),
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
