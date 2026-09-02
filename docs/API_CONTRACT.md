# HealthBridge — API Contract & Conventions

## Base URL

- Development API: `http://localhost:3001/api`
- Production API: `https://api.healthbridge.org/api`

## HTTP Conventions

| Method   | Usage                                |
|----------|--------------------------------------|
| `GET`    | Retrieve resources / lists          |
| `POST`   | Create new resource                  |
| `PUT`    | Replace resource                     |
| `PATCH`  | Partial update of resource           |
| `DELETE` | Remove resource                      |

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```http
Authorization: Bearer <clerk_jwt_token>
```

## Standard Response Format

### Success Response (`200 OK`, `201 Created`)

```json
{
  "success": true,
  "data": {
    "id": "60d5ec49f1b2c812c4890a12",
    "name": "General Hospital"
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Response (`4xx`, `5xx`)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload"
  }
}
```

## Error Codes

| Code               | HTTP Status | Description                           |
|--------------------|-------------|---------------------------------------|
| `BAD_REQUEST`      | 400         | Invalid parameters or payload         |
| `UNAUTHORIZED`     | 401         | Missing or invalid authentication token |
| `FORBIDDEN`        | 403         | Insufficient role permissions         |
| `NOT_FOUND`        | 404         | Requested entity does not exist       |
| `CONFLICT`         | 409         | Resource conflict (e.g. duplicate key)|
| `VALIDATION_ERROR` | 422         | Request body validation failed        |
| `INTERNAL_ERROR`   | 500         | Internal server error                 |

## Endpoints Summary (Foundation)

- `GET /api/health` — Health check endpoint
- `GET /api/auth/me` — Verify token & return current user role
