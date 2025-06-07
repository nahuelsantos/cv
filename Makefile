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
help:
	@echo "${BOLD}Available commands:${NC}"
	@echo "${BLUE}make help${NC}    - Display this help message"
	@echo "${BLUE}make run${NC}     - Run the application locally (without Docker)"
	@echo "${BLUE}make test${NC}    - Run tests for the React app"
	@echo "${BLUE}make start${NC}   - Start the app as a Docker Compose container"
	@echo "${BLUE}make stop${NC}    - Stop the Docker Compose containers"
	@echo "${BLUE}make clean${NC}   - Clean build artifacts and stop containers"

# Run the application locally
run:
	@echo "${YELLOW}Installing dependencies...${NC}"
	@npm install
	@if [ ! -f .env ]; then \
		echo "${YELLOW}Creating .env from .env.example...${NC}"; \
		cp .env.example .env; \
	fi
	@echo "${YELLOW}Starting React client...${NC}"
	@npm start

# Run tests
test:
	@echo "${YELLOW}Running React tests...${NC}"
	@npm test -- --watchAll=false
	@echo "${GREEN}All tests completed!${NC}"

# Start with Docker Compose
start:
	@echo "${YELLOW}Preparing environment...${NC}"
	@if [ ! -f .env ]; then \
		echo "${YELLOW}Creating .env from .env.example...${NC}"; \
		cp .env.example .env; \
	fi
	@echo "${YELLOW}Installing npm dependencies...${NC}"
	@npm install
	@echo "${YELLOW}Building React app locally...${NC}"
	@npm run build
	@echo "${YELLOW}Starting with Docker Compose...${NC}"
	@$(DOCKER_COMPOSE) up --build
	@echo "${GREEN}Docker Compose is running!${NC}"

# Stop Docker containers
stop:
	@echo "${YELLOW}Stopping Docker containers...${NC}"
	@$(DOCKER_COMPOSE) down
	@echo "${GREEN}Docker containers stopped!${NC}"

# Clean build artifacts and stop containers
clean:
	@echo "${YELLOW}Cleaning build artifacts...${NC}"
	@rm -rf build
	@$(DOCKER_COMPOSE) down -v --remove-orphans
	@docker system prune -f
	@echo "${GREEN}Clean complete!${NC}" 