# GENWEAR Deployment Guide

## Deploying to Production

### Checklist Before Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backup created
- [ ] API documentation updated
- [ ] Security headers configured
- [ ] CORS origins updated
- [ ] Rate limiting adjusted for production
- [ ] Logging configured

---

## Backend Deployment (Node.js)

### Option 1: Heroku

#### Prerequisites
- Heroku CLI installed
- Heroku account

#### Steps
1. **Create Heroku app:**
   ```bash
   heroku create genwear-api
   ```

2. **Add environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set PORT=5000
   heroku config:set MONGO_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set CLIENT_URL=https://your-frontend.com
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

4. **View logs:**
   ```bash
   heroku logs -t
   ```

### Option 2: Railway.app

1. Connect GitHub repository
2. Set environment variables in Railway dashboard
3. Railway auto-deploys on push
4. Access via Railway URL

### Option 3: AWS/DigitalOcean/Linode

1. Set up Ubuntu server
2. Install Node.js, MongoDB (or use managed database)
3. Install PM2 for process management:
   ```bash
   npm install -g pm2
   ```

4. Start application:
   ```bash
   pm2 start server.js --name "genwear-api"
   pm2 save
   pm2 startup
   ```

5. Set up Nginx as reverse proxy
6. Configure SSL with Let's Encrypt

---

## Frontend Deployment (React/Vite)

### Option 1: Vercel

1. **Push to GitHub**
2. **Connect to Vercel:**
   - Sign in to vercel.com
   - Import GitHub repository
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables:**
   - `VITE_API_URL=https://your-api.com`

4. **Deploy:**
   - Automatic on push to main branch

### Option 2: Netlify

1. **Connect to Netlify:**
   - Sign in to netlify.com
   - Connect GitHub repository

2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment variables:**
   - Add `VITE_API_URL` variable

4. **Deploy:**
   - Automatic on push

### Option 3: AWS S3 + CloudFront

1. **Build application:**
   ```bash
   npm run build
   ```

2. **Upload to S3:**
   - Create S3 bucket
   - Upload `dist` folder contents
   - Enable static website hosting

3. **Set up CloudFront:**
   - Create distribution
   - Point to S3 bucket
   - Configure caching

4. **Set up Route 53:**
   - Point domain to CloudFront

---

## Database Setup

### MongoDB Atlas (Recommended)

1. Create cluster at mongodb.com/cloud
2. Create database user
3. Add IP whitelist
4. Get connection string
5. Set `MONGO_URI` environment variable

### Local MongoDB

```bash
# Install MongoDB
# Start MongoDB service
mongod

# Connection string
mongodb://localhost:27017/genwear
```

---

## Environment Variables for Production

### Backend (.env)
```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/genwear
JWT_SECRET=your_very_long_and_secure_random_key_here_minimum_32_chars
JWT_EXPIRE=30d
CLIENT_URL=https://your-domain.com

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```
VITE_API_URL=https://your-api-domain.com
VITE_ENABLE_ANALYTICS=true
```

---

## Performance Optimization

### Frontend Optimization
1. **Build optimization:**
   - Code splitting enabled
   - Minification enabled
   - Compression enabled
   - Source maps disabled in production

2. **Image optimization:**
   - Use WebP format
   - Lazy load images
   - Optimize image sizes

3. **Caching:**
   - Browser caching enabled
   - CDN caching configured
   - Service worker for offline

### Backend Optimization
1. **Database:**
   - Create indexes
   - Connection pooling
   - Query optimization

2. **Caching:**
   - Redis caching
   - HTTP caching headers
   - API response caching

3. **Compression:**
   - Gzip enabled
   - Request compression

---

## Monitoring & Logging

### Application Monitoring
- **Sentry** - Error tracking
- **New Relic** - Performance monitoring
- **DataDog** - Infrastructure monitoring

### Logging Setup
```javascript
// Server logs
console.log('Message'); // Sends to platform logs

// Log to external service
const winston = require('winston');
```

### Health Checks
```bash
# Check API health
curl https://api.genwear.com/api/health
```

---

## Security Checklist for Production

- [ ] Environment variables are secure
- [ ] HTTPS enabled on all endpoints
- [ ] CORS configured properly
- [ ] Rate limiting active
- [ ] Helmet security headers enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Database backups configured
- [ ] Regular security updates

---

## Scaling Strategy

1. **Horizontal Scaling:**
   - Multiple server instances
   - Load balancer (Nginx)
   - Shared database

2. **Vertical Scaling:**
   - Larger server instances
   - More RAM
   - Better CPU

3. **Caching Layer:**
   - Redis for sessions
   - Redis for API caching
   - CDN for static assets

4. **Database Optimization:**
   - Read replicas
   - Sharding
   - Query optimization

---

## Disaster Recovery

1. **Backups:**
   - Daily database backups
   - Monthly full backups
   - Test restore procedures

2. **Monitoring:**
   - Uptime monitoring
   - Alert system
   - Status page

3. **Failover:**
   - Redundant servers
   - Database replication
   - CDN failover

---

## Troubleshooting

### Common Issues

**Application won't start:**
```bash
# Check logs
npm run dev

# Check environment variables
env | grep NODE_ENV
```

**Database connection error:**
```bash
# Test connection
mongosh "mongodb+srv://..."
```

**API requests timing out:**
- Check rate limiting
- Check database load
- Check network latency

---

## Support & Maintenance

- Monitor application health
- Update dependencies regularly
- Security patches immediately
- Performance optimization
- User feedback integration

---

**Version:** 2.0.0  
**Last Updated:** January 24, 2026
