#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="docker/docker-compose.yml"
MAX_WAIT=120
HEALTH_ENDPOINT="http://localhost:5000/api/health"
LOG_FILE="deploy-$(date +%Y%m%d-%H%M%S).log"

log() {
  local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
  echo "$msg" | tee -a "$LOG_FILE"
}

rollback() {
  log "ERROR: Deployment failed. Rolling back..."
  if docker compose -f "$COMPOSE_FILE" ps --status running | grep -q "atin-backend"; then
    docker compose -f "$COMPOSE_FILE" down
  fi
  if git rev-parse --verify HEAD@{1} >/dev/null 2>&1; then
    git checkout HEAD@{1} --quiet
    docker compose -f "$COMPOSE_FILE" build backend frontend
    docker compose -f "$COMPOSE_FILE" up -d
    log "Rollback completed."
  else
    log "ERROR: No previous commit to rollback to."
  fi
  exit 1
}

health_check() {
  log "Waiting for backend to become healthy..."
  local elapsed=0
  while [ $elapsed -lt $MAX_WAIT ]; do
    if curl -sf "$HEALTH_ENDPOINT" > /dev/null 2>&1; then
      log "Backend is healthy after ${elapsed}s."
      return 0
    fi
    sleep 3
    elapsed=$((elapsed + 3))
  done
  log "ERROR: Backend failed health check after ${MAX_WAIT}s."
  return 1
}

main() {
  log "=== Deployment started ==="

  log "Pulling latest code from git..."
  git pull origin main --ff-only

  COMMIT=$(git rev-parse --short HEAD)
  log "Deploying commit: $COMMIT"

  trap rollback ERR

  log "Building Docker images..."
  docker compose -f "$COMPOSE_FILE" build --no-cache

  log "Starting services..."
  docker compose -f "$COMPOSE_FILE" up -d

  if ! health_check; then
    rollback
  fi

  log "Pruning old Docker images..."
  docker image prune -f --filter "until=72h" > /dev/null 2>&1 || true

  trap - ERR

  log "=== Deployment completed successfully (commit: $COMPLOY) ==="
}

main "$@"
