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
const logger = require('./utils/logger');
const { getDashboardData } = require('./services/dashboardService');

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests' } },
}));
app.use(express.json({ limit: '10kb' }));
app.use(morgan('combined', { stream: { write: (line) => logger.info(line.trim()) } }));

// API Routes
app.get('/api/health', (req, res) => {
  console.log('✅ /api/health llamado');
  res.json({ success: true, status: 'ok' });
});

app.get('/api/dashboard', async (req, res) => {
  console.log('✅ /api/dashboard GET llamado');
  try {
    const data = await getDashboardData(req.query);
    console.log('✅ Datos obtenidos, enviando respuesta');
    res.json(data);
  } catch (err) {
    console.error('❌ Error en /api/dashboard:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/dashboard', async (req, res) => {
  console.log('✅ /api/dashboard POST llamado');
  try {
    const data = await getDashboardData(req.body);
    console.log('✅ Datos obtenidos, enviando respuesta');
    res.json(data);
  } catch (err) {
    console.error('❌ Error en /api/dashboard:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Static files
const buildPath = path.join(__dirname, '../build');
app.use(express.static(buildPath));
app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));

app.use(errorHandler);

connect().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log('🚀 Servidor iniciado');
    console.log(`📍 Puerto: ${port}`);
    console.log(`📍 URL: http://0.0.0.0:${port}`);
    console.log('📍 Rutas disponibles:');
    console.log('   - GET  /api/health');
    console.log('   - GET  /api/dashboard');
    console.log('   - POST /api/dashboard');
    logger.info(`✅ Server listening on 0.0.0.0:${port}`);
  });
});
