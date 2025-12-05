# Deployment Guide

## Backend Deployment

### Option 1: Traditional Server (VPS/Dedicated)

#### Prerequisites
- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+
- Nginx (optional, for reverse proxy)
- PM2 (for process management)

#### Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd tefas-tracker/backend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment**
```bash
cp .env.example .env
nano .env
```

Update variables:
```
PORT=3000
NODE_ENV=production
DATABASE_PATH=/var/www/tefas-tracker/data/tefas.db
CORS_ORIGIN=https://yourdomain.com
```

4. **Build Application**
```bash
npm run build
```

5. **Install PM2**
```bash
npm install -g pm2
```

6. **Start Application**
```bash
pm2 start dist/index.js --name tefas-backend
pm2 save
pm2 startup
```

7. **Configure Nginx (Optional)**

Create `/etc/nginx/sites-available/tefas-tracker`:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/tefas-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. **SSL Certificate (Let's Encrypt)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

### Option 2: Docker

1. **Build Image**
```bash
cd backend
docker build -t tefas-backend .
```

2. **Run Container**
```bash
docker run -d \
  --name tefas-backend \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -e NODE_ENV=production \
  tefas-backend
```

3. **Using Docker Compose**
```bash
cd ..
docker-compose up -d
```

### Option 3: Cloud Platforms

#### Heroku
```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create tefas-tracker-backend

# Set buildpack
heroku buildpacks:set heroku/nodejs

# Deploy
git subtree push --prefix backend heroku main

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DATABASE_PATH=/app/data/tefas.db
```

#### Railway
1. Connect GitHub repository
2. Select backend folder
3. Add environment variables
4. Deploy automatically on push

#### DigitalOcean App Platform
1. Create new app from GitHub
2. Select backend folder
3. Configure environment variables
4. Deploy

## Mobile App Deployment

### Web Deployment

#### Build Web Version
```bash
cd mobile
npx expo export:web
```

#### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir web-build
```

#### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Android Deployment

#### Build APK (Development)
```bash
cd mobile
eas build --platform android --profile preview
```

#### Build AAB (Production)
```bash
eas build --platform android --profile production
```

#### Upload to Google Play Store
1. Create developer account ($25 one-time fee)
2. Create new app in Play Console
3. Upload AAB file
4. Fill in store listing details
5. Submit for review

### iOS Deployment (Future)

```bash
eas build --platform ios --profile production
```

## Environment Variables

### Backend Production
```
PORT=3000
NODE_ENV=production
DATABASE_PATH=/path/to/production/tefas.db
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

### Mobile Production
```
API_BASE_URL=https://api.yourdomain.com
```

## Database Backup

### Automated Backup Script
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/tefas"
DB_PATH="/var/www/tefas-tracker/data/tefas.db"

mkdir -p $BACKUP_DIR
cp $DB_PATH $BACKUP_DIR/tefas_$DATE.db
gzip $BACKUP_DIR/tefas_$DATE.db

# Keep only last 30 days
find $BACKUP_DIR -name "tefas_*.db.gz" -mtime +30 -delete
```

### Cron Job (Daily at 2 AM)
```bash
0 2 * * * /path/to/backup-script.sh
```

## Monitoring

### PM2 Monitoring
```bash
pm2 monit
pm2 logs tefas-backend
pm2 status
```

### Health Checks
Setup monitoring service to check:
- `GET /health` - Should return 200 OK

### Error Tracking
Consider integrating:
- Sentry
- LogRocket
- Rollbar

## Performance Optimization

### Backend
- Enable gzip compression (already configured)
- Use Redis for caching
- Optimize database queries with indexes (already configured)
- Use CDN for static assets

### Mobile
- Enable Hermes engine (React Native)
- Optimize images
- Code splitting
- Lazy loading

## Security

### Backend
- Keep dependencies updated
- Use HTTPS only
- Implement rate limiting
- Validate all inputs
- Use secure headers (Helmet - already configured)
- Regular security audits

### Mobile
- Secure API keys
- Use HTTPS only
- Implement certificate pinning
- Obfuscate code
- Regular security updates

## Scaling

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Multiple backend instances
- Shared database (consider PostgreSQL)
- Redis for session storage

### Vertical Scaling
- Increase server resources
- Optimize database
- Enable caching

## Troubleshooting

### Backend won't start
```bash
# Check logs
pm2 logs tefas-backend

# Check port availability
sudo netstat -tulpn | grep :3000

# Check permissions
ls -la /var/www/tefas-tracker/data
```

### Database errors
```bash
# Check database file
sqlite3 /path/to/tefas.db ".tables"

# Verify integrity
sqlite3 /path/to/tefas.db "PRAGMA integrity_check"
```

### High memory usage
```bash
# Monitor process
pm2 monit

# Restart if needed
pm2 restart tefas-backend
```

## Rollback Strategy

### Quick Rollback
```bash
# Using PM2
pm2 stop tefas-backend
git checkout <previous-commit>
npm install
npm run build
pm2 restart tefas-backend
```

### Database Rollback
```bash
# Restore from backup
cp /backups/tefas/tefas_YYYYMMDD.db.gz .
gunzip tefas_YYYYMMDD.db.gz
cp tefas_YYYYMMDD.db /var/www/tefas-tracker/data/tefas.db
pm2 restart tefas-backend
```

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database initialized
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Monitoring setup
- [ ] Backups configured
- [ ] Health checks working
- [ ] Error tracking enabled
- [ ] Documentation updated
- [ ] Team notified

## Support

For deployment issues:
- Check logs first
- Review documentation
- Create GitHub issue
- Contact DevOps team
