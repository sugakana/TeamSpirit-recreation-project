/**
 * マスタデータモデル
 */
const db = require('../config/database');

/**
 * 勤務場所マスタを取得
 * @returns {Promise<Array>} 勤務場所の配列
 */
const getWorkLocations = async () => {
  const query = `
    SELECT LOCATION_CODE AS WORK_LOCATION_CODE, LOCATION_NAME AS WORK_LOCATION_NAME, DISPLAY_ORDER
    FROM WORK_LOCATION 
    WHERE IS_ACTIVE = TRUE 
    ORDER BY DISPLAY_ORDER
  `;
  
  const [rows] = await db.execute(query);
  return rows;
};

/**
 * ジョブマスタを取得
 * @param {string} workDate - 対象日付（YYYY-MM-DD形式、オプション）
 * @returns {Promise<Array>} ジョブの配列
 */
const getJobs = async (workDate = null) => {
  let query = `
    SELECT JOB_CODE, JOB_NAME, JOB_CATEGORY, PROJECT_CODE, START_DATE, END_DATE
    FROM JOB_MASTER 
    WHERE IS_ACTIVE = TRUE
  `;
  
  const params = [];
  
  if (workDate) {
    query += ` AND (START_DATE IS NULL OR START_DATE <= ?) 
               AND (END_DATE IS NULL OR END_DATE >= ?)`;
    params.push(workDate, workDate);
  }
  
  query += ` ORDER BY JOB_CODE`;
  
  const [rows] = await db.execute(query, params);
  return rows;
};

/**
 * 休暇種別マスタを取得
 * @returns {Promise<Array>} 休暇種別の配列
 */
const getVacationTypes = async () => {
  const query = `
    SELECT VACATION_TYPE_CODE, VACATION_TYPE_NAME, VACATION_CATEGORY, 
           IS_PAID, ANNUAL_GRANT_DAYS, DISPLAY_ORDER
    FROM VACATION_TYPE 
    WHERE IS_ACTIVE = TRUE 
    ORDER BY DISPLAY_ORDER
  `;
  
  const [rows] = await db.execute(query);
  return rows;
};

/**
 * お知らせ情報を取得
 * @param {string} employeeId - 従業員ID
 * @param {string} department - 部署
 * @returns {Promise<Array>} お知らせの配列
 */
const getNotifications = async (employeeId, department) => {
  const query = `
    SELECT NOTIFICATION_ID, TITLE, CONTENT, IS_IMPORTANT
    FROM NOTIFICATION
    WHERE IS_ACTIVE = TRUE
      AND DISPLAY_START_DATE <= NOW()
      AND (DISPLAY_END_DATE IS NULL OR DISPLAY_END_DATE >= NOW())
      AND (
        (TARGET_TYPE = 'ALL')
        OR (TARGET_TYPE = 'DEPT' AND TARGET_ID = ?)
        OR (TARGET_TYPE = 'EMPLOYEE' AND TARGET_ID = ?)
      )
    ORDER BY IS_IMPORTANT DESC, NOTIFICATION_ID DESC
    LIMIT 4
  `;
  
  const [rows] = await db.execute(query, [department, employeeId]);
  return rows;
};

/**
 * 月次サマリーを取得
 * @param {string} employeeId - 従業員ID
 * @param {number} year - 年
 * @param {number} month - 月
 * @returns {Promise<Object|null>} 月次サマリー
 */
const getMonthlySummary = async (employeeId, year, month) => {
  const query = `
    SELECT * FROM V_MONTHLY_ATTENDANCE 
    WHERE EMPLOYEE_ID = ? AND WORK_YEAR = ? AND WORK_MONTH = ?
  `;
  
  const [rows] = await db.execute(query, [employeeId, year, month]);
  if (rows.length > 0) {
    return rows[0];
  }

  return null;
};

/**
 * 休暇残日数サマリーを取得
 * @param {string} employeeId - 従業員ID
 * @returns {Promise<Array>} 休暇残日数の配列
 */
const getVacationBalanceSummary = async (employeeId) => {
  const query = `
    SELECT 
      vbs.VACATION_TYPE_CODE,
      vbs.VACATION_TYPE_NAME,
      vbs.GRANTED_DAYS,
      vbs.USED_DAYS,
      vbs.REMAINING_DAYS,
      vbs.EXPIRATION_DATE
    FROM V_VACATION_BALANCE_SUMMARY vbs
    WHERE vbs.EMPLOYEE_ID = ?
    ORDER BY vbs.VACATION_TYPE_CODE
  `;
  
  const [rows] = await db.execute(query, [employeeId]);
  return rows;
};

/**
 * 休暇取得履歴を取得
 * @param {string} employeeId - 従業員ID
 * @param {number} limit - 取得件数
 * @returns {Promise<Array>} 休暇取得履歴の配列
 */
const getVacationHistory = async (employeeId, limit = 20) => {
  const query = `
    SELECT 
      VACATION_ID,
      VACATION_TYPE_CODE,
      START_DATE,
      END_DATE,
      VACATION_DAYS,
      REASON,
      APPROVAL_STATUS
    FROM VACATION_HISTORY
    WHERE EMPLOYEE_ID = ?
    ORDER BY START_DATE DESC
    LIMIT ?
  `;
  
  const [rows] = await db.execute(query, [employeeId, limit]);
  return rows;
};

module.exports = {
  getWorkLocations,
  getJobs,
  getVacationTypes,
  getNotifications,
  getMonthlySummary,
  getVacationBalanceSummary,
  getVacationHistory
};



