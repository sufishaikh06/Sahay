# S1 CONTEXT — Hospital Admin + Doctor

## 1. Project

Project: Sahay / HealthBridge
SIH 2026 Problem ID: 26133

S1 owns two role experiences:
- Hospital Admin
- Doctor

Branch:
`feature/s1-admin-doctor`

The common foundation, authentication, onboarding, role-request architecture, shared UI system, multilingual support, theme support, and repository structure already exist. Do not rebuild them.

Read these before coding:
1. `docs/PROJECT_CONTEXT.md`
2. `docs/ARCHITECTURE.md`
3. `docs/API_CONTRACT.md`
4. `docs/DATABASE_SCHEMA.md`
5. `docs/DEVELOPMENT_RULES.md`
6. `docs/TEAM_OWNERSHIP_MATRIX.md`
7. `agents/s1/PROGRESS.md`
8. `FOUNDATION_CHANGE_REQUEST.md` if present in the repository

If the actual repository differs from this document, the existing project documentation and verified implementation are the source of truth. Do not silently invent replacements.

---

## 2. S1 Mission

Build a complete, production-style Hospital Admin and Doctor experience on top of the existing foundation.

The system must remain one integrated healthcare platform. S1 must not create separate patient, facility, appointment, diagnostic, or pharmacy universes.

S1 work has two goals:

### Hospital Admin
Provide controlled facility administration and the role-request approval workflow.

### Doctor
Provide the clinical workflow from the doctor's perspective, including patient review, consultation, diagnostic ordering, prescription, referral/follow-up, and relevant clinical information.

---

## 3. Authentication and authorization

Clerk remains responsible for identity and sessions.

HealthBridge application data determines:
- facility
- requested role
- approved role
- account status
- permissions

Never authorize using `requestedRole`.

A user with:
- `requestedRole = DOCTOR`
- `approvedRole = null`
- `status = PENDING`

is NOT a Doctor for authorization purposes.

Admin actions must be protected server-side. Never trust an `approvedRole`, facility ID, or approval decision supplied by the browser.

Hospital Admin is a controlled/provisioned role. Do not add self-service Admin privilege escalation.

---

## 4. Hospital Admin scope

S1 Admin is responsible for:

### A. Admin dashboard
Show useful operational summaries without inventing data:
- pending role requests
- staff/account status
- facility-level operational indicators supported by existing data
- relevant alerts/tasks

### B. Role-request approval
Admin should be able to:
- list pending requests for the permitted facility
- inspect applicant details
- inspect requested role
- inspect facility
- approve
- reject
- provide rejection reason where appropriate
- see request status/history where supported

Approval must result in application state equivalent to:
`approvedRole = requestedRole`
`status = ACTIVE`
`approvedBy = current admin`
`approvedAt = timestamp`

Rejection must not grant access. It should preserve an auditable rejection state.

### C. Staff management
Within the actual authorized facility scope, Admin may:
- view staff
- view role/status
- deactivate/reactivate where the product rules permit
- view staff details
- manage role-request related state

Do not implement arbitrary privilege escalation.

### D. Facility administration
Admin may view/manage only facility information that the product actually supports. Do not allow an Admin to move users across facilities without an explicit, secure workflow.

### E. Auditability
Administrative security-sensitive actions should record who performed the action and when, using the established database/audit conventions.

---

## 5. Doctor scope

S1 Doctor is responsible for the clinical workflow visible to a Doctor.

### A. Doctor dashboard
Provide:
- today's relevant appointments/queue
- pending consultations
- pending diagnostic results/orders relevant to the doctor
- follow-up tasks
- useful patient/clinical summaries supported by actual data

Do not fabricate statistics.

### B. Patient clinical view
Doctor should be able to access authorized patient information needed for care, such as:
- demographics available to the role
- visit/encounter context
- triage/vitals
- consultation history
- diagnostic results
- prescriptions
- referrals/follow-up

Respect facility and authorization boundaries.

### C. Consultation
Doctor should be able to:
- open an eligible patient encounter
- review relevant history
- record consultation notes
- record clinical assessment/diagnosis according to the established schema
- create a treatment plan where supported
- save/finalize according to the domain's lifecycle

Avoid allowing unauthorized edits to finalized records unless the existing product rules explicitly support amendments.

### D. Diagnostics
Doctor can create diagnostic orders using the canonical diagnostic domain.

Do not build the laboratory processing workflow. That belongs to S3.

Doctor must be able to view results that S3 produces through the canonical diagnostic data.

### E. Prescription
Doctor can create prescriptions using the canonical prescription model.

Do not implement pharmacy dispensing/inventory logic. That belongs to S3.

Prescription data must be structured enough for S3 Pharmacy to consume.

### F. Referral and follow-up
Doctor can create/manage referrals and follow-up plans according to the shared contract.

Do not create a separate referral model just for Doctor.

---

## 6. Cross-role dependencies

S1 consumes S2 data:
- patient registration
- appointment
- queue
- triage/vitals
- nursing observations

S1 produces data consumed by S3:
- diagnostic orders
- prescriptions

S1 consumes S3 data:
- diagnostic results
- pharmacy/dispensing status where the shared product requires it

S1 must not duplicate these domains.

---

## 7. UI/UX requirements

Maintain the existing design system.

All S1 screens must be:
- professional
- clean
- government-healthcare appropriate
- responsive on mobile/tablet/desktop
- accessible
- compatible with light and dark mode
- compatible with English, Hindi and Marathi i18n
- consistent with the established eye-friendly color system

Use shared UI primitives from `packages/ui` when appropriate.

Every important screen should handle:
- loading
- empty
- success
- validation error
- server error
- permission denied
- not found
- offline/network failure where appropriate

Never expose sensitive clinical information in a toast, URL query string, client log, or error message unnecessarily.

---

## 8. S1 boundaries

Do NOT own or independently rebuild:
- Receptionist feature
- Nurse feature
- Lab Staff feature
- Pharmacist feature
- patient registration workflow owned by S2
- lab processing owned by S3
- pharmacy dispensing owned by S3

Do not modify another team's feature directories.

Coordinate before changing shared:
- `packages/types`
- `packages/validation`
- `packages/ui`
- auth/authorization middleware
- database schemas used by multiple roles
- API contracts
- global layout/configuration

---

## 9. Security model

Every privileged operation must be protected at the API/server layer.

At minimum, verify:
1. authenticated user
2. active account status
3. approved role
4. permitted facility
5. resource ownership/scope
6. action-specific permission

Never trust:
- role from request body
- facility from request body
- userId from client for "current user" operations
- approval status from client
- approvedBy from client

Use server-derived identity.

---

## 10. Integration philosophy

S1 should implement interfaces that allow this end-to-end chain:

Receptionist → patient/appointment
Nurse → triage/vitals
Doctor → consultation + diagnostic order
Lab → result
Doctor → prescription
Pharmacist → dispensing

The Doctor experience must therefore consume canonical S2/S3 data instead of mocked duplicate records.

---

## 11. Agent behavior

The agent must:
- inspect before editing
- make small logical changes
- preserve existing foundation
- update progress after phases
- stop and document blockers
- never reset Git
- never commit secrets
- run validation before completion
- avoid speculative features not required by the plan

When uncertain about a shared contract, do not guess. Record the question/blocker and coordinate.
