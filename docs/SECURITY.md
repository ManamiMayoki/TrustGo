# TrustGo Cybersecurity Architecture & OWASP Alignment

TrustGo enforces defense-in-depth across the application, infrastructure, and data tiers.

## 1. OWASP Top 10 Mitigation Matrix

| OWASP Vulnerability | Risk Level | TrustGo Defense Implementation |
|---|---|---|
| **A01: Broken Access Control** | Critical | Centralized RBAC (`roleMiddleware`) + Resource Ownership validation (`ownershipMiddleware`). Prevents BOLA/IDOR by ensuring database IDs match authenticated tenant identifiers. |
| **A02: Cryptographic Failures** | Critical | Passwords hashed using `bcrypt` (work factor 12). Short-lived JWTs (15 min) signed with HMAC-SHA256. Refresh tokens cryptographically hashed (SHA-256) in storage. Sensitive cookies stored with `HttpOnly`, `Secure`, and `SameSite=Strict`. |
| **A03: Injection (NoSQL / SQL)** | High | Mongoose strict schemas reject unexpected schema attributes. Custom input sanitizers strip MongoDB query operators (`$`, `{}`). Validation layer (Zod) validates types, lengths, and regexes before queries execute. |
| **A04: Insecure Design** | High | Zero-Fee recruitment principle baked into data model. Simulated escrow architecture requires dual-step authorization. Day-30 check-in respects worker privacy with zero continuous location tracking. |
| **A05: Security Misconfiguration** | High | Helmet enforces restrictive Content Security Policy (CSP), disables `X-Powered-By`, sets `X-Content-Type-Options: nosniff`, and enforces HSTS. Nginx strips external internal headers. |
| **A06: Vulnerable Components** | Medium | Automated GitHub Actions (`security.yml`) run `npm audit`, `trufflehog`, and `trivy` filesystem vulnerability scanning. Docker base images pinned to `alpine` distributions. |
| **A07: Identification & Auth Failures** | High | Progressive login delay / brute-force protection using `express-rate-limit`. Single-use password reset tokens with 15-minute expirations. Refresh token rotation with reuse detection. |
| **A08: Software & Data Integrity** | Medium | Multi-stage Docker builds prevent development tooling leaks. MIME-type validation and file signature checks on document uploads. |
| **A09: Security Logging & Monitoring** | Medium | Centralized `AuditLog` captures user identity, IP address, user-agent, timestamp, action type, and state transitions for all sensitive operations. |
| **A10: Server-Side Request Forgery** | Medium | Document uploads restricted to local disk or trusted S3/Cloudinary endpoints. No arbitrary URL fetching from client-supplied endpoints. |

---

## 2. Authentication & Session Security Flow

1. **User Authentication:**
   - Worker or Employer submits credentials to `/api/v1/auth/login`.
   - Credentials validated against bcrypt hash.
   - If successful, server issues:
     - `accessToken` (15-minute validity, returned in JSON payload).
     - `refreshToken` (7-day validity, set in `HttpOnly`, `Secure`, `SameSite=Strict` cookie).
   - A SHA-256 hash of the `refreshToken` is saved in the database associated with the user.

2. **Refresh Token Rotation & Reuse Detection:**
   - Client requests new access token at `/api/v1/auth/refresh`.
   - Server reads refresh cookie, computes SHA-256 hash, and checks database match.
   - If token does not match active hash (reuse detected), all active sessions for the user are immediately revoked, mitigating token theft.
   - If valid, a new refresh token and access token pair are generated and rotated.

---

## 3. Worker Privacy & Data Protection Safeguards

1. **PII and Biometric Redaction:**
   - Employer portal APIs explicitly project away national ID numbers, biometric records, and personal home addresses. Employers only see TTC certified skills, language proficiencies, and verification badges.
2. **Consent-Based Welfare Verification:**
   - Day-30 welfare check-in does **not** employ continuous background geolocation tracking. Check-ins are event-driven, voluntary, and utilize voice note verification in native Bengali.
