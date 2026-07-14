# ATIN API Documentation

Base URL: `http://localhost:5000/api`

All requests should include `Content-Type: application/json`. Protected routes require `Authorization: Bearer <token>`.

---

## Authentication

### Register

`POST /auth/register`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongP4ss1!",
  "name": "Jane Doe"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "665f1a2b3c4d5e6f7a8b9c0d",
    "email": "user@example.com",
    "name": "Jane Doe",
    "role": "user"
  }
}
```

**Errors:** 400 (validation), 409 (duplicate email)

---

### Login

`POST /auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongP4ss1!"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "665f1a2b3c4d5e6f7a8b9c0d",
    "email": "user@example.com",
    "name": "Jane Doe",
    "role": "user"
  }
}
```

**Errors:** 401 (invalid credentials)

---

### Refresh Token

`POST /auth/refresh`

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:** 401 (invalid/expired refresh token)

---

### Logout

`POST /auth/logout`

🔒 **Auth required**

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## News

### List Articles

`GET /news`

🔒 **Auth required**

**Query Parameters:**
- `page` (number, default 1)
- `limit` (number, default 20)
- `sentiment` (string: `positive`, `negative`, `neutral`)
- `source` (string)
- `technologyId` (string)
- `search` (string)

**Response (200):**
```json
{
  "news": [
    {
      "id": "665f1a2b3c4d5e6f7a8b9c0d",
      "title": "GPT-5 Announced",
      "url": "https://example.com/article",
      "source": "TechCrunch",
      "description": "OpenAI announces...",
      "author": "Jane Reporter",
      "sentiment": "positive",
      "sentimentScore": 0.89,
      "technologyId": "665f1a2b3c4d5e6f7a8b9c0e",
      "publishedAt": "2024-06-15T10:00:00.000Z",
      "createdAt": "2024-06-15T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

---

### Get Article

`GET /news/:id`

🔒 **Auth required**

**Response (200):** Single news article object.

**Errors:** 404 (not found)

---

### Delete Article

`DELETE /news/:id`

🔒 **Auth required** (admin)

**Response (200):**
```json
{
  "message": "Article deleted successfully"
}
```

**Errors:** 403 (not admin), 404 (not found)

---

## Trends / Technologies

### List Technologies

`GET /trends`

🔒 **Auth required**

**Query Parameters:**
- `category` (string)
- `maturity` (string: `early`, `emerging`, `growth`, `mature`)
- `trending` (boolean)
- `sort` (string: `score`, `name`, `-score`, `-name`)
- `limit` (number, default 50)

**Response (200):**
```json
{
  "technologies": [
    {
      "id": "665f1a2b3c4d5e6f7a8b9c0f",
      "name": "GPT-5",
      "category": "LLM",
      "description": "Next-gen large language model",
      "maturity": "emerging",
      "score": 95,
      "trending": true,
      "history": [
        { "date": "2024-06-01", "score": 88 },
        { "date": "2024-06-02", "score": 90 }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Technology

`GET /trends/:id`

🔒 **Auth required**

**Response (200):** Single technology object with full history.

**Errors:** 404 (not found)

---

### Add Technology

`POST /trends`

🔒 **Auth required**

**Body:**
```json
{
  "name": "NewTech",
  "category": "Frameworks",
  "description": "A new framework",
  "maturity": "emerging"
}
```

**Response (201):** Created technology object.

---

### Update Technology

`PATCH /trends/:id`

🔒 **Auth required**

**Body:**
```json
{
  "score": 92,
  "description": "Updated description"
}
```

**Response (200):** Updated technology object.

---

### Delete Technology

`DELETE /trends/:id`

🔒 **Auth required** (admin)

**Response (200):**
```json
{
  "message": "Technology deleted successfully"
}
```

**Errors:** 403 (not admin), 404 (not found)

---

## Sentiment

### Get Sentiment Analysis

`GET /sentiment/analysis`

🔒 **Auth required**

**Query Parameters:**
- `technologyId` (string)
- `dateFrom` (ISO date string)
- `dateTo` (ISO date string)

**Response (200):**
```json
{
  "analysis": {
    "averageScore": 0.72,
    "distribution": {
      "positive": 65,
      "neutral": 20,
      "negative": 15
    },
    "trend": "improving"
  }
}
```

---

### Get Sentiment Over Time

`GET /sentiment/timeline`

🔒 **Auth required**

**Query Parameters:**
- `technologyId` (string)
- `period` (string: `day`, `week`, `month`)

**Response (200):**
```json
{
  "timeline": [
    {
      "date": "2024-06-01",
      "positive": 12,
      "neutral": 5,
      "negative": 3,
      "averageScore": 0.65
    }
  ]
}
```

---

## Analytics

### Get Dashboard Summary

`GET /analytics/dashboard`

🔒 **Auth required**

**Response (200):**
```json
{
  "totalTechnologies": 45,
  "totalArticles": 1250,
  "trendingCount": 12,
  "sentimentOverview": {
    "positive": 62,
    "neutral": 25,
    "negative": 13
  },
  "recentActivity": [...]
}
```

---

### Get User Analytics

`GET /analytics/user`

🔒 **Auth required**

**Response (200):**
```json
{
  "articlesRead": 34,
  "trendsTracked": 8,
  "loginCount": 15,
  "lastActive": "2024-06-15T10:00:00.000Z"
}
```

---

## Notifications

### List Notifications

`GET /notifications`

🔒 **Auth required**

**Response (200):**
```json
{
  "notifications": [
    {
      "id": "665f1a2b3c4d5e6f7a8b9c10",
      "type": "trend_alert",
      "title": "Trend Alert: GPT-5",
      "message": "GPT-5 score increased by 15%",
      "read": false,
      "createdAt": "2024-06-15T10:00:00.000Z"
    }
  ]
}
```

---

### Mark as Read

`PATCH /notifications/:id/read`

🔒 **Auth required**

**Response (200):**
```json
{
  "message": "Notification marked as read"
}
```

---

### Mark All as Read

`PATCH /notifications/read-all`

🔒 **Auth required**

**Response (200):**
```json
{
  "message": "All notifications marked as read",
  "count": 5
}
```

---

### Delete Notification

`DELETE /notifications/:id`

🔒 **Auth required**

**Response (200):**
```json
{
  "message": "Notification deleted"
}
```

---

## Users

### Get Profile

`GET /users/profile`

🔒 **Auth required**

**Response (200):**
```json
{
  "user": {
    "id": "665f1a2b3c4d5e6f7a8b9c0d",
    "email": "user@example.com",
    "name": "Jane Doe",
    "role": "user",
    "preferences": {
      "theme": "dark",
      "emailNotifications": true
    }
  }
}
```

---

### Update Profile

`PATCH /users/profile`

🔒 **Auth required**

**Body:**
```json
{
  "name": "Jane Smith"
}
```

**Response (200):** Updated user object.

---

### Get Preferences

`GET /users/preferences`

🔒 **Auth required**

**Response (200):**
```json
{
  "preferences": {
    "theme": "dark",
    "emailNotifications": true,
    "pushNotifications": false,
    "digestFrequency": "daily"
  }
}
```

---

### Update Preferences

`PATCH /users/preferences`

🔒 **Auth required**

**Body:**
```json
{
  "theme": "light",
  "emailNotifications": false
}
```

**Response (200):** Updated preferences object.

---

### Deactivate Account

`DELETE /users/account`

🔒 **Auth required**

**Response (200):**
```json
{
  "message": "Account deactivated successfully"
}
```

---

### Get Activity

`GET /users/activity`

🔒 **Auth required**

**Response (200):**
```json
{
  "activities": [
    {
      "type": "login",
      "description": "Logged in from Chrome on Windows",
      "timestamp": "2024-06-15T10:00:00.000Z"
    }
  ]
}
```

---

## Health Check

`GET /health`

**Response (200):**
```json
{
  "status": "healthy",
  "uptime": 12345,
  "timestamp": "2024-06-15T10:00:00.000Z"
}
```
