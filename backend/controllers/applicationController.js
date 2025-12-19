/**
 * 申請コントローラー
 */
const applicationService = require('../services/applicationService');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { validateQuery, validateBody } = require('../utils/validationHelper');

/**
 * 休暇申請
 */
const applyVacation = async (req, res, next) => {
  try {
    const { employeeId, vacationTypeCode, startDate, endDate, reason, contact } = req.body;
    
    const validationError = validateBody(req.body, ['employeeId', 'vacationTypeCode', 'startDate', 'endDate']);
    if (validationError) {
      return sendError(res, '必須項目が不足しています。');
    }
    
    const vacationId = await applicationService.applyVacation({
      employeeId,
      vacationTypeCode,
      startDate,
      endDate,
      reason,
      contact
    });
    
    return sendSuccess(res, { vacationId }, '休暇申請が完了しました。');
  } catch (error) {
    if (error.message.includes('残日数が不足')) {
      return sendError(res, error.message);
    }
    next(error);
  }
};

/**
 * 休日出勤申請
 */
const applyHolidayWork = async (req, res, next) => {
  try {
    const { employeeId, workDate, startTime, endTime, breakHours, reason } = req.body;
    
    const validationError = validateBody(req.body, ['employeeId', 'workDate', 'startTime', 'endTime']);
    if (validationError || breakHours === undefined) {
      return sendError(res, '必須項目が不足しています。');
    }
    
    // バリデーション
    if (startTime >= endTime) {
      return sendError(res, '開始時間は終了時間より前の時刻を入力してください。');
    }
    
    if (breakHours < 0) {
      return sendError(res, '休憩時間を入力してください。');
    }
    
    await applicationService.applyHolidayWork({ 
      employeeId, 
      workDate, 
      startTime, 
      endTime, 
      breakHours, 
      reason 
    });
    
    return sendSuccess(res, {}, '休日出勤申請が完了しました。');
  } catch (error) {
    next(error);
  }
};

/**
 * 残業申請
 */
const applyOvertime = async (req, res, next) => {
  try {
    const { employeeId, startDate, endDate, overtimeHours, reason } = req.body;
    
    const validationError = validateBody(req.body, ['employeeId', 'startDate', 'endDate', 'overtimeHours']);
    if (validationError) {
      return sendError(res, '必須項目が不足しています。');
    }
    
    await applicationService.applyOvertime({ employeeId, startDate, endDate, overtimeHours, reason });
    
    return sendSuccess(res, {}, '残業申請が完了しました。');
  } catch (error) {
    next(error);
  }
};

/**
 * 早朝勤務申請
 */
const applyEarlyWork = async (req, res, next) => {
  try {
    const { employeeId, startDate, endDate, reason } = req.body;
    
    const validationError = validateBody(req.body, ['employeeId', 'startDate', 'endDate']);
    if (validationError) {
      return sendError(res, '必須項目が不足しています。');
    }
    
    await applicationService.applyEarlyWork({ employeeId, startDate, endDate, reason });
    
    return sendSuccess(res, {}, '早朝勤務申請が完了しました。');
  } catch (error) {
    next(error);
  }
};

/**
 * 振替申請
 */
const applyTransfer = async (req, res, next) => {
  try {
    const { employeeId, fromDate, toDate, reason } = req.body;
    
    const validationError = validateBody(req.body, ['employeeId', 'fromDate', 'toDate']);
    if (validationError) {
      return sendError(res, '必須項目が不足しています。');
    }
    
    await applicationService.applyTransfer({ employeeId, fromDate, toDate, reason });
    
    return sendSuccess(res, {}, '振替申請が完了しました。');
  } catch (error) {
    if (error.message.includes('異なる日付')) {
      return sendError(res, error.message);
    }
    next(error);
  }
};

/**
 * 休日出勤申請状態取得
 */
const getHolidayWorkStatus = async (req, res, next) => {
  try {
    const { employeeId, targetDate } = req.query;
    
    const validationError = validateQuery(req.query, ['employeeId', 'targetDate']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    const result = await applicationService.getHolidayWorkStatus(employeeId, targetDate);
    
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * 月次承認履歴取得
 */
const getMonthlyApprovalHistory = async (req, res, next) => {
  try {
    const { employeeId, year, month } = req.query;
    
    const validationError = validateQuery(req.query, ['employeeId', 'year', 'month']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    const result = await applicationService.getMonthlyApprovalHistory(
      employeeId,
      parseInt(year),
      parseInt(month)
    );
    
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * 月次確定申請取消
 */
const cancelMonthlyApproval = async (req, res, next) => {
  try {
    const { employeeId, year, month } = req.body;
    
    const validationError = validateBody(req.body, ['employeeId', 'year', 'month']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    await applicationService.cancelMonthlyApproval(employeeId, parseInt(year), parseInt(month));
    
    return sendSuccess(res, {}, '月次確定申請を取り消しました。');
  } catch (error) {
    if (error.message.includes('申請中の月次確定のみ')) {
      return sendError(res, error.message);
    }
    next(error);
  }
};

/**
 * 休暇情報取得
 */
const getVacationInfo = async (req, res, next) => {
  try {
    const { employeeId } = req.query;
    
    const validationError = validateQuery(req.query, ['employeeId']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    const result = await applicationService.getVacationInfo(employeeId);
    
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * 申請状態取得
 */
const getApplicationStatus = async (req, res, next) => {
  try {
    const { employeeId, applicationType, targetDate } = req.query;
    
    const validationError = validateQuery(req.query, ['employeeId', 'applicationType', 'targetDate']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    const result = await applicationService.getApplicationStatus(employeeId, applicationType, targetDate);
    
    return sendSuccess(res, {
      status: result.status,
      applicationId: result.applicationId
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 申請情報取得
 */
const getApplicationInfo = async (req, res, next) => {
  try {
    const { employeeId, applicationType, targetDate } = req.query;
    
    const validationError = validateQuery(req.query, ['employeeId', 'applicationType', 'targetDate']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    const applicationInfo = await applicationService.getApplicationInfo(
      employeeId,
      applicationType,
      targetDate
    );
    
    if (!applicationInfo) {
      return sendSuccess(res, {
        applicationDate: null,
        status: null,
        history: []
      });
    }
    
    return sendSuccess(res, {
      applicationId: applicationInfo.applicationId,
      applicationDate: applicationInfo.applicationDate,
      status: applicationInfo.status,
      history: applicationInfo.history,
      applicationData: applicationInfo.applicationData || null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 申請取消
 */
const cancelApplication = async (req, res, next) => {
  try {
    const { employeeId, applicationType, applicationId, targetDate } = req.body;
    
    const validationError = validateBody(req.body, ['employeeId', 'applicationType']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    // 日次確定の場合はtargetDateが必要
    if (applicationType === 'DAILY_CONFIRMATION' && !targetDate) {
      return sendError(res, '対象日が必要です。');
    }
    
    // その他の申請タイプの場合はapplicationIdが必要
    if (applicationType !== 'DAILY_CONFIRMATION' && !applicationId) {
      return sendError(res, '申請IDが必要です。');
    }
    
    await applicationService.cancelApplication(employeeId, applicationType, applicationId, targetDate);
    
    return sendSuccess(res, {}, '申請を取り消しました。');
  } catch (error) {
    if (error.message.includes('月次申請を行っている場合')) {
      return sendError(res, error.message);
    }
    next(error);
  }
};

module.exports = {
  applyVacation,
  applyHolidayWork,
  applyOvertime,
  applyEarlyWork,
  applyTransfer,
  getHolidayWorkStatus,
  getMonthlyApprovalHistory,
  cancelMonthlyApproval,
  getVacationInfo,
  getApplicationStatus,
  getApplicationInfo,
  cancelApplication
};


