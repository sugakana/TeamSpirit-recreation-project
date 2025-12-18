/**
 * 申請モデル
 */
const db = require('../config/database');

/**
 * 休暇申請を作成
 * @param {Object} vacationData - 休暇申請データ
 * @returns {Promise<number>} 作成されたVACATION_ID
 */
const createVacation = async (vacationData) => {
  const {
    employeeId,
    vacationTypeCode,
    startDate,
    endDate,
    vacationDays,
    reason,
    contactInfo,
    approvalStatus,
    createdAt,
    updatedAt
  } = vacationData;
  
  const query = `
    INSERT INTO VACATION_HISTORY 
    (EMPLOYEE_ID, VACATION_TYPE_CODE, START_DATE, END_DATE, VACATION_DAYS, REASON, CONTACT_INFO, APPROVAL_STATUS, CREATED_AT, UPDATED_AT)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const [result] = await db.execute(query, [
    employeeId,
    vacationTypeCode,
    startDate,
    endDate,
    vacationDays,
    reason || null,
    contactInfo || null,
    approvalStatus || 'PENDING',
    createdAt,
    updatedAt
  ]);
  
  return result.insertId;
};

/**
 * 休暇申請を取得
 * @param {string} employeeId - 従業員ID
 * @param {string} startDate - 開始日（YYYY-MM-DD形式）
 * @param {string} endDate - 終了日（YYYY-MM-DD形式）
 * @returns {Promise<Array>} 休暇申請の配列
 */
const getVacations = async (employeeId, startDate, endDate) => {
  const query = `
    SELECT VACATION_ID, VACATION_TYPE_CODE, START_DATE, END_DATE, VACATION_DAYS, APPROVAL_STATUS, REASON, CONTACT_INFO, CREATED_AT, UPDATED_AT
    FROM VACATION_HISTORY
    WHERE EMPLOYEE_ID = ? 
      AND START_DATE <= ? 
      AND END_DATE >= ? 
      AND APPROVAL_STATUS IN ('PENDING', 'APPROVED')
    ORDER BY START_DATE
  `;
  
  const [rows] = await db.execute(query, [employeeId, endDate, startDate]);
  return rows;
};

/**
 * 休暇残日数を取得
 * @param {string} employeeId - 従業員ID
 * @param {string} vacationTypeCode - 休暇種別コード
 * @returns {Promise<number>} 残日数
 */
const getVacationBalance = async (employeeId, vacationTypeCode) => {
  const query = `
    SELECT REMAINING_DAYS
    FROM V_VACATION_BALANCE_SUMMARY
    WHERE EMPLOYEE_ID = ? AND VACATION_TYPE_CODE = ?
  `;
  
  const [rows] = await db.execute(query, [employeeId, vacationTypeCode]);

  if (rows.length > 0) {
    return rows[0].REMAINING_DAYS;
  }

  return 0;
};

/**
 * 申請履歴を作成
 * @param {Object} applicationData - 申請データ
 * @returns {Promise<number>} 作成されたAPPLICATION_ID
 */
const createApplication = async (applicationData) => {
  const {
    employeeId,
    applicationType,
    targetStartDate,
    targetEndDate,
    overtimeHours,
    reason,
    approvalStatus,
    createdAt,
    updatedAt
  } = applicationData;
  
  const query = `
    INSERT INTO APPLICATION_HISTORY 
    (EMPLOYEE_ID, APPLICATION_TYPE, TARGET_START_DATE, TARGET_END_DATE, OVERTIME_HOURS, REASON, APPROVAL_STATUS, CREATED_AT, UPDATED_AT)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const [result] = await db.execute(query, [
    employeeId,
    applicationType,
    targetStartDate,
    targetEndDate,
    overtimeHours || null,
    reason || null,
    approvalStatus || 'PENDING',
    createdAt,
    updatedAt
  ]);
  
  return result.insertId;
};

/**
 * 申請状態を取得
 * @param {string} employeeId - 従業員ID
 * @param {string} applicationType - 申請種別
 * @param {string} targetDate - 対象日（YYYY-MM-DD形式）
 * @returns {Promise<Object|null>} 申請情報
 */
const getApplicationStatus = async (employeeId, applicationType, targetDate) => {
  const query = `
    SELECT APPLICATION_ID, APPROVAL_STATUS
    FROM APPLICATION_HISTORY
    WHERE EMPLOYEE_ID = ? 
      AND APPLICATION_TYPE = ?
      AND TARGET_START_DATE <= ?
      AND TARGET_END_DATE >= ?
      AND APPROVAL_STATUS IN ('PENDING', 'APPROVED')
    LIMIT 1
  `;
  
  const [rows] = await db.execute(query, [employeeId, applicationType, targetDate, targetDate]);
  if (rows.length > 0) {
    return rows[0];
  }

  return null;
};

/**
 * 月次承認状態を取得
 * @param {string} employeeId - 従業員ID
 * @param {string} targetYearMonth - 対象年月（YYYY-MM形式）
 * @returns {Promise<string>} 承認状態
 */
const getMonthlyApprovalStatus = async (employeeId, targetYearMonth) => {
  const query = `
    SELECT MONTHLY_APPROVAL_STATUS
    FROM MONTHLY_ATTENDANCE
    WHERE EMPLOYEE_ID = ? AND TARGET_YEAR_MONTH = ?
  `;
  
  const [rows] = await db.execute(query, [employeeId, targetYearMonth]);
  if (rows.length > 0) {
    return rows[0].MONTHLY_APPROVAL_STATUS;
  }

  return 'NOT_SUBMITTED';
};

/**
 * 月次承認履歴を取得
 * @param {string} employeeId - 従業員ID
 * @param {string} targetYearMonth - 対象年月（YYYY-MM形式）
 * @returns {Promise<Array>} 承認履歴の配列
 */
const getMonthlyApprovalHistory = async (employeeId, targetYearMonth) => {
  const query = `
    SELECT 
      SEQ_NO,
      DATE_FORMAT(ACTION_DATETIME, '%Y-%m-%d %H:%i') AS ACTION_DATETIME,
      ACTION_TYPE_DISPLAY,
      ACTOR_NAME,
      COMMENT
    FROM V_MONTHLY_APPROVAL_HISTORY
    WHERE EMPLOYEE_ID = ? AND TARGET_YEAR_MONTH = ?
    ORDER BY SEQ_NO
  `;
  
  const [rows] = await db.execute(query, [employeeId, targetYearMonth]);
  return rows;
};

/**
 * 月次承認状態を更新
 * @param {string} employeeId - 従業員ID
 * @param {string} targetYearMonth - 対象年月（YYYY-MM形式）
 * @param {string} status - 承認状態
 * @returns {Promise<void>}
 */
const updateMonthlyApprovalStatus = async (employeeId, targetYearMonth, status) => {
  const query = `
    UPDATE MONTHLY_ATTENDANCE
    SET MONTHLY_APPROVAL_STATUS = ?,
        SUBMITTED_AT = ?,
        UPDATED_AT = NOW()
    WHERE EMPLOYEE_ID = ? AND TARGET_YEAR_MONTH = ?
  `;
  
  let submittedAt = null;

  if (status !== 'NOT_SUBMITTED') {
    submittedAt = new Date();
  }

  await db.execute(query, [
    status,
    submittedAt,
    employeeId,
    targetYearMonth
  ]);
};

/**
 * 月次承認履歴を作成
 * @param {Object} historyData - 履歴データ
 * @returns {Promise<void>}
 */
const createMonthlyApprovalHistory = async (historyData) => {
  const {
    employeeId,
    targetYearMonth,
    seqNo,
    actionType,
    actorId,
    comment
  } = historyData;
  
  const query = `
    INSERT INTO MONTHLY_APPROVAL_HISTORY 
    (EMPLOYEE_ID, TARGET_YEAR_MONTH, SEQ_NO, ACTION_DATETIME, ACTION_TYPE, ACTOR_ID, COMMENT)
    VALUES (?, ?, ?, NOW(), ?, ?, ?)
  `;
  
  await db.execute(query, [
    employeeId,
    targetYearMonth,
    seqNo,
    actionType,
    actorId,
    comment || null
  ]);
};

/**
 * 次のSEQ_NOを取得
 * @param {string} employeeId - 従業員ID
 * @param {string} targetYearMonth - 対象年月（YYYY-MM形式）
 * @returns {Promise<number>} 次のSEQ_NO
 */
const getNextSeqNo = async (employeeId, targetYearMonth) => {
  const query = `
    SELECT COALESCE(MAX(SEQ_NO), 0) + 1 AS NEXT_SEQ
    FROM MONTHLY_APPROVAL_HISTORY
    WHERE EMPLOYEE_ID = ? AND TARGET_YEAR_MONTH = ?
  `;
  
  const [rows] = await db.execute(query, [employeeId, targetYearMonth]);
  return rows[0].NEXT_SEQ;
};

/**
 * 休暇残日数サマリーを取得
 * @param {string} employeeId - 従業員ID
 * @returns {Promise<Array>} 休暇残日数の配列
 */
const getVacationBalanceSummary = async (employeeId) => {
  const query = `
    SELECT 
      vbs.VACATION_TYPE_CODE,
      vbs.VACATION_TYPE_NAME,
      vbs.GRANTED_DAYS,
      vbs.USED_DAYS,
      vbs.REMAINING_DAYS,
      vbs.EXPIRATION_DATE
    FROM V_VACATION_BALANCE_SUMMARY vbs
    WHERE vbs.EMPLOYEE_ID = ?
    ORDER BY vbs.VACATION_TYPE_CODE
  `;
  
  const [rows] = await db.execute(query, [employeeId]);
  return rows;
};

/**
 * 休暇取得履歴を取得
 * @param {string} employeeId - 従業員ID
 * @param {number} limit - 取得件数
 * @returns {Promise<Array>} 休暇取得履歴の配列
 */
const getVacationHistory = async (employeeId, limit = 20) => {
  const query = `
    SELECT 
      VACATION_ID,
      VACATION_TYPE_CODE,
      START_DATE,
      END_DATE,
      VACATION_DAYS,
      REASON,
      APPROVAL_STATUS
    FROM VACATION_HISTORY
    WHERE EMPLOYEE_ID = ?
    ORDER BY START_DATE DESC
    LIMIT ?
  `;
  
  const [rows] = await db.execute(query, [employeeId, limit]);
  return rows;
};

/**
 * 申請種別と期間で申請を取得
 * @param {string} employeeId - 従業員ID
 * @param {string} applicationType - 申請種別
 * @param {string} startDate - 開始日（YYYY-MM-DD形式）
 * @param {string} endDate - 終了日（YYYY-MM-DD形式）
 * @returns {Promise<Array>} 申請の配列
 */
const getApplicationsByType = async (employeeId, applicationType, startDate, endDate) => {
  const query = `
    SELECT APPLICATION_ID, EMPLOYEE_ID, APPLICATION_TYPE, TARGET_START_DATE, TARGET_END_DATE, 
           OVERTIME_HOURS, REASON, APPROVAL_STATUS, CREATED_AT, UPDATED_AT
    FROM APPLICATION_HISTORY
    WHERE EMPLOYEE_ID = ? 
      AND APPLICATION_TYPE = ?
      AND TARGET_START_DATE <= ?
      AND TARGET_END_DATE >= ?
      AND APPROVAL_STATUS IN ('PENDING', 'APPROVED')
    ORDER BY TARGET_START_DATE
  `;
  
  const [rows] = await db.execute(query, [employeeId, applicationType, endDate, startDate]);
  return rows;
};

/**
 * 申請情報と承認履歴を取得（日次確定申請）
 * @param {string} employeeId - 従業員ID
 * @param {string} targetDate - 対象日（YYYY-MM-DD形式）
 * @returns {Promise<Object|null>} 申請情報と承認履歴
 */
const getDailyConfirmationApplicationInfo = async (employeeId, targetDate) => {
  // APPLICATION_HISTORYテーブルから日次確定申請の履歴を取得
  const historyQuery = `
    SELECT 
      ah.APPLICATION_ID,
      DATE_FORMAT(ah.CREATED_AT, '%Y/%m/%d %H:%i') AS ACTION_DATETIME,
      ah.CREATED_AT,
      ah.APPROVAL_STATUS,
      DATE_FORMAT(ah.UPDATED_AT, '%Y/%m/%d %H:%i') AS UPDATED_DATETIME,
      e.EMPLOYEE_NAME AS ACTOR_NAME
    FROM APPLICATION_HISTORY ah
    LEFT JOIN EMPLOYEE e ON ah.EMPLOYEE_ID = e.EMPLOYEE_ID
    WHERE ah.EMPLOYEE_ID = ?
      AND ah.APPLICATION_TYPE = 'DAILY_CONFIRMATION'
      AND ah.TARGET_START_DATE = ?
      AND ah.TARGET_END_DATE = ?
    ORDER BY ah.CREATED_AT ASC
  `;
  
  const [historyRows] = await db.execute(historyQuery, [employeeId, targetDate, targetDate]);
  
  // 最新の申請（PENDINGまたはAPPROVED）を取得
  const validApplications = historyRows.filter(r => r.APPROVAL_STATUS === 'PENDING' || r.APPROVAL_STATUS === 'APPROVED');
  if (validApplications.length === 0) {
    // APPLICATION_HISTORYに履歴がない場合、ATTENDANCE_RECORDから取得（後方互換性のため）
    const query = `
      SELECT 
        ar.ATTENDANCE_ID,
        DATE_FORMAT(ar.CREATED_AT, '%Y/%m/%d %H:%i') AS APPLICATION_DATE,
        ar.APPROVAL_STATUS,
        DATE_FORMAT(ar.UPDATED_AT, '%Y/%m/%d %H:%i') AS UPDATED_DATE,
        e.EMPLOYEE_NAME AS ACTOR_NAME
      FROM ATTENDANCE_RECORD ar
      LEFT JOIN EMPLOYEE e ON ar.EMPLOYEE_ID = e.EMPLOYEE_ID
      WHERE ar.EMPLOYEE_ID = ? 
        AND ar.WORK_DATE = ?
        AND ar.APPROVAL_STATUS IN ('PENDING', 'APPROVED')
      ORDER BY ar.CREATED_AT DESC
      LIMIT 1
    `;
    
    const [rows] = await db.execute(query, [employeeId, targetDate]);
    if (rows.length === 0) {
      return null;
    }
    
    const application = rows[0];
    return {
      applicationId: null, // ATTENDANCE_RECORDから取得する場合はapplicationIdはnull（日次確定はtargetDateを使用）
      applicationDate: application.APPLICATION_DATE,
      status: application.APPROVAL_STATUS === 'PENDING' ? '申請済み' : '承認済み',
      history: [{
        SEQ_NO: 1,
        ACTION_DATETIME: application.APPLICATION_DATE,
        ACTION_TYPE: 'SUBMIT',
        ACTION_TYPE_DISPLAY: '申請済み',
        ACTOR_NAME: application.ACTOR_NAME || '',
        COMMENT: ''
      }]
    };
  }
  
  // CREATED_ATでソートして最新のものを取得
  const latestApplication = validApplications.sort((a, b) => new Date(b.CREATED_AT) - new Date(a.CREATED_AT))[0];
  
  // 承認履歴を構築（時系列順）
  const history = [];
  let seqNo = 1;
  
  for (let i = 0; i < historyRows.length; i++) {
    const app = historyRows[i];
    const isLast = i === historyRows.length - 1;
    
    // 申請履歴
    history.push({
      SEQ_NO: seqNo++,
      ACTION_DATETIME: app.ACTION_DATETIME,
      ACTION_TYPE: 'SUBMIT',
      ACTION_TYPE_DISPLAY: '申請済み',
      ACTOR_NAME: app.ACTOR_NAME || '',
      COMMENT: ''
    });
    
    // 承認済みの場合、承認履歴を追加
    if (app.APPROVAL_STATUS === 'APPROVED') {
      history.push({
        SEQ_NO: seqNo++,
        ACTION_DATETIME: app.UPDATED_DATETIME,
        ACTION_TYPE: 'APPROVE',
        ACTION_TYPE_DISPLAY: '承認済み',
        ACTOR_NAME: app.ACTOR_NAME || '',
        COMMENT: ''
      });
    }
    
    // 取消された場合（NOT_SUBMITTEDで、次の申請がある場合）、取消履歴を追加
    if (app.APPROVAL_STATUS === 'NOT_SUBMITTED' && !isLast) {
      history.push({
        SEQ_NO: seqNo++,
        ACTION_DATETIME: app.UPDATED_DATETIME,
        ACTION_TYPE: 'CANCEL',
        ACTION_TYPE_DISPLAY: '申請取消',
        ACTOR_NAME: app.ACTOR_NAME || '',
        COMMENT: ''
      });
    }
  }
  
  return {
    applicationId: latestApplication.APPLICATION_ID,
    applicationDate: latestApplication.ACTION_DATETIME,
    status: latestApplication.APPROVAL_STATUS === 'PENDING' ? '申請済み' : '承認済み',
    history: history
  };
};

/**
 * 申請情報と承認履歴を取得（休暇申請）
 * @param {string} employeeId - 従業員ID
 * @param {string} targetDate - 対象日（YYYY-MM-DD形式）
 * @returns {Promise<Object|null>} 申請情報と承認履歴
 */
const getVacationApplicationInfo = async (employeeId, targetDate) => {
  // 全ての申請履歴を取得（PENDING, APPROVED, NOT_SUBMITTEDを含む）
  const query = `
    SELECT 
      vh.VACATION_ID,
      vh.VACATION_TYPE_CODE,
      vh.START_DATE,
      vh.END_DATE,
      vh.REASON,
      vh.CONTACT_INFO,
      DATE_FORMAT(vh.CREATED_AT, '%Y/%m/%d %H:%i') AS APPLICATION_DATE,
      vh.CREATED_AT,
      vh.APPROVAL_STATUS,
      DATE_FORMAT(vh.UPDATED_AT, '%Y/%m/%d %H:%i') AS UPDATED_DATE,
      e.EMPLOYEE_NAME AS ACTOR_NAME
    FROM VACATION_HISTORY vh
    LEFT JOIN EMPLOYEE e ON vh.EMPLOYEE_ID = e.EMPLOYEE_ID
    WHERE vh.EMPLOYEE_ID = ? 
      AND vh.START_DATE <= ?
      AND vh.END_DATE >= ?
      AND vh.APPROVAL_STATUS IN ('PENDING', 'APPROVED', 'NOT_SUBMITTED')
    ORDER BY vh.CREATED_AT ASC
  `;
  
  const [rows] = await db.execute(query, [employeeId, targetDate, targetDate]);
  if (rows.length === 0) {
    return null;
  }
  
  // 最新の申請（PENDINGまたはAPPROVED）を取得
  // PENDINGまたはAPPROVEDの申請をフィルタして、CREATED_ATが最新のものを取得
  const validApplications = rows.filter(r => r.APPROVAL_STATUS === 'PENDING' || r.APPROVAL_STATUS === 'APPROVED');
  if (validApplications.length === 0) {
    return null;
  }
  // CREATED_ATでソートして最新のものを取得
  const latestApplication = validApplications.sort((a, b) => new Date(b.CREATED_AT) - new Date(a.CREATED_AT))[0];
  if (!latestApplication) {
    return null;
  }
  
  // 承認履歴を構築（時系列順）
  const history = [];
  let seqNo = 1;
  
  for (let i = 0; i < rows.length; i++) {
    const app = rows[i];
    const isLast = i === rows.length - 1;
    
    // 申請履歴
    history.push({
      SEQ_NO: seqNo++,
      ACTION_DATETIME: app.APPLICATION_DATE,
      ACTION_TYPE: 'SUBMIT',
      ACTION_TYPE_DISPLAY: '申請済み',
      ACTOR_NAME: app.ACTOR_NAME || '',
      COMMENT: ''
    });
    
    // 承認済みの場合、承認履歴を追加
    if (app.APPROVAL_STATUS === 'APPROVED') {
      history.push({
        SEQ_NO: seqNo++,
        ACTION_DATETIME: app.UPDATED_DATE,
        ACTION_TYPE: 'APPROVE',
        ACTION_TYPE_DISPLAY: '承認済み',
        ACTOR_NAME: app.ACTOR_NAME || '',
        COMMENT: ''
      });
    }
    
    // 取消された場合（NOT_SUBMITTEDで、次の申請がある場合）、取消履歴を追加
    if (app.APPROVAL_STATUS === 'NOT_SUBMITTED' && !isLast) {
      history.push({
        SEQ_NO: seqNo++,
        ACTION_DATETIME: app.UPDATED_DATE,
        ACTION_TYPE: 'CANCEL',
        ACTION_TYPE_DISPLAY: '申請取消',
        ACTOR_NAME: app.ACTOR_NAME || '',
        COMMENT: ''
      });
    }
  }
  
  return {
    applicationId: latestApplication.VACATION_ID,
    applicationDate: latestApplication.APPLICATION_DATE,
    status: latestApplication.APPROVAL_STATUS === 'PENDING' ? '申請済み' : '承認済み',
    history: history,
    applicationData: {
      VACATION_TYPE_CODE: latestApplication.VACATION_TYPE_CODE,
      START_DATE: latestApplication.START_DATE,
      END_DATE: latestApplication.END_DATE,
      REASON: latestApplication.REASON,
      CONTACT_INFO: latestApplication.CONTACT_INFO
    }
  };
};

/**
 * 申請情報と承認履歴を取得（その他の申請：休日出勤、残業、早朝勤務、振替）
 * @param {string} employeeId - 従業員ID
 * @param {string} applicationType - 申請種別
 * @param {string} targetDate - 対象日（YYYY-MM-DD形式）
 * @returns {Promise<Object|null>} 申請情報と承認履歴
 */
const getApplicationInfo = async (employeeId, applicationType, targetDate) => {
  // 全ての申請履歴を取得（PENDING, APPROVED, NOT_SUBMITTEDを含む）
  const query = `
    SELECT 
      ah.APPLICATION_ID,
      DATE_FORMAT(ah.CREATED_AT, '%Y/%m/%d %H:%i') AS APPLICATION_DATE,
      ah.CREATED_AT,
      ah.APPROVAL_STATUS,
      DATE_FORMAT(ah.UPDATED_AT, '%Y/%m/%d %H:%i') AS UPDATED_DATE,
      e.EMPLOYEE_NAME AS ACTOR_NAME
    FROM APPLICATION_HISTORY ah
    LEFT JOIN EMPLOYEE e ON ah.EMPLOYEE_ID = e.EMPLOYEE_ID
    WHERE ah.EMPLOYEE_ID = ? 
      AND ah.APPLICATION_TYPE = ?
      AND ah.TARGET_START_DATE <= ?
      AND ah.TARGET_END_DATE >= ?
      AND ah.APPROVAL_STATUS IN ('PENDING', 'APPROVED', 'NOT_SUBMITTED')
    ORDER BY ah.CREATED_AT ASC
  `;
  
  const [rows] = await db.execute(query, [employeeId, applicationType, targetDate, targetDate]);
  if (rows.length === 0) {
    return null;
  }
  
  // 最新の申請（PENDINGまたはAPPROVED）を取得
  // PENDINGまたはAPPROVEDの申請をフィルタして、CREATED_ATが最新のものを取得
  const validApplications = rows.filter(r => r.APPROVAL_STATUS === 'PENDING' || r.APPROVAL_STATUS === 'APPROVED');
  if (validApplications.length === 0) {
    return null;
  }
  // CREATED_ATでソートして最新のものを取得
  const latestApplication = validApplications.sort((a, b) => new Date(b.CREATED_AT) - new Date(a.CREATED_AT))[0];
  if (!latestApplication) {
    return null;
  }
  
  // 承認履歴を構築（時系列順）
  const history = [];
  let seqNo = 1;
  
  for (let i = 0; i < rows.length; i++) {
    const app = rows[i];
    const isLast = i === rows.length - 1;
    
    // 申請履歴
    history.push({
      SEQ_NO: seqNo++,
      ACTION_DATETIME: app.APPLICATION_DATE,
      ACTION_TYPE: 'SUBMIT',
      ACTION_TYPE_DISPLAY: '申請済み',
      ACTOR_NAME: app.ACTOR_NAME || '',
      COMMENT: ''
    });
    
    // 承認済みの場合、承認履歴を追加
    if (app.APPROVAL_STATUS === 'APPROVED') {
      history.push({
        SEQ_NO: seqNo++,
        ACTION_DATETIME: app.UPDATED_DATE,
        ACTION_TYPE: 'APPROVE',
        ACTION_TYPE_DISPLAY: '承認済み',
        ACTOR_NAME: app.ACTOR_NAME || '',
        COMMENT: ''
      });
    }
    
    // 取消された場合（NOT_SUBMITTEDで、次の申請がある場合）、取消履歴を追加
    if (app.APPROVAL_STATUS === 'NOT_SUBMITTED' && !isLast) {
      history.push({
        SEQ_NO: seqNo++,
        ACTION_DATETIME: app.UPDATED_DATE,
        ACTION_TYPE: 'CANCEL',
        ACTION_TYPE_DISPLAY: '申請取消',
        ACTOR_NAME: app.ACTOR_NAME || '',
        COMMENT: ''
      });
    }
  }
  
  return {
    applicationId: latestApplication.APPLICATION_ID,
    applicationDate: latestApplication.APPLICATION_DATE,
    status: latestApplication.APPROVAL_STATUS === 'PENDING' ? '申請済み' : '承認済み',
    history: history
  };
};

/**
 * 有給休暇の残日数を減らす（申請時）
 * @param {string} employeeId - 従業員ID
 * @param {string} vacationTypeCode - 休暇種別コード
 * @param {number} vacationDays - 申請日数
 * @param {number} fiscalYear - 年度
 * @returns {Promise<void>}
 */
const decreaseVacationBalance = async (employeeId, vacationTypeCode, vacationDays, fiscalYear) => {
  // 日数は整数であるべきなので、数値に変換して整数に丸める
  const vacationDaysInt = Math.round(Number(vacationDays));
  
  if (isNaN(vacationDaysInt) || vacationDaysInt <= 0) {
    throw new Error(`無効な休暇日数です: ${vacationDays}`);
  }
  
  console.log(`[decreaseVacationBalance] 開始: employeeId=${employeeId}, vacationTypeCode=${vacationTypeCode}, vacationDays=${vacationDays} -> ${vacationDaysInt} (整数), fiscalYear=${fiscalYear}`);
  
  const getCurrentBalanceQuery = `
    SELECT USED_DAYS, GRANTED_DAYS
    FROM VACATION_BALANCE
    WHERE EMPLOYEE_ID = ? AND VACATION_TYPE_CODE = ? AND FISCAL_YEAR = ?
  `;
  
  const [currentRows] = await db.execute(getCurrentBalanceQuery, [employeeId, vacationTypeCode, fiscalYear]);
  
  if (currentRows.length === 0) {
    console.error(`[decreaseVacationBalance] エラー: 休暇残日数レコードが見つかりません。employeeId=${employeeId}, vacationTypeCode=${vacationTypeCode}, fiscalYear=${fiscalYear}`);
    throw new Error(`休暇残日数レコードが見つかりません。employeeId=${employeeId}, vacationTypeCode=${vacationTypeCode}, fiscalYear=${fiscalYear}`);
  }
  
  // USED_DAYSとGRANTED_DAYSも整数に丸める（データベースのDECIMAL型から取得した値が小数になる可能性があるため）
  const currentUsedDays = Math.round(Number(currentRows[0].USED_DAYS));
  const grantedDays = Math.round(Number(currentRows[0].GRANTED_DAYS));
  const newUsedDays = currentUsedDays + vacationDaysInt;
  const newRemainingDays = grantedDays - newUsedDays;
  
  console.log(`[decreaseVacationBalance] 更新前: USED_DAYS=${currentUsedDays}, GRANTED_DAYS=${grantedDays}, REMAINING_DAYS=${grantedDays - currentUsedDays}`);
  console.log(`[decreaseVacationBalance] 更新後: USED_DAYS=${newUsedDays}, REMAINING_DAYS=${newRemainingDays}`);
  
  const updateQuery = `
    UPDATE VACATION_BALANCE
    SET USED_DAYS = ?,
        REMAINING_DAYS = ?,
        UPDATED_AT = NOW()
    WHERE EMPLOYEE_ID = ?
      AND VACATION_TYPE_CODE = ?
      AND FISCAL_YEAR = ?
  `;
  
  const [result] = await db.execute(updateQuery, [newUsedDays, newRemainingDays, employeeId, vacationTypeCode, fiscalYear]);
  console.log(`[decreaseVacationBalance] 更新完了: affectedRows=${result.affectedRows}`);
  
  if (result.affectedRows === 0) {
    console.error(`[decreaseVacationBalance] 警告: 更新された行が0です。employeeId=${employeeId}, vacationTypeCode=${vacationTypeCode}, fiscalYear=${fiscalYear}`);
  }
};

/**
 * 有給休暇の残日数を戻す（申請取り消し時）
 * @param {string} employeeId - 従業員ID
 * @param {string} vacationTypeCode - 休暇種別コード
 * @param {number} vacationDays - 取り消し日数
 * @param {number} fiscalYear - 年度
 * @returns {Promise<void>}
 */
const increaseVacationBalance = async (employeeId, vacationTypeCode, vacationDays, fiscalYear) => {
  // 日数は整数であるべきなので、数値に変換して整数に丸める
  const vacationDaysInt = Math.round(Number(vacationDays));
  
  if (isNaN(vacationDaysInt) || vacationDaysInt <= 0) {
    throw new Error(`無効な休暇日数です: ${vacationDays}`);
  }
  
  const getCurrentBalanceQuery = `
    SELECT USED_DAYS, GRANTED_DAYS
    FROM VACATION_BALANCE
    WHERE EMPLOYEE_ID = ? AND VACATION_TYPE_CODE = ? AND FISCAL_YEAR = ?
  `;
  
  const [currentRows] = await db.execute(getCurrentBalanceQuery, [employeeId, vacationTypeCode, fiscalYear]);
  
  if (currentRows.length === 0) {
    throw new Error('休暇残日数レコードが見つかりません');
  }
  
  // USED_DAYSとGRANTED_DAYSも整数に丸める（データベースのDECIMAL型から取得した値が小数になる可能性があるため）
  const currentUsedDays = Math.round(Number(currentRows[0].USED_DAYS));
  const grantedDays = Math.round(Number(currentRows[0].GRANTED_DAYS));
  const newUsedDays = Math.max(currentUsedDays - vacationDaysInt, 0);
  const newRemainingDays = grantedDays - newUsedDays;
  
  const updateQuery = `
    UPDATE VACATION_BALANCE
    SET USED_DAYS = ?,
        REMAINING_DAYS = ?,
        UPDATED_AT = NOW()
    WHERE EMPLOYEE_ID = ?
      AND VACATION_TYPE_CODE = ?
      AND FISCAL_YEAR = ?
  `;
  
  await db.execute(updateQuery, [newUsedDays, newRemainingDays, employeeId, vacationTypeCode, fiscalYear]);
};

/**
 * 休暇申請情報を取得（申請取り消し時に使用）
 * @param {number} vacationId - 休暇申請ID
 * @returns {Promise<Object|null>} 休暇申請情報
 */
const getVacationById = async (vacationId) => {
  const query = `
    SELECT VACATION_ID, EMPLOYEE_ID, VACATION_TYPE_CODE, START_DATE, END_DATE, VACATION_DAYS, APPROVAL_STATUS
    FROM VACATION_HISTORY
    WHERE VACATION_ID = ?
  `;
  
  const [rows] = await db.execute(query, [vacationId]);
  return rows.length > 0 ? rows[0] : null;
};

module.exports = {
  createVacation,
  getVacations,
  getVacationBalance,
  createApplication,
  getApplicationStatus,
  getMonthlyApprovalStatus,
  getMonthlyApprovalHistory,
  updateMonthlyApprovalStatus,
  createMonthlyApprovalHistory,
  getNextSeqNo,
  getVacationBalanceSummary,
  getVacationHistory,
  getApplicationsByType,
  getDailyConfirmationApplicationInfo,
  getVacationApplicationInfo,
  getApplicationInfo,
  decreaseVacationBalance,
  increaseVacationBalance,
  getVacationById
};

