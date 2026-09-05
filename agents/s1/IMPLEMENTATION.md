# S1 IMPLEMENTATION — Hospital Admin + Doctor

## Execution rules

Work only on branch:
`feature/s1-admin-doctor`

Before every phase:
1. `git status`
2. Read `agents/s1/PROGRESS.md`
3. Inspect the relevant current implementation.
4. Confirm the phase does not require an uncoordinated shared-domain change.

After every phase:
- run relevant checks
- update `agents/s1/PROGRESS.md`
- list files changed
- list tests/checks
- record blockers
- commit only the logical completed work

Do not start the next phase if the current phase has unresolved security or architectural failures.

---

# Phase 0 — Baseline and inventory

### Objective
Understand the current foundation before modifying it.

### Tasks
- Inspect repository structure.
- Verify current Clerk integration.
- Verify role-request/account-state implementation.
- Verify current route guards/middleware.
- Verify existing shared UI/i18n/theme.
- Inspect API and database conventions.
- Identify existing modules that can be reused.

### Deliverable
Create/update an S1 implementation inventory in `PROGRESS.md`.

### Acceptance
No code changes unless needed to fix an explicitly discovered foundation blocker.

---

# Phase 1 — Admin authorization foundation

### Objective
Ensure the Admin area is securely gated.

### Tasks
- Define/verify Admin route protection.
- Verify approved Admin role is required.
- Verify active account status is required.
- Verify facility scope is enforced.
- Ensure normal users cannot become Admin through client input.
- Add reusable server authorization helper only if the project lacks one.

### Acceptance
A non-Admin cannot access Admin APIs or protected Admin pages by changing URL, request body, or browser state.

---

# Phase 2 — Admin shell and navigation

### Tasks
Build:
- Admin layout
- sidebar/navigation
- header/user menu
- responsive mobile navigation
- theme support
- i18n

Navigation must not itself be treated as authorization.

### Acceptance
Admin shell is responsive and unauthorized users are redirected/blocked server-side.

---

# Phase 3 — Role-request approval workflow

### Objective
Turn the existing role-request foundation into a usable Admin workflow.

### UI
Build:
- pending request list
- filters/search only if supported
- request detail view
- applicant information
- requested facility
- requested role
- approve action
- reject action
- rejection reason
- success/error states
- confirmation for destructive/reversible security-sensitive actions

### Backend
Implement/verify:
- list pending requests scoped to Admin facility
- request detail
- approve
- reject

### Approval rules
Approve only valid pending requests.

On approval:
- set approved role from the requested role
- set ACTIVE
- record approver and timestamp

On rejection:
- set REJECTED
- record rejector/timestamp/reason as supported

### Security
Prevent:
- self-approval
- cross-facility approval
- approval of already processed requests
- client-controlled `approvedBy`
- client-controlled status transitions

### Acceptance
Full flow works:
signup → pending → Admin sees request → approve/reject → authorization changes accordingly.

---

# Phase 4 — Admin staff and facility management

### Tasks
- staff listing
- staff detail
- status visibility
- facility information
- supported administrative controls
- audit visibility where supported

Do not add unsafe role reassignment unless the shared product rules explicitly define it.

### Acceptance
Admin can manage only permitted facility data.

---

# Phase 5 — Admin dashboard

### Tasks
Create useful dashboard cards/widgets using real API data:
- pending approvals
- staff/account summaries
- facility operational indicators available from canonical domains
- alerts/tasks

Do not use fake numbers in production UI.

### Acceptance
Dashboard handles loading, empty and error states and never leaks data from another facility.

---

# Phase 6 — Doctor authorization and shell

### Tasks
- Doctor route guard
- Doctor layout
- navigation
- responsive shell
- theme/i18n
- account/facility-aware access

### Acceptance
Only active approved Doctors can access protected Doctor operations.

---

# Phase 7 — Doctor dashboard

### Tasks
Implement:
- relevant appointments/queue
- waiting/pending consultation list
- diagnostic result/order indicators
- follow-up items
- patient summary widgets supported by real data

### Acceptance
No fabricated metrics; data is facility/doctor scoped according to the domain.

---

# Phase 8 — Doctor patient clinical workspace

### Tasks
Create a patient workspace that consumes canonical patient data.

Include where supported:
- patient identity/demographics
- current encounter
- triage/vitals
- nursing observations
- previous consultations
- diagnostic results
- prescriptions
- referrals/follow-up

### Rules
- Do not duplicate patient data models.
- Do not expose data outside the user's authorization scope.
- Do not put clinical records in client-side persistent storage unless explicitly required.

### Acceptance
Doctor can review the complete available clinical context for an authorized patient.

---

# Phase 9 — Consultation workflow

### Tasks
- open eligible encounter
- record consultation
- assessment/diagnosis
- notes
- treatment plan where supported
- save/finalize lifecycle
- validation
- error recovery

### Important
Do not allow arbitrary editing of another Doctor's/facility's records.

### Acceptance
Consultation data is persisted through the canonical API and is visible to authorized downstream workflows.

---

# Phase 10 — Diagnostic ordering

### Tasks
- select diagnostic tests supported by canonical schema
- create diagnostic order
- link order to patient/encounter
- expose status
- display returned results

### Boundary
S1 creates/orders and reviews diagnostics.
S3 processes lab work and records results.

### Acceptance
S1 Doctor can create an order that S3 can consume without manual database edits.

---

# Phase 11 — Prescription workflow

### Tasks
- create structured prescription
- medicines/directions/duration according to established schema
- associate with patient/encounter
- validation
- status/lifecycle

### Boundary
S1 Doctor creates prescription.
S3 Pharmacy processes/dispenses.

### Acceptance
A valid prescription is available to Pharmacy through the canonical workflow.

---

# Phase 12 — Referral and follow-up

### Tasks
- create referral
- destination/reason/details as supported
- create follow-up plan
- display status
- maintain auditability

### Acceptance
Referral/follow-up is persisted in the shared domain and does not create a duplicate model.

---

# Phase 13 — Cross-role integration

### Verify
1. S2 patient exists.
2. S2 appointment/triage exists.
3. Doctor can access authorized information.
4. Doctor consultation can be created.
5. Diagnostic order reaches S3 workflow.
6. S3 result appears to Doctor.
7. Doctor prescription reaches S3 Pharmacy.
8. Pharmacy status can return to the relevant Doctor view where required.

Do not fake integration with local mock data once real APIs exist.

---

# Phase 14 — Security and edge-case hardening

Test:
- unauthenticated access
- pending account
- rejected account
- wrong role
- inactive account
- wrong facility
- direct API calls
- manipulated request body
- duplicate approval
- duplicate rejection
- concurrent approval
- missing resource
- malformed input
- unauthorized patient access

---

# Phase 15 — Quality, accessibility and performance

Verify:
- responsive mobile/desktop
- keyboard navigation
- visible focus
- labels and form errors
- sensible contrast in both themes
- no unnecessary sensitive logging
- no obvious N+1 API behavior
- loading states
- empty states
- error states
- TypeScript
- lint
- build
- tests

---

# Phase 16 — Final S1 handoff

Update `agents/s1/PROGRESS.md` with:
- all phases
- final files changed
- API endpoints
- database changes
- shared changes
- tests/checks
- known limitations
- integration notes for S2/S3
- exact manual test flow

Then prepare a PR from:
`feature/s1-admin-doctor` → `main`

Do not merge your own PR if the team has a separate review policy.

---

## Forbidden shortcuts

Never:
- assign a role from frontend state
- trust client-provided facility IDs for authorization
- duplicate shared models
- use hardcoded fake production metrics
- bypass Clerk/session checks
- store secrets in source
- reset Git to solve conflicts
- overwrite another developer's work
- modify another team's feature directory without coordination
- silently change a shared API contract
- claim completion without verification
