/**
 * 月次サマリー計算サービス（共通化）
 */
const breakTimeModel = require('../models/breakTimeModel');
const { 
  getTodayJST,
  getScheduledWorkDays,
  normalizeDate,
  calculateMinutes
} = require('../utils/dateUtils');

/**
 * cutoffDateを計算する（共通ロジック）
 * @param {number} year - 年
 * @param {number} month - 月（1-12の1ベース）
 * @param {string} endDate - 月末日（YYYY-MM-DD形式）
 * @param {Array} attendanceRows - 勤怠記録の配列
 * @returns {string} cutoffDate（YYYY-MM-DD形式）
 */
const calculateCutoffDate = (year, month, endDate, attendanceRows) => {
  const todayStr = getTodayJST();
  const isCurrentMonth = parseInt(year) === new Date().getFullYear() && parseInt(month) === new Date().getMonth() + 1;
  let cutoffDate = endDate;

  if (isCurrentMonth) {
    cutoffDate = todayStr;
  }

  // 当日退勤していない場合は前日までの過不足時間を計算
  if (isCurrentMonth) {
    const todayRecord = attendanceRows.find(row => {
      const workDateStr = normalizeDate(row.WORK_DATE);
      return workDateStr === todayStr;
    });
    
    if (todayRecord && todayRecord.CLOCK_IN_TIME && !todayRecord.CLOCK_OUT_TIME) {
      const yesterday = new Date(todayStr);
      yesterday.setDate(yesterday.getDate() - 1);
      cutoffDate = yesterday.toISOString().split('T')[0];
    }
  }

  return cutoffDate;
};

/**
 * 総労働時間を計算する（共通ロジック）
 * @param {Array} attendanceRows - 勤怠記録の配列
 * @param {string} cutoffDate - カットオフ日（YYYY-MM-DD形式）
 * @returns {Promise<number>} 総労働時間（時間単位）
 */
const calculateTotalWorkHours = async (attendanceRows, cutoffDate) => {
  let totalWorkMinutes = 0;

  for (const row of attendanceRows) {
    const workDateStr = normalizeDate(row.WORK_DATE);

    if (workDateStr > cutoffDate) {
      continue;
    }

    if (row.CLOCK_IN_TIME && row.CLOCK_OUT_TIME) {
      const totalMinutes = calculateMinutes(row.CLOCK_IN_TIME, row.CLOCK_OUT_TIME);
      const breakTimes = await breakTimeModel.getBreakTimes(row.ATTENDANCE_ID);
      const officialOutings = await breakTimeModel.getOfficialOutings(row.ATTENDANCE_ID);

      let breakMinutes = 0;

      for (const bt of breakTimes) {
        breakMinutes += bt.BREAK_DURATION_MINUTES || 0;
      }

      for (const outing of officialOutings) {
        breakMinutes += outing.OUTING_DURATION_MINUTES || 0;
      }

      totalWorkMinutes += totalMinutes - breakMinutes;
    }
  }

  return totalWorkMinutes / 60;
};

/**
 * 基本月次サマリーを計算する（共通ロジック）
 * @param {number} year - 年
 * @param {number} month - 月（1-12の1ベース）
 * @param {string} endDate - 月末日（YYYY-MM-DD形式）
 * @param {Array} attendanceRows - 勤怠記録の配列
 * @returns {Promise<Object>} 基本月次サマリー情報
 */
const calculateBasicMonthlySummary = async (year, month, endDate, attendanceRows) => {
  // cutoffDateを計算
  const cutoffDate = calculateCutoffDate(year, month, endDate, attendanceRows);

  // 所定出勤日数を計算
  const scheduledWorkDays = getScheduledWorkDays(year, month);
  const scheduledWorkDaysUntilCutoff = getScheduledWorkDays(year, month, cutoffDate);

  // 実出勤日数
  const actualWorkDays = attendanceRows.filter(row => 
    row.CLOCK_IN_TIME && row.CLOCK_OUT_TIME && normalizeDate(row.WORK_DATE) <= cutoffDate
  ).length;

  // 所定労働時間
  const scheduledWorkHours = scheduledWorkDays * 7.5;
  const scheduledWorkHoursUntilCutoff = scheduledWorkDaysUntilCutoff * 7.5;

  // 総労働時間
  const totalWorkHours = await calculateTotalWorkHours(attendanceRows, cutoffDate);

  // 過不足時間
  const overUnderHours = totalWorkHours - scheduledWorkHoursUntilCutoff;

  // 法定休日労働
  const legalHolidayWorkHours = attendanceRows
    .filter(row => normalizeDate(row.WORK_DATE) <= cutoffDate)
    .reduce((sum, row) => sum + (parseFloat(row.HOLIDAY_WORK_HOURS) || 0), 0);

  // 法定労働時間
  const legalWorkHoursUntilCutoff = scheduledWorkDaysUntilCutoff * 8;

  // 法定時間内残業・法定時間外残業
  let withinLegalOvertime = 0;
  let overLegalOvertime = 0;

  if (totalWorkHours > scheduledWorkHoursUntilCutoff) {
    const overtimeHours = totalWorkHours - scheduledWorkHoursUntilCutoff;
    const maxWithinLegalOvertime = legalWorkHoursUntilCutoff - scheduledWorkHoursUntilCutoff;
    withinLegalOvertime = Math.min(overtimeHours, maxWithinLegalOvertime);

    if (totalWorkHours > legalWorkHoursUntilCutoff) {
      overLegalOvertime = totalWorkHours - legalWorkHoursUntilCutoff;
    }
  }

  // cutoffDateをMM/DD形式にフォーマット
  const cutoffDateFormatted = cutoffDate.split('-').slice(1).join('/');

  return {
    scheduledWorkDays,
    actualWorkDays,
    scheduledWorkHours,
    scheduledWorkHoursUntilCutoff,
    totalWorkHours,
    overUnderHours,
    legalHolidayWorkHours,
    withinLegalOvertime,
    overLegalOvertime,
    cutoffDate,
    cutoffDateFormatted
  };
};

module.exports = {
  calculateCutoffDate,
  calculateTotalWorkHours,
  calculateBasicMonthlySummary
};
