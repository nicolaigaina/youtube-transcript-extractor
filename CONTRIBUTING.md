# Contributing to YouTube Transcript Extractor

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/youtube-transcript-extractor.git`
3. **Create a branch**: `git checkout -b feature/your-feature-name`
4. **Install dependencies**: `make setup`
5. **Start development**: `make dev`

## Development Setup

### Prerequisites

- Node.js 20+
- Python 3.12+
- Docker (optional, for containerized development)

### Running Locally

```bash
# Backend (Terminal 1)
cd backend
pip install -r requirements.txt
python app.py

# Frontend (Terminal 2)
cd frontend
npm install
npx prisma db push
npm run dev
```

### Running with Docker

```bash
docker compose -f docker-compose.dev.yml up --build
```

## Code Style

### Frontend (TypeScript)
- ESLint for linting
- Prettier for formatting
- TypeScript strict mode

### Backend (Python)
- flake8 for linting (max line length: 120)
- Type hints encouraged
- Docstrings for public functions

## Pull Request Process

1. Ensure your code passes all checks: `make lint && make test`
2. Update documentation if you changed behavior
3. Write a clear PR description explaining what and why
4. One feature per PR -- keep changes focused

## Reporting Bugs

Use the [bug report template](https://github.com/nicolaigaina/youtube-transcript-extractor/issues/new?template=bug_report.md) and include:

- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, Docker version)

## Suggesting Features

Use the [feature request template](https://github.com/nicolaigaina/youtube-transcript-extractor/issues/new?template=feature_request.md) and include:

- Problem description
- Proposed solution
- Alternatives considered

## Code of Conduct

Be respectful and constructive. We're all here to build something useful.

## Questions?

Open an issue -- we're happy to help!
