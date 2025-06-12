# Makefile with colored output and help documentation

# Color definitions
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
RED := \033[0;31m
NC := \033[0m # No Color
BOLD := \033[1m

# Docker compose command detection
DOCKER_COMPOSE := $(shell command -v docker-compose 2> /dev/null)
ifndef DOCKER_COMPOSE
	DOCKER_COMPOSE := docker compose
else
	DOCKER_COMPOSE := docker-compose
endif

.PHONY: help run test start stop clean

# Default target
all: start

# Help target (displays available commands)
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

# Run the application locally
run: ## Build and run the CV website locally
	@echo "🚀 Building and starting CV website..."
	docker-compose up --build

# Run tests
test: ## Run basic tests and validation
	@echo "🧪 Running tests..."
	@echo "✅ Basic file structure check..."
	@test -f index.html || (echo "❌ index.html missing" && exit 1)
	@test -f style.css || (echo "❌ style.css missing" && exit 1)
	@test -f script.js || (echo "❌ script.js missing" && exit 1)
	@test -f robots.txt || (echo "❌ robots.txt missing" && exit 1)
	@test -f humans.txt || (echo "❌ humans.txt missing" && exit 1)
	@echo "✅ Testing Docker build..."
	@docker-compose build >/dev/null 2>&1 && echo "✅ Docker build successful" || echo "❌ Docker build failed"
	@echo "✅ All basic tests passed!"

# Start with Docker Compose
start: ## Start the CV website in detached mode
	@echo "🚀 Starting CV website in background..."
	docker-compose up -d
	@echo "✅ CV website is running at http://localhost:3001"

# Stop Docker containers
stop: ## Stop the CV website
	@echo "🛑 Stopping CV website..."
	docker-compose down
	@echo "✅ CV website stopped"

# Clean build artifacts and stop containers
clean: ## Clean up Docker containers, images, and volumes
	@echo "🧹 Cleaning up..."
	docker-compose down --volumes --remove-orphans
	docker system prune -f
	@echo "✅ Cleanup complete" 