# ATIN Deployment Guide

## Prerequisites

- **Node.js** 22.x or later
- **MongoDB** 7.x
- **Redis** 7.x
- **Docker** 24.x+ and Docker Compose v2+ (for containerized deployment)
- **Git**

---

## Environment Setup

Clone the repository:

```bash
git clone https://github.com/your-org/atin.git
cd atin
```

### Environment Variables

Copy the example env file:

```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | `development`, `production`, `test` |
| `PORT` | No | `5000` | Backend server port |
| `MONGODB_URI` | Yes | — | MongoDB connection string |
| `MONGODB_DATABASE` | No | `atin` | Database name |
| `REDIS_URL` | No | — | Redis connection string |
| `JWT_SECRET` | Yes | — | Secret for signing JWTs |
| `JWT_REFRESH_SECRET` | Yes | — | Secret for refresh tokens |
| `JWT_EXPIRES_IN` | No | `1h` | Access token lifetime |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Refresh token lifetime |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Allowed CORS origin |
| `NEWS_API_KEY` | No | — | External news API key |
| `LOG_LEVEL` | No | `info` | Logging level (`debug`, `info`, `warn`, `error`) |
| `MONGO_ROOT_USER` | No | `admin` | MongoDB root username (Docker) |
| `MONGO_ROOT_PASSWORD` | No | `password123` | MongoDB root password (Docker) |
| `REDIS_PASSWORD` | No | `redispass123` | Redis password (Docker) |
| `BACKUP_DIR` | No | `./backups` | Backup output directory |
| `BACKUP_RETENTION_DAYS` | No | `30` | Days to keep backups |

---

## Docker Deployment (Recommended)

### Quick Start

```bash
docker compose -f docker/docker-compose.yml up -d
```

This starts all services: MongoDB, Redis, backend, and frontend.

### Building

```bash
docker compose -f docker/docker-compose.yml build
```

### Viewing Logs

```bash
docker compose -f docker/docker-compose.yml logs -f backend
docker compose -f docker/docker-compose.yml logs -f frontend
```

### Stopping Services

```bash
docker compose -f docker/docker-compose.yml down
```

### Database Seeding

```bash
docker compose -f docker/docker-compose.yml exec backend node scripts/seedDatabase.js
```

### Database Backup

```bash
docker compose -f docker/docker-compose.yml exec backend node scripts/backupDatabase.js
```

---

## Manual Deployment

### 1. Install Dependencies

```bash
# Backend
cd backend && npm ci

# Frontend
cd frontend && npm ci
```

### 2. Start MongoDB and Redis

Ensure MongoDB and Redis are running locally or set connection URIs in `.env`.

### 3. Seed the Database (optional)

```bash
node scripts/seedDatabase.js
```

### 4. Build the Frontend

```bash
cd frontend && npm run build
```

### 5. Start the Backend

```bash
cd backend && node src/server.js
```

### 6. Serve Frontend with Nginx

Point Nginx to serve `frontend/dist` and proxy `/api` to `localhost:5000`.

---

## Production Considerations

### Security

- Use strong, unique values for `JWT_SECRET` and `JWT_REFRESH_SECRET`
- Enable HTTPS via a reverse proxy (Nginx/Caddy/LB)
- Run MongoDB and Redis with authentication enabled
- Use non-root containers (already configured in Dockerfiles)
- Restrict CORS to your production domain

### Performance

- Enable Redis caching for hot data (sessions, frequently accessed queries)
- Use MongoDB indexes (created automatically in seed script)
- Configure Nginx gzip and static asset caching (configured in nginx.conf)
- Use a process manager (PM2) if running Node.js outside Docker

### Monitoring

- Health endpoint: `GET /api/health`
- Enable structured JSON logging in production
- Monitor container resource usage with `docker stats`
- Set up alerts for health check failures

### Backup Strategy

Run `scripts/backupDatabase.js` on a cron schedule:

```bash
0 2 * * * node /path/to/scripts/backupDatabase.js --retention 30
```

### Scaling

- Horizontal: run multiple backend replicas behind a load balancer
- Vertical: increase container CPU/memory limits
- Database: use MongoDB replica sets for high availability
- Cache: use Redis Sentinel or Redis Cluster

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Backend won't start | Check MongoDB/Redis connectivity, verify env vars |
| Port conflicts | Change ports in docker-compose.yml or .env |
| Authentication errors | Verify JWT_SECRET is set and consistent |
| Stale containers | Run `docker compose down -v` then `up -d` |
| Backup failures | Check disk space, verify mongodump is available |
