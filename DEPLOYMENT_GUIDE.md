# Deployment Guide

Production deployment guidelines for the Study Tracker Application.

## Pre-Deployment Checklist

### Security
- [ ] Change MongoDB password
- [ ] Change JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Enable CORS for production domain only
- [ ] Configure secure headers
- [ ] Set up rate limiting

### Infrastructure
- [ ] Reserve server resources (4GB+ RAM)
- [ ] Configure backup strategy
- [ ] Set up monitoring
- [ ] Set up logging
- [ ] Configure auto-restart
- [ ] Set up health checks
- [ ] Configure resource limits

### Database
- [ ] Create database backups
- [ ] Set up replication (optional)
- [ ] Configure authentication
- [ ] Set up indexes
- [ ] Configure retention policy
- [ ] Set up monitoring

### Application
- [ ] Build optimized images
- [ ] Test all functionality
- [ ] Review logs
- [ ] Load test the system
- [ ] Test error scenarios
- [ ] Verify SSL certificates

## Production Environment Configuration

### Backend Environment Variables

```bash
# Required
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/study-tracker
JWT_SECRET=<very-long-random-secret-string>

# Optional
LOG_LEVEL=info
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
REDIS_URL=redis://redis:6379
```

### Frontend Environment Variables

```bash
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENV=production
```

## Deployment Options

### Option 1: AWS Deployment

#### EC2 Instance
```bash
# 1. Launch EC2 instance (Ubuntu 22.04)
# 2. Install Docker and Docker Compose
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER

# 3. Clone repository
git clone <repo-url>
cd study-tracker-app

# 4. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with production values

# 5. Start with docker-compose
docker-compose up -d

# 6. Set up reverse proxy with Nginx
# Configure SSL certificates with Let's Encrypt
```

#### RDS for MongoDB
```bash
# Use AWS MongoDB service instead of container
MONGODB_URI=mongodb+srv://user:password@mongodb.c.mongodb.net/study-tracker
```

#### S3 for Assets
```javascript
// Configure frontend to use S3 for static assets
const S3_BUCKET = 'study-tracker-assets';
const CLOUDFRONT_URL = 'https://d123.cloudfront.net';
```

### Option 2: Digital Ocean Deployment

```bash
# 1. Create Droplet (Ubuntu 22.04, 4GB RAM)
# 2. SSH into droplet
ssh root@droplet_ip

# 3. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 4. Clone and deploy
git clone <repo-url>
cd study-tracker-app
docker-compose up -d

# 5. Configure domain
# Point domain to droplet IP
# Configure SSL with Let's Encrypt
```

### Option 3: Heroku Deployment

```bash
# 1. Create heroku app
heroku create study-tracker-app

# 2. Add MongoDB add-on
heroku addons:create mongolab:sandbox

# 3. Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set NODE_ENV=production

# 4. Deploy
git push heroku main

# 5. View logs
heroku logs --tail
```

### Option 4: Google Cloud Run

```bash
# 1. Build images
docker build -t gcr.io/project-id/backend ./backend
docker build -t gcr.io/project-id/frontend ./frontend

# 2. Push to Google Container Registry
docker push gcr.io/project-id/backend
docker push gcr.io/project-id/frontend

# 3. Deploy services
gcloud run deploy backend --image gcr.io/project-id/backend
gcloud run deploy frontend --image gcr.io/project-id/frontend

# 4. Configure networking
gcloud run services update backend --allow-unauthenticated
```

### Option 5: Kubernetes (EKS, GKE, AKS)

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: study-tracker-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/backend:1.0.0
        ports:
        - containerPort: 5000
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: mongo-secret
              key: uri
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
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
```

Deploy:
```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
```

## SSL/TLS Configuration

### Let's Encrypt with Nginx

```bash
# 1. Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# 2. Get certificate
sudo certbot certonly --nginx -d yourdomain.com -d api.yourdomain.com

# 3. Configure Nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}

# 4. Auto-renewal
sudo certbot renew --dry-run
```

## Monitoring and Logging

### Application Monitoring

```javascript
// Backend monitoring with Winston
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Health Checks

```bash
# Monitor endpoint
GET /health

# Docker health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:5000/health || exit 1
```

### Log Aggregation

```yaml
# Using ELK Stack
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
  
kibana:
  image: docker.elastic.co/kibana/kibana:8.0.0
  
logstash:
  image: docker.elastic.co/logstash/logstash:8.0.0
```

## Backup and Recovery

### MongoDB Backup

```bash
# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)

mongodump -u admin -p $MONGO_PASSWORD \
  --out $BACKUP_DIR/dump_$DATE

# Compress backup
tar -czf $BACKUP_DIR/dump_$DATE.tar.gz $BACKUP_DIR/dump_$DATE
rm -rf $BACKUP_DIR/dump_$DATE

# Upload to S3
aws s3 cp $BACKUP_DIR/dump_$DATE.tar.gz s3://backups/
```

### Restore from Backup

```bash
# Download from S3
aws s3 cp s3://backups/dump_YYYYMMDD_HHMMSS.tar.gz .

# Extract
tar -xzf dump_YYYYMMDD_HHMMSS.tar.gz

# Restore to MongoDB
mongorestore -u admin -p $MONGO_PASSWORD ./dump/
```

## Performance Tuning

### Database Optimization

```javascript
// Create indexes
db.tasks.createIndex({ userId: 1, status: 1 });
db.tasks.createIndex({ userId: 1, deadline: 1 });

// Monitor query performance
db.tasks.find({ userId: ObjectId }).explain("executionStats")
```

### Frontend Optimization

```bash
# Generate optimized build
npm run build

# Analyze bundle size
npm install -g source-map-explorer
source-map-explorer 'build/js/*.js'
```

### Backend Optimization

```javascript
// Connection pooling
const pool = mongoose.connection.options.socketTimeoutMS = 45000;

// Query optimization
Task.find().lean()  // Don't hydrate objects

// Caching
const redis = require('redis');
const client = redis.createClient();
```

## Cost Optimization

### Resource Allocation

```yaml
# Minimal resources
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M

# Production resources
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
```

### Auto-scaling

```yaml
# Kubernetes HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-autoscaler
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: study-tracker-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Disaster Recovery

### RTO and RPO

```
RTO (Recovery Time Objective): 1 hour
RPO (Recovery Point Objective): 15 minutes
```

### Backup Strategy

1. **Hourly backups** to local storage
2. **Daily backups** to remote storage (S3)
3. **Weekly backups** to archive storage (Glacier)
4. **Monthly full backups** for compliance

### Failover Plan

```bash
# 1. Monitor primary database
# 2. Detect failure (health checks)
# 3. Promote secondary replica
# 4. Update connection string
# 5. Verify application
# 6. Alert operations team
```

## Security Hardening

### Network Security

```bash
# Firewall rules
- Restrict MongoDB port (27017) to backend only
- Restrict Redis port (6379) to internal network
- Only expose ports 80 (HTTP) and 443 (HTTPS)
```

### Application Security

```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

### Data Security

```bash
# Encryption in transit
- HTTPS/TLS for all connections
- MongoDB connection encryption

# Encryption at rest
- Enable MongoDB encryption
- Encrypt database backups
```

## Monitoring Checklist

### Daily Checks
- [ ] Application is running
- [ ] No critical errors in logs
- [ ] Database is healthy
- [ ] Disk space is sufficient
- [ ] Memory usage is normal

### Weekly Checks
- [ ] Backup completed successfully
- [ ] Performance metrics are normal
- [ ] Security patches available
- [ ] SSL certificate status
- [ ] User activity normal

### Monthly Checks
- [ ] Disaster recovery drill
- [ ] Log analysis and rotation
- [ ] Capacity planning
- [ ] Cost analysis
- [ ] Security audit

## Rollback Procedure

```bash
# If new deployment fails

# 1. Check current image version
docker inspect study-tracker-backend

# 2. Rollback to previous image
docker-compose down
git checkout HEAD~1
docker-compose up -d

# 3. Verify functionality
curl http://localhost:5000/health

# 4. Investigate failure
docker-compose logs backend

# 5. Once fixed, redeploy
git checkout main
docker-compose build --no-cache
docker-compose up -d
```

## Production Checklist

- [ ] All environment variables configured
- [ ] SSL certificates installed
- [ ] Backups configured and tested
- [ ] Monitoring and alerting enabled
- [ ] Log aggregation set up
- [ ] Rate limiting configured
- [ ] Database replication set up
- [ ] Load testing completed
- [ ] Disaster recovery plan documented
- [ ] Security audit completed
- [ ] Team trained on procedures
- [ ] On-call rotation established

---

**Last Updated:** 2026-04-25
**Version:** 1.0.0

See [README.md](README.md) for overview and [DOCKER_SETUP.md](DOCKER_SETUP.md) for Docker details.
