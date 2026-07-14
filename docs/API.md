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

