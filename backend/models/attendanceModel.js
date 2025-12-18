/**
 * 勤怠記録モデル
 */
const db = require('../config/database');

/**
 * 当日の勤怠記録を取得する。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} workDate 勤務日（YYYY-MM-DD形式）
 * @returns {Promise<Object|null>} 勤怠記録
 */
const getAttendanceByDate = async (employeeId, workDate) => {
  const query = `
    SELECT ATTENDANCE_ID, CLOCK_IN_TIME, CLOCK_OUT_TIME, WORK_LOCATION_CODE
    FROM ATTENDANCE_RECORD
    WHERE EMPLOYEE_ID = ? AND WORK_DATE = ?
    LIMIT 1
  `;
  
  const [rows] = await db.execute(query, [employeeId, workDate]);

  if (rows.length > 0) {
    return rows[0];
  }

  return null;
};

/**
 * 勤怠記録を取得する（詳細情報含む）。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} workDate 勤務日（YYYY-MM-DD形式）
 * @returns {Promise<Object|null>} 勤怠記録
 */
const getAttendanceDetail = async (employeeId, workDate) => {
  const query = `
    SELECT 
      ATTENDANCE_ID,
      EMPLOYEE_ID,
      WORK_DATE,
      CLOCK_IN_TIME,
      CLOCK_OUT_TIME,
      CLOCK_IN_TYPE,
      CLOCK_OUT_TYPE,
      ORIGINAL_CLOCK_IN_TIME,
      ORIGINAL_CLOCK_OUT_TIME,
      WORK_LOCATION_CODE,
      ACTUAL_WORK_HOURS,
      SCHEDULED_WORK_HOURS,
      APPROVAL_STATUS,
      REMARK_TEXT,
      IS_DAILY_CONFIRMED,
      DAILY_CONFIRMED_AT,
      CREATED_AT,
      UPDATED_AT
    FROM ATTENDANCE_RECORD
    WHERE EMPLOYEE_ID = ? AND WORK_DATE = ?
  `;
  
  const [rows] = await db.execute(query, [employeeId, workDate]);

  if (rows.length > 0) {
    return rows[0];
  }

  return null;
};

/**
 * 月間勤怠記録を取得する。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} startDate 開始日（YYYY-MM-DD形式）
 * @param {string} endDate 終了日（YYYY-MM-DD形式）
 * @returns {Promise<Array>} 勤怠記録の配列
 */
const getMonthlyAttendance = async (employeeId, startDate, endDate) => {
  const query = `
    SELECT 
      ar.ATTENDANCE_ID,
      ar.EMPLOYEE_ID,
      ar.WORK_DATE,
      ar.CLOCK_IN_TIME,
      ar.CLOCK_OUT_TIME,
      ar.CLOCK_IN_TYPE,
      ar.CLOCK_OUT_TYPE,
      ar.ORIGINAL_CLOCK_IN_TIME,
      ar.ORIGINAL_CLOCK_OUT_TIME,
      ar.WORK_LOCATION_CODE,
      wl.LOCATION_NAME AS WORK_LOCATION_NAME,
      ar.ACTUAL_WORK_HOURS,
      ar.SCHEDULED_WORK_HOURS,
      ar.OVERTIME_HOURS,
      ar.NIGHT_WORK_HOURS,
      ar.HOLIDAY_WORK_HOURS,
      ar.IS_DAILY_CONFIRMED,
      ar.DAILY_CONFIRMED_AT,
      ar.APPROVAL_STATUS,
      ar.REMARK_TEXT
    FROM ATTENDANCE_RECORD ar
    LEFT JOIN WORK_LOCATION wl ON ar.WORK_LOCATION_CODE = wl.LOCATION_CODE
    WHERE ar.EMPLOYEE_ID = ? AND ar.WORK_DATE BETWEEN ? AND ?
    ORDER BY ar.WORK_DATE
  `;
  
  const [rows] = await db.execute(query, [employeeId, startDate, endDate]);
  return rows;
};

/**
 * 勤怠記録を作成する。
 *
 * @param {Object} attendanceData 勤怠記録データ
 * @returns {Promise<number>} 作成されたATTENDANCE_ID
 */
const createAttendance = async (attendanceData) => {
  const {
    employeeId,
    workDate,
    clockInTime,
    clockOutTime,
    clockInType,
    clockOutType,
    originalClockInTime,
    originalClockOutTime,
    workLocationCode,
    remarkText,
    createdAt,
    updatedAt
  } = attendanceData;
  
  const query = `
    INSERT INTO ATTENDANCE_RECORD 
    (EMPLOYEE_ID, WORK_DATE, CLOCK_IN_TIME, CLOCK_OUT_TIME, CLOCK_IN_TYPE, CLOCK_OUT_TYPE, ORIGINAL_CLOCK_IN_TIME, ORIGINAL_CLOCK_OUT_TIME, WORK_LOCATION_CODE, REMARK_TEXT, CREATED_AT, UPDATED_AT)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const [result] = await db.execute(query, [
    employeeId,
    workDate,
    clockInTime,
    clockOutTime ?? null,
    clockInType || 'MANUAL',
    clockOutType || 'MANUAL',
    originalClockInTime ?? null,
    originalClockOutTime ?? null,
    workLocationCode ?? null,
    remarkText ?? null,
    createdAt,
    updatedAt
  ]);
  
  return result.insertId;
};

/**
 * 勤怠記録を更新する。
 *
 * @param {number} attendanceId 勤怠記録ID
 * @param {Object} updateData 更新データ
 * @returns {Promise<void>}
 */
const updateAttendance = async (attendanceId, updateData) => {
  const updateFields = [];
  const updateValues = [];

  if (updateData.clockInTime !== undefined) {
    updateFields.push('CLOCK_IN_TIME = ?');
    updateValues.push(updateData.clockInTime);
  }
  if (updateData.clockOutTime !== undefined) {
    updateFields.push('CLOCK_OUT_TIME = ?');
    updateValues.push(updateData.clockOutTime);
  }
  if (updateData.clockInType !== undefined) {
    updateFields.push('CLOCK_IN_TYPE = ?');
    updateValues.push(updateData.clockInType);
  }
  if (updateData.clockOutType !== undefined) {
    updateFields.push('CLOCK_OUT_TYPE = ?');
    updateValues.push(updateData.clockOutType);
  }
  if (updateData.originalClockInTime !== undefined) {
    updateFields.push('ORIGINAL_CLOCK_IN_TIME = ?');
    updateValues.push(updateData.originalClockInTime);
  }
  if (updateData.originalClockOutTime !== undefined) {
    updateFields.push('ORIGINAL_CLOCK_OUT_TIME = ?');
    updateValues.push(updateData.originalClockOutTime);
  }
  if (updateData.workLocationCode !== undefined) {
    updateFields.push('WORK_LOCATION_CODE = ?');
    updateValues.push(updateData.workLocationCode);
  }
  if (updateData.remarkText !== undefined) {
    updateFields.push('REMARK_TEXT = ?');
    updateValues.push(updateData.remarkText);
  }
  if (updateData.actualWorkHours !== undefined) {
    updateFields.push('ACTUAL_WORK_HOURS = ?');
    updateValues.push(updateData.actualWorkHours);
  }
  if (updateData.isDailyConfirmed !== undefined) {
    updateFields.push('IS_DAILY_CONFIRMED = ?');
    updateValues.push(updateData.isDailyConfirmed);
  }
  if (updateData.dailyConfirmedAt !== undefined) {
    updateFields.push('DAILY_CONFIRMED_AT = ?');
    updateValues.push(updateData.dailyConfirmedAt);
  }
  if (updateData.approvalStatus !== undefined) {
    updateFields.push('APPROVAL_STATUS = ?');
    updateValues.push(updateData.approvalStatus);
  }
  
  if (updateFields.length === 0) {
    return;
  }

  updateFields.push('UPDATED_AT = ?');
  updateValues.push(updateData.updatedAt || new Date());
  updateValues.push(attendanceId);
  
  const query = `UPDATE ATTENDANCE_RECORD SET ${updateFields.join(', ')} WHERE ATTENDANCE_ID = ?`;
  await db.execute(query, updateValues);
};

/**
 * 勤怠記録を取得する（ID指定）。
 *
 * @param {number} attendanceId 勤怠記録ID
 * @returns {Promise<Object|null>} 勤怠記録
 */
const getAttendanceById = async (attendanceId) => {
  const query = `SELECT * FROM ATTENDANCE_RECORD WHERE ATTENDANCE_ID = ?`;
  const [rows] = await db.execute(query, [attendanceId]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * 勤怠記録を削除する（日付指定）。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} workDate 勤務日（YYYY-MM-DD形式）
 * @returns {Promise<void>}
 */
const deleteAttendanceByDate = async (employeeId, workDate) => {
  const query = `DELETE FROM ATTENDANCE_RECORD WHERE EMPLOYEE_ID = ? AND WORK_DATE = ?`;
  await db.execute(query, [employeeId, workDate]);
};

module.exports = {
  getAttendanceByDate,
  getAttendanceDetail,
  getMonthlyAttendance,
  createAttendance,
  updateAttendance,
  getAttendanceById,
  deleteAttendanceByDate
};



