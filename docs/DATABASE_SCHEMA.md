# HealthBridge — Database Schema & Data Conventions

## Databases

1. **MongoDB Atlas** — Primary source-of-truth application database.
2. **Supabase** — Supporting object storage (medical reports, scans, documents) and operational realtime events.

## Data Naming Conventions

- Collection names: `lowercase_plural` (e.g. `users`, `facilities`, `patients`, `appointments`)
- Field names: `camelCase` (e.g. `clerkId`, `requestedRole`, `approvedRole`, `createdAt`)
- Primary Keys: MongoDB ObjectId (`_id`), mapped to `id` string in API responses.
- Timestamps: ISO-8601 strings (`2026-09-02T18:00:00Z`). Every document has `createdAt` and `updatedAt`.

## Core Entities

### User (`users` collection)

Stores application-level profile, facility association, role request, and approval workflow audit information.

```json
{
  "_id": "ObjectId",
  "clerkId": "user_2...",
  "email": "doctor@healthbridge.org",
  "firstName": "Aarav",
  "lastName": "Sharma",
  "facilityId": "ObjectId(60d5ec49f1b2c812c4890a12)",
  "requestedRole": "doctor",
  "approvedRole": "doctor",
  "status": "active",
  "approvedBy": "user_2admin_id",
  "approvedAt": "2026-09-03T10:00:00.000Z",
  "rejectedBy": null,
  "rejectedAt": null,
  "rejectionReason": null,
  "createdAt": "2026-09-03T09:00:00.000Z",
  "updatedAt": "2026-09-03T10:00:00.000Z"
}
```

#### Status Enum:
- `pending`: User completed onboarding; request awaiting Hospital Admin approval.
- `active`: Hospital Admin approved request; `approvedRole` is populated.
- `rejected`: Hospital Admin rejected request.

### Facility (`facilities` collection)

Stores healthcare facilities (Primary Health Center, Community Health Center, District Hospital, Sub Center).

```json
{
  "_id": "ObjectId",
  "name": "District Hospital Pune",
  "type": "district_hospital",
  "code": "DHP-01",
  "district": "Pune",
  "state": "Maharashtra",
  "address": "Opposite Railway Station, Pune",
  "contactNumber": "+91-20-26123456",
  "isActive": true,
  "createdAt": "2026-09-03T08:00:00.000Z",
  "updatedAt": "2026-09-03T08:00:00.000Z"
}
```
