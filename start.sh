#!/bin/bash

# Study Tracker Application - Linux/macOS Startup Script

echo ""
echo "===================================="
echo "  Study Tracker Application"
echo "===================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed or not in PATH"
    echo "Please install Docker from https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed or not in PATH"
    echo "Please install Docker Compose"
    exit 1
fi

echo "Starting Study Tracker Application..."
echo ""

# Build and start containers
docker-compose up -d

# Check if containers started successfully
docker-compose ps

echo ""
echo "===================================="
echo "  Application Started Successfully!"
echo "===================================="
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:5000"
echo "MongoDB:   localhost:27017"
echo "Redis:     localhost:6379"
echo ""
echo "Default Credentials:"
echo "   Email: test@example.com"
echo "   Password: password123 (register first)"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop:      docker-compose down"
echo ""
