# HealthBridge — System Architecture (SIH 26133)

## High-Level Architecture

```text
Next.js 15 Frontend (apps/web)
       │
       │ HTTP / REST API (Bearer JWT)
       ▼
Express API Backend (apps/api)
       │
       ├───────────────────────┬────────────────────────┐
       ▼                       ▼                        ▼
MongoDB Atlas            Supabase Storage          Clerk Auth
(Primary Database)      (Files / Realtime)     (Identity / Session)
```

## System Components

### 1. Frontend (`apps/web`)
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Authentication**: Clerk (`@clerk/nextjs`)
- **Internationalization**: Custom SSR-safe i18n (`en`, `hi`, `mr`)
- **Theme**: CSS variable-based Light & Dark mode (no flash)
- **Shared UI**: Uses `@healthbridge/ui` primitives

### 2. Backend (`apps/api`)
- **Framework**: Express.js, TypeScript, Node.js
- **Auth Verification**: Clerk Express SDK (`@clerk/express`)
- **Database ORM**: Mongoose (MongoDB Atlas)
- **Storage Client**: `@supabase/supabase-js`

### 3. Shared Workspace Packages (`packages/`)
- `@healthbridge/ui`: Reusable React components (Button, Input, Card, Badge, Modal, etc.)
- `@healthbridge/types`: Shared TypeScript interface definitions
- `@healthbridge/validation`: Shared Zod validation schemas
- `@healthbridge/config`: Shared application constants and configuration

## Role-Based Access Architecture

```text
Clerk User (publicMetadata.role)
       │
       ▼
UserContext (apps/web/components/providers/UserProvider.tsx)
       │
       ▼
Role Navigation & Route Guarding (apps/web/lib/roles.ts)
```

Supported roles:
- `admin` — Hospital Administrator
- `doctor` — Medical Practitioner
- `nurse` — Nurse / Healthcare Worker
- `receptionist` — Front Desk / Registration
- `pharmacist` — Pharmacy Staff
- `labStaff` — Laboratory Technician

## Folder Ownership Strategy for Developers S1, S2, S3

```text
Frontend:
  apps/web/features/admin/
  apps/web/features/doctor/
  apps/web/features/nurse/
  apps/web/features/receptionist/
  apps/web/features/pharmacy/
  apps/web/features/laboratory/

Backend:
  apps/api/src/modules/patients/
  apps/api/src/modules/appointments/
  apps/api/src/modules/queue/
  apps/api/src/modules/consultations/
  apps/api/src/modules/referrals/
  apps/api/src/modules/diagnostics/
  apps/api/src/modules/pharmacy/
  apps/api/src/modules/facilities/
```

Each developer owns their assigned feature files and avoids modifying other developers' code.
