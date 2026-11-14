# TrustGo Deployment & Operations Guide

## 1. Prerequisites
- Docker Engine 24+ & Docker Compose v2+
- Node.js 22 LTS & npm 10+
- Domain name with TLS certificate (for production)
- MongoDB 7.0 & Redis 7.2 (or managed services like MongoDB Atlas and Upstash Redis)

---

## 2. Docker Orchestration

### Development Setup (Hot Reloading)
```bash
docker compose -f docker-compose.dev.yml up --build
```
- Client accessible at: `http://localhost:5173`
- Backend API accessible at: `http://localhost:5000/api/v1`

### Production Setup
```bash
# 1. Create environment configuration
cp .env.example .env
# Edit .env with production credentials

# 2. Build and launch production containers
docker compose up --build -d

# 3. Check health status
docker compose ps
docker compose logs -f

# 4. Access containers
docker compose exec server sh
docker compose exec mongo mongosh
```

---

## 3. Health Checks & Monitoring

The Express server includes a dedicated health probe:
```
GET /api/v1/health
```
Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-11-14T16:00:00.000Z",
  "uptime": 1420.5,
  "database": "connected",
  "redis": "connected",
  "version": "1.0.0"
}
```
