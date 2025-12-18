/**
 * 打刻サービス
 */
const attendanceModel = require('../models/attendanceModel');
const breakTimeModel = require('../models/breakTimeModel');
const { getTodayJST, getNow, toDateTime } = require('../utils/dateUtils');

/**
 * 出勤打刻
 * @param {string} employeeId - 従業員ID
 * @param {string} workLocationCode - 勤務場所コード
 * @returns {Promise<void>}
 */
const clockIn = async (employeeId, workLocationCode) => {
  const today = getTodayJST();
  const now = getNow();
  
  // 当日の勤怠記録を確認
  const existing = await attendanceModel.getAttendanceByDate(employeeId, today);
  
  if (existing) {
    // 既存レコードを更新（中断後の再開の場合）
    await attendanceModel.updateAttendance(existing.ATTENDANCE_ID, {
      clockInTime: now,
      clockInType: 'STAMP',
      workLocationCode,
      updatedAt: now
    });
    
    // 中断中の場合、休憩終了を記録
    const activeBreak = await breakTimeModel.getActiveBreak(existing.ATTENDANCE_ID);
    if (activeBreak) {
      const breakDuration = Math.floor((now - new Date(activeBreak.BREAK_START_TIME)) / 1000 / 60);
      await breakTimeModel.updateBreakTime(activeBreak.BREAK_ID, {
        breakEndTime: now,
        breakDurationMinutes: breakDuration,
        updatedAt: now
      });
    }
  } else {
    // 新規レコードを作成
    await attendanceModel.createAttendance({
      employeeId,
      workDate: today,
      clockInTime: now,
      clockInType: 'STAMP',
      workLocationCode,
      createdAt: now,
      updatedAt: now
    });
  }
};

/**
 * 定時出勤打刻
 * @param {string} employeeId - 従業員ID
 * @param {string} workLocationCode - 勤務場所コード
 * @returns {Promise<void>}
 */
const clockInScheduled = async (employeeId, workLocationCode) => {
  const today = getTodayJST();
  const scheduledTime = new Date(`${today}T09:00:00`);
  const now = getNow();
  
  const existing = await attendanceModel.getAttendanceByDate(employeeId, today);
  
  if (existing) {
    await attendanceModel.updateAttendance(existing.ATTENDANCE_ID, {
      clockInTime: scheduledTime,
      clockInType: 'SCHEDULED',
      workLocationCode,
      updatedAt: now
    });
  } else {
    await attendanceModel.createAttendance({
      employeeId,
      workDate: today,
      clockInTime: scheduledTime,
      clockInType: 'SCHEDULED',
      workLocationCode,
      createdAt: now,
      updatedAt: now
    });
  }
};

/**
 * 退勤打刻
 * @param {string} employeeId - 従業員ID
 * @param {string} workLocationCode - 勤務場所コード
 * @returns {Promise<Object>} 結果（isOnBreakフラグ含む）
 */
const clockOut = async (employeeId, workLocationCode) => {
  const today = getTodayJST();
  const now = getNow();
  
  // 当日の勤怠記録を取得
  const attendance = await attendanceModel.getAttendanceByDate(employeeId, today);
  
  if (!attendance) {
    throw new Error('出勤打刻が記録されていません。');
  }
  
  const attendanceId = attendance.ATTENDANCE_ID;
  
  // 中断中かどうかを確認
  const activeBreak = await breakTimeModel.getActiveBreak(attendanceId);
  
  if (activeBreak) {
    // 既に中断中の場合、休憩終了 + 退勤時刻記録
    const breakDuration = Math.floor((now - new Date(activeBreak.BREAK_START_TIME)) / 1000 / 60);
    await breakTimeModel.updateBreakTime(activeBreak.BREAK_ID, {
      breakEndTime: now,
      breakDurationMinutes: breakDuration,
      updatedAt: now
    });
    
    // 退勤時刻も記録
    await attendanceModel.updateAttendance(attendanceId, {
      clockOutTime: now,
      clockOutType: 'STAMP',
      workLocationCode: workLocationCode || null,
      updatedAt: now
    });
    
    return { isOnBreak: false };
  } else {
    // 中断中でない場合、中断開始（休憩開始）を記録
    const maxSeq = await breakTimeModel.getMaxBreakSeq(attendanceId);
    const breakSeq = maxSeq + 1;
    
    await breakTimeModel.createBreakTime({
      attendanceId,
      breakSeq,
      breakStartTime: now,
      breakEndTime: null,
      breakDurationMinutes: null,
      breakType: 'REGULAR',
      createdAt: now,
      updatedAt: now
    });
    
    return { isOnBreak: true };
  }
};

/**
 * 定時退勤打刻
 * @param {string} employeeId - 従業員ID
 * @param {string} workLocationCode - 勤務場所コード
 * @returns {Promise<void>}
 */
const clockOutScheduled = async (employeeId, workLocationCode) => {
  const today = getTodayJST();
  const scheduledTime = new Date(`${today}T17:30:00`);
  const now = getNow();
  
  const attendance = await attendanceModel.getAttendanceByDate(employeeId, today);
  
  if (!attendance) {
    throw new Error('出勤打刻が記録されていません。');
  }
  
  await attendanceModel.updateAttendance(attendance.ATTENDANCE_ID, {
    clockOutTime: scheduledTime,
    clockOutType: 'SCHEDULED',
    workLocationCode: workLocationCode || null,
    updatedAt: now
  });
};

/**
 * 当日の勤怠情報を取得
 * @param {string} employeeId - 従業員ID
 * @returns {Promise<Object|null>} 勤怠情報
 */
const getTodayAttendance = async (employeeId) => {
  const today = getTodayJST();
  const attendance = await attendanceModel.getAttendanceByDate(employeeId, today);
  
  if (!attendance) {
    return null;
  }
  
  // 中断中かどうかを確認
  const activeBreak = await breakTimeModel.getActiveBreak(attendance.ATTENDANCE_ID);
  const isOnBreak = !!activeBreak;
  
  return {
    attendanceId: attendance.ATTENDANCE_ID,
    clockInTime: attendance.CLOCK_IN_TIME,
    clockOutTime: attendance.CLOCK_OUT_TIME,
    workLocationCode: attendance.WORK_LOCATION_CODE,
    isOnBreak
  };
};

module.exports = {
  clockIn,
  clockInScheduled,
  clockOut,
  clockOutScheduled,
  getTodayAttendance
};




