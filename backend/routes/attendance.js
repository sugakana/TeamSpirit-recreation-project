const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const attendanceService = require('../services/attendanceService');

/**
 * 月間勤務表取得API
 * GET /api/attendance/monthly
 */
router.get('/monthly', attendanceController.getMonthlyAttendance);

/**
 * 日次勤怠記録取得API
 * GET /api/attendance/daily
 */
router.get('/daily', attendanceController.getDailyAttendance);

/**
 * 勤怠記録更新API
 * PUT /api/attendance/record
 */
router.put('/record', attendanceController.updateAttendanceRecord);

/**
 * 日次確定申請API
 * POST /api/attendance/daily-confirmation
 */
router.post('/daily-confirmation', attendanceController.confirmDailyAttendance);

/**
 * 日次確定申請取消API
 * DELETE /api/attendance/daily-confirmation
 */
router.delete('/daily-confirmation', attendanceController.cancelDailyConfirmation);

/**
 * 当月時間外残業取得API
 * GET /api/attendance/monthly-overtime
 */
router.get('/monthly-overtime', async (req, res, next) => {
  try {
    const { employeeId, year, month } = req.query;
    
    if (!employeeId || !year || !month) {
      return res.status(400).json({
        success: false,
        message: '従業員ID、年、月が必要です。'
      });
    }
    
    const overtimeHours = await attendanceService.getMonthlyOvertimeHours(employeeId, parseInt(year), parseInt(month));
    
    res.json({
      success: true,
      overtimeHours
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 休憩時間登録・更新API
 * POST /api/attendance/break-time
 */
router.post('/break-time', async (req, res, next) => {
  // このエンドポイントは既存のコードを維持するため、後で実装
  res.status(501).json({
    success: false,
    message: 'このエンドポイントは実装中です。'
  });
});

/**
 * 公用外出登録・更新API
 * POST /api/attendance/official-outing
 */
router.post('/official-outing', async (req, res, next) => {
  // このエンドポイントは既存のコードを維持するため、後で実装
  res.status(501).json({
    success: false,
    message: 'このエンドポイントは実装中です。'
  });
});

module.exports = router;
