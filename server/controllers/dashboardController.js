const dashboardService = require('../services/dashboardService');
const asyncHandler = require('../utils/asyncHandler');

const getDashboard = asyncHandler(async (req, res) => {
  const filters = {
    dateRange: req.query.preset ? { preset: req.query.preset, label: req.query.label || req.query.preset } : req.body?.dateRange || { preset: 'last_7_days', label: 'Últimos 7 días' },
    compareToPrevious: req.body?.compareToPrevious ?? false,
  };
  const data = await dashboardService.getDashboardData(filters);
  res.json(data);
});

module.exports = { getDashboard };
