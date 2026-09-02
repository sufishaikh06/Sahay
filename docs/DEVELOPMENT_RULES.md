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
9. **Avoid unnecessary third-party dependencies**.
10. **Keep commits logically scoped and clean**.
11. **Test meaningful changes** (`npm run build`, `npm run lint`) before creating PRs.
12. **Update agent progress files** (`agents/s1/PROGRESS.md`, etc.) after every completed phase.
13. **Prefer feature-local files** to reduce merge conflicts across branches.
14. **Shared-file changes require coordination** with team members.
15. **Never claim completion without verification**.
