/**
 * 月次サマリーサービス
 */
const employeeModel = require('../models/employeeModel');
const attendanceModel = require('../models/attendanceModel');
const breakTimeModel = require('../models/breakTimeModel');
const applicationModel = require('../models/applicationModel');
const masterModel = require('../models/masterModel');
const { 
  getMonthRange,
  getScheduledWorkDays,
  normalizeDate,
  formatHours,
  formatOverUnder,
  calculateMinutes
} = require('../utils/dateUtils');
const HolidayJp = require('@holiday-jp/holiday_jp');
const db = require('../config/database');

/**
 * 月次サマリー情報を取得
 * @param {string} employeeId - 従業員ID
 * @param {string} yearMonth - 対象年月（YYYY-MM形式）
 * @returns {Promise<Object>} 月次サマリー情報
 */
const getMonthlySummary = async (employeeId, yearMonth) => {
  // 年月をパース
  const [year, month] = yearMonth.split('-').map(Number);
  const { startDate, endDate } = getMonthRange(year, month);
  
  // 1. 従業員情報取得
  const employee = await employeeModel.getEmployeeById(employeeId);
  if (!employee) {
    throw new Error('従業員情報が見つかりません。');
  }
  
  // 2. 月間勤務データ取得
  const attendanceRows = await attendanceModel.getMonthlyAttendance(employeeId, startDate, endDate);
  
  // 休暇情報を取得
  const vacations = await applicationModel.getVacations(employeeId, startDate, endDate);
  
  // 休日出勤申請を取得
  const holidayWorkApplications = await applicationModel.getApplicationsByType(
    employeeId,
    'HOLIDAY_WORK',
    startDate,
    endDate
  );
  
  // 休暇種別マスタを取得（休暇種別名を取得するため）
  const vacationTypes = await masterModel.getVacationTypes();
  const vacationTypeMap = {};
  for (const vt of vacationTypes) {
    vacationTypeMap[vt.VACATION_TYPE_CODE] = vt.VACATION_TYPE_NAME;
  }
  
  // 月間の全ての日付を生成（勤務記録がない日も含む）
  const daysInMonth = new Date(year, month, 0).getDate();
  const scheduledWorkDays = getScheduledWorkDays(year, month);
  const monthlyScheduledWorkHours = scheduledWorkDays * 7.5;
  const monthlyLegalWorkHours = scheduledWorkDays * 8;
  
  const dailyData = [];
  let previousCumulativeWorkHours = 0;
  
  for (let day = 1; day <= daysInMonth; day++) {
    const workDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const attendance = attendanceRows.find(row => normalizeDate(row.WORK_DATE) === workDate);
    
    // 祝日情報を取得
    const dateObj = new Date(year, month - 1, day);
    let holidayName = null;
    try {
      // isHolidayはbooleanを返すので、betweenで祝日情報を取得
      const holidays = HolidayJp.between(dateObj, dateObj);
      if (holidays && holidays.length > 0) {
        holidayName = holidays[0].name || null;
      }
    } catch (error) {
      console.error(`祝日判定エラー (${workDate}):`, error);
      holidayName = null;
    }
    
    // その日の休暇情報を取得（承認済みまたは申請中の休暇）
    const dayVacation = vacations.find(v => {
      const startDate = normalizeDate(v.START_DATE);
      const endDate = normalizeDate(v.END_DATE);
      return workDate >= startDate && workDate <= endDate && 
             (v.APPROVAL_STATUS === 'APPROVED' || v.APPROVAL_STATUS === 'PENDING');
    });
    let vacationTypeName = null;
    if (dayVacation && dayVacation.VACATION_TYPE_CODE) {
      vacationTypeName = vacationTypeMap[dayVacation.VACATION_TYPE_CODE] || null;
    }
    
    // その日の休日出勤申請を取得（承認済みまたは申請中の休日出勤申請）
    const dayHolidayWorkApplication = holidayWorkApplications.find(app => {
      const appStartDate = normalizeDate(app.TARGET_START_DATE);
      const appEndDate = normalizeDate(app.TARGET_END_DATE);
      return workDate >= appStartDate && workDate <= appEndDate && 
             (app.APPROVAL_STATUS === 'APPROVED' || app.APPROVAL_STATUS === 'PENDING');
    });
    
    let breakTimeTotal = 0;
    let actualWorkHours = 0;
    let overtimeHours = 0;
    // 日次の法定時間内残業・法定時間外残業（分単位）を保存
    let withinLegalOvertimeMinutes = 0;
    let overLegalOvertimeMinutes = 0;
    
    if (attendance) {
      const breakTimes = await breakTimeModel.getBreakTimes(attendance.ATTENDANCE_ID);
      breakTimeTotal = breakTimes.reduce((sum, bt) => sum + (bt.BREAK_DURATION_MINUTES || 0), 0) / 60;
      actualWorkHours = parseFloat(attendance.ACTUAL_WORK_HOURS) || 0;
      
      // 月次累積ロジックに基づいて残業時間を計算（浮動小数点数の誤差を避けるため分単位で計算）
      if (actualWorkHours > 0) {
        // 浮動小数点数の誤差を避けるため、分単位で計算
        const previousCumulativeWorkMinutes = Math.round(previousCumulativeWorkHours * 60);
        const monthlyScheduledWorkMinutes = Math.round(monthlyScheduledWorkHours * 60);
        const monthlyLegalWorkMinutes = Math.round(monthlyLegalWorkHours * 60);
        const actualWorkMinutes = Math.round(actualWorkHours * 60);
        
        // 月の所定労働時間の残り（分単位）
        const remainingScheduledWorkMinutes = Math.max(0, monthlyScheduledWorkMinutes - previousCumulativeWorkMinutes);
        // 月の法定労働時間の残り（分単位）
        const remainingLegalWorkMinutes = Math.max(0, monthlyLegalWorkMinutes - previousCumulativeWorkMinutes);
        
        let scheduledWorkMinutes = 0;
        
        // 前日までの累積が月の所定労働時間以下の場合
        if (previousCumulativeWorkMinutes < monthlyScheduledWorkMinutes) {
          // 所定内労働: 月の所定労働時間の残りまで（分単位）
          scheduledWorkMinutes = Math.min(actualWorkMinutes, remainingScheduledWorkMinutes);
          
          // その日の実労働時間が所定内労働の残りを超えている場合
          const remainingAfterScheduledMinutes = actualWorkMinutes - scheduledWorkMinutes;
          if (remainingAfterScheduledMinutes > 0) {
            // 法定時間内残業の残り = 月の法定労働時間の残り - 所定内労働として使った分
            const remainingForLegalMinutes = remainingLegalWorkMinutes - scheduledWorkMinutes;
            withinLegalOvertimeMinutes = Math.min(remainingAfterScheduledMinutes, remainingForLegalMinutes);
            
            // 法定時間外残業: それ以上
            overLegalOvertimeMinutes = remainingAfterScheduledMinutes - withinLegalOvertimeMinutes;
          }
        } else {
          // 前日までの累積が月の所定労働時間を超えている場合
          // 前日までの累積が月の法定労働時間以下の場合
          if (previousCumulativeWorkMinutes < monthlyLegalWorkMinutes) {
            // 法定時間内残業: 月の法定労働時間の残りまで（分単位）
            withinLegalOvertimeMinutes = Math.min(actualWorkMinutes, remainingLegalWorkMinutes);
            
            // 法定時間外残業: それ以上
            overLegalOvertimeMinutes = actualWorkMinutes - withinLegalOvertimeMinutes;
          } else {
            // 前日までの累積が月の法定労働時間を超えている場合
            // 法定時間外残業: その日の実労働時間すべて
            overLegalOvertimeMinutes = actualWorkMinutes;
          }
        }
        
        // 残業時間 = 法定時間内残業 + 法定時間外残業（分単位から時間単位に変換）
        overtimeHours = (withinLegalOvertimeMinutes + overLegalOvertimeMinutes) / 60;
        
        // 累積実労働時間を更新（分単位で計算してから時間に変換）
        previousCumulativeWorkHours = (previousCumulativeWorkMinutes + actualWorkMinutes) / 60;
      }
    }
    
    let attendanceId = null;
    let clockInTime = null;
    let clockOutTime = null;
    let clockInType = null;
    let clockOutType = null;
    let originalClockInTime = null;
    let originalClockOutTime = null;
    let holidayWorkHours = 0;
    let nightWorkHours = 0;
    let workLocationCode = null;
    let remarkText = null;
    let isDailyConfirmed = false;

    if (attendance) {
      attendanceId = attendance.ATTENDANCE_ID;
      clockInTime = attendance.CLOCK_IN_TIME;
      clockOutTime = attendance.CLOCK_OUT_TIME;
      clockInType = attendance.CLOCK_IN_TYPE;
      clockOutType = attendance.CLOCK_OUT_TYPE;
      originalClockInTime = attendance.ORIGINAL_CLOCK_IN_TIME;
      originalClockOutTime = attendance.ORIGINAL_CLOCK_OUT_TIME;
      holidayWorkHours = parseFloat(attendance.HOLIDAY_WORK_HOURS) || 0;
      nightWorkHours = parseFloat(attendance.NIGHT_WORK_HOURS) || 0;
      workLocationCode = attendance.WORK_LOCATION_CODE;
      remarkText = attendance.REMARK_TEXT;
      isDailyConfirmed = attendance.IS_DAILY_CONFIRMED;
    }

    dailyData.push({
      attendanceId: attendanceId,
      employeeId: employeeId,
      workDate: workDate,
      clockInTime: clockInTime,
      clockOutTime: clockOutTime,
      clockInType: clockInType,
      clockOutType: clockOutType,
      originalClockInTime: originalClockInTime,
      originalClockOutTime: originalClockOutTime,
      actualWorkHours: actualWorkHours,
      breakTimeTotal: breakTimeTotal,
      overtimeHours: overtimeHours,
      holidayWorkHours: holidayWorkHours,
      nightWorkHours: nightWorkHours,
      workLocationCode: workLocationCode,
      remarkText: remarkText,
      isDailyConfirmed: isDailyConfirmed,
      holidayName: holidayName,
      vacationTypeName: vacationTypeName,
      holidayWorkApplication: dayHolidayWorkApplication || null,
      withinLegalOvertimeMinutes: withinLegalOvertimeMinutes,
      overLegalOvertimeMinutes: overLegalOvertimeMinutes
    });
  }
  
  // 3. 月次サマリーデータ取得（計算）
  const actualWorkDays = attendanceRows.filter(row => 
    row.CLOCK_IN_TIME && row.CLOCK_OUT_TIME
  ).length;
  
  // 法定休日出勤日数、所定休日出勤日数は簡易的に計算
  // （実際の実装では、祝日マスタやカレンダーマスタを参照する必要がある）
  const legalHolidayWorkDays = 0; // TODO: 法定休日出勤日数を計算
  const scheduledHolidayWorkDays = 0; // TODO: 所定休日出勤日数を計算
  
  // 所定労働時間（1日7.5時間 × 所定出勤日数）
  const scheduledWorkHours = scheduledWorkDays * 7.5;
  
  // 総労働時間（丸め誤差を避けるため、各日の出退勤時刻と休憩時間から直接計算）
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
  
  // 総労働時間-法定休日労働
  const totalWorkHoursExcludingLegalHoliday = totalWorkHours - 
    attendanceRows.reduce((sum, row) => sum + (parseFloat(row.HOLIDAY_WORK_HOURS) || 0), 0);
  
  // 過不足時間
  // 計算方法: 前日までの実作業時間 - (前日までの想定出勤日数 * 7:30)
  // 注意: このAPIでは月全体の過不足時間を計算（cutoffDateの考慮はattendanceService.jsで実装）
  const overUnderHours = totalWorkHours - scheduledWorkHours;
  
  // 当月度の超過時間、安全配慮上の超過時間は簡易的に0とする
  const currentMonthOvertime = 0;
  const safetyOvertime = 0;
  
  // 法定労働時間（1日8時間 × 所定出勤日数）
  const legalWorkHours = scheduledWorkDays * 8;
  
  // 実労働時間-法定休日労働(有休を含めない)
  const actualWorkHoursExcludingLegalHoliday = totalWorkHoursExcludingLegalHoliday;
  
  // 法定時間内残業・法定時間外残業
  // 日次の計算結果を集計（浮動小数点数の誤差を避けるため分単位で集計）
  let totalWithinLegalOvertimeMinutes = 0;
  let totalOverLegalOvertimeMinutes = 0;
  
  for (const day of dailyData) {
    if (day.withinLegalOvertimeMinutes) {
      totalWithinLegalOvertimeMinutes += day.withinLegalOvertimeMinutes;
    }
    if (day.overLegalOvertimeMinutes) {
      totalOverLegalOvertimeMinutes += day.overLegalOvertimeMinutes;
    }
  }
  
  // 分単位から時間単位に変換
  const withinLegalOvertime = totalWithinLegalOvertimeMinutes / 60;
  const overLegalOvertime = totalOverLegalOvertimeMinutes / 60;
  
  // 法定休日労働時間
  const legalHolidayWorkHours = attendanceRows.reduce((sum, row) => 
    sum + (parseFloat(row.HOLIDAY_WORK_HOURS) || 0), 0
  );
  
  // 深夜労働時間
  const nightWorkHours = attendanceRows.reduce((sum, row) => 
    sum + (parseFloat(row.NIGHT_WORK_HOURS) || 0), 0
  );
  
  // 45時間を超える時間外労働、60時間を超える時間外労働は簡易的に0とする
  const overtimeOver45Hours = 0;
  const overtimeOver60Hours = 0;
  
  // 遅刻回数・時間、早退回数・時間、コア時間内の私用外出回数・時間は簡易的に0とする
  const lateCount = 0;
  const lateHours = 0;
  const earlyLeaveCount = 0;
  const earlyLeaveHours = 0;
  const privateOutingCount = 0;
  const privateOutingHours = 0;
  
  // 休憩時間合計
  let totalBreakHours = 0;
  for (const attendance of attendanceRows) {
    const breakTimes = await breakTimeModel.getBreakTimes(attendance.ATTENDANCE_ID);
    const breakMinutes = breakTimes.reduce((sum, bt) => sum + (bt.BREAK_DURATION_MINUTES || 0), 0);
    totalBreakHours += breakMinutes / 60;
  }
  
  const monthlySummary = {
    scheduledWorkDays,
    actualWorkDays,
    legalHolidayWorkDays,
    scheduledHolidayWorkDays,
    scheduledWorkHours,
    totalWorkHours,
    totalWorkHoursExcludingLegalHoliday,
    overUnderHours,
    currentMonthOvertime,
    safetyOvertime,
    legalWorkHours,
    actualWorkHoursExcludingLegalHoliday,
    withinLegalOvertime,
    overLegalOvertime,
    legalHolidayWorkHours,
    nightWorkHours,
    overtimeOver45Hours,
    overtimeOver60Hours,
    lateCount,
    lateHours,
    earlyLeaveCount,
    earlyLeaveHours,
    privateOutingCount,
    privateOutingHours,
    totalBreakHours
  };
  
  // 4. 休暇情報取得（月次サマリー用の集計）
  // 有給取得日数
  const paidLeaveDays = vacations
    .filter(v => v.VACATION_TYPE_CODE === 'PAID_LEAVE' && v.APPROVAL_STATUS === 'APPROVED')
    .reduce((sum, v) => sum + (parseFloat(v.VACATION_DAYS) || 0), 0);
  
  // 有給取得日数内訳
  let paidLeaveTypeName = '';

  if (paidLeaveDays > 0) {
    paidLeaveTypeName = '年次有給休暇';
  }

  // 時間単位有休取得時間（VACATION_DAYSが1未満の有給休暇を時間単位として集計）
  const hourlyPaidLeaveHours = vacations
    .filter(v => v.VACATION_TYPE_CODE === 'PAID_LEAVE' && v.APPROVAL_STATUS === 'APPROVED' && parseFloat(v.VACATION_DAYS) < 1)
    .reduce((sum, v) => {
      // VACATION_DAYSが1未満の場合、時間単位として扱う（例：0.5日 = 4時間）
      const days = parseFloat(v.VACATION_DAYS) || 0;
      // 1日 = 8時間として計算
      return sum + (days * 8);
    }, 0);

  // 代休取得日数
  const substituteHolidayDays = vacations
    .filter(v => v.VACATION_TYPE_CODE === 'SUBSTITUTE_HOLIDAY' && v.APPROVAL_STATUS === 'APPROVED')
    .reduce((sum, v) => sum + (parseFloat(v.VACATION_DAYS) || 0), 0);

  // 代休取得日数内訳
  let substituteHolidayTypeName = '';

  if (substituteHolidayDays > 0) {
    substituteHolidayTypeName = '代休';
  }
  
  // 無給休暇日数（簡易的に0とする）
  const unpaidLeaveDays = 0;
  const unpaidLeaveTypeName = '';
  
  // 有給残日数（月末日時点）
  const endOfMonth = new Date(year, month, 0);
  const endOfMonthStr = endOfMonth.toISOString().split('T')[0];
  const paidLeaveBalance = await applicationModel.getVacationBalance(employeeId, 'PAID_LEAVE');
  
  // 計画付与予定日（次月以降）
  let nextMonth = { year, month: month + 1 };

  if (month === 12) {
    nextMonth = { year: year + 1, month: 1 };
  }
  const plannedGrantDays = 0; // TODO: 計画付与予定日を取得
  
  const vacationInfo = {
    paidLeaveDays,
    paidLeaveTypeName,
    hourlyPaidLeaveHours,
    substituteHolidayDays,
    substituteHolidayTypeName,
    unpaidLeaveDays,
    unpaidLeaveTypeName,
    paidLeaveBalance,
    plannedGrantDays
  };
  
  // 月次承認状態（簡易的にNOT_SUBMITTEDとする）
  const monthlyApprovalStatus = 'NOT_SUBMITTED';
  
  return {
    employee: {
      employeeId: employee.EMPLOYEE_ID,
      employeeName: employee.EMPLOYEE_NAME,
      department: employee.DEPARTMENT,
      attendanceSystem: 'フレックスタイム制(一般)'
    },
    yearMonth: yearMonth,
    dailyData,
    monthlySummary,
    vacationInfo,
    monthlyApprovalStatus
  };
};

module.exports = {
  getMonthlySummary
};

