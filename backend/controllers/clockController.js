/**
 * 打刻コントローラー
 */
const clockService = require('../services/clockService');

/**
 * 出勤打刻
 */
const clockIn = async (req, res, next) => {
  try {
    const { employeeId, workLocationCode } = req.body;
    
    if (!employeeId || !workLocationCode) {
      return res.status(400).json({
        success: false,
        message: '従業員IDと勤務場所コードが必要です。'
      });
    }
    
    await clockService.clockIn(employeeId, workLocationCode);
    
    res.json({
      success: true,
      message: '出勤打刻が完了しました。'
    });
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
    
    if (!employeeId || !workLocationCode) {
      return res.status(400).json({
        success: false,
        message: '従業員IDと勤務場所コードが必要です。'
      });
    }
    
    await clockService.clockInScheduled(employeeId, workLocationCode);
    
    res.json({
      success: true,
      message: '定時出勤打刻が完了しました。'
    });
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
    
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: '従業員IDが必要です。'
      });
    }
    
    const result = await clockService.clockOut(employeeId, workLocationCode);
    
    let message = '退勤打刻が完了しました。';

    if (result.isOnBreak) {
      message = '休憩開始を記録しました。';
    }

    res.json({
      success: true,
      message: message,
      isOnBreak: result.isOnBreak
    });
  } catch (error) {
    if (error.message === '出勤打刻が記録されていません。') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
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
    
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: '従業員IDが必要です。'
      });
    }
    
    await clockService.clockOutScheduled(employeeId, workLocationCode);
    
    res.json({
      success: true,
      message: '定時退勤打刻が完了しました。'
    });
  } catch (error) {
    if (error.message === '出勤打刻が記録されていません。') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
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
    
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: '従業員IDが必要です。'
      });
    }
    
    const attendance = await clockService.getTodayAttendance(employeeId);
    
    res.json({
      success: true,
      attendance
    });
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


