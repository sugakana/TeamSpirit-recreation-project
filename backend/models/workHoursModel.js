/**
 * 工数実績モデル
 */
const db = require('../config/database');

/**
 * 工数実績を取得
 * @param {string} employeeId - 従業員ID
 * @param {string} workDate - 作業日（YYYY-MM-DD形式）
 * @returns {Promise<Array>} 工数実績の配列
 */
const getWorkHours = async (employeeId, workDate) => {
  const query = `
    SELECT 
      wh.WORK_HOURS_ID,
      wh.ATTENDANCE_ID,
      wh.EMPLOYEE_ID,
      wh.WORK_DATE,
      wh.JOB_CODE,
      wh.WORK_CODE,
      wh.WORK_HOURS_VALUE,
      wh.WORK_VOLUME,
      wh.INPUT_TYPE,
      jm.JOB_NAME
    FROM WORK_HOURS wh
    LEFT JOIN JOB_MASTER jm ON wh.JOB_CODE = jm.JOB_CODE
    WHERE wh.EMPLOYEE_ID = ? AND wh.WORK_DATE = ?
    ORDER BY wh.WORK_HOURS_ID
  `;
  
  const [rows] = await db.execute(query, [employeeId, workDate]);
  return rows;
};

/**
 * 工数実績の合計を取得
 * @param {number} attendanceId - 勤怠記録ID
 * @returns {Promise<number>} 工数実績の合計
 */
const getTotalWorkHours = async (attendanceId) => {
  const query = `
    SELECT SUM(WORK_HOURS_VALUE) as totalWorkHours 
    FROM WORK_HOURS 
    WHERE ATTENDANCE_ID = ?
  `;
  
  const [rows] = await db.execute(query, [attendanceId]);
  return rows[0]?.totalWorkHours || 0;
};

/**
 * 工数実績を作成
 * @param {Object} workHoursData - 工数実績データ
 * @returns {Promise<number>} 作成されたWORK_HOURS_ID
 */
const createWorkHours = async (workHoursData) => {
  const {
    attendanceId,
    employeeId,
    workDate,
    jobCode,
    workCode,
    workHoursValue,
    workVolume,
    inputType,
    createdAt,
    updatedAt
  } = workHoursData;
  
  const query = `
    INSERT INTO WORK_HOURS 
    (ATTENDANCE_ID, EMPLOYEE_ID, WORK_DATE, JOB_CODE, WORK_CODE, WORK_HOURS_VALUE, WORK_VOLUME, INPUT_TYPE, CREATED_AT, UPDATED_AT)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const [result] = await db.execute(query, [
    attendanceId,
    employeeId,
    workDate,
    jobCode,
    workCode || null,
    workHoursValue,
    workVolume || null,
    inputType || 'TIME',
    createdAt,
    updatedAt
  ]);
  
  return result.insertId;
};

/**
 * 工数実績を更新
 * @param {number} workHoursId - 工数実績ID
 * @param {Object} updateData - 更新データ
 * @returns {Promise<void>}
 */
const updateWorkHours = async (workHoursId, updateData) => {
  const query = `
    UPDATE WORK_HOURS 
    SET JOB_CODE = ?, WORK_CODE = ?, WORK_HOURS_VALUE = ?, WORK_VOLUME = ?, INPUT_TYPE = ?, UPDATED_AT = ?
    WHERE WORK_HOURS_ID = ?
  `;
  
  await db.execute(query, [
    updateData.jobCode,
    updateData.workCode || null,
    updateData.workHoursValue,
    updateData.workVolume || null,
    updateData.inputType || 'TIME',
    updateData.updatedAt || new Date(),
    workHoursId
  ]);
};

/**
 * 工数実績を削除
 * @param {number} workHoursId - 工数実績ID
 * @returns {Promise<void>}
 */
const deleteWorkHours = async (workHoursId) => {
  const query = `DELETE FROM WORK_HOURS WHERE WORK_HOURS_ID = ?`;
  await db.execute(query, [workHoursId]);
};

/**
 * 工数実績を削除（日付指定）
 * @param {string} employeeId - 従業員ID
 * @param {string} workDate - 作業日（YYYY-MM-DD形式）
 * @returns {Promise<void>}
 */
const deleteWorkHoursByDate = async (employeeId, workDate) => {
  const query = `DELETE FROM WORK_HOURS WHERE EMPLOYEE_ID = ? AND WORK_DATE = ?`;
  await db.execute(query, [employeeId, workDate]);
};

module.exports = {
  getWorkHours,
  getTotalWorkHours,
  createWorkHours,
  updateWorkHours,
  deleteWorkHours,
  deleteWorkHoursByDate
};







