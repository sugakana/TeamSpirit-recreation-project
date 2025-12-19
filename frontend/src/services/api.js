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
export async function apiRequest(endpoint, options = {}) {
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
 * ジョブマスタを取得する。
 *
 * @param {string} workDate 作業日（YYYY-MM-DD形式、オプション）
 * @returns {Promise<Object>} ジョブマスタデータ
 */
export async function getJobs(workDate = null) {
  const endpoint = workDate 
    ? `/master/jobs?workDate=${workDate}`
    : `/master/jobs`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * 工数実績を登録する。
 *
 * @param {Object} workHoursData 工数実績データ
 * @returns {Promise<Object>} レスポンスデータ
 */
export async function saveWorkHours(workHoursData) {
  const endpoint = `/work-hours`
  return await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(workHoursData)
  })
}

/**
 * 工数実績を削除する。
 *
 * @param {string|number} workHoursId 工数実績ID
 * @returns {Promise<Object>} レスポンスデータ
 */
export async function deleteWorkHours(workHoursId) {
  const endpoint = `/work-hours/${workHoursId}`
  return await apiRequest(endpoint, { method: 'DELETE' })
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

/**
 * 休暇種別マスタを取得する。
 *
 * @returns {Promise<Object>} 休暇種別マスタデータ
 */
export async function getVacationTypes() {
  const endpoint = `/master/vacation-types`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * 休暇残日数を取得する。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} vacationTypeCode 休暇種別コード
 * @returns {Promise<Object>} 休暇残日数データ
 */
export async function getVacationBalance(employeeId, vacationTypeCode) {
  const endpoint = `/application/vacation/balance?employeeId=${employeeId}&vacationTypeCode=${vacationTypeCode}`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * 休日出勤申請リストを取得する。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} startDate 開始日（YYYY-MM-DD形式）
 * @param {string} endDate 終了日（YYYY-MM-DD形式）
 * @returns {Promise<Object>} 休日出勤申請リストデータ
 */
export async function getHolidayWorkList(employeeId, startDate, endDate) {
  const endpoint = `/application/holiday-work-list?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * 当月時間外残業を取得する。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} year 年（YYYY形式）
 * @param {string} month 月（MM形式）
 * @returns {Promise<Object>} 当月時間外残業データ
 */
export async function getMonthlyOvertime(employeeId, year, month) {
  const endpoint = `/attendance/monthly-overtime?employeeId=${employeeId}&year=${year}&month=${month}`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * 休暇申請を行う。
 *
 * @param {Object} applicationData 申請データ
 * @returns {Promise<Object>} レスポンスデータ
 */
export async function submitVacationApplication(applicationData) {
  const endpoint = `/application/vacation/apply`
  return await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(applicationData)
  })
}

/**
 * 休日出勤申請を行う。
 *
 * @param {Object} applicationData 申請データ
 * @returns {Promise<Object>} レスポンスデータ
 */
export async function submitHolidayWorkApplication(applicationData) {
  const endpoint = `/application/holiday-work`
  return await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(applicationData)
  })
}

/**
 * 残業申請を行う。
 *
 * @param {Object} applicationData 申請データ
 * @returns {Promise<Object>} レスポンスデータ
 */
export async function submitOvertimeApplication(applicationData) {
  const endpoint = `/application/overtime`
  return await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(applicationData)
  })
}

/**
 * 早朝勤務申請を行う。
 *
 * @param {Object} applicationData 申請データ
 * @returns {Promise<Object>} レスポンスデータ
 */
export async function submitEarlyWorkApplication(applicationData) {
  const endpoint = `/application/early-work`
  return await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(applicationData)
  })
}

/**
 * 振替申請を行う。
 *
 * @param {Object} applicationData 申請データ
 * @returns {Promise<Object>} レスポンスデータ
 */
export async function submitTransferApplication(applicationData) {
  const endpoint = `/application/transfer`
  return await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(applicationData)
  })
}

/**
 * 備考を保存する。
 *
 * @param {Object} recordData 記録データ
 * @returns {Promise<Object>} レスポンスデータ
 */
export async function saveRemark(recordData) {
  const endpoint = `/attendance/record`
  return await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(recordData)
  })
}

/**
 * ログインを行う。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} password パスワード
 * @returns {Promise<Object>} レスポンスデータ
 */
export async function login(employeeId, password) {
  const endpoint = `/auth/login`
  return await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({ employeeId, password })
  })
}

/**
 * 当日の勤怠情報を取得する。
 *
 * @param {string} employeeId 従業員ID
 * @returns {Promise<Object>} 当日の勤怠情報データ
 */
export async function getTodayAttendance(employeeId) {
  const endpoint = `/clock/today?employeeId=${employeeId}`
  return await apiRequest(endpoint, { method: 'GET' })
}

/**
 * 出勤打刻を行う。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} workLocationCode 勤務場所コード
 * @returns {Promise<Object>} レスポンスデータ
 */
export async function clockIn(employeeId, workLocationCode) {
  const endpoint = `/clock/clock-in`
  return await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({ employeeId, workLocationCode })
  })
}

/**
 * 定時出勤打刻を行う。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} workLocationCode 勤務場所コード
 * @returns {Promise<Object>} レスポンスデータ
 */
export async function clockInScheduled(employeeId, workLocationCode) {
  const endpoint = `/clock/clock-in-scheduled`
  return await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({ employeeId, workLocationCode })
  })
}

/**
 * 退勤打刻を行う。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} workLocationCode 勤務場所コード（オプション）
 * @returns {Promise<Object>} レスポンスデータ
 */
export async function clockOut(employeeId, workLocationCode = null) {
  const endpoint = `/clock/clock-out`
  const body = { employeeId }
  if (workLocationCode) {
    body.workLocationCode = workLocationCode
  }
  return await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(body)
  })
}

/**
 * 定時退勤打刻を行う。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} workLocationCode 勤務場所コード（オプション）
 * @returns {Promise<Object>} レスポンスデータ
 */
export async function clockOutScheduled(employeeId, workLocationCode = null) {
  const endpoint = `/clock/clock-out-scheduled`
  const body = { employeeId }
  if (workLocationCode) {
    body.workLocationCode = workLocationCode
  }
  return await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(body)
  })
}


