# HealthBridge — SIH 26133 Complete Project Context

## Project Summary

- **Hackathon**: Smart India Hackathon 2026
- **Problem ID**: 26133
- **Title**: Healthcare Access & Coordination Platform
- **Focus**: Operational facility-side coordination for rural and underserved areas.

## Core Care Journey

```text
Patient Registration (Receptionist)
       ↓
Digital Triage & Vitals (Nurse)
       ↓
Appointment / Queue Management (Receptionist/Nurse)
       ↓
Doctor Consultation & E-Prescription (Doctor)
       ↓
Longitudinal Patient Record (System)
       ↓
Diagnostics & Laboratory Reports (Lab Staff)
       ↓
Pharmacy & Medication Dispensing (Pharmacist)
       ↓
Referrals & Follow-Up (Doctor / Nurse)
```

## Shared Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, CSS Modules with Design Tokens
- **Backend**: Node.js, Express.js, TypeScript
- **Auth**: Clerk Authentication
- **Primary Database**: MongoDB Atlas
- **Storage / Realtime**: Supabase
- **Supported Languages**: English (`en`), Hindi (`hi`), Marathi (`mr`)

## Shared Foundation Scope (Completed)

1. Monorepo architecture with npm workspaces (`apps/web`, `apps/api`, `packages/ui`, `packages/types`, `packages/validation`, `packages/config`).
2. Next.js web application with global layout, loading, error, not-found, design tokens, light/dark mode.
3. Reusable UI component package (`@healthbridge/ui`).
4. Responsive application shell (Sidebar, Header, AppShell).
5. Internationalization setup for English, Hindi, Marathi.
6. Clerk authentication integration, sign-in page, sign-up page, middleware, user provider.
7. Protected role-aware dashboard foundation.
8. Express API backend with health check endpoint (`GET /api/health`), error handler, response utilities, and auth verification middleware.
9. MongoDB Atlas connection & Supabase client modules.
10. Project documentation in `docs/`.
