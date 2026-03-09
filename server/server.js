const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { connect } = require('./config/database');
const { port } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const logger = require('./utils/logger');

const dashboardRoutes = require('./routes/dashboard');
const visitorRoutes = require('./routes/visitors');
const sessionRoutes = require('./routes/sessions');
const eventRoutes = require('./routes/events');
const contentViewRoutes = require('./routes/contentViews');
const advertiserRoutes = require('./routes/advertisers');
const adRoutes = require('./routes/ads');
const adImpressionRoutes = require('./routes/adImpressions');
const leadRoutes = require('./routes/leads');
const placeRoutes = require('./routes/places');
const matchRoutes = require('./routes/matches');

const app = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  })
);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests' } },
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));

// Logging
app.use(morgan('combined', { stream: { write: (line) => logger.info(line.trim()) } }));

// API routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/content-views', contentViewRoutes);
app.use('/api/advertisers', advertiserRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/ad-impressions', adImpressionRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/matches', matchRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

connect()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    logger.error('Database connection failed', { error: err.message });
    process.exit(1);
  });
