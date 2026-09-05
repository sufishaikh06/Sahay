# TEAM_OWNERSHIP_MATRIX.md

## HealthBridge — SIH 2026 Problem ID 26133

| Developer | Roles | Branch |
|---|---|---|
| S1 | Hospital Admin + Doctor | `feature/s1-admin-doctor` |
| S2 | Receptionist + Nurse | `feature/s2-receptionist-nurse` |
| S3 | Lab Staff + Pharmacist | `feature/s3-lab-pharmacy` |

## Frontend ownership
| Directory | Owner |
|---|---|
| `apps/web/features/admin/` | S1 |
| `apps/web/features/doctor/` | S1 |
| `apps/web/features/receptionist/` | S2 |
| `apps/web/features/nurse/` | S2 |
| `apps/web/features/laboratory/` | S3 |
| `apps/web/features/pharmacy/` | S3 |

## Backend primary responsibility
**S1:** role-request approval, staff/facility administration, consultations, referrals, diagnostic ordering, prescriptions/clinical actions.

**S2:** patient registration/check-in, appointments, queue, triage, vitals, nursing observations.

**S3:** lab processing/results, prescription processing, medicine availability and dispensing.

## Shared-domain coordination
| Domain | Primary owner | Other roles |
|---|---|---|
| User / Role Request | S1 | S2/S3 consume |
| Facility | S1 | S2/S3 consume |
| Patient | Shared contract; coordinate before changes | All consume |
| Appointment | S2 | S1/S3 consume |
| Queue | S2 | S1/S3 consume |
| Consultation | S1 | S2/S3 consume where needed |
| Referral | S1 | S2/S3 consume |
| Diagnostics | S3 for lab processing; S1 for doctor ordering | S2 consumes |
| Pharmacy | S3 | S1 consumes for prescriptions |

## Cross-role handoffs
1. S2 registers patient → canonical patient record.
2. S2 records triage/vitals → S1 doctor reads it.
3. S1 creates diagnostic order → S3 lab processes it.
4. S3 records result → S1 doctor reviews it.
5. S1 creates prescription → S3 pharmacy processes/dispenses it.

## High-risk shared areas
Coordinate before changing:
`packages/types/`, `packages/validation/`, `packages/ui/`, `packages/config/`, `docs/API_CONTRACT.md`, `docs/DATABASE_SCHEMA.md`, auth middleware, root configuration.

## Golden rule
If multiple roles use the same data, there must be one canonical source. Never create role-specific duplicate patient, appointment, consultation or other shared records.
