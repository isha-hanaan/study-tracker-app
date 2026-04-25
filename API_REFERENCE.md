# API Reference Guide

Complete API documentation for the Study Tracker Application.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

Token is obtained from login/register endpoints and is valid for 7 days.

## Response Format

### Success Response
```json
{
  "data": {},
  "message": "Success"
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": ["Field error 1", "Field error 2"]
}
```

## Authentication Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

**Validation Rules:**
- Email: Valid email format, unique
- Password: Minimum 6 characters

---

### Login User
Authenticate user and get token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

---

### Get Current User
Get authenticated user's information.

**Endpoint:** `GET /auth/me`

**Authentication:** Required

**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

---

## Weekly Plan Endpoints

### Create Weekly Plan
Create a new weekly study plan.

**Endpoint:** `POST /plans`

**Authentication:** Required

**Request Body:**
```json
{
  "weekStartDate": "2024-01-15T00:00:00Z",
  "subjects": ["Math", "Physics", "English"],
  "goals": ["Complete Chapter 5", "Practice exercises"]
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012",
  "weekStartDate": "2024-01-15T00:00:00Z",
  "weekEndDate": "2024-01-21T23:59:59Z",
  "subjects": ["Math", "Physics", "English"],
  "goals": ["Complete Chapter 5", "Practice exercises"],
  "tasks": [],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**Validation Rules:**
- weekStartDate: Valid ISO8601 date
- subjects: Array of strings
- goals: Array of strings

---

### Get All Plans
Fetch all weekly plans for authenticated user.

**Endpoint:** `GET /plans`

**Authentication:** Required

**Query Parameters:** None

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "weekStartDate": "2024-01-15T00:00:00Z",
    "weekEndDate": "2024-01-21T23:59:59Z",
    "subjects": ["Math"],
    "goals": ["Chapter 5"],
    "tasks": ["607f1f77bcf86cd799439013"],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
]
```

---

### Get Single Plan
Fetch a specific weekly plan.

**Endpoint:** `GET /plans/:planId`

**Authentication:** Required

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012",
  "weekStartDate": "2024-01-15T00:00:00Z",
  "weekEndDate": "2024-01-21T23:59:59Z",
  "subjects": ["Math", "Physics"],
  "goals": ["Chapter 5"],
  "tasks": [
    {
      "_id": "607f1f77bcf86cd799439013",
      "subject": "Math",
      "description": "Solve equations",
      "deadline": "2024-01-17T23:59:59Z",
      "priority": "high",
      "status": "in-progress"
    }
  ],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

### Update Plan
Update an existing weekly plan.

**Endpoint:** `PUT /plans/:planId`

**Authentication:** Required

**Request Body:**
```json
{
  "subjects": ["Math", "Physics", "Chemistry"],
  "goals": ["Chapter 6", "Practice problems"]
}
```

**Response (200):** Updated plan object

---

### Delete Plan
Delete a weekly plan and all its tasks.

**Endpoint:** `DELETE /plans/:planId`

**Authentication:** Required

**Response (200):**
```json
{
  "message": "Plan deleted successfully"
}
```

---

## Task Endpoints

### Create Task
Add a task to a weekly plan.

**Endpoint:** `POST /tasks/plan/:planId`

**Authentication:** Required

**Request Body:**
```json
{
  "subject": "Math",
  "description": "Solve quadratic equations",
  "deadline": "2024-01-17T23:59:59Z",
  "priority": "high"
}
```

**Response (201):**
```json
{
  "_id": "607f1f77bcf86cd799439013",
  "planId": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012",
  "subject": "Math",
  "description": "Solve quadratic equations",
  "deadline": "2024-01-17T23:59:59Z",
  "priority": "high",
  "status": "pending",
  "completedAt": null,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**Validation Rules:**
- subject: Required, non-empty string
- description: Optional string
- deadline: Required ISO8601 date
- priority: Required, one of: low, medium, high

---

### Get All Tasks
Fetch all tasks for authenticated user.

**Endpoint:** `GET /tasks`

**Authentication:** Required

**Query Parameters:**
- `status` (optional): Filter by status (pending, in-progress, completed)

**Example:** `GET /tasks?status=completed`

**Response (200):** Array of task objects

---

### Get Plan Tasks
Fetch all tasks for a specific plan.

**Endpoint:** `GET /tasks/plan/:planId`

**Authentication:** Required

**Response (200):** Array of task objects sorted by deadline

---

### Get Single Task
Fetch a specific task.

**Endpoint:** `GET /tasks/:taskId`

**Authentication:** Required

**Response (200):** Task object

---

### Update Task
Update a task's details.

**Endpoint:** `PUT /tasks/:taskId`

**Authentication:** Required

**Request Body:**
```json
{
  "subject": "Math",
  "description": "Updated description",
  "deadline": "2024-01-18T23:59:59Z",
  "priority": "medium",
  "status": "in-progress"
}
```

**Response (200):** Updated task object

**Notes:**
- When status is changed to "completed", `completedAt` is automatically set
- When status is changed from "completed", `completedAt` is cleared

---

### Delete Task
Delete a task.

**Endpoint:** `DELETE /tasks/:taskId`

**Authentication:** Required

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

---

## Progress Endpoints

### Get Progress Statistics
Get overall completion statistics for authenticated user.

**Endpoint:** `GET /progress/stats`

**Authentication:** Required

**Response (200):**
```json
{
  "total": 15,
  "completed": 8,
  "inProgress": 3,
  "pending": 4,
  "completionRate": 53,
  "byPriority": {
    "high": {
      "total": 5,
      "completed": 3
    },
    "medium": {
      "total": 6,
      "completed": 3
    },
    "low": {
      "total": 4,
      "completed": 2
    }
  },
  "bySubject": {
    "Math": {
      "total": 5,
      "completed": 3
    },
    "Physics": {
      "total": 7,
      "completed": 4
    },
    "English": {
      "total": 3,
      "completed": 1
    }
  }
}
```

---

### Get Weekly Progress
Get progress for a specific week.

**Endpoint:** `GET /progress/weekly`

**Authentication:** Required

**Query Parameters:**
- `weekStartDate` (required): ISO8601 date

**Example:** `GET /progress/weekly?weekStartDate=2024-01-15`

**Response (200):**
```json
{
  "weekStartDate": "2024-01-15T00:00:00Z",
  "weekEndDate": "2024-01-21T23:59:59Z",
  "totalTasks": 10,
  "dailyStats": {
    "2024-01-15": {
      "total": 2,
      "completed": 1,
      "pending": 1,
      "inProgress": 0
    },
    "2024-01-16": {
      "total": 3,
      "completed": 2,
      "pending": 0,
      "inProgress": 1
    }
  },
  "tasks": [...]
}
```

---

### Get Subject Analytics
Analyze performance by subject.

**Endpoint:** `GET /progress/subjects`

**Authentication:** Required

**Response (200):**
```json
[
  {
    "name": "Math",
    "total": 5,
    "completed": 3,
    "pending": 1,
    "inProgress": 1,
    "byPriority": {
      "high": 2,
      "medium": 2,
      "low": 1
    }
  },
  {
    "name": "Physics",
    "total": 7,
    "completed": 4,
    "pending": 2,
    "inProgress": 1,
    "byPriority": {
      "high": 3,
      "medium": 2,
      "low": 2
    }
  }
]
```

---

### Get Trend Data
Get task completion trends over time.

**Endpoint:** `GET /progress/trends`

**Authentication:** Required

**Query Parameters:**
- `daysBack` (optional, default: 30): Number of days to analyze

**Example:** `GET /progress/trends?daysBack=30`

**Response (200):**
```json
[
  {
    "date": "2024-01-15",
    "completed": 2
  },
  {
    "date": "2024-01-16",
    "completed": 3
  },
  {
    "date": "2024-01-17",
    "completed": 1
  }
]
```

---

## Error Codes

### 400 - Bad Request
Invalid input or validation error
```json
{
  "message": "Validation error",
  "errors": ["Email must be valid", "Password must be at least 6 characters"]
}
```

### 401 - Unauthorized
Missing or invalid token
```json
{
  "message": "Invalid token"
}
```

### 403 - Forbidden
User not authorized to access resource
```json
{
  "message": "Not authorized"
}
```

### 404 - Not Found
Resource not found
```json
{
  "message": "Plan not found"
}
```

### 500 - Internal Server Error
Server error
```json
{
  "message": "Internal server error"
}
```

---

## Rate Limiting

Currently not implemented but ready for implementation.

---

## Examples

### Complete Workflow

1. **Register**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

2. **Create Plan**
```bash
curl -X POST http://localhost:5000/api/plans \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "weekStartDate": "2024-01-15",
    "subjects": ["Math", "Physics"],
    "goals": ["Chapter 5"]
  }'
```

3. **Add Task**
```bash
curl -X POST http://localhost:5000/api/tasks/plan/<planId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Math",
    "description": "Exercises",
    "deadline": "2024-01-17T23:59:59Z",
    "priority": "high"
  }'
```

4. **Get Progress**
```bash
curl -X GET http://localhost:5000/api/progress/stats \
  -H "Authorization: Bearer <token>"
```

---

**Last Updated:** 2026-04-25
**Version:** 1.0.0
