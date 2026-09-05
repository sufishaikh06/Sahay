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

5/09/2026 - 10:35 PM
# FOUNDATION ROUTING + ONBOARDING FIX

You are working on the S1 branch of the Sahay project.

Branch:
feature/s1-admin-doctor

Your task is to fix the authentication, signup, onboarding and post-login routing flow.

IMPORTANT:
This is a FOUNDATION change.
Do not start implementing Hospital Admin or Doctor feature modules yet.

Before making any changes, read:

1. docs/PROJECT_CONTEXT.md
2. docs/ARCHITECTURE.md
3. docs/API_CONTRACT.md
4. docs/DATABASE_SCHEMA.md
5. docs/DEVELOPMENT_RULES.md
6. docs/TEAM_OWNERSHIP_MATRIX.md
7. agents/s1/CONTEXT.md
8. agents/s1/IMPLEMENTATION.md
9. agents/s1/PROGRESS.md
10. FOUNDATION_CHANGE_REQUEST.md, if present

Then inspect the actual current routing/authentication implementation.

Do not assume that the documentation exactly matches the current code.
The existing implementation must be inspected before editing.

==================================================
1. CURRENT PROBLEM
==================================================

The current application behaves approximately like:

Landing Page
    ↓
Signup
    ↓
/dashboard
    ↓ after approximately 2 seconds
/onboarding

This is incorrect because /dashboard belonged to the previous product flow.

The new approved product flow is:

Landing
    ↓
Signup
    ↓
Onboarding
    ↓
User selects facility
    ↓
User selects/request a role
    ↓
Role request submitted
    ↓
Pending approval state
    ↓
Hospital Admin reviews request
    ↓
Approve / Reject
    ↓
If approved → appropriate role experience

There must NOT be an unnecessary redirect through /dashboard.

==================================================
2. PRIMARY OBJECTIVE
==================================================

Change the application so that:

NEW USER:

Landing
→ Signup
→ Onboarding

Existing authenticated user:

→ correct destination based on their actual application state

Do not blindly redirect every authenticated user to /onboarding.

The routing system must distinguish between:

- authenticated but not onboarded
- onboarding incomplete
- role request pending
- role request rejected
- approved and active user
- inactive/suspended user
- approved Hospital Admin
- approved Doctor
- approved Receptionist
- approved Nurse/Healthcare Worker
- approved Lab Staff
- approved Pharmacist

==================================================
3. REMOVE OLD /dashboard FLOW
==================================================

The old /dashboard page was created under the previous product idea.

Find out exactly how /dashboard is currently implemented and what is referencing it.

Do not simply delete the file immediately.

First inspect:

- routes
- redirects
- middleware
- authentication callbacks
- post-signup callbacks
- post-login callbacks
- navigation links
- Clerk configuration
- route guards
- layout redirects
- any dashboard references
- any useEffect-based delayed redirects

Identify all code paths that send users to:

/dashboard

Then remove the obsolete redirect logic.

If /dashboard is no longer required anywhere in the new architecture, remove the obsolete page/code safely.

If another legitimate system component still depends on it, do not blindly delete it. Refactor the dependency to the new destination and then remove it if safe.

There must be no artificial:

/dashboard → /onboarding

redirect.

==================================================
4. LANDING PAGE → SIGNUP
==================================================

Inspect the landing page.

The primary signup/get-started CTA must correctly navigate to the application's existing signup route.

Determine the actual signup route from the current Clerk integration.

Do not invent a new authentication implementation.

If Clerk's signup route is already correctly configured, reuse it.

Verify:

Landing
→ clicking Sign Up / Get Started
→ Signup page

There must not be a situation where the user has to manually type the signup URL.

Check all relevant CTAs/buttons/links.

==================================================
5. SIGNUP → ONBOARDING
==================================================

After successful account creation, the user must not be sent to /dashboard.

The intended destination for a newly created user is:

/onboarding

The onboarding route must load reliably immediately after signup.

Do not implement a fake timed redirect such as:

setTimeout(() => router.push('/onboarding'), 2000)

The redirect must be state-based and deterministic.

The system should use the actual authenticated/application state.

==================================================
6. IMPORTANT: DO NOT REDIRECT ALL USERS TO ONBOARDING
==================================================

This is extremely important.

Only users who actually require onboarding should be sent to:

/onboarding

An already onboarded and approved user must NOT be repeatedly redirected to onboarding.

The routing logic should conceptually work like:

IF user is not authenticated:
    → public/landing/auth flow

IF user is authenticated AND onboarding is incomplete:
    → /onboarding

IF user is authenticated AND onboarding is complete AND role request is pending:
    → pending/request-status experience

IF user is authenticated AND request is rejected:
    → appropriate rejection/request-retry experience

IF user is authenticated AND approved + active:
    → role-specific destination

IF user is inactive/suspended:
    → appropriate account-status page

Do not implement these states using arbitrary delays.

Use actual application state.

==================================================
7. ONBOARDING REQUIREMENTS
==================================================

The onboarding page is now the official first-time setup flow.

The user should be able to:

1. Select/request their facility.
2. Select/request their intended role.
3. Review the information.
4. Submit the request.

The request should enter a pending state.

The user should NOT immediately receive the requested role's privileges.

For example:

User chooses:

Role:
Doctor

Status:
PENDING

This does NOT mean:

Role:
Doctor
Status:
ACTIVE

The requested role must remain separate from the approved role/state.

==================================================
8. ROLE REQUEST MODEL
==================================================

Use the project's existing role-request implementation if it exists.

Do not create a second competing role-request system.

Conceptually the data should support:

User
- identity
- facility
- requestedRole
- approvedRole
- status
- request metadata

The exact property names MUST follow the existing project schema.

Do not invent duplicate fields if equivalent fields already exist.

==================================================
9. SECURITY REQUIREMENT
==================================================

Never treat the user's selected/requested role as an authorized role.

Example:

User selects:

DOCTOR

That means:

requestedRole = DOCTOR

It does NOT mean:

approvedRole = DOCTOR

The user must not gain Doctor permissions until the Hospital Admin approves the request.

Authorization must happen server-side.

Never trust:

- role from frontend state
- role from localStorage
- role from request body
- facility from client input
- approval status from client input

Use authenticated identity and canonical application data.

==================================================
10. ONBOARDING SUBMISSION
==================================================

When the user submits onboarding:

Validate:

- authenticated user
- valid facility
- valid requested role
- required onboarding information
- duplicate/pending request conditions

Then create/update the canonical onboarding/role-request state.

After successful submission:

DO NOT redirect to /dashboard.

Instead show the correct pending state.

For example:

"Your access request has been submitted."

"Your selected role is awaiting approval from the hospital administrator."

The exact wording should use the project's i18n system.

==================================================
11. PENDING STATE
==================================================

Inspect whether a pending/request-status page already exists.

If it exists:
    reuse and improve it.

If it does not exist:
    create a minimal appropriate pending state/page.

The pending state should communicate:

- request submitted
- requested role
- facility
- current status
- that approval is required
- what happens next

Do not expose internal administrative information.

==================================================
12. REJECTED STATE
==================================================

If the existing application supports rejected requests, make routing handle them correctly.

A rejected user must not receive the requested role's privileges.

Provide an appropriate UI state.

If the existing architecture allows resubmission, reuse that mechanism.

Do not invent a new rejection workflow unless required.

==================================================
13. APPROVED USER ROUTING
==================================================

After approval, the user should be routed to the experience associated with their APPROVED role.

Conceptually:

Hospital Admin
→ Admin dashboard

Doctor
→ Doctor dashboard

Receptionist
→ Receptionist dashboard

Nurse / Healthcare Worker
→ Nurse dashboard

Lab Staff
→ Laboratory dashboard

Pharmacist
→ Pharmacy dashboard

IMPORTANT:

These role dashboards may not all exist yet.

Do NOT create all six dashboards as part of this task.

Instead:

- create/verify the routing architecture
- use existing routes where they exist
- use a safe placeholder or documented destination for role modules that have not yet been implemented

Do not fabricate unfinished role features.

==================================================
14. HOSPITAL ADMIN SPECIAL CASE
==================================================

Hospital Admin is a controlled/provisioned role.

Do not allow a normal user to self-assign Hospital Admin simply by selecting it during onboarding.

Inspect the current role-request rules.

If Hospital Admin is already correctly protected, preserve that behavior.

If the current onboarding UI incorrectly allows unrestricted Admin requests, fix it according to the project's approved authorization architecture.

Do not introduce privilege escalation.

==================================================
15. MIDDLEWARE / ROUTE GUARDS
==================================================

Inspect the application's middleware and route guards.

Make routing state-based.

Avoid contradictory redirect logic between:

- middleware
- layout
- page
- client-side useEffect
- Clerk callbacks

There should be one clear routing policy.

Avoid redirect loops such as:

/onboarding
→ /dashboard
→ /onboarding

or:

/onboarding
→ /onboarding

or:

/login
→ /dashboard
→ /onboarding

Remove obsolete redirect paths.

==================================================
16. CLERK INTEGRATION
==================================================

Do not replace Clerk.

Inspect:

- Clerk provider
- sign-up configuration
- sign-in configuration
- callback/redirect configuration
- middleware
- session handling

Use the existing project architecture.

Do not expose Clerk secret keys.

Do not hardcode authentication credentials.

==================================================
17. ROUTE ACCESS MATRIX
==================================================

Create or verify a route-access policy similar to:

PUBLIC:
/
signup
login

ONBOARDING:
Authenticated users whose onboarding is incomplete

PENDING:
Authenticated users with pending access request

REJECTED:
Authenticated users with rejected request, according to existing workflow

ADMIN:
Approved + active Hospital Admin

DOCTOR:
Approved + active Doctor

RECEPTIONIST:
Approved + active Receptionist

NURSE:
Approved + active Nurse/Healthcare Worker

LAB:
Approved + active Lab Staff

PHARMACY:
Approved + active Pharmacist

The exact route names must follow the actual repository.

==================================================
18. UI/UX
==================================================

Do not redesign the entire application.

Preserve the existing design system.

Ensure:

- responsive mobile/desktop
- light mode
- dark mode
- English
- Hindi
- Marathi
- accessible forms
- proper loading states
- proper validation states
- proper error states

Do not hardcode English text if the project already uses i18n.

==================================================
19. ERROR HANDLING
==================================================

Handle:

- user not authenticated
- signup incomplete
- onboarding API failure
- invalid facility
- invalid role
- duplicate request
- existing pending request
- rejected request
- inactive account
- unauthorized access
- network failure

Do not show raw server errors or sensitive implementation details to users.

==================================================
20. TESTING
==================================================

After implementation, manually test at minimum:

TEST 1:
Open landing page.
Click Sign Up / Get Started.
Expected:
Signup page opens.

TEST 2:
Create a new account.
Expected:
User goes directly to /onboarding.
No /dashboard transition.

TEST 3:
Refresh onboarding.
Expected:
User remains correctly in onboarding if onboarding is incomplete.

TEST 4:
Submit facility + role request.
Expected:
Request is saved.
User enters pending state.

TEST 5:
Refresh after submitting request.
Expected:
User remains in pending state.
User is NOT treated as an approved role.

TEST 6:
Attempt to manually open a protected role route while pending.
Expected:
Access denied/redirected.

TEST 7:
Approved user logs in.
Expected:
User goes directly to their approved role destination.

TEST 8:
Rejected user logs in.
Expected:
User sees appropriate rejected/request state.

TEST 9:
Unauthenticated user manually opens /onboarding.
Expected:
User is redirected to authentication.

TEST 10:
Pending Doctor manually changes frontend/local state to Doctor.
Expected:
Doctor API/page access remains denied.

TEST 11:
Normal user attempts to obtain Hospital Admin privileges through request manipulation.
Expected:
Denied.

TEST 12:
Check browser refreshes.
Expected:
No redirect loop.

==================================================
21. SEARCH FOR OBSOLETE DASHBOARD REFERENCES
==================================================

Search the entire repository for:

/dashboard
dashboard
router.push('/dashboard')
router.replace('/dashboard')
redirect('/dashboard')
window.location
NEXT_PUBLIC_*
Clerk redirect configuration

Inspect every relevant result.

Do not blindly replace every occurrence.

Determine whether each occurrence is:

- obsolete
- valid
- documentation only
- test only
- role-specific dashboard

Remove or update obsolete references.

==================================================
22. DO NOT TOUCH OTHER DEVELOPERS' FEATURES
==================================================

You are S1.

Do not modify:

apps/web/features/receptionist/
apps/web/features/nurse/
apps/web/features/laboratory/
apps/web/features/pharmacy/

Do not implement their features.

If routing needs destinations that don't exist yet, do not build their feature modules.

Only modify shared authentication/routing infrastructure when necessary.

If a shared file must be changed, make the smallest possible change.

==================================================
23. GIT SAFETY
==================================================

Before editing:

git status

Do not:

- git reset --hard
- git clean -fd
- force push
- overwrite another developer's work

Preserve all existing work.

Make focused commits.

==================================================
24. VALIDATION
==================================================

Before declaring completion, run the project's available:

- typecheck
- lint
- tests
- build

Also run the application locally and manually verify the authentication flow.

If a command does not exist, document that rather than inventing it.

==================================================
25. PROGRESS LOG
==================================================

After completing the task, update:

agents/s1/PROGRESS.md

Add a timestamped entry containing:

- objective
- changes made
- files modified
- routes changed
- authentication/routing changes
- tests performed
- build/typecheck/lint result
- known issues
- next step

Do not erase previous progress.

==================================================
26. FINAL REPORT
==================================================

At the end, report:

1. What caused /dashboard to appear.
2. Which redirect(s) were removed.
3. How Signup → Onboarding now works.
4. How pending requests are handled.
5. How approved users are routed.
6. Whether /dashboard was removed or retained and why.
7. Files changed.
8. Tests performed.
9. Any shared files modified.
10. Any remaining blockers.

Do not claim success unless the local flow has actually been tested.

STOP if you encounter an architectural conflict that cannot be safely resolved from the existing project documentation. Record the blocker instead of guessing.