# YouTube Transcript Extractor

> Free, open-source YouTube transcript extractor with multi-language support, timestamps, and export to TXT, PDF, JSON. Self-hosted with Docker.

[![CI](https://github.com/nicolaigaina/youtube-transcript-extractor/actions/workflows/ci.yml/badge.svg)](https://github.com/nicolaigaina/youtube-transcript-extractor/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Features](#features) | [Quick Start](#quick-start) | [API Docs](docs/API.md) | [Contributing](CONTRIBUTING.md)

## Features

- **Multi-Language Support** -- Automatically detects and extracts transcripts in 100+ languages
- **Instant Language Switching** -- Switch between available languages without re-fetching
- **Word-Level Timestamps** -- Optional segment-level timing data synced to video
- **Export Formats** -- Download as TXT, PDF, or JSON
- **Full-Text Search** -- Search within transcripts with match highlighting and navigation
- **Transcript History** -- All extracted transcripts saved locally with deduplication
- **Dark Mode** -- Full dark/light theme support
- **Self-Hosted** -- Run on your own infrastructure, your data stays private
- **Docker Ready** -- One command to launch with Docker Compose
- **Optional Proxy** -- Oxylabs residential proxy support for high-volume usage

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
git clone https://github.com/nicolaigaina/youtube-transcript-extractor.git
cd youtube-transcript-extractor
docker compose up
```

Open [http://localhost:3000](http://localhost:3000)

### Option 2: Local Development

**Prerequisites:** Node.js 20+, Python 3.12+

```bash
# Clone
git clone https://github.com/nicolaigaina/youtube-transcript-extractor.git
cd youtube-transcript-extractor

# Backend
cd backend
pip install -r requirements.txt
python app.py

# Frontend (new terminal)
cd frontend
npm install
cp ../.env.example .env
npx prisma db push
npm run dev
```

### Option 3: Make

```bash
make setup  # Install dependencies
make dev    # Start both servers
```

## Architecture

```
┌─────────────────────┐     ┌─────────────────────┐
│                     │     │                     │
│   Next.js Frontend  │────>│  Flask Backend API  │
│   (Port 3000)       │     │  (Port 5000)        │
│                     │     │                     │
│  - Server Actions   │     │  - /api/transcript  │
│  - Prisma (SQLite)  │     │  - /api/health      │
│  - shadcn/ui        │     │  - youtube-transcript│
│  - Dark Mode        │     │    -api + Proxy      │
│                     │     │                     │
└─────────────────────┘     └─────────────────────┘
         │
         v
   ┌───────────┐
   │  SQLite   │
   │  Database │
   └───────────┘
```

**Frontend:** Next.js 15 with App Router, Tailwind CSS, shadcn/ui components. Server Actions serve as the middle tier between the UI and backend API. Prisma with SQLite for zero-config persistence.

**Backend:** Python Flask API using `youtube-transcript-api` library. Supports optional Oxylabs residential proxy for reliability at scale.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_URL` | `http://localhost:5000` | Backend API URL |
| `FRONTEND_URL` | `http://localhost:3000` | Frontend URL (for CORS) |
| `DATABASE_URL` | `file:./data/transcripts.db` | SQLite database path |
| `OXYLABS_RESIDENTIAL_USERNAME` | -- | Optional: Oxylabs proxy username |
| `OXYLABS_RESIDENTIAL_PASSWORD` | -- | Optional: Oxylabs proxy password |

## API Documentation

See [docs/API.md](docs/API.md) for full backend API documentation.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Python, Flask, youtube-transcript-api |
| Database | SQLite (via Prisma) |
| Deployment | Docker, Docker Compose |

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on how to submit pull requests, report bugs, and suggest features.

## License

This project is licensed under the MIT License -- see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built by the team behind <a href="https://autoshorts.app"><strong>AutoShorts</strong></a> -- AI-powered video repurposing for content creators.
</p>
