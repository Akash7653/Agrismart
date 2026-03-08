# AgriSmart Production Deployment Guide

## Overview

This guide covers deploying AgriSmart to production environments using Docker, Kubernetes, and cloud platforms.

---

## Table of Contents

1. [Local Docker Setup](#local-docker-setup)
2. [Cloud Deployment](#cloud-deployment)
3. [Kubernetes Deployment](#kubernetes-deployment)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Monitoring & Logging](#monitoring--logging)
6. [Security Best Practices](#security-best-practices)
7. [Performance Optimization](#performance-optimization)

---

## Local Docker Setup

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 8GB RAM minimum
- 20GB disk space

### Quick Start

```bash
# 1. Clone repository
git clone <repository-url>
cd AgriSmart

# 2. Create environment file
cp .env.example .env

# 3. Update .env with your configuration
nano .env

# 4. Build and start all services
docker-compose up -d --build

# 5. Check status
docker-compose ps

# 6. View logs
docker-compose logs -f backend
docker-compose logs -f ml-service
```

### Accessing Services

- **Frontend**: http://localhost
- **Backend API**: http://localhost:4000
- **ML Service**: http://localhost:8000
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

---

## Cloud Deployment

### Deploy to Vercel (Frontend)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Configure environment variables in Vercel dashboard
# VITE_API_URL=https://api.yourdomain.com
# VITE_ML_URL=https://ml.yourdomain.com

# 4. Deploy
cd frontend
vercel --prod
```

### Deploy to Railway (Backend)

```bash
# 1. Create Railway account
# 2. Connect GitHub repository
# 3. Add services:
#    - Node.js (Backend)
#    - Python (ML Service)
#    - MongoDB
#    - Redis

# 4. Configure environment variables in Railway dashboard

# 5. Deploy with git push
git push origin main
```

### Deploy to AWS (Complete Stack)

#### Using AWS CloudFormation

```bash
# 1. Create CloudFormation template
aws cloudformation create-stack \
  --stack-name agrismart-prod \
  --template-body file://cloudformation-template.yaml \
  --parameters ParameterKey=Environment,ParameterValue=production

# 2. Monitor stack creation
aws cloudformation describe-stacks --stack-name agrismart-prod
```

#### Using AWS ECS + ECR

```bash
# 1. Create ECR repositories
aws ecr create-repository --repository-name agrismart-backend
aws ecr create-repository --repository-name agrismart-ml
aws ecr create-repository --repository-name agrismart-frontend

# 2. Build and push images
docker build -t agrismart-backend -f Dockerfile.backend .
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com

docker tag agrismart-backend:latest <account-id>.dkr.ecr.ap-south-1.amazonaws.com/agrismart-backend:latest
docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/agrismart-backend:latest

# 3. Create ECS tasks and services
# (Use AWS Console or AWS CLI)
```

#### Using Elastic Beanstalk

```bash
# 1. Install EB CLI
pip install awsebcli

# 2. Initialize EB application
eb init -p docker agrismart

# 3. Create environment
eb create agrismart-prod

# 4. Deploy
eb deploy

# 5. View logs
eb logs
```

### Deploy to Google Cloud Run

```bash
# 1. Authenticate
gcloud auth login
gcloud config set project PROJECT_ID

# 2. Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/agrismart-backend

# 3. Deploy
gcloud run deploy agrismart-backend \
  --image gcr.io/PROJECT_ID/agrismart-backend \
  --platform managed \
  --region us-central1 \
  --memory 1Gi \
  --cpu 1 \
  --set-env-vars MONGODB_URI=$MONGODB_URI,JWT_SECRET=$JWT_SECRET

# 4. Check deployment
gcloud run services list
gcloud run services describe agrismart-backend --region us-central1
```

---

## Kubernetes Deployment

### Prerequisites

- kubectl configured
- Kubernetes cluster (1.20+)
- Helm 3.x

### Deploy with kubectl

```bash
# 1. Create Kubernetes namespace
kubectl create namespace agrismart

# 2. Create ConfigMaps and Secrets
kubectl create configmap agrismart-config \
  --from-literal=BACKEND_PORT=4000 \
  --from-literal=ML_SERVICE_URL=http://ml-service:8000 \
  -n agrismart

# 3. Create secrets
kubectl create secret generic agrismart-secrets \
  --from-literal=MONGODB_URI="mongodb://..."  \
  --from-literal=JWT_SECRET="your-secret" \
  -n agrismart

# 4. Apply deployment manifests
kubectl apply -f k8s/mongodb-deploy.yaml -n agrismart
kubectl apply -f k8s/redis-deploy.yaml -n agrismart
kubectl apply -f k8s/backend-deploy.yaml -n agrismart
kubectl apply -f k8s/ml-service-deploy.yaml -n agrismart
kubectl apply -f k8s/frontend-deploy.yaml -n agrismart

# 5. Monitor deployments
kubectl get pods -n agrismart
kubectl describe pod <pod-name> -n agrismart
kubectl logs -f <pod-name> -n agrismart
```

### Deploy with Helm

```bash
# 1. Add Helm repository
helm repo add agrismart-charts https://charts.agrismart.com
helm repo update

# 2. Create values.yaml
cat > agrismart-values.yaml << EOF
backend:
  replicas: 3
  image: agrismart-backend:1.0.0
  
ml:
  replicas: 2
  image: agrismart-ml:1.0.0
  
mongodb:
  enabled: true
  auth:
    rootPassword: "secure-password"
    
redis:
  enabled: true
EOF

# 3. Install release
helm install agrismart agrismart-charts/agrismart \
  -f agrismart-values.yaml \
  -n agrismart

# 4. Upgrade release
helm upgrade agrismart agrismart-charts/agrismart \
  -f agrismart-values.yaml \
  -n agrismart

# 5. Check status
helm status agrismart -n agrismart
```

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy AgriSmart

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker images
        run: |
          docker build -t agrismart-backend:${{ github.sha }} -f Dockerfile.backend .
          docker build -t agrismart-ml:${{ github.sha }} -f Dockerfile.ml ./backend/ml
          docker build -t agrismart-frontend:${{ github.sha }} -f Dockerfile.frontend ./frontend
      
      - name: Push to Docker Hub
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push agrismart-backend:${{ github.sha }}
          docker push agrismart-ml:${{ github.sha }}
          docker push agrismart-frontend:${{ github.sha }}
      
      - name: Deploy to production
        run: |
          # Deploy using kubectl, aws, or railway
          kubectl set image deployment/backend backend=agrismart-backend:${{ github.sha }} -n agrismart
```

---

## Monitoring & Logging

### Prometheus Monitoring

```yaml
# prometheus.yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'backend'
    static_configs:
      - targets: ['localhost:4000']
  
  - job_name: 'ml-service'
    static_configs:
      - targets: ['localhost:8000']
```

### ELK Stack Logging

```bash
# 1. Deploy ELK stack
docker-compose up -d elasticsearch kibana logstash

# 2. Configure log forwarding
# Backend logs → Logstash → Elasticsearch → Kibana

# 3. Access Kibana
# http://localhost:5601
```

### Application Monitoring Tools

- **Datadog**: `pip install datadog`
- **New Relic**: APM monitoring
- **Sentry**: Error tracking (`npm install @sentry/node`)

```javascript
// Integrate Sentry in Backend
const Sentry = require("@sentry/node");

Sentry.init({ 
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV 
});
```

---

## Security Best Practices

### SSL/TLS Certificates

```bash
# Generate self-signed certificate (development)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Use Let's Encrypt for production
certbot certonly --standalone -d yourdomain.com
```

### Secrets Management

```bash
# AWS Secrets Manager
aws secretsmanager create-secret --name agrismart/prod --secret-string file://secrets.json

# HashiCorp Vault
vault kv put secret/agrismart/prod mongodb_uri=... jwt_secret=...
```

### Network Security

```yaml
# Network Policy for Kubernetes
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: agrismart-netpol
spec:
  podSelector:
    matchLabels:
      app: agrismart
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: agrismart
    ports:
    - protocol: TCP
      port: 4000
```

### Database Security

```bash
# MongoDB Atlas encryption
# - Enable encryption at rest
# - Use VPC Peering
# - Enable IP Whitelist
# - Use SCRAM-SHA authentication

# Redis SSL
redis-cli --tls --cert /path/to/ca.crt --key /path/to/client-key.pem -h redis.yourdomain.com
```

---

## Performance Optimization

### Backend Optimization

```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Connection pooling
const pool = mongoose.connection.getClient();
pool.setMaxPoolSize(100);

// Redis caching
const redis = require('redis');
const client = redis.createClient({
  host: 'redis',
  port: 6379
});
```

### ML Service Optimization

```python
# Model batching
from fastapi_utils.inferring_router import InferringRouter
from tensorflow.lite.python import lite

# Convert to TFLite for faster inference
converter = tf.lite.TFLiteConverter.from_saved_model(model_path)
tflite_model = converter.convert()
```

### Database Optimization

```javascript
// Create indexes
db.posts.createIndex({ category: 1, createdAt: -1 })
db.comments.createIndex({ postId: 1 })
db.followers.createIndex({ followerId: 1, followingId: 1 }, { unique: true })

// Connection pooling
mongodb+srv://user:pass@cluster.mongodb.net/agrismart?maxPoolSize=100
```

### CDN Integration

```bash
# CloudFlare
# 1. Point domain to Cloudflare nameservers
# 2. Enable caching rules
# 3. Enable HTTP/2 and Brotli compression

# AWS CloudFront
aws cloudfront create-distribution --distribution-config file://distribution-config.json
```

---

## Scaling Strategies

### Horizontal Scaling

```bash
# Docker Compose
docker-compose up -d --scale backend=5 --scale ml-service=3

# Kubernetes
kubectl scale deployment backend --replicas=5 -n agrismart
kubectl autoscale deployment backend --min=2 --max=10 --cpu-percent=80 -n agrismart
```

### Load Balancing

```yaml
# Kubernetes Service
apiVersion: v1
kind: Service
metadata:
  name: backend-lb
spec:
  type: LoadBalancer
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 4000
```

---

## Disaster Recovery

### Backup Strategy

```bash
# MongoDB backup
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/agrismart" \
  --out /backups/agrismart-$(date +%Y%m%d)

# Automated backups
0 2 * * * /scripts/backup-mongodb.sh  # 2 AM daily
```

### Recovery Procedure

```bash
# Restore from backup
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/agrismart" \
  /backups/agrismart-20240308/
```

---

## Health Checks

### Kubernetes Liveness Probe

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 4000
  initialDelaySeconds: 30
  periodSeconds: 10
```

### Application Health Endpoint

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    checks: {
      database: mongoConnected ? 'ok' : 'error',
      redis: redisConnected ? 'ok' : 'error',
      ml_service: mlAvailable ? 'ok' : 'error'
    }
  });
});
```

---

## Support & Troubleshooting

For issues or questions:
- Issue Tracker: https://github.com/Akash7653/Agrismart/issues
- Documentation: https://docs.agrismart.com
- Community: https://community.agrismart.com
