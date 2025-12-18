/**
 * 申請サービス
 */
const applicationModel = require('../models/applicationModel');
const { getNow, calculateDays, normalizeDate, getFiscalYear } = require('../utils/dateUtils');

/**
 * 休暇申請
 * @param {Object} vacationData - 休暇申請データ
 * @returns {Promise<number>} 作成されたVACATION_ID
 */
const applyVacation = async (vacationData) => {
  const {
    employeeId,
    vacationTypeCode,
    startDate,
    endDate,
    reason,
    contact
  } = vacationData;
  
  // 日数を計算
  const vacationDays = calculateDays(startDate, endDate);
  
  // 有給休暇の場合、残日数チェックと残日数の減算
  if (vacationTypeCode === 'PAID_LEAVE') {
    const remainingDays = await applicationModel.getVacationBalance(employeeId, vacationTypeCode);
    if (vacationDays > remainingDays) {
      throw new Error('有給休暇の残日数が不足しています。');
    }
    
    // 申請時に残日数を減らす
    const fiscalYear = getFiscalYear(startDate);
    await applicationModel.decreaseVacationBalance(employeeId, vacationTypeCode, vacationDays, fiscalYear);
  }
  
  const now = getNow();
  
  return await applicationModel.createVacation({
    employeeId,
    vacationTypeCode,
    startDate,
    endDate,
    vacationDays,
    reason,
    contactInfo: contact,
    approvalStatus: 'PENDING',
    createdAt: now,
    updatedAt: now
  });
};

/**
 * 休日出勤申請
 * @param {Object} applicationData - 申請データ
 * @returns {Promise<number>} 作成されたAPPLICATION_ID
 */
const applyHolidayWork = async (applicationData) => {
  const { employeeId, workDate, startTime, endTime, breakHours, reason } = applicationData;
  const now = getNow();
  
  // REASONフィールドにJSON形式で時間情報を保存
  const reasonData = {
    text: reason || '',
    startTime: startTime,
    endTime: endTime,
    breakHours: breakHours
  };
  
  return await applicationModel.createApplication({
    employeeId,
    applicationType: 'HOLIDAY_WORK',
    targetStartDate: workDate,
    targetEndDate: workDate,
    reason: JSON.stringify(reasonData),
    approvalStatus: 'PENDING',
    createdAt: now,
    updatedAt: now
  });
};

/**
 * 残業申請
 * @param {Object} applicationData - 申請データ
 * @returns {Promise<number>} 作成されたAPPLICATION_ID
 */
const applyOvertime = async (applicationData) => {
  const { employeeId, startDate, endDate, overtimeHours, reason } = applicationData;
  const now = getNow();
  
  return await applicationModel.createApplication({
    employeeId,
    applicationType: 'OVERTIME',
    targetStartDate: startDate,
    targetEndDate: endDate,
    overtimeHours,
    reason,
    approvalStatus: 'PENDING',
    createdAt: now,
    updatedAt: now
  });
};

/**
 * 早朝勤務申請
 * @param {Object} applicationData - 申請データ
 * @returns {Promise<number>} 作成されたAPPLICATION_ID
 */
const applyEarlyWork = async (applicationData) => {
  const { employeeId, startDate, endDate, reason } = applicationData;
  const now = getNow();
  
  return await applicationModel.createApplication({
    employeeId,
    applicationType: 'EARLY_WORK',
    targetStartDate: startDate,
    targetEndDate: endDate,
    reason,
    approvalStatus: 'PENDING',
    createdAt: now,
    updatedAt: now
  });
};

/**
 * 振替申請
 * @param {Object} applicationData - 申請データ
 * @returns {Promise<number>} 作成されたAPPLICATION_ID
 */
const applyTransfer = async (applicationData) => {
  const { employeeId, fromDate, toDate, reason } = applicationData;
  
  // 振替元日と振替先日が同じ場合エラー
  if (fromDate === toDate) {
    throw new Error('振替元日と振替先日は異なる日付を入力してください。');
  }
  
  const now = getNow();
  
  return await applicationModel.createApplication({
    employeeId,
    applicationType: 'TRANSFER',
    targetStartDate: fromDate,
    targetEndDate: toDate,
    reason,
    approvalStatus: 'PENDING',
    createdAt: now,
    updatedAt: now
  });
};

/**
 * 休日出勤申請状態を取得
 * @param {string} employeeId - 従業員ID
 * @param {string} targetDate - 対象日（YYYY-MM-DD形式）
 * @returns {Promise<Object>} 申請状態
 */
const getHolidayWorkStatus = async (employeeId, targetDate) => {
  const application = await applicationModel.getApplicationStatus(employeeId, 'HOLIDAY_WORK', targetDate);
  
  let applicationStatus = null;

  if (application) {
    applicationStatus = application.APPROVAL_STATUS;
  }

  // 代休の表示条件：過去の休日出勤申請（承認済みまたは申請中）も確認
  // 対象日から過去1年間の休日出勤申請を確認
  const oneYearAgo = new Date(targetDate);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const oneYearAgoStr = oneYearAgo.toISOString().split('T')[0];
  
  const pastApplications = await applicationModel.getApplicationsByType(
    employeeId,
    'HOLIDAY_WORK',
    oneYearAgoStr,
    targetDate
  );

  const hasPastHolidayWork = pastApplications.length > 0;

  return {
    success: true,
    hasHolidayWorkApplication: !!application || hasPastHolidayWork,
    applicationStatus: applicationStatus,
    hasPastHolidayWorkApplication: hasPastHolidayWork
  };
};

/**
 * 月次承認履歴を取得
 * @param {string} employeeId - 従業員ID
 * @param {number} year - 年
 * @param {number} month - 月
 * @returns {Promise<Object>} 月次承認情報
 */
const getMonthlyApprovalHistory = async (employeeId, year, month) => {
  const targetYearMonth = `${year}-${String(month).padStart(2, '0')}`;
  
  const monthlyApprovalStatus = await applicationModel.getMonthlyApprovalStatus(employeeId, targetYearMonth);
  const history = await applicationModel.getMonthlyApprovalHistory(employeeId, targetYearMonth);
  
  return {
    monthlyApprovalStatus,
    history
  };
};

/**
 * 申請状態を取得
 * @param {string} employeeId - 従業員ID
 * @param {string} applicationType - 申請タイプ（DAILY_CONFIRMATION/VACATION/HOLIDAY_WORK/OVERTIME/EARLY_WORK/TRANSFER）
 * @param {string} targetDate - 対象日（YYYY-MM-DD形式）
 * @returns {Promise<Object>} 申請状態
 */
const getApplicationStatus = async (employeeId, applicationType, targetDate) => {
  let status = 'NOT_SUBMITTED';
  let applicationId = null;
  
  switch (applicationType) {
    case 'DAILY_CONFIRMATION': {
      // 日次確定申請の状態を取得
      const attendanceModel = require('../models/attendanceModel');
      const attendance = await attendanceModel.getAttendanceDetail(employeeId, targetDate);
      if (attendance && attendance.APPROVAL_STATUS) {
        status = attendance.APPROVAL_STATUS;
      }
      break;
    }
    case 'VACATION': {
      // 休暇申請の状態を取得
      const vacations = await applicationModel.getVacations(employeeId, targetDate, targetDate);
      if (vacations && vacations.length > 0) {
        const vacation = vacations.find(v => 
          v.START_DATE <= targetDate && v.END_DATE >= targetDate &&
          (v.APPROVAL_STATUS === 'PENDING' || v.APPROVAL_STATUS === 'APPROVED')
        );
        if (vacation) {
          status = vacation.APPROVAL_STATUS;
          applicationId = vacation.VACATION_ID;
        }
      }
      break;
    }
    case 'HOLIDAY_WORK':
    case 'OVERTIME':
    case 'EARLY_WORK':
    case 'TRANSFER': {
      // APPLICATION_HISTORYから取得
      const application = await applicationModel.getApplicationStatus(employeeId, applicationType, targetDate);
      if (application) {
        status = application.APPROVAL_STATUS;
        applicationId = application.APPLICATION_ID;
      }
      break;
    }
  }
  
  return {
    status,
    applicationId
  };
};

/**
 * 月次確定申請取消
 * @param {string} employeeId - 従業員ID
 * @param {number} year - 年
 * @param {number} month - 月
 * @returns {Promise<void>}
 */
const cancelMonthlyApproval = async (employeeId, year, month) => {
  const targetYearMonth = `${year}-${String(month).padStart(2, '0')}`;
  
  // 現在の状態を確認
  const currentStatus = await applicationModel.getMonthlyApprovalStatus(employeeId, targetYearMonth);
  
  if (currentStatus !== 'PENDING') {
    throw new Error('申請中の月次確定のみ取り消すことができます。');
  }
  
  // 状態を更新
  await applicationModel.updateMonthlyApprovalStatus(employeeId, targetYearMonth, 'NOT_SUBMITTED');
  
  // 履歴を追加
  const nextSeq = await applicationModel.getNextSeqNo(employeeId, targetYearMonth);
  await applicationModel.createMonthlyApprovalHistory({
    employeeId,
    targetYearMonth,
    seqNo: nextSeq,
    actionType: 'CANCEL',
    actorId: employeeId,
    comment: '申請を取り消しました'
  });
};

/**
 * 申請を取り消す
 * @param {string} employeeId - 従業員ID
 * @param {string} applicationType - 申請タイプ（DAILY_CONFIRMATION/VACATION/HOLIDAY_WORK/OVERTIME/EARLY_WORK/TRANSFER）
 * @param {string|number} applicationId - 申請ID
 * @param {string} targetDate - 対象日（YYYY-MM-DD形式、日次確定の場合のみ）
 * @returns {Promise<void>}
 */
const cancelApplication = async (employeeId, applicationType, applicationId, targetDate = null) => {
  switch (applicationType) {
    case 'DAILY_CONFIRMATION': {
      // 日次確定申請の取り消し
      const attendanceModel = require('../models/attendanceModel');
      const attendanceService = require('../services/attendanceService');
      
      if (!targetDate) {
        throw new Error('対象日が必要です。');
      }
      
      // 月次申請状態を確認
      const date = new Date(targetDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthlyStatus = await applicationModel.getMonthlyApprovalStatus(
        employeeId, 
        `${year}-${String(month).padStart(2, '0')}`
      );
      
      if (monthlyStatus === 'PENDING' || monthlyStatus === 'APPROVED') {
        throw new Error('月次申請を行っている場合、日次申請の取り消しはできません。');
      }
      
      await attendanceService.cancelDailyConfirmation(employeeId, targetDate);
      break;
    }
    case 'VACATION': {
      // 休暇申請の取り消し
      // 申請情報を取得
      const vacation = await applicationModel.getVacationById(applicationId);
      if (!vacation || vacation.EMPLOYEE_ID !== employeeId) {
        throw new Error('休暇申請が見つかりません。');
      }
      
      // 有給休暇の場合、残日数を戻す
      if (vacation.VACATION_TYPE_CODE === 'PAID_LEAVE') {
        const fiscalYear = getFiscalYear(vacation.START_DATE);
        await applicationModel.increaseVacationBalance(
          employeeId,
          vacation.VACATION_TYPE_CODE,
          vacation.VACATION_DAYS,
          fiscalYear
        );
      }
      
      // 申請状態をNOT_SUBMITTEDに更新
      const db = require('../config/database');
      const query = `
        UPDATE VACATION_HISTORY
        SET APPROVAL_STATUS = 'NOT_SUBMITTED',
            UPDATED_AT = NOW()
        WHERE VACATION_ID = ? AND EMPLOYEE_ID = ?
          AND APPROVAL_STATUS IN ('PENDING', 'APPROVED')
      `;
      await db.execute(query, [applicationId, employeeId]);
      break;
    }
    case 'HOLIDAY_WORK': {
      // 休日出勤申請の取り消し
      // APPLICATION_HISTORYから削除（実際には状態をNOT_SUBMITTEDに更新し、備考もクリア）
      const db = require('../config/database');
      const query = `
        UPDATE APPLICATION_HISTORY
        SET APPROVAL_STATUS = 'NOT_SUBMITTED',
            REASON = NULL,
            UPDATED_AT = NOW()
        WHERE APPLICATION_ID = ? AND EMPLOYEE_ID = ?
          AND APPLICATION_TYPE = ?
          AND APPROVAL_STATUS IN ('PENDING', 'APPROVED')
      `;
      await db.execute(query, [applicationId, employeeId, applicationType]);
      
      // 申請情報から対象日を取得
      const applicationInfoQuery = `
        SELECT TARGET_START_DATE
        FROM APPLICATION_HISTORY
        WHERE APPLICATION_ID = ? AND EMPLOYEE_ID = ?
      `;
      const [applicationRows] = await db.execute(applicationInfoQuery, [applicationId, employeeId]);
      
      if (applicationRows.length > 0) {
        // 日付をYYYY-MM-DD形式に正規化
        const targetDate = normalizeDate(applicationRows[0].TARGET_START_DATE);
        
        // その日の勤怠データを削除
        const attendanceModel = require('../models/attendanceModel');
        const breakTimeModel = require('../models/breakTimeModel');
        const workHoursModel = require('../models/workHoursModel');
        
        // 勤怠記録を取得（削除前にIDを取得するため）
        const attendance = await attendanceModel.getAttendanceByDate(employeeId, targetDate);
        
        if (attendance) {
          const attendanceId = attendance.ATTENDANCE_ID;
          
          // 休憩時間と公用外出を削除
          await breakTimeModel.deleteBreakTimesByAttendanceId(attendanceId);
          await breakTimeModel.deleteOfficialOutingsByAttendanceId(attendanceId);
          
          // 工数実績を削除
          await workHoursModel.deleteWorkHoursByDate(employeeId, targetDate);
          
          // 勤怠記録を削除
          await attendanceModel.deleteAttendanceByDate(employeeId, targetDate);
        } else {
          // 勤怠記録が存在しない場合でも工数実績は削除
          await workHoursModel.deleteWorkHoursByDate(employeeId, targetDate);
        }
      }
      break;
    }
    case 'OVERTIME':
    case 'EARLY_WORK':
    case 'TRANSFER': {
      // APPLICATION_HISTORYから削除（実際には状態をNOT_SUBMITTEDに更新）
      const db = require('../config/database');
      const query = `
        UPDATE APPLICATION_HISTORY
        SET APPROVAL_STATUS = 'NOT_SUBMITTED',
            UPDATED_AT = NOW()
        WHERE APPLICATION_ID = ? AND EMPLOYEE_ID = ?
          AND APPLICATION_TYPE = ?
          AND APPROVAL_STATUS IN ('PENDING', 'APPROVED')
      `;
      await db.execute(query, [applicationId, employeeId, applicationType]);
      break;
    }
    default:
      throw new Error('無効な申請タイプです。');
  }
};

/**
 * 休暇情報を取得
 * @param {string} employeeId - 従業員ID
 * @returns {Promise<Object>} 休暇情報
 */
const getVacationInfo = async (employeeId) => {
  const balances = await applicationModel.getVacationBalanceSummary(employeeId);
  const history = await applicationModel.getVacationHistory(employeeId, 20);
  
  return {
    balances,
    history
  };
};

/**
 * 有給残日数を取得
 * @param {string} employeeId - 従業員ID
 * @param {string} vacationTypeCode - 休暇種別コード
 * @returns {Promise<number>} 残日数
 */
const getVacationBalance = async (employeeId, vacationTypeCode) => {
  return await applicationModel.getVacationBalance(employeeId, vacationTypeCode);
};

/**
 * 申請情報と承認履歴を取得
 * @param {string} employeeId - 従業員ID
 * @param {string} applicationType - 申請タイプ（DAILY_CONFIRMATION/VACATION/HOLIDAY_WORK/OVERTIME/EARLY_WORK/TRANSFER）
 * @param {string} targetDate - 対象日（YYYY-MM-DD形式）
 * @returns {Promise<Object|null>} 申請情報と承認履歴
 */
const getApplicationInfo = async (employeeId, applicationType, targetDate) => {
  switch (applicationType) {
    case 'DAILY_CONFIRMATION':
      return await applicationModel.getDailyConfirmationApplicationInfo(employeeId, targetDate);
    case 'VACATION':
      return await applicationModel.getVacationApplicationInfo(employeeId, targetDate);
    case 'HOLIDAY_WORK':
    case 'OVERTIME':
    case 'EARLY_WORK':
    case 'TRANSFER':
      return await applicationModel.getApplicationInfo(employeeId, applicationType, targetDate);
    default:
      throw new Error('無効な申請タイプです。');
  }
};

module.exports = {
  applyVacation,
  applyHolidayWork,
  applyOvertime,
  applyEarlyWork,
  applyTransfer,
  getHolidayWorkStatus,
  getMonthlyApprovalHistory,
  cancelMonthlyApproval,
  getVacationInfo,
  getVacationBalance,
  getApplicationStatus,
  getApplicationInfo,
  cancelApplication
};

