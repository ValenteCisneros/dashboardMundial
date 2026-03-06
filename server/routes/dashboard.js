const express = require('express');
const { getDashboard } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/', getDashboard);
router.post('/', getDashboard);

module.exports = router;
