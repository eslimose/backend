const express = require('express');
const { getFinancialData, addFinancialData } = require('../controllers/financialDataController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getFinancialData);
router.post('/', authMiddleware, addFinancialData);

module.exports = router;
