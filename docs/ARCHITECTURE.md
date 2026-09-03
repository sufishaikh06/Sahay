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

## Role Request & Admin Approval Architecture (Phase 20)

HealthBridge uses a **ROLE REQUEST + ADMIN APPROVAL** model. Normal users CANNOT self-assign privileged roles.

```text
Sign Up (Clerk Auth)
       │
       ▼
HealthBridge Onboarding (/onboarding)
(User selects Facility + Requested Role: Doctor, Nurse, Receptionist, Pharmacist, Lab Staff)
       │
       ▼
MongoDB User Document (status = "pending", requestedRole = "doctor", approvedRole = null)
       │
       ├─────────────────────────────────────────┐
       │                                         │
       ▼                                         ▼
Hospital Admin Approves                   Hospital Admin Rejects
(approvedRole = "doctor",                 (status = "rejected",
 status = "active")                        rejectionReason = "...")
       │                                         │
       ▼                                         ▼
ACTIVE User                               REJECTED User
(Can access role dashboard)              (Sees rejection status screen)
```

### Critical Authorization Rule
- **`requestedRole`** is NEVER used for authorization.
- Authorization decisions depend strictly on **`approvedRole`** and **`status === "active"`**.
- Unapproved users (`status === "pending"`) see a dedicated pending-approval screen.
- Rejected users (`status === "rejected"`) see a dedicated rejected screen.

## Supported Roles

- `admin` — Hospital Administrator (Provisioned via controlled administrative process; never self-requested)
- `doctor` — Medical Practitioner (Self-requested, requires Admin approval)
- `nurse` — Nurse / Healthcare Worker (Self-requested, requires Admin approval)
- `receptionist` — Front Desk / Registration (Self-requested, requires Admin approval)
- `pharmacist` — Pharmacy Staff (Self-requested, requires Admin approval)
- `labStaff` — Laboratory Technician (Self-requested, requires Admin approval)

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
