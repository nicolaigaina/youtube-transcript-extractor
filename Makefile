.PHONY: dev build start stop test lint clean setup

# Development (requires Node.js + Python installed locally)
dev:
	@echo "Starting development servers..."
	@make -j2 dev-frontend dev-backend

dev-frontend:
	cd frontend && npm run dev

dev-backend:
	cd backend && python app.py

# Docker
build:
	docker compose build

start:
	docker compose up -d

stop:
	docker compose down

logs:
	docker compose logs -f

# Docker development (with hot reload)
dev-docker:
	docker compose -f docker-compose.dev.yml up --build

# Testing
test:
	cd backend && python -m pytest tests/ -v
	cd frontend && npm run test

test-backend:
	cd backend && python -m pytest tests/ -v

test-frontend:
	cd frontend && npm run test

# Code quality
lint:
	cd frontend && npm run lint
	cd backend && python -m flake8 app.py transcript_service.py video_utils.py proxy_config.py --max-line-length 120

typecheck:
	cd frontend && npm run typecheck

# Setup (first time)
setup:
	cd frontend && npm install && npx prisma db push
	cd backend && pip install -r requirements.txt

# Clean
clean:
	rm -rf frontend/.next frontend/node_modules backend/__pycache__ backend/.venv
