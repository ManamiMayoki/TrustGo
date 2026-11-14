# TrustGo Automated Testing Framework

TrustGo incorporates a multi-tier testing strategy encompassing Unit, Integration, Security, and End-to-End tests.

## 1. Test Architecture Overview

- **Test Runner:** Jest
- **API Integration Testing:** Supertest
- **In-Memory Database:** MongoDB Memory Server (`mongodb-memory-server`) for fast, isolated test runs without external dependencies.
- **Frontend Component Tests:** React Testing Library + Vitest / Jest.
- **E2E Browser Automation:** Playwright.

---

## 2. Test Execution Commands

### Run Full Test Suite
```bash
npm run test
```

### Run Backend Unit & Integration Tests
```bash
npm run test:server
```

### Run Dedicated OWASP Security Test Suite
```bash
npm run test:security
```

### Run Frontend Component Tests
```bash
npm run test:client
```

---

## 3. Dedicated Security Test Matrix (`server/tests/security/`)

| Test Suite | Purpose & Payload |
|---|---|
| `nosql_injection.test.js` | Sends MongoDB operator objects (`{ "$gt": "" }`, `{ "$ne": null }`) in login and search parameters; asserts that payloads are sanitized or rejected. |
| `authentication.test.js` | Asserts rejection of expired, forged, or missing JWTs; verifies refresh-token rotation and reuse detection. |
| `authorization_idor.test.js`| Validates that Employer A cannot edit Employer B's job postings; validates that Worker A cannot view Worker B's application details. |
| `rate_limiting.test.js` | Dispatches rapid-fire requests to `/api/v1/auth/login` exceeding threshold; asserts HTTP 429 Too Many Requests response. |
| `security_headers.test.js` | Asserts presence of Helmet security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`). |
| `file_upload_security.test.js`| Attempts uploading executable `.sh` or `.exe` files disguised as PDFs; asserts rejection based on MIME type and signature verification. |
