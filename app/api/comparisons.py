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
    