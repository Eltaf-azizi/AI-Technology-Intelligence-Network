import { Technology, Relationship, Career, TrendData } from "./types";

export const technologies: Technology[] = [
  {
    id: "python", name: "Python", category: "Programming Languages",
    description: "A high-level, general-purpose programming language known for its readability and versatility. Widely used in AI, data science, web development, and automation.",
    difficulty: "Beginner", learningTime: "3-6 months",
    prerequisites: [], skills: ["Syntax", "OOP", "Libraries", "Debugging"],
    applications: ["Web Development", "Data Science", "AI/ML", "Automation", "Backend"],
    companies: ["Google", "Netflix", "Spotify", "Instagram", "Dropbox"],
    futureOutlook: "Growing", growthRate: 95, popularity: 98, icon: "🐍", color: "#3776AB"
  },
  {
    id: "javascript", name: "JavaScript", category: "Programming Languages",
    description: "A dynamic programming language essential for web development. Runs on both client and server sides, making it universal for modern web applications.",
    difficulty: "Beginner", learningTime: "3-6 months",
    prerequisites: [], skills: ["DOM Manipulation", "Async Programming", "ES6+", "Frameworks"],
    applications: ["Web Development", "Mobile Apps", "Server-side", "Game Development"],
    companies: ["Google", "Meta", "Microsoft", "Amazon", "Apple"],
    futureOutlook: "Growing", growthRate: 90, popularity: 97, icon: "🟨", color: "#F7DF1E"
  },
  {
    id: "typescript", name: "TypeScript", category: "Programming Languages",
    description: "A typed superset of JavaScript that compiles to plain JavaScript. Adds static typing for better tooling and error prevention at scale.",
    difficulty: "Intermediate", learningTime: "2-4 months",
    prerequisites: ["javascript"], skills: ["Types", "Generics", "Interfaces", "Decorators"],
    applications: ["Web Development", "Enterprise Apps", "Libraries", "Full-stack"],
    companies: ["Microsoft", "Google", "Airbnb", "Slack", "Asana"],
    futureOutlook: "Growing", growthRate: 92, popularity: 90, icon: "🔷", color: "#3178C6"
  },
  {
    id: "machine-learning", name: "Machine Learning", category: "Artificial Intelligence",
    description: "A subset of AI that enables systems to learn and improve from experience without explicit programming. Uses statistical techniques to give computers the ability to learn.",
    difficulty: "Advanced", learningTime: "6-12 months",
    prerequisites: ["python", "mathematics", "statistics"], skills: ["Regression", "Classification", "Clustering", "Model Evaluation"],
    applications: ["Predictive Analytics", "Recommendation Systems", "Fraud Detection", "Healthcare"],
    companies: ["Google", "Amazon", "Microsoft", "Apple", "Meta"],
    futureOutlook: "Growing", growthRate: 98, popularity: 95, icon: "🤖", color: "#FF6F00"
  },
  {
    id: "deep-learning", name: "Deep Learning", category: "Artificial Intelligence",
    description: "A subset of machine learning using neural networks with many layers. Enables advanced capabilities in image recognition, NLP, and generative AI.",
    difficulty: "Advanced", learningTime: "6-12 months",
    prerequisites: ["machine-learning", "python", "linear-algebra"], skills: ["Neural Networks", "CNNs", "RNNs", "Transformers"],
    applications: ["Image Recognition", "NLP", "Speech Recognition", "Generative AI"],
    companies: ["Google DeepMind", "OpenAI", "Meta AI", "Apple", "NVIDIA"],
    futureOutlook: "Growing", growthRate: 99, popularity: 93, icon: "🧠", color: "#E91E63"
  },
  {
    id: "computer-vision", name: "Computer Vision", category: "Artificial Intelligence",
    description: "A field of AI that enables computers to interpret and understand visual information from the world, processing images and video to extract meaningful data.",
    difficulty: "Advanced", learningTime: "6-12 months",
    prerequisites: ["deep-learning", "python", "linear-algebra"], skills: ["Image Processing", "Object Detection", "Segmentation", "Feature Extraction"],
    applications: ["Autonomous Vehicles", "Medical Imaging", "Surveillance", "AR/VR"],
    companies: ["Tesla", "Waymo", "NVIDIA", "Microsoft", "Apple"],
    futureOutlook: "Growing", growthRate: 94, popularity: 85, icon: "👁️", color: "#9C27B0"
  },
  {
    id: "natural-language-processing", name: "Natural Language Processing", category: "Artificial Intelligence",
    description: "A branch of AI that helps computers understand, interpret, and generate human language. Powers chatbots, translation, and text analysis.",
    difficulty: "Advanced", learningTime: "4-8 months",
    prerequisites: ["machine-learning", "python"], skills: ["Tokenization", "Embeddings", "Transformers", "Sequence Models"],
    applications: ["Chatbots", "Translation", "Sentiment Analysis", "Text Generation"],
    companies: ["OpenAI", "Google", "Meta", "Amazon", "IBM"],
    futureOutlook: "Growing", growthRate: 97, popularity: 90, icon: "💬", color: "#00BCD4"
  },
  {
    id: "llm-engineering", name: "LLM Engineering", category: "Artificial Intelligence",
    description: "The practice of building applications around Large Language Models. Includes prompt engineering, RAG systems, fine-tuning, and deployment.",
    difficulty: "Advanced", learningTime: "3-6 months",
    prerequisites: ["python", "natural-language-processing", "machine-learning"], skills: ["Prompt Engineering", "RAG", "Fine-tuning", "LangChain"],
    applications: ["Chatbots", "Code Generation", "Content Creation", "Research"],
    companies: ["OpenAI", "Anthropic", "Google", "Meta", "Cohere"],
    futureOutlook: "Growing", growthRate: 100, popularity: 96, icon: "📝", color: "#FF5722"
  },
  {
    id: "docker", name: "Docker", category: "DevOps & Cloud",
    description: "A platform for developing, shipping, and running applications in containers. Ensures consistency across development, testing, and production environments.",
    difficulty: "Intermediate", learningTime: "1-2 months",
    prerequisites: ["linux", "networking"], skills: ["Containerization", "Dockerfile", "Compose", "Registry"],
    applications: ["Microservices", "CI/CD", "DevOps", "Cloud Deployments"],
    companies: ["Netflix", "Uber", "Spotify", "Airbnb", "Shopify"],
    futureOutlook: "Growing", growthRate: 88, popularity: 92, icon: "🐳", color: "#2496ED"
  },
  {
    id: "kubernetes", name: "Kubernetes", category: "DevOps & Cloud",
    description: "An open-source platform for automating deployment, scaling, and management of containerized applications. The industry standard for container orchestration.",
    difficulty: "Advanced", learningTime: "3-6 months",
    prerequisites: ["docker", "linux", "networking", "cloud-fundamentals"], skills: ["Orchestration", "Pods", "Services", "Helm"],
    applications: ["Microservices", "Cloud Native", "CI/CD", "Edge Computing"],
    companies: ["Google", "Spotify", "Adobe", "New Relic", "Capital One"],
    futureOutlook: "Growing", growthRate: 91, popularity: 90, icon: "☸️", color: "#326CE5"
  },
  {
    id: "cloud-computing", name: "Cloud Computing", category: "DevOps & Cloud",
    description: "The delivery of computing services over the internet. Enables on-demand access to servers, storage, databases, networking, and software resources.",
    difficulty: "Intermediate", learningTime: "3-6 months",
    prerequisites: ["networking"], skills: ["IaaS", "PaaS", "SaaS", "Virtualization"],
    applications: ["Web Hosting", "Data Storage", "SaaS", "Disaster Recovery"],
    companies: ["AWS", "Microsoft", "Google", "IBM", "Oracle"],
    futureOutlook: "Growing", growthRate: 93, popularity: 94, icon: "☁️", color: "#4285F4"
  },
  {
    id: "aws", name: "AWS", category: "DevOps & Cloud",
    description: "Amazon Web Services is the world's most comprehensive cloud platform, offering over 200 services from data centers globally.",
    difficulty: "Intermediate", learningTime: "3-6 months",
    prerequisites: ["cloud-computing", "networking"], skills: ["EC2", "S3", "Lambda", "RDS"],
    applications: ["Web Hosting", "Big Data", "AI/ML", "IoT"],
    companies: ["Netflix", "Airbnb", "Spotify", "Samsung", "Unilever"],
    futureOutlook: "Growing", growthRate: 89, popularity: 95, icon: "☁️", color: "#FF9900"
  },
  {
    id: "cybersecurity", name: "Cybersecurity", category: "Security",
    description: "The practice of protecting systems, networks, and programs from digital attacks. Encompasses technologies, processes, and controls designed to protect data.",
    difficulty: "Intermediate", learningTime: "6-12 months",
    prerequisites: ["networking", "linux"], skills: ["Network Security", "Cryptography", "Ethical Hacking", "Incident Response"],
    applications: ["Network Protection", "Penetration Testing", "Compliance", "Threat Intelligence"],
    companies: ["CrowdStrike", "Palo Alto Networks", "Fortinet", "IBM", "Cisco"],
    futureOutlook: "Growing", growthRate: 96, popularity: 91, icon: "🔒", color: "#DC143C"
  },
  {
    id: "networking", name: "Networking", category: "Infrastructure",
    description: "The practice of connecting computers and devices to share resources. Forms the backbone of all modern digital communication and the internet.",
    difficulty: "Intermediate", learningTime: "3-6 months",
    prerequisites: [], skills: ["TCP/IP", "DNS", "Routing", "Subnetting"],
    applications: ["Internet", "Data Centers", "Enterprise Networks", "Cloud"],
    companies: ["Cisco", "Juniper", "Arista", "Google", "Amazon"],
    futureOutlook: "Stable", growthRate: 75, popularity: 80, icon: "🌐", color: "#00A86B"
  },
  {
    id: "linux", name: "Linux", category: "Infrastructure",
    description: "An open-source Unix-like operating system kernel. The foundation of most servers, cloud infrastructure, and development environments.",
    difficulty: "Intermediate", learningTime: "2-4 months",
    prerequisites: [], skills: ["Command Line", "File System", "Permissions", "Shell Scripting"],
    applications: ["Servers", "Development", "DevOps", "Embedded Systems"],
    companies: ["Google", "Amazon", "Meta", "Microsoft", "IBM"],
    futureOutlook: "Stable", growthRate: 80, popularity: 88, icon: "🐧", color: "#FCC624"
  },
  {
    id: "data-science", name: "Data Science", category: "Data & Analytics",
    description: "An interdisciplinary field that uses scientific methods, algorithms, and systems to extract insights from structured and unstructured data.",
    difficulty: "Intermediate", learningTime: "6-12 months",
    prerequisites: ["python", "statistics", "mathematics"], skills: ["Data Analysis", "Visualization", "Statistics", "Feature Engineering"],
    applications: ["Business Intelligence", "Healthcare", "Finance", "Marketing"],
    companies: ["Google", "Amazon", "Microsoft", "Apple", "Meta"],
    futureOutlook: "Growing", growthRate: 90, popularity: 92, icon: "📊", color: "#4CAF50"
  },
  {
    id: "robotics", name: "Robotics", category: "Hardware & Embedded",
    description: "An interdisciplinary field integrating mechanical engineering, electronics, and computer science to design and build machines that can perform tasks autonomously.",
    difficulty: "Advanced", learningTime: "12-24 months",
    prerequisites: ["programming", "electronics", "mathematics"], skills: ["ROS", "Control Systems", "Sensors", "Actuators"],
    applications: ["Manufacturing", "Healthcare", "Autonomous Vehicles", "Exploration"],
    companies: ["Boston Dynamics", "Tesla", "ABB", "Fanuc", "Intuitive Surgical"],
    futureOutlook: "Growing", growthRate: 92, popularity: 82, icon: "🦾", color: "#607D8B"
  },
  {
    id: "electronics", name: "Electronics", category: "Hardware & Embedded",
    description: "The branch of physics and engineering dealing with the behavior and movement of electrons in devices. Foundation of all modern technology hardware.",
    difficulty: "Intermediate", learningTime: "6-12 months",
    prerequisites: ["mathematics"], skills: ["Circuit Design", "PCB Layout", "Microcontrollers", "Signal Processing"],
    applications: ["Consumer Electronics", "Medical Devices", "IoT", "Automotive"],
    companies: ["Apple", "Samsung", "Intel", "Texas Instruments", "Qualcomm"],
    futureOutlook: "Stable", growthRate: 78, popularity: 72, icon: "⚡", color: "#FFC107"
  },
  {
    id: "statistics", name: "Statistics", category: "Mathematics",
    description: "The science of collecting, analyzing, and interpreting data. Fundamental to data science, machine learning, and scientific research.",
    difficulty: "Intermediate", learningTime: "3-6 months",
    prerequisites: ["mathematics"], skills: ["Probability", "Hypothesis Testing", "Regression", "Bayesian"],
    applications: ["Data Science", "Research", "Finance", "Quality Control"],
    companies: ["Google", "Amazon", "Meta", "Netflix", "Spotify"],
    futureOutlook: "Stable", growthRate: 82, popularity: 78, icon: "📈", color: "#673AB7"
  },
  {
    id: "mathematics", name: "Mathematics", category: "Mathematics",
    description: "The abstract science of numbers, quantity, and space. Provides the theoretical foundation for computer science, AI, and engineering.",
    difficulty: "Intermediate", learningTime: "6-12 months",
    prerequisites: [], skills: ["Algebra", "Calculus", "Linear Algebra", "Discrete Math"],
    applications: ["AI/ML", "Engineering", "Finance", "Physics"],
    companies: ["All Tech Companies"],
    futureOutlook: "Stable", growthRate: 70, popularity: 75, icon: "📐", color: "#3F51B5"
  },
  {
    id: "linear-algebra", name: "Linear Algebra", category: "Mathematics",
    description: "The branch of mathematics concerning vector spaces and linear mappings. Essential for understanding machine learning and computer graphics.",
    difficulty: "Advanced", learningTime: "2-4 months",
    prerequisites: ["mathematics"], skills: ["Vectors", "Matrices", "Eigenvalues", "Vector Spaces"],
    applications: ["Machine Learning", "Computer Graphics", "Quantum Computing", "Engineering"],
    companies: ["NVIDIA", "Google", "Microsoft", "Apple", "AMD"],
    futureOutlook: "Stable", growthRate: 75, popularity: 70, icon: "🔢", color: "#2196F3"
  },
  {
    id: "mlops", name: "MLOps", category: "DevOps & Cloud",
    description: "A set of practices that combines ML, DevOps, and data engineering to deploy and maintain ML systems in production reliably and efficiently.",
    difficulty: "Advanced", learningTime: "3-6 months",
    prerequisites: ["machine-learning", "docker", "cloud-computing", "python"], skills: ["ML Pipelines", "Model Deployment", "Monitoring", "Feature Stores"],
    applications: ["Production ML", "Model Serving", "A/B Testing", "Model Monitoring"],
    companies: ["Netflix", "Uber", "Airbnb", "Spotify", "Doordash"],
    futureOutlook: "Growing", growthRate: 95, popularity: 85, icon: "🔄", color: "#00BFA5"
  },
  {
    id: "react", name: "React", category: "Programming Languages",
    description: "A JavaScript library for building user interfaces. Component-based architecture makes it ideal for building complex, interactive web applications.",
    difficulty: "Intermediate", learningTime: "3-6 months",
    prerequisites: ["javascript", "typescript"], skills: ["Components", "Hooks", "State Management", "JSX"],
    applications: ["Web Apps", "Mobile (React Native)", "SPAs", "Dashboards"],
    companies: ["Meta", "Netflix", "Airbnb", "Uber", "Shopify"],
    futureOutlook: "Growing", growthRate: 87, popularity: 94, icon: "⚛️", color: "#61DAFB"
  },
  {
    id: "sql", name: "SQL", category: "Data & Analytics",
    description: "Structured Query Language for managing and querying relational databases. A fundamental skill for working with data across all technology domains.",
    difficulty: "Beginner", learningTime: "1-2 months",
    prerequisites: [], skills: ["Queries", "Joins", "Indexing", "Normalization"],
    applications: ["Backend", "Data Analysis", "Business Intelligence", "Reporting"],
    companies: ["Every Tech Company"],
    futureOutlook: "Stable", growthRate: 80, popularity: 93, icon: "🗄️", color: "#336791"
  },
  {
    id: "git", name: "Git", category: "DevOps & Cloud",
    description: "A distributed version control system for tracking changes in source code. The industry standard for collaborative software development.",
    difficulty: "Beginner", learningTime: "1 month",
    prerequisites: [], skills: ["Version Control", "Branching", "Merging", "Rebasing"],
    applications: ["Software Development", "Open Source", "CI/CD", "Documentation"],
    companies: ["Every Tech Company"],
    futureOutlook: "Stable", growthRate: 75, popularity: 96, icon: "📦", color: "#F05032"
  },
  {
    id: "rag", name: "RAG (Retrieval Augmented Generation)", category: "Artificial Intelligence",
    description: "A technique that combines information retrieval with text generation. Enables LLMs to access external knowledge sources for more accurate responses.",
    difficulty: "Advanced", learningTime: "2-4 months",
    prerequisites: ["llm-engineering", "python", "natural-language-processing"], skills: ["Vector DBs", "Embeddings", "Chunking", "Retrieval"],
    applications: ["Q&A Systems", "Research Tools", "Customer Support", "Document Analysis"],
    companies: ["OpenAI", "Anthropic", "Cohere", "LlamaIndex", "LangChain"],
    futureOutlook: "Growing", growthRate: 98, popularity: 88, icon: "🔍", color: "#8BC34A"
  },
  {
    id: "quantum-computing", name: "Quantum Computing", category: "Emerging Technologies",
    description: "An emerging field that uses quantum mechanics to process information. Promises exponential speedup for specific computational problems.",
    difficulty: "Advanced", learningTime: "12-24 months",
    prerequisites: ["linear-algebra", "mathematics"], skills: ["Quantum Gates", "Qubits", "Quantum Algorithms", "Error Correction"],
    applications: ["Cryptography", "Drug Discovery", "Optimization", "Financial Modeling"],
    companies: ["IBM", "Google", "Microsoft", "IonQ", "Rigetti"],
    futureOutlook: "Growing", growthRate: 88, popularity: 65, icon: "⚛️", color: "#00BCD4"
  },
  {
    id: "blockchain", name: "Blockchain", category: "Emerging Technologies",
    description: "A distributed ledger technology that maintains a growing list of records linked using cryptography. Enables decentralized, transparent transactions.",
    difficulty: "Advanced", learningTime: "3-6 months",
    prerequisites: ["networking", "cryptography"], skills: ["Smart Contracts", "Consensus", "DApps", "Web3"],
    applications: ["Cryptocurrency", "Supply Chain", "Identity", "Voting"],
    companies: ["Ethereum", "Chainlink", "IBM", "Microsoft", "JP Morgan"],
    futureOutlook: "Stable", growthRate: 72, popularity: 68, icon: "⛓️", color: "#F7931A"
  },
  {
    id: "prompt-engineering", name: "Prompt Engineering", category: "Artificial Intelligence",
    description: "The practice of designing and optimizing input prompts to get desired outputs from language models. A key skill in the LLM era.",
    difficulty: "Beginner", learningTime: "1-2 months",
    prerequisites: [], skills: ["Prompt Design", "Chain-of-Thought", "Few-shot", "Persona Setting"],
    applications: ["Content Generation", "Code Generation", "Chatbots", "Data Extraction"],
    companies: ["OpenAI", "Anthropic", "Google", "Meta", "Microsoft"],
    futureOutlook: "Growing", growthRate: 96, popularity: 89, icon: "✏️", color: "#FF9800"
  },
  {
    id: "data-engineering", name: "Data Engineering", category: "Data & Analytics",
    description: "The practice of designing and building systems for collecting, storing, and analyzing data at scale. The foundation that enables data science and ML.",
    difficulty: "Intermediate", learningTime: "4-8 months",
    prerequisites: ["python", "sql", "cloud-computing"], skills: ["ETL", "Data Pipelines", "Data Warehousing", "Spark"],
    applications: ["Analytics", "Business Intelligence", "ML Infrastructure", "Reporting"],
    companies: ["Amazon", "Google", "Meta", "Netflix", "Uber"],
    futureOutlook: "Growing", growthRate: 91, popularity: 86, icon: "🏗️", color: "#795548"
  },
  {
    id: "ci-cd", name: "CI/CD", category: "DevOps & Cloud",
    description: "Continuous Integration and Continuous Deployment practices that automate the building, testing, and deployment of applications.",
    difficulty: "Intermediate", learningTime: "1-3 months",
    prerequisites: ["git", "docker"], skills: ["Pipeline Design", "Automation", "Testing", "Deployment"],
    applications: ["DevOps", "Software Delivery", "Quality Assurance", "Release Management"],
    companies: ["GitHub", "GitLab", "Netflix", "Google", "Amazon"],
    futureOutlook: "Growing", growthRate: 86, popularity: 87, icon: "🔄", color: "#E91E63"
  }
];

export const relationships: Relationship[] = [
  { source: "python", target: "machine-learning", type: "used-in", strength: 95 },
  { source: "python", target: "data-science", type: "used-in", strength: 92 },
  { source: "python", target: "deep-learning", type: "used-in", strength: 90 },
  { source: "python", target: "computer-vision", type: "used-in", strength: 85 },
  { source: "python", target: "natural-language-processing", type: "used-in", strength: 88 },
  { source: "python", target: "llm-engineering", type: "used-in", strength: 90 },
  { source: "python", target: "mlops", type: "used-in", strength: 85 },
  { source: "machine-learning", target: "deep-learning", type: "subset-of", strength: 95 },
  { source: "machine-learning", target: "computer-vision", type: "used-in", strength: 85 },
  { source: "machine-learning", target: "natural-language-processing", type: "used-in", strength: 85 },
  { source: "machine-learning", target: "mlops", type: "requires", strength: 80 },
  { source: "deep-learning", target: "computer-vision", type: "used-in", strength: 92 },
  { source: "deep-learning", target: "natural-language-processing", type: "used-in", strength: 88 },
  { source: "deep-learning", target: "llm-engineering", type: "foundation-for", strength: 90 },
  { source: "natural-language-processing", target: "llm-engineering", type: "foundation-for", strength: 92 },
  { source: "llm-engineering", target: "rag", type: "uses", strength: 90 },
  { source: "llm-engineering", target: "prompt-engineering", type: "includes", strength: 85 },
  { source: "javascript", target: "typescript", type: "superset-of", strength: 90 },
  { source: "javascript", target: "react", type: "used-in", strength: 95 },
  { source: "typescript", target: "react", type: "used-in", strength: 90 },
  { source: "docker", target: "kubernetes", type: "precedes", strength: 88 },
  { source: "docker", target: "mlops", type: "used-in", strength: 85 },
  { source: "docker", target: "ci-cd", type: "used-in", strength: 82 },
  { source: "kubernetes", target: "mlops", type: "used-in", strength: 80 },
  { source: "networking", target: "cybersecurity", type: "foundation-for", strength: 85 },
  { source: "networking", target: "cloud-computing", type: "foundation-for", strength: 80 },
  { source: "networking", target: "kubernetes", type: "prerequisite", strength: 70 },
  { source: "linux", target: "docker", type: "prerequisite", strength: 85 },
  { source: "linux", target: "kubernetes", type: "prerequisite", strength: 80 },
  { source: "linux", target: "cybersecurity", type: "used-in", strength: 82 },
  { source: "cloud-computing", target: "aws", type: "includes", strength: 90 },
  { source: "cloud-computing", target: "kubernetes", type: "related-to", strength: 75 },
  { source: "cloud-computing", target: "mlops", type: "used-in", strength: 80 },
  { source: "statistics", target: "data-science", type: "foundation-for", strength: 90 },
  { source: "statistics", target: "machine-learning", type: "foundation-for", strength: 85 },
  { source: "mathematics", target: "statistics", type: "foundation-for", strength: 80 },
  { source: "mathematics", target: "linear-algebra", type: "foundation-for", strength: 85 },
  { source: "linear-algebra", target: "machine-learning", type: "foundation-for", strength: 88 },
  { source: "linear-algebra", target: "deep-learning", type: "foundation-for", strength: 90 },
  { source: "linear-algebra", target: "computer-vision", type: "foundation-for", strength: 85 },
  { source: "linear-algebra", target: "quantum-computing", type: "foundation-for", strength: 90 },
  { source: "data-science", target: "machine-learning", type: "related-to", strength: 85 },
  { source: "data-engineering", target: "data-science", type: "foundation-for", strength: 80 },
  { source: "data-engineering", target: "machine-learning", type: "supports", strength: 75 },
  { source: "sql", target: "data-engineering", type: "used-in", strength: 85 },
  { source: "sql", target: "data-science", type: "used-in", strength: 80 },
  { source: "git", target: "ci-cd", type: "used-in", strength: 85 },
  { source: "react", target: "typescript", type: "commonly-used-with", strength: 88 },
  { source: "robotics", target: "computer-vision", type: "uses", strength: 80 },
  { source: "robotics", target: "machine-learning", type: "uses", strength: 75 },
  { source: "robotics", target: "electronics", type: "requires", strength: 82 },
  { source: "electronics", target: "robotics", type: "foundation-for", strength: 85 },
  { source: "cybersecurity", target: "blockchain", type: "related-to", strength: 65 },
  { source: "quantum-computing", target: "cybersecurity", type: "impacts", strength: 70 }
];

export const careers: Career[] = [
  {
    id: "ai-engineer", title: "AI Engineer", description: "Builds and deploys AI models and systems. Combines software engineering with machine learning to create intelligent applications.",
    demand: "High", salaryRange: "$120K - $250K", growth: 35,
    skills: ["Python", "Machine Learning", "Deep Learning", "MLOps", "Cloud Platforms", "Data Engineering"],
    learningOrder: ["python", "mathematics", "statistics", "machine-learning", "deep-learning", "mlops", "llm-engineering"],
    projects: ["Build an ML pipeline", "Deploy a model to production", "Create a RAG system", "Fine-tune an LLM"],
    estimatedTime: "12-18 months"
  },
  {
    id: "cybersecurity-analyst", title: "Cybersecurity Analyst", description: "Protects organizational systems and data from cyber threats. Monitors networks, investigates incidents, and implements security measures.",
    demand: "High", salaryRange: "$90K - $180K", growth: 32,
    skills: ["Networking", "Linux", "Cryptography", "Threat Analysis", "Penetration Testing", "SIEM Tools"],
    learningOrder: ["networking", "linux", "python", "cybersecurity"],
    projects: ["Set up a security monitoring system", "Conduct a penetration test", "Build a firewall", "Create an incident response plan"],
    estimatedTime: "8-14 months"
  },
  {
    id: "cloud-engineer", title: "Cloud Engineer", description: "Designs and manages cloud infrastructure. Ensures scalable, secure, and cost-effective cloud operations.",
    demand: "High", salaryRange: "$110K - $200K", growth: 28,
    skills: ["Cloud Platforms", "Networking", "Linux", "Docker", "Kubernetes", "CI/CD", "Infrastructure as Code"],
    learningOrder: ["networking", "linux", "cloud-computing", "aws", "docker", "kubernetes", "ci-cd"],
    projects: ["Deploy a web app on AWS", "Set up Kubernetes cluster", "Build a CI/CD pipeline", "Design a cloud architecture"],
    estimatedTime: "8-14 months"
  },
  {
    id: "data-scientist", title: "Data Scientist", description: "Extracts insights from data using statistical analysis, machine learning, and visualization. Drives data-informed decision making.",
    demand: "High", salaryRange: "$100K - $200K", growth: 25,
    skills: ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization", "Data Engineering"],
    learningOrder: ["python", "mathematics", "statistics", "sql", "data-science", "machine-learning"],
    projects: ["Analyze a dataset and present findings", "Build a prediction model", "Create a data dashboard", "Design an A/B test"],
    estimatedTime: "10-16 months"
  },
  {
    id: "fullstack-developer", title: "Full-Stack Developer", description: "Builds both frontend and backend of web applications. Handles everything from user interfaces to server logic and databases.",
    demand: "High", salaryRange: "$90K - $180K", growth: 20,
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "SQL", "Git", "Cloud"],
    learningOrder: ["javascript", "typescript", "react", "sql", "git", "cloud-computing"],
    projects: ["Build a full-stack web app", "Create a REST API", "Build a real-time dashboard", "Deploy a production app"],
    estimatedTime: "8-14 months"
  },
  {
    id: "mlops-engineer", title: "MLOps Engineer", description: "Bridges ML and operations. Ensures ML models are reliably deployed, monitored, and maintained in production environments.",
    demand: "High", salaryRange: "$130K - $260K", growth: 40,
    skills: ["Python", "ML", "Docker", "Kubernetes", "Cloud", "CI/CD", "Data Engineering"],
    learningOrder: ["python", "docker", "cloud-computing", "machine-learning", "mlops", "kubernetes", "ci-cd"],
    projects: ["Build an ML pipeline", "Set up model monitoring", "Create a feature store", "Automate model retraining"],
    estimatedTime: "12-18 months"
  },
  {
    id: "robotics-engineer", title: "Robotics Engineer", description: "Designs and builds robotic systems. Integrates hardware, software, and AI to create machines that interact with the physical world.",
    demand: "Medium", salaryRange: "$100K - $200K", growth: 22,
    skills: ["Python", "C++", "ROS", "Computer Vision", "Control Systems", "Electronics"],
    learningOrder: ["python", "mathematics", "electronics", "computer-vision", "machine-learning", "robotics"],
    projects: ["Build a line-following robot", "Implement SLAM", "Create a robotic arm controller", "Design an autonomous drone"],
    estimatedTime: "18-24 months"
  }
];

export const trends: TrendData[] = [
  { name: "LLM Engineering", category: "AI", growth: 100, momentum: 98, stage: "Growing" },
  { name: "RAG", category: "AI", growth: 98, momentum: 95, stage: "Growing" },
  { name: "AI Agents", category: "AI", growth: 97, momentum: 96, stage: "Emerging" },
  { name: "Computer Vision", category: "AI", growth: 85, momentum: 78, stage: "Mature" },
  { name: "MLOps", category: "DevOps", growth: 92, momentum: 88, stage: "Growing" },
  { name: "Cybersecurity AI", category: "Security", growth: 94, momentum: 90, stage: "Growing" },
  { name: "Quantum Computing", category: "Emerging", growth: 88, momentum: 82, stage: "Emerging" },
  { name: "Edge AI", category: "AI", growth: 90, momentum: 85, stage: "Growing" },
  { name: "WebAssembly", category: "Infrastructure", growth: 75, momentum: 72, stage: "Growing" },
  { name: "Blockchain", category: "Emerging", growth: 55, momentum: 45, stage: "Declining" },
  { name: "Flutter", category: "Mobile", growth: 78, momentum: 72, stage: "Mature" },
  { name: "Rust", category: "Languages", growth: 88, momentum: 85, stage: "Growing" },
  { name: "Web3", category: "Emerging", growth: 45, momentum: 38, stage: "Declining" },
  { name: "Kubernetes", category: "DevOps", growth: 82, momentum: 78, stage: "Mature" },
  { name: "Prompt Engineering", category: "AI", growth: 96, momentum: 92, stage: "Growing" },
];

export function getTechnologyById(id: string): Technology | undefined {
  return technologies.find(t => t.id === id);
}

export function getRelationshipsForTechnology(id: string): Relationship[] {
  return relationships.filter(r => r.source === id || r.target === id);
}

export function getRelatedTechnologies(id: string): Technology[] {
  const rels = getRelationshipsForTechnology(id);
  const relatedIds = new Set<string>();
  rels.forEach(r => {
    if (r.source === id) relatedIds.add(r.target);
    if (r.target === id) relatedIds.add(r.source);
  });
  return technologies.filter(t => relatedIds.has(t.id));
}

export function getTechnologiesByCategory(category: string): Technology[] {
  return technologies.filter(t => t.category === category);
}

export function searchTechnologies(query: string): Technology[] {
  const q = query.toLowerCase();
  return technologies.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q) ||
    t.applications.some(a => a.toLowerCase().includes(q))
  );
}
