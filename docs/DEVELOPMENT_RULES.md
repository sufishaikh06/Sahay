# HealthBridge — Development & Collaboration Rules (SIH 26133)

This document is the shared development contract for developers S1, S2, and S3. All developers and AI coding agents working on HealthBridge must follow these rules.

---

## 1. Git and Branch Workflow

- **`main` is the stable integration branch.** Never work directly on `main` for feature development after foundation.
- Always check `git status` before editing code.
- Feature branch naming conventions:
  - **S1**: `feature/s1-admin-doctor`
  - **S2**: `feature/s2-receptionist-nurse`
  - **S3**: `feature/s3-lab-pharmacy`
- All feature branches must start from the latest `main`.
- Keep commits logically scoped, focused, and clean. Use Pull Requests for merging into `main`.
- Never reset, overwrite, or discard another developer's uncommitted work or branch history.

---

## 2. Developer Role Ownership

Work is divided across three developers (S1, S2, S3), each owning complete end-to-end workflows (both frontend UI and backend API logic) for their assigned roles:

### S1 — Hospital Admin + Doctor
- **Admin**: Staff/facility administration, role request approvals & rejections, system monitoring.
- **Doctor**: Clinical consultations, vitals review, clinical notes, referrals, diagnostic orders, e-prescriptions.

### S2 — Receptionist + Nurse
- **Receptionist**: Patient registration, patient check-in, appointments management, OPD queue operations.
- **Nurse**: Digital triage, vitals recording, nursing observations, queue management.

### S3 — Lab Staff + Pharmacist
- **Lab Staff**: Diagnostic order processing, sample tracking, lab report upload/entry, diagnostic results.
- **Pharmacist**: Prescription processing, inventory/medicine availability checking, dispensing.

---

## 3. Frontend & Backend File Ownership

### Frontend Ownership (`apps/web/`)
- `apps/web/features/admin/` → **S1**
- `apps/web/features/doctor/` → **S1**
- `apps/web/features/receptionist/` → **S2**
- `apps/web/features/nurse/` → **S2**
- `apps/web/features/laboratory/` → **S3**
- `apps/web/features/pharmacy/` → **S3**

### Backend Ownership (`apps/api/src/modules/`)
- Admin & Doctor modules → **S1**
- Receptionist, Nurse, Patient, Queue & Appointment modules → **S2**
- Diagnostics & Pharmacy modules → **S3**

**Rule**: Prefer feature-local files to minimize merge conflicts. Never modify another developer's owned feature directory without prior agreement.

---

## 4. Shared Domains & Data Canonicality

The system maintains **one canonical data model** for shared entities:
- Users & Role Requests
- Facilities
- Patients
- Appointments & OPD Queue
- Consultations & Clinical Notes
- Referrals
- Diagnostics & Lab Reports
- Prescriptions & Pharmacy Dispensing

**Rule**: A developer may consume another domain without owning it. **Never duplicate entities** (e.g. do not create a separate `DoctorPatient` or `NursePatient` model).

---

## 5. High-Risk Shared File Protection

The following files impact the entire system and are classified as **High-Risk Shared Files**:

```text
packages/types/
packages/validation/
packages/ui/
packages/config/
docs/API_CONTRACT.md
docs/DATABASE_SCHEMA.md
apps/api/src/middleware/ (auth, error handling)
apps/web/app/layout.*
apps/web/styles/globals.css
root package.json & workspace configuration
```

**Rules for Shared Files**:
1. Check `git status` and coordinate with team members before modifying shared files.
2. Do not silently change shared API contracts (`docs/API_CONTRACT.md`).
3. Do not silently change shared database schema conventions (`docs/DATABASE_SCHEMA.md`).
4. Reuse existing shared UI components from `@healthbridge/ui` rather than creating duplicates.
5. Keep shared-file changes minimal, backward-compatible, and well-documented.

---

## 6. Authentication vs. Authorization

- **Clerk Authentication** answers **WHO THE USER IS** (Identity, sessions, JWT token).
- **HealthBridge Backend** answers **WHAT THE USER IS ALLOWED TO DO** (Facility scope, role permissions, account status).

### Security & Authorization Rules:
1. **Never use `requestedRole` for authorization.** Authorization must strictly check `approvedRole` and `status === "active"`.
2. **Users must NEVER be able to set their own `approvedRole` or `status`.** All approval actions must be executed server-side by an authorized Hospital Admin.
3. **Backend Authorization Enforcement**: Frontend role checks are for UI display only. The Express backend API must enforce role and facility scope authorization on every protected route.
4. **Secrets Management**: Never commit secrets (Clerk secret keys, MongoDB URIs, Supabase service-role keys). Always use environment variables (`.env.local`).

---

## 7. Role-Request & Approval Workflow

```text
Sign Up (Clerk)
    ↓
Select Facility + Requested Role (Onboarding)
    ↓
Account Status = PENDING
    ↓
Hospital Admin Review & Approval
    ↓
Account Status = ACTIVE (approvedRole set)
```

- Normal users may request: **Doctor**, **Nurse**, **Receptionist**, **Pharmacist**, or **Lab Staff**.
- **Hospital Admin** is a controlled/provisioned role and cannot be self-requested.

---

## 8. Cross-Team Change Protocol

When a feature requires capabilities owned by another developer:
1. Inspect the existing domain contract (`API_CONTRACT.md`, `DATABASE_SCHEMA.md`, `@healthbridge/types`).
2. Reuse existing endpoints and types whenever possible.
3. If additional fields or endpoints are needed, document the exact requirement and coordinate with the owner.
4. Make the smallest compatible change.
5. Update shared documentation (`API_CONTRACT.md`, `DATABASE_SCHEMA.md`) upon agreement.
6. **Never solve cross-team requirements by duplicating domains or data models.**

---

## 9. AI-Agent Safety Rules

Every AI coding agent working on HealthBridge must:
1. Read project context (`docs/PROJECT_CONTEXT.md`) and development rules (`docs/DEVELOPMENT_RULES.md`).
2. Read developer-specific `CONTEXT.md`, `IMPLEMENTATION.md`, and `PROGRESS.md` before starting.
3. Run `git status` and inspect existing codebase before editing files.
4. Work strictly within assigned folder boundaries.
5. Avoid unnecessary broad refactors or rewrites.
6. Never overwrite another developer's work.
7. Record architecture blockers in progress files rather than inventing unapproved architecture.
8. Update progress documentation (`agents/<dev>/PROGRESS.md`) after completing meaningful steps.
9. Run build, lint, typecheck, and verification (`npm run build`, `npm run lint`) before declaring completion.

---

## 10. Definition of Done (DoD)

A feature or role module is considered complete only when:
- [ ] UI and responsive mobile/desktop layouts work correctly.
- [ ] Authentication and role-based authorization are verified end-to-end.
- [ ] Facility scoping and data isolation are enforced.
- [ ] API endpoints, request validation, and error handling work as expected.
- [ ] MongoDB and Supabase operations perform cleanly.
- [ ] Proper loading, empty, and error states are provided.
- [ ] Internationalization (i18n) works for English, Hindi, and Marathi strings.
- [ ] Light mode and dark mode render correctly without visual regressions.
- [ ] Build succeeds (`npm run build`), lint succeeds (`npm run lint`), and TypeScript checks pass without errors.
- [ ] Developer progress file (`agents/<dev>/PROGRESS.md`) is updated.

---

## 11. Core Integration Principle

HealthBridge is **one connected healthcare coordination system**, not six isolated applications.

### Connected Care Journey:
```text
Receptionist → Patient Registration & Appointment
       ↓
Nurse → Digital Triage & Vitals
       ↓
Doctor → Consultation, Vitals Review & Diagnostic Order
       ↓
Lab Staff → Test Processing & Lab Results
       ↓
Doctor → Prescription & E-Sign
       ↓
Pharmacist → Dispensing & Inventory Update
```

**Golden Rule**: One HealthBridge system, one canonical shared data model, multiple authorized role experiences.
