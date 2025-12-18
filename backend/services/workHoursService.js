/**
 * 工数実績サービス
 */
const workHoursModel = require('../models/workHoursModel');
const { getNow } = require('../utils/dateUtils');

/**
 * 工数実績を取得
 * @param {string} employeeId - 従業員ID
 * @param {string} workDate - 作業日（YYYY-MM-DD形式）
 * @returns {Promise<Array>} 工数実績の配列
 */
const getWorkHours = async (employeeId, workDate) => {
  return await workHoursModel.getWorkHours(employeeId, workDate);
};

/**
 * 工数実績を登録・更新
 * @param {Object} workHoursData - 工数実績データ
 * @returns {Promise<void>}
 */
const saveWorkHours = async (workHoursData) => {
  const {
    workHoursId,
    attendanceId,
    employeeId,
    workDate,
    jobCode,
    workCode,
    workHoursValue,
    workVolume,
    inputType
  } = workHoursData;
  
  const now = getNow();
  
  if (workHoursId) {
    // 更新
    await workHoursModel.updateWorkHours(workHoursId, {
      jobCode,
      workCode,
      workHoursValue,
      workVolume,
      inputType,
      updatedAt: now
    });
  } else {
    // 新規登録
    await workHoursModel.createWorkHours({
      attendanceId,
      employeeId,
      workDate,
      jobCode,
      workCode,
      workHoursValue,
      workVolume,
      inputType,
      createdAt: now,
      updatedAt: now
    });
  }
};

/**
 * 工数実績を削除
 * @param {number} workHoursId - 工数実績ID
 * @returns {Promise<void>}
 */
const deleteWorkHours = async (workHoursId) => {
  await workHoursModel.deleteWorkHours(workHoursId);
};

module.exports = {
  getWorkHours,
  saveWorkHours,
  deleteWorkHours
};










