/**
 * 勤怠コントローラー
 */
const attendanceService = require('../services/attendanceService');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { validateQuery, validateBody } = require('../utils/validationHelper');

/**
 * 日次勤怠記録を取得する。
 *
 * @param {Object} req リクエストオブジェクト
 * @param {Object} res レスポンスオブジェクト
 * @param {Function} next 次のミドルウェア関数
 */
const getDailyAttendance = async (req, res, next) => {
  try {
    const { employeeId, workDate } = req.query;
    
    const validationError = validateQuery(req.query, ['employeeId', 'workDate']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    const attendance = await attendanceService.getDailyAttendance(employeeId, workDate);
    
    return sendSuccess(res, { attendance });
  } catch (error) {
    next(error);
  }
};

/**
 * 勤怠記録を更新する。
 *
 * @param {Object} req リクエストオブジェクト
 * @param {Object} res レスポンスオブジェクト
 * @param {Function} next 次のミドルウェア関数
 */
const updateAttendanceRecord = async (req, res, next) => {
  try {
    const updateData = req.body;
    
    // 大文字のスネークケース（EMPLOYEE_ID, WORK_DATE）と小文字のキャメルケース（employeeId, workDate）の両方に対応
    const employeeId = updateData.employeeId || updateData.EMPLOYEE_ID;
    const workDate = updateData.workDate || updateData.WORK_DATE;

    if (!employeeId || !workDate) {
      return sendError(res, '従業員IDと勤務日が必要です。');
    }
    
    // 小文字のキャメルケースに統一してサービスに渡す
    const normalizedData = {
      ...updateData,
      employeeId: employeeId,
      workDate: workDate,
      attendanceId: updateData.attendanceId || updateData.ATTENDANCE_ID,
      clockInTime: updateData.clockInTime || updateData.CLOCK_IN_TIME,
      clockOutTime: updateData.clockOutTime || updateData.CLOCK_OUT_TIME,
      clockInType: updateData.clockInType || updateData.CLOCK_IN_TYPE,
      clockOutType: updateData.clockOutType || updateData.CLOCK_OUT_TYPE,
      workLocationCode: updateData.workLocationCode || updateData.WORK_LOCATION_CODE,
      remarkText: updateData.remarkText || updateData.REMARK_TEXT,
      isClockInManual: updateData.isClockInManual,
      isClockOutManual: updateData.isClockOutManual,
      breakTimes: updateData.breakTimes
    };
    
    const attendance = await attendanceService.updateAttendanceRecord(normalizedData);
    
    return sendSuccess(res, { attendance }, '勤怠記録を更新しました。');
  } catch (error) {
    next(error);
  }
};

/**
 * 月間勤務表を取得する。
 *
 * @param {Object} req リクエストオブジェクト
 * @param {Object} res レスポンスオブジェクト
 * @param {Function} next 次のミドルウェア関数
 */
const getMonthlyAttendance = async (req, res, next) => {
  try {
    const { employeeId, year, month } = req.query;
    
    const validationError = validateQuery(req.query, ['employeeId', 'year', 'month']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    const result = await attendanceService.getMonthlyAttendance(
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
 * 日次確定申請を行う。
 *
 * @param {Object} req リクエストオブジェクト
 * @param {Object} res レスポンスオブジェクト
 * @param {Function} next 次のミドルウェア関数
 */
const confirmDailyAttendance = async (req, res, next) => {
  try {
    const { employeeId, workDate } = req.body;
    
    const validationError = validateBody(req.body, ['employeeId', 'workDate']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    await attendanceService.confirmDailyAttendance(employeeId, workDate);
    
    return sendSuccess(res, {}, '日次確定申請が完了しました。');
  } catch (error) {
    if (error.message.includes('出退社時刻') || error.message.includes('勤務場所') ||
        error.message.includes('備考') || error.message.includes('工数')) {
      return sendError(res, error.message);
    }

    next(error);
  }
};

/**
 * 日次確定申請を取り消す。
 *
 * @param {Object} req リクエストオブジェクト
 * @param {Object} res レスポンスオブジェクト
 * @param {Function} next 次のミドルウェア関数
 */
const cancelDailyConfirmation = async (req, res, next) => {
  try {
    const { employeeId, workDate } = req.body;
    
    const validationError = validateBody(req.body, ['employeeId', 'workDate']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    await attendanceService.cancelDailyConfirmation(employeeId, workDate);
    
    return sendSuccess(res, {}, '日次確定申請を取り消しました。');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDailyAttendance,
  updateAttendanceRecord,
  getMonthlyAttendance,
  confirmDailyAttendance,
  cancelDailyConfirmation
};

