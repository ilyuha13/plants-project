#!/bin/bash

# ============================================
# Helper Script to Prepare Kubernetes Secrets
# ============================================
# This script will:
# 1. Read your .env file
# 2. Base64 encode the values
# 3. Create a ready-to-apply secrets.yaml
# ============================================

set -e

if [ ! -f "../.env" ]; then
    echo "Error: .env file not found in project root"
    echo "Please create .env file with your secrets first"
    exit 1
fi

# Load .env file
source ../.env

# Function to base64 encode
b64() {
    echo -n "$1" | base64
}

# Create secrets yaml
cat > 01-secrets-filled.yaml <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: plants-secrets
  namespace: plants
type: Opaque
data:
  # PostgreSQL
  POSTGRES_PASSWORD: $(b64 "$POSTGRES_PASSWORD")

  # JWT & Auth
  JWT_SECRET: $(b64 "$JWT_SECRET")
  PASSWORD_SALT: $(b64 "$PASSWORD_SALT")

  # Cloudinary
  CLOUDINARY_CLOUD_NAME: $(b64 "$CLOUDINARY_CLOUD_NAME")
  CLOUDINARY_API_KEY: $(b64 "$CLOUDINARY_API_KEY")
  CLOUDINARY_API_SECRET: $(b64 "$CLOUDINARY_API_SECRET")

  # Telegram
  TELEGRAM_BOT_TOKEN: $(b64 "$TELEGRAM_BOT_TOKEN")
  TELEGRAM_BOT_USERNAME: $(b64 "$TELEGRAM_BOT_USERNAME")
  TELEGRAM_ADMIN_CHAT_ID: $(b64 "$TELEGRAM_ADMIN_CHAT_ID")

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: plants-config
  namespace: plants
data:
  POSTGRES_DB: ${POSTGRES_DB:-plants_db}
  POSTGRES_USER: ${POSTGRES_USER:-plants_user}
  NODE_ENV: production
  HOST_ENV: production
  PORT: "3000"
EOF

echo "✅ Created 01-secrets-filled.yaml"
echo ""
echo "⚠️  WARNING: This file contains sensitive data!"
echo "   Do NOT commit it to git!"
echo ""
echo "Next steps:"
echo "1. Review the file: cat 01-secrets-filled.yaml"
echo "2. Apply to cluster: kubectl apply -f 01-secrets-filled.yaml"
echo "3. Delete the file: rm 01-secrets-filled.yaml"
