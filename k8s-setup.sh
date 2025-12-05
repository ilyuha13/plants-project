#!/bin/bash

# ============================================
# k3s Installation Script for Plants Project
# ============================================
# Run this on your VPS to install k3s
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}════════════════════════════════════════${NC}"
echo -e "${YELLOW}  k3s Installation for Plants Project${NC}"
echo -e "${YELLOW}════════════════════════════════════════${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root (use sudo)${NC}"
  exit 1
fi

# Stop and remove old docker-compose setup
echo "Step 1: Stopping old Docker Compose setup..."
cd /root/plants-project
docker compose down || true
echo -e "${GREEN}✅ Old setup stopped${NC}"
echo ""

# Install k3s
echo "Step 2: Installing k3s..."
curl -sfL https://get.k3s.io | sh -s - \
  --write-kubeconfig-mode 644 \
  --disable traefik
# We disable Traefik because we'll use nginx-ingress for better compatibility

echo -e "${GREEN}✅ k3s installed${NC}"
echo ""

# Wait for k3s to be ready
echo "Step 3: Waiting for k3s to be ready..."
sleep 10
kubectl wait --for=condition=Ready nodes --all --timeout=60s

echo -e "${GREEN}✅ k3s is ready${NC}"
echo ""

# Install nginx-ingress controller
echo "Step 4: Installing nginx-ingress controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml

echo -e "${GREEN}✅ Nginx Ingress installed${NC}"
echo ""

# Install cert-manager for automatic SSL
echo "Step 5: Installing cert-manager..."
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.3/cert-manager.yaml

echo -e "${GREEN}✅ cert-manager installed${NC}"
echo ""

# Wait for cert-manager to be ready
echo "Step 6: Waiting for cert-manager to be ready..."
sleep 20
kubectl wait --for=condition=Available --timeout=300s \
  deployment/cert-manager \
  deployment/cert-manager-webhook \
  deployment/cert-manager-cainjector \
  -n cert-manager

echo -e "${GREEN}✅ cert-manager is ready${NC}"
echo ""

# Copy kubeconfig for remote access
echo "Step 7: Preparing kubeconfig for remote access..."
cp /etc/rancher/k3s/k3s.yaml /root/kubeconfig.yaml
# Replace localhost with actual IP
SERVER_IP=$(curl -s ifconfig.me)
sed -i "s/127.0.0.1/$SERVER_IP/g" /root/kubeconfig.yaml

echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}  k3s Installation Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Download kubeconfig to your local machine:"
echo "   scp root@$SERVER_IP:/root/kubeconfig.yaml ~/.kube/plants-k3s.yaml"
echo ""
echo "2. Set KUBECONFIG environment variable:"
echo "   export KUBECONFIG=~/.kube/plants-k3s.yaml"
echo ""
echo "3. Test connection from local machine:"
echo "   kubectl get nodes"
echo ""
echo "4. Apply Kubernetes manifests from k8s/ directory"
echo ""
