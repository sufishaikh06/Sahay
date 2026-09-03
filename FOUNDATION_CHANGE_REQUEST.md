# FOUNDATION CHANGE REQUEST — ROLE REQUEST & APPROVAL WORKFLOW

You have already implemented the foundation of the HealthBridge SIH-26133 project according to:

1. PROJECT_CONTEXT.md
2. FOUNDATION_PRD_IMPLEMENTATION.md
3. agents/s1/PROGRESS.md

DO NOT restart or rebuild the project from scratch.

Before making any changes:
- Read PROJECT_CONTEXT.md completely.
- Read FOUNDATION_PRD_IMPLEMENTATION.md completely.
- Read agents/s1/PROGRESS.md completely.
- Inspect the current codebase and understand the existing Clerk authentication, dashboard, role handling, database configuration, API structure, routing, and UI architecture.

We are introducing an approved architectural change to the authentication/onboarding flow.

==================================================
1. NEW DECISION
==================================================

HealthBridge will use a ROLE REQUEST + ADMIN APPROVAL model.

A user must NOT be able to assign a privileged role to themselves.

During first-time registration, the user will select:

- Healthcare Facility
- Requested Role

The selected role is only a REQUEST.

The Hospital Administrator will later review and approve/reject the request.

Only after approval will the user's official role become active and the user receive access to the corresponding role-specific system.

==================================================
2. REQUIRED USER FLOW
==================================================

NEW USER:

Sign Up
   ↓
Create Clerk account
   ↓
Complete HealthBridge onboarding
   ↓
Select Facility
   ↓
Select Requested Role
   ↓
Submit Role Request
   ↓
Account Status = PENDING
   ↓
Wait for Hospital Admin

IMPORTANT:
Selecting a role during signup does NOT grant that role.

Example:

User selects:
Role = Doctor

This means:

requestedRole = DOCTOR

NOT:

role = DOCTOR

The actual role must remain unassigned/pending until an authorized administrator approves it.

==================================================
3. ALLOWED SELF-REQUESTED ROLES
==================================================

The following roles can be requested by a normal user:

- Doctor
- Nurse / Healthcare Worker
- Receptionist
- Pharmacist
- Lab Staff

Hospital Admin must NOT be freely self-assigned by a normal user.

Do not implement a normal signup flow where a user can select "Hospital Admin" and immediately become an administrator.

If the existing UI contains Hospital Admin as a normal selectable role, modify it appropriately.

The architecture should leave room for Hospital Admin accounts to be provisioned by an authorized higher-level authority or through a controlled administrative process in the future.

==================================================
4. FACILITY ASSOCIATION
==================================================

The application should conceptually associate an account with:

User
 ├── Identity
 ├── Facility
 ├── Requested Role
 ├── Approved Role
 └── Account Status

Example:

Dr. Rahul Sharma
Facility: District Hospital A
Requested Role: Doctor
Approved Role: Doctor
Status: ACTIVE

Before approval:

User:
Rahul Sharma
Facility: District Hospital A
Requested Role: Doctor
Approved Role: null
Status: PENDING

Do not treat requestedRole as an authorization value.

==================================================
5. ACCOUNT STATES
==================================================

Introduce/prepare the following conceptual account states:

PENDING
ACTIVE
REJECTED

PENDING:
- Authentication is successful.
- User cannot access protected healthcare operational features.
- User sees a professional pending-approval page.
- The page should show:
  - account status
  - selected facility
  - requested role
  - message that the request is awaiting administrator approval.

ACTIVE:
- User has an approved role.
- User can access the appropriate role-specific area.
- Authorization is based on the approved role, NOT the requested role.

REJECTED:
- User remains authenticated.
- User cannot access healthcare operational features.
- User should see that the role request was rejected.
- Provide an appropriate message/instruction for contacting the administrator or submitting a new request if the architecture supports it.

==================================================
6. ADMIN APPROVAL PREPARATION
==================================================

Do NOT implement the complete Hospital Admin dashboard or full approval-management system yet.

However, build the foundation so that later the Hospital Admin module can:

- View pending role requests
- View applicant information
- View requested facility
- View requested role
- Approve request
- Reject request

The approval action should eventually result in:

approvedRole = requestedRole
status = ACTIVE

and record appropriate audit information such as:

approvedBy
approvedAt

Similarly, rejection should record appropriate audit information where applicable.

Prepare the data/API architecture cleanly so the Admin developer can implement this later without rewriting the authentication architecture.

==================================================
7. AUTHORIZATION RULE
==================================================

THIS IS CRITICAL.

Never authorize a user using:

requestedRole

Authorization must use:

approvedRole

or the final role/permission representation established by the application.

Example:

requestedRole = DOCTOR
approvedRole = null
status = PENDING

The user is NOT a Doctor in terms of authorization.

Only:

requestedRole = DOCTOR
approvedRole = DOCTOR
status = ACTIVE

should result in Doctor access.

==================================================
8. CLERK RESPONSIBILITY
==================================================

Continue using Clerk for:

- Authentication
- Sign in
- Sign up
- User identity
- Session management

Do not move password authentication into MongoDB or Supabase.

Application-specific onboarding, role-request, facility and approval information should be handled by the application's backend/database architecture.

Keep the separation:

Clerk
→ Who is the user?

HealthBridge backend/database
→ What facility does the user belong to?
→ What role did they request?
→ What role was approved?
→ Is the account pending/active/rejected?
→ What permissions does the user have?

==================================================
9. LOGIN FLOW
==================================================

The normal login page should remain a professional authentication page.

DO NOT make a freely selectable role dropdown on normal login that determines authorization.

The correct flow is:

LOGIN
 ↓
Clerk authentication
 ↓
Retrieve HealthBridge account/profile
 ↓
Check account status
 ↓
 ┌─────────────────────────────────────┐
 │                                     │
 PENDING          ACTIVE           REJECTED
 │                  │                  │
 ↓                  ↓                  ↓
Pending page    Resolve role      Rejected page
                    │
          ┌─────────┼──────────┐
          ↓         ↓          ↓
       Doctor     Nurse      etc.
          │
          ↓
   Correct dashboard

==================================================
10. SIGNUP / ONBOARDING UI
==================================================

Modify the signup/onboarding experience so that after Clerk account creation the user can provide:

- Name (use Clerk identity where appropriate)
- Facility
- Requested Role

Use a professional government-healthcare style UI.

The role field must clearly communicate that this is a request.

For example:

"Select your role"
or preferably:

"Request access as"

Helper text:

"Your selected role will be reviewed and approved by your hospital administrator."

Do NOT use wording that implies immediate role assignment.

==================================================
11. CURRENT DASHBOARD BEHAVIOR
==================================================

The current generic dashboard currently displays:

"Your role has not been assigned yet. Please contact your administrator."

Replace/extend this behavior according to the new account-state architecture.

For a PENDING account, display a proper pending-approval experience.

For ACTIVE accounts with an approved role, prepare routing toward the appropriate role-specific dashboard.

For REJECTED accounts, display the appropriate rejected-request state.

Do not build the actual role dashboards yet.

==================================================
12. DATABASE / API DESIGN
==================================================

Inspect the existing database architecture before implementing.

Use the project's established database strategy.

Create/modify the necessary application-level structures for:

User/Profile
Role Request
Facility association
Approval status
Approval audit information

Avoid unnecessary duplication of Clerk identity data.

Define clear fields and validation.

At minimum, the conceptual role-request data should support:

userId
facilityId
requestedRole
approvedRole
status
createdAt
updatedAt
approvedBy
approvedAt
rejectedBy
rejectedAt
rejectionReason

Use appropriate naming and structure based on the existing architecture.

Do not blindly copy this schema if the existing project has a better established convention; integrate it cleanly.

==================================================
13. SECURITY REQUIREMENTS
==================================================

A normal authenticated user must NEVER be able to:

- Set their own approvedRole
- Change their approvedRole through the frontend
- Mark their own account ACTIVE
- Approve their own role request
- Access another facility's data
- Access another user's role-request information

The backend must enforce authorization.

Never trust role/status values supplied by the client.

==================================================
14. MULTILINGUAL SUPPORT
==================================================

All new user-facing strings must work with the existing i18n architecture.

At minimum support:

English
Hindi
Marathi

Do not hardcode new UI text directly into components if the project already uses translation keys.

==================================================
15. UI/UX
==================================================

Maintain the existing HealthBridge design system.

Requirements:

- Professional
- Clean
- Government healthcare appropriate
- Responsive
- Mobile friendly
- Desktop friendly
- Accessible
- Light mode
- Dark mode
- Existing color system
- Existing shared UI components

Create clear visual states for:

PENDING
ACTIVE
REJECTED

Do not make the interface visually complicated.

==================================================
16. WHAT NOT TO BUILD YET
==================================================

DO NOT implement:

- Complete Hospital Admin dashboard
- Complete Doctor dashboard
- Complete Nurse dashboard
- Complete Receptionist dashboard
- Complete Pharmacy dashboard
- Complete Laboratory dashboard
- Patient workflow modules
- Full approval management UI
- Full hospital workflow

Those will be assigned to S1/S2/S3 after the foundation is frozen.

Your job in this change is to establish the shared authentication/onboarding/role-request foundation.

==================================================
17. DOCUMENTATION
==================================================

Update the relevant documentation to reflect this new architecture.

At minimum review/update:

docs/PROJECT_CONTEXT.md
docs/ARCHITECTURE.md
docs/API_CONTRACT.md
docs/DATABASE_SCHEMA.md
docs/DEVELOPMENT_RULES.md
FOUNDATION_PRD_IMPLEMENTATION.md

Clearly document:

- Requested role vs approved role
- Account states
- Facility association
- Authentication vs authorization
- Admin approval concept
- Security rules
- Future Admin approval workflow

==================================================
18. TESTING
==================================================

Test at minimum:

1. New user signs up.
2. User selects Doctor as requested role.
3. Request is stored as PENDING.
4. User cannot access Doctor functionality.
5. User cannot make themselves ACTIVE.
6. User cannot set approvedRole from the client.
7. Pending page is displayed.
8. Rejected state can be represented correctly.
9. Active approved role can be represented correctly.
10. Existing Clerk login/logout still works.
11. Protected routes still work.
12. API authentication still works.
13. Existing light/dark mode still works.
14. Existing English/Hindi/Marathi support still works.
15. Desktop and mobile layouts remain responsive.
16. npm build succeeds.
17. npm lint succeeds.
18. TypeScript checks succeed.

==================================================
19. GIT SAFETY
==================================================

Before modifying files:

- Inspect git status.
- Do not discard existing work.
- Do not reset the repository.
- Do not rewrite unrelated files.
- Keep the change focused on the authentication/onboarding foundation.

After implementation:

- Review git diff.
- Remove debug code.
- Ensure no secrets are committed.
- Run all required checks.

Do NOT create role-specific developer branches yet.

This change must be completed and verified on the current foundation before we divide work among S1/S2/S3.

==================================================
20. PROGRESS HANDOFF
==================================================

After completing the implementation:

Update:

agents/s1/PROGRESS.md

Add a new section:

## Phase 20 — Role Request & Approval Foundation

Include:

- Date/time
- Files changed
- What was implemented
- Authentication changes
- Onboarding changes
- Role-request architecture
- Account-state architecture
- Database/API changes
- Security rules
- Tests performed
- Build/lint/typecheck results
- Known limitations
- Recommended next step

Do not claim a feature is complete unless you actually verified it.

==================================================
FINAL OBJECTIVE
==================================================

The foundation should now support this architecture:

SIGN UP
   ↓
Clerk Account
   ↓
HealthBridge Onboarding
   ↓
Facility + Requested Role
   ↓
ROLE REQUEST
   ↓
PENDING
   ↓
Hospital Administrator Review
   ↓
 ┌───────────────┐
 │               │
APPROVE        REJECT
 │               │
 ↓               ↓
ACTIVE        REJECTED
 │
 ↓
Approved Role
 │
 ├── Doctor
 ├── Nurse
 ├── Receptionist
 ├── Pharmacist
 └── Lab Staff

Hospital Admin itself must remain a controlled/provisioned role.

After completing this phase, STOP.

Do not start implementing S1/S2/S3 role-specific features.

Then report the implementation status and wait for further instructions.