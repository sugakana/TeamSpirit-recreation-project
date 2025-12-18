/**
 * 従業員モデル
 */
const db = require('../config/database');

/**
 * 従業員IDとパスワードで認証
 * @param {string} employeeId - 従業員ID
 * @param {string} password - パスワード
 * @returns {Promise<Object|null>} 従業員情報
 */
const authenticate = async (employeeId, password) => {
  const query = `
    SELECT 
      EMPLOYEE_ID,
      EMPLOYEE_NAME,
      PASSWORD,
      IS_ACTIVE
    FROM EMPLOYEE
    WHERE EMPLOYEE_ID = ?
      AND PASSWORD = ?
      AND IS_ACTIVE = TRUE
  `;
  
  const [rows] = await db.execute(query, [employeeId, password]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * 従業員情報を取得
 * @param {string} employeeId - 従業員ID
 * @returns {Promise<Object|null>} 従業員情報
 */
const getEmployeeById = async (employeeId) => {
  const query = `
    SELECT 
      EMPLOYEE_ID,
      EMPLOYEE_NAME,
      DEPARTMENT,
      POSITION,
      EMAIL_ADDRESS,
      STANDARD_WORK_START_TIME,
      STANDARD_WORK_END_TIME
    FROM EMPLOYEE
    WHERE EMPLOYEE_ID = ?
      AND IS_ACTIVE = TRUE
  `;
  
  const [rows] = await db.execute(query, [employeeId]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * 従業員の部署を取得
 * @param {string} employeeId - 従業員ID
 * @returns {Promise<string|null>} 部署名
 */
const getEmployeeDepartment = async (employeeId) => {
  const query = `
    SELECT DEPARTMENT 
    FROM EMPLOYEE 
    WHERE EMPLOYEE_ID = ? AND IS_ACTIVE = TRUE
  `;
  
  const [rows] = await db.execute(query, [employeeId]);
  if (rows.length > 0) {
    return rows[0].DEPARTMENT;
  }

  return null;
};

module.exports = {
  authenticate,
  getEmployeeById,
  getEmployeeDepartment
};



