/**
 * 勤怠コントローラー
 */
const attendanceService = require('../services/attendanceService');

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
    
    if (!employeeId || !workDate) {
      return res.status(400).json({
        success: false,
        message: '従業員IDと勤務日が必要です。'
      });
    }
    
    const attendance = await attendanceService.getDailyAttendance(employeeId, workDate);
    
    res.json({
      success: true,
      attendance
    });
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
      return res.status(400).json({
        success: false,
        message: '従業員IDと勤務日が必要です。'
      });
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
    
    res.json({
      success: true,
      message: '勤怠記録を更新しました。',
      attendance
    });
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
    
    if (!employeeId || !year || !month) {
      return res.status(400).json({
        success: false,
        message: '従業員ID、年、月が必要です。'
      });
    }
    
    const result = await attendanceService.getMonthlyAttendance(
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
 * 日次確定申請を行う。
 *
 * @param {Object} req リクエストオブジェクト
 * @param {Object} res レスポンスオブジェクト
 * @param {Function} next 次のミドルウェア関数
 */
const confirmDailyAttendance = async (req, res, next) => {
  try {
    const { employeeId, workDate } = req.body;
    
    if (!employeeId || !workDate) {
      return res.status(400).json({
        success: false,
        message: '従業員IDと勤務日が必要です。'
      });
    }
    
    await attendanceService.confirmDailyAttendance(employeeId, workDate);
    
    res.json({
      success: true,
      message: '日次確定申請が完了しました。'
    });
  } catch (error) {
    if (error.message.includes('出退社時刻') || error.message.includes('勤務場所') ||
        error.message.includes('備考') || error.message.includes('工数')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
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
    
    if (!employeeId || !workDate) {
      return res.status(400).json({
        success: false,
        message: '従業員IDと勤務日が必要です。'
      });
    }
    
    await attendanceService.cancelDailyConfirmation(employeeId, workDate);
    
    res.json({
      success: true,
      message: '日次確定申請を取り消しました。'
    });
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

