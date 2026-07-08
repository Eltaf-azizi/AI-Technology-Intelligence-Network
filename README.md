# AI Technology Intelligence Network (ATIN)

An AI-powered platform that maps the entire technology ecosystem. Explore technologies, relationships, learning paths, career insights, and market trends through an interactive knowledge graph.

## Architecture

```
atin/
├── backend/          # FastAPI + SQLAlchemy + SQLite
│   ├── app/
│   │   ├── api/      # Route handlers (auth, technologies, etc.)
│   │   ├── models/   # SQLAlchemy ORM models
│   │   ├── schemas/  # Pydantic request/response schemas
│   │   ├── services/ # Business logic layer
│   │   ├── agents/   # AI rule-based agents (learning, trends, career)
│   │   └── core/     # Security, rate limiting, logging
│   ├── tests/        # Pytest test suite (~80 tests)
│   └── data/         # SQLite database & uploads
├── frontend/         # Next.js 15 + React 19 + TypeScript + Tailwind 4
│   └── src/
│       ├── app/      # App router pages (13 routes)
│       ├── components/ # Reusable UI components
│       └── lib/      # Types, API client, utilities
├── docker-compose.yml
└── Dockerfile
```

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv && .venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

API docs at http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

### Docker

```bash
docker compose up --build
```

## Testing

```bash
cd backend
pytest tests/ -v
```

## API Endpoints

| Group | Endpoints |
|-------|-----------|
| Auth | POST /api/auth/register, /login, /refresh; GET /me |
| Technologies | GET /technologies, /technologies/{slug}, /search, /categories |
| Relationships | GET /relationships, /graph, /technologies/{slug}/relationships, /related |
| Careers | GET /careers, /careers/{id}, /careers/{id}/path |
| Trends | GET /trends, /trends/summary, /trends/{stage} |
| Mentor | POST /mentor/chat, GET /mentor/suggestions |
| Research | GET /research, POST /upload, DELETE /{id} |
| Learning | POST /learning/generate |
| Compare | GET /compare/available, GET /compare?tech1=&tech2= |
| Analytics | GET /analytics/dashboard, /analytics/summary |
| Users | GET/POST /users/progress, GET/POST/DELETE /users/saved-paths, GET /users/audit-logs |

## Features

- **Interactive Knowledge Graph** — D3.js force-directed graph of 30+ technologies with 50+ relationships
- **Technology Radar** — Track trends, growth rates, and market momentum
- **AI Mentor** — Rule-based chatbot with contextual technology guidance
- **Learning Path Generator** — Personalized roadmaps based on career goals
- **Career Intelligence** — Salary data, market demand, skill requirements
- **Side-by-Side Comparison** — Compare technologies across 5 dimensions
- **Analytics Dashboard** — Category, difficulty, and outlook distributions
- **Research Paper Analyzer** — Upload and analyze academic papers
- **Full-Text Search** — Filter by category, difficulty, keyword
- **JWT Authentication** — Register, login, refresh tokens, audit logging
- **Rate Limiting** — Per-endpoint rate limits with test bypass

## Credentials

Default admin: `admin` / `admin123` (created at startup if DB is empty)
