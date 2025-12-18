const express = require('express');
const router = express.Router();
const monthlySummaryController = require('../controllers/monthlySummaryController');

/**
 * 月次サマリー取得API（月次サマリー情報画面用）
 * GET /api/monthly-summary/detail
 */
router.get('/detail', monthlySummaryController.getMonthlySummary);

module.exports = router;

