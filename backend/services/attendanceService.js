/**
 * 勤怠サービス
 */
const attendanceModel = require('../models/attendanceModel');
const breakTimeModel = require('../models/breakTimeModel');
const workHoursModel = require('../models/workHoursModel');
const applicationModel = require('../models/applicationModel');
const { 
  getTodayJST, 
  getNow, 
  toDateTime, 
  formatHours, 
  formatOverUnder,
  getMonthRange,
  getScheduledWorkDays,
  normalizeDate,
  calculateMinutes
} = require('../utils/dateUtils');
const db = require('../config/database');

/**
 * 日次勤怠記録を取得する。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} workDate 勤務日（YYYY-MM-DD形式）
 * @returns {Promise<Object|null>} 勤怠記録
 */
const getDailyAttendance = async (employeeId, workDate) => {
  const attendance = await attendanceModel.getAttendanceDetail(employeeId, workDate);
  
  if (!attendance) {
    return null;
  }
  
  const breakTimes = await breakTimeModel.getBreakTimes(attendance.ATTENDANCE_ID);
  const officialOutings = await breakTimeModel.getOfficialOutings(attendance.ATTENDANCE_ID);
  
  // 休憩時間と公用外出を統合
  const combinedBreakTimes = [];
  
  for (const breakTime of breakTimes) {
    combinedBreakTimes.push({
      ...breakTime,
      BREAK_TYPE: 'BREAK'
    });
  }
  
  for (const outing of officialOutings) {
    combinedBreakTimes.push({
      BREAK_ID: outing.OUTING_ID,
      BREAK_SEQ: outing.OUTING_SEQ,
      BREAK_START_TIME: outing.OUTING_START_TIME,
      BREAK_END_TIME: outing.OUTING_END_TIME,
      BREAK_DURATION_MINUTES: outing.OUTING_DURATION_MINUTES,
      BREAK_TYPE: 'OFFICIAL_OUTING',
      OUTING_PURPOSE: outing.OUTING_PURPOSE
    });
  }
  
  const isClockInManual = attendance.CLOCK_IN_TYPE === 'MANUAL';
  const isClockOutManual = attendance.CLOCK_OUT_TYPE === 'MANUAL';

  // ORIGINAL_CLOCK_IN_TIMEとORIGINAL_CLOCK_OUT_TIMEはデータベースから直接取得
  // データベースに値が存在しない場合は、CLOCK_IN_TYPEがSTAMPの場合にCLOCK_IN_TIMEを使用
  let originalClockInTime = attendance.ORIGINAL_CLOCK_IN_TIME;

  if (!originalClockInTime && attendance.CLOCK_IN_TYPE === 'STAMP') {
    originalClockInTime = attendance.CLOCK_IN_TIME;
  }

  let originalClockOutTime = attendance.ORIGINAL_CLOCK_OUT_TIME;

  if (!originalClockOutTime && attendance.CLOCK_OUT_TYPE === 'STAMP') {
    originalClockOutTime = attendance.CLOCK_OUT_TIME;
  }
  
  return {
    ...attendance,
    IS_CLOCK_IN_MANUAL: isClockInManual,
    IS_CLOCK_OUT_MANUAL: isClockOutManual,
    ORIGINAL_CLOCK_IN_TIME: originalClockInTime,
    ORIGINAL_CLOCK_OUT_TIME: originalClockOutTime,
    breakTimes: combinedBreakTimes,
    officialOutings
  };
};

/**
 * 勤怠記録を更新する。
 *
 * @param {Object} updateData 更新データ
 * @returns {Promise<Object>} 更新後の勤怠記録
 */
const updateAttendanceRecord = async (updateData) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    const now = getNow();
    
    const {
      attendanceId,
      employeeId,
      workDate,
      clockInTime,
      clockOutTime,
      clockInType,
      clockOutType,
      workLocationCode,
      remarkText,
      isClockInManual,
      isClockOutManual,
      breakTimes
    } = updateData;
    
    // 時刻文字列をDateTimeに変換
    let clockInDateTime = null;

    if (clockInTime) {
      clockInDateTime = toDateTime(clockInTime, workDate);
    }

    let clockOutDateTime = null;

    if (clockOutTime) {
      clockOutDateTime = toDateTime(clockOutTime, workDate);
    }
    
    // 既存レコードを取得（打刻種別を保持するため）
    let existingAttendance = null;

    if (attendanceId) {
      existingAttendance = await attendanceModel.getAttendanceById(attendanceId);
    } else {
      existingAttendance = await attendanceModel.getAttendanceByDate(employeeId, workDate);
    }
    
    // 打刻種別を判定
    // 出社時刻が手入力の場合、または既存レコードがない場合はMANUAL
    let finalClockInType;

    if (isClockInManual) {
      finalClockInType = 'MANUAL';
    } else if (clockInType && clockInType !== '') {
      // clockInTypeが指定されている場合（空文字列でない場合）
      finalClockInType = clockInType;
    } else if (existingAttendance && existingAttendance.CLOCK_IN_TYPE) {
      // 既存レコードがある場合は既存の打刻種別を保持
      finalClockInType = existingAttendance.CLOCK_IN_TYPE;
    } else {
      // 新規レコードの場合はMANUAL
      finalClockInType = 'MANUAL';
    }
    
    // 退社時刻が手入力の場合、または既存レコードがない場合はMANUAL
    let finalClockOutType;

    if (isClockOutManual) {
      finalClockOutType = 'MANUAL';
    } else if (clockOutType && clockOutType !== '') {
      // clockOutTypeが指定されている場合（空文字列でない場合）
      finalClockOutType = clockOutType;
    } else if (existingAttendance && existingAttendance.CLOCK_OUT_TYPE) {
      // 既存レコードがある場合は既存の打刻種別を保持（退社時刻が変更されていない場合）
      finalClockOutType = existingAttendance.CLOCK_OUT_TYPE;
    } else {
      // 新規レコードの場合はMANUAL
      finalClockOutType = 'MANUAL';
    }
    
    // 元の打刻時刻を保持（既存レコードがある場合は既存の値を保持、新規または打刻の場合は設定）
    let originalClockInDateTime = null;
    let originalClockOutDateTime = null;

    if (existingAttendance) {
      // 既存レコードがある場合
      // ORIGINAL_CLOCK_IN_TIMEが既に存在する場合は保持
      if (existingAttendance.ORIGINAL_CLOCK_IN_TIME) {
        originalClockInDateTime = existingAttendance.ORIGINAL_CLOCK_IN_TIME;
      } else if (finalClockInType === 'STAMP' && clockInDateTime) {
        // ORIGINAL_CLOCK_IN_TIMEが存在せず、打刻の場合はCLOCK_IN_TIMEを設定
        originalClockInDateTime = clockInDateTime;
      }
      
      // ORIGINAL_CLOCK_OUT_TIMEが既に存在する場合は保持
      if (existingAttendance.ORIGINAL_CLOCK_OUT_TIME) {
        originalClockOutDateTime = existingAttendance.ORIGINAL_CLOCK_OUT_TIME;
      } else if (finalClockOutType === 'STAMP' && clockOutDateTime) {
        // ORIGINAL_CLOCK_OUT_TIMEが存在せず、打刻の場合はCLOCK_OUT_TIMEを設定
        originalClockOutDateTime = clockOutDateTime;
      }
    } else {
      // 新規レコードの場合
      if (finalClockInType === 'STAMP' && clockInDateTime) {
        originalClockInDateTime = clockInDateTime;
      }

      if (finalClockOutType === 'STAMP' && clockOutDateTime) {
        originalClockOutDateTime = clockOutDateTime;
      }
    }
    
    let currentAttendanceId = attendanceId;

    if (!currentAttendanceId && existingAttendance) {
      currentAttendanceId = existingAttendance.ATTENDANCE_ID;
    }
    
    if (currentAttendanceId) {
      // 既存レコードを更新（部分更新対応：指定されていないフィールドは既存値を保持）
      const updateFields = {
        updatedAt: now
      };

      // 出社・退社時刻は指定されている場合のみ更新
      if (clockInTime !== undefined) {
        updateFields.clockInTime = clockInDateTime;
        updateFields.clockInType = finalClockInType;
        // 元の打刻時刻が存在しない場合のみ設定（既存の値を保持するため）
        if (originalClockInDateTime && !existingAttendance.ORIGINAL_CLOCK_IN_TIME) {
          updateFields.originalClockInTime = originalClockInDateTime;
        }
      }
      
      if (clockOutTime !== undefined) {
        updateFields.clockOutTime = clockOutDateTime;
        updateFields.clockOutType = finalClockOutType;
        // 元の打刻時刻が存在しない場合のみ設定（既存の値を保持するため）
        if (originalClockOutDateTime && !existingAttendance.ORIGINAL_CLOCK_OUT_TIME) {
          updateFields.originalClockOutTime = originalClockOutDateTime;
        }
      }
      
      // 勤務場所は指定されている場合のみ更新
      if (workLocationCode !== undefined) {
        updateFields.workLocationCode = workLocationCode || null;
      }

      // 備考は指定されている場合のみ更新
      if (remarkText !== undefined) {
        updateFields.remarkText = remarkText || null;
      }

      await attendanceModel.updateAttendance(currentAttendanceId, updateFields);
    } else {
      // 新規レコードを作成
      currentAttendanceId = await attendanceModel.createAttendance({
        employeeId,
        workDate,
        clockInTime: clockInDateTime,
        clockOutTime: clockOutDateTime,
        clockInType: finalClockInType,
        clockOutType: finalClockOutType,
        originalClockInTime: originalClockInDateTime,
        originalClockOutTime: originalClockOutDateTime,
        workLocationCode: workLocationCode || null,
        remarkText: remarkText || null,
        createdAt: now,
        updatedAt: now
      });
    }
    
    // 休憩時間・公用外出の更新
    if (breakTimes && Array.isArray(breakTimes) && currentAttendanceId) {
      // 既存の休憩時間と公用外出を削除
      await breakTimeModel.deleteBreakTimesByAttendanceId(currentAttendanceId);
      await breakTimeModel.deleteOfficialOutingsByAttendanceId(currentAttendanceId);

      // 新規登録
      let breakSeq = 1;
      let outingSeq = 1;

      for (const item of breakTimes) {
        const startTime = toDateTime(item.breakStartTime, workDate);
        const endTime = toDateTime(item.breakEndTime, workDate);
        
        if (!startTime || !endTime) {
          continue;
        }

        const durationMinutes = calculateMinutes(startTime, endTime);

        if (item.breakType === 'BREAK') {
          await breakTimeModel.createBreakTime({
            attendanceId: currentAttendanceId,
            breakSeq: breakSeq++,
            breakStartTime: startTime,
            breakEndTime: endTime,
            breakDurationMinutes: durationMinutes,
            breakType: 'REGULAR',
            createdAt: now,
            updatedAt: now
          });
        } else if (item.breakType === 'OFFICIAL_OUTING') {
          await breakTimeModel.createOfficialOuting({
            attendanceId: currentAttendanceId,
            outingSeq: outingSeq++,
            outingStartTime: startTime,
            outingEndTime: endTime,
            outingDurationMinutes: durationMinutes,
            outingPurpose: item.outingPurpose || null,
            createdAt: now,
            updatedAt: now
          });
        }
      }
    }
    
    // 実労働時間を計算（浮動小数点数の誤差を避けるため分単位で計算）
    if (clockInDateTime && clockOutDateTime) {
      const totalMinutes = calculateMinutes(clockInDateTime, clockOutDateTime);
      const breakMinutes = await breakTimeModel.getTotalBreakMinutes(currentAttendanceId);
      const actualWorkMinutes = totalMinutes - breakMinutes;
      // 分単位で計算してから時間に変換（浮動小数点数の誤差を避けるため）
      const actualWorkHours = actualWorkMinutes / 60;

      await attendanceModel.updateAttendance(currentAttendanceId, {
        actualWorkHours: actualWorkHours.toFixed(2),
        updatedAt: now
      });
    }

    await connection.commit();

    // 更新後のデータを取得
    const updatedAttendance = await attendanceModel.getAttendanceById(currentAttendanceId);
    return updatedAttendance;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * 月間勤務表を取得する。
 *
 * @param {string} employeeId 従業員ID
 * @param {number} year 年
 * @param {number} month 月
 * @returns {Promise<Object>} 月間勤務表データ
 */
const getMonthlyAttendance = async (employeeId, year, month) => {
  const { startDate, endDate } = getMonthRange(year, month);
  const attendanceRows = await attendanceModel.getMonthlyAttendance(employeeId, startDate, endDate);

  // 休日出勤申請を取得
  const holidayWorkApplications = await applicationModel.getApplicationsByType(
    employeeId,
    'HOLIDAY_WORK',
    startDate,
    endDate
  );
  
  // 休暇申請を取得
  const vacations = await applicationModel.getVacations(employeeId, startDate, endDate);
  
  // 各勤怠記録に対して休憩時間、公用外出、工数実績を取得
  const dailyData = [];
  for (const attendance of attendanceRows) {
    const breakTimes = await breakTimeModel.getBreakTimes(attendance.ATTENDANCE_ID);
    const officialOutings = await breakTimeModel.getOfficialOutings(attendance.ATTENDANCE_ID);
    const workHours = await workHoursModel.getWorkHours(employeeId, normalizeDate(attendance.WORK_DATE));
    
    // 該当日の休日出勤申請を取得
    const workDate = normalizeDate(attendance.WORK_DATE);
    const holidayWorkApp = holidayWorkApplications.find(app => {
      const appStartDate = normalizeDate(app.TARGET_START_DATE);
      const appEndDate = normalizeDate(app.TARGET_END_DATE);
      return workDate >= appStartDate && workDate <= appEndDate && 
             (app.APPROVAL_STATUS === 'PENDING' || app.APPROVAL_STATUS === 'APPROVED');
    });
    
    // 該当日の休暇申請を取得
    const vacation = vacations.find(v => {
      const vStartDate = normalizeDate(v.START_DATE);
      const vEndDate = normalizeDate(v.END_DATE);
      return workDate >= vStartDate && workDate <= vEndDate && 
             (v.APPROVAL_STATUS === 'PENDING' || v.APPROVAL_STATUS === 'APPROVED');
    });
    
    dailyData.push({
      ...attendance,
      WORK_DATE: normalizeDate(attendance.WORK_DATE),
      breakTimes,
      officialOutings,
      workHours,
      holidayWorkApplication: holidayWorkApp || null,
      vacation: vacation || null
    });
  }
  
  // 勤怠記録がない日付にも休日出勤申請の情報を追加
  const daysInMonth = new Date(year, month, 0).getDate();
  const existingDates = new Set(dailyData.map(d => d.WORK_DATE));
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (!existingDates.has(dateStr)) {
      // 該当日の休日出勤申請を取得
      const holidayWorkApp = holidayWorkApplications.find(app => {
        const appStartDate = normalizeDate(app.TARGET_START_DATE);
        const appEndDate = normalizeDate(app.TARGET_END_DATE);
        return dateStr >= appStartDate && dateStr <= appEndDate && 
               (app.APPROVAL_STATUS === 'PENDING' || app.APPROVAL_STATUS === 'APPROVED');
      });
      
      // 該当日の休暇申請を取得
      const vacation = vacations.find(v => {
        const vStartDate = normalizeDate(v.START_DATE);
        const vEndDate = normalizeDate(v.END_DATE);
        return dateStr >= vStartDate && dateStr <= vEndDate && 
               (v.APPROVAL_STATUS === 'PENDING' || v.APPROVAL_STATUS === 'APPROVED');
      });
      
      if (holidayWorkApp || vacation) {
        dailyData.push({
          WORK_DATE: dateStr,
          ATTENDANCE_ID: null,
          CLOCK_IN_TIME: null,
          CLOCK_OUT_TIME: null,
          breakTimes: [],
          officialOutings: [],
          workHours: [],
          holidayWorkApplication: holidayWorkApp || null,
          vacation: vacation || null
        });
      }
    }
  }
  
  // 月次サマリーを計算
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
  
  // 総労働時間（丸め誤差を避けるため、各日の出退勤時刻と休憩時間から直接計算）
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

  const totalWorkHours = totalWorkMinutes / 60;

  // 過不足時間
  // 計算方法: 前日までの実作業時間 - (前日までの想定出勤日数 * 7:30)
  const overUnderTime = totalWorkHours - scheduledWorkHoursUntilCutoff;
  
  // 法定休日労働
  const legalHolidayWork = attendanceRows
    .filter(row => normalizeDate(row.WORK_DATE) <= cutoffDate)
    .reduce((sum, row) => sum + (parseFloat(row.HOLIDAY_WORK_HOURS) || 0), 0);
  
  // 法定時間内残業・法定時間外残業
  // 計算方法:
  // - 実労働時間が所定労働時間を超えた場合にのみ残業が発生
  // - 法定時間内残業: 実労働時間が所定労働時間を超えた部分のうち、法定労働時間（8時間/日 × 所定出勤日数）以内の部分
  // - 法定時間外残業: 実労働時間が法定労働時間を超えた部分
  const legalWorkHoursUntilCutoff = scheduledWorkDaysUntilCutoff * 8;
  
  // 実労働時間が所定労働時間を超えている場合のみ残業を計算
  let withinLegalOvertime = 0;
  let overLegalOvertime = 0;

  if (totalWorkHours > scheduledWorkHoursUntilCutoff) {
    // 実労働時間が所定労働時間を超えている
    const overtimeHours = totalWorkHours - scheduledWorkHoursUntilCutoff;

    // 法定時間内残業: 超過分のうち、法定労働時間以内の部分
    // 上限: (所定出勤日数 * 8:00) - 所定労働時間
    const maxWithinLegalOvertime = legalWorkHoursUntilCutoff - scheduledWorkHoursUntilCutoff;
    withinLegalOvertime = Math.min(overtimeHours, maxWithinLegalOvertime);

    // 法定時間外残業: 実労働時間が法定労働時間を超えた部分
    if (totalWorkHours > legalWorkHoursUntilCutoff) {
      overLegalOvertime = totalWorkHours - legalWorkHoursUntilCutoff;
    }
  }
  
  const monthlySummary = {
    scheduledWorkDays,
    actualWorkDays,
    scheduledWorkHours: formatHours(scheduledWorkHours),
    totalWorkHours: formatHours(totalWorkHours),
    overUnderTime: formatOverUnder(overUnderTime),
    legalHolidayWork: formatHours(legalHolidayWork),
    withinLegalOvertime: formatHours(withinLegalOvertime),
    overLegalOvertime: formatHours(overLegalOvertime),
    cutoffDate: cutoffDate.split('-').slice(1).join('/')
  };

  return {
    dailyData,
    monthlySummary
  };
};

/**
 * 日次確定申請を行う。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} workDate 勤務日（YYYY-MM-DD形式）
 * @returns {Promise<void>}
 */
const confirmDailyAttendance = async (employeeId, workDate) => {
  const attendance = await attendanceModel.getAttendanceDetail(employeeId, workDate);
  
  if (!attendance) {
    throw new Error('勤怠記録が見つかりません。');
  }

  // バリデーション
  const errors = [];

  const hasClockIn = !!attendance.CLOCK_IN_TIME;
  const hasClockOut = !!attendance.CLOCK_OUT_TIME;
  
  if (!hasClockIn && !hasClockOut) {
    errors.push('出退社時刻が未入力のため、日次確定できません。');
  } else if (!hasClockIn) {
    errors.push('出社時刻が未入力のため、日次確定できません。');
  } else if (!hasClockOut) {
    errors.push('退社時刻が未入力のため、日次確定できません。');
  }
  
  if (!attendance.WORK_LOCATION_CODE) {
    errors.push('勤務場所を選択してください');
  }
  
  if ((attendance.CLOCK_IN_TYPE === 'MANUAL' || attendance.CLOCK_OUT_TYPE === 'MANUAL') && !attendance.REMARK_TEXT) {
    errors.push('手入力の場合は備考に理由を入力してください');
  }
  
  const totalWorkHours = await workHoursModel.getTotalWorkHours(attendance.ATTENDANCE_ID);
  const actualWorkHours = parseFloat(attendance.ACTUAL_WORK_HOURS) || 0;

  if (totalWorkHours === 0) {
    errors.push('工数実績が入力されていません。');
  }
  
  if (totalWorkHours > 0 && actualWorkHours > 0 && Math.abs(totalWorkHours - actualWorkHours) > 0.01) {
    errors.push('工数の合計と実労働時間が合いません。');
  }
  
  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }

  // 日次確定を実行
  const now = getNow();
  await attendanceModel.updateAttendance(attendance.ATTENDANCE_ID, {
    isDailyConfirmed: true,
    dailyConfirmedAt: now,
    approvalStatus: 'PENDING',
    updatedAt: now
  });
  
  // APPLICATION_HISTORYテーブルに申請履歴を記録
  const applicationModel = require('../models/applicationModel');
  await applicationModel.createApplication({
    employeeId: employeeId,
    applicationType: 'DAILY_CONFIRMATION',
    targetStartDate: workDate,
    targetEndDate: workDate,
    overtimeHours: null,
    reason: null,
    approvalStatus: 'PENDING',
    createdAt: now,
    updatedAt: now
  });
};

/**
 * 日次確定申請を取り消す。
 *
 * @param {string} employeeId 従業員ID
 * @param {string} workDate 勤務日（YYYY-MM-DD形式）
 * @returns {Promise<void>}
 */
const cancelDailyConfirmation = async (employeeId, workDate) => {
  const attendance = await attendanceModel.getAttendanceDetail(employeeId, workDate);
  
  if (!attendance) {
    throw new Error('勤怠記録が見つかりません。');
  }

  const now = getNow();
  await attendanceModel.updateAttendance(attendance.ATTENDANCE_ID, {
    isDailyConfirmed: false,
    dailyConfirmedAt: null,
    approvalStatus: 'NOT_SUBMITTED',
    updatedAt: now
  });
  
  // APPLICATION_HISTORYテーブルの最新の申請をNOT_SUBMITTEDに更新
  const updateQuery = `
    UPDATE APPLICATION_HISTORY
    SET APPROVAL_STATUS = 'NOT_SUBMITTED',
        UPDATED_AT = ?
    WHERE APPLICATION_ID = (
      SELECT APPLICATION_ID FROM (
        SELECT APPLICATION_ID
        FROM APPLICATION_HISTORY
        WHERE EMPLOYEE_ID = ?
          AND APPLICATION_TYPE = 'DAILY_CONFIRMATION'
          AND TARGET_START_DATE = ?
          AND TARGET_END_DATE = ?
          AND APPROVAL_STATUS IN ('PENDING', 'APPROVED')
        ORDER BY CREATED_AT DESC
        LIMIT 1
      ) AS sub
    )
  `;
  await db.execute(updateQuery, [now, employeeId, workDate, workDate]);
};

/**
 * 当月時間外残業時間を取得（法定時間外残業）
 * @param {string} employeeId - 従業員ID
 * @param {number} year - 年
 * @param {number} month - 月
 * @returns {Promise<number>} 時間外残業時間（時間単位、小数）
 */
const getMonthlyOvertimeHours = async (employeeId, year, month) => {
  const { startDate, endDate } = getMonthRange(year, month);
  const scheduledWorkDays = getScheduledWorkDays(year, month);
  const scheduledWorkHours = scheduledWorkDays * 7.5;
  const legalWorkHours = scheduledWorkDays * 8;
  
  // 月間勤務データ取得
  const attendanceRows = await attendanceModel.getMonthlyAttendance(employeeId, startDate, endDate);
  
  // 総労働時間を計算（丸め誤差を避けるため、各日の出退勤時刻と休憩時間から直接計算）
  let totalWorkMinutes = 0;
  
  for (const row of attendanceRows) {
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
  
  const totalWorkHours = totalWorkMinutes / 60;
  
  // 法定時間外残業: 実労働時間が法定労働時間を超えた部分
  let overLegalOvertime = 0;
  if (totalWorkHours > legalWorkHours) {
    overLegalOvertime = totalWorkHours - legalWorkHours;
  }
  
  return overLegalOvertime;
};

module.exports = {
  getDailyAttendance,
  updateAttendanceRecord,
  getMonthlyAttendance,
  confirmDailyAttendance,
  cancelDailyConfirmation,
  getMonthlyOvertimeHours
};

