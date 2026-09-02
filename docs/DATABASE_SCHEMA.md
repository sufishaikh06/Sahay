# HealthBridge — Database Schema & Data Conventions

## Databases

1. **MongoDB Atlas** — Primary source-of-truth application database.
2. **Supabase** — Supporting object storage (medical reports, scans, documents) and operational realtime events.

## Data Naming Conventions

- Collection names: `lowercase_plural` (e.g. `patients`, `appointments`, `prescriptions`)
- Field names: `camelCase` (e.g. `fullName`, `createdAt`, `dateOfBirth`)
- Primary Keys: MongoDB ObjectId (`_id`), mapped to `id` string in API responses.
- Timestamps: ISO-8601 strings (`2026-09-02T18:00:00Z`). Every document must have `createdAt` and `updatedAt`.

## Core Entities (High Level)

### User / Health Worker

```json
{
  "_id": "ObjectId",
  "clerkId": "user_2...",
  "email": "doctor@healthbridge.org",
  "firstName": "Aarav",
  "lastName": "Sharma",
  "role": "doctor",
  "facilityId": "ObjectId",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### Facility

```json
{
  "_id": "ObjectId",
  "name": "District Hospital Pune",
  "type": "district_hospital",
  "code": "DHP-01",
  "district": "Pune",
  "state": "Maharashtra",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### Patient (Future - Developer S1/S2/S3)

```json
{
  "_id": "ObjectId",
  "uhid": "ABHA-1234-5678-9012",
  "fullName": "Priya Patel",
  "gender": "female",
  "dateOfBirth": "1990-05-15",
  "phone": "9876543210",
  "address": "Village Khed, District Pune",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```
