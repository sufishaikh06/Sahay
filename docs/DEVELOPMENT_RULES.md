# HealthBridge — Development & Collaboration Rules

## Core Rules

1. **Never commit secrets** (Clerk secret keys, MongoDB URIs, Supabase service keys). Always use `.env.local` or environment variables.
2. **Never work directly on `main`** for feature development after the common foundation is merged.
3. **Always check `git status`** before editing code.
4. **Do not overwrite another developer's uncommitted work**.
5. **Do not modify another developer's owned feature folder** without prior agreement.
6. **Do not silently change shared API contracts** (`docs/API_CONTRACT.md`).
7. **Do not silently change shared database schema conventions** (`docs/DATABASE_SCHEMA.md`).
8. **Reuse existing shared components** from `@healthbridge/ui` rather than creating duplicates.
9. **Never use `requestedRole` for authorization**. Authorization must strictly use `approvedRole` and `status === "active"`.
10. **Users must NEVER be able to set their own `approvedRole` or `status`**. All approval actions must be executed server-side by an authorized Hospital Admin.
11. **Avoid unnecessary third-party dependencies**.
12. **Keep commits logically scoped and clean**.
13. **Test meaningful changes** (`npm run build`, `npm run lint`) before creating PRs.
14. **Update agent progress files** (`agents/s1/PROGRESS.md`, etc.) after every completed phase.
15. **Prefer feature-local files** to reduce merge conflicts across branches.
16. **Shared-file changes require coordination** with team members.
17. **Never claim completion without verification**.
