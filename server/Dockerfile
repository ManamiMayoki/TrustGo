# Multi-stage Dockerfile for TrustGo Express Backend

# 1. Base Stage
FROM node:22-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache curl

# 2. Dependencies Stage
FROM base AS dependencies
COPY package*.json ./
RUN npm ci --only=production
RUN cp -R node_modules prod_node_modules
RUN npm ci

# 3. Production Stage
FROM base AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Create non-root user for security
RUN addgroup -S trustgo && adduser -S -G trustgo trustgo

COPY --from=dependencies /usr/src/app/prod_node_modules ./node_modules
COPY package*.json ./
COPY src/ ./src/

# Ensure uploads directory exists and is owned by trustgo user
RUN mkdir -p uploads && chown -R trustgo:trustgo /usr/src/app

USER trustgo

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/v1/health || exit 1

CMD ["node", "src/server.js"]
