/**
 * 日付処理ユーティリティ
 */
const HolidayJp = require('@holiday-jp/holiday_jp');

/**
 * 日本時間（JST）で今日の日付を取得する。
 *
 * @returns {string} YYYY-MM-DD形式の日付文字列
 */
const getTodayJST = () => {
  const now = new Date();
  const jstOffset = 9 * 60; // UTC+9時間（分単位）
  const jstDate = new Date(now.getTime() + (jstOffset + now.getTimezoneOffset()) * 60000);
  return jstDate.toISOString().split('T')[0];
};

/**
 * 現在の日時を取得する。
 *
 * @returns {Date} 現在の日時
 */
const getNow = () => {
  return new Date();
};

/**
 * 時刻文字列（H:MM形式）をDateTimeに変換する。
 *
 * @param {string} timeStr H:MM形式の時刻文字列
 * @param {string} dateStr YYYY-MM-DD形式の日付文字列
 * @returns {string|null} YYYY-MM-DD HH:MM:SS形式の文字列
 */
const toDateTime = (timeStr, dateStr) => {
  if (!timeStr) {
    return null;
  }

  // H:MM形式をYYYY-MM-DD HH:MM:SS形式に変換
  const [hours, minutes] = timeStr.split(':');
  const dateTimeStr = `${dateStr} ${hours.padStart(2, '0')}:${minutes}:00`;
  return dateTimeStr;
};

/**
 * 時間（時間単位）をHHH:MM形式に変換する。
 *
 * @param {number} hours 時間（時間単位）
 * @returns {string} HHH:MM形式の文字列
 */
const formatHours = (hours) => {
  if (!hours || hours === 0) {
    return '0:00';
  }

  // 小数点の誤差を避けるため、分単位で計算してから時間に変換
  const totalMinutes = Math.round((hours || 0) * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
};

/**
 * 過不足時間を+/-H:MM形式に変換する。
 *
 * @param {number} hours 時間（時間単位）
 * @returns {string} +/-H:MM形式の文字列
 */
const formatOverUnder = (hours) => {
  let sign = '+';

  if (hours < 0) {
    sign = '-';
  }

  return `${sign}${formatHours(Math.abs(hours))}`;
};

/**
 * 月の開始日と終了日を取得する。
 *
 * @param {number} year 年
 * @param {number} month 月（1-12の1ベース）
 * @returns {Object} { startDate, endDate }
 */
const getMonthRange = (year, month) => {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;

  // monthは1ベースなので、0ベースに変換してから使用
  // new Date(year, month, 0)は指定された月の前月の最終日を返す
  // 例: new Date(2025, 10, 0) → 2025年10月31日
  // toISOString()はUTC時間で返すため、タイムゾーンの問題を避けるために
  // ローカル時間で日付を取得する
  const endDateObj = new Date(year, month, 0);
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(endDateObj.getDate()).padStart(2, '0')}`;
  return { startDate, endDate };
};

/**
 * 月の日数を取得する。
 *
 * @param {number} year 年
 * @param {number} month 月（1-12の1ベース）
 * @returns {number} 日数
 */
const getDaysInMonth = (year, month) => {
  // monthは1ベースなので、0ベースに変換してから使用
  // new Date(year, month, 0)は指定された月の前月の最終日を返す
  // 例: new Date(2025, 10, 0) → 2025年10月31日
  return new Date(year, month, 0).getDate();
};

/**
 * 所定出勤日数を計算する（月の平日数、祝日を除く）。
 *
 * @param {number} year 年
 * @param {number} month 月
 * @param {string|null} cutoffDate カットオフ日（YYYY-MM-DD形式、オプション）
 * @returns {number} 所定出勤日数
 */
const getScheduledWorkDays = (year, month, cutoffDate = null) => {
  const daysInMonth = getDaysInMonth(year, month);
  let cutoffDay = daysInMonth;

  if (cutoffDate) {
    cutoffDay = new Date(cutoffDate).getDate();
  }
  
  let scheduledWorkDays = 0;
  for (let day = 1; day <= cutoffDay; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    
    // 土日を除外
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }
    
    // 祝日を除外
    try {
      if (HolidayJp.isHoliday(date)) {
        continue;
      }
    } catch (error) {
      // 祝日判定でエラーが発生した場合は、平日として扱う
      console.error('祝日判定エラー:', error);
    }
    
    scheduledWorkDays++;
  }
  
  return scheduledWorkDays;
};

/**
 * 日付を正規化する（YYYY-MM-DD形式の文字列に変換）。
 *
 * @param {Date|string} date 日付
 * @returns {string} YYYY-MM-DD形式の文字列
 */
const normalizeDate = (date) => {
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  if (typeof date === 'string') {
    // 既に文字列の場合は、タイムスタンプ形式の場合は日付部分のみを取得
    if (date.includes('T')) {
      return date.split('T')[0];
    }

    // 既にYYYY-MM-DD形式の場合は最初の10文字を取得
    return date.substring(0, 10);
  }

  // その他の型の場合は文字列に変換
  return String(date).substring(0, 10);
};

/**
 * 2つの日付間の日数を計算する。
 *
 * @param {string} startDate 開始日（YYYY-MM-DD形式）
 * @param {string} endDate 終了日（YYYY-MM-DD形式）
 * @returns {number} 日数
 */
const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * 時間差を分単位で計算する。
 *
 * @param {Date|string} startTime 開始時刻
 * @param {Date|string} endTime 終了時刻
 * @returns {number} 分単位の時間差
 */
const calculateMinutes = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.floor((end - start) / 1000 / 60);
};

/**
 * 日付から年度を取得する（日本の会計年度：4月1日～3月31日）。
 *
 * @param {Date|string} date 日付
 * @returns {number} 年度（例: 2025年4月1日～2026年3月31日 → 2025）
 */
const getFiscalYear = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1; // getMonth()は0-11を返すため+1
  
  // 4月以降はその年の年度、3月までは前年の年度
  if (month >= 4) {
    return year;
  } else {
    return year - 1;
  }
};

module.exports = {
  getTodayJST,
  getNow,
  toDateTime,
  formatHours,
  formatOverUnder,
  getMonthRange,
  getDaysInMonth,
  getScheduledWorkDays,
  normalizeDate,
  calculateDays,
  calculateMinutes,
  getFiscalYear
};



