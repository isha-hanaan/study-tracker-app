# Docker Setup Guide

Complete guide to Docker configuration and management for the Study Tracker Application.

## Docker Overview

This project uses Docker and Docker Compose for complete containerization:
- **Frontend**: React app served by Nginx
- **Backend**: Node.js/Express API
- **Database**: MongoDB
- **Cache**: Redis
- **Network**: Internal bridge network for inter-service communication

## Docker Compose Configuration

### Services Overview

#### MongoDB Service
```yaml
mongo:
  image: mongo:5-alpine
  ports: 27017:27017
  volumes:
    - mongo-data:/data/db
  healthcheck: enabled
```
- Lightweight Alpine image
- Persistent data volume
- Health checks for reliability
- Auto-restart on failure

#### Backend Service
```yaml
backend:
  build: ./backend
  ports: 5000:5000
  depends_on: mongo (healthy)
  environment: MongoDB URI, JWT secret
```
- Multi-stage build for optimization
- Depends on MongoDB health check
- Auto-restart policy
- Environment configuration

#### Frontend Service
```yaml
frontend:
  build: ./frontend
  ports: 3000:80
  depends_on: backend
```
- React build served by Nginx
- Proxies API requests to backend
- Depends on backend being available
- Auto-restart policy

#### Redis Service
```yaml
redis:
  image: redis:7-alpine
  ports: 6379:6379
  healthcheck: enabled
```
- Optional caching layer
- Auto-restart on failure
- Health checks enabled

## Building Images

### Build all images
```bash
docker-compose build
```

### Build specific service
```bash
docker-compose build backend
docker-compose build frontend
```

### Build without cache
```bash
docker-compose build --no-cache
```

### View built images
```bash
docker images | grep study-tracker
```

## Managing Containers

### Start Services
```bash
# Start all services (detached mode)
docker-compose up -d

# Start specific service
docker-compose up -d backend

# Start with logs
docker-compose up
```

### Stop Services
```bash
# Stop all services
docker-compose stop

# Stop specific service
docker-compose stop backend

# Stop and remove containers
docker-compose down
```

### View Status
```bash
# List running containers
docker-compose ps

# List all containers
docker-compose ps -a

# Get detailed info
docker-compose ps --format "table {{.Service}}\t{{.Status}}"
```

## Logs and Monitoring

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongo

# Follow logs in real-time
docker-compose logs -f

# Last 100 lines
docker-compose logs -n 100

# Since specific time
docker-compose logs --since 10m
```

### Container Stats
```bash
# CPU, memory usage
docker stats

# Specific container
docker stats study-tracker-backend

# Format table
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

## Debugging

### Access Container Shell
```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# MongoDB
docker-compose exec mongo sh
```

### Run Commands in Container
```bash
# Install package in backend
docker-compose exec backend npm install <package>

# Clear npm cache
docker-compose exec backend npm cache clean --force

# Check Node version
docker-compose exec backend node --version
```

### Inspect Container
```bash
# Container details
docker inspect study-tracker-backend

# Network info
docker network inspect study-tracker-network

# Volume info
docker volume inspect mongo-data
```

## Volumes and Persistence

### List Volumes
```bash
docker volume ls | grep study-tracker
```

### Volume Details
```bash
docker volume inspect mongo-data
docker volume inspect redis-data
```

### Backup Data
```bash
# Backup MongoDB
docker-compose exec mongo mongodump -u admin -p mongodb_password_change_me -o /dump

# Extract from container
docker cp study-tracker-mongo:/dump ./backup/
```

### Restore Data
```bash
# Copy to container
docker cp ./backup/dump study-tracker-mongo:/

# Restore
docker-compose exec mongo mongorestore -u admin -p mongodb_password_change_me /dump
```

## Network Configuration

### View Networks
```bash
docker network ls | grep study-tracker
docker network inspect study-tracker-network
```

### Service Communication
Services communicate via service names:
- `backend:5000` from frontend
- `mongo:27017` from backend
- `redis:6379` available to all services

### Port Mapping
```yaml
# ports: [host_port]:[container_port]
ports:
  - "3000:80"    # Frontend accessible at localhost:3000
  - "5000:5000"  # Backend accessible at localhost:5000
  - "27017:27017" # MongoDB accessible at localhost:27017
```

## Health Checks

### MongoDB Health
```bash
docker-compose exec mongo mongosh -u admin -p mongodb_password_change_me --eval "db.adminCommand('ping')"
```

### Backend Health
```bash
curl http://localhost:5000/health
```

### Frontend Health
```bash
curl http://localhost:3000
```

## Resource Management

### Limit Resource Usage
Update docker-compose.yml:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### View Resource Usage
```bash
docker stats study-tracker-backend
docker stats study-tracker-frontend
docker stats study-tracker-mongo
```

## Environment Variables

### Backend Environment
```bash
# Edit backend/.env.docker
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret
```

### Frontend Environment
```bash
# Edit frontend/.env.docker
REACT_APP_API_URL=http://localhost:5000/api
```

### Override at Runtime
```bash
docker-compose run -e NODE_ENV=development backend npm start
```

## Production Deployment

### Production docker-compose
```yaml
services:
  backend:
    restart: always
    deploy:
      replicas: 2  # Multiple instances
    environment:
      NODE_ENV: production
      
  frontend:
    restart: always
```

### Security Best Practices
1. Use named volumes instead of bind mounts
2. Don't expose MongoDB/Redis ports
3. Use environment variables for secrets
4. Enable health checks
5. Set restart policies
6. Use read-only filesystems where possible
7. Run containers as non-root users

## Cleanup

### Remove Stopped Containers
```bash
docker container prune
```

### Remove Unused Images
```bash
docker image prune
```

### Remove All Unused Resources
```bash
docker system prune -a
```

### Complete Cleanup
```bash
docker-compose down -v
docker system prune -a
```

## Docker Management Tool

For easier management, use the provided script:

### Linux/macOS
```bash
chmod +x docker-manager.sh
./docker-manager.sh
```

Menu options:
1. Start all services
2. Stop all services
3. Restart all services
4. View logs
5. Check service status
6. View service details
7. Clean up

## Troubleshooting

### Container exits immediately
```bash
# Check logs
docker-compose logs backend

# Run in foreground to see errors
docker-compose up backend
```

### Containers not communicating
```bash
# Check network
docker network inspect study-tracker-network

# Test DNS
docker-compose exec backend ping mongo
```

### Out of disk space
```bash
# Check usage
docker system df

# Cleanup
docker system prune -a
```

### Port already in use
```bash
# Find process using port
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process or change port in docker-compose.yml
```

## Docker Tips

1. **Always use specific image tags** (not `latest`)
2. **Use `.dockerignore`** to exclude unnecessary files
3. **Multi-stage builds** for smaller images
4. **Health checks** for better reliability
5. **Volumes** for persistent data
6. **Networks** for service isolation
7. **Resource limits** to prevent runaway processes
8. **Logs** for debugging and monitoring

---

**For more information:** See README.md and QUICK_START.md
