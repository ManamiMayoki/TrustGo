# TrustGo — Know Your Right

> **An ethical cross-border recruitment and migrant worker legal-compliance B2B SaaS platform connecting verified international employers from GCC countries, Europe, and East Asia with Bangladeshi workers.**

[![CI Pipeline](https://github.com/ManamiMayoki/TrustGo/actions/workflows/ci.yml/badge.svg)](https://github.com/ManamiMayoki/TrustGo/actions/workflows/ci.yml)
[![Security Scan](https://github.com/ManamiMayoki/TrustGo/actions/workflows/security.yml/badge.svg)](https://github.com/ManamiMayoki/TrustGo/actions/workflows/security.yml)
[![License: UNLICENSED](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

---

## 🌟 Core Value Proposition

- **Strict Zero-Fee Recruitment for Workers:** Migrant workers never pay recruitment or placement fees through TrustGo.
- **Verified International Employers:** Rigid multi-tier verification ensuring legitimate employers from UAE, Saudi Arabia, Poland, Japan, and beyond.
- **Transparent Employment Contracts:** Full disclosure of salary, working hours, overtime policy, housing, and healthcare before departure.
- **Milestone-Based Escrow Tracking:** Multi-stage simulated escrow protecting workers through:
  - **Milestone 1 (30%):** Visa Verified.
  - **Milestone 2 (30%):** Safe Arrival & Worker Confirmation of Passport Possession.
  - **Milestone 3 (40%):** Day-30 Post-Arrival Welfare Check-In (voluntary Bengali voice check-in).
- **ESG & Legal Compliance Audit Generator:** Automated 10-point audit generating institutional PDF compliance reports for international supply chains.

---

## 🛠 Technology Stack

### Frontend
- **Framework & Build:** React 19, Vite
- **Styling:** Tailwind CSS, PostCSS, Lucide Icons
- **3D & Visualization:** Three.js, React Three Fiber, React Three Drei
- **Animation:** GSAP, GSAP ScrollTrigger
- **State & Routing:** TanStack Query, React Router DOM, React Context
- **Forms & Validation:** React Hook Form, Zod

### Backend
- **Runtime & Framework:** Node.js 22 LTS, Express.js (Strict MVC Architecture)
- **Database & Cache:** MongoDB 7.0, Mongoose ODM, Redis 7.2
- **Security & Auth:** JWT (short-lived access + rotated refresh tokens), bcrypt, Helmet, CORS, express-rate-limit
- **Document & PDF:** Multer, PDFKit for ESG compliance reports
- **Realtime:** Socket.IO

### DevOps & Infrastructure
- **Containerization:** Docker (Multi-stage builds, non-root users), Docker Compose
- **Web Server & Reverse Proxy:** Nginx with Gzip compression and rate limiting
- **CI/CD Automation:** GitHub Actions (`ci.yml`, `security.yml`, `test.yml`, `deploy.yml`)
- **Testing:** Jest, Supertest, MongoDB Memory Server, React Testing Library, Playwright

---

## 📂 Project Structure (Strict MVC)

```text
TrustGo/
├── client/                     # React Frontend SPA
│   ├── public/                 # Static assets & 3D models
│   ├── src/
│   │   ├── components/         # Atomic UI (common, dashboard, jobs, escrow, compliance)
│   │   ├── pages/              # Routed pages (Home, Auth, Employer, Worker, Admin, Jobs, Escrow, Compliance)
│   │   ├── three/              # Three.js 3D Globe & Corridor Arcs
│   │   ├── animations/         # GSAP ScrollTrigger Timelines
│   │   ├── contexts/           # Auth and Socket providers
│   │   ├── services/           # Axios API connectors
│   │   └── validation/         # Zod schemas
│   ├── Dockerfile
│   └── nginx.conf
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/             # DB, CORS, Environment setup
│   │   ├── models/             # Mongoose Schemas (User, Employer, Worker, Job, Escrow, Audit)
│   │   ├── controllers/        # Request handling & envelope formatting
│   │   ├── services/           # Business logic & compliance engines
│   │   ├── routes/             # REST API endpoint definitions
│   │   ├── middlewares/        # Auth, RBAC, Ownership, Rate-limiting, Error handling
│   │   ├── validators/         # Zod request validators
│   │   └── templates/          # PDF audit report templates
│   ├── tests/                  # Unit, Integration, and OWASP Security test suites
│   └── Dockerfile
│
├── infrastructure/             # Nginx reverse proxy configs & scripts
├── .github/workflows/          # CI, Security, Test, and Deploy pipelines
├── docs/                       # Comprehensive technical documentation
├── docker-compose.yml          # Production container orchestration
└── docker-compose.dev.yml      # Local development container orchestration
```

---

## 🚀 Quick Start Guide

### 1. Local Prerequisites
- Node.js >= 20
- npm >= 10
- MongoDB instance running on `localhost:27017`
- Redis instance running on `localhost:6379` (optional, falls back gracefully)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/ManamiMayoki/TrustGo.git
cd TrustGo

# Install root, backend, and frontend dependencies
npm run install:all
```

### 3. Environment Setup
```bash
cp .env.example .env
cp .env.example server/.env
```

### 4. Running the Development Server
```bash
# Start backend (port 5000) and frontend (port 5173) concurrently
npm run dev
```

### 5. Running with Docker Compose
```bash
# Build and run all services (MongoDB, Redis, Backend, Frontend, Nginx proxy)
docker compose up --build -d

# View live logs
docker compose logs -f

# Teardown
docker compose down
```

---

## 🧪 Testing

```bash
# Run all tests across server and client
npm run test

# Run backend unit and integration tests
npm run test:server

# Run dedicated OWASP security test suite
npm run test:security
```

---

## 📚 Technical Documentation

- [System Architecture](docs/ARCHITECTURE.md)
- [Database Schema & ERD](docs/DATABASE_SCHEMA.md)
- [REST API Documentation](docs/API_DOCUMENTATION.md)
- [Cybersecurity & OWASP Mitigation](docs/SECURITY.md)
- [Automated Testing Strategy](docs/TESTING.md)
- [Deployment & Operations](docs/DEPLOYMENT.md)
- [Development Progress Log](docs/DEVELOPMENT_LOG.md)

---

## 🛡️ License & Legal Disclaimer
Copyright © 2026 TrustGo Platform. All rights reserved.
*Note: The milestone escrow system is implemented as a simulated legal and milestone accounting ledger. Live fund custody requires integration with a licensed escrow bank or authorized payment institution.*
