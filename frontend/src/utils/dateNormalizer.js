/**
 * 日付正規化ユーティリティ
 * 日付文字列をYYYY-MM-DD形式に正規化する。
 */

/**
 * 日付文字列をYYYY-MM-DD形式に正規化する。
 * 
 * @param {string|Date} dateInput - 日付文字列またはDateオブジェクト
 * @returns {string} YYYY-MM-DD形式の日付文字列
 */
export function normalizeDateString(dateInput) {
  if (!dateInput) return ''
  
  // Dateオブジェクトの場合はYYYY-MM-DD形式に変換
  if (dateInput instanceof Date) {
    const year = dateInput.getFullYear()
    const month = String(dateInput.getMonth() + 1).padStart(2, '0')
    const day = String(dateInput.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  // 文字列の場合
  if (typeof dateInput === 'string') {
    // ISO形式（2025-12-10T15:00:00.000Z）の場合は日付部分のみを抽出
    if (dateInput.includes('T')) {
      return dateInput.split('T')[0]
    }
    
    // スペース区切りの場合、最初の部分を取得
    if (dateInput.includes(' ')) {
      return dateInput.split(' ')[0]
    }
    
    // 既にYYYY-MM-DD形式の場合は最初の10文字を取得
    if (dateInput.length >= 10) {
      return dateInput.substring(0, 10)
    }
  }
  
  return String(dateInput)
}

/**
 * 日付文字列をDateオブジェクトに変換する。
 * YYYY-MM-DD形式の日付文字列を確実にパースする。
 * 
 * @param {string} dateStr - YYYY-MM-DD形式の日付文字列
 * @returns {Date|null} Dateオブジェクト（パースに失敗した場合はnull）
 */
export function parseDateString(dateStr) {
  if (!dateStr) return null
  
  // まず正規化
  const normalized = normalizeDateString(dateStr)
  
  // YYYY-MM-DD形式の日付文字列を確実にパースする
  const dateParts = normalized.split('-')
  if (dateParts.length === 3) {
    const year = parseInt(dateParts[0], 10)
    const month = parseInt(dateParts[1], 10) - 1 // 月は0から始まる
    const day = parseInt(dateParts[2], 10)
    
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return new Date(year, month, day)
    }
  }
  
  // フォールバック: 通常のDateパース
  const date = new Date(normalized)
  if (!isNaN(date.getTime())) {
    return date
  }
  
  return null
}

/**
 * 曜日を取得する。
 * 
 * @param {string|Date} dateInput - 日付文字列またはDateオブジェクト
 * @returns {string} 曜日（'日', '月', '火', '水', '木', '金', '土'）
 */
export function getDayOfWeek(dateInput) {
  const date = dateInput instanceof Date ? dateInput : parseDateString(dateInput)
  if (!date) return ''
  
  const days = ['日', '月', '火', '水', '木', '金', '土']
  return days[date.getDay()]
}
