from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict

router = APIRouter()

class ComparisonResult(BaseModel):
    tech1: str
    tech2: str
    strengths: Dict[str, str]
    weaknesses: Dict[str, str]
    useCases: Dict[str, str]
    learningCurve: Dict[str, str]
    adoption: Dict[str, str]

COMPARISONS_DB = {
    "docker-vs-kubernetes": ComparisonResult(
        tech1="Docker",
        tech2="Kubernetes",
        strengths={
            "Docker": "Lightweight containers, fast startup, simple learning curve, excellent for local development",
            "Kubernetes": "Auto-scaling, self-healing, service discovery, production-grade orchestration"
        },
        weaknesses={
            "Docker": "Limited orchestration, manual scaling, no built-in load balancing at scale",
            "Kubernetes": "Complex setup, steep learning curve, resource-heavy, overkill for small apps"
        },
        useCases={
            "Docker": "Local development, CI/CD builds, microservice packaging, single-host deployments",
            "Kubernetes": "Large-scale microservices, cloud-native apps, multi-host orchestration, production workloads"
        },
        learningCurve={
            "Docker": "Easy - 1-2 months to proficiency",
            "Kubernetes": "Hard - 3-6 months to proficiency"
        },
        adoption={
            "Docker": "Ubiquitous - 95% adoption among developers",
            "Kubernetes": "Widespread - 85% adoption in enterprises"
        }
    ),
    "tensorflow-vs-pytorch": ComparisonResult(
        tech1="TensorFlow",
        tech2="PyTorch",
        strengths={
            "TensorFlow": "Production-ready, TensorBoard visualization, TF Serving, strong mobile support",
            "PyTorch": "Pythonic API, dynamic graphs, easier debugging, research-friendly, growing ecosystem"
        },
        weaknesses={
            "TensorFlow": "Steeper learning curve, verbose API, debugging challenges",
            "PyTorch": "Newer production tooling, smaller mobile ecosystem"
        },
        useCases={
            "TensorFlow": "Production deployment, mobile/edge inference, large-scale distributed training",
            "PyTorch": "Research prototyping, academic projects, dynamic model architectures"
        },
        learningCurve={
            "TensorFlow": "Moderate - 2-4 months",
            "PyTorch": "Moderate - 1-3 months"
        },
        adoption={
            "TensorFlow": "68% market share, strong in industry",
            "PyTorch": "Growing rapidly, 55% of research papers use it"
        }
    ),
    "react-vs-angular": ComparisonResult(
        tech1="React",
        tech2="Angular",
        strengths={
            "React": "Flexible, huge ecosystem, excellent performance, great developer experience",
            "Angular": "Full-featured framework, TypeScript-first, strong opinions, enterprise-ready"
        },
        weaknesses={
            "React": "Not a full framework, requires additional libraries, too many choices",
            "Angular": "Steep learning curve, verbose, opinionated, heavy bundle size"
        },
        useCases={
            "React": "SPAs, interactive UIs, mobile (React Native), component libraries",
            "Angular": "Enterprise apps, large teams, complex forms, full-featured SPAs"
        },
        learningCurve={
            "React": "Easy to start - 2-4 months",
            "Angular": "Steep - 3-6 months"
        },
        adoption={
            "React": "82% developer satisfaction, most popular frontend framework",
            "Angular": "Strong enterprise adoption, 45% developer satisfaction"
        }
    ),
    "sql-vs-nosql": ComparisonResult(
        tech1="SQL",
        tech2="NoSQL",
        strengths={
            "SQL": "ACID compliance, complex queries, joins, strong consistency, mature ecosystem",
            "NoSQL": "Horizontal scaling, flexible schemas, high performance for simple queries, great for big data"
        },
        weaknesses={
            "SQL": "Vertical scaling limits, rigid schema, less suited for unstructured data",
            "NoSQL": "No ACID guarantees, limited query capabilities, eventual consistency"
        },
        useCases={
            "SQL": "Financial systems, CRM, ERP, structured data with relationships",
            "NoSQL": "Real-time apps, IoT, content management, big data analytics"
        },
        learningCurve={
            "SQL": "Easy - 1-2 months",
            "NoSQL": "Moderate - 2-4 months"
        },
        adoption={
            "SQL": "Universal - 90% of systems use a relational database",
            "NoSQL": "Growing - 60% of new projects consider NoSQL"
        }
    ),
}

@router.get("/{comparison_id}", response_model=ComparisonResult)
async def get_comparison(comparison_id: str):
    """Get a specific technology comparison"""
    comparison = COMPARISONS_DB.get(comparison_id.lower())
    if not comparison:
        raise HTTPException(
            status_code=404,
            detail=f"Comparison '{comparison_id}' not found. Available: {list(COMPARISONS_DB.keys())}"
        )
    return comparison

@router.get("", response_model=list[dict])
async def list_comparisons():
    """List all available comparisons"""
    return [
        {
            "id": "docker-vs-kubernetes",
            "tech1": "Docker",
            "tech2": "Kubernetes",
            "description": "Container technology comparison"
        },
        {
            "id": "tensorflow-vs-pytorch",
            "tech1": "TensorFlow",
            "tech2": "PyTorch",
            "description": "Deep learning framework comparison"
        },
        {
            "id": "react-vs-angular",
            "tech1": "React",
            "tech2": "Angular",
            "description": "Frontend framework comparison"
        },
        {
            "id": "sql-vs-nosql",
            "tech1": "SQL",
            "tech2": "NoSQL",
            "description": "Database technology comparison"
        },
    ]
