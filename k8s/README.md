# Kubernetes Deployment for Plants Project

This directory contains Kubernetes manifests for deploying Plants Project to k3s.

## Prerequisites

- k3s installed on VPS (see `../k8s-setup.sh`)
- kubectl configured to connect to your cluster
- Docker image built and pushed to registry

## Deployment Steps

### 1. Install k3s on VPS

```bash
# On your VPS
ssh root@your-vps
cd /root/plants-project
bash k8s-setup.sh
```

### 2. Download kubeconfig to local machine

```bash
# On your local machine
scp root@your-vps:/root/kubeconfig.yaml ~/.kube/plants-k3s.yaml
export KUBECONFIG=~/.kube/plants-k3s.yaml

# Test connection
kubectl get nodes
```

### 3. Build and push Docker image

```bash
# Build backend image
docker build -t ghcr.io/YOUR_GITHUB_USERNAME/plants-backend:latest .

# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Push image
docker push ghcr.io/YOUR_GITHUB_USERNAME/plants-backend:latest
```

**Important:** Update `k8s/03-backend.yaml` line 36 with your GitHub username!

### 4. Prepare secrets

```bash
cd k8s/

# Option A: Use helper script (recommended)
bash prepare-secrets.sh
# This creates 01-secrets-filled.yaml from your .env file

# Option B: Manually edit 01-secrets.yaml
# Base64 encode each secret:
echo -n "your-secret-value" | base64
# Then paste into 01-secrets.yaml
```

### 5. Update cert-issuer email

Edit `k8s/05-cert-issuer.yaml` and replace `your-email@example.com` with your email.

### 6. Apply manifests

```bash
# Apply in order (numbered files)
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-secrets-filled.yaml  # or 01-secrets.yaml if edited manually
kubectl apply -f 02-postgres.yaml
kubectl apply -f 05-cert-issuer.yaml

# Wait for PostgreSQL to be ready
kubectl wait --for=condition=Ready pod -l app=postgres -n plants --timeout=120s

# Apply backend
kubectl apply -f 03-backend.yaml

# Wait for backend to be ready
kubectl wait --for=condition=Available deployment/backend -n plants --timeout=180s

# Run database migrations
kubectl exec -it deployment/backend -n plants -- sh -c "cd /app/backend && pnpm prisma migrate deploy"

# Apply ingress (this will trigger cert-manager to create SSL certificate)
kubectl apply -f 04-ingress.yaml
```

### 7. Wait for SSL certificate

```bash
# Check certificate status
kubectl get certificate -n plants
kubectl describe certificate plants-tls -n plants

# Wait for it to be Ready (can take 2-3 minutes)
kubectl wait --for=condition=Ready certificate/plants-tls -n plants --timeout=300s
```

### 8. Verify deployment

```bash
# Check all resources
kubectl get all -n plants

# Check pods
kubectl get pods -n plants

# Check logs
kubectl logs -f deployment/backend -n plants

# Test API
curl https://api.greenflagplants.ru/ping
# Should return: pong

# Test frontend
curl https://greenflagplants.ru
# Should return HTML
```

## Updating the Application

### Manual update

```bash
# Build and push new image
docker build -t ghcr.io/YOUR_GITHUB_USERNAME/plants-backend:$(git rev-parse --short HEAD) .
docker push ghcr.io/YOUR_GITHUB_USERNAME/plants-backend:$(git rev-parse --short HEAD)

# Update deployment
kubectl set image deployment/backend backend=ghcr.io/YOUR_GITHUB_USERNAME/plants-backend:$(git rev-parse --short HEAD) -n plants

# Watch rollout
kubectl rollout status deployment/backend -n plants
```

### Automated update with GitHub Actions

See `.github/workflows/deploy.yml` (created separately)

## Useful Commands

```bash
# Get all resources in plants namespace
kubectl get all -n plants

# View logs
kubectl logs -f deployment/backend -n plants
kubectl logs -f -l app=postgres -n plants

# Exec into pod
kubectl exec -it deployment/backend -n plants -- sh

# Scale replicas
kubectl scale deployment/backend --replicas=3 -n plants

# Rollback deployment
kubectl rollout undo deployment/backend -n plants

# Delete everything
kubectl delete namespace plants
```

## Zero-Downtime Deployment

Kubernetes automatically does rolling updates:

1. Creates new pod with new image
2. Waits for new pod to be Ready (readinessProbe passes)
3. Starts routing traffic to new pod
4. Terminates old pod

With 2 replicas, you always have at least 1 pod running!

## Troubleshooting

### Pod not starting

```bash
kubectl describe pod <pod-name> -n plants
kubectl logs <pod-name> -n plants
```

### SSL certificate not issuing

```bash
kubectl describe certificate plants-tls -n plants
kubectl describe certificaterequest -n plants
kubectl logs -n cert-manager deployment/cert-manager
```

### Database connection issues

```bash
# Check if PostgreSQL is ready
kubectl get pods -n plants -l app=postgres

# Test connection from backend pod
kubectl exec -it deployment/backend -n plants -- sh
# Inside pod:
psql $DATABASE_URL -c "SELECT 1"
```

### Ingress not routing traffic

```bash
kubectl get ingress -n plants
kubectl describe ingress plants-ingress -n plants

# Check nginx-ingress logs
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller
```
