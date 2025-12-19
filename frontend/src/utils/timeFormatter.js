/**
 * 時間フォーマット処理の共通ユーティリティ
 */

/**
 * 分を「H:MM」形式にフォーマット
 * @param {number} totalMinutes - 総分数
 * @returns {string} フォーマットされた時間文字列
 */
export function formatHoursMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}:${String(minutes).padStart(2, '0')}`
}

/**
 * 時間（小数）を「H:MM」形式にフォーマット
 * @param {number} hours - 時間（小数、例: 7.5）
 * @returns {string} フォーマットされた時間文字列（デフォルト: '0:00'）
 */
export function formatHoursToTime(hours) {
  if (!hours && hours !== 0) return '0:00'
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h}:${String(m).padStart(2, '0')}`
}

/**
 * 時間（小数）を「H:MM」形式にフォーマット（月次残業表示用）
 * @param {number} hours - 時間（小数）
 * @returns {string} フォーマットされた時間文字列（デフォルト: '0:00'）
 */
export function formatMonthlyOvertime(hours) {
  if (!hours || isNaN(hours)) {
    return '0:00'
  }
  const h = Math.floor(hours)
  const m = Math.floor((hours - h) * 60)
  return `${h}:${String(m).padStart(2, '0')}`
}

/**
 * 時間（小数）を「H:MM」形式にフォーマット（休憩時間表示用）
 * @param {number} hours - 時間（小数）
 * @returns {string} フォーマットされた時間文字列
 */
export function formatBreakTime(hours) {
  const h = Math.floor(hours)
  const m = Math.floor((hours - h) * 60)
  return `${h}:${String(m).padStart(2, '0')}`
}
