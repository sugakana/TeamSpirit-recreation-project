<template>
  <div class="monthly-summary-container">
    <!-- Background -->
    <svg class="background-vector" viewBox="0 0 1920 1080" preserveAspectRatio="none">
      <rect width="1920" height="1080" fill="#F4F6F9" />
    </svg>

    <!-- Header Section -->
    <div class="header-section">
      <svg class="button-background" viewBox="0 0 101.57 21.6" preserveAspectRatio="none">
        <path d="M 3.047 0 L 98.519 0 C 100.201 0 101.566 1.036 101.566 2.314 L 101.566 19.286 C 101.566 20.564 100.201 21.6 98.519 21.6 L 3.047 21.6 C 1.364 21.6 0 20.564 0 19.286 L 0 2.314 C 0 1.036 1.364 0 3.047 0 Z" fill="#0066CC" />
      </svg>
      <button @click="printReport" class="print-button">プリンタへ出力</button>
      <a href="#" @click.prevent="closeWindow" class="close-link">閉じる</a>
    </div>

    <!-- Info Header Section -->
    <div class="info-header-section">
      <svg class="info-header-background" viewBox="0 0 1873.14 30.86" preserveAspectRatio="none">
        <rect width="1873.14" height="30.86" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="1" />
      </svg>
      <span class="title-label">勤務表</span>
      <span class="status-label">ステータス</span>
      <span class="target-year-month">{{ formattedYearMonth }}</span>
      <span class="approval-status">{{ approvalStatusText }}</span>
      <span class="employee-code-label">社員コード</span>
      <span class="employee-code-value">{{ employee?.employeeId || '' }}</span>
    </div>
    
    <!-- Additional info-header elements (outside the header section) -->
    <span class="department-label">部署</span>
    <span class="department-value">{{ employee?.department || '' }}</span>
    <span class="attendance-system-label">勤怠体系</span>
    <span class="attendance-system-value">{{ employee?.attendanceSystem || 'フレックスタイム制(一般)' }}</span>
    <span class="employee-name-label">社員名</span>
    <span class="employee-name-value">{{ employee?.employeeName || '' }}</span>
    
    <!-- Vertical dividers (outside the header section) -->
    <svg class="divider divider-1" viewBox="0 0 1 30" preserveAspectRatio="none">
      <line x1="0.5" y1="0" x2="0.5" y2="30" stroke="rgb(0, 0, 0)" stroke-width="1" />
    </svg>
    <svg class="divider divider-2" viewBox="0 0 1 30" preserveAspectRatio="none">
      <line x1="0.5" y1="0" x2="0.5" y2="30" stroke="rgb(0, 0, 0)" stroke-width="1" />
    </svg>
    <svg class="divider divider-3" viewBox="0 0 1 30" preserveAspectRatio="none">
      <line x1="0.5" y1="0" x2="0.5" y2="30" stroke="rgb(0, 0, 0)" stroke-width="1" />
    </svg>
    <svg class="divider divider-4" viewBox="0 0 1 30" preserveAspectRatio="none">
      <line x1="0.5" y1="0" x2="0.5" y2="30" stroke="rgb(0, 0, 0)" stroke-width="1" />
    </svg>
    <svg class="divider divider-horizontal" viewBox="0 0 1751.88 1" preserveAspectRatio="none">
      <line x1="0" y1="0.5" x2="1751.88" y2="0.5" stroke="rgb(0, 0, 0)" stroke-width="1" />
    </svg>

    <!-- Dashed vertical lines for table columns -->
    <svg v-for="(x, index) in tableColumnDividers" :key="index" 
         class="dashed-line" 
         :style="{ left: x + 'px', height: getDashedLineHeightToTotalBottom() + 'px' }"
         :viewBox="`0 0 2.04 ${getDashedLineHeightToTotalBottom()}`" preserveAspectRatio="none">
      <line x1="1.02" y1="0" x2="1.02" :y2="getDashedLineHeightToTotalBottom()" stroke="rgb(0, 0, 0)" stroke-width="1" stroke-dasharray="2 2" />
    </svg>

    <!-- Table Header Background -->
    <svg class="table-header-background" viewBox="0 0 1873.14 23.14" preserveAspectRatio="none">
      <rect width="1873.14" height="23.14" fill="#6B9BC3" stroke="#5A8AAC" stroke-width="1" />
    </svg>

    <!-- Table Header Text -->
    <div class="table-header-text">
      <span class="header-date">日付</span>
      <span class="header-event">イベント/勤務状況/勤務場所</span>
      <span class="header-clock-in">出社</span>
      <span class="header-clock-out">退社</span>
      <span class="header-break">休憩</span>
      <span class="header-actual-work">実労働<br>時間</span>
      <span class="header-overtime">残業</span>
      <span class="header-holiday">休日</span>
      <span class="header-night">深夜</span>
      <span class="header-remark">備考</span>
    </div>

    <!-- Table Rows -->
    <div class="table-rows-section">
      <!-- Dashed vertical lines for date/day separators -->
      <svg class="date-day-divider" :style="{ height: getDashedLineHeightToLastRow() + 'px' }" :viewBox="`0 0 1 ${getDashedLineHeightToLastRow()}`" preserveAspectRatio="none">
        <line x1="0.5" y1="0" x2="0.5" :y2="getDashedLineHeightToLastRow()" stroke="rgb(0, 0, 0)" stroke-width="1" stroke-dasharray="2 2" />
      </svg>
      <svg class="day-icon-divider" :style="{ height: getDashedLineHeightToLastRow() + 'px' }" :viewBox="`0 0 1 ${getDashedLineHeightToLastRow()}`" preserveAspectRatio="none">
        <line x1="0.5" y1="0" x2="0.5" :y2="getDashedLineHeightToLastRow()" stroke="rgb(0, 0, 0)" stroke-width="1" stroke-dasharray="2 2" />
      </svg>
      <div v-for="(day, index) in dailyData" :key="index" class="table-row" :style="{ top: getRowTop(index) + 'px' }">
        <svg class="row-background" :viewBox="`0 0 1873 ${getRowHeight(index)}`" preserveAspectRatio="none" :style="{ height: getRowHeight(index) + 'px' }">
          <rect :width="1873" :height="getRowHeight(index)" :fill="getRowBackgroundColor(day, index)" stroke="#DDDDDD" stroke-width="0.5" />
        </svg>
        <span class="row-date" :style="{ top: getRowContentTop(index) + 'px', left: index === 0 ? '64px' : (64 + getDatePaddingLeft(index, day.workDate)) + 'px' }">{{ formatDate(day.workDate, index) }}</span>
        <span class="row-day" :style="{ top: (getRowContentTop(index) - 2) + 'px', color: getDayOfWeekColor(day.workDate, day) }">{{ getDayOfWeek(day.workDate) }}</span>
        <!-- 所定休日（土曜日・祝日）: ○ - 祝日は所定休日として優先表示 -->
        <svg v-if="isScheduledHoliday(day.workDate, day)" class="holiday-icon" :style="{ top: getRowContentTop(index) + 'px' }" viewBox="0 0 11 11" preserveAspectRatio="none">
          <circle cx="5.5" cy="5.5" r="5" fill="none" stroke="rgb(51, 51, 51)" stroke-width="1" />
        </svg>
        <!-- 法定休日（日曜日、祝日でない場合）: ◎ -->
        <svg v-else-if="isLegalHoliday(day.workDate)" class="holiday-icon" :style="{ top: getRowContentTop(index) + 'px' }" viewBox="0 0 11 11" preserveAspectRatio="none">
          <circle cx="5.5" cy="5.5" r="4.5" fill="none" stroke="rgb(51, 51, 51)" stroke-width="1" />
          <circle cx="5.5" cy="5.5" r="3" fill="none" stroke="rgb(51, 51, 51)" stroke-width="1" />
        </svg>
        <span class="row-event" :style="{ top: getRowContentTop(index) + 'px' }">{{ getEventText(day) }}</span>
        <span v-if="day.clockInTime" class="row-clock-in" :style="{ top: getRowContentTop(index) + 'px' }">{{ formatTime(day.clockInTime) }}</span>
        <span v-if="day.clockOutTime" class="row-clock-out" :style="{ top: getRowContentTop(index) + 'px' }">{{ formatTime(day.clockOutTime) }}</span>
        <span v-if="day.breakTimeTotal" class="row-break" :style="{ top: getRowContentTop(index) + 'px' }">{{ formatHours(day.breakTimeTotal) }}</span>
        <span v-if="day.actualWorkHours" class="row-actual-work" :style="{ top: getRowContentTop(index) + 'px' }">{{ formatHours(day.actualWorkHours) }}</span>
        <span v-if="day.overtimeHours !== undefined && day.overtimeHours !== null && day.overtimeHours > 0" class="row-overtime" :style="{ top: getRowContentTop(index) + 'px' }">{{ formatHours(day.overtimeHours) }}</span>
        <span v-if="day.holidayWorkHours" class="row-holiday" :style="{ top: getRowContentTop(index) + 'px' }">{{ formatHours(day.holidayWorkHours) }}</span>
        <span v-if="day.nightWorkHours" class="row-night" :style="{ top: getRowContentTop(index) + 'px' }">{{ formatHours(day.nightWorkHours) }}</span>
        <template v-if="getRemarkText(day)">
          <span v-for="(remark, remarkIndex) in getRemarkTextArray(day)" :key="remarkIndex" 
                class="row-remark" 
                :style="{ 
                  top: getRowContentTop(index) + 'px',
                  left: remark.left ? remark.left + 'px' : (remarkIndex === 0 ? '1474px' : (1474 + remarkIndex * 72) + 'px'),
                  color: remark.color || 'rgb(0, 0, 0)'
                }">
            {{ remark.text || remark }}
          </span>
        </template>
      </div>
    </div>

    <!-- Total Row -->
    <svg class="total-row-background" :style="{ top: getTotalRowTop() + 'px' }" viewBox="0 0 1873 20" preserveAspectRatio="none">
      <rect width="1873" height="20" fill="#E8F4F8" stroke="#5A8AAC" stroke-width="1" />
    </svg>
    <span class="total-label" :style="{ top: getTotalRowTop() + 5 + 'px' }">合計</span>
    <span class="total-break" :style="{ top: getTotalRowTop() + 5 + 'px' }">{{ formatHours(monthlySummary?.totalBreakHours || 0) }}</span>
    <span class="total-actual-work" :style="{ top: getTotalRowTop() + 5 + 'px' }">{{ formatHoursLong(monthlySummary?.totalWorkHours || 0) }}</span>
    <span class="total-overtime" :style="{ top: getTotalRowTop() + 5 + 'px' }">{{ formatHours(calculateTotalOvertime()) }}</span>
    <span class="total-holiday-work" :style="{ top: getTotalRowTop() + 5 + 'px' }">{{ formatHours(monthlySummary?.legalHolidayWorkHours || 0) }}</span>
    <span class="total-night-work" :style="{ top: getTotalRowTop() + 5 + 'px' }">{{ formatHours(monthlySummary?.nightWorkHours || 0) }}</span>

    <!-- Symbol Explanation -->
    <span class="symbol-explanation" :style="{ top: getSymbolExplanationTop() + 'px' }">記号の説明 ○＝所定休日、◎＝法定休日、△＝有休計画付与日</span>

    <!-- Monthly Summary Title -->
    <h2 class="monthly-summary-title">{{ formattedYearMonth }}月次サマリー</h2>

    <!-- Section 1: 所定出勤日数から所定休日出勤日数 -->
    <div class="summary-section section-1">
      <svg class="section-border" viewBox="0 0 603 84" preserveAspectRatio="none">
        <path d="M 0.5 0.5 L 602.5 0.5 M 0.5 0.5 L 0.5 83.5 M 602.5 0.5 L 602.5 83.5" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <svg class="section-row-border" style="top: 0px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(255, 255, 255)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-white" style="top: 0px;">
        <span class="section-label">所定出勤日数</span>
        <span class="section-value">{{ monthlySummary?.scheduledWorkDays || 0 }} 日</span>
      </div>
      <svg class="section-row-border" style="top: 21px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(245, 245, 245)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-gray" style="top: 21px;">
        <span class="section-label">実出勤日数</span>
        <span class="section-value">{{ monthlySummary?.actualWorkDays || 0 }} 日</span>
      </div>
      <svg class="section-row-border" style="top: 42px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(255, 255, 255)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-white" style="top: 42px;">
        <span class="section-label">法定休日出勤日数</span>
        <span class="section-value">{{ monthlySummary?.legalHolidayWorkDays || 0 }} 日</span>
      </div>
      <svg class="section-row-border" style="top: 63px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(245, 245, 245)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-gray" style="top: 63px;">
        <span class="section-label">所定休日出勤日数</span>
        <span class="section-value">{{ monthlySummary?.scheduledHolidayWorkDays || 0 }} 日</span>
      </div>
    </div>

    <!-- Section 2: 所定労働時間から過不足時間 -->
    <div class="summary-section section-2">
      <svg class="section-border" viewBox="0 0 603 84" preserveAspectRatio="none">
        <path d="M 0.5 0.5 L 602.5 0.5 M 0.5 0.5 L 0.5 83.5 M 602.5 0.5 L 602.5 83.5" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <svg class="section-row-border" style="top: 0px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(255, 255, 255)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-white" style="top: 0px;">
        <span class="section-label">所定労働時間</span>
        <span class="section-value">{{ formatHoursLong(monthlySummary?.scheduledWorkHours || 0) }}</span>
      </div>
      <svg class="section-row-border" style="top: 21px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(245, 245, 245)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-gray" style="top: 21px;">
        <span class="section-label">総労働時間(有休を含む)</span>
        <span class="section-value">{{ formatHoursLong(monthlySummary?.totalWorkHours || 0) }}</span>
      </div>
      <svg class="section-row-border" style="top: 42px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(255, 255, 255)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-white" style="top: 42px;">
        <span class="section-label">総労働時間-法定休日労働(有休を含む)</span>
        <span class="section-value">{{ formatHoursLong(monthlySummary?.totalWorkHoursExcludingLegalHoliday || 0) }}</span>
      </div>
      <svg class="section-row-border" style="top: 63px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(245, 245, 245)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-gray" style="top: 63px;">
        <span class="section-label">過不足時間</span>
        <span class="section-value" :class="{ 'negative': (monthlySummary?.overUnderHours || 0) < 0 }">
          {{ formatOverUnder(monthlySummary?.overUnderHours || 0) }}
        </span>
      </div>
    </div>

    <!-- Section 3: 当月度の超過時間と安全配慮上の超過時間 -->
    <div class="summary-section section-3">
      <svg class="section-border" viewBox="0 0 603 42" preserveAspectRatio="none">
        <path d="M 0.5 0.5 L 602.5 0.5 M 0.5 0.5 L 0.5 41.5 M 602.5 0.5 L 602.5 41.5" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <svg class="section-row-border" style="top: 0px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(255, 255, 255)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-white" style="top: 0px;">
        <span class="section-label">当月度の超過時間</span>
        <span class="section-value">{{ formatHours(monthlySummary?.currentMonthOvertime || 0) }}</span>
      </div>
      <svg class="section-row-border" style="top: 21px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(245, 245, 245)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-gray" style="top: 21px;">
        <span class="section-label">安全配慮上の超過時間</span>
        <span class="section-value">{{ formatHours(monthlySummary?.safetyOvertime || 0) }}</span>
      </div>
    </div>

    <!-- Section 4: 法定労働時間から法定休日労働時間 -->
    <div class="summary-section section-4">
      <svg class="section-border" viewBox="0 0 603 105" preserveAspectRatio="none">
        <path d="M 0.5 0.5 L 602.5 0.5 M 0.5 0.5 L 0.5 104.5 M 602.5 0.5 L 602.5 104.5" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <svg class="section-row-border" style="top: 0px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(255, 255, 255)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-white" style="top: 0px;">
        <span class="section-label">法定労働時間</span>
        <span class="section-value">{{ formatHoursLong(monthlySummary?.legalWorkHours || 0) }}</span>
      </div>
      <svg class="section-row-border" style="top: 21px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(245, 245, 245)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-gray" style="top: 21px;">
        <span class="section-label">実労働時間-法定休日労働(有休を含めない)</span>
        <span class="section-value">{{ formatHoursLong(monthlySummary?.actualWorkHoursExcludingLegalHoliday || 0) }}</span>
      </div>
      <svg class="section-row-border" style="top: 42px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(255, 255, 255)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-white" style="top: 42px;">
        <span class="section-label">法定時間内残業</span>
        <span class="section-value">{{ formatHours(monthlySummary?.withinLegalOvertime || 0) }}</span>
      </div>
      <svg class="section-row-border" style="top: 63px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(245, 245, 245)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-gray" style="top: 63px;">
        <span class="section-label">法定時間外残業</span>
        <span class="section-value">{{ formatHours(monthlySummary?.overLegalOvertime || 0) }}</span>
      </div>
      <svg class="section-row-border" style="top: 84px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(255, 255, 255)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-white" style="top: 84px;">
        <span class="section-label">法定休日労働時間</span>
        <span class="section-value">{{ formatHours(monthlySummary?.legalHolidayWorkHours || 0) }}</span>
      </div>
    </div>

    <!-- Section 5: 深夜労働時間から60時間を超える時間外労働 -->
    <div class="summary-section section-5">
      <svg class="section-border" viewBox="0 0 603 63" preserveAspectRatio="none">
        <path d="M 0.5 0.5 L 602.5 0.5 M 0.5 0.5 L 0.5 62.5 M 602.5 0.5 L 602.5 62.5" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <svg class="section-row-border" style="top: 0px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(255, 255, 255)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-white" style="top: 0px;">
        <span class="section-label">深夜労働時間</span>
        <span class="section-value">{{ formatHours(monthlySummary?.nightWorkHours || 0) }}</span>
      </div>
      <svg class="section-row-border" style="top: 21px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(245, 245, 245)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-gray" style="top: 21px;">
        <span class="section-label">45時間を超える時間外労働</span>
        <span class="section-value">{{ formatHours(monthlySummary?.overtimeOver45Hours || 0) }}</span>
      </div>
      <svg class="section-row-border" style="top: 42px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(255, 255, 255)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-white" style="top: 42px;">
        <span class="section-label">60時間を超える時間外労働</span>
        <span class="section-value">{{ formatHours(monthlySummary?.overtimeOver60Hours || 0) }}</span>
      </div>
    </div>

    <!-- Section 6: 遅刻回数・時間からコア時間内の私用外出回数・時間 -->
    <div class="summary-section section-6">
      <svg class="section-border" viewBox="0 0 603 63" preserveAspectRatio="none">
        <path d="M 0.5 0.5 L 602.5 0.5 M 0.5 0.5 L 0.5 62.5 M 602.5 0.5 L 602.5 62.5" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <svg class="section-row-border" style="top: 0px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(255, 255, 255)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-white" style="top: 0px;">
        <span class="section-label">遅刻回数・時間</span>
        <span class="section-value">{{ formatCountAndHours(monthlySummary?.lateCount || 0, monthlySummary?.lateHours || 0) }}</span>
      </div>
      <svg class="section-row-border" style="top: 21px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(245, 245, 245)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-gray" style="top: 21px;">
        <span class="section-label">早退回数・時間</span>
        <span class="section-value">{{ formatCountAndHours(monthlySummary?.earlyLeaveCount || 0, monthlySummary?.earlyLeaveHours || 0) }}</span>
      </div>
      <svg class="section-row-border" style="top: 42px;" viewBox="0 0 603 21" preserveAspectRatio="none">
        <rect width="603" height="21" fill="rgb(255, 255, 255)" />
        <path d="M 0 0 L 603 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-white" style="top: 42px;">
        <span class="section-label">コア時間内の私用外出回数・時間</span>
        <span class="section-value">{{ formatCountAndHours(monthlySummary?.privateOutingCount || 0, monthlySummary?.privateOutingHours || 0) }}</span>
      </div>
    </div>

    <!-- Section 7: 有給取得日数 -->
    <div class="summary-section section-7">
      <svg class="section-border" viewBox="0 0 580 66" preserveAspectRatio="none">
        <path d="M 0.5 0.5 L 579.5 0.5 M 0.5 0.5 L 0.5 65.5 M 579.5 0.5 L 579.5 65.5 M 0.5 65.5 L 579.5 65.5" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <svg class="section-row-border" style="top: 0px;" viewBox="0 0 580 21" preserveAspectRatio="none">
        <rect width="580" height="21" fill="rgb(255, 255, 255)" />
        <path d="M 0 0 L 580 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-white" style="top: 0px;">
        <span class="section-label">有給取得日数</span>
        <span class="section-value">{{ vacationInfo?.paidLeaveDays || 0 }} 日</span>
      </div>
      <svg class="section-row-border" style="top: 21px;" viewBox="0 0 580 21" preserveAspectRatio="none">
        <rect width="580" height="21" fill="rgb(245, 245, 245)" />
        <path d="M 0 0 L 580 0 M 0 21 L 580 21" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-gray" style="top: 21px;">
        <span class="section-detail" :class="{ 'empty': !vacationInfo?.paidLeaveTypeName }">
          [内訳] {{ vacationInfo?.paidLeaveTypeName || '---' }}
        </span>
      </div>
      <svg class="section-row-border" style="top: 42px;" viewBox="0 0 580 24" preserveAspectRatio="none">
        <rect width="580" height="24" fill="rgb(255, 255, 255)" />
      </svg>
      <div class="section-row section-row-white" style="top: 43px;">
        <span class="section-label">時間単位有休取得時間</span>
        <span class="section-value">{{ formatHours(vacationInfo?.hourlyPaidLeaveHours || 0) }}</span>
      </div>
    </div>

    <!-- Section 9: 無給休暇日数 -->
    <div class="summary-section section-9">
      <svg class="section-border" viewBox="0 0 580 42" preserveAspectRatio="none">
        <path d="M 0.5 0.5 L 579.5 0.5 M 0.5 0.5 L 0.5 41.5 M 579.5 0.5 L 579.5 41.5" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <svg class="section-row-border" style="top: 0px;" viewBox="0 0 580 21" preserveAspectRatio="none">
        <rect width="580" height="21" fill="rgb(255, 255, 255)" />
        <path d="M 0 0 L 580 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-white" style="top: 0px;">
        <span class="section-label">無給休暇日数</span>
        <span class="section-value">{{ vacationInfo?.unpaidLeaveDays || 0 }} 日</span>
      </div>
      <svg class="section-row-border" style="top: 21px;" viewBox="0 0 580 21" preserveAspectRatio="none">
        <rect width="580" height="21" fill="rgb(245, 245, 245)" />
        <path d="M 0 0 L 580 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-gray" style="top: 21px;">
        <span class="section-detail" :class="{ 'empty': !vacationInfo?.unpaidLeaveTypeName }">
          [内訳] {{ vacationInfo?.unpaidLeaveTypeName || '---' }}
        </span>
      </div>
    </div>

    <!-- Section 10: 有給残日数と計画付与予定日 -->
    <div class="summary-section section-10">
      <svg class="section-border" viewBox="0 0 580 42" preserveAspectRatio="none">
        <path d="M 0.5 0.5 L 579.5 0.5 M 0.5 0.5 L 0.5 41.5 M 579.5 0.5 L 579.5 41.5" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <svg class="section-row-border" style="top: 0px;" viewBox="0 0 580 21" preserveAspectRatio="none">
        <rect width="580" height="21" fill="rgb(255, 255, 255)" />
        <path d="M 0 0 L 580 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-white" style="top: 0px;">
        <span class="section-label">{{ getPaidLeaveBalanceLabel() }}</span>
        <span class="section-value">{{ Math.floor(vacationInfo?.paidLeaveBalance || 0) }} 日</span>
      </div>
      <svg class="section-row-border" style="top: 21px;" viewBox="0 0 580 21" preserveAspectRatio="none">
        <rect width="580" height="21" fill="rgb(245, 245, 245)" />
        <path d="M 0 0 L 580 0" stroke="rgb(0, 0, 0)" stroke-width="1" fill="none" />
      </svg>
      <div class="section-row section-row-gray" style="top: 21px;">
        <span class="section-label">{{ getPlannedGrantDaysLabel() }}</span>
        <span class="section-value">{{ vacationInfo?.plannedGrantDays || 0 }} 日</span>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">読み込み中...</div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { getMonthlySummaryDetail } from '@/services/api'

export default {
  name: 'MonthlySummaryScreen',
  data() {
    return {
      employee: null,
      yearMonth: '',
      dailyData: [],
      monthlySummary: null,
      vacationInfo: null,
      monthlyApprovalStatus: 'NOT_SUBMITTED',
      loading: false,
      error: null,
      tableColumnDividers: [229, 530, 670, 805, 935, 1070, 1200, 1330, 1465]
    }
  },
  computed: {
    formattedYearMonth() {
      if (!this.yearMonth) return ''
      const [year, month] = this.yearMonth.split('-')
      return `${year}年${month}月`
    },
    approvalStatusText() {
      const statusMap = {
        'NOT_SUBMITTED': '未確定',
        'PENDING': '承認中',
        'APPROVED': '承認済み',
        'REJECTED': '却下'
      }
      return statusMap[this.monthlyApprovalStatus] || '未確定'
    }
  },
  async mounted() {
    const params = new URLSearchParams(window.location.search)
    const employeeId = params.get('employeeId')
    const yearMonth = params.get('yearMonth')
    
    if (!employeeId || !yearMonth) {
      this.error = '従業員IDと対象年月が必要です。'
      return
    }
    
    this.yearMonth = yearMonth
    await this.loadData(employeeId, yearMonth)
  },
  methods: {
    async loadData(employeeId, yearMonth) {
      this.loading = true
      this.error = null
      
      try {
        const response = await getMonthlySummaryDetail(employeeId, yearMonth)
        
        if (response.success) {
          this.employee = response.employee
          this.dailyData = response.dailyData || []
          this.monthlySummary = response.monthlySummary || {}
          this.vacationInfo = response.vacationInfo || {}
          this.monthlyApprovalStatus = response.monthlyApprovalStatus || 'NOT_SUBMITTED'
        } else {
          this.error = response.message || 'データの取得に失敗しました。'
        }
      } catch (err) {
        console.error('月次サマリー情報の取得エラー:', err)
        this.error = err.message || 'データの取得に失敗しました。'
      } finally {
        this.loading = false
      }
    },
    formatDate(dateStr, index) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      // 最初の行だけ月を含める
      if (index === 0) {
        return `${date.getMonth() + 1}/${date.getDate()}`
      }
      return `${date.getDate()}`
    },
    getDatePaddingLeft(index, dateStr) {
      // 最初の行の日付の1桁目の位置に合わせる
      if (index === 0) return 0
      
      if (!dateStr) return 18
      const date = new Date(dateStr)
      const day = date.getDate()
      
      // 「12/」の幅を計算（フォントサイズ10px、文字数3文字分）
      // 約18px程度の幅があると仮定
      let baseOffset = 18
      
      // 2~9は4px左にずらす
      if (day >= 2 && day <= 9) {
        baseOffset -= 4
      }
      // 10~31は9px左にずらす
      if (day >= 10 && day <= 31) {
        baseOffset -= 9
      }
      
      return baseOffset
    },
    getDayOfWeek(dateStr) {
      if (!dateStr) return ''
      // YYYY-MM-DD形式の日付文字列を確実にパースする
      const dateParts = dateStr.split('-')
      let date
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0], 10)
        const month = parseInt(dateParts[1], 10) - 1 // 月は0から始まる
        const day = parseInt(dateParts[2], 10)
        date = new Date(year, month, day)
      } else {
        date = new Date(dateStr)
      }
      const days = ['日', '月', '火', '水', '木', '金', '土']
      return days[date.getDay()]
    },
    isLegalHoliday(dateStr) {
      // 法定休日（日曜日）を判定
      if (!dateStr) return false
      
      // 日付文字列を正規化（YYYY-MM-DD形式に統一）
      let normalizedDateStr = dateStr
      if (dateStr.includes('T')) {
        // ISO形式の場合、日付部分のみを抽出
        normalizedDateStr = dateStr.split('T')[0]
      } else if (dateStr.includes(' ')) {
        // スペース区切りの場合、最初の部分を取得
        normalizedDateStr = dateStr.split(' ')[0]
      }
      
      // YYYY-MM-DD形式の日付文字列を確実にパースする
      const dateParts = normalizedDateStr.split('-')
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0], 10)
        const month = parseInt(dateParts[1], 10) - 1 // 月は0から始まる
        const day = parseInt(dateParts[2], 10)
        const date = new Date(year, month, day)
        return date.getDay() === 0 // 日曜日
      }
      // フォールバック: 通常のDateパース
      const date = new Date(normalizedDateStr)
      const day = date.getDay()
      return day === 0 // 日曜日
    },
    isScheduledHoliday(dateStr, dayData = null) {
      // 所定休日（土曜日・祝日）を判定
      if (!dateStr) return false
      
      // 日付文字列を正規化（YYYY-MM-DD形式に統一）
      let normalizedDateStr = dateStr
      if (dateStr.includes('T')) {
        // ISO形式の場合、日付部分のみを抽出
        normalizedDateStr = dateStr.split('T')[0]
      } else if (dateStr.includes(' ')) {
        // スペース区切りの場合、最初の部分を取得
        normalizedDateStr = dateStr.split(' ')[0]
      }
      
      // 祝日名がある場合は祝日として判定（ただし日曜日でない場合のみ）
      // 日曜日に祝日イベントがあっても日曜日と同じ扱いにするため、日曜日の場合はfalseを返す
      if (dayData && dayData.holidayName) {
        // 日曜日かどうかを先にチェック
        const dateParts = normalizedDateStr.split('-')
        let isSunday = false
        if (dateParts.length === 3) {
          const year = parseInt(dateParts[0], 10)
          const month = parseInt(dateParts[1], 10) - 1
          const day = parseInt(dateParts[2], 10)
          const date = new Date(year, month, day)
          isSunday = date.getDay() === 0
        } else {
          const date = new Date(normalizedDateStr)
          isSunday = date.getDay() === 0
        }
        // 日曜日の場合はfalseを返す（日曜日として扱う）
        if (isSunday) return false
        return true
      }
      
      // 土曜日を所定休日として判定
      const dateParts = normalizedDateStr.split('-')
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0], 10)
        const month = parseInt(dateParts[1], 10) - 1
        const day = parseInt(dateParts[2], 10)
        const date = new Date(year, month, day)
        return date.getDay() === 6 // 土曜日
      }
      const date = new Date(normalizedDateStr)
      const day = date.getDay()
      return day === 6 // 土曜日
    },
    isHoliday(dateStr) {
      // 休日全般を判定（後方互換性のため残す）
      return this.isLegalHoliday(dateStr) || this.isScheduledHoliday(dateStr)
    },
    getRowBackgroundColor(day, index) {
      // すべての行を交互の背景色にする
      if (index % 2 === 0) {
        return 'rgb(255, 255, 255)' // 白色
      } else {
        return '#EDEDED' // 薄いグレー
      }
    },
    getDayOfWeekColor(dateStr, day) {
      // すべての曜日ラベルを黒色にする
      return 'rgb(0, 0, 0)' // 黒色
    },
    getEventText(day) {
      // 1. 祝日の場合は祝日名を表示（最優先）
      if (day.holidayName) {
        return `(${day.holidayName})`
      }
      
      // 2. 休暇の場合は休暇種別名を表示
      if (day.vacationTypeName) {
        return `休暇(${day.vacationTypeName})`
      }
      
      // 3. 休日出勤申請が承認済みまたは申請中の場合
      if (day.holidayWorkApplication) {
        const parts = ['休日出勤']
        
        // 日次確定の有無を確認
        if (day.isDailyConfirmed) {
          parts.push('日次確定')
        }
        
        // 勤務場所を追加
        if (day.workLocationCode === 'REMOTE' || day.workLocationCode === 'HOME') {
          parts.push('在宅')
        } else if (day.workLocationCode === 'COMMUTE') {
          parts.push('通勤')
        } else if (day.workLocationCode === 'DIRECT') {
          parts.push('直行、直帰、直行直帰')
        } else if (day.workLocationCode === 'BUSINESS_TRIP') {
          parts.push('出張')
        } else if (day.workLocationCode) {
          parts.push(day.workLocationCode)
        }
        
        return parts.join('、')
      }
      
      // 4. 日時確定の場合
      if (day.isDailyConfirmed) {
        if (day.workLocationCode === 'REMOTE' || day.workLocationCode === 'HOME') {
          return '日時確定,在宅'
        } else if (day.workLocationCode === 'COMMUTE') {
          return '日時確定,通勤'
        } else if (day.workLocationCode === 'DIRECT') {
          return '日時確定,直行、直帰、直行直帰'
        } else if (day.workLocationCode === 'BUSINESS_TRIP') {
          return '日時確定,出張'
        }
        // 日時確定だが勤務場所コードが不明な場合
        if (day.workLocationCode) {
          return `日時確定,${day.workLocationCode}`
        }
        return '日時確定'
      }
      
      // 5. 通常勤務で日時確定ではない場合、勤務場所だけを表示
      if (day.workLocationCode === 'REMOTE' || day.workLocationCode === 'HOME') {
        return '在宅'
      } else if (day.workLocationCode === 'COMMUTE') {
        return '通勤'
      } else if (day.workLocationCode === 'DIRECT') {
        return '直行、直帰、直行直帰'
      } else if (day.workLocationCode === 'BUSINESS_TRIP') {
        return '出張'
      }
      
      // 勤務場所コードがない場合は空文字を返す
      return ''
    },
    formatTime(timeStr) {
      if (!timeStr) return ''
      if (typeof timeStr === 'string' && timeStr.includes('T')) {
        const date = new Date(timeStr)
        const hours = date.getHours() // 先頭0を削除
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${hours}:${minutes}`
      }
      // 既にHH:MM形式の場合は、先頭0を削除
      if (typeof timeStr === 'string' && /^\d{2}:\d{2}$/.test(timeStr)) {
        const [hours, minutes] = timeStr.split(':')
        const hourNum = parseInt(hours, 10)
        return `${hourNum}:${minutes}`
      }
      return timeStr
    },
    formatHours(hours) {
      if (hours === null || hours === undefined) return ''
      // 浮動小数点数の誤差を考慮して、分単位で計算
      const totalMinutes = Math.round(hours * 60)
      const h = Math.floor(totalMinutes / 60)
      const m = totalMinutes % 60
      return `${h}:${String(m).padStart(2, '0')}`
    },
    formatHoursLong(hours) {
      if (hours === null || hours === undefined) return ''
      // 浮動小数点数の誤差を考慮して、分単位で計算
      const totalMinutes = Math.round(hours * 60)
      const h = Math.floor(totalMinutes / 60)
      const m = totalMinutes % 60
      return `${h}:${String(m).padStart(2, '0')}`
    },
    formatOverUnder(hours) {
      if (hours === null || hours === undefined) return ''
      let sign = '+'

      if (hours < 0) {
        sign = '-'
      }
      return `${sign}${this.formatHours(Math.abs(hours))}`
    },
    formatCountAndHours(count, hours) {
      return `${count}回 ${this.formatHours(hours)}`
    },
    getRemarkText(day) {
      // 打刻漏れや手入力修正の情報と既存の備考を結合
      const remarks = []
      
      // 打刻漏れの判定（打刻のし忘れなどで手入力で入力した場合）
      // 打刻種別がMANUALで、かつ元の打刻時刻（ORIGINAL_CLOCK_IN_TIME/ORIGINAL_CLOCK_OUT_TIME）がない場合
      // これは打刻のし忘れなどで手入力で入力したことを示す
      const hasClockInMissing = day.clockInType === 'MANUAL' && !day.originalClockInTime && day.clockInTime
      const hasClockOutMissing = day.clockOutType === 'MANUAL' && !day.originalClockOutTime && day.clockOutTime
      
      if (hasClockInMissing && hasClockOutMissing) {
        remarks.push({ text: '(出退打刻なし)', color: '#7955D5' })
      } else if (hasClockInMissing) {
        remarks.push({ text: '(出社打刻なし)', color: '#7955D5' })
      } else if (hasClockOutMissing) {
        remarks.push({ text: '(退社打刻なし)', color: '#7955D5' })
      }
      
      // 打刻時刻の手入力修正の判定
      // 1. 打刻種別がSTAMPまたはSCHEDULEDで、かつ元の打刻時刻が存在し、かつ現在の時刻と異なる場合
      // 2. 打刻種別がMANUALで、かつ元の打刻時刻が存在し、かつ現在の時刻と異なる場合（打刻後に手入力で修正）
      if (day.clockInType && day.originalClockInTime && day.clockInTime) {
        const originalTime = this.formatTime(day.originalClockInTime)
        const currentTime = this.formatTime(day.clockInTime)
        if (originalTime !== currentTime) {
          remarks.push({ text: `(出社打刻 ${currentTime})`, color: '#7955D5' })
        }
      }
      
      if (day.clockOutType && day.originalClockOutTime && day.clockOutTime) {
        const originalTime = this.formatTime(day.originalClockOutTime)
        const currentTime = this.formatTime(day.clockOutTime)
        if (originalTime !== currentTime) {
          remarks.push({ text: `((退社打刻 ${currentTime}))`, color: '#7955D5' })
        }
      }
      
      // 既存の備考テキストを追加
      if (day.remarkText) {
        if (Array.isArray(day.remarkText)) {
          remarks.push(...day.remarkText.map(r => typeof r === 'string' ? { text: r, color: 'rgb(0, 0, 0)' } : r))
        } else {
          remarks.push({ text: day.remarkText, color: 'rgb(0, 0, 0)' })
        }
      }
      
      return remarks.length > 0 ? remarks : null
    },
    getRemarkTextArray(day) {
      const remarks = this.getRemarkText(day)
      return remarks || []
    },
    calculateTotalOvertime() {
      if (!this.monthlySummary) return 0
      return (this.monthlySummary.withinLegalOvertime || 0) + (this.monthlySummary.overLegalOvertime || 0)
    },
    getPaidLeaveBalanceLabel() {
      if (!this.yearMonth) return '有給残日数'
      const [year, month] = this.yearMonth.split('-').map(Number)
      const lastDay = new Date(year, month, 0).getDate()
      return `有休残日数(${month}/${lastDay}時点)`
    },
    getPlannedGrantDaysLabel() {
      if (!this.yearMonth) return '計画付与予定日'
      const [year, month] = this.yearMonth.split('-').map(Number)
      let nextMonth = { year, month: month + 1 }

      if (month === 12) {
        nextMonth = { year: year + 1, month: 1 }
      }
      return `${nextMonth.year}年${String(nextMonth.month).padStart(2, '0')}月度以降の 計画付与予定日`
    },
    getRowTop(index) {
      // 行の高さを少しずつ大きくする
      // Day 1: top: 0px, height: 15px
      // Day 2: top: 15px, height: 16px
      // Day 3: top: 31px, height: 17px
      // 以降、交互に16-17px
      let top = 0
      for (let i = 0; i < index; i++) {
        if (i === 0) {
          top += 15
        } else if (i % 2 === 1) {
          top += 16
        } else {
          top += 17
        }
      }
      return top
    },
    getRowHeight(index) {
      // 行の高さを少しずつ大きくする
      if (index === 0) return 15
      // 最後の行は少し狭める
      if (this.dailyData && index === this.dailyData.length - 1) {
        if (index % 2 === 1) {
          return 14
        }

        return 15
      }
      if (index % 2 === 1) {
        return 16
      }

      return 17
    },
    getRowContentTop(index) {
      // 行内のコンテンツの位置（行の高さに応じて中央揃えに調整）
      const height = this.getRowHeight(index)
      // 行の高さからテキストの高さ(8px)を引いて2で割ることで中央揃え
      return Math.floor((height - 8) / 2)
    },
    getTotalRowTop() {
      // テーブル行セクションの開始位置: 96px
      // 最後の行の位置を計算
      if (!this.dailyData || this.dailyData.length === 0) {
        return 96
      }
      const lastIndex = this.dailyData.length - 1
      const lastRowTop = this.getRowTop(lastIndex)
      const lastRowHeight = this.getRowHeight(lastIndex)
      // テーブル行セクションの開始位置 + 最後の行の位置 + 最後の行の高さ + マージン（少し狭める）
      return 96 + lastRowTop + lastRowHeight - 0.5
    },
    getSymbolExplanationTop() {
      // 合計行の下に配置（合計行の高さ: 20px）
      return this.getTotalRowTop() + 20 + 5
    },
    getDashedLineHeight() {
      // テーブルヘッダーの開始位置: 73px
      // 合計行の上端までの高さを計算（破線を合計行の位置で切断）
      const totalRowTop = this.getTotalRowTop()
      return totalRowTop - 73
    },
    getDashedLineHeightToTotalBottom() {
      // テーブルヘッダーの開始位置: 73px
      // 合計行の下端までの高さを計算（日付とイベント列の間の破線用）
      const totalRowTop = this.getTotalRowTop()
      const totalRowHeight = 20 // 合計行の高さ
      return totalRowTop + totalRowHeight - 73
    },
    getDashedLineHeightToLastRow() {
      // テーブルヘッダーの開始位置: 73px
      // 最後のデータ行（31日）の下端までの高さを計算（日付項目内の破線用）
      if (!this.dailyData || this.dailyData.length === 0) {
        return 96 - 73 // テーブル行セクションの開始位置 - ヘッダーの上端
      }
      const lastIndex = this.dailyData.length - 1
      const lastRowTop = this.getRowTop(lastIndex)
      const lastRowHeight = this.getRowHeight(lastIndex)
      // テーブル行セクションの開始位置(96px) + 最後の行の位置 + 最後の行の高さ - ヘッダーの上端(73px)
      // 破線が境界線に侵入しないように、1px短くする
      return 96 + lastRowTop + lastRowHeight - 73 - 23
    },
    printReport() {
      window.print()
    },
    closeWindow() {
      window.close()
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.monthly-summary-container {
  position: relative;
  width: 1920px;
  height: 1080px;
  background-color: #F4F6F9;
  overflow: hidden;
  font-family: Arial, sans-serif;
}

.background-vector {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 1920px;
  height: 1080px;
}

/* Header Section */
.header-section {
  position: absolute;
  left: 13px;
  top: 7px;
  width: 148px;
  height: 21px;
}

.button-background {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 101px;
  height: 21px;
}

.print-button {
  position: absolute;
  left: 8px;
  top: 5px;
  width: 85px;
  height: 10px;
  font-size: 12px;
  font-family: Arial, sans-serif;
  color: rgb(255, 255, 255);
  text-align: center;
  line-height: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.close-link {
  position: absolute;
  left: 111px;
  top: 5px;
  width: 36px;
  height: 10px;
  font-size: 12px;
  font-family: Arial, sans-serif;
  color: rgb(0, 102, 204);
  text-align: left;
  line-height: 10px;
  text-decoration: none;
}

/* Info Header Section */
.info-header-section {
  position: absolute;
  left: 6px;
  top: 34px;
  width: 1873px;
  height: 30px;
}

.info-header-background {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 1873px;
  height: 30px;
}

.title-label {
  position: absolute;
  left: 0px;
  top: 2px;
  width: 43px;
  height: 11px;
  font-size: 10px;
  font-family: Arial, sans-serif;
  font-weight: 400;
  color: rgb(51, 51, 51);
  text-align: center;
  line-height: 11px;
}

.status-label {
  position: absolute;
  left: 4px;
  top: 17px;
  width: 53px;
  height: 11px;
  font-size: 10px;
  font-family: Arial, sans-serif;
  font-weight: 400;
  color: rgb(51, 51, 51);
  text-align: center;
  line-height: 11px;
}

.target-year-month {
  position: absolute;
  left: 55px;
  top: 2px;
  width: 65px;
  height: 11px;
  font-size: 10px;
  font-family: Arial, sans-serif;
  font-weight: 400;
  color: rgb(51, 51, 51);
  text-align: center;
  line-height: 11px;
}

.approval-status {
  position: absolute;
  left: 50px;
  top: 17px;
  width: 65px;
  height: 11px;
  font-size: 10px;
  font-family: Arial, sans-serif;
  font-weight: 400;
  color: rgb(51, 51, 51);
  text-align: center;
  line-height: 11px;
}

.department-label {
  position: absolute;
  left: 363px;
  top: 37px;
  width: 50px;
  height: 11px;
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(0, 0, 0);
  text-align: left;
  line-height: 11px;
}

.department-value {
  position: absolute;
  left: 134px;
  top: 53px;
  width: 80px;
  height: 10px;
  font-size: 9px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: left;
  line-height: 10px;
}

.attendance-system-label {
  position: absolute;
  left: 856px;
  top: 37px;
  width: 60px;
  height: 10px;
  font-size: 9px;
  font-family: Arial, sans-serif;
  font-weight: 400;
  color: rgb(102, 102, 102);
  text-align: left;
  line-height: 10px;
}

.attendance-system-value {
  position: absolute;
  left: 660px;
  top: 53px;
  width: 131px;
  height: 10px;
  font-size: 9px;
  font-family: Arial, sans-serif;
  font-weight: 400;
  color: rgb(102, 102, 102);
  text-align: left;
  line-height: 10px;
}

.employee-code-label {
  position: absolute;
  left: 1220px;
  top: 2px;
  width: 74px;
  height: 10px;
  font-size: 9px;
  font-family: Arial, sans-serif;
  font-weight: 400;
  color: rgb(102, 102, 102);
  text-align: left;
  line-height: 10px;
}

.employee-code-value {
  position: absolute;
  left: 1092px;
  top: 18px;
  width: 49px;
  height: 10px;
  font-size: 11px;
  font-family: Arial, sans-serif;
  font-weight: 400;
  color: rgb(51, 51, 51);
  text-align: left;
  line-height: 10px;
}

.employee-name-label {
  position: absolute;
  left: 1653px;
  top: 37px;
  width: 45px;
  height: 10px;
  font-size: 9px;
  font-family: Arial, sans-serif;
  font-weight: 400;
  color: rgb(102, 102, 102);
  text-align: left;
  line-height: 10px;
}

.employee-name-value {
  position: absolute;
  left: 1445px;
  top: 53px;
  width: 44px;
  height: 10px;
  font-size: 9px;
  font-family: Arial, sans-serif;
  font-weight: 400;
  color: rgb(51, 51, 51);
  text-align: left;
  line-height: 10px;
}

.divider {
  position: absolute;
  top: 35px;
  width: 1px;
  height: 30px;
}

.divider-1 { left: 128px; }
.divider-2 { left: 655px; }
.divider-3 { left: 1093px; }
.divider-4 { left: 1440px; }

.divider-horizontal {
  position: absolute;
  left: 128px;
  top: 50px;
  width: 1751px;
  height: 1px;
}

/* Dashed Lines */
.dashed-line {
  position: absolute;
  top: 73px;
  width: 2px;
  z-index: 10;
}

/* Table Header */
.table-header-background {
  position: absolute;
  left: 6px;
  top: 73px;
  width: 1873px;
  height: 23px;
}

.table-header-text {
  position: absolute;
  left: 6px;
  top: 73px;
  width: 1873px;
  height: 23px;
}

.header-date {
  position: absolute;
  left: 86px;
  top: 0px;
  width: 29px;
  height: 23px;
  font-size: 9px;
  font-family: Arial, sans-serif;
  font-weight: 700;
  color: rgb(255, 255, 255);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-event {
  position: absolute;
  left: 286px;
  top: 0px;
  width: 187px;
  height: 23px;
  font-size: 9px;
  font-family: Arial, sans-serif;
  font-weight: 700;
  color: rgb(255, 255, 255);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-clock-in {
  position: absolute;
  left: 577px;
  top: 0px;
  width: 29px;
  height: 23px;
  font-size: 9px;
  font-family: Arial, sans-serif;
  font-weight: 700;
  color: rgb(255, 255, 255);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-clock-out {
  position: absolute;
  left: 713px;
  top: 0px;
  width: 29px;
  height: 23px;
  font-size: 9px;
  font-family: Arial, sans-serif;
  font-weight: 700;
  color: rgb(255, 255, 255);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-break {
  position: absolute;
  left: 850px;
  top: 0px;
  width: 29px;
  height: 23px;
  font-size: 9px;
  font-family: Arial, sans-serif;
  font-weight: 700;
  color: rgb(255, 255, 255);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-actual-work {
  position: absolute;
  left: 971px;
  top: 0px;
  width: 45px;
  height: 23px;
  font-size: 9px;
  font-family: Arial, sans-serif;
  font-weight: 700;
  color: rgb(255, 255, 255);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: pre-line;
}

.header-overtime {
  position: absolute;
  left: 1113px;
  top: 0px;
  width: 29px;
  height: 23px;
  font-size: 9px;
  font-family: Arial, sans-serif;
  font-weight: 700;
  color: rgb(255, 255, 255);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-holiday {
  position: absolute;
  left: 1243px;
  top: 0px;
  width: 29px;
  height: 23px;
  font-size: 9px;
  font-family: Arial, sans-serif;
  font-weight: 700;
  color: rgb(255, 255, 255);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-night {
  position: absolute;
  left: 1374px;
  top: 0px;
  width: 29px;
  height: 23px;
  font-size: 9px;
  font-family: Arial, sans-serif;
  font-weight: 700;
  color: rgb(255, 255, 255);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-remark {
  position: absolute;
  left: 1657.5px;
  top: 0px;
  width: 29px;
  height: 23px;
  font-size: 9px;
  font-family: Arial, sans-serif;
  font-weight: 700;
  color: rgb(255, 255, 255);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Table Rows */
.table-rows-section {
  position: absolute;
  left: 7px;
  top: 96px;
  width: 1873px;
}

.table-row {
  position: absolute;
  left: 0px;
  width: 1873px;
  margin-bottom: 0;
}

.row-background {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 1873px;
}

.row-date {
  position: absolute;
  left: 64px;
  width: 26px;
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: left;
  display: flex;
  align-items: center;
}

.row-day {
  position: absolute;
  left: 112px;
  width: 13px;
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-day-divider {
  position: absolute;
  left: 90px;
  top: 0px;
  width: 1px;
  z-index: 5;
}

.day-icon-divider {
  position: absolute;
  left: 150px;
  top: 0px;
  width: 1px;
  z-index: 5;
}

.holiday-icon {
  position: absolute;
  left: 182px;
  width: 11px;
  height: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.row-event {
  position: absolute;
  left: 230px;
  width: 300px;
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: left;
  display: flex;
  align-items: center;
  margin-top: -3px;
}

.row-clock-in {
  position: absolute;
  left: 577px;
  width: 93px; /* 670px - 577px = 93px (右側の破線の内側まで) */
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px; /* 破線との間隔 */
}

.row-clock-out {
  position: absolute;
  left: 709px;
  width: 96px; /* 805px - 709px = 96px (右側の破線の内側まで) */
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px; /* 破線との間隔 */
}

.row-break {
  position: absolute;
  left: 850px;
  width: 85px; /* 935px - 850px = 85px (右側の破線の内側まで) */
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px; /* 破線との間隔 */
}

.row-actual-work {
  position: absolute;
  left: 978px;
  width: 92px; /* 1070px - 978px = 92px (右側の破線の内側まで) */
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px; /* 破線との間隔 */
}

.row-overtime {
  position: absolute;
  left: 1110px;
  width: 90px; /* 1200px - 1110px = 90px (右側の破線の内側まで) */
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px; /* 破線との間隔 */
}

.row-holiday {
  position: absolute;
  left: 1249px;
  width: 81px; /* 1330px - 1249px = 81px (右側の破線の内側まで) */
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px; /* 破線との間隔 */
}

.row-night {
  position: absolute;
  left: 1380px;
  width: 85px; /* 1465px - 1380px = 85px (右側の破線の内側まで) */
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px; /* 破線との間隔 */
}

.row-remark {
  position: absolute;
  left: 1474px;
  width: auto;
  height: 13px;
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(0, 0, 0);
  text-align: left;
  line-height: 13px;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

/* Total Row */
.total-row-background {
  position: absolute;
  left: 7px;
  width: 1873px;
  height: 20px;
}

.total-label {
  position: absolute;
  left: 13px;
  width: 30px;
  height: 10px;
  font-size: 11px;
  font-family: Arial, sans-serif;
  font-weight: 700;
  color: rgb(51, 51, 51);
  text-align: left;
  line-height: 10px;
}

.total-break {
  position: absolute;
  left: 856px;
  width: 79px; /* 935px - 856px = 79px (右側の破線の内側まで) */
  height: 10px;
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: right;
  line-height: 10px;
  padding-right: 5px; /* 破線との間隔 */
}

.total-actual-work {
  position: absolute;
  left: 977px;
  width: 93px; /* 1070px - 977px = 93px (右側の破線の内側まで) */
  height: 10px;
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: right;
  line-height: 10px;
  padding-right: 5px; /* 破線との間隔 */
}

.total-overtime {
  position: absolute;
  left: 1119px;
  width: 81px; /* 1200px - 1119px = 81px (右側の破線の内側まで) */
  height: 10px;
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: right;
  line-height: 10px;
  padding-right: 5px; /* 破線との間隔 */
}

.total-holiday-work {
  position: absolute;
  left: 1249px;
  width: 81px; /* 1330px - 1249px = 81px (右側の破線の内側まで) */
  height: 10px;
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: right;
  line-height: 10px;
  padding-right: 5px; /* 破線との間隔 */
}

.total-night-work {
  position: absolute;
  left: 1376px;
  width: 89px; /* 1465px - 1376px = 89px (右側の破線の内側まで) */
  height: 10px;
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: right;
  line-height: 10px;
  padding-right: 5px; /* 破線との間隔 */
}

/* Symbol Explanation */
.symbol-explanation {
  position: absolute;
  left: 20px;
  width: 379px;
  height: 8px;
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(102, 102, 102);
  text-align: left;
  line-height: 8px;
}

/* Monthly Summary Title */
.monthly-summary-title {
  position: absolute;
  left: 27px;
  top: 650px;
  width: 248px;
  height: 13px;
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: left;
  line-height: 13px;
  margin: 0;
}

/* Summary Sections */
.summary-section {
  position: absolute;
  border: 1px solid rgb(0, 0, 0);
}

.section-border {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
}

.section-row-border {
  position: absolute;
  left: 0px;
  width: 100%;
  height: 21px;
}

.section-row {
  position: absolute;
  left: 0px;
  width: 100%;
  height: 21px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 13px;
  z-index: 1;
}

.summary-section::after {
  content: '';
  position: absolute;
  right: 80px;
  top: 0;
  bottom: 0;
  width: 1px;
  background-image: repeating-linear-gradient(
    to bottom,
    rgb(0, 0, 0) 0px,
    rgb(0, 0, 0) 2px,
    transparent 2px,
    transparent 4px
  );
  z-index: 2;
}

.section-7::after,
.section-9::after,
.section-10::after {
  right: 70px;
}

.section-row-white {
  background-color: rgb(255, 255, 255);
}

.section-row-gray {
  background-color: rgb(245, 245, 245);
}

.section-label {
  font-size: 12px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: left;
  line-height: 10px;
}

.section-value {
  font-size: 12px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: right;
  line-height: 10px;
}

.section-value.negative {
  color: rgb(217, 83, 79);
}

.section-detail {
  font-size: 12px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
  text-align: left;
  line-height: 10px;
}

.section-detail.empty {
  color: rgb(153, 153, 153);
}

/* Section Positions */
.section-1 {
  left: 27px;
  top: 673px;
  width: 603px;
  height: 86px;
  background-color: rgb(255, 255, 255);
}

.section-2 {
  left: 27px;
  top: 775px;
  width: 603px;
  height: 86px;
  background-color: rgb(245, 245, 245);
}

.section-3 {
  left: 27px;
  top: 877px;
  width: 603px;
  height: 44px;
  background-color: rgb(255, 255, 255);
}

.section-4 {
  left: 644px;
  top: 673px;
  width: 603px;
  height: 107px;
  background-color: rgb(255, 255, 255);
}

.section-5 {
  left: 644px;
  top: 798px;
  width: 603px;
  height: 65px;
  background-color: rgb(245, 245, 245);
}

.section-6 {
  left: 644px;
  top: 877px;
  width: 603px;
  height: 65px;
  background-color: rgb(255, 255, 255);
}

.section-7 {
  left: 1261px;
  top: 673px;
  width: 580px;
  height: 65px;
  background-color: rgb(255, 255, 255);
}

.section-9 {
  left: 1261px;
  top: 748px;
  width: 580px;
  height: 44px;
  background-color: rgb(255, 255, 255);
}

.section-10 {
  left: 1261px;
  top: 804px;
  width: 580px;
  height: 44px;
  background-color: rgb(245, 245, 245);
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  color: white;
  font-size: 18px;
}

/* Error Message */
.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #D9534F;
  padding: 20px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  z-index: 1001;
}

/* Print Styles */
@media print {
  .header-section {
    display: block;
  }
  
  .loading-overlay,
  .error-message {
    display: none;
  }
}
</style>