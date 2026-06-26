from fastapi import APIRouter, HTTPException
from app.models import Technology

router = APIRouter()

technologies_db = [
    Technology(id="python", name="Python", category="Programming Languages",
               description="A high-level, general-purpose programming language known for its readability and versatility.",
               difficulty="Beginner", learningTime="3-6 months", prerequisites=[], skills=["Syntax", "OOP", "Libraries", "Debugging"],
               applications=["Web Development", "Data Science", "AI/ML", "Automation"],
               companies=["Google", "Netflix", "Spotify", "Instagram"],
               futureOutlook="Growing", growthRate=95, popularity=98, icon="🐍", color="#3776AB"),
    Technology(id="javascript", name="JavaScript", category="Programming Languages",
               description="A dynamic programming language essential for web development.",
               difficulty="Beginner", learningTime="3-6 months", prerequisites=[], skills=["DOM", "Async", "ES6+"],
               applications=["Web Development", "Mobile Apps", "Server-side"],
               companies=["Google", "Meta", "Microsoft", "Amazon"],
               futureOutlook="Growing", growthRate=90, popularity=97, icon="🟨", color="#F7DF1E"),
    Technology(id="machine-learning", name="Machine Learning", category="Artificial Intelligence",
               description="A subset of AI that enables systems to learn and improve from experience.",
               difficulty="Advanced", learningTime="6-12 months", prerequisites=["python", "mathematics", "statistics"],
               skills=["Regression", "Classification", "Clustering", "Model Evaluation"],
               applications=["Predictive Analytics", "Recommendation Systems", "Fraud Detection"],
               companies=["Google", "Amazon", "Microsoft", "Apple", "Meta"],
               futureOutlook="Growing", growthRate=98, popularity=95, icon="🤖", color="#FF6F00"),
    Technology(id="deep-learning", name="Deep Learning", category="Artificial Intelligence",
               description="A subset of machine learning using neural networks with many layers.",
               difficulty="Advanced", learningTime="6-12 months", prerequisites=["machine-learning", "python", "linear-algebra"],
               skills=["Neural Networks", "CNNs", "RNNs", "Transformers"],
               applications=["Image Recognition", "NLP", "Speech Recognition", "Generative AI"],
               companies=["Google DeepMind", "OpenAI", "Meta AI", "NVIDIA"],
               futureOutlook="Growing", growthRate=99, popularity=93, icon="🧠", color="#E91E63"),
    Technology(id="docker", name="Docker", category="DevOps & Cloud",
               description="A platform for developing, shipping, and running applications in containers.",
               difficulty="Intermediate", learningTime="1-2 months", prerequisites=["linux", "networking"],
               skills=["Containerization", "Dockerfile", "Compose", "Registry"],
               applications=["Microservices", "CI/CD", "DevOps", "Cloud Deployments"],
               companies=["Netflix", "Uber", "Spotify", "Airbnb"],
               futureOutlook="Growing", growthRate=88, popularity=92, icon="🐳", color="#2496ED"),
    Technology(id="kubernetes", name="Kubernetes", category="DevOps & Cloud",
               description="An open-source platform for automating deployment, scaling, and management of containerized applications.",
               difficulty="Advanced", learningTime="3-6 months", prerequisites=["docker", "linux", "networking", "cloud-fundamentals"],
               skills=["Orchestration", "Pods", "Services", "Helm"],
               applications=["Microservices", "Cloud Native", "CI/CD", "Edge Computing"],
               companies=["Google", "Spotify", "Adobe", "Capital One"],
               futureOutlook="Growing", growthRate=91, popularity=90, icon="☸️", color="#326CE5"),
    Technology(id="cybersecurity", name="Cybersecurity", category="Security",
               description="The practice of protecting systems, networks, and programs from digital attacks.",
               difficulty="Intermediate", learningTime="6-12 months", prerequisites=["networking", "linux"],
               skills=["Network Security", "Cryptography", "Ethical Hacking", "Incident Response"],
               applications=["Network Protection", "Penetration Testing", "Compliance"],
               companies=["CrowdStrike", "Palo Alto Networks", "Fortinet", "Cisco"],
               futureOutlook="Growing", growthRate=96, popularity=91, icon="🔒", color="#DC143C"),
    Technology(id="react", name="React", category="Programming Languages",
               description="A JavaScript library for building user interfaces with a component-based architecture.",
               difficulty="Intermediate", learningTime="3-6 months", prerequisites=["javascript", "typescript"],
               skills=["Components", "Hooks", "State Management", "JSX"],
               applications=["Web Apps", "Mobile (React Native)", "SPAs"],
               companies=["Meta", "Netflix", "Airbnb", "Uber"],
               futureOutlook="Growing", growthRate=87, popularity=94, icon="⚛️", color="#61DAFB"),
    Technology(id="sql", name="SQL", category="Data & Analytics",
               description="Structured Query Language for managing and querying relational databases.",
               difficulty="Beginner", learningTime="1-2 months", prerequisites=[], skills=["Queries", "Joins", "Indexing"],
               applications=["Backend", "Data Analysis", "BI", "Reporting"],
               companies=["Every Tech Company"],
               futureOutlook="Stable", growthRate=80, popularity=93, icon="🗄️", color="#336791"),
    Technology(id="llm-engineering", name="LLM Engineering", category="Artificial Intelligence",
               description="The practice of building applications around Large Language Models.",
               difficulty="Advanced", learningTime="3-6 months", prerequisites=["python", "nlp", "machine-learning"],
               skills=["Prompt Engineering", "RAG", "Fine-tuning", "LangChain"],
               applications=["Chatbots", "Code Generation", "Content Creation"],
               companies=["OpenAI", "Anthropic", "Google", "Meta"],
               futureOutlook="Growing", growthRate=100, popularity=96, icon="📝", color="#FF5722"),
]

@router.get("", response_model=list[Technology])
async def get_all_technologies():
    return technologies_db

@router.get("/{tech_id}", response_model=Technology)
async def get_technology(tech_id: str):
    tech = next((t for t in technologies_db if t.id == tech_id), None)
    if not tech:
        raise HTTPException(status_code=404, detail="Technology not found")
    return tech

@router.get("/category/{category}")
async def get_technologies_by_category(category: str):
    return [t for t in technologies_db if t.category.lower() == category.lower()]

@router.get("/search/{query}")
async def search_technologies(query: str):
    q = query.lower()
    return [t for t in technologies_db if q in t.name.lower() or q in t.description.lower() or q in t.category.lower()]
