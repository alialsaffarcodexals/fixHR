# SECURITY

- OWASP ASVS baseline controls: authentication, session mgmt, access control, input validation, error handling.
- Helmet for HTTP headers (API and reverse proxy).
- Rate limiting via NestJS Throttler (API) and NGINX (per-IP).
- CSRF: Not applied to pure JSON APIs; if cookie-based session is enabled, CSRF token flow is activated for relevant routes.
- Input validation: class-validator/class-transformer in NestJS, Zod + React Hook Form on the frontend.
- Password hashing: Argon2id (default) with strong params; account lockout on repeated failures.
- MFA TOTP supported for users; server verifies using time-window tolerant algorithm.
- RBAC enforced in controllers and services. Roles: Admin, HRManager, DeptHead, PayrollClerk, Employee.
- Secrets strictly from environment; `.env.example` provided; never commit secrets.
- PII: address encrypted at rest using pgcrypto (optional) or app-level AES-GCM (key from env).
- Audit logs written for critical actions and payroll runs; tamper-evident via chained hashes.
- DB indexes on employeeId, departmentId, lastName, payScale; optimistic locking via `version` column and compare-and-swap updates.
