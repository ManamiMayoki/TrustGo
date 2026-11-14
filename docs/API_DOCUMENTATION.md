# TrustGo REST API Documentation

Base URL: `/api/v1`

## Standard Response Envelopes

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Invalid email address format"
      }
    ]
  }
}
```

---

## 1. Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register new Employer or Worker |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user, set refresh cookie, return access token |
| `POST` | `/api/v1/auth/logout` | Authenticated | Revoke refresh token and clear auth cookies |
| `POST` | `/api/v1/auth/refresh` | Public (Cookie) | Rotate refresh token and issue new access token |
| `GET` | `/api/v1/auth/me` | Authenticated | Fetch current authenticated user profile |
| `POST` | `/api/v1/auth/verify-email` | Public | Confirm user email address via token |
| `POST` | `/api/v1/auth/forgot-password` | Public | Send password reset token to user email |
| `POST` | `/api/v1/auth/reset-password` | Public | Reset password with valid short-lived token |

---

## 2. Employer Management Endpoints (`/api/v1/employers`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/employers` | Admin / Compliance | List verified & pending employers (Paginated) |
| `GET` | `/api/v1/employers/profile` | Employer | Fetch current authenticated employer profile |
| `PUT` | `/api/v1/employers/profile` | Employer | Update employer details |
| `POST` | `/api/v1/employers/verify` | Employer | Submit verification documents for review |
| `GET` | `/api/v1/employers/:id` | Authenticated | View public/verified employer profile |
| `PATCH` | `/api/v1/employers/:id/status` | Admin | Approve, Reject, or Suspend employer |

---

## 3. Verified Job Endpoints (`/api/v1/jobs`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/jobs` | Public | Search and filter verified jobs |
| `POST` | `/api/v1/jobs` | Verified Employer | Post new job with transparent contract terms |
| `GET` | `/api/v1/jobs/:id` | Public | Retrieve detailed job listing |
| `PUT` | `/api/v1/jobs/:id` | Employer (Owner) | Update job specifications |
| `DELETE` | `/api/v1/jobs/:id` | Employer (Owner) / Admin | Delete or archive job |
| `PATCH` | `/api/v1/jobs/:id/publish` | Employer (Owner) | Transition job status to PUBLISHED |
| `PATCH` | `/api/v1/jobs/:id/archive` | Employer (Owner) | Transition job status to ARCHIVED |
| `GET` | `/api/v1/jobs/:id/applications`| Employer (Owner) | View applicants for a specific job |

---

## 4. Worker Management Endpoints (`/api/v1/workers`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/workers/profile` | Worker | Retrieve worker profile & TTC status |
| `PUT` | `/api/v1/workers/profile` | Worker | Update skills, education, certifications |
| `POST` | `/api/v1/workers/verification` | Worker | Submit TTC certificate or identity evidence |
| `GET` | `/api/v1/workers/applications` | Worker | View user's submitted job applications |
| `GET` | `/api/v1/workers/:id` | Employer / Admin | View authorized worker candidate profile (Redacted PII) |

---

## 5. Application Pipeline Endpoints (`/api/v1/applications`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/applications` | Worker | Apply for verified job (Zero-Fee declaration verified) |
| `GET` | `/api/v1/applications` | Authenticated | List applications scoped to role (Worker/Employer/Admin) |
| `GET` | `/api/v1/applications/:id` | Authenticated | Get detailed application with status history |
| `PATCH` | `/api/v1/applications/:id/status`| Employer (Owner) / Admin | Progress candidate status (Shortlist, Offer, Contract) |
| `POST` | `/api/v1/applications/:id/documents`| Worker / Employer | Upload contract or visa documentation |

---

## 6. Escrow & Welfare Endpoints (`/api/v1/escrow`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/escrow` | Authenticated | List escrow contracts scoped to user |
| `GET` | `/api/v1/escrow/:id` | Authenticated | Retrieve specific escrow breakdown & milestones |
| `POST` | `/api/v1/escrow/:id/milestones` | Admin / Employer | Initialize or configure contract milestones |
| `PATCH` | `/api/v1/escrow/:id/verify-milestone` | Admin / Compliance | Authorize milestone release (Simulated accounting) |
| `POST` | `/api/v1/escrow/:id/day-30-checkin` | Worker | Record voluntary Bengali Day-30 welfare check-in |
| `GET` | `/api/v1/escrow/:id/history` | Authenticated | Retrieve immutable transaction & audit timeline |

---

## 7. ESG & Legal Compliance Audit Endpoints (`/api/v1/compliance`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/compliance` | Authenticated | Compliance metrics and active cases |
| `GET` | `/api/v1/compliance/audits` | Compliance / Admin | List all contract audit records |
| `GET` | `/api/v1/compliance/audits/:id`| Compliance / Admin | Get detailed audit assessment |
| `POST` | `/api/v1/compliance/audits/run`| Compliance / Admin | Run 10-point automated compliance verification |
| `GET` | `/api/v1/compliance/reports/:id/pdf`| Authenticated | Download official PDF Compliance Audit Report |
| `POST` | `/api/v1/compliance/flags` | Worker / Public | Report an employer or recruitment grievance |

---

## 8. Administrative Endpoints (`/api/v1/admin`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/admin/dashboard` | Admin / Super Admin | Real-time platform KPI metrics and counters |
| `GET` | `/api/v1/admin/users` | Admin / Super Admin | Manage platform users and assign roles |
| `PATCH` | `/api/v1/admin/users/:id/status`| Super Admin | Suspend or reactivate user accounts |
| `GET` | `/api/v1/admin/audit-logs` | Admin / Super Admin | Query immutable administrative audit trail |
| `GET` | `/api/v1/admin/employers/pending`| Admin | Retrieve pending employer verifications |
