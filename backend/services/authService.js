/**
 * 認証サービス
 */
const employeeModel = require('../models/employeeModel');

/**
 * ログイン認証
 * @param {string} employeeId - 従業員ID
 * @param {string} password - パスワード
 * @returns {Promise<Object>} 認証結果
 */
const login = async (employeeId, password) => {
  const employee = await employeeModel.authenticate(employeeId, password);
  
  if (!employee) {
    throw new Error('社員コードまたはパスワードが違います。');
  }
  
  return {
    employeeId: employee.EMPLOYEE_ID,
    employeeName: employee.EMPLOYEE_NAME
  };
};

/**
 * 従業員情報を取得
 * @param {string} employeeId - 従業員ID
 * @returns {Promise<Object>} 従業員情報
 */
const getEmployee = async (employeeId) => {
  const employee = await employeeModel.getEmployeeById(employeeId);
  
  if (!employee) {
    throw new Error('従業員が見つかりません。');
  }
  
  return employee;
};

module.exports = {
  login,
  getEmployee
};










