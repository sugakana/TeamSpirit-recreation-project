/**
 * お知らせサービス
 */
const masterModel = require('../models/masterModel');
const employeeModel = require('../models/employeeModel');

/**
 * お知らせ情報を取得
 * @param {string} employeeId - 従業員ID
 * @returns {Promise<Array>} お知らせの配列（CONTENTのみ）
 */
const getNotifications = async (employeeId) => {
  // 従業員の部署を取得
  const department = await employeeModel.getEmployeeDepartment(employeeId);
  
  if (!department) {
    throw new Error('従業員が見つかりません。');
  }
  
  // お知らせ情報を取得
  const notifications = await masterModel.getNotifications(employeeId, department);
  
  // CONTENTのみを配列で返す（フロントエンドの仕様に合わせる）
  return notifications.map(row => row.CONTENT);
};

module.exports = {
  getNotifications
};












