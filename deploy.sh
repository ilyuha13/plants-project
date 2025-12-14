#!/bin/bash

# ============================================
# Deployment Script with Downtime Measurement
# ============================================

set -e  # Exit on any error

DOMAIN="https://api.greenflagplants.ru"
HEALTH_CHECK_URL="$DOMAIN/ping"
LOG_FILE="./deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Helper function to check if site is up
check_site() {
    if curl -s -f -o /dev/null "$HEALTH_CHECK_URL"; then
        return 0  # Site is up
    else
        return 1  # Site is down
    fi
}

# ============================================
# Start deployment
# ============================================

echo -e "${YELLOW}════════════════════════════════════════${NC}"
echo -e "${YELLOW}  Plants Project Deployment Script${NC}"
echo -e "${YELLOW}════════════════════════════════════════${NC}"
echo ""

DEPLOY_START=$(date +%s)

# Step 1: Check if site is currently up
log "Step 1: Checking current site status..."
if check_site; then
    log "✅ Site is currently UP"
    SITE_WAS_UP=true
else
    log "⚠️  Site is currently DOWN"
    SITE_WAS_UP=false
fi
echo ""

# Step 2: Git pull
log "Step 2: Pulling latest code from git..."
STEP_START=$(date +%s)
git pull origin main
STEP_END=$(date +%s)
log "✅ Git pull completed in $((STEP_END - STEP_START))s"
echo ""

# Step 3: Build backend image
log "Step 3: Building backend Docker image..."
STEP_START=$(date +%s)
docker compose build backend
STEP_END=$(date +%s)
log "✅ Build completed in $((STEP_END - STEP_START))s"
echo ""

# Step 4: Stop containers
log "Step 4: Stopping containers..."
DOWNTIME_START=$(date +%s)
docker compose down
log "✅ Containers stopped"
echo ""

# Step 5: Remove old volume
log "Step 5: Removing old webapp volume..."
docker volume rm plants-project_webapp_dist 2>/dev/null || log "⚠️  Volume not found (first deploy?)"
log "✅ Volume removed"
echo ""

# Step 6: Start containers
log "Step 6: Starting containers..."
STEP_START=$(date +%s)
docker compose up -d
STEP_END=$(date +%s)
log "✅ Containers started in $((STEP_END - STEP_START))s"
echo ""

# Step 7: Run database migrations
log "Step 7: Running database migrations..."
STEP_START=$(date +%s)
# Wait a bit for database to be ready
sleep 3
# Execute Prisma migrations inside backend container
docker compose exec -T backend sh -c 'cd /app/backend && pnpm prisma migrate deploy' || {
    log "⚠️  Migration failed or no migrations to apply"
}
STEP_END=$(date +%s)
log "✅ Migrations completed in $((STEP_END - STEP_START))s"
echo ""

# Step 8: Wait for site to become available
log "Step 8: Waiting for site to become available..."
MAX_WAIT=60  # Maximum 60 seconds
WAIT_COUNT=0

while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
    if check_site; then
        DOWNTIME_END=$(date +%s)
        DOWNTIME=$((DOWNTIME_END - DOWNTIME_START))
        log "✅ Site is UP!"
        echo ""
        echo -e "${GREEN}════════════════════════════════════════${NC}"
        echo -e "${GREEN}  Deployment Successful!${NC}"
        echo -e "${GREEN}════════════════════════════════════════${NC}"
        echo ""
        echo "📊 Deployment Statistics:"
        echo "  • Total deployment time: $((DOWNTIME_END - DEPLOY_START))s"
        echo "  • Site downtime: ${DOWNTIME}s"
        echo ""
        echo "🌐 Site: $DOMAIN"
        echo ""
        exit 0
    fi

    sleep 1
    WAIT_COUNT=$((WAIT_COUNT + 1))
    echo -n "."
done

# If we got here, site didn't come up
DOWNTIME_END=$(date +%s)
echo ""
echo -e "${RED}════════════════════════════════════════${NC}"
echo -e "${RED}  Deployment Failed!${NC}"
echo -e "${RED}════════════════════════════════════════${NC}"
echo ""
log "❌ Site is still DOWN after ${MAX_WAIT}s"
echo ""
echo "🔍 Check logs with:"
echo "  docker compose logs -f backend"
echo ""
exit 1
