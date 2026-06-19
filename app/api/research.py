from fastapi import APIRouter, HTTPException
from app.models import ResearchPaper

router = APIRouter()

papers_db = [
    ResearchPaper(id="attention-is-all-you-need", title="Attention Is All You Need", year="2017", field="NLP",
                  summary="Introduced the Transformer architecture, which became the foundation for modern LLMs.",
                  technologies=["Transformers", "Attention", "Deep Learning"],
                  concepts=["Self-Attention", "Multi-Head Attention", "Positional Encoding"],
                  relatedTechnologies=["LLM Engineering", "NLP", "RAG"]),
    ResearchPaper(id="bert", title="BERT: Pre-training of Deep Bidirectional Transformers", year="2018", field="NLP",
                  summary="Introduced bidirectional pre-training for language representations.",
                  technologies=["Transformers", "BERT", "Deep Learning"],
                  concepts=["Masked LM", "Next Sentence Prediction", "Fine-tuning"],
                  relatedTechnologies=["NLP", "LLM Engineering", "Search"]),
    ResearchPaper(id="gpt-3", title="GPT-3: Language Models are Few-Shot Learners", year="2020", field="NLP",
                  summary="Demonstrated that scaling language models to 175B parameters enables few-shot learning.",
                  technologies=["GPT", "Transformers", "LLMs"],
                  concepts=["Few-Shot Learning", "In-Context Learning", "Scaling Laws"],
                  relatedTechnologies=["LLM Engineering", "Prompt Engineering", "RAG"]),
    ResearchPaper(id="resnet", title="Deep Residual Learning for Image Recognition", year="2015", field="Computer Vision",
                  summary="Introduced residual learning to train very deep networks (152 layers).",
                  technologies=["ResNet", "CNNs", "Deep Learning"],
                  concepts=["Residual Connections", "Skip Connections", "Batch Normalization"],
                  relatedTechnologies=["Computer Vision", "Deep Learning", "Image Recognition"]),
    ResearchPaper(id="gan", title="Generative Adversarial Networks", year="2014", field="Computer Vision",
                  summary="Introduced a framework for training generative models through an adversarial process.",
                  technologies=["GANs", "Deep Learning", "Generative Models"],
                  concepts=["Adversarial Training", "Generator", "Discriminator"],
                  relatedTechnologies=["Computer Vision", "Image Generation", "Deep Learning"]),
    ResearchPaper(id="rlhf", title="Training Language Models to Follow Instructions with RLHF", year="2022", field="AI Safety",
                  summary="Showed how reinforcement learning from human feedback can align language models.",
                  technologies=["RLHF", "LLMs", "Reinforcement Learning"],
                  concepts=["Human Feedback", "Reward Modeling", "PPO"],
                  relatedTechnologies=["LLM Engineering", "AI Safety", "NLP"]),
]

@router.get("", response_model=list[ResearchPaper])
async def get_all_papers():
    return papers_db

@router.get("/{paper_id}", response_model=ResearchPaper)
async def get_paper(paper_id: str):
    paper = next((p for p in papers_db if p.id == paper_id), None)
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper
