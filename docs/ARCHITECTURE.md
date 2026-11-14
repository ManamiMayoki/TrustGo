# TrustGo System Architecture

## 1. Architectural Philosophy
TrustGo is designed as a production-grade, secure, multi-tier B2B SaaS platform for ethical cross-border recruitment and legal compliance. The system strictly adheres to the principle of **Zero-Fee Recruitment for Migrant Workers** and guarantees end-to-end transparency, auditability, and worker welfare.

The architecture follows a strict **Model-View-Controller (MVC)** and **Service-Oriented Layered Pattern** on the backend, paired with an enterprise-ready single-page application (SPA) on the frontend.

```
                           +-------------------------+
                           |   Client Browser (SPA)  |
                           | React 19 + Three.js     |
                           | GSAP + Tailwind CSS     |
                           +------------+------------+
                                        | HTTPS / WSS
                                        v
                           +-------------------------+
                           |   Reverse Proxy (Nginx) |
                           | TLS Termination         |
                           | Rate Limiting & Headers |
                           +------------+------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v /api/*                                      v /
    +-------------------------+                   +-------------------------+
    |  Express Backend Server |                   | Static Asset Server     |
    | (Node.js 22 LTS)        |                   | (Nginx Alpine)          |
    +------------+------------+                   +-------------------------+
                 |
    +------------+--------------------------+
    |                                       |
    v                                       v
+-------------------------+     +-------------------------+
|   MongoDB Database      |     |   Redis Cache & Store   |
| Mongoose ODM            |     | Session & Rate Limiting |
| Multi-Document Trans.   |     +-------------------------+
+-------------------------+
```

---

## 2. Backend Layered Architecture (Strict MVC)

The Express backend strictly isolates concerns across discrete layers:

```
[ Incoming Request ]
         |
         v
[ Middleware Layer ]
   - Helmet Security Headers & CORS Allowlist
   - Global & Endpoint Rate Limiters
   - Input Sanitization & JSON Parsing
   - Authentication (JWT verification & refresh rotation)
   - Role-Based Access Control (RBAC) & Ownership Verification
         |
         v
[ Route Layer (src/routes/) ]
   - Defines HTTP endpoints, HTTP verbs, and URI mappings
   - Attaches validation middleware (Zod schemas)
   - Attaches controller methods
         |
         v
[ Controller Layer (src/controllers/) ]
   - Validates request payload structure
   - Extracts parameters and passes them to the Service Layer
   - Formats uniform API response: { success, message, data, meta }
   - Never contains direct database queries or raw business rules
         |
         v
[ Service Layer (src/services/) ]
   - Executes core domain business logic
   - Coordinates database transactions (Mongoose sessions)
   - Computes compliance scores and milestone eligibility
   - Generates cryptographically secure tokens and PDF audit reports
   - Dispatches real-time WebSocket events
         |
         v
[ Data Access Layer (src/models/) ]
   - Mongoose Schemas with strict field validation
   - Compound indexes, uniqueness constraints, and foreign key references
   - Pre/post lifecycle hooks and schema methods
```

---

## 3. Frontend Architecture

The frontend is structured modularly:

- **Component Hierarchy:**
  - `components/common/`: Reusable atomic UI elements (Buttons, Badges, Modals, Forms, Alerts).
  - `components/layout/`: Global Navigation bar, Footers, Sidebar, and Breadcrumbs.
  - `components/dashboard/`: Reusable metric cards, statistics widgets, and activity feeds.
  - `components/jobs/`: Job cards, filtering toolbars, application status steppers.
  - `components/escrow/`: Visual milestone progress trackers, transaction tables.
  - `components/compliance/`: ESG compliance scorecards, audit checklists, PDF previewers.
- **State Management:**
  - **Server State:** TanStack Query (`@tanstack/react-query`) handles query caching, background revalidation, and optimistic updates.
  - **Client & Auth State:** React Context API (`AuthContext`, `SocketContext`) manages session tokens, user roles, and live notifications.
- **3D & Animation Layer:**
  - **Three.js & React Three Fiber:** Renders an interactive 3D Globe with recruitment corridors connecting Bangladesh to UAE (Dubai), Saudi Arabia (Riyadh), Poland (Warsaw), and Japan (Tokyo).
  - **GSAP & ScrollTrigger:** Animates staggered entry headlines, recruitment pipeline comparisons, and responsive storytelling transitions.

---

## 4. Key Security & Compliance Mechanisms

1. **Defense-in-Depth Authentication:** Short-lived access JWTs (15 min) + Refresh token rotation with cryptographic SHA-256 token hashing in the database.
2. **Object-Level Authorization (BOLA/IDOR Defense):** Ownership middleware guarantees that employers only manipulate their respective jobs, candidates only inspect their applications, and only certified admins can alter verification statuses.
3. **Simulated Escrow Financial Architecture:**
   - 30% Milestone 1: Visa verified.
   - 30% Milestone 2: Safe arrival and passport possession confirmed by worker.
   - 40% Milestone 3: Day-30 welfare check-in confirmed via Bengali voice note check-in.
   - Double-release prevention enforced via idempotency keys and transactional locking.
4. **Auditability:** Every compliance modification, milestone release, and administrative action triggers an immutable `AuditLog` entry.
