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

