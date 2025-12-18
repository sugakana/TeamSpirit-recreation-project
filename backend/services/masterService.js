/**
 * マスタサービス
 */
const masterModel = require('../models/masterModel');
const { formatHours } = require('../utils/dateUtils');

/**
 * 勤務場所マスタを取得
 * @returns {Promise<Array>} 勤務場所の配列
 */
const getWorkLocations = async () => {
  return await masterModel.getWorkLocations();
};

/**
 * ジョブマスタを取得
 * @param {string} workDate - 対象日付（YYYY-MM-DD形式、オプション）
 * @returns {Promise<Array>} ジョブの配列
 */
const getJobs = async (workDate = null) => {
  return await masterModel.getJobs(workDate);
};

/**
 * 休暇種別マスタを取得
 * @returns {Promise<Array>} 休暇種別の配列
 */
const getVacationTypes = async () => {
  return await masterModel.getVacationTypes();
};

/**
 * 月次サマリーを取得
 * @param {string} employeeId - 従業員ID
 * @param {number} year - 年
 * @param {number} month - 月
 * @returns {Promise<Object>} 月次サマリー
 */
const getMonthlySummary = async (employeeId, year, month) => {
  const summary = await masterModel.getMonthlySummary(employeeId, year, month);
  
  if (!summary) {
    return {
      scheduledWorkDays: 0,
      actualWorkDays: 0,
      scheduledWorkHours: '0:00',
      totalWorkHours: '0:00',
      overUnderTime: '+0:00',
      legalHolidayWork: '0:00',
      withinLegalOvertime: '0:00',
      overLegalOvertime: '0:00'
    };
  }
  
  return {
    scheduledWorkDays: summary.SCHEDULED_WORK_DAYS || 0,
    actualWorkDays: summary.ACTUAL_WORK_DAYS || 0,
    scheduledWorkHours: formatHours(summary.SCHEDULED_WORK_HOURS),
    totalWorkHours: formatHours(summary.TOTAL_WORK_HOURS),
    overUnderTime: (() => {
      let sign = '';

      if (summary.OVER_UNDER_TIME >= 0) {
        sign = '+';
      }

      return `${sign}${formatHours(Math.abs(summary.OVER_UNDER_TIME))}`;
    })(),
    legalHolidayWork: formatHours(summary.LEGAL_HOLIDAY_WORK_HOURS),
    withinLegalOvertime: formatHours(summary.WITHIN_LEGAL_OVERTIME_HOURS),
    overLegalOvertime: formatHours(summary.OVER_LEGAL_OVERTIME_HOURS)
  };
};

module.exports = {
  getWorkLocations,
  getJobs,
  getVacationTypes,
  getMonthlySummary
};



