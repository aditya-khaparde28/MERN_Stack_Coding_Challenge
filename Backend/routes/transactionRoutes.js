const express = require('express');
const {
    initializeDB,
    getTransactions,
    getStatistics,
    getBarChartData,
    getPieChartData,
    getCombinedData
} = require('../controllers/transactionController');
const router = express.Router();

router.get('/initialize', initializeDB);
router.get('/transactions', getTransactions);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChartData);
router.get('/pie-chart', getPieChartData);
router.get('/combined-data',getCombinedData);

module.exports = router;
