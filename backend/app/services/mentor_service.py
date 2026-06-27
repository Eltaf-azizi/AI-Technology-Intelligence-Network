from typing import List, Dict


class MentorService:
    def __init__(self):
        self.responses = {
            "python": "Python is the most versatile language for AI, data science, and web development. Start with basics, then move to libraries like NumPy, Pandas, and scikit-learn.",
            "javascript": "JavaScript powers the modern web. Start with ES6+ syntax, then explore React, Node.js, and TypeScript for full-stack development.",
            "machine learning": "Machine learning is about teaching computers to learn from data. Start with Python, statistics, then scikit-learn.",
            "deep learning": "Deep learning uses neural networks with multiple layers. You need Python, linear algebra, calculus, and PyTorch or TensorFlow.",
            "llm": "Large Language Models like GPT and LLaMA have revolutionized AI. Study transformers, attention mechanisms, and prompt engineering.",
            "cloud": "Cloud computing skills are essential. Start with one provider (AWS, Azure, or GCP), learn core services, then expand.",
            "docker": "Docker containers package applications with dependencies. Learn Dockerfile syntax, image management, and docker-compose.",
            "kubernetes": "Kubernetes orchestrates container deployments. Study pods, services, deployments, ingress, and Helm charts.",
            "sql": "SQL is the language of databases. Master SELECT queries, JOINs, aggregations, indexing, and normalization.",
            "react": "React is the leading frontend framework. Master components, hooks, state management, and routing.",
            "cybersecurity": "Cybersecurity protects systems and data. Start with networking basics, then specialize in ethical hacking or security analysis.",
        }
        self.suggestions_map = {
            "learning": ["Start with Python fundamentals", "Build a small project each week", "Join a coding community", "Read documentation regularly"],
            "career": ["Build a portfolio on GitHub", "Network on LinkedIn", "Contribute to open source", "Write technical blog posts"],
            "general": ["Explore Technology Radar for trends", "Use Comparison Engine", "Check Career Intelligence", "Try Learning Path Generator"],
        }

    def chat(self, message: str, history: List[Dict[str, str]]) -> Dict:
        msg = message.lower()
        if any(w in msg for w in ["hello", "hi", "hey"]):
            reply = "Hello! I'm your AI Mentor. Ask me about any technology, career advice, learning paths, or industry trends."
        elif any(w in msg for w in ["career", "job", "salary"]):
            reply = "The tech industry offers diverse career paths: Software Engineer, Data Scientist, ML Engineer, Cloud Architect, DevOps Engineer, and Cybersecurity Analyst. What area interests you?"
        elif any(w in msg for w in ["learn", "study", "course", "beginner"]):
            reply = "Great focus on learning! Start with fundamentals, build hands-on projects, join a community, and practice consistently. What technology would you like to learn?"
        elif any(w in msg for w in ["trend", "future", "hot"]):
            reply = "Current hot trends: LLMs and Generative AI, MLOps, Edge Computing, Cybersecurity, and Cloud-Native Development. AI/ML dominates with 90%+ growth rates."
        elif any(w in msg for w in ["roadmap", "path", "plan"]):
            reply = "A good learning path combines theory with practice. Use our Learning Path Generator to create a personalized plan. What specific area interests you?"
        elif any(w in msg for w in ["project", "portfolio", "build"]):
            reply = "Projects are crucial. Start small: build a CLI tool, then a web app, then something with APIs. For AI/ML, try a classification model or a chatbot."
        else:
            reply = self.responses.get(next((k for k in self.responses if k in msg), ""), "I'm not sure about that topic. Browse our Technology Explorer for more information.")
        suggestions = self.suggestions_map["learning"] if any(w in msg for w in ["learn", "study", "course", "beginner"]) else self.suggestions_map["career"] if any(w in msg for w in ["career", "job", "salary"]) else self.suggestions_map["general"]
        return {"reply": reply, "suggestions": suggestions}
