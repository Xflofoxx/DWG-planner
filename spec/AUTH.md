# AUTH: Authentication

> **Requirement**: AUTH-001  
> **Component**: Server  
> **Status**: Implemented

## Description

User authentication system with JWT tokens and optional registration.

## Endpoints

### POST /api/auth/login

Login with email and password.

```
POST /api/auth/login
Content-Type: application/json
```

#### Request Payload

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Response

- 200 OK: Login successful

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- 400 Bad Request: Missing email or password
- 401 Unauthorized: Invalid credentials

---

### POST /api/auth/register

Register a new user (disabled by default).

```
POST /api/auth/register
Content-Type: application/json
```

#### Request Payload

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Response

- 201 Created: User registered
- 403 Forbidden: Registration disabled
- 400 Bad Request: Missing email or password
- 409 Conflict: User already exists

---

### GET /api/auth/profile

Get current user profile (requires authentication).

```
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Response

- 200 OK: User profile

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "user",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

- 401 Unauthorized: Invalid or missing token
- 404 Not Found: User not found

## Security

- Passwords are hashed with bcrypt (12 rounds)
- JWT tokens expire in 7 days
- Registration can be disabled via `config.yaml`

## Implementation

| File                                | Description       |
| ----------------------------------- | ----------------- |
| `src/controllers/AuthController.js` | Auth logic        |
| `src/routes/auth.js`                | Route definitions |
| `src/middleware/auth.js`            | JWT verification  |
| `src/models/User.js`                | User model        |

## User Roles

| Role  | Description                    |
| ----- | ------------------------------ |
| user  | Standard user                  |
| admin | Administrator with full access |
