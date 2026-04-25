# Architecture Guide

Deep dive into the Study Tracker Application architecture, design patterns, and implementation details.

## System Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────┐
│        PRESENTATION LAYER (Frontend)                    │
│  React 18 | Context API | React Router | Axios          │
│  Components | Pages | Styles | Public Assets            │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
                     │
┌────────────────────▼────────────────────────────────────┐
│       APPLICATION LAYER (Backend)                        │
│  Express.js | RESTful API | Authentication | Validation │
│  Controllers | Services | Routes | Middleware           │
└────────────────────┬────────────────────────────────────┘
                     │ MongoDB Protocol
                     │
┌────────────────────▼────────────────────────────────────┐
│          DATA LAYER (Database)                           │
│  MongoDB | Mongoose | Collections | Indexes             │
│  User | WeeklyPlan | Task Collections                   │
└─────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Structure

```
Frontend/
├── Context (State Management)
│   ├── AuthContext - User authentication state
│   └── StudyContext - Study data state
├── Pages (Route Components)
│   ├── LoginPage - User login
│   ├── RegisterPage - User registration
│   ├── DashboardPage - Overview and stats
│   ├── WeeklyPlannerPage - Plan management
│   └── ProgressReportPage - Analytics
├── Components (Reusable)
│   ├── TaskTrackerPanel - Task management
│   └── ProgressChart - Data visualization
├── Services
│   └── api.js - Axios instance with interceptors
└── Styles (CSS)
    ├── app.css - Global styles
    ├── auth.css - Authentication pages
    ├── dashboard.css - Dashboard
    ├── planner.css - Planner page
    ├── progress.css - Progress page
    ├── tasktracker.css - Task panel
    └── chart.css - Chart styles
```

### Backend Structure

```
Backend/
├── Models (Database Schemas)
│   ├── User - User schema
│   ├── WeeklyPlan - Plan schema
│   └── Task - Task schema
├── Controllers (Request Handlers)
│   ├── authController - Auth logic
│   ├── planController - Plan operations
│   ├── taskController - Task operations
│   └── progressController - Analytics
├── Services (Business Logic)
│   ├── authService - Auth operations
│   ├── planService - Plan operations
│   ├── taskService - Task operations
│   └── progressService - Analytics
├── Routes (API Endpoints)
│   ├── authRoutes - /api/auth/*
│   ├── planRoutes - /api/plans/*
│   ├── taskRoutes - /api/tasks/*
│   └── progressRoutes - /api/progress/*
├── Middleware
│   ├── authenticate - JWT verification
│   └── errorHandler - Error handling
├── Validators
│   └── validators.js - Input validation
└── index.js - Express app setup
```

## Data Flow

### Authentication Flow

```
User Input (Email, Password)
       ↓
RegisterPage/LoginPage Component
       ↓
authService.register/login()
       ↓
API Request to /auth/register or /auth/login
       ↓
authController
       ↓
authService (Business Logic)
       ↓
User.create() or User.findOne()
       ↓
MongoDB
       ↓
Response with JWT Token
       ↓
Store in localStorage
       ↓
AuthContext updated
       ↓
User state synchronized
```

### Task Creation Flow

```
User Input (Subject, Deadline, Priority)
       ↓
TaskTrackerPanel Component
       ↓
createTask() from StudyContext
       ↓
API Request to /tasks/plan/:planId
       ↓
authenticate Middleware (JWT verification)
       ↓
taskController.createTask()
       ↓
taskService.createTask()
       ↓
Task Model validation
       ↓
MongoDB Insert
       ↓
Response to Frontend
       ↓
StudyContext updated
       ↓
Component re-renders
```

## Design Patterns

### 1. Context API Pattern (Frontend)

State management without Redux:

```javascript
// AuthContext provides global auth state
const { user, login, logout } = useContext(AuthContext);

// StudyContext provides study-related state
const { plans, tasks, createTask } = useContext(StudyContext);
```

**Benefits:**
- Reduces prop drilling
- Clean separation of concerns
- Easy to test
- No external dependencies

### 2. Service Layer Pattern (Backend)

Business logic separated from controllers:

```javascript
// Controller just handles HTTP
authController.login(req, res) {
  const result = authService.login(email, password);
}

// Service contains business logic
authService.login(email, password) {
  // Authentication logic here
}
```

**Benefits:**
- Reusable business logic
- Easier testing
- Clear separation
- Single responsibility

### 3. Middleware Pattern (Backend)

Cross-cutting concerns handled consistently:

```javascript
// Authentication middleware
app.use(authenticate);

// Error handling middleware
app.use(errorHandler);

// Built-in middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
```

**Benefits:**
- Centralized concerns
- Consistent error handling
- Security enforcement
- Logging and monitoring

### 4. Axios Interceptor Pattern (Frontend)

Global request/response handling:

```javascript
// Request interceptor: Add token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: Handle 401 globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
);
```

**Benefits:**
- Centralized auth handling
- Consistent error responses
- Reduced code duplication
- Global error management

## State Management

### Frontend State (AuthContext)

```javascript
{
  user: { id, email } | null,
  loading: boolean,
  error: string | null,
  actions: {
    register(email, password),
    login(email, password),
    logout(),
    checkAuth()
  }
}
```

### Frontend State (StudyContext)

```javascript
{
  plans: [WeeklyPlan],
  tasks: [Task],
  progressStats: ProgressStats | null,
  weeklyProgress: WeeklyProgress | null,
  subjectAnalytics: [SubjectAnalytics],
  trendData: [TrendData],
  loading: boolean,
  error: string | null,
  actions: {
    createPlan, getPlan, updatePlan, deletePlan,
    createTask, getTask, updateTask, deleteTask,
    getProgressStats, getWeeklyProgress, getTrendData
  }
}
```

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  email: String (indexed, unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email`: Unique index for fast lookups

### WeeklyPlan Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (indexed, ref User),
  weekStartDate: Date,
  weekEndDate: Date,
  subjects: [String],
  goals: [String],
  tasks: [ObjectId] (ref Task),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId`: Index for user lookups
- `weekStartDate`: Composite index with userId for range queries

### Task Collection

```javascript
{
  _id: ObjectId,
  planId: ObjectId (indexed, ref WeeklyPlan),
  userId: ObjectId (indexed, ref User),
  subject: String,
  description: String,
  deadline: Date,
  priority: String (enum: low/medium/high),
  status: String (enum: pending/in-progress/completed),
  completedAt: Date | null,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId`: Index for user lookups
- `status`: Index for status filtering
- Composite: `userId + status` for common queries
- Composite: `userId + deadline` for sorting

## API Design

### RESTful Principles

```
Resource    | GET         | POST        | PUT            | DELETE
----------------------------------------------------------------------
/plans      | List all    | Create new  | -              | -
/plans/:id  | Get one     | -           | Update         | Delete
/tasks      | List all    | -           | -              | -
/tasks/:id  | Get one     | -           | Update         | Delete
/progress/* | Get data    | -           | -              | -
```

### Request/Response Pattern

**Request:**
```javascript
{
  method: 'POST',
  path: '/api/plans',
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  body: { ... }
}
```

**Response (Success):**
```javascript
{
  status: 200-201,
  body: {
    data: { ... },  // or array
    message: 'Success'
  }
}
```

**Response (Error):**
```javascript
{
  status: 400-500,
  body: {
    message: 'Error description',
    errors: ['Field 1 error', 'Field 2 error']
  }
}
```

## Security Architecture

### Authentication Flow

```
1. User registers/logs in
   ↓
2. Password hashed with bcryptjs
   ↓
3. JWT token generated (7-day expiry)
   ↓
4. Token stored in localStorage
   ↓
5. Token sent in Authorization header
   ↓
6. authenticate middleware verifies
   ↓
7. User attached to request object
   ↓
8. Endpoints use req.user for authorization
```

### Authorization Pattern

```javascript
// Service layer checks ownership
async getPlan(planId, userId) {
  const plan = await WeeklyPlan.findById(planId);
  
  if (plan.userId.toString() !== userId) {
    throw new Error('Not authorized');
  }
  
  return plan;
}
```

### Input Validation

```javascript
// Express-validator middleware
body('email').isEmail(),
body('password').isLength({ min: 6 }),
body('priority').isIn(['low', 'medium', 'high'])
```

## Performance Optimization

### Database Optimization

1. **Indexes:**
   - userId on WeeklyPlan, Task
   - status on Task for filtering
   - Composite indexes for common queries

2. **Lean Queries:**
   ```javascript
   Task.find().lean()  // Don't hydrate full objects
   ```

3. **Pagination Ready:**
   ```javascript
   Task.find().skip(page * limit).limit(limit)
   ```

### Frontend Optimization

1. **Code Splitting:**
   ```javascript
   React Router lazy loading for pages
   ```

2. **Memoization:**
   ```javascript
   useCallback for handlers
   useMemo for computed values
   ```

3. **Image Optimization:**
   - Lazy loading
   - Responsive images
   - CDN ready

### Backend Optimization

1. **Connection Pooling:**
   - MongoDB connection pool
   - Redis for caching

2. **Compression:**
   - gzip middleware
   - Minified responses

3. **Caching:**
   - Redis ready
   - HTTP caching headers

## Scalability Considerations

### Horizontal Scaling

```yaml
# Multiple backend instances
backend:
  deploy:
    replicas: 3

# Load balancer (not included)
loadbalancer:
  - backend:1
  - backend:2
  - backend:3
```

### Database Scaling

- Read replicas for MongoDB
- Sharding for large datasets
- Connection pooling

### Caching Layer

- Redis for sessions
- Redis for frequently accessed data
- Cache invalidation strategy

## Error Handling

### Frontend Error Handling

```javascript
try {
  await createTask(planId, data);
} catch (error) {
  const message = error.response?.data?.message;
  setError(message);
}
```

### Backend Error Handling

```javascript
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Catch all errors
app.use(errorHandler);
```

## Testing Strategy

### Backend Testing

```bash
# Unit tests for services
npm test services

# Integration tests for API
npm test api

# End-to-end tests
npm test e2e
```

### Frontend Testing

```bash
# Component testing
npm test components

# Integration testing
npm test integration

# Snapshot testing
npm test snapshots
```

## Deployment Architecture

### Docker Multi-Stage Build

```dockerfile
# Build stage
FROM node:16 AS builder
RUN npm ci
RUN npm build

# Runtime stage
FROM node:16-alpine
COPY --from=builder /app/dist ./dist
CMD ["npm", "start"]
```

Benefits:
- Smaller final image
- No build tools in production
- Faster startup time
- Better security

### Container Orchestration

- Docker Compose for development
- Kubernetes for production
- Service mesh for advanced scenarios

---

**Last Updated:** 2026-04-25
**Version:** 1.0.0

For API details, see [API_REFERENCE.md](API_REFERENCE.md)
For deployment, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
