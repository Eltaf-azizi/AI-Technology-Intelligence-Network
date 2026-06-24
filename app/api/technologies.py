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
    Technology(id="typescript", name="TypeScript", category="Programming Languages",
               description="A typed superset of JavaScript that compiles to plain JavaScript.",
               difficulty="Intermediate", learningTime="2-4 months", prerequisites=["javascript"], 
               skills=["Types", "Generics", "Interfaces", "Decorators"],
               applications=["Web Development", "Enterprise Apps", "Libraries"],
               companies=["Microsoft", "Google", "Airbnb", "Slack"],
               futureOutlook="Growing", growthRate=92, popularity=90, icon="🔷", color="#3178C6"),
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
   
    Technology(id="react", name="React", category="Programming Languages",
               description="A JavaScript library for building user interfaces.",
               difficulty="Intermediate", learningTime="3-6 months", prerequisites=["javascript", "typescript"],
               skills=["Components", "Hooks", "State Management", "JSX"],
               applications=["Web Apps", "Mobile (React Native)", "SPAs"],
               companies=["Meta", "Netflix", "Airbnb", "Uber"],
               futureOutlook="Growing", growthRate=87, popularity=94, icon="⚛️", color="#61DAFB"),
    Technology(id="sql", name="SQL", category="Data & Analytics",
               description="Structured Query Language for managing and querying relational databases.",
               difficulty="Beginner", learningTime="1-2 months", prerequisites=[],
               skills=["Queries", "Joins", "Indexing"],
               applications=["Backend", "Data Analysis", "BI", "Reporting"],
               companies=["Every Tech Company"],
               futureOutlook="Stable", growthRate=80, popularity=93, icon="🗄️", color="#336791"),
    Technology(id="git", name="Git", category="DevOps & Cloud",
               description="A distributed version control system for tracking changes in source code.",
               difficulty="Beginner", learningTime="1 month", prerequisites=[],
               skills=["Version Control", "Branching", "Merging", "Rebasing"],
               applications=["Software Development", "Open Source", "CI/CD", "Documentation"],
               companies=["Every Tech Company"],
               futureOutlook="Stable", growthRate=75, popularity=96, icon="📦", color="#F05032"),
    Technology(id="rag", name="RAG (Retrieval Augmented Generation)", category="Artificial Intelligence",
               description="A technique that combines information retrieval with text generation.",
               difficulty="Advanced", learningTime="2-4 months", prerequisites=["llm-engineering", "python", "natural-language-processing"],
               skills=["Vector DBs", "Embeddings", "Chunking", "Retrieval"],
               applications=["Q&A Systems", "Research Tools", "Customer Support", "Document Analysis"],
               companies=["OpenAI", "Anthropic", "Cohere", "LlamaIndex"],
               futureOutlook="Growing", growthRate=98, popularity=88, icon="🔍", color="#8BC34A"),
    Technology(id="quantum-computing", name="Quantum Computing", category="Emerging Technologies",
               description="An emerging field that uses quantum mechanics to process information.",
               difficulty="Advanced", learningTime="12-24 months", prerequisites=["linear-algebra", "mathematics"],
               skills=["Quantum Gates", "Qubits", "Quantum Algorithms", "Error Correction"],
               applications=["Cryptography", "Drug Discovery", "Optimization", "Financial Modeling"],
               companies=["IBM", "Google", "Microsoft", "IonQ", "Rigetti"],
               futureOutlook="Growing", growthRate=88, popularity=65, icon="⚛️", color="#00BCD4"),
    Technology(id="blockchain", name="Blockchain", category="Emerging Technologies",
               description="A distributed ledger technology that maintains records linked using cryptography.",
               difficulty="Advanced", learningTime="3-6 months", prerequisites=["networking", "cybersecurity"],
               skills=["Smart Contracts", "Consensus", "DApps", "Web3"],
               applications=["Cryptocurrency", "Supply Chain", "Identity", "Voting"],
               companies=["Ethereum", "Chainlink", "IBM", "Microsoft"],
               futureOutlook="Stable", growthRate=72, popularity=68, icon="⛓️", color="#F7931A"),
    Technology(id="prompt-engineering", name="Prompt Engineering", category="Artificial Intelligence",
               description="The practice of designing and optimizing input prompts to get desired outputs from LLMs.",
               difficulty="Beginner", learningTime="1-2 months", prerequisites=[],
               skills=["Prompt Design", "Chain-of-Thought", "Few-shot", "Persona Setting"],
               applications=["Content Generation", "Code Generation", "Chatbots", "Data Extraction"],
               companies=["OpenAI", "Anthropic", "Google", "Meta", "Microsoft"],
               futureOutlook="Growing", growthRate=96, popularity=89, icon="✏️", color="#FF9800"),
    Technology(id="data-engineering", name="Data Engineering", category="Data & Analytics",
               description="The practice of designing and building systems for collecting and storing data at scale.",
               difficulty="Intermediate", learningTime="4-8 months", prerequisites=["python", "sql", "cloud-computing"],
               skills=["ETL", "Data Pipelines", "Data Warehousing", "Spark"],
               applications=["Analytics", "Business Intelligence", "ML Infrastructure", "Reporting"],
               companies=["Amazon", "Google", "Meta", "Netflix", "Uber"],
               futureOutlook="Growing", growthRate=91, popularity=86, icon="🏗️", color="#795548"),
    Technology(id="ci-cd", name="CI/CD", category="DevOps & Cloud",
               description="Continuous Integration and Continuous Deployment practices for automated testing and deployment.",
               difficulty="Intermediate", learningTime="1-3 months", prerequisites=["git", "docker"],
               skills=["Pipeline Design", "Automation", "Testing", "Deployment"],
               applications=["DevOps", "Software Delivery", "Quality Assurance", "Release Management"],
               companies=["GitHub", "GitLab", "Netflix", "Google", "Amazon"],
               futureOutlook="Growing", growthRate=86, popularity=87, icon="🔄", color="#E91E63"),
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
