/**
 * 日付フォーマット処理の共通ユーティリティ
 */

/**
 * 日付を「YYYY年MM月DD日曜日」形式にフォーマット
 * @param {string} dateString - 日付文字列（YYYY-MM-DD形式）
 * @returns {string} フォーマットされた日付文字列
 */
export function formatDateWithWeekday(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayNames = ['日', '月', '火', '水', '木', '金', '土']
  const dayOfWeek = dayNames[date.getDay()]
  return `${year}年${month}月${day}日${dayOfWeek}曜日`
}

/**
 * 日付を「YYYY/MM/DD」形式にフォーマット
 * @param {string} dateString - 日付文字列
 * @returns {string} フォーマットされた日付文字列（デフォルト: '---'）
 */
export function formatDate(dateString) {
  if (!dateString) return '---'
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

/**
 * 日時を「YYYY/MM/DD HH:MM」形式にフォーマット
 * @param {string} dateTimeString - 日時文字列
 * @returns {string} フォーマットされた日時文字列（デフォルト: '---'）
 */
export function formatDateTime(dateTimeString) {
  if (!dateTimeString) return '---'
  const date = new Date(dateTimeString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}/${month}/${day} ${hours}:${minutes}`
}

/**
 * 時刻を「HH:MM」形式にフォーマット（先頭0付き）
 * @param {string} dateTimeString - 日時文字列
 * @returns {string} フォーマットされた時刻文字列（デフォルト: '--:--'）
 */
export function formatTime(dateTimeString) {
  if (!dateTimeString) return '--:--'
  const date = new Date(dateTimeString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * 時刻を「H:MM」形式にフォーマット（先頭0なし）
 * @param {string} dateTimeString - 日時文字列
 * @returns {string} フォーマットされた時刻文字列
 */
export function formatTimeNoLeadingZero(dateTimeString) {
  if (!dateTimeString) return ''
  const date = new Date(dateTimeString)
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}
