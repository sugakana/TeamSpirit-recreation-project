const express = require('express');
const router = express.Router();
const clockController = require('../controllers/clockController');

/**
 * 当日勤怠情報取得API
 * GET /api/clock/today
 */
router.get('/today', clockController.getTodayAttendance);

/**
 * 出勤打刻API
 * POST /api/clock/clock-in
 */
router.post('/clock-in', clockController.clockIn);

/**
 * 定時出勤打刻API
 * POST /api/clock/clock-in-scheduled
 */
router.post('/clock-in-scheduled', clockController.clockInScheduled);

/**
 * 退勤打刻API
 * POST /api/clock/clock-out
 */
router.post('/clock-out', clockController.clockOut);

/**
 * 定時退勤打刻API
 * POST /api/clock/clock-out-scheduled
 */
router.post('/clock-out-scheduled', clockController.clockOutScheduled);

module.exports = router;

