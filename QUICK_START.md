# Quick Start Guide

Get the Study Tracker Application up and running in 5 minutes!

## Prerequisites

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)
- 4GB free disk space
- Ports 3000, 5000, 27017, 6379 available

## Step 1: Clone/Navigate to Project

```bash
cd study-tracker-app
```

## Step 2: Start the Application

### Windows
```bash
start.bat
```

### Linux/macOS
```bash
chmod +x start.sh
./start.sh
```

### Or use Docker Compose directly
```bash
docker-compose up -d
```

## Step 3: Wait for Services to Start

The first run will take 2-3 minutes while Docker builds images and starts services.

Check status:
```bash
docker-compose ps
```

All services should show "Up" status.

## Step 4: Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## Step 5: Create Your Account

1. Click "Register here" on the login page
2. Enter your email and password
3. Click Register
4. You'll be redirected to the dashboard

## First Steps

### 1. Dashboard
View your overall progress and statistics:
- Total tasks
- Completed tasks
- Tasks by priority
- Tasks by subject

### 2. Weekly Planner
Create your first weekly plan:
- Click "Planner" in navigation
- Enter week start date
- Add subjects (e.g., Math, Physics, English)
- Add goals (e.g., Complete Chapter 5)
- Click "Create Plan"

### 3. Add Tasks
Once you have a plan:
- Fill in task details (subject, description, deadline, priority)
- Click "Add Task"
- Track task status (Pending → In Progress → Completed)

### 4. View Progress
Track your progress over time:
- Click "Progress" in navigation
- View completion rate
- Analyze by subject
- See trends over time

## Common Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Clean Up Everything
```bash
docker-compose down -v
```

### Rebuild Images
```bash
docker-compose build --no-cache
docker-compose up -d
```

## Accessing MongoDB

Connect to MongoDB directly:

```bash
# Using mongosh
docker-compose exec mongo mongosh -u admin -p mongodb_password_change_me

# Query data
use study-tracker
db.users.find()
db.weeklyplans.find()
db.tasks.find()
```

## Troubleshooting

### Application won't load
1. Check if containers are running: `docker-compose ps`
2. Check logs: `docker-compose logs`
3. Verify ports aren't in use
4. Try rebuilding: `docker-compose build --no-cache`

### Forgot credentials
1. Re-register with a new email
2. Or reset MongoDB and start fresh: `docker-compose down -v`

### Port conflicts
1. Check which process is using the port
2. Either stop that process or change ports in `docker-compose.yml`

### Database errors
1. Verify MongoDB container is running
2. Check MongoDB logs: `docker-compose logs mongo`
3. Ensure proper permissions in MongoDB

## Performance Tips

- Use host machine resources: at least 4GB RAM available
- Keep Docker updated
- Use SSD for better performance
- Close unused applications to free resources

## Next Steps

1. Read [DOCKER_SETUP.md](DOCKER_SETUP.md) for advanced Docker configuration
2. Check [API_REFERENCE.md](API_REFERENCE.md) for API details
3. Review [ARCHITECTURE_GUIDE.md](ARCHITECTURE_GUIDE.md) for system design
4. See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for production deployment

## Support

If you encounter issues:
1. Check the README.md
2. Review troubleshooting section above
3. Check container logs
4. Verify all prerequisites are met

---

**Need Help?** Open an issue or check the documentation!
