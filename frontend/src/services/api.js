/**
 * API通信サービス
 * バックエンドAPIとの通信を管理する。
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

/**
 * API共通リクエスト処理を行う。
 *
 * @param {string} endpoint エンドポイント
 * @param {Object} options リクエストオプション
 * @returns {Promise<Object>} レスポンスデータ
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.message || 'APIエラーが発生しました')
      error.status = response.status
      throw error
    }

    return data
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}

/**
 * 月間勤務表を取得する。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} year 年（YYYY形式）
 * @param {string} month 月（MM形式）
 * @returns {Promise<Object>} 月間勤務表データ
 */
export async function getMonthlyAttendance(employeeId, year, month) {
  const endpoint = `/attendance/monthly?employeeId=${employeeId}&year=${year}&month=${month}`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * 日次勤怠記録を取得する。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} workDate 勤務日（YYYY-MM-DD形式）
 * @returns {Promise<Object>} 日次勤怠記録データ
 */
export async function getDailyAttendance(employeeId, workDate) {
  const endpoint = `/attendance/daily?employeeId=${employeeId}&workDate=${workDate}`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * 勤怠記録を更新する。
 *
 * @param {Object} attendanceData 勤怠データ
 * @returns {Promise<Object>} 更新後の勤怠記録データ
 */
export async function updateAttendanceRecord(attendanceData) {
  const endpoint = `/attendance/record`
  return await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(attendanceData),
  })
}

/**
 * 日次確定申請を行う。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} workDate 勤務日（YYYY-MM-DD形式）
 * @returns {Promise<Object>} レスポンスデータ
 */
export async function submitDailyConfirmation(employeeId, workDate) {
  const endpoint = `/attendance/daily-confirmation`
  return await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({ employeeId, workDate }),
  })
}

/**
 * 工数実績を取得する。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} workDate 作業日（YYYY-MM-DD形式）
 * @returns {Promise<Object>} 工数実績データ
 */
export async function getWorkHours(employeeId, workDate) {
  const endpoint = `/work-hours?employeeId=${employeeId}&workDate=${workDate}`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * 勤務場所マスタを取得する。
 *
 * @returns {Promise<Array>} 勤務場所マスタデータ
 */
export async function getWorkLocations() {
  const endpoint = `/master/work-locations`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * 月次サマリーを取得する。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} year 年（YYYY形式）
 * @param {string} month 月（MM形式）
 * @returns {Promise<Object>} 月次サマリーデータ
 */
export async function getMonthlySummary(employeeId, year, month) {
  const yearMonth = `${year}-${month.padStart(2, '0')}`
  const endpoint = `/monthly-summary/detail?employeeId=${employeeId}&yearMonth=${yearMonth}`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * 休暇情報を取得する。
 *
 * @param {string} employeeId 従業員ID
 * @returns {Promise<Object>} 休暇情報データ
 */
export async function getVacationInfo(employeeId) {
  const endpoint = `/application/vacation-info?employeeId=${employeeId}`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * お知らせを取得する。
 *
 * @param {string} employeeId 従業員ID
 * @returns {Promise<Array>} お知らせデータ
 */
export async function getNotifications(employeeId) {
  const endpoint = `/notifications?employeeId=${employeeId}`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * 従業員情報を取得する。
 *
 * @param {string} employeeId 従業員ID
 * @returns {Promise<Object>} 従業員情報データ
 */
export async function getEmployeeInfo(employeeId) {
  const endpoint = `/auth/employee/${employeeId}`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * 休日出勤申請状態を取得する。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} targetDate 対象日（YYYY-MM-DD形式）
 * @returns {Promise<Object>} 休日出勤申請状態データ
 */
export async function getHolidayWorkStatus(employeeId, targetDate) {
  const endpoint = `/application/holiday-work-status?employeeId=${employeeId}&targetDate=${targetDate}`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * 月次サマリー情報を取得する（月次サマリー情報画面用）。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} yearMonth 対象年月（YYYY-MM形式）
 * @returns {Promise<Object>} 月次サマリー情報データ
 */
export async function getMonthlySummaryDetail(employeeId, yearMonth) {
  const endpoint = `/monthly-summary/detail?employeeId=${employeeId}&yearMonth=${yearMonth}`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * 申請状態を取得する。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} applicationType 申請タイプ（DAILY_CONFIRMATION/VACATION/HOLIDAY_WORK/OVERTIME/EARLY_WORK/TRANSFER）
 * @param {string} targetDate 対象日（YYYY-MM-DD形式）
 * @returns {Promise<Object>} 申請状態データ
 */
export async function getApplicationStatus(employeeId, applicationType, targetDate) {
  const endpoint = `/application/application-status?employeeId=${employeeId}&applicationType=${applicationType}&targetDate=${targetDate}`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * 申請情報と承認履歴を取得する。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} applicationType 申請タイプ（DAILY_CONFIRMATION/VACATION/HOLIDAY_WORK/OVERTIME/EARLY_WORK/TRANSFER）
 * @param {string} targetDate 対象日（YYYY-MM-DD形式）
 * @returns {Promise<Object>} 申請情報データ
 */
export async function getApplicationInfo(employeeId, applicationType, targetDate) {
  const endpoint = `/application/application-info?employeeId=${employeeId}&applicationType=${applicationType}&targetDate=${targetDate}`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * 申請を取り消す。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} applicationType 申請タイプ（DAILY_CONFIRMATION/VACATION/HOLIDAY_WORK/OVERTIME/EARLY_WORK/TRANSFER）
 * @param {string|number} applicationId 申請ID（日次確定の場合は不要）
 * @param {string} targetDate 対象日（YYYY-MM-DD形式、日次確定の場合のみ必要）
 * @returns {Promise<Object>} レスポンスデータ
 */
export async function cancelApplication(employeeId, applicationType, applicationId = null, targetDate = null) {
  const endpoint = `/application/application`
  const body = {
    employeeId,
    applicationType
  }
  
  if (applicationType === 'DAILY_CONFIRMATION') {
    body.targetDate = targetDate
  } else {
    body.applicationId = applicationId
  }
  
  return await apiRequest(endpoint, {
    method: 'DELETE',
    body: JSON.stringify(body)
  })
}

