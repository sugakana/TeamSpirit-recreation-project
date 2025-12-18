/**
 * 休憩時間・公用外出モデル
 */
const db = require('../config/database');

/**
 * 中断中の休憩時間を取得
 * @param {number} attendanceId - 勤怠記録ID
 * @returns {Promise<Object|null>} 休憩時間情報
 */
const getActiveBreak = async (attendanceId) => {
  const query = `
    SELECT BREAK_ID, BREAK_SEQ, BREAK_START_TIME 
    FROM BREAK_TIME 
    WHERE ATTENDANCE_ID = ? AND BREAK_END_TIME IS NULL 
    ORDER BY BREAK_SEQ DESC 
    LIMIT 1
  `;
  
  const [rows] = await db.execute(query, [attendanceId]);
  if (rows.length > 0) {
    return rows[0];
  }

  return null;
};

/**
 * 休憩時間一覧を取得
 * @param {number} attendanceId - 勤怠記録ID
 * @returns {Promise<Array>} 休憩時間の配列
 */
const getBreakTimes = async (attendanceId) => {
  const query = `
    SELECT BREAK_ID, BREAK_SEQ, BREAK_START_TIME, BREAK_END_TIME, BREAK_DURATION_MINUTES, BREAK_TYPE
    FROM BREAK_TIME
    WHERE ATTENDANCE_ID = ?
    ORDER BY BREAK_SEQ
  `;
  
  const [rows] = await db.execute(query, [attendanceId]);
  return rows;
};

/**
 * 公用外出一覧を取得
 * @param {number} attendanceId - 勤怠記録ID
 * @returns {Promise<Array>} 公用外出の配列
 */
const getOfficialOutings = async (attendanceId) => {
  const query = `
    SELECT OUTING_ID, OUTING_SEQ, OUTING_START_TIME, OUTING_END_TIME, OUTING_DURATION_MINUTES, OUTING_PURPOSE
    FROM OFFICIAL_OUTING
    WHERE ATTENDANCE_ID = ?
    ORDER BY OUTING_SEQ
  `;
  
  const [rows] = await db.execute(query, [attendanceId]);
  return rows;
};

/**
 * 休憩時間の合計を取得
 * @param {number} attendanceId - 勤怠記録ID
 * @returns {Promise<number>} 休憩時間の合計（分）
 */
const getTotalBreakMinutes = async (attendanceId) => {
  const query = `
    SELECT COALESCE(SUM(BREAK_DURATION_MINUTES), 0) as totalBreak 
    FROM BREAK_TIME 
    WHERE ATTENDANCE_ID = ?
  `;
  
  const [rows] = await db.execute(query, [attendanceId]);
  return rows[0]?.totalBreak || 0;
};

/**
 * 最大の休憩SEQを取得
 * @param {number} attendanceId - 勤怠記録ID
 * @returns {Promise<number>} 最大SEQ
 */
const getMaxBreakSeq = async (attendanceId) => {
  const query = `
    SELECT MAX(BREAK_SEQ) as maxSeq 
    FROM BREAK_TIME 
    WHERE ATTENDANCE_ID = ?
  `;
  
  const [rows] = await db.execute(query, [attendanceId]);
  return rows[0]?.maxSeq || 0;
};

/**
 * 最大の外出SEQを取得
 * @param {number} attendanceId - 勤怠記録ID
 * @returns {Promise<number>} 最大SEQ
 */
const getMaxOutingSeq = async (attendanceId) => {
  const query = `
    SELECT MAX(OUTING_SEQ) as maxSeq 
    FROM OFFICIAL_OUTING 
    WHERE ATTENDANCE_ID = ?
  `;
  
  const [rows] = await db.execute(query, [attendanceId]);
  return rows[0]?.maxSeq || 0;
};

/**
 * 休憩時間を登録
 * @param {Object} breakData - 休憩データ
 * @returns {Promise<number>} 作成されたBREAK_ID
 */
const createBreakTime = async (breakData) => {
  const {
    attendanceId,
    breakSeq,
    breakStartTime,
    breakEndTime,
    breakDurationMinutes,
    breakType,
    createdAt,
    updatedAt
  } = breakData;
  
  const query = `
    INSERT INTO BREAK_TIME 
    (ATTENDANCE_ID, BREAK_SEQ, BREAK_START_TIME, BREAK_END_TIME, BREAK_DURATION_MINUTES, BREAK_TYPE, CREATED_AT, UPDATED_AT)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const [result] = await db.execute(query, [
    attendanceId,
    breakSeq,
    breakStartTime,
    breakEndTime,
    breakDurationMinutes,
    breakType || 'REGULAR',
    createdAt,
    updatedAt
  ]);
  
  return result.insertId;
};

/**
 * 休憩時間を更新
 * @param {number} breakId - 休憩ID
 * @param {Object} updateData - 更新データ
 * @returns {Promise<void>}
 */
const updateBreakTime = async (breakId, updateData) => {
  const query = `
    UPDATE BREAK_TIME 
    SET BREAK_START_TIME = ?, BREAK_END_TIME = ?, BREAK_DURATION_MINUTES = ?, BREAK_TYPE = ?, UPDATED_AT = ?
    WHERE BREAK_ID = ?
  `;
  
  await db.execute(query, [
    updateData.breakStartTime,
    updateData.breakEndTime,
    updateData.breakDurationMinutes,
    updateData.breakType || 'REGULAR',
    updateData.updatedAt || new Date(),
    breakId
  ]);
};

/**
 * 休憩時間を削除（勤怠記録ID指定）
 * @param {number} attendanceId - 勤怠記録ID
 * @returns {Promise<void>}
 */
const deleteBreakTimesByAttendanceId = async (attendanceId) => {
  const query = `DELETE FROM BREAK_TIME WHERE ATTENDANCE_ID = ?`;
  await db.execute(query, [attendanceId]);
};

/**
 * 公用外出を登録
 * @param {Object} outingData - 公用外出データ
 * @returns {Promise<number>} 作成されたOUTING_ID
 */
const createOfficialOuting = async (outingData) => {
  const {
    attendanceId,
    outingSeq,
    outingStartTime,
    outingEndTime,
    outingDurationMinutes,
    outingPurpose,
    createdAt,
    updatedAt
  } = outingData;
  
  const query = `
    INSERT INTO OFFICIAL_OUTING 
    (ATTENDANCE_ID, OUTING_SEQ, OUTING_START_TIME, OUTING_END_TIME, OUTING_DURATION_MINUTES, OUTING_PURPOSE, CREATED_AT, UPDATED_AT)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const [result] = await db.execute(query, [
    attendanceId,
    outingSeq,
    outingStartTime,
    outingEndTime,
    outingDurationMinutes,
    outingPurpose || null,
    createdAt,
    updatedAt
  ]);
  
  return result.insertId;
};

/**
 * 公用外出を削除（勤怠記録ID指定）
 * @param {number} attendanceId - 勤怠記録ID
 * @returns {Promise<void>}
 */
const deleteOfficialOutingsByAttendanceId = async (attendanceId) => {
  const query = `DELETE FROM OFFICIAL_OUTING WHERE ATTENDANCE_ID = ?`;
  await db.execute(query, [attendanceId]);
};

module.exports = {
  getActiveBreak,
  getBreakTimes,
  getOfficialOutings,
  getTotalBreakMinutes,
  getMaxBreakSeq,
  getMaxOutingSeq,
  createBreakTime,
  updateBreakTime,
  deleteBreakTimesByAttendanceId,
  createOfficialOuting,
  deleteOfficialOutingsByAttendanceId
};



