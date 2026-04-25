# Study Tracker Application

A comprehensive three-tier study planning and progress tracking application built with React, Node.js, Express, and MongoDB.

## Features

✅ **User Authentication** - Secure JWT-based authentication with 7-day token expiry
✅ **Weekly Planning** - Create and manage weekly study plans with subjects and goals
✅ **Task Management** - Add, edit, delete, and track tasks with priorities and deadlines
✅ **Progress Tracking** - View real-time progress with completion rates and analytics
✅ **Subject Analytics** - Analyze performance by subject and priority level
✅ **Trend Analysis** - Visualize completion trends over time with interactive charts
✅ **Responsive Design** - Mobile-friendly interface that works on all devices
✅ **Docker Ready** - Complete containerization with docker-compose
✅ **Production Ready** - Security headers, error handling, input validation

## Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────┐
│           Presentation Layer (Frontend)                 │
│  React 18 + Context API + Router + Axios + Chart.js     │
│  Nginx Reverse Proxy                                    │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│          Application Layer (Backend)                     │
│  Node.js + Express.js + JWT Auth + Validators           │
│  RESTful APIs                                           │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│            Data Layer (Database)                         │
│  MongoDB + Mongoose                                     │
│  Redis (Optional caching)                              │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **CSS3** - Responsive styling
- **Nginx** - Reverse proxy

### Backend
- **Node.js 16+** - Runtime
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express-validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin requests

### Database & Caching
- **MongoDB** - NoSQL database
- **Redis** - Optional caching layer

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **Alpine** - Lightweight base images

## Quick Start

### Using Docker (Recommended)

#### Windows
```bash
# Navigate to project directory
cd study-tracker-app

# Run the startup script
start.bat
```

#### Linux/macOS
```bash
# Navigate to project directory
cd study-tracker-app

# Run the startup script
./start.sh

# Or use the docker-compose directly
docker-compose up -d
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

### Default Setup
- MongoDB: admin / mongodb_password_change_me
- Create your own account on the application

## Project Structure

```
study-tracker-app/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskTrackerPanel.js
│   │   │   └── ProgressChart.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── StudyContext.js
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── WeeklyPlannerPage.js
│   │   │   └── ProgressReportPage.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── app.css
│   │   │   ├── auth.css
│   │   │   ├── dashboard.css
│   │   │   └── ... (other CSS files)
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env.docker
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── WeeklyPlan.js
│   │   │   └── Task.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── planController.js
│   │   │   ├── taskController.js
│   │   │   └── progressController.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── planService.js
│   │   │   ├── taskService.js
│   │   │   └── progressService.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── planRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── progressRoutes.js
│   │   ├── middleware/
│   │   │   ├── authenticate.js
│   │   │   └── errorHandler.js
│   │   ├── validators/
│   │   │   └── validators.js
│   │   └── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.docker
├── docker-compose.yml
├── start.bat
├── start.sh
├── docker-manager.sh
├── README.md
├── QUICK_START.md
├── DOCKER_SETUP.md
└── API_REFERENCE.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Weekly Plans
- `POST /api/plans` - Create new plan
- `GET /api/plans` - Get all user plans
- `GET /api/plans/:planId` - Get specific plan
- `PUT /api/plans/:planId` - Update plan
- `DELETE /api/plans/:planId` - Delete plan

### Tasks
- `POST /api/tasks/plan/:planId` - Create task
- `GET /api/tasks` - Get all user tasks
- `GET /api/tasks/plan/:planId` - Get plan tasks
- `GET /api/tasks/:taskId` - Get specific task
- `PUT /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task

### Progress
- `GET /api/progress/stats` - Get overall statistics
- `GET /api/progress/weekly` - Get weekly progress
- `GET /api/progress/subjects` - Get subject analytics
- `GET /api/progress/trends` - Get trend data

## Database Schema

### User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### WeeklyPlan
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref),
  weekStartDate: Date,
  weekEndDate: Date,
  subjects: [String],
  goals: [String],
  tasks: [ObjectId] (ref),
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```javascript
{
  _id: ObjectId,
  planId: ObjectId (ref),
  userId: ObjectId (ref),
  subject: String,
  description: String,
  deadline: Date,
  priority: String (low/medium/high),
  status: String (pending/in-progress/completed),
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- ✅ JWT token-based authentication (7-day expiry)
- ✅ Password hashing with bcryptjs
- ✅ CORS protection
- ✅ Security headers with Helmet
- ✅ Input validation with express-validator
- ✅ Error handling middleware
- ✅ HTTP-only cookies support
- ✅ Rate limiting ready

## Environment Variables

### Backend (.env.docker)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://admin:mongodb_password_change_me@mongo:27017/study-tracker?authSource=admin
JWT_SECRET=your_jwt_secret_change_in_production_12345
```

### Frontend (.env.docker)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Deployment

### Production Considerations

1. **Change default credentials** - Update MongoDB password and JWT secret
2. **Use environment variables** - Never hardcode secrets
3. **Enable HTTPS** - Use SSL/TLS certificates
4. **Set up backup** - Configure MongoDB backups
5. **Monitor logs** - Set up log aggregation
6. **Scale containers** - Use container orchestration (Kubernetes)
7. **Use production database** - Connect to managed MongoDB service
8. **Enable caching** - Configure Redis for session/data caching
9. **Set up CI/CD** - Automate testing and deployment
10. **Security scanning** - Use SAST tools

## Troubleshooting

### Containers won't start
```bash
# Check Docker daemon
docker ps

# View logs
docker-compose logs

# Rebuild images
docker-compose build --no-cache
docker-compose up -d
```

### Port already in use
```bash
# Change ports in docker-compose.yml or stop conflicting service
netstat -ano | findstr :3000  # Windows
lsof -i :3000  # Mac/Linux
```

### Database connection errors
```bash
# Verify MongoDB is running
docker-compose ps mongo

# Check logs
docker-compose logs mongo

# Test connection
docker-compose exec mongo mongosh -u admin -p mongodb_password_change_me
```

## Performance Optimization

- Multi-stage Docker builds for smaller images
- Database indexing for fast queries
- Connection pooling
- Gzip compression
- Redis caching (optional)
- CDN ready frontend
- Lazy loading for routes

## Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd ../frontend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for personal or commercial use.

## Support

For issues, questions, or suggestions:
1. Check existing documentation
2. Review API_REFERENCE.md
3. Check container logs
4. Consult DOCKER_SETUP.md

## Changelog

### Version 1.0.0
- Initial release
- Complete three-tier architecture
- User authentication with JWT
- Weekly planning and task management
- Progress tracking and analytics
- Docker containerization
- Responsive UI
- Production-ready code

---

**Last Updated**: 2026-04-25
**Version**: 1.0.0
