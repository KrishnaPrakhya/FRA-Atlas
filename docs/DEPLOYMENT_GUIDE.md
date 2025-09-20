# 🚀 Deployment Guide

## **Production Deployment Options**

### **Option 1: Docker Deployment (Recommended)**

#### **Prerequisites**

- Docker 20.10+
- Docker Compose 2.0+
- 16GB RAM minimum
- 50GB storage

#### **1. Environment Configuration**

```bash
# Create production environment file
cp .env.example .env.production

# Edit production variables
nano .env.production
```

```env
# Production Environment Variables
NODE_ENV=production
DATABASE_URL=postgresql://fra_user:secure_password@postgres:5432/fra_atlas_prod
REDIS_URL=redis://redis:6379
JWT_SECRET=your-super-secure-jwt-secret-min-32-characters
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=https://fra-atlas.gov.in

# API Configuration
NEXT_PUBLIC_API_URL=https://fra-atlas.gov.in/api
NEXT_PUBLIC_OCR_API_URL=https://api.fra-atlas.gov.in

# File Upload
MAX_FILE_SIZE=52428800  # 50MB
UPLOAD_DIR=/app/uploads

# ML Models
ML_MODEL_PATH=/app/models
ENABLE_GPU=false

# Monitoring
LOG_LEVEL=info
ENABLE_METRICS=true
SENTRY_DSN=your-sentry-dsn

# External Services
OPENAI_API_KEY=your-openai-key-optional
GOOGLE_MAPS_API_KEY=your-maps-key
```

#### **2. Docker Compose Setup**

```yaml
# docker-compose.prod.yml
version: "3.8"

services:
  # Frontend & API
  web:
    build:
      context: .
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
      - api
    volumes:
      - uploads:/app/uploads
    restart: unless-stopped

  # Python API
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    volumes:
      - uploads:/app/uploads
      - models:/app/models
    restart: unless-stopped

  # Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: fra_atlas_prod
      POSTGRES_USER: fra_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  # Cache
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - uploads:/var/www/uploads
    depends_on:
      - web
      - api
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  uploads:
  models:
```

#### **3. Nginx Configuration**

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream web {
        server web:3000;
    }

    upstream api {
        server api:8000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=upload:10m rate=2r/s;

    server {
        listen 80;
        server_name fra-atlas.gov.in;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name fra-atlas.gov.in;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # Frontend
        location / {
            proxy_pass http://web;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # File uploads
        location /upload {
            limit_req zone=upload burst=5 nodelay;
            client_max_body_size 50M;
            proxy_pass http://api/upload;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Static files
        location /uploads/ {
            alias /var/www/uploads/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### **4. Deployment Commands**

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# Initialize database
docker-compose -f docker-compose.prod.yml exec web npx prisma db push
docker-compose -f docker-compose.prod.yml exec web npm run db:seed

# Initialize ML models
docker-compose -f docker-compose.prod.yml exec api python initialize_system.py

# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f web
docker-compose -f docker-compose.prod.yml logs -f api
```

### **Option 2: Kubernetes Deployment**

#### **1. Namespace and ConfigMap**

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: fra-atlas

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fra-atlas-config
  namespace: fra-atlas
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  ENABLE_METRICS: "true"
```

#### **2. Database Deployment**

```yaml
# k8s/postgres.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: fra-atlas
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:15-alpine
          env:
            - name: POSTGRES_DB
              value: fra_atlas_prod
            - name: POSTGRES_USER
              valueFrom:
                secretKeyRef:
                  name: fra-atlas-secrets
                  key: db-user
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: fra-atlas-secrets
                  key: db-password
          ports:
            - containerPort: 5432
          volumeMounts:
            - name: postgres-storage
              mountPath: /var/lib/postgresql/data
      volumes:
        - name: postgres-storage
          persistentVolumeClaim:
            claimName: postgres-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: fra-atlas
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
```

#### **3. Application Deployment**

```yaml
# k8s/web-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fra-atlas-web
  namespace: fra-atlas
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fra-atlas-web
  template:
    metadata:
      labels:
        app: fra-atlas-web
    spec:
      containers:
        - name: web
          image: fra-atlas:latest
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: fra-atlas-secrets
                  key: database-url
          envFrom:
            - configMapRef:
                name: fra-atlas-config
          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "1Gi"
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

---
apiVersion: v1
kind: Service
metadata:
  name: fra-atlas-web-service
  namespace: fra-atlas
spec:
  selector:
    app: fra-atlas-web
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
```

### **Option 3: Traditional Server Deployment**

#### **1. Server Setup (Ubuntu 20.04)**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python
sudo apt install python3.9 python3.9-venv python3-pip -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Redis
sudo apt install redis-server -y

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2
```

#### **2. Database Setup**

```bash
# Create database user
sudo -u postgres createuser --interactive fra_user
sudo -u postgres createdb fra_atlas_prod -O fra_user

# Set password
sudo -u postgres psql -c "ALTER USER fra_user PASSWORD 'secure_password';"
```

#### **3. Application Setup**

```bash
# Clone repository
git clone https://github.com/your-org/fra-atlas.git /opt/fra-atlas
cd /opt/fra-atlas

# Install frontend dependencies
npm install
npm run build

# Setup backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python initialize_system.py
```

#### **4. PM2 Configuration**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "fra-atlas-web",
      script: "npm",
      args: "start",
      cwd: "/opt/fra-atlas",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 2,
      exec_mode: "cluster",
    },
    {
      name: "fra-atlas-api",
      script: "/opt/fra-atlas/backend/venv/bin/python",
      args: "start.py",
      cwd: "/opt/fra-atlas/backend",
      env: {
        PYTHONPATH: "/opt/fra-atlas/backend",
      },
      instances: 2,
      exec_mode: "cluster",
    },
  ],
};
```

```bash
# Start applications
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## **Monitoring & Observability**

### **Application Monitoring**

#### **Health Checks**

```typescript
// lib/health-check.ts
export async function healthCheck() {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    ocr_service: await checkOCRService(),
    ml_models: await checkMLModels(),
    file_storage: await checkFileStorage(),
  };

  const isHealthy = Object.values(checks).every(
    (check) => check.status === "healthy"
  );

  return {
    status: isHealthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    checks,
  };
}

// API endpoint: /api/health
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const health = await healthCheck();
  const statusCode = health.status === "healthy" ? 200 : 503;

  res.status(statusCode).json(health);
}
```

#### **Metrics Collection**

```python
# backend/monitoring.py
from prometheus_client import Counter, Histogram, Gauge, start_http_server
import time

# Metrics
request_count = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
request_duration = Histogram('http_request_duration_seconds', 'HTTP request duration')
ocr_processing_time = Histogram('ocr_processing_seconds', 'OCR processing time')
active_users = Gauge('active_users_total', 'Number of active users')
ml_model_accuracy = Gauge('ml_model_accuracy', 'ML model accuracy', ['model_name'])

def track_request(method, endpoint, status_code, duration):
    request_count.labels(method=method, endpoint=endpoint, status=status_code).inc()
    request_duration.observe(duration)

def track_ocr_processing(duration):
    ocr_processing_time.observe(duration)

def update_model_accuracy(model_name, accuracy):
    ml_model_accuracy.labels(model_name=model_name).set(accuracy)

# Start metrics server
start_http_server(8001)
```

#### **Logging Configuration**

```python
# backend/logging_config.py
import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno
        }

        if hasattr(record, 'user_id'):
            log_entry['user_id'] = record.user_id

        if hasattr(record, 'request_id'):
            log_entry['request_id'] = record.request_id

        if record.exc_info:
            log_entry['exception'] = self.formatException(record.exc_info)

        return json.dumps(log_entry)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('/var/log/fra-atlas/app.log')
    ]
)

# Set JSON formatter
for handler in logging.root.handlers:
    handler.setFormatter(JSONFormatter())
```

### **Error Tracking**

#### **Sentry Integration**

```typescript
// lib/sentry.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out sensitive information
    if (event.request?.data) {
      delete event.request.data.password;
      delete event.request.data.token;
    }
    return event;
  },
});

export function captureException(error: Error, context?: any) {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext("additional_info", context);
    }
    Sentry.captureException(error);
  });
}
```

#### **Custom Error Handler**

```python
# backend/error_handler.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from fastapi import HTTPException
from fastapi.responses import JSONResponse

sentry_sdk.init(
    dsn=os.getenv('SENTRY_DSN'),
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,
    environment=os.getenv('ENVIRONMENT', 'production')
)

async def custom_exception_handler(request, exc):
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                'error': {
                    'code': exc.detail,
                    'message': str(exc.detail),
                    'timestamp': datetime.utcnow().isoformat(),
                    'request_id': request.headers.get('X-Request-ID')
                }
            }
        )

    # Log unexpected errors
    sentry_sdk.capture_exception(exc)
    logger.error(f"Unexpected error: {exc}", exc_info=True)

    return JSONResponse(
        status_code=500,
        content={
            'error': {
                'code': 'INTERNAL_SERVER_ERROR',
                'message': 'An unexpected error occurred',
                'timestamp': datetime.utcnow().isoformat()
            }
        }
    )
```

## **Security Configuration**

### **SSL/TLS Setup**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d fra-atlas.gov.in -d api.fra-atlas.gov.in

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **Firewall Configuration**

```bash
# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 5432  # PostgreSQL (only from app servers)
sudo ufw enable
```

### **Security Headers**

```nginx
# Additional security headers in nginx.conf
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' wss: https:;";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";
```

## **Backup & Recovery**

### **Database Backup**

```bash
#!/bin/bash
# scripts/backup-db.sh

BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="fra_atlas_prod"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump -h localhost -U fra_user -d $DB_NAME | gzip > $BACKUP_DIR/fra_atlas_$DATE.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "fra_atlas_*.sql.gz" -mtime +30 -delete

# Upload to cloud storage (optional)
aws s3 cp $BACKUP_DIR/fra_atlas_$DATE.sql.gz s3://fra-atlas-backups/database/
```

### **File Backup**

```bash
#!/bin/bash
# scripts/backup-files.sh

BACKUP_DIR="/backups/files"
DATE=$(date +%Y%m%d_%H%M%S)
SOURCE_DIR="/opt/fra-atlas/uploads"

# Create backup
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C $SOURCE_DIR .

# Upload to cloud storage
aws s3 cp $BACKUP_DIR/uploads_$DATE.tar.gz s3://fra-atlas-backups/files/

# Clean old backups
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +7 -delete
```

### **Automated Backup Schedule**

```bash
# Add to crontab
0 2 * * * /opt/fra-atlas/scripts/backup-db.sh
0 3 * * * /opt/fra-atlas/scripts/backup-files.sh
```

## **Performance Optimization**

### **Database Optimization**

```sql
-- Performance tuning for PostgreSQL
-- /etc/postgresql/15/main/postgresql.conf

shared_buffers = 4GB                    # 25% of RAM
effective_cache_size = 12GB             # 75% of RAM
maintenance_work_mem = 1GB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 64MB
max_connections = 200

# Enable query logging for optimization
log_statement = 'all'
log_duration = on
log_min_duration_statement = 1000      # Log queries > 1 second
```

### **Redis Configuration**

```conf
# /etc/redis/redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### **Application Optimization**

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
  },
  images: {
    domains: ["fra-atlas.gov.in"],
    formats: ["image/webp", "image/avif"],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
};
```

## **Scaling Strategies**

### **Horizontal Scaling**

```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: fra-atlas-web-hpa
  namespace: fra-atlas
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: fra-atlas-web
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

### **Load Balancing**

```nginx
# nginx/upstream.conf
upstream fra_atlas_web {
    least_conn;
    server web1:3000 weight=3;
    server web2:3000 weight=3;
    server web3:3000 weight=2;
    keepalive 32;
}

upstream fra_atlas_api {
    least_conn;
    server api1:8000 weight=3;
    server api2:8000 weight=3;
    server api3:8000 weight=2;
    keepalive 32;
}
```

### **CDN Configuration**

```typescript
// lib/cdn.ts
const CDN_BASE_URL = "https://cdn.fra-atlas.gov.in";

export function getCDNUrl(path: string): string {
  if (process.env.NODE_ENV === "production") {
    return `${CDN_BASE_URL}${path}`;
  }
  return path;
}

// Usage in components
<Image
  src={getCDNUrl("/images/logo.png")}
  alt="FRA Atlas Logo"
  width={200}
  height={100}
/>;
```

## **Maintenance & Updates**

### **Zero-Downtime Deployment**

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "Starting zero-downtime deployment..."

# Build new version
docker build -t fra-atlas:new .

# Update one instance at a time
for instance in web1 web2 web3; do
    echo "Updating $instance..."

    # Remove from load balancer
    docker exec nginx nginx -s reload

    # Stop old container
    docker stop $instance

    # Start new container
    docker run -d --name ${instance}_new fra-atlas:new

    # Health check
    sleep 30
    if ! curl -f http://${instance}_new:3000/health; then
        echo "Health check failed for $instance"
        exit 1
    fi

    # Remove old container
    docker rm $instance

    # Rename new container
    docker rename ${instance}_new $instance

    # Add back to load balancer
    docker exec nginx nginx -s reload

    echo "$instance updated successfully"
done

echo "Deployment completed successfully!"
```

### **Database Migration Strategy**

```bash
#!/bin/bash
# scripts/migrate.sh

# Backup before migration
./scripts/backup-db.sh

# Run migrations
npx prisma db push

# Verify migration
npx prisma db seed --preview-feature

echo "Migration completed successfully!"
```

This comprehensive deployment guide covers all aspects of production deployment, from containerized solutions to traditional server setups, including monitoring, security, backup strategies, and scaling considerations. The documentation provides multiple deployment options to suit different infrastructure requirements and organizational preferences.
