const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const applicationService = require('../services/applicationService');

/**
 * 休暇情報取得API
 * GET /api/application/vacation-info
 */
router.get('/vacation-info', applicationController.getVacationInfo);

/**
 * 有給残日数取得API
 * GET /api/application/vacation/balance
 */
router.get('/vacation/balance', async (req, res, next) => {
  try {
    const { employeeId, vacationTypeCode } = req.query;
    
    if (!employeeId || !vacationTypeCode) {
      return res.status(400).json({
        success: false,
        message: '従業員IDと休暇種別コードが必要です。'
      });
    }
    
    const balance = await applicationService.getVacationBalance(employeeId, vacationTypeCode);
    
    res.json({
      success: true,
      balance
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 休暇申請API
 * POST /api/application/vacation/apply
 */
router.post('/vacation/apply', applicationController.applyVacation);

/**
 * 休日出勤申請API
 * POST /api/application/holiday-work
 */
router.post('/holiday-work', applicationController.applyHolidayWork);

/**
 * 休日出勤申請状態取得API
 * GET /api/application/holiday-work-status
 */
router.get('/holiday-work-status', applicationController.getHolidayWorkStatus);

/**
 * 休日出勤申請リスト取得API（代休取得可能日数計算用）
 * GET /api/application/holiday-work-list
 */
router.get('/holiday-work-list', async (req, res, next) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    
    if (!employeeId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: '従業員ID、開始日、終了日が必要です。'
      });
    }
    
    const applicationModel = require('../models/applicationModel');
    const applications = await applicationModel.getApplicationsByType(
      employeeId,
      'HOLIDAY_WORK',
      startDate,
      endDate
    );
    
    res.json({
      success: true,
      applications
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 申請状態取得API
 * GET /api/application/application-status
 */
router.get('/application-status', applicationController.getApplicationStatus);

/**
 * 申請情報取得API
 * GET /api/application/application-info
 */
router.get('/application-info', applicationController.getApplicationInfo);

/**
 * 申請取消API
 * DELETE /api/application/application
 */
router.delete('/application', applicationController.cancelApplication);

/**
 * 月次承認履歴取得API
 * GET /api/application/monthly-approval-history
 */
router.get('/monthly-approval-history', applicationController.getMonthlyApprovalHistory);

/**
 * 月次確定申請取消API
 * POST /api/application/monthly-approval/cancel
 */
router.post('/monthly-approval/cancel', applicationController.cancelMonthlyApproval);

/**
 * 残業申請API
 * POST /api/application/overtime
 */
router.post('/overtime', applicationController.applyOvertime);

/**
 * 早朝勤務申請API
 * POST /api/application/early-work
 */
router.post('/early-work', applicationController.applyEarlyWork);

/**
 * 振替申請API
 * POST /api/application/transfer
 */
router.post('/transfer', applicationController.applyTransfer);

module.exports = router;

