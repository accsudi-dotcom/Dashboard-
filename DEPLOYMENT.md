# Sharoobi Console - Deployment Guide

## 🚀 Deployment Options

---

## Option 1: Vercel (Recommended)

### Why Vercel?
- Zero-config Next.js deployment
- Automatic preview deployments
- Edge caching & CDN
- Serverless functions
- Environment management
- Analytics included

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Project pushed to GitHub

### Step-by-Step Deployment

1. **Connect GitHub Repository**
   ```
   1. Visit https://vercel.com
   2. Click "New Project"
   3. Select "Import Git Repository"
   4. Choose your GitHub account
   5. Select sharoobi-console repository
   6. Click "Import"
   ```

2. **Configure Environment Variables**
   ```
   In Vercel Dashboard:
   1. Go to Settings → Environment Variables
   2. Add the following:
      - NEXT_PUBLIC_API_URL=https://api.sharoobi.com (your backend)
      - AUTH_SECRET=your-secret-key
      - AUTH_COOKIE_SECURE=true (production only)
      - NODE_ENV=production
   ```

3. **Configure Build Settings**
   ```
   Framework: Next.js
   Build Command: pnpm build (auto-detected)
   Output Directory: .next (auto-detected)
   Install Command: pnpm install (auto-detected)
   ```

4. **Deploy**
   ```
   Click "Deploy" button
   Wait for build to complete (~2-3 minutes)
   Visit deployment URL
   ```

### Post-Deployment
```bash
# Verify deployment
curl https://your-vercel-app.vercel.app/health

# Check logs
vercel logs

# Monitor performance
# Use Vercel Analytics dashboard
```

---

## Option 2: Docker + Container Deployment

### Prerequisites
- Docker installed
- Container registry (Docker Hub, ECR, GCR)
- Container orchestration (Kubernetes, ECS, Cloud Run)

### Create Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build

FROM node:18-alpine AS runtime
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 3000
ENV NODE_ENV production
CMD ["pnpm", "start"]
```

### Build & Push Image
```bash
# Build image
docker build -t sharoobi-console:latest .

# Tag for registry
docker tag sharoobi-console:latest your-registry/sharoobi-console:latest

# Push to registry
docker push your-registry/sharoobi-console:latest
```

### Deploy to Cloud Run
```bash
gcloud run deploy sharoobi-console \
  --image your-registry/sharoobi-console:latest \
  --platform managed \
  --region us-central1 \
  --set-env-vars AUTH_SECRET=your-secret
```

---

## Option 3: Traditional Server (AWS EC2, DigitalOcean, Linode)

### Prerequisites
- Server with Node.js 18+
- pnpm or npm installed
- Nginx/Apache (for reverse proxy)
- SSL certificate (Let's Encrypt)

### Installation Steps

1. **SSH into Server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Clone Repository**
   ```bash
   cd /opt
   git clone https://github.com/your-org/sharoobi-console.git
   cd sharoobi-console
   ```

3. **Install Dependencies**
   ```bash
   curl -fsSL https://get.pnpm.io/install.sh | sh -
   pnpm install
   ```

4. **Build Application**
   ```bash
   pnpm build
   ```

5. **Configure Environment**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with your settings
   nano .env.production
   ```

6. **Setup PM2 Process Manager**
   ```bash
   npm install -g pm2
   pm2 start "pnpm start" --name sharoobi-console
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/sharoobi-console
   server {
     listen 80;
     server_name console.sharoobi.com;
     
     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

8. **Enable SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d console.sharoobi.com
   ```

9. **Enable Nginx Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/sharoobi-console /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. **Setup Monitoring**
    ```bash
    pm2 install pm2-auto-pull
    pm2 install pm2-logrotate
    ```

---

## Option 4: Kubernetes Deployment

### Prerequisites
- Kubernetes cluster
- kubectl configured
- Docker image pushed to registry

### Create Deployment YAML
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sharoobi-console
  labels:
    app: sharoobi-console
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sharoobi-console
  template:
    metadata:
      labels:
        app: sharoobi-console
    spec:
      containers:
      - name: sharoobi-console
        image: your-registry/sharoobi-console:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: AUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: sharoobi-secrets
              key: auth-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Create Service
```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: sharoobi-console-service
spec:
  selector:
    app: sharoobi-console
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
```

### Deploy to Kubernetes
```bash
# Create secrets
kubectl create secret generic sharoobi-secrets \
  --from-literal=auth-secret=your-secret

# Deploy
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Verify
kubectl get deployments
kubectl get services
kubectl describe service sharoobi-console-service
```

---

## Environment Variables by Deployment Type

### Development
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
AUTH_COOKIE_SECURE=false
DEBUG=*
```

### Staging
```
NEXT_PUBLIC_API_URL=https://api-staging.sharoobi.com
NODE_ENV=production
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_DOMAIN=console-staging.sharoobi.com
LOG_LEVEL=info
```

### Production
```
NEXT_PUBLIC_API_URL=https://api.sharoobi.com
NODE_ENV=production
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_DOMAIN=console.sharoobi.com
AUTH_COOKIE_SAME_SITE=strict
LOG_LEVEL=warn
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

---

## Performance Optimization

### Production Build
```bash
# Build with optimizations
pnpm build

# Analyze bundle size
ANALYZE=true pnpm build

# Run production build locally
pnpm start
```

### Caching Strategy
```
- Static assets: 1 year
- HTML pages: 1 hour
- API responses: 5 minutes
- User data: no cache
```

### CDN Configuration
```
Files to cache:
- /_next/static/* (1 year)
- /public/* (1 year)
- /*.js, /*.css (1 hour)

Files NOT to cache:
- /api/* (0 seconds)
- /dashboard/* (1 hour)
```

---

## Monitoring & Logging

### Health Check Endpoint
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV
  })
}
```

### Logging Setup
```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    console.log(`[INFO] ${message}`, meta)
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error)
  },
  warn: (message: string) => {
    console.warn(`[WARN] ${message}`)
  }
}
```

### Monitoring Tools
- **Vercel Analytics** (if using Vercel)
- **PM2 Monitoring** (if using PM2)
- **Prometheus** + **Grafana** (for Kubernetes)
- **ELK Stack** (for logs)
- **DataDog** (comprehensive monitoring)

---

## Scaling Strategy

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Update instance type
- Increase request timeout

### Horizontal Scaling
- Multiple instances behind load balancer
- Shared session storage (Redis)
- Static asset CDN
- Separate API backend

### Database Scaling (Future)
- Read replicas for analytics queries
- Connection pooling
- Query optimization
- Caching layer (Redis)

---

## Rollback Strategy

### Rollback Plan
```bash
# Using Vercel
vercel rollback

# Using Docker
docker run -d your-registry/sharoobi-console:previous

# Using PM2
pm2 restart sharoobi-console

# Using Kubernetes
kubectl rollout undo deployment/sharoobi-console
```

### Version Management
```
Versioning: semantic versioning (X.Y.Z)
- X: Major (breaking changes)
- Y: Minor (new features)
- Z: Patch (bug fixes)

Example: v1.0.0, v1.1.0, v1.1.1
```

---

## Security Checklist

Before Production Deployment:
- [ ] Environment variables secured
- [ ] SSL/TLS certificate valid
- [ ] Authentication configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Database backups configured
- [ ] Monitoring alerts enabled
- [ ] Log retention policy set
- [ ] Incident response plan ready

---

## Post-Deployment

### Verification
```bash
# Test login
curl -X POST https://your-domain/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sharoobi.local","password":"Admin@sharoobi"}'

# Check health
curl https://your-domain/api/health

# Monitor performance
# Check dashboard metrics
```

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild (if needed)
pnpm build

# Restart service
pm2 restart sharoobi-console
# or
kubectl rollout restart deployment/sharoobi-console
```

---

## Cost Estimation

### Vercel
- Free tier: Good for small projects
- Pro: $20/month + usage
- Enterprise: Custom pricing

### AWS
- EC2 t3.micro: ~$10/month
- ECS + EC2: ~$20-50/month
- EKS: ~$70/month + compute

### DigitalOcean
- Basic Droplet: $4-6/month
- App Platform: $5-12/month

### Self-hosted
- Server: $5-20/month
- Domain: $10-15/year
- SSL: Free (Let's Encrypt)

---

## Troubleshooting

### Common Issues

**Build Fails**
```
Check: Node version, dependencies, environment variables
Solution: pnpm install && pnpm build --verbose
```

**Application Won't Start**
```
Check: Port already in use, missing env vars
Solution: PORT=4000 pnpm start
```

**High Memory Usage**
```
Check: Memory leaks, session store
Solution: Enable heap snapshots, monitor with pm2
```

**Slow Performance**
```
Check: Bundle size, API calls, database queries
Solution: Analyze bundle, optimize queries, add caching
```

---

## Support & Maintenance

- Monitor error logs daily
- Review performance metrics weekly
- Update dependencies monthly
- Security patches immediately
- Feature updates biweekly

---

**Ready to deploy! Choose the option that best fits your infrastructure needs.**
