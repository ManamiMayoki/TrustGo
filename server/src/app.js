const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const env = require('./config/environment');
const corsOptions = require('./config/cors');
const { errorHandler, notFoundHandler } = require('./middlewares/errorMiddleware');
const { apiLimiter } = require('./middlewares/rateLimitMiddleware');
const { sanitizeInput } = require('./middlewares/sanitizeMiddleware');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const employerRoutes = require('./routes/employerRoutes');
const jobRoutes = require('./routes/jobRoutes');
const workerRoutes = require('./routes/workerRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const escrowRoutes = require('./routes/escrowRoutes');
const complianceRoutes = require('./routes/complianceRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Trust proxy for Nginx / Docker
app.set('trust proxy', 1);

// HTTP Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: ["'self'", env.CLIENT_URL, 'ws:', 'wss:', 'http://localhost:*'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: env.isProduction ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS
app.use(cors(corsOptions));

// HTTP Request Logging
if (!env.isTest) {
  app.use(morgan(env.isProduction ? 'combined' : 'dev'));
}

// Request Body Parsing & Limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(env.COOKIE_SECRET));

// Gzip Compression
app.use(compression());

// NoSQL Injection Sanitization
app.use(sanitizeInput);

// Static uploads directory (for documents/contracts/photos)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health Check Probe
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: '1.0.0',
  });
});

// Apply Global Rate Limiter to API routes
app.use('/api/', apiLimiter);

// Mount API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/employers', employerRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/workers', workerRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/escrow', escrowRoutes);
app.use('/api/v1/compliance', complianceRoutes);
app.use('/api/v1/admin', adminRoutes);

// Catch 404
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
