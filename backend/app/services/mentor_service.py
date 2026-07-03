from typing import List, Dict


class MentorService:
    def __init__(self):
        self.responses = {
            "python": "Python is the most versatile language for AI, data science, and web development. Start with basics, then move to libraries like NumPy, Pandas, and scikit-learn.",
            "javascript": "JavaScript powers the modern web. Start with ES6+ syntax, then explore React, Node.js, and TypeScript for full-stack development.",
            "machine learning": "Machine learning is about teaching computers to learn from data. Start with Python, statistics, then scikit-learn. Progress to deep learning with TensorFlow or PyTorch.",
            "deep learning": "Deep learning uses neural networks with multiple layers. You need Python, linear algebra, calculus, and a framework like PyTorch or TensorFlow.",
            "llm": "Large Language Models like GPT and LLaMA have revolutionized AI. Study transformers, attention mechanisms, and prompt engineering. Hands-on with Hugging Face and RAG architectures.",
            "cloud": "Cloud computing skills are essential. Start with one provider (AWS, Azure, or GCP), learn core services, then expand. Certification paths help structure learning.",
            "devops": "DevOps combines development and operations. Learn Linux, containers (Docker), orchestration (Kubernetes), CI/CD pipelines, and infrastructure as code.",
            "cybersecurity": "Cybersecurity protects systems and data. Start with networking basics, operating systems, then specialize in areas like ethical hacking, security analysis, or cryptography.",
            "react": "React is the leading frontend framework. Master components, hooks, state management, and routing. TypeScript integration is increasingly important.",
            "docker": "Docker containers package applications with dependencies. Learn Dockerfile syntax, image management, docker-compose for multi-container apps, and orchestration basics.",
            "kubernetes": "Kubernetes orchestrates container deployments. Study pods, services, deployments, ingress, and Helm charts. It's complex but essential for cloud-native apps.",
            "sql": "SQL is the language of databases. Master SELECT queries, JOINs, aggregations, indexing, and normalization. Essential for any data-related role.",
            "data science": "Data science extracts insights from data. Learn Python, statistics, SQL, data visualization, and machine learning. Real projects build the best portfolio.",
            "nlp": "Natural Language Processing helps computers understand text. Study tokenization, embeddings, transformers, and fine-tuning. Hugging Face is the go-to library.",
            "computer vision": "Computer vision processes visual data. Study CNNs, image processing, object detection (YOLO), and segmentation. OpenCV and PyTorch are key tools.",
            "git": "Git is essential version control. Master branching, merging, rebasing, and collaborative workflows like GitFlow. Every developer uses it daily.",
            "rag": "RAG (Retrieval Augmented Generation) combines search with LLMs. Study vector databases, embeddings, document chunking, and retrieval pipelines.",
            "prompt engineering": "Prompt engineering crafts effective LLM prompts. Learn techniques like chain-of-thought, few-shot learning, and structured outputs. It's a rapidly growing field.",
            "mlops": "MLOps applies DevOps to machine learning. Learn model versioning, experiment tracking (MLflow), feature stores, model serving, and monitoring.",
            "aws": "AWS is the leading cloud provider. Start with EC2, S3, and Lambda, then explore services like SageMaker for ML, DynamoDB for NoSQL, and EKS for Kubernetes.",
        }
        self.suggestions_map = {
            "learning": ["Start with Python fundamentals", "Build a small project each week", "Join a coding community", "Read documentation regularly", "Practice on LeetCode or HackerRank"],
            "career": ["Build a portfolio on GitHub", "Network on LinkedIn", "Contribute to open source", "Write technical blog posts", "Attend tech meetups and conferences"],
            "general": ["Explore our Technology Radar for trends", "Use the Comparison Engine to evaluate technologies", "Check Career Intelligence for path guidance", "Try the Learning Path Generator", "Analyze research papers in your field"],
        }

    def chat(self, message: str, history: List[Dict[str, str]]) -> Dict:
        msg = message.lower()

        if any(w in msg for w in ["hello", "hi", "hey", "greetings"]):
            reply = "Hello! I'm your AI Mentor. Ask me about any technology, career advice, learning paths, or industry trends. How can I help you today?"
        elif any(w in msg for w in ["career", "job", "salary", "role"]):
            reply = "The tech industry offers diverse career paths. Popular roles include: Software Engineer, Data Scientist, ML Engineer, Cloud Architect, DevOps Engineer, and Cybersecurity Analyst. Each requires a unique skill set. What area interests you?"
        elif any(w in msg for w in ["learn", "study", "course", "tutorial", "beginner"]):
            reply = "Great that you're focusing on learning! I recommend: 1) Start with fundamentals, 2) Build hands-on projects, 3) Join a community for support, 4) Practice consistently. What technology would you like to learn?"
        elif any(w in msg for w in ["trend", "future", "hot", "latest"]):
            reply = "Current hot trends include: LLMs and Generative AI, MLOps, Edge Computing, Cybersecurity, and Cloud-Native Development. AI/ML continues to dominate with 90%+ growth rates across related technologies."
        elif any(w in msg for w in ["roadmap", "path", "plan"]):
            reply = "A good learning path combines theory with practice. Use our Learning Path Generator to create a personalized plan. Start with prerequisites, build core skills, then specialize. Would you like me to suggest a specific path?"
        elif any(w in msg for w in ["project", "portfolio", "build"]):
            reply = "Projects are crucial for learning. Start small: build a CLI tool, then a web app, then something with APIs. For AI/ML, try a classification model, a chatbot, or a recommendation system."
        else:
            reply = self._find_response(msg)
            if not reply:
                reply = "I'm not sure about that specific topic. Let me point you to our Technology Explorer where you can browse all technologies and their details. You can also check the Career Intelligence or Learning Path Generator for more structured guidance."

        suggestions = self.suggestions_map["learning"] if any(w in msg for w in ["learn", "study", "course", "beginner"]) else \
                     self.suggestions_map["career"] if any(w in msg for w in ["career", "job", "salary"]) else \
                     self.suggestions_map["general"]
        return {"reply": reply, "suggestions": suggestions}

    def _find_response(self, msg: str) -> str:
        for keyword, resp in self.responses.items():
            if keyword in msg:
                return resp
        return ""
