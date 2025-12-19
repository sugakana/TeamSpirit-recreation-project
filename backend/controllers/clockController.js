/**
 * 打刻コントローラー
 */
const clockService = require('../services/clockService');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { validateBody, validateQuery } = require('../utils/validationHelper');

/**
 * 出勤打刻
 */
const clockIn = async (req, res, next) => {
  try {
    const { employeeId, workLocationCode } = req.body;
    
    const validationError = validateBody(req.body, ['employeeId', 'workLocationCode']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    await clockService.clockIn(employeeId, workLocationCode);
    
    return sendSuccess(res, {}, '出勤打刻が完了しました。');
  } catch (error) {
    next(error);
  }
};

/**
 * 定時出勤打刻
 */
const clockInScheduled = async (req, res, next) => {
  try {
    const { employeeId, workLocationCode } = req.body;
    
    const validationError = validateBody(req.body, ['employeeId', 'workLocationCode']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    await clockService.clockInScheduled(employeeId, workLocationCode);
    
    return sendSuccess(res, {}, '定時出勤打刻が完了しました。');
  } catch (error) {
    next(error);
  }
};

/**
 * 退勤打刻
 */
const clockOut = async (req, res, next) => {
  try {
    const { employeeId, workLocationCode } = req.body;
    
    const validationError = validateBody(req.body, ['employeeId']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    const result = await clockService.clockOut(employeeId, workLocationCode);
    
    let message = '退勤打刻が完了しました。';

    if (result.isOnBreak) {
      message = '休憩開始を記録しました。';
    }

    return sendSuccess(res, { isOnBreak: result.isOnBreak }, message);
  } catch (error) {
    if (error.message === '出勤打刻が記録されていません。') {
      return sendError(res, error.message);
    }
    next(error);
  }
};

/**
 * 定時退勤打刻
 */
const clockOutScheduled = async (req, res, next) => {
  try {
    const { employeeId, workLocationCode } = req.body;
    
    const validationError = validateBody(req.body, ['employeeId']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    await clockService.clockOutScheduled(employeeId, workLocationCode);
    
    return sendSuccess(res, {}, '定時退勤打刻が完了しました。');
  } catch (error) {
    if (error.message === '出勤打刻が記録されていません。') {
      return sendError(res, error.message);
    }
    next(error);
  }
};

/**
 * 当日勤怠情報取得
 */
const getTodayAttendance = async (req, res, next) => {
  try {
    const { employeeId } = req.query;
    
    const validationError = validateQuery(req.query, ['employeeId']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    const attendance = await clockService.getTodayAttendance(employeeId);
    
    return sendSuccess(res, { attendance });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  clockIn,
  clockInScheduled,
  clockOut,
  clockOutScheduled,
  getTodayAttendance
};


