/**
 * 申請コントローラー
 */
const applicationService = require('../services/applicationService');

/**
 * 休暇申請
 */
const applyVacation = async (req, res, next) => {
  try {
    const { employeeId, vacationTypeCode, startDate, endDate, reason, contact } = req.body;
    
    if (!employeeId || !vacationTypeCode || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: '必須項目が不足しています。'
      });
    }
    
    const vacationId = await applicationService.applyVacation({
      employeeId,
      vacationTypeCode,
      startDate,
      endDate,
      reason,
      contact
    });
    
    res.json({
      success: true,
      message: '休暇申請が完了しました。',
      vacationId
    });
  } catch (error) {
    if (error.message.includes('残日数が不足')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
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
    
    if (!employeeId || !workDate || !startTime || !endTime || breakHours === undefined) {
      return res.status(400).json({
        success: false,
        message: '必須項目が不足しています。'
      });
    }
    
    // バリデーション
    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: '開始時間は終了時間より前の時刻を入力してください。'
      });
    }
    
    if (breakHours < 0) {
      return res.status(400).json({
        success: false,
        message: '休憩時間を入力してください。'
      });
    }
    
    await applicationService.applyHolidayWork({ 
      employeeId, 
      workDate, 
      startTime, 
      endTime, 
      breakHours, 
      reason 
    });
    
    res.json({
      success: true,
      message: '休日出勤申請が完了しました。'
    });
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
    
    if (!employeeId || !startDate || !endDate || !overtimeHours) {
      return res.status(400).json({
        success: false,
        message: '必須項目が不足しています。'
      });
    }
    
    await applicationService.applyOvertime({ employeeId, startDate, endDate, overtimeHours, reason });
    
    res.json({
      success: true,
      message: '残業申請が完了しました。'
    });
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
    
    if (!employeeId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: '必須項目が不足しています。'
      });
    }
    
    await applicationService.applyEarlyWork({ employeeId, startDate, endDate, reason });
    
    res.json({
      success: true,
      message: '早朝勤務申請が完了しました。'
    });
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
    
    if (!employeeId || !fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: '必須項目が不足しています。'
      });
    }
    
    await applicationService.applyTransfer({ employeeId, fromDate, toDate, reason });
    
    res.json({
      success: true,
      message: '振替申請が完了しました。'
    });
  } catch (error) {
    if (error.message.includes('異なる日付')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
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
    
    if (!employeeId || !targetDate) {
      return res.status(400).json({
        success: false,
        message: '従業員IDと対象日が必要です。'
      });
    }
    
    const result = await applicationService.getHolidayWorkStatus(employeeId, targetDate);
    
    res.json({
      success: true,
      ...result
    });
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
    
    if (!employeeId || !year || !month) {
      return res.status(400).json({
        success: false,
        message: '従業員ID、年、月が必要です。'
      });
    }
    
    const result = await applicationService.getMonthlyApprovalHistory(
      employeeId,
      parseInt(year),
      parseInt(month)
    );
    
    res.json({
      success: true,
      ...result
    });
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
    
    if (!employeeId || !year || !month) {
      return res.status(400).json({
        success: false,
        message: '従業員ID、年、月が必要です。'
      });
    }
    
    await applicationService.cancelMonthlyApproval(employeeId, parseInt(year), parseInt(month));
    
    res.json({
      success: true,
      message: '月次確定申請を取り消しました。'
    });
  } catch (error) {
    if (error.message.includes('申請中の月次確定のみ')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
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
    
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: '従業員IDが必要です。'
      });
    }
    
    const result = await applicationService.getVacationInfo(employeeId);
    
    res.json({
      success: true,
      ...result
    });
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
    
    if (!employeeId || !applicationType || !targetDate) {
      return res.status(400).json({
        success: false,
        message: '従業員ID、申請タイプ、対象日が必要です。'
      });
    }
    
    const result = await applicationService.getApplicationStatus(employeeId, applicationType, targetDate);
    
    res.json({
      success: true,
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
    
    if (!employeeId || !applicationType || !targetDate) {
      return res.status(400).json({
        success: false,
        message: '従業員ID、申請タイプ、対象日が必要です。'
      });
    }
    
    const applicationInfo = await applicationService.getApplicationInfo(
      employeeId,
      applicationType,
      targetDate
    );
    
    if (!applicationInfo) {
      return res.json({
        success: true,
        applicationDate: null,
        status: null,
        history: []
      });
    }
    
    res.json({
      success: true,
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
    
    if (!employeeId || !applicationType) {
      return res.status(400).json({
        success: false,
        message: '従業員IDと申請タイプが必要です。'
      });
    }
    
    // 日次確定の場合はtargetDateが必要
    if (applicationType === 'DAILY_CONFIRMATION' && !targetDate) {
      return res.status(400).json({
        success: false,
        message: '対象日が必要です。'
      });
    }
    
    // その他の申請タイプの場合はapplicationIdが必要
    if (applicationType !== 'DAILY_CONFIRMATION' && !applicationId) {
      return res.status(400).json({
        success: false,
        message: '申請IDが必要です。'
      });
    }
    
    await applicationService.cancelApplication(employeeId, applicationType, applicationId, targetDate);
    
    res.json({
      success: true,
      message: '申請を取り消しました。'
    });
  } catch (error) {
    if (error.message.includes('月次申請を行っている場合')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
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


