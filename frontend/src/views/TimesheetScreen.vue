<template>
  <div class="timesheet-container">
    <!-- 共通ヘッダーコンポーネント -->
    <AppHeader 
      :current-page="currentPage" 
      @menu-click="handleMenuClick"
    />
    
    <!-- Blue Header -->
    <div class="blue-header">
      <div class="header-wrapper">
        <!-- Rectangle 120: 青色の背景（左端の角が丸い） -->
        <svg class="header-background">
          <path d="M 3 0 L 1904 0 L 1904 68 L 3 68 Q 0 68 0 65 L 0 3 Q 0 0 3 0 Z" fill="rgb(37, 100, 153)" />
        </svg>
        
        <!-- Rectangle 174: 灰色の縦線 -->
        <div class="divider-line"></div>
        
        <!-- 勤務表 -->
        <span class="title-text">勤務表</span>
        
        <!-- 部署情報 -->
        <span v-if="employeeInfo" class="department-info">　　部署　 {{ employeeInfo.DEPARTMENT }}<br>勤務体系　フレックスタイム制（一般）</span>
        
        <!-- Rectangle 179: 青緑色の矩形 -->
        <div class="user-background"></div>
        
        <!-- 人物アイコン Group -->
        <div class="user-icon">
          <!-- 頭部 -->
          <svg class="user-head">
            <path d="M 19 8.5 C 19 13.19 14.746 17 9.5 17 C 4.254 17 0 13.19 0 8.5 C 0 3.81 4.254 0 9.5 0 C 14.746 0 19 3.81 19 8.5 Z" fill="rgb(255, 255, 255)" />
          </svg>
          <!-- 身体 -->
          <svg class="user-body">
            <path d="M 11 0 C 4.888888888888889 0 0 3.336441333332519 0 8.675758129664551 L 0 16.68589461538163 C 0 18.677777777777777 1.2222222222222223 20.01198225631409 3.0555555555555554 20.01198225631409 L 18.944444444444443 20.01198225631409 C 20.777777777777775 20.01198225631409 22 18.677777777777777 22 16.68589461538163 L 22 8.675758129664551 C 22 3.336441333332519 17.11111111111111 0 11 0 Z" fill="rgb(255, 255, 255)" />
          </svg>
        </div>
        
        <!-- Rectangle 180: 黄緑色のボタン -->
        <div class="button-green"></div>
        
        <!-- Rectangle 181: 青色のボタン -->
        <div class="button-blue"></div>
        
        <!-- Rectangle 182: 黄色のボタン (HELP) -->
        <div class="button-yellow"></div>
        
        <!-- TEXT: ？ -->
        <span class="help-question">？</span>
        
        <!-- TEXT: HELP -->
        <span class="help-text">HELP</span>
        
        <!-- カレンダーアイコン -->
        <div class="calendar-icon">
          <svg width="34" height="31" viewBox="0 0 34 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M29.7832 25.5H18.7832" stroke="white" stroke-linecap="round"/>
            <path d="M15.7832 25.5H4.7832" stroke="white" stroke-linecap="round"/>
            <path d="M0.544632 21.4285L0.5 5.68018" stroke="white" stroke-linecap="round"/>
            <path d="M33.4997 21.5L33.4551 5.75171" stroke="white" stroke-linecap="round"/>
            <path d="M4.7832 25.5C2.11654 25.5 0.5 24.1667 0.5 21.5" stroke="white" stroke-linecap="round"/>
            <path d="M33.5 21.5C33.4471 24.2706 32.1415 25.6223 29.583 25.5551" stroke="white" stroke-linecap="round"/>
            <path d="M15.9805 25.5C14.7805 26.8333 13.2805 28.5 12.4805 30.5" stroke="white" stroke-linecap="round"/>
            <path d="M7.5 0.5L27.5 0.5" stroke="white" stroke-linecap="round"/>
            <path d="M27.5 0.5C31.5 0.5 33.5 2.16667 33.5 5.5" stroke="white" stroke-linecap="round"/>
            <path d="M0.5 6C0.488337 2.73188 2.23248 0.521597 7.5 0.5" stroke="white" stroke-linecap="round"/>
            <path d="M18.4805 25.5C17.3896 26.8333 15.3896 28.5 12.4805 30.5" stroke="white" stroke-linecap="round"/>
            <path d="M7.04688 13C7.75975 13 8.23727 13.5032 8.2373 14.0068C8.2373 14.5104 7.75977 15.0136 7.04688 15.0137C6.33392 15.0137 5.85645 14.5105 5.85645 14.0068C5.85648 13.5032 6.33395 13 7.04688 13Z" fill="white" stroke="white"/>
            <path d="M13.8086 13C14.5215 13 14.999 13.5032 14.999 14.0068C14.999 14.5104 14.5215 15.0136 13.8086 15.0137C13.0956 15.0137 12.6182 14.5105 12.6182 14.0068C12.6182 13.5032 13.0957 13 13.8086 13Z" fill="white" stroke="white"/>
            <path d="M20.5698 13C21.2827 13 21.7602 13.5032 21.7603 14.0068C21.7603 14.5104 21.2827 15.0136 20.5698 15.0137C19.8569 15.0137 19.3794 14.5105 19.3794 14.0068C19.3794 13.5032 19.8569 13 20.5698 13Z" fill="white" stroke="white"/>
            <path d="M27.3306 13C28.0434 13 28.521 13.5032 28.521 14.0068C28.521 14.5104 28.0435 15.0136 27.3306 15.0137C26.6176 15.0137 26.1401 14.5105 26.1401 14.0068C26.1402 13.5032 26.6176 13 27.3306 13Z" fill="white" stroke="white"/>
          </svg>
        </div>
        
        <!-- TEXT: 休暇情報 -->
        <span class="vacation-info">休暇情報</span>
        
        <!-- ロゴ: 楕円 (Ellipse 3) -->
        <svg class="logo-circle" viewBox="0 0 34 32">
          <ellipse cx="17" cy="16" rx="16" ry="15" fill="rgb(30, 83, 125)" stroke="rgb(25, 158, 214)" stroke-width="0.877" />
        </svg>
        
        <!-- ロゴ: 時計の針 (Line 4 - 長針) -->
        <svg class="clock-long-hand">
          <line x1="0" y1="0" x2="13" y2="0" stroke="rgb(255, 255, 255)" stroke-width="0.738" />
        </svg>
        
        <!-- ロゴ: 時計の針 (Line 5 - 短針) -->
        <svg class="clock-short-hand">
          <line x1="0" y1="0" x2="8" y2="0" stroke="rgb(255, 255, 255)" stroke-width="0.738" />
        </svg>
      </div>
      
      <!-- Attendance Sheet テキスト -->
      <span class="attendance-sheet-text">Attendance Sheet</span>
      
    <!-- 社員名 -->
    <span v-if="employeeInfo" class="employee-name">社員名　{{ employeeInfo.EMPLOYEE_NAME }}</span>
  </div>
  
  <!-- テーブル上部操作エリア -->
  <div class="table-operation-area">
    <!-- 年月選択（テーブル用） -->
    <select v-model="selectedYearMonth" @change="changeYearMonthTable" class="year-month-select">
      <option v-for="ym in yearMonthOptions" :key="ym.value" :value="ym.value">
        {{ ym.label }}
      </option>
    </select>
    
    <!-- 前月リンク -->
    <a href="#" @click.prevent="previousMonthLink" class="nav-link">&lt;前月</a>
    
    <!-- 今月リンク -->
    <a href="#" @click.prevent="currentMonthLink" class="nav-link">今月</a>
    
    <!-- 次月リンク -->
    <a href="#" @click.prevent="nextMonthLink" class="nav-link">次月&gt;</a>
    
    <!-- 右側のリンクグループ -->
    <div class="right-links">
      <!-- お知らせリンク -->
      <a href="#" @click.prevent="showNotice" class="info-link">お知らせ</a>
      
      <!-- 月次サマリーリンク -->
      <a href="#" @click.prevent="showMonthlySummary" class="info-link">月次サマリー</a>
      
      <!-- ステータス表示 -->
      <span class="status-display">
        <span class="status-label">ステータス</span>
        <a href="#" @click.prevent="showStatusDialog" class="info-link">
          <span class="status-icon">{{ statusIcon }}</span>
          <span class="status-text-display">{{ statusText }}</span>
        </a>
      </span>
      
      <!-- 承認申請ボタン -->
      <button @click="showApprovalRequest" class="approval-request-button">承認申請</button>
    </div>
  </div>
  
  <!-- 勤務表テーブル -->
  <div class="timesheet-table-container">
    <!-- ヘッダー行 -->
    <div class="table-header">
      <span class="header-date">日付</span>
      <span class="header-work-status">勤務<br>状況</span>
      <span class="header-approval">申請</span>
      <span class="header-clock-in">出社</span>
      <span class="header-clock-out">退社</span>
      <span class="header-location">勤務場所</span>
      <span class="header-work-hours">工数</span>
      <div class="header-graph">
        <span class="time-label" style="left: 0.4%;">0</span>
        <span class="time-label" style="left: 2.065%;">1</span>
        <span class="time-label" style="left: 3.73%;">2</span>
        <span class="time-label" style="left: 5.395%;">3</span>
        <span class="time-label" style="left: 7.06%;">4</span>
        <span class="time-label" style="left: 8.725%;">5</span>
        <span class="time-label" style="left: 10.39%;">6</span>
        <span class="time-label" style="left: 12.055%;">7</span>
        <span class="time-label" style="left: 13.72%;">8</span>
        <span class="time-label" style="left: 15.385%;">9</span>
        <span class="time-label" style="left: 17.05%;">10</span>
        <span class="time-label" style="left: 18.715%;">11</span>
        <span class="time-label" style="left: 20.38%;">12</span>
        <span class="time-label" style="left: 22.045%;">13</span>
        <span class="time-label" style="left: 23.71%;">14</span>
        <span class="time-label" style="left: 25.375%;">15</span>
        <span class="time-label" style="left: 27.04%;">16</span>
        <span class="time-label" style="left: 28.705%;">17</span>
        <span class="time-label" style="left: 30.37%;">18</span>
        <span class="time-label" style="left: 32.035%;">19</span>
        <span class="time-label" style="left: 33.7%;">20</span>
        <span class="time-label" style="left: 35.365%;">21</span>
        <span class="time-label" style="left: 37.03%;">22</span>
        <span class="time-label" style="left: 38.695%;">23</span>
        <span class="time-label" style="left: 40.36%;">24</span>
        <span class="time-label" style="left: 42.025%;">25</span>
        <span class="time-label" style="left: 43.69%;">26</span>
        <span class="time-label" style="left: 45.355%;">27</span>
        <span class="time-label" style="left: 47.02%;">28</span>
        <span class="time-label" style="left: 48.685%;">29</span>
        <span class="time-label" style="left: 50.35%;">30</span>
        <span class="time-label" style="left: 52.015%;">31</span>
        <span class="time-label" style="left: 53.68%;">32</span>
        <span class="time-label" style="left: 55.345%;">33</span>
        <span class="time-label" style="left: 57.01%;">34</span>
        <span class="time-label" style="left: 58.675%;">35</span>
        <span class="time-label" style="left: 60.34%;">36</span>
        <span class="time-label" style="left: 62.005%;">37</span>
        <span class="time-label" style="left: 63.67%;">38</span>
        <span class="time-label" style="left: 65.335%;">39</span>
        <span class="time-label" style="left: 67%;">40</span>
        <span class="time-label" style="left: 68.665%;">41</span>
        <span class="time-label" style="left: 70.33%;">42</span>
        <span class="time-label" style="left: 71.995%;">43</span>
        <span class="time-label" style="left: 73.66%;">44</span>
        <span class="time-label" style="left: 75.325%;">45</span>
        <span class="time-label" style="left: 76.99%;">46</span>
        <span class="time-label" style="left: 78.645%;">47</span>
        <span class="time-label" style="left: 80.3%;">48</span>
      </div>
      <span class="header-remarks">備考</span>
    </div>
    
    <!-- ローディング表示 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>読み込み中...</p>
    </div>

    <!-- エラー表示 -->
    <div v-if="error && !loading" class="error-message">
      <p>{{ error }}</p>
      <button @click="loadAttendanceData" class="retry-button">再読み込み</button>
    </div>

    <!-- データ行 -->
    <div v-for="day in attendanceData" :key="day.date" :class="['table-row', getRowClass(day)]">
      <!-- 日次確定ボタン（+アイコン） -->
      <button v-if="day.approvalStatus === 'NOT_SUBMITTED' && !day.hasVacation && (!(day.isHoliday || day.dayOfWeekNum === 0 || day.dayOfWeekNum === 6) || day.hasHolidayWorkApplication)" class="daily-confirm-button" @click="confirmDaily(day)" title="日次確定">
        <div class="plus-icon-circle">
          <div class="plus-icon-vertical"></div>
          <div class="plus-icon-horizontal"></div>
        </div>
      </button>
      <!-- 申請中マーク（↑アイコン） -->
      <div v-if="day.approvalStatus === 'PENDING' && !(day.isHoliday || day.dayOfWeekNum === 0 || day.dayOfWeekNum === 6)" class="pending-icon-daily" title="日次確定(承認待ち)">
        <svg style="width: 17px; height: 17px;" viewBox="0 0 17 17">
          <!-- 矢印のシャフト（垂直線） -->
          <line x1="8.5" y1="3" x2="8.5" y2="12" stroke="rgb(25, 158, 214)" stroke-width="2" stroke-linecap="square"/>
          <!-- 矢印の頭部（三角形） -->
          <path d="M 8.5 3 L 3 8 L 14 8 Z" fill="none" stroke="rgb(25, 158, 214)" stroke-width="2" stroke-linejoin="miter"/>
        </svg>
      </div>
      <!-- 承認済みマーク（チェックアイコン） -->
      <div v-if="day.approvalStatus === 'APPROVED' && !(day.isHoliday || day.dayOfWeekNum === 0 || day.dayOfWeekNum === 6)" class="check-icon-daily" title="日次確定(承認済み)">
        <svg style="width: 17px; height: 17px;">
          <line x1="2" y1="8" x2="7" y2="13" stroke="rgb(255, 255, 255)" stroke-width="2" />
          <line x1="7" y1="13" x2="15" y2="4" stroke="rgb(255, 255, 255)" stroke-width="2" />
        </svg>
      </div>
      <!-- 日付 -->
      <span class="cell-date">
        <span class="date-number">{{ day.dateNumber }}</span>
        <span :class="['date-day-of-week', getDayOfWeekClass(day)]">{{ day.dateDayOfWeek }}</span>
      </span>
      
      <!-- 勤務状況アイコン -->
      <div class="cell-work-status">
        <!-- 有給休暇: コーヒーマーク -->
        <div 
          v-if="day.hasVacation && day.vacationTypeCode === 'PAID_LEAVE'"
          class="coffee-icon"
          title="有給休暇"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <!-- 水色の円 -->
            <circle cx="9" cy="9" r="9" fill="rgb(94, 168, 198)"/>
            <!-- コーヒーカップ（白） -->
            <path d="M 5 6 L 5 11 L 7 11 L 7 13 L 11 13 L 11 11 L 13 11 L 13 6 Z" fill="rgb(255, 255, 255)"/>
            <!-- ハンドル（白） -->
            <path d="M 13 8 Q 14 8 14 9 Q 14 10 13 10" fill="none" stroke="rgb(255, 255, 255)" stroke-width="1.5" stroke-linecap="round"/>
            <!-- 湯気（白） -->
            <line x1="6" y1="5" x2="6" y2="3" stroke="rgb(255, 255, 255)" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="9" y1="5" x2="9" y2="2" stroke="rgb(255, 255, 255)" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="12" y1="5" x2="12" y2="3" stroke="rgb(255, 255, 255)" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <!-- 代休: コーヒーマーク（有給休暇と同じ） -->
        <div 
          v-if="day.hasVacation && day.vacationTypeCode === 'SUBSTITUTE_HOLIDAY'"
          class="coffee-icon"
          title="代休"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <!-- 水色の円 -->
            <circle cx="9" cy="9" r="9" fill="rgb(94, 168, 198)"/>
            <!-- コーヒーカップ（白） -->
            <path d="M 5 6 L 5 11 L 7 11 L 7 13 L 11 13 L 11 11 L 13 11 L 13 6 Z" fill="rgb(255, 255, 255)"/>
            <!-- ハンドル（白） -->
            <path d="M 13 8 Q 14 8 14 9 Q 14 10 13 10" fill="none" stroke="rgb(255, 255, 255)" stroke-width="1.5" stroke-linecap="round"/>
            <!-- 湯気（白） -->
            <line x1="6" y1="5" x2="6" y2="3" stroke="rgb(255, 255, 255)" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="9" y1="5" x2="9" y2="2" stroke="rgb(255, 255, 255)" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="12" y1="5" x2="12" y2="3" stroke="rgb(255, 255, 255)" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <!-- 打刻時刻と入力時刻が異なる場合: 黄色の警告アイコン -->
        <div 
          v-else-if="day.clockIn && day.clockOut && day.hasStampManualMismatch && !day.hasWarning && !(day.isHoliday || day.dayOfWeekNum === 0 || day.dayOfWeekNum === 6) && !day.hasVacation"
          class="stamp-manual-mismatch-icon"
          title="通常勤務日&#10;打刻時刻と入力時刻が異なる理由を備考に入力してください"
        >
          <div class="icon-circle-yellow">
            <span class="icon-exclamation-black">!</span>
          </div>
        </div>
        <!-- 通常勤務: NIKKORIアイコン（出社と退社ボタンが押された場合） -->
        <div 
          v-else-if="day.clockIn && day.clockOut && !day.hasWarning && !day.hasStampManualMismatch && !(day.isHoliday || day.dayOfWeekNum === 0 || day.dayOfWeekNum === 6) && !day.hasVacation"
          class="nikori-icon"
          title="通常勤務日"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <!-- 顔の輪郭（青色の円） -->
            <circle cx="9" cy="9" r="9" fill="rgb(94, 168, 198)"/>
            <!-- 左目（白い小さな円） -->
            <ellipse cx="6.5" cy="7" rx="1.5" ry="3" fill="rgb(255, 255, 255)"/>
            <!-- 右目（白い小さな円） -->
            <ellipse cx="11.5" cy="7" rx="1.5" ry="3" fill="rgb(255, 255, 255)"/>
            <!-- 笑顔の口（白いベクター） -->
            <path d="M 3 12.5 Q 9 17.5 15 12.5" fill="none" stroke="rgb(255, 255, 255)" stroke-width="1" stroke-linecap="round"/>
          </svg>
        </div>
        <!-- 注意が必要な勤務: !マーク -->
        <div 
          v-else-if="day.hasWarning && !day.hasVacation" 
          class="warning-icon"
          title="注意が必要な勤務"
        >
          <div class="icon-circle-blue">
            <span class="icon-exclamation">!</span>
          </div>
        </div>
      </div>
      
      
        <!-- 申請状況 -->
        <div class="cell-approval">
          <!-- 優先順位: 日次確定 > 休日出勤 > 休暇 -->
          
          <!-- 日次確定申請: 申請中 -->
          <div v-if="day.approvalStatus === 'PENDING'" class="pending-icon clickable-icon" @click="openApplicationDialogWithType(day)" title="承認待ち">
            <svg style="width: 17px; height: 17px;" viewBox="0 0 17 17">
              <line x1="8.5" y1="3" x2="8.5" y2="12" stroke="rgb(25, 158, 214)" stroke-width="2" stroke-linecap="square"/>
              <path d="M 8.5 3 L 3 8 L 14 8 Z" fill="none" stroke="rgb(25, 158, 214)" stroke-width="2" stroke-linejoin="miter"/>
            </svg>
          </div>
          
          <!-- 日次確定申請: 承認済み -->
          <div v-else-if="day.approvalStatus === 'APPROVED'" class="check-icon clickable-icon" @click="openApplicationDialogWithType(day)" title="承認済み">
            <svg style="width: 17px; height: 17px;">
              <line x1="2" y1="8" x2="7" y2="13" stroke="rgb(255, 255, 255)" stroke-width="2" />
              <line x1="7" y1="13" x2="15" y2="4" stroke="rgb(255, 255, 255)" stroke-width="2" />
            </svg>
          </div>
          
          <!-- 休日出勤申請: 申請中 -->
          <div v-else-if="day.holidayWorkApplicationStatus === 'PENDING'" class="pending-icon clickable-icon" @click="openApplicationDialogWithType(day)" title="承認待ち">
            <svg style="width: 17px; height: 17px;" viewBox="0 0 17 17">
              <line x1="8.5" y1="3" x2="8.5" y2="12" stroke="rgb(25, 158, 214)" stroke-width="2" stroke-linecap="square"/>
              <path d="M 8.5 3 L 3 8 L 14 8 Z" fill="none" stroke="rgb(25, 158, 214)" stroke-width="2" stroke-linejoin="miter"/>
            </svg>
          </div>
          
          <!-- 休日出勤申請: 承認済み -->
          <div v-else-if="day.holidayWorkApplicationStatus === 'APPROVED'" class="check-icon clickable-icon" @click="openApplicationDialogWithType(day)" title="承認済み">
            <svg style="width: 17px; height: 17px;">
              <line x1="2" y1="8" x2="7" y2="13" stroke="rgb(255, 255, 255)" stroke-width="2" />
              <line x1="7" y1="13" x2="15" y2="4" stroke="rgb(255, 255, 255)" stroke-width="2" />
            </svg>
          </div>
          
          <!-- 休暇申請: 申請中 -->
          <div v-else-if="day.vacationApplicationStatus === 'PENDING'" class="pending-icon clickable-icon" @click="openApplicationDialogWithType(day)" title="承認待ち">
            <svg style="width: 17px; height: 17px;" viewBox="0 0 17 17">
              <line x1="8.5" y1="3" x2="8.5" y2="12" stroke="rgb(25, 158, 214)" stroke-width="2" stroke-linecap="square"/>
              <path d="M 8.5 3 L 3 8 L 14 8 Z" fill="none" stroke="rgb(25, 158, 214)" stroke-width="2" stroke-linejoin="miter"/>
            </svg>
          </div>
          
          <!-- 休暇申請: 承認済み -->
          <div v-else-if="day.vacationApplicationStatus === 'APPROVED'" class="check-icon clickable-icon" @click="openApplicationDialogWithType(day)" title="承認済み">
            <svg style="width: 17px; height: 17px;">
              <line x1="2" y1="8" x2="7" y2="13" stroke="rgb(255, 255, 255)" stroke-width="2" />
              <line x1="7" y1="13" x2="15" y2="4" stroke="rgb(255, 255, 255)" stroke-width="2" />
            </svg>
          </div>
          
          <!-- 未申請: +マーク -->
          <button v-else class="plus-button" @click="openApplicationDialog(day)" title="勤怠関連申請">
            <div class="plus-icon-circle">
              <div class="plus-icon-vertical"></div>
              <div class="plus-icon-horizontal"></div>
            </div>
          </button>
      </div>
      
      <!-- 出社時刻 -->
      <div v-if="!day.hasVacation" class="cell-clock-in" :class="{ 'no-interaction': isHolidayOrWeekend(day), 'no-highlight': day.approvalStatus === 'PENDING' }">
        <!-- テキストボックス表示（未申請または却下の場合） -->
        <input 
          v-if="isEditableStatus(day)"
          type="text"
          :value="day.clockIn || ''"
          :class="['time-input-cell', day.clockInType === 'MANUAL' ? 'manual-bg' : '']"
          readonly
          @click="!isHolidayOrWeekend(day) && openAttendanceInputDialog(day, 'clockIn')"
        />
        <!-- テキストのみ表示（申請中または承認済みの場合） -->
        <span 
          v-else
          :class="['time-text', { 'clickable-cell': !isHolidayOrWeekend(day), 'no-highlight': day.approvalStatus === 'PENDING' }, day.clockInType === 'MANUAL' ? 'manual-bg' : '']"
          @click="!isHolidayOrWeekend(day) && openAttendanceInputDialog(day, 'clockIn')"
        >
          {{ day.clockIn || '' }}
        </span>
      </div>
      
      <!-- 退社時刻 -->
      <div v-if="!day.hasVacation" class="cell-clock-out" :class="{ 'no-interaction': isHolidayOrWeekend(day), 'no-highlight': day.approvalStatus === 'PENDING' }">
        <!-- テキストボックス表示（未申請または却下の場合） -->
        <input 
          v-if="isEditableStatus(day)"
          type="text"
          :value="day.clockOut || ''"
          :class="['time-input-cell', day.clockOutType === 'MANUAL' ? 'manual-bg' : '']"
          readonly
          @click="!isHolidayOrWeekend(day) && openAttendanceInputDialog(day, 'clockOut')"
        />
        <!-- テキストのみ表示（申請中または承認済みの場合） -->
        <span 
          v-else
          :class="['time-text', { 'clickable-cell': !isHolidayOrWeekend(day), 'no-highlight': day.approvalStatus === 'PENDING' }, day.clockOutType === 'MANUAL' ? 'manual-bg' : '']"
          @click="!isHolidayOrWeekend(day) && openAttendanceInputDialog(day, 'clockOut')"
        >
          {{ day.clockOut || '' }}
        </span>
      </div>
      
      <!-- 勤務場所 -->
      <div v-if="!day.hasVacation" class="cell-location" :class="{ 'no-interaction': isHolidayOrWeekend(day), 'no-highlight': day.approvalStatus === 'PENDING' }">
        <!-- テキストボックス表示（未申請または却下の場合） -->
        <input 
          v-if="isEditableStatus(day)"
          type="text"
          :value="day.location || ''"
          class="location-input-cell"
          readonly
          @click="!isHolidayOrWeekend(day) && openAttendanceInputDialog(day, 'location')"
        />
        <!-- テキストのみ表示（申請中または承認済みの場合） -->
        <span 
          v-else
          :class="['location-text', { 'clickable-cell': !isHolidayOrWeekend(day), 'no-highlight': day.approvalStatus === 'PENDING' }]"
          @click="!isHolidayOrWeekend(day) && openAttendanceInputDialog(day, 'location')"
        >
          {{ day.location || '' }}
        </span>
      </div>
      
      <!-- 工数 -->
      <div class="cell-work-hours">
        <a v-if="day.workHours" href="#" @click.prevent="openWorkHours(day)" class="work-hours-link">
          {{ day.workHours }}
        </a>
        <template v-else>
          <span v-if="day.hasWorkHoursError" class="work-hours-error" title="実労働時間と工数の合計が一致しません">!</span>
          <button v-if="!isHolidayOrWeekend(day) && !day.hasVacation" class="plus-button" @click="openWorkHours(day)" title="工数実績入力">
            <div class="plus-icon-circle">
              <div class="plus-icon-vertical"></div>
              <div class="plus-icon-horizontal"></div>
            </div>
          </button>
        </template>
      </div>
      
      <!-- 勤務グラフ -->
      <div class="cell-graph">
        <!-- 時間軸の罫線 -->
        <div class="time-axis-lines">
          <!-- 0時の罫線 -->
          <div class="time-line time-line-normal" style="left: 0.4%;"></div>
          <!-- 2時の罫線 -->
          <div class="time-line time-line-normal" style="left: 3.73%;"></div>
          <!-- 4時の罫線 -->
          <div class="time-line time-line-normal" style="left: 7.06%;"></div>
          <!-- 6時の罫線 -->
          <div class="time-line time-line-normal" style="left: 10.39%;"></div>
          <!-- 8時の罫線 -->
          <div class="time-line time-line-normal" style="left: 13.72%;"></div>
          <!-- 10時の罫線 -->
          <div class="time-line time-line-normal" style="left: 17.05%;"></div>
          <!-- 12時の罫線 -->
          <div class="time-line time-line-bold" style="left: 20.38%;"></div>
          <!-- 14時の罫線 -->
          <div class="time-line time-line-normal" style="left: 23.71%;"></div>
          <!-- 16時の罫線 -->
          <div class="time-line time-line-normal" style="left: 27.04%;"></div>
          <!-- 18時の罫線 -->
          <div class="time-line time-line-normal" style="left: 30.37%;"></div>
          <!-- 20時の罫線 -->
          <div class="time-line time-line-normal" style="left: 33.7%;"></div>
          <!-- 22時の罫線 -->
          <div class="time-line time-line-normal" style="left: 37.03%;"></div>
          <!-- 24時の罫線 -->
          <div class="time-line time-line-normal" style="left: 40.36%;"></div>
          <!-- 26時の罫線 -->
          <div class="time-line time-line-normal" style="left: 43.69%;"></div>
          <!-- 28時の罫線 -->
          <div class="time-line time-line-normal" style="left: 47.02%;"></div>
          <!-- 30時の罫線 -->
          <div class="time-line time-line-normal" style="left: 50.35%;"></div>
          <!-- 32時の罫線 -->
          <div class="time-line time-line-normal" style="left: 53.68%;"></div>
          <!-- 34時の罫線 -->
          <div class="time-line time-line-normal" style="left: 57.01%;"></div>
          <!-- 36時の罫線 -->
          <div class="time-line time-line-bold" style="left: 60.34%;"></div>
          <!-- 38時の罫線 -->
          <div class="time-line time-line-normal" style="left: 63.67%;"></div>
          <!-- 40時の罫線 -->
          <div class="time-line time-line-normal" style="left: 67%;"></div>
          <!-- 42時の罫線 -->
          <div class="time-line time-line-normal" style="left: 70.33%;"></div>
          <!-- 44時の罫線 -->
          <div class="time-line time-line-normal" style="left: 73.66%;"></div>
          <!-- 46時の罫線 -->
          <div class="time-line time-line-normal" style="left: 76.99%;"></div>
          <!-- 48時の罫線 -->
          <div class="time-line time-line-normal" style="left: 80.3%;"></div>
        </div>
        <!-- 標準勤務時間帯のグレー長方形（平日、または休日出勤申請が承認されている土日祝） -->
        <div 
          v-if="((!day.isHoliday && day.dayOfWeekNum >= 1 && day.dayOfWeekNum <= 5) || day.hasHolidayWorkApplication) && !(day.hasVacation && (day.vacationTypeCode === 'PAID_LEAVE' || day.vacationTypeCode === 'SUBSTITUTE_HOLIDAY'))" 
          class="scheduled-work-time-bar" 
          :style="getScheduledWorkTimeStyle(day)"
          @mouseenter="showGraphTooltip(day, $event)"
          @mouseleave="hideGraphTooltip"
          @mousemove="updateGraphTooltipPosition($event)"
        ></div>
        <!-- 有給休暇または夏季休暇の所定内労働時間帯（薄い青） -->
        <div 
          v-if="day.hasVacation && day.vacationTypeCode === 'PAID_LEAVE'"
          class="scheduled-work-time-bar vacation-work-time-bar" 
          :style="getScheduledWorkTimeStyle(day)"
          @mouseenter="showGraphTooltip(day, $event)"
          @mouseleave="hideGraphTooltip"
          @mousemove="updateGraphTooltipPosition($event)"
        ></div>
        <!-- 代休の所定内労働時間帯（#1A69AB） -->
        <div 
          v-if="day.hasVacation && day.vacationTypeCode === 'SUBSTITUTE_HOLIDAY'"
          class="scheduled-work-time-bar compensatory-work-time-bar" 
          :style="getScheduledWorkTimeStyle(day)"
          @mouseenter="showGraphTooltip(day, $event)"
          @mouseleave="hideGraphTooltip"
          @mousemove="updateGraphTooltipPosition($event)"
        ></div>
        <!-- 有給休暇または夏季休暇の細い白線 -->
        <div 
          v-if="day.hasVacation && day.vacationTypeCode === 'PAID_LEAVE'"
          class="vacation-white-line" 
          :style="getScheduledWorkTimeStyle(day)"
        ></div>
        <!-- 代休の細い白線 -->
        <div 
          v-if="day.hasVacation && day.vacationTypeCode === 'SUBSTITUTE_HOLIDAY'"
          class="vacation-white-line" 
          :style="getScheduledWorkTimeStyle(day)"
        ></div>
        <!-- 休憩時間のグレー長方形（休日出勤申請が申請中または承認済みの場合、代休の場合は表示しない） -->
        <div 
          v-if="day.hasHolidayWorkApplication && day.holidayWorkBreakHours && !(day.hasVacation && day.vacationTypeCode === 'SUBSTITUTE_HOLIDAY')"
          class="scheduled-break-time-bar" 
          :style="getScheduledBreakTimeStyle(day)"
          @mouseenter="showGraphTooltip(day, $event)"
          @mouseleave="hideGraphTooltip"
          @mousemove="updateGraphTooltipPosition($event)"
        ></div>
        <!-- 有給休暇または夏季休暇の休憩時間の長方形 -->
        <div 
          v-if="day.hasVacation && day.vacationTypeCode === 'PAID_LEAVE'"
          class="scheduled-break-time-bar vacation-break-time-bar" 
          :style="getVacationBreakTimeStyle(day)"
          @mouseenter="showGraphTooltip(day, $event)"
          @mouseleave="hideGraphTooltip"
          @mousemove="updateGraphTooltipPosition($event)"
        ></div>
        <!-- グラフバー（出勤・退勤の両方がある場合のみ） -->
        <div v-if="day.clockIn && day.clockOut" class="work-graph">
          <!-- 所定内労働セグメント（ライトブルー） -->
          <div 
            v-if="getGraphSegmentWidth(day, 'scheduled') > 0"
            class="graph-bar graph-bar-scheduled" 
            :style="getGraphSegmentStyle(day, 'scheduled')"
            @mouseenter="showGraphTooltip(day, $event)"
            @mouseleave="hideGraphTooltip"
            @mousemove="updateGraphTooltipPosition($event)"
          ></div>
          <!-- 法定時間内残業セグメント（黄土色） -->
          <div 
            v-if="getGraphSegmentWidth(day, 'withinLegal') > 0"
            class="graph-bar graph-bar-within-legal" 
            :style="getGraphSegmentStyle(day, 'withinLegal')"
            @mouseenter="showGraphTooltip(day, $event)"
            @mouseleave="hideGraphTooltip"
            @mousemove="updateGraphTooltipPosition($event)"
          ></div>
          <!-- 法定時間外残業セグメント（オレンジ色） -->
          <div 
            v-if="getGraphSegmentWidth(day, 'overLegal') > 0"
            class="graph-bar graph-bar-over-legal" 
            :style="getGraphSegmentStyle(day, 'overLegal')"
            @mouseenter="showGraphTooltip(day, $event)"
            @mouseleave="hideGraphTooltip"
            @mousemove="updateGraphTooltipPosition($event)"
          ></div>
        </div>
        <!-- 休憩時間の四角形（複数対応） -->
        <template v-for="(breakTime, index) in day.breakTimes" :key="index">
          <div 
            v-if="shouldShowBreakTime(breakTime, day)"
            class="break-time-bar" 
            :style="{ ...getBreakTimeStyle(breakTime, day), backgroundColor: getBreakTimeColor(breakTime, day) }"
            @mouseenter="showGraphTooltip(day, $event)"
            @mouseleave="hideGraphTooltip"
            @mousemove="updateGraphTooltipPosition($event)"
          ></div>
        </template>
        <!-- 出勤時刻の▼マーク（長方形の左上の角） -->
        <div v-if="day.clockIn" class="clock-marker clock-in-marker" :style="getClockInMarkerStyle(day)">
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L0 0H8L4 6Z" fill="rgb(75, 158, 228)"/>
          </svg>
        </div>
        <!-- 退勤時刻の▼マーク（長方形の右上の角） -->
        <div v-if="day.clockOut" class="clock-marker clock-out-marker" :style="getClockOutMarkerStyle(day)">
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L0 0H8L4 6Z" fill="rgb(75, 158, 228)"/>
          </svg>
        </div>
        <!-- 有給休暇または夏季休暇のオレンジ色のアイコン（グラフの左端） -->
        <div v-if="day.hasVacation && day.vacationTypeCode === 'PAID_LEAVE'" class="vacation-application-marker" :style="getVacationApplicationMarkerStyle(day)">
          <svg width="17" height="17" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg">
            <!-- 吹き出しの本体（明るいオレンジ色） -->
            <path d="M 8.5 1 Q 12 1 12 4.5 L 12 8.5 Q 12 12 8.5 12 Q 5 12 5 8.5 L 5 4.5 Q 5 1 8.5 1 Z" fill="rgb(255, 183, 77)"/>
            <!-- ポインタ（下部の矢印） -->
            <path d="M 8.5 12 L 6 15 L 11 15 Z" fill="rgb(255, 183, 77)"/>
            <!-- 中心のOシンボル（白） -->
            <circle cx="8.5" cy="6.5" r="2.5" fill="none" stroke="rgb(255, 255, 255)" stroke-width="1.5"/>
          </svg>
        </div>
        <!-- 休日出勤申請の緑の↑マーク（グラフ内） -->
        <div v-if="day.hasHolidayWorkApplication" class="holiday-work-application-marker" :style="getHolidayWorkApplicationMarkerStyle(day)">
          <svg width="10" height="10" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8.5" cy="8.5" r="8" fill="rgb(76, 175, 80)"/>
            <line x1="8.5" y1="3" x2="8.5" y2="12" stroke="rgb(255, 255, 255)" stroke-width="2" stroke-linecap="square"/>
            <path d="M 8.5 3 L 3 8 L 14 8 Z" fill="rgb(255, 255, 255)" stroke="rgb(255, 255, 255)" stroke-width="2" stroke-linejoin="miter"/>
          </svg>
        </div>
      </div>
      
      <!-- グラフツールチップ -->
      <div 
        v-if="showTooltip && tooltipDay === day"
        ref="graphTooltip"
        class="graph-tooltip"
        :style="tooltipStyle"
      >
        <div class="tooltip-content">
          <!-- 見出し: 標準の勤務時間 -->
          <div class="tooltip-header">
            <span class="tooltip-icon tooltip-icon-gray">■</span>
            <span class="tooltip-header-text">標準の勤務時間</span>
          </div>
          
          <!-- 標準勤務時間 -->
          <div class="tooltip-row">
            <span class="tooltip-icon tooltip-icon-gray">■</span>
            <span class="tooltip-label">標準勤務時間</span>
            <span class="tooltip-value">{{ getTooltipScheduledWorkTime(day) }}</span>
          </div>
          
          <!-- 所定休憩時間 -->
          <div class="tooltip-row">
            <span class="tooltip-icon tooltip-icon-gray">■</span>
            <span class="tooltip-label">所定休憩時間</span>
            <span class="tooltip-value">{{ getTooltipScheduledBreakTime(day) }}</span>
          </div>
          
          <!-- 休暇の場合の表示 -->
          <template v-if="day.hasVacation">
            <!-- 総労働時間（休暇時のみ） -->
            <div class="tooltip-row">
              <span class="tooltip-icon tooltip-icon-gray">■</span>
              <span class="tooltip-label">総労働時間</span>
              <span class="tooltip-value">{{ getTooltipTotalWorkTimeForVacation(day) }}</span>
            </div>
          </template>
          
          <!-- 通常勤務の場合の表示 -->
          <template v-else-if="day.clockIn && day.clockOut">
            <!-- 区切り線 -->
            <div class="tooltip-divider"></div>
            
            <!-- 出退社時刻 -->
            <div class="tooltip-row">
              <span class="tooltip-label">出退社時刻</span>
              <span class="tooltip-value">{{ day.clockIn }}-{{ day.clockOut }}</span>
            </div>
            
            <!-- 休憩時間 -->
            <div v-if="day.breakTimes && day.breakTimes.length > 0" class="tooltip-row">
              <span class="tooltip-label">休憩時間</span>
              <span class="tooltip-value">{{ getTooltipBreakTimes(day) }}</span>
            </div>
            
            <!-- 総労働時間 -->
            <div class="tooltip-row">
              <span class="tooltip-label">総労働時間</span>
              <span class="tooltip-value">{{ getTooltipTotalWorkTime(day) }}</span>
            </div>
            
            <!-- 実労働時間 -->
            <div v-if="day.actualWorkHours" class="tooltip-row">
              <span class="tooltip-label">実労働時間</span>
              <span class="tooltip-value">{{ formatHoursToHMM(day.actualWorkHours) }}</span>
            </div>
            
            <!-- 休憩時間合計 -->
            <div v-if="day.breakTimes && day.breakTimes.length > 0" class="tooltip-row">
              <span class="tooltip-icon tooltip-icon-blue">■</span>
              <span class="tooltip-label">休憩時間合計</span>
              <span class="tooltip-value">{{ getTooltipTotalBreakTime(day) }}</span>
            </div>
            
            <!-- 所定内労働（月の所定労働時間の残りまで） -->
            <div v-if="shouldShowScheduledWorkHours(day)" class="tooltip-row">
              <span class="tooltip-icon tooltip-icon-light-blue">■</span>
              <span class="tooltip-label">所定内労働</span>
              <span class="tooltip-value">{{ getTooltipScheduledWorkHours(day) }}</span>
            </div>
            
            <!-- 法定時間内残業（月次累積） -->
            <div v-if="shouldShowMonthlyWithinLegalOvertime(day)" class="tooltip-row">
              <span class="tooltip-icon tooltip-icon-yellow">■</span>
              <span class="tooltip-label">法定時間内残業</span>
              <span class="tooltip-value">{{ getMonthlyWithinLegalOvertime(day) }}</span>
            </div>
            
            <!-- 法定時間外残業（月次累積） -->
            <div v-if="shouldShowMonthlyOverLegalOvertime(day)" class="tooltip-row">
              <span class="tooltip-icon tooltip-icon-orange">■</span>
              <span class="tooltip-label">法定時間外残業</span>
              <span class="tooltip-value">{{ getMonthlyOverLegalOvertime(day) }}</span>
            </div>
            
          </template>
        </div>
      </div>
      
      <!-- 備考 -->
      <div class="cell-remarks">
        <button class="plus-button" @click="openRemarks(day)" title="備考入力">
          <div class="plus-icon-circle">
            <div class="plus-icon-vertical"></div>
            <div class="plus-icon-horizontal"></div>
          </div>
        </button>
        <div v-if="day.remarkText && day.remarkText.trim() !== ''" class="remarks-text" @click="openRemarks(day)" :title="day.remarkText">
          {{ day.remarkText.length > 20 ? day.remarkText.substring(0, 20) + '...' : day.remarkText }}
        </div>
      </div>
    </div>
    
    <!-- 時間軸行（下） -->
    <div class="table-header time-axis-bottom">
      <div class="header-graph">
        <span class="time-label" style="left: 0.4%;">0</span>
        <span class="time-label" style="left: 2.065%;">1</span>
        <span class="time-label" style="left: 3.73%;">2</span>
        <span class="time-label" style="left: 5.395%;">3</span>
        <span class="time-label" style="left: 7.06%;">4</span>
        <span class="time-label" style="left: 8.725%;">5</span>
        <span class="time-label" style="left: 10.39%;">6</span>
        <span class="time-label" style="left: 12.055%;">7</span>
        <span class="time-label" style="left: 13.72%;">8</span>
        <span class="time-label" style="left: 15.385%;">9</span>
        <span class="time-label" style="left: 17.05%;">10</span>
        <span class="time-label" style="left: 18.715%;">11</span>
        <span class="time-label" style="left: 20.38%;">12</span>
        <span class="time-label" style="left: 22.045%;">13</span>
        <span class="time-label" style="left: 23.71%;">14</span>
        <span class="time-label" style="left: 25.375%;">15</span>
        <span class="time-label" style="left: 27.04%;">16</span>
        <span class="time-label" style="left: 28.705%;">17</span>
        <span class="time-label" style="left: 30.37%;">18</span>
        <span class="time-label" style="left: 32.035%;">19</span>
        <span class="time-label" style="left: 33.7%;">20</span>
        <span class="time-label" style="left: 35.365%;">21</span>
        <span class="time-label" style="left: 37.03%;">22</span>
        <span class="time-label" style="left: 38.695%;">23</span>
        <span class="time-label" style="left: 40.36%;">24</span>
        <span class="time-label" style="left: 42.025%;">25</span>
        <span class="time-label" style="left: 43.69%;">26</span>
        <span class="time-label" style="left: 45.355%;">27</span>
        <span class="time-label" style="left: 47.02%;">28</span>
        <span class="time-label" style="left: 48.685%;">29</span>
        <span class="time-label" style="left: 50.35%;">30</span>
        <span class="time-label" style="left: 52.015%;">31</span>
        <span class="time-label" style="left: 53.68%;">32</span>
        <span class="time-label" style="left: 55.345%;">33</span>
        <span class="time-label" style="left: 57.01%;">34</span>
        <span class="time-label" style="left: 58.675%;">35</span>
        <span class="time-label" style="left: 60.34%;">36</span>
        <span class="time-label" style="left: 62.005%;">37</span>
        <span class="time-label" style="left: 63.67%;">38</span>
        <span class="time-label" style="left: 65.335%;">39</span>
        <span class="time-label" style="left: 67%;">40</span>
        <span class="time-label" style="left: 68.665%;">41</span>
        <span class="time-label" style="left: 70.33%;">42</span>
        <span class="time-label" style="left: 71.995%;">43</span>
        <span class="time-label" style="left: 73.66%;">44</span>
        <span class="time-label" style="left: 75.325%;">45</span>
        <span class="time-label" style="left: 76.99%;">46</span>
        <span class="time-label" style="left: 78.645%;">47</span>
        <span class="time-label" style="left: 80.3%;">48</span>
      </div>
    </div>
  </div>
  
  <!-- テーブル右下のリンクとボタン -->
  <div class="table-bottom-links">
    <a href="#" @click.prevent="showNotice" class="info-link">お知らせ</a>
    <a href="#" @click.prevent="showMonthlySummary" class="info-link">月次サマリー</a>
    <button @click="showApprovalRequest" class="approval-request-button">承認申請</button>
  </div>
  
  <!-- 勤怠関連申請ダイアログ -->
  <AttendanceApplicationDialog
    v-if="selectedDayForApplication"
    :visible="showApplicationDialog"
    :target-date="selectedDayForApplication.date"
    :employee-id="employeeId"
    :initial-application-type="selectedApplicationType"
    :initial-application-status="selectedApplicationStatus"
    @close="closeApplicationDialog"
    @application-submitted="handleApplicationSubmitted"
  />
  
  <!-- 勤怠情報入力ダイアログ -->
  <AttendanceInputDialog
    v-if="selectedDayForInput"
    :visible="showInputDialog"
    :target-date="selectedDayForInput.date"
    :employee-id="employeeId"
    :initial-focus="inputDialogFocus"
    :approval-status="selectedDayForInput.approvalStatus"
    :initial-data="{
      clockIn: selectedDayForInput.clockIn || '',
      clockOut: selectedDayForInput.clockOut || '',
      location: selectedDayForInput.location || ''
    }"
    @close="closeInputDialog"
    @updated="handleInputUpdated"
  />
  
  <!-- 工数実績入力ダイアログ -->
  <WorkHoursInputDialog
    v-if="selectedDayForWorkHours"
    :visible="showWorkHoursDialog"
    :employee-id="employeeId"
    :work-date="selectedDayForWorkHours.date"
    :actual-work-hours="parseFloat(selectedDayForWorkHours.actualWorkHours) || 0"
    :is-work-hours-confirmed="selectedDayForWorkHours.approvalStatus === 'APPROVED' || (selectedDayForWorkHours.clockIn && selectedDayForWorkHours.clockOut)"
    :attendance-id="selectedDayForWorkHours.attendanceId"
    @update:visible="showWorkHoursDialog = $event"
    @registered="handleWorkHoursRegistered"
    @cancel="closeWorkHoursDialog"
  />
  
  <!-- 認証エラーダイアログ（モーダル） -->
  <div v-if="showAuthErrorDialog" class="auth-error-dialog-overlay">
    <div class="auth-error-dialog-container">
      <!-- 外枠 -->
      <svg class="auth-error-dialog-border">
        <path d="M 6.900000095367432 0 L 545.0999755859375 0 C 548.9107403755188 0 552 2.0684441943990635 552 4.619999653072829 L 552 226.3799986122913 C 552 228.93155407096506 548.9107403755188 231 545.0999755859375 231 L 6.900000095367432 231 C 3.089235305786133 231 0 228.93155407096506 0 226.3799986122913 L 0 4.619999653072829 C 0 2.0684441943990635 3.089235305786133 0 6.900000095367432 0 Z" 
              fill="rgb(255, 255, 255)" 
              stroke="rgb(204, 204, 204)" 
              stroke-width="2" />
      </svg>
      
      <!-- ヘッダー背景 -->
      <svg class="auth-error-dialog-header-bg">
        <path d="M 6.8999999999999995 0 L 545.0999999999999 0 C 548.9107648801803 0 552 2.430454131535121 552 5.428571428571428 L 552 32.57142857142857 C 552 35.56954586846488 548.9107648801803 38 545.0999999999999 38 L 6.8999999999999995 38 C 3.089235119819641 38 0 35.56954586846488 0 32.57142857142857 L 0 5.428571428571428 C 0 2.430454131535121 3.089235119819641 0 6.8999999999999995 0 Z" 
              fill="rgb(215, 235, 255)" />
      </svg>
      
      <!-- タイトル -->
      <span class="auth-error-dialog-title">確認</span>
      
      <!-- ×閉じるボタン（認証エラー時は表示しない） -->
      
      <!-- メッセージ -->
      <div class="auth-error-dialog-message">
        再度ログインしてください
      </div>
      
      <!-- OKボタン背景 -->
      <div class="auth-error-dialog-ok-bg" @click="redirectToLogin"></div>
      
      <!-- OKボタンテキスト -->
      <span class="auth-error-dialog-ok-text" @click="redirectToLogin">OK</span>
    </div>
  </div>
  
  <!-- 確認ダイアログ（日次確定申請用） -->
  <div v-if="showConfirmDialog" class="confirm-dialog-overlay" @click.self="closeConfirmDialog">
    <div class="confirm-dialog-container">
      <div class="confirm-dialog-header">
        <span class="confirm-dialog-title">確認</span>
      </div>
      <div class="confirm-dialog-body">
        <p class="confirm-dialog-message">{{ confirmDialogMessage }}</p>
      </div>
      <div class="confirm-dialog-footer">
        <button class="confirm-dialog-ok-button" @click="handleConfirmDialogOk">OK</button>
        <button class="confirm-dialog-cancel-button" @click="closeConfirmDialog">キャンセル</button>
      </div>
    </div>
  </div>
  
  <!-- エラーダイアログ（日次確定申請チェック用） -->
  <div v-if="showErrorCheckDialog" class="error-check-dialog-overlay" @click.self="closeErrorCheckDialog">
    <div class="error-check-dialog-container">
      <div class="error-check-dialog-header">
        <span class="error-check-dialog-title">確認</span>
      </div>
      <div class="error-check-dialog-body">
        <p class="error-check-dialog-message">{{ errorCheckDialogMessage }}</p>
      </div>
      <div class="error-check-dialog-footer">
        <button class="error-check-dialog-ok-button" @click="closeErrorCheckDialog">OK</button>
      </div>
    </div>
  </div>
  
  <!-- 備考ダイアログ（モーダル） -->
  <div v-if="showRemarksDialog" class="remarks-dialog-overlay">
    <div class="remarks-dialog-container">
      <!-- 外枠 -->
      <svg class="remarks-dialog-border">
        <path d="M 6.900000095367432 0 L 545.0999755859375 0 C 548.9107403755188 0 552 2.0684441943990635 552 4.619999653072829 L 552 236.3799986122913 C 552 238.93155407096506 548.9107403755188 241 545.0999755859375 241 L 6.900000095367432 241 C 3.089235305786133 241 0 238.93155407096506 0 236.3799986122913 L 0 4.619999653072829 C 0 2.0684441943990635 3.089235305786133 0 6.900000095367432 0 Z" 
              fill="rgb(255, 255, 255)" 
              stroke="rgb(204, 204, 204)" 
              stroke-width="2" />
      </svg>
      
      <!-- ヘッダー背景 -->
      <svg class="remarks-dialog-header-bg">
        <path d="M 6.8999999999999995 0 L 545.0999999999999 0 C 548.9107648801803 0 552 2.430454131535121 552 5.428571428571428 L 552 32.57142857142857 C 552 35.56954586846488 548.9107648801803 38 545.0999999999999 38 L 6.8999999999999995 38 C 3.089235119819641 38 0 35.56954586846488 0 32.57142857142857 L 0 5.428571428571428 C 0 2.430454131535121 3.089235119819641 0 6.8999999999999995 0 Z" 
              fill="rgb(215, 235, 255)" />
      </svg>
      
      <!-- 備考タイトル -->
      <span class="remarks-dialog-title">備考</span>
      
      <!-- ×閉じるボタン -->
      <span class="remarks-dialog-close" @click="closeRemarksDialog">×</span>
      
      <!-- 日付表示 -->
      <span class="remarks-dialog-date">{{ formatDateForDialog(selectedDayForRemarks) }}</span>
      
      <!-- 打刻漏れ・手入力修正情報（黄色背景） -->
      <div v-if="remarksInfoText" class="remarks-info-banner">
        {{ remarksInfoText }}
      </div>
      
      <!-- テキストボックス背景 -->
      <svg class="remarks-dialog-textbox-bg" :style="{ top: textboxTop + 'px' }">
        <path d="M 4.133333333333333 0 L 491.8666666666667 0 C 494.1494436634911 0 496 1.1864453931649526 496 2.65 L 496 103.35 C 496 104.81355460683504 494.1494436634911 106 491.8666666666667 106 L 4.133333333333333 106 C 1.8505563365088564 106 0 104.81355460683504 0 103.35 L 0 2.65 C 0 1.1864453931649526 1.8505563365088564 0 4.133333333333333 0 Z" 
              fill="rgb(255, 255, 255)" 
              stroke="rgb(153, 153, 153)" 
              stroke-width="1" />
      </svg>
      
      <!-- テキスト入力エリア -->
      <textarea 
        v-model="remarkText" 
        class="remarks-dialog-textarea"
        :style="{ top: textareaTop + 'px' }"
        :disabled="!canEditRemarks"
        :class="{ 'remarks-textarea-disabled': !canEditRemarks }"
      ></textarea>
      
      <!-- 登録ボタン背景 -->
      <div v-if="canEditRemarks" class="remarks-dialog-register-bg" @click="saveRemarks"></div>
      
      <!-- 登録ボタンテキスト -->
      <span v-if="canEditRemarks" class="remarks-dialog-register-text" @click="saveRemarks">登録</span>
      
      <!-- キャンセルボタン -->
      <span v-if="canEditRemarks" class="remarks-dialog-cancel" @click="closeRemarksDialog">キャンセル</span>
      
      <!-- 閉じるボタン（申請済み時のみ） -->
      <span v-if="!canEditRemarks" class="remarks-dialog-close-button" @click="closeRemarksDialog">閉じる</span>
    </div>
  </div>
  
  <!-- Bottom: 月次サマリー情報 -->
    <div class="bottom-summary">
      <!-- Group 6 (左側) -->
      <div class="summary-group-left">
        <!-- 背景 -->
        <div class="summary-background-left"></div>
        
        <!-- 所定出勤日数 -->
        <span class="summary-label-left" style="top: 4px;">所定出勤日数</span>
        
        <!-- 実出勤日数 -->
        <span class="summary-label-left" style="top: 23px;">実出勤日数</span>
        
        <!-- 所定労働時間 -->
        <span class="summary-label-left" style="top: 43px;">所定労働時間</span>
        
        <!-- 総労働時間 -->
        <span class="summary-label-left" style="top: 63px;">総労働時間</span>
        
        <!-- 縦線 -->
        <div class="summary-divider-left"></div>
        
        <!-- 所定出勤日数 -->
        <span v-if="monthlySummary" class="summary-value-left" style="top: 4px; right: 14px;">{{ monthlySummary.scheduledWorkDays }}日</span>
        
        <!-- 実出勤日数 -->
        <span v-if="monthlySummary" class="summary-value-left" style="top: 23px; right: 14px;">{{ monthlySummary.actualWorkDays }}日</span>
        
        <!-- 所定労働時間 -->
        <span v-if="monthlySummary" class="summary-value-left" style="top: 46px; right: 14px;">{{ monthlySummary.scheduledWorkHours }}</span>
        
        <!-- 総労働時間 -->
        <span v-if="monthlySummary" class="summary-value-left" style="top: 66px; right: 14px;">{{ monthlySummary.totalWorkHours }}</span>
      </div>
      
      <!-- Group 7 (右側) -->
      <div class="summary-group-right">
        <!-- 背景 -->
        <div class="summary-background-right"></div>
        
        <!-- 過不足時間 (MM/DDまで) -->
        <span v-if="monthlySummary" class="summary-label-right" style="top: 4px;">過不足時間 ({{ monthlySummary.cutoffDate }}まで)</span>
        <span v-else class="summary-label-right" style="top: 4px;">過不足時間</span>
        
        <!-- 法定休日労働 -->
        <span class="summary-label-right" style="top: 24px;">法定休日労働</span>
        
        <!-- 法定時間内残業 -->
        <span class="summary-label-right" style="top: 44px;">法定時間内残業</span>
        
        <!-- 法定時間外残業 -->
        <span class="summary-label-right" style="top: 65px;">法定時間外残業</span>
        
        <!-- 縦線 -->
        <div class="summary-divider-right"></div>
        
        <!-- 過不足時間 -->
        <span v-if="monthlySummary" class="summary-value-right" style="top: 6px; right: 14px;">{{ monthlySummary.overUnderTime }}</span>
        
        <!-- 法定休日労働 -->
        <span v-if="monthlySummary" class="summary-value-right" style="top: 25px; right: 14px;">{{ monthlySummary.legalHolidayWork }}</span>
        
        <!-- 法定時間内残業 -->
        <span v-if="monthlySummary" class="summary-value-right" style="top: 46px; right: 14px;">{{ monthlySummary.withinLegalOvertime }}</span>
        
        <!-- 法定時間外残業 -->
        <span v-if="monthlySummary" class="summary-value-right" style="top: 67px; right: 14px;">{{ monthlySummary.overLegalOvertime }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AttendanceApplicationDialog from '@/components/dialog/AttendanceApplicationDialog.vue'
import AttendanceInputDialog from '@/components/dialog/AttendanceInputDialog.vue'
import WorkHoursInputDialog from '@/components/dialog/WorkHoursInputDialog.vue'
import HolidayJp from '@holiday-jp/holiday_jp'
import { getMonthlyAttendance, getEmployeeInfo, submitDailyConfirmation, updateAttendanceRecord, getDailyAttendance, getWorkHours } from '@/services/api'

export default {
  name: 'TimesheetScreen',
  components: {
    AppHeader,
    AttendanceApplicationDialog,
    AttendanceInputDialog,
    WorkHoursInputDialog
  },
  data() {
    return {
      currentPage: 'timesheet',
      selectedYearMonth: '',
      yearMonthOptions: [],
      attendanceData: [],
      monthlySummary: null,
      employeeInfo: null,
      employeeId: null, // ログイン中の従業員ID
      loading: false,
      error: null,
      // 備考ダイアログ関連
      showRemarksDialog: false,
      selectedDayForRemarks: null,
      remarkText: '',
      currentRemarksApprovalStatus: null,
      remarksInfoText: '', // 打刻漏れ・手入力修正の情報
      remarksApiRecord: null, // APIから取得した勤怠データ
      // 認証エラーダイアログ関連
      showAuthErrorDialog: false,
      // 勤怠関連申請ダイアログ関連
      showApplicationDialog: false,
      selectedDayForApplication: null,
      selectedApplicationType: null, // 初期表示時に開く申請タイプ
      selectedApplicationStatus: null, // 初期表示時の申請状態
      // 勤怠情報入力ダイアログ関連
      showInputDialog: false,
      selectedDayForInput: null,
      inputDialogFocus: 'clockIn',
      // 工数実績入力ダイアログ関連
      // 確認ダイアログ関連（日次確定申請用）
      showConfirmDialog: false,
      confirmDialogMessage: '',
      pendingDailyConfirmation: null, // 確認ダイアログでOKが押された場合の処理用
      // エラーチェックダイアログ関連（日次確定申請チェック用）
      showErrorCheckDialog: false,
      errorCheckDialogMessage: '',
      showWorkHoursDialog: false,
      selectedDayForWorkHours: null,
      // 月次承認状態
      monthlyApprovalStatus: 'NOT_SUBMITTED', // NOT_SUBMITTED/PENDING/APPROVED/REJECTED
      // グラフツールチップ関連
      showTooltip: false,
      tooltipDay: null,
      tooltipStyle: {
        top: '0px',
        left: '0px'
      }
    }
  },
  computed: {
    // 備考の編集可否を判定
    canEditRemarks() {
      return this.currentRemarksApprovalStatus === 'NOT_SUBMITTED' || 
             this.currentRemarksApprovalStatus === 'REJECTED' ||
             !this.currentRemarksApprovalStatus
    },
    
    // テキストボックスの位置を動的に計算（黄色背景バナーがある場合は下に、ない場合は上に）
    textboxTop() {
      return this.remarksInfoText ? 95 : 78
    },
    
    // テキストエリアの位置を動的に計算（黄色背景バナーがある場合は下に、ない場合は上に）
    textareaTop() {
      return this.remarksInfoText ? 97 : 80
    },
    // ステータスアイコンを取得
    statusIcon() {
      switch (this.monthlyApprovalStatus) {
        case 'PENDING':
          return '↑'
        case 'APPROVED':
          return '✓'
        case 'NOT_SUBMITTED':
        default:
          return '-'
      }
    },
    // ステータステキストを取得
    statusText() {
      switch (this.monthlyApprovalStatus) {
        case 'PENDING':
          return '承認中'
        case 'APPROVED':
          return '承認済み'
        case 'NOT_SUBMITTED':
        default:
          return '未確定'
      }
    }
  },
  // ルート変更時の処理（画面遷移時にデータを再取得）
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 従業員IDを設定
      vm.employeeId = to.query.employeeId || 
                      localStorage.getItem('employeeId') || 
                      '000001'
      
      // localStorageに保存（次回アクセス用）
      if (vm.employeeId) {
        localStorage.setItem('employeeId', vm.employeeId)
      }
      
      vm.initializeYearMonthOptions()
      vm.initializeScreen()
    })
  },
  
  // 同じルート内でパラメータが変更された場合の処理
  beforeRouteUpdate(to, from, next) {
    // 従業員IDが変更された場合は再初期化
    const newEmployeeId = to.query.employeeId || 
                          localStorage.getItem('employeeId') || 
                          '000001'
    
    if (newEmployeeId !== this.employeeId) {
      this.employeeId = newEmployeeId
      if (this.employeeId) {
        localStorage.setItem('employeeId', this.employeeId)
      }
      this.initializeYearMonthOptions()
      this.initializeScreen()
    }
    
    next()
  },
  
  watch: {
    // ルート変更を監視して、勤務表画面に遷移した時にデータを再取得
    '$route'(to, from) {
      // 勤務表画面に遷移した場合、データを再取得して、ホーム画面で打刻したデータを反映する
      if (to.name === 'Timesheet') {
        // 従業員IDと年月が設定されている場合のみデータを再取得
        if (this.employeeId && this.selectedYearMonth) {
          this.loadAttendanceData()
        }
      }
    }
  },
  
  mounted() {
    // 既にbeforeRouteEnterで初期化されている場合はスキップ
    // ただし、直接URLでアクセスした場合は初期化が必要
    if (!this.employeeId) {
      this.employeeId = this.$route.query.employeeId || 
                        localStorage.getItem('employeeId') || 
                        '000001'
      
      if (this.employeeId) {
        localStorage.setItem('employeeId', this.employeeId)
      }
      
      this.initializeYearMonthOptions()
      this.initializeScreen()
    }
  },
  
  // keep-aliveが有効な場合、画面がアクティブになった時にデータを再取得
  activated() {
    // 勤務表画面がアクティブになった時にデータを再取得
    // ホーム画面で打刻した後、勤務表画面に戻ってきた時に最新データを表示
    if (this.employeeId && this.selectedYearMonth) {
      this.loadAttendanceData()
    }
  },
  methods: {
    handleMenuClick(menuId) {
      this.currentPage = menuId
    },
    
    // 年月選択肢の初期化
    initializeYearMonthOptions() {
      const options = []
      const today = new Date()
      const currentYear = today.getFullYear()
      const currentMonth = today.getMonth() + 1
      
      // 2ヶ月先の年月から降順で24ヶ月分の選択肢を生成
      // 2ヶ月先（+2）から過去に23ヶ月分（合計24ヶ月分）
      for (let i = 2; i >= -21; i--) {
        const date = new Date(currentYear, currentMonth - 1 + i, 1)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const value = `${year}-${String(month).padStart(2, '0')}`
        const label = `${year}年${String(month).padStart(2, '0')}月`
        options.push({ value, label })
      }
      
      this.yearMonthOptions = options
      this.selectedYearMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}`
    },
    
    // 初期表示処理
    async initializeScreen() {
      try {
        this.loading = true
        this.error = null

        // 従業員情報取得
        try {
          const response = await getEmployeeInfo(this.employeeId)
          if (response.success && response.employee) {
            this.employeeInfo = response.employee
          } else {
            // 従業員情報が取得できない場合は認証エラーダイアログを表示
            this.showAuthErrorDialogFunc()
            return
          }
        } catch (error) {
          console.error('従業員情報取得エラー:', error)
          // エラー時は認証エラーダイアログを表示
          this.showAuthErrorDialogFunc()
          return
        }

        // 月間勤務データ取得
        await this.loadAttendanceData()
      } catch (error) {
        console.error('初期表示エラー:', error)
        this.error = error.message || 'データの取得に失敗しました'
      } finally {
        this.loading = false
      }
    },

    // 月間勤務データ取得
    async loadAttendanceData() {
      try {
        const [year, month] = this.selectedYearMonth.split('-').map(Number)
        const response = await getMonthlyAttendance(this.employeeId, year, month)

        if (response.success) {
          // APIレスポンスをフロントエンド用のデータ形式に変換
          const newData = this.convertApiDataToDisplayData(response.dailyData, year, month)
          // Vueのリアクティビティを確実にするため、配列を再作成
          this.attendanceData = [...newData]
          this.monthlySummary = response.monthlySummary
        } else {
          throw new Error(response.message || 'データの取得に失敗しました')
        }
      } catch (error) {
        console.error('月間勤務データ取得エラー:', error)
        // 認証エラー（401）の場合は認証エラーダイアログを表示
        if (error.status === 401 || error.message?.includes('認証') || error.message?.includes('ログイン')) {
          this.showAuthErrorDialogFunc()
          return
        }
        // その他のエラー時は既存データを保持（サンプルデータで上書きしない）
        // ただし、既存データがない場合のみサンプルデータを読み込む
        if (!this.attendanceData || this.attendanceData.length === 0) {
          this.loadSampleData()
        }
      }
    },

    // APIレスポンスをフロントエンド用のデータ形式に変換
    convertApiDataToDisplayData(apiData, year, month) {
      const displayData = []
      const daysInMonth = new Date(year, month, 0).getDate()

      // 月の全日付分のデータを生成
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const date = new Date(year, month - 1, day)
        const dayOfWeek = date.getDay()
        const dayNames = ['日', '月', '火', '水', '木', '金', '土']

        // APIデータから該当日のデータを取得
        // WORK_DATEがDateオブジェクト、タイムスタンプ、または文字列の場合に対応
        const apiRecord = apiData.find(record => {
          if (!record.WORK_DATE) return false;
          
          let recordDateStr = '';
          if (record.WORK_DATE instanceof Date) {
            // Dateオブジェクトの場合はYYYY-MM-DD形式に変換
            const year = record.WORK_DATE.getFullYear();
            const month = String(record.WORK_DATE.getMonth() + 1).padStart(2, '0');
            const day = String(record.WORK_DATE.getDate()).padStart(2, '0');
            recordDateStr = `${year}-${month}-${day}`;
          } else if (typeof record.WORK_DATE === 'string') {
            // タイムスタンプ形式（2025-12-10T15:00:00.000Z）の場合は日付部分のみを取得
            // または既にYYYY-MM-DD形式の文字列の場合
            if (record.WORK_DATE.includes('T')) {
              recordDateStr = record.WORK_DATE.split('T')[0];
            } else {
              // 既にYYYY-MM-DD形式の場合は最初の10文字を取得
              recordDateStr = record.WORK_DATE.substring(0, 10);
            }
          } else {
            // その他の型の場合は文字列に変換してから処理
            const dateStr = String(record.WORK_DATE);
            if (dateStr.includes('T')) {
              recordDateStr = dateStr.split('T')[0];
            } else {
              recordDateStr = dateStr.substring(0, 10);
            }
          }
          
          return recordDateStr === dateStr;
        })

        // 祝日判定
        const holiday = HolidayJp.isHoliday(date)

        // 日付表示を数字部分と曜日部分に分ける
        let dateNumber = ''
        let dateDayOfWeek = ''

        if (day === 1) {
          dateNumber = `${Number(month)}/${day}`
          dateDayOfWeek = ` ${dayNames[dayOfWeek]}`
        } else {
          const dayStr = String(day).padStart(2, ' ')
          dateNumber = dayStr
          dateDayOfWeek = ` ${dayNames[dayOfWeek]}`
        }

        // 出社・退社時刻をH:MM形式に変換（時の先頭0を削除）
        const formatTime = (datetime) => {
          if (!datetime) return ''
          const date = new Date(datetime)
          const hours = String(date.getHours()) // 先頭0なし
          const minutes = String(date.getMinutes()).padStart(2, '0')
          return `${hours}:${minutes}`
        }

        // 工数を時間:分形式に変換（例: 7.5 → 7:30, 7.75 → 7:45）
        const formatWorkHours = (hours) => {
          if (!hours || hours === 0) return ''
          const wholeHours = Math.floor(hours)
          const minutes = Math.round((hours - wholeHours) * 60)
          return `${wholeHours}:${String(minutes).padStart(2, '0')}`
        }

        // 工数合計を計算
        const totalWorkHours = apiRecord?.workHours?.reduce((sum, wh) => sum + (parseFloat(wh.WORK_HOURS_VALUE) || 0), 0) || 0

        // 休憩時間データを取得・変換
        const breakTimes = []
        if (apiRecord?.breakTimes && apiRecord.breakTimes.length > 0) {
          // APIから取得した休憩時間を変換
          for (const bt of apiRecord.breakTimes) {
            if (bt.BREAK_START_TIME && bt.BREAK_END_TIME) {
              breakTimes.push({
                startTime: formatTime(bt.BREAK_START_TIME),
                endTime: formatTime(bt.BREAK_END_TIME),
                startHour: new Date(bt.BREAK_START_TIME).getHours(),
                startMinute: new Date(bt.BREAK_START_TIME).getMinutes(),
                endHour: new Date(bt.BREAK_END_TIME).getHours(),
                endMinute: new Date(bt.BREAK_END_TIME).getMinutes()
              })
            }
          }
        } else {
          // 基本休憩時間（12:00~13:00）をデフォルトで設定（平日の場合）
          if (dayOfWeek >= 1 && dayOfWeek <= 5 && !holiday) {
            breakTimes.push({
              startTime: '12:00',
              endTime: '13:00',
              startHour: 12,
              startMinute: 0,
              endHour: 13,
              endMinute: 0
            })
          }
        }

        // 出社・退社時刻をフォーマット
        const clockIn = formatTime(apiRecord?.CLOCK_IN_TIME)
        const clockOut = formatTime(apiRecord?.CLOCK_OUT_TIME)
        
        // 打刻時刻をフォーマット（ORIGINAL_CLOCK_IN_TIME/ORIGINAL_CLOCK_OUT_TIME）
        const originalClockIn = formatTime(apiRecord?.ORIGINAL_CLOCK_IN_TIME)
        const originalClockOut = formatTime(apiRecord?.ORIGINAL_CLOCK_OUT_TIME)
        
        // 出社時刻が空欄の場合、clockInTypeも空文字列に設定（背景色を付けないため）
        let clockInType = ''

        if (clockIn) {
          clockInType = apiRecord?.CLOCK_IN_TYPE || ''
        }

        // 退社時刻が空欄の場合、clockOutTypeも空文字列に設定（背景色を付けないため）
        let clockOutType = ''

        if (clockOut) {
          clockOutType = apiRecord?.CLOCK_OUT_TYPE || ''
        }
        
        // 打刻時刻と入力時刻が異なる場合の判定
        // 打刻時刻（ORIGINAL_CLOCK_IN_TIME/ORIGINAL_CLOCK_OUT_TIME）が存在し、
        // かつ入力時刻（CLOCK_IN_TIME/CLOCK_OUT_TIME）と異なる場合にtrue
        // または、打刻種別がMANUALで、かつ打刻時刻が存在する場合
        const hasClockInMismatch = originalClockIn && clockIn && originalClockIn !== clockIn
        const hasClockOutMismatch = originalClockOut && clockOut && originalClockOut !== clockOut
        const hasStampManualMismatch = hasClockInMismatch || hasClockOutMismatch || 
          (clockInType === 'MANUAL' && originalClockIn && clockIn) || 
          (clockOutType === 'MANUAL' && originalClockOut && clockOut)
        
        // 休日出勤申請の情報を取得
        const holidayWorkApp = apiRecord?.holidayWorkApplication
        const hasHolidayWorkApplication = !!(holidayWorkApp && 
          (holidayWorkApp.APPROVAL_STATUS === 'PENDING' || holidayWorkApp.APPROVAL_STATUS === 'APPROVED'))
        const holidayWorkApplicationStatus = holidayWorkApp?.APPROVAL_STATUS || null
        
        // 休日出勤申請の時間情報を取得（REASONフィールドからJSON形式で取得）
        let holidayWorkStartTime = null
        let holidayWorkEndTime = null
        let holidayWorkBreakHours = null
        if (holidayWorkApp && holidayWorkApp.REASON) {
          try {
            const reasonData = JSON.parse(holidayWorkApp.REASON)
            if (reasonData.startTime && reasonData.endTime) {
              holidayWorkStartTime = reasonData.startTime
              holidayWorkEndTime = reasonData.endTime
              holidayWorkBreakHours = reasonData.breakHours || 1.0
            }
          } catch (e) {
            // JSON解析エラーの場合は無視
          }
        }
        
        // 休日出勤申請が申請中または承認済みの場合、休憩時間が設定されていない場合はデフォルト値を設定
        if (hasHolidayWorkApplication && holidayWorkBreakHours === null) {
          holidayWorkBreakHours = 1.0
        }
        
        // 休暇申請の情報を取得
        const vacation = apiRecord?.vacation
        const hasVacation = !!(vacation && 
          (vacation.APPROVAL_STATUS === 'PENDING' || vacation.APPROVAL_STATUS === 'APPROVED'))
        const vacationTypeCode = vacation?.VACATION_TYPE_CODE || null
        const vacationApplicationStatus = vacation?.APPROVAL_STATUS || null
        
        displayData.push({
          date: dateStr,
          dateNumber: dateNumber,
          dateDayOfWeek: dateDayOfWeek,
          dayOfWeek: dayNames[dayOfWeek],
          dayOfWeekNum: dayOfWeek,
          hasWarning: false,
          hasStampManualMismatch: hasStampManualMismatch,
          approvalStatus: apiRecord?.APPROVAL_STATUS || 'NOT_SUBMITTED',
          clockIn: clockIn,
          clockOut: clockOut,
          clockInType: clockInType,
          clockOutType: clockOutType,
          location: apiRecord?.WORK_LOCATION_NAME || apiRecord?.WORK_LOCATION_CODE || '',
          workHours: formatWorkHours(totalWorkHours),
          hasWorkHoursError: apiRecord?.ACTUAL_WORK_HOURS && Math.abs((apiRecord.ACTUAL_WORK_HOURS - totalWorkHours)) > 0.01,
          canEdit: !apiRecord?.IS_DAILY_CONFIRMED,
          isHoliday: holiday,
          hasVacation: hasVacation,
          vacationTypeCode: vacationTypeCode,
          vacationApplicationStatus: vacationApplicationStatus,
          attendanceId: apiRecord?.ATTENDANCE_ID,
          actualWorkHours: apiRecord?.ACTUAL_WORK_HOURS || 0,
          breakTimes: breakTimes,
          hasHolidayWorkApplication: hasHolidayWorkApplication,
          holidayWorkApplicationStatus: holidayWorkApplicationStatus,
          holidayWorkStartTime: holidayWorkStartTime,
          holidayWorkEndTime: holidayWorkEndTime,
          holidayWorkBreakHours: holidayWorkBreakHours,
          remarkText: (() => {
            if (apiRecord?.REMARK_TEXT !== null && apiRecord?.REMARK_TEXT !== undefined) {
              return String(apiRecord.REMARK_TEXT)
            }

            return ''
          })()
        })
      }

      return displayData
    },

    // 年月変更処理（テーブル上部）
    async changeYearMonthTable() {
      this.loading = true
      try {
        await this.loadAttendanceData()
      } catch (error) {
        console.error('年月変更エラー:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 前月リンク押下処理
    previousMonthLink() {
      const [year, month] = this.selectedYearMonth.split('-').map(Number)
      const prevDate = new Date(year, month - 2, 1)
      const prevYear = prevDate.getFullYear()
      const prevMonth = prevDate.getMonth() + 1
      this.selectedYearMonth = `${prevYear}-${String(prevMonth).padStart(2, '0')}`
      this.changeYearMonthTable()
    },
    
    // 今月リンク押下処理
    currentMonthLink() {
      const today = new Date()
      const currentYear = today.getFullYear()
      const currentMonth = today.getMonth() + 1
      this.selectedYearMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}`
      this.changeYearMonthTable()
    },
    
    // 次月リンク押下処理
    nextMonthLink() {
      const [year, month] = this.selectedYearMonth.split('-').map(Number)
      const nextDate = new Date(year, month, 1)
      const nextYear = nextDate.getFullYear()
      const nextMonth = nextDate.getMonth() + 1
      this.selectedYearMonth = `${nextYear}-${String(nextMonth).padStart(2, '0')}`
      this.changeYearMonthTable()
    },
    
    // お知らせリンク押下処理
    showNotice() {
      // TODO: お知らせ画面への遷移
    },
    
    // 月次サマリーリンク押下処理
    showMonthlySummary() {
      // 新規ウィンドウで月次サマリー画面を開く
      const [year, month] = this.selectedYearMonth.split('-')
      const url = `/monthly-summary?employeeId=${this.employeeId}&yearMonth=${this.selectedYearMonth}`
      window.open(url, '_blank', 'width=1920,height=1080')
    },
    
    // ステータス表示押下処理
    showStatusDialog() {
      // TODO: ステータスダイアログの表示
    },
    
    // 承認申請ボタン押下処理
    showApprovalRequest() {
      // TODO: 承認申請画面への遷移
    },
    
    // サンプルデータの読み込み
    loadSampleData() {
      const sampleData = []
      const [year, month] = this.selectedYearMonth.split('-').map(Number)
      const daysInMonth = new Date(year, month, 0).getDate()
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day)
        const dayOfWeek = date.getDay()
        const dayNames = ['日', '月', '火', '水', '木', '金', '土']
        
        // 祝日判定
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const holiday = HolidayJp.isHoliday(date)
        
        // 日付表示を数字部分と曜日部分に分ける
        let dateNumber = ''
        let dateDayOfWeek = ''
        
        if (day === 1) {
          // 月初めの日のみMM/DD形式
          dateNumber = `${Number(month)}/${day}`
          dateDayOfWeek = ` ${dayNames[dayOfWeek]}`
        } else {
          // 2日以降は日付のみ（土日も含む）、右揃えで「/1」の「1」の位置に合わせる
          const dayStr = String(day).padStart(2, ' ')
          dateNumber = dayStr
          dateDayOfWeek = ` ${dayNames[dayOfWeek]}`
        }
        
        // 基本休憩時間（12:00~13:00）をデフォルトで設定（平日の場合）
        const breakTimes = []
        if (dayOfWeek >= 1 && dayOfWeek <= 5 && !holiday) {
          breakTimes.push({
            startTime: '12:00',
            endTime: '13:00',
            startHour: 12,
            startMinute: 0,
            endHour: 13,
            endMinute: 0
          })
        }

        sampleData.push({
          date: dateStr,
          dateNumber: dateNumber,
          dateDayOfWeek: dateDayOfWeek,
          dayOfWeek: dayNames[dayOfWeek],
          dayOfWeekNum: dayOfWeek,
          hasWarning: false,
          approvalStatus: 'NOT_SUBMITTED',
          clockIn: '',
          clockOut: '',
          clockInType: '',
          clockOutType: '',
          location: '',
          workHours: '',
          hasWorkHoursError: false,
          canEdit: true,
          isHoliday: holiday, // 祝日判定
          hasVacation: false,
          vacationTypeCode: null,
          vacationApplicationStatus: null,
          attendanceId: null,
          actualWorkHours: 0,
          breakTimes: breakTimes,
          remarkText: ''
        })
      }
      
      this.attendanceData = sampleData
    },
    
    // 行のクラスを取得
    getRowClass(day) {
      // 優先順位: 休暇申請済み > 日曜日 > 祝日 > 土曜日 > 平日
      // 日曜日に祝日イベントがあっても日曜日と同じ扱いにする
      if (day.hasVacation) {
        return 'vacation-row'
      } else if (day.dayOfWeekNum === 0) {
        return 'sunday-row' // 日曜日（祝日より優先）
      } else if (day.isHoliday) {
        return 'saturday-row' // 祝日は土曜日と同じ背景色（ただし日曜日でない場合のみ）
      } else if (day.dayOfWeekNum === 6) {
        return 'saturday-row'
      }
      return ''
    },
    
    // 曜日の色クラスを取得
    getDayOfWeekClass(day) {
      // 優先順位: 日曜日 > 祝日 > 土曜日 > 平日
      // 日曜日に祝日イベントがあっても日曜日と同じ扱いにする
      if (day.dayOfWeekNum === 0) {
        return 'sunday-text' // 日曜日（祝日より優先）
      } else if (day.isHoliday) {
        return 'saturday-text' // 祝日は土曜日と同じ青色（ただし日曜日でない場合のみ）
      } else if (day.dayOfWeekNum === 6) {
        return 'saturday-text'
      }
      return ''
    },
    
    // 編集可能な承認状態かどうかを判定（テキストボックス表示の条件）
    isEditableStatus(day) {
      // 休暇申請がある場合はテキストボックスを表示しない
      if (day.hasVacation) {
        return false
      }
      // 土日祝の場合、休日出勤申請が承認されている場合はテキストボックスを表示
      if (day.isHoliday || day.dayOfWeekNum === 0 || day.dayOfWeekNum === 6) {
        return day.hasHolidayWorkApplication
      }
      // 平日の場合、未申請（NOT_SUBMITTED）または却下（REJECTED）の場合はテキストボックス表示
      return day.approvalStatus === 'NOT_SUBMITTED' || day.approvalStatus === 'REJECTED'
    },
    
    // 土日祝かどうかを判定（休日出勤申請が承認されている場合はクリック可能）
    isHolidayOrWeekend(day) {
      const isHoliday = day.isHoliday || day.dayOfWeekNum === 0 || day.dayOfWeekNum === 6
      // 休日出勤申請が承認されている場合はクリック可能
      if (isHoliday && day.hasHolidayWorkApplication) {
        return false
      }
      return isHoliday
    },
    
    // 時間軸の位置を計算（0-48時を0.4%から80.3%の範囲にマッピング）
    calculateTimePosition(hour, minute = 0) {
      const totalMinutes = hour * 60 + minute
      const totalHours = totalMinutes / 60
      // 時間軸の開始位置: 0.4%, 終了位置: 80.3%, 幅: 79.9%
      const timeAxisStart = 0.4
      const timeAxisEnd = 80.3
      const timeAxisWidth = timeAxisEnd - timeAxisStart
      const position = timeAxisStart + (totalHours / 48) * timeAxisWidth
      return position
    },
    
    // グラフスタイルを取得（全体のバー）
    getGraphStyle(day) {
      if (!day.clockIn || !day.clockOut) return {}
      
      const [inHour, inMin] = day.clockIn.split(':').map(Number)
      const [outHour, outMin] = day.clockOut.split(':').map(Number)
      
      const startPosition = this.calculateTimePosition(inHour, inMin)
      const endPosition = this.calculateTimePosition(outHour, outMin)
      
      return {
        left: `${startPosition}%`,
        width: `${endPosition - startPosition}%`
      }
    },
    
    // グラフセグメントのスタイルを取得（所定内労働、法定時間内残業、法定時間外残業）
    getGraphSegmentStyle(day, segmentType) {
      if (!day.clockIn || !day.clockOut || !day.actualWorkHours) {
        return { left: '0%', width: '0%' }
      }
      
      const breakdown = this.calculateDailyWorkHourBreakdown(day)
      const dailyActualWorkHours = parseFloat(day.actualWorkHours) || 0
      
      if (dailyActualWorkHours === 0) {
        return { left: '0%', width: '0%' }
      }
      
      const [inHour, inMin] = day.clockIn.split(':').map(Number)
      const [outHour, outMin] = day.clockOut.split(':').map(Number)
      
      const startPosition = this.calculateTimePosition(inHour, inMin)
      const endPosition = this.calculateTimePosition(outHour, outMin)
      const totalWidth = endPosition - startPosition
      
      let segmentHours = 0
      let segmentStartOffset = 0
      
      if (segmentType === 'scheduled') {
        segmentHours = breakdown.scheduledWorkHours
        segmentStartOffset = 0
      } else if (segmentType === 'withinLegal') {
        segmentHours = breakdown.withinLegalOvertime
        segmentStartOffset = breakdown.scheduledWorkHours
      } else if (segmentType === 'overLegal') {
        segmentHours = breakdown.overLegalOvertime
        segmentStartOffset = breakdown.scheduledWorkHours + breakdown.withinLegalOvertime
      }
      
      // セグメントの開始位置（全体の開始位置 + オフセット）
      const segmentStartRatio = segmentStartOffset / dailyActualWorkHours
      const segmentWidthRatio = segmentHours / dailyActualWorkHours
      
      // 休日出勤申請が承認されている場合の色を決定
      let backgroundColor = null
      if (day.hasHolidayWorkApplication) {
        // 日曜日（法定休日）の場合
        if (day.dayOfWeekNum === 0) {
          backgroundColor = '#DE9EDD'
        }
        // 土曜日または祝日（所定休日）の場合
        else if (day.dayOfWeekNum === 6 || day.isHoliday) {
          backgroundColor = '#B0B000'
        }
      }
      
      const style = {
        left: `${startPosition + totalWidth * segmentStartRatio}%`,
        width: `${totalWidth * segmentWidthRatio}%`
      }
      
      if (backgroundColor) {
        style.backgroundColor = backgroundColor
      }
      
      return style
    },
    
    // グラフセグメントの幅を取得（数値）
    getGraphSegmentWidth(day, segmentType) {
      if (!day.clockIn || !day.clockOut || !day.actualWorkHours) {
        return 0
      }
      
      const breakdown = this.calculateDailyWorkHourBreakdown(day)
      
      if (segmentType === 'scheduled') {
        return breakdown.scheduledWorkHours
      } else if (segmentType === 'withinLegal') {
        return breakdown.withinLegalOvertime
      } else if (segmentType === 'overLegal') {
        return breakdown.overLegalOvertime
      }
      
      return 0
    },
    
    // 出勤時刻の位置を取得
    getClockInPosition(day) {
      if (!day.clockIn) return null
      const [inHour, inMin] = day.clockIn.split(':').map(Number)
      return this.calculateTimePosition(inHour, inMin)
    },
    
    // 退勤時刻の位置を取得
    getClockOutPosition(day) {
      if (!day.clockOut) return null
      const [outHour, outMin] = day.clockOut.split(':').map(Number)
      return this.calculateTimePosition(outHour, outMin)
    },
    
    // 出勤時刻の▼マークスタイルを取得（長方形の左上の角）
    getClockInMarkerStyle(day) {
      if (!day.clockIn) return {}
      
      // 長方形がある場合は長方形の左端、ない場合は時刻の位置
      let leftPosition
      if (day.clockIn && day.clockOut) {
        const graphStyle = this.getGraphStyle(day)
        leftPosition = parseFloat(graphStyle.left)
      } else {
        leftPosition = this.getClockInPosition(day)
      }
      
      // バーの上端より少し下に配置（バーの上端: 50% - 5.5px、少し下にずらす）
      return {
        left: `${leftPosition}%`,
        top: 'calc(50% - 3px)'
      }
    },
    
    // 退勤時刻の▼マークスタイルを取得（長方形の右上の角）
    getClockOutMarkerStyle(day) {
      if (!day.clockOut) return {}
      
      // 長方形がある場合は長方形の右端、ない場合は時刻の位置
      let leftPosition
      if (day.clockIn && day.clockOut) {
        const graphStyle = this.getGraphStyle(day)
        const left = parseFloat(graphStyle.left)
        const width = parseFloat(graphStyle.width)
        leftPosition = left + width
      } else {
        leftPosition = this.getClockOutPosition(day)
      }
      
      // バーの上端より少し下に配置（バーの上端: 50% - 5.5px、少し下にずらす）
      return {
        left: `${leftPosition}%`,
        top: 'calc(50% - 3px)'
      }
    },
    
    // 有給休暇または夏季休暇のオレンジ色のアイコンスタイルを取得
    getVacationApplicationMarkerStyle(day) {
      if (!day.hasVacation || day.vacationTypeCode !== 'PAID_LEAVE') return {}
      
      // 9:00の位置に配置（グラフの左端）
      const leftPosition = this.calculateTimePosition(9, 0)
      
      // グラフの中央より少し上に配置
      return {
        left: `${leftPosition}%`,
        top: 'calc(50% - 15px)'
      }
    },
    
    // 休日出勤申請の緑の↑マークスタイルを取得
    getHolidayWorkApplicationMarkerStyle(day) {
      if (!day.hasHolidayWorkApplication) return {}
      
      // 9:30の位置に配置（10:00より少し左）
      const leftPosition = this.calculateTimePosition(9, 30)
      
      // グラフの中央より少し上に配置
      return {
        left: `${leftPosition}%`,
        top: 'calc(50% - 8px)'
      }
    },
    
    // 標準勤務時間帯のスタイルを取得（9:00-17:30）
    getScheduledWorkTimeStyle(day) {
      // 休日出勤申請が承認されている場合は、申請された時間を使用
      if (day.hasHolidayWorkApplication && day.holidayWorkStartTime && day.holidayWorkEndTime) {
        const [startHour, startMin] = day.holidayWorkStartTime.split(':').map(Number)
        const [endHour, endMin] = day.holidayWorkEndTime.split(':').map(Number)
        const startPosition = this.calculateTimePosition(startHour, startMin)
        const endPosition = this.calculateTimePosition(endHour, endMin)
        
        return {
          left: `${startPosition}%`,
          width: `${endPosition - startPosition}%`
        }
      }
      
      // デフォルト: 9:00-17:30
      const startPosition = this.calculateTimePosition(9, 0) // 9:00
      const endPosition = this.calculateTimePosition(17, 30) // 17:30
      
      return {
        left: `${startPosition}%`,
        width: `${endPosition - startPosition}%`
      }
    },
    
    // 休憩時間のグレー長方形のスタイルを取得（休日出勤申請が申請中または承認済みの場合）
    getScheduledBreakTimeStyle(day) {
      if (!day.hasHolidayWorkApplication || !day.holidayWorkBreakHours) {
        return { display: 'none' }
      }
      
      // 常に12:00-13:00の時間軸に合わせる
      const startPosition = this.calculateTimePosition(12, 0)
      const endPosition = this.calculateTimePosition(13, 0)
      
      return {
        left: `${startPosition}%`,
        width: `${endPosition - startPosition}%`
      }
    },
    
    // 有給休暇または夏季休暇の休憩時間のスタイルを取得（12:00-13:00）
    getVacationBreakTimeStyle(day) {
      // 常に12:00-13:00の時間軸に合わせる
      const startPosition = this.calculateTimePosition(12, 0)
      const endPosition = this.calculateTimePosition(13, 0)
      
      return {
        left: `${startPosition}%`,
        width: `${endPosition - startPosition}%`,
        backgroundColor: '#1A69AB' // 青色をインラインスタイルで指定
      }
    },
    
    // 休憩時間のスタイルを取得
    getBreakTimeStyle(breakTime, day) {
      const startPosition = this.calculateTimePosition(breakTime.startHour, breakTime.startMinute)
      const endPosition = this.calculateTimePosition(breakTime.endHour, breakTime.endMinute)
      
      return {
        left: `${startPosition}%`,
        width: `${endPosition - startPosition}%`
      }
    },
    
    // 休憩時間の色を取得
    getBreakTimeColor(breakTime, day) {
      // 出勤していない場合（勤務予定日）：グレー（#BBBBBB）
      if (!day.clockIn) {
        return '#BBBBBB'
      }
      
      // 出勤している場合：出勤時刻が休憩時間より前かどうかをチェック
      const [inHour, inMin] = day.clockIn.split(':').map(Number)
      const clockInMinutes = inHour * 60 + inMin
      const breakStartMinutes = breakTime.startHour * 60 + breakTime.startMinute
      
      // 出勤時刻が休憩時間より後の場合：表示しない（nullを返す）
      if (clockInMinutes > breakStartMinutes) {
        return null
      }
      
      // 出勤時刻が休憩時間より前の場合：青色（#1A69AB）
      return '#1A69AB'
    },
    
    // 休憩時間を表示するかどうかを判定
    shouldShowBreakTime(breakTime, day) {
      // 有給休暇または夏季休暇の取得日の場合、通常の休憩時間の長方形を表示しない
      if (day.hasVacation && day.vacationTypeCode === 'PAID_LEAVE') {
        return false
      }
      
      // 代休の取得日の場合、休憩時間の長方形を表示しない
      if (day.hasVacation && day.vacationTypeCode === 'SUBSTITUTE_HOLIDAY') {
        return false
      }
      
      // 出勤していない場合：表示する（グレー）
      if (!day.clockIn) {
        return true
      }
      
      // 出勤している場合：出勤時刻が休憩時間より前かどうかをチェック
      const [inHour, inMin] = day.clockIn.split(':').map(Number)
      const clockInMinutes = inHour * 60 + inMin
      const breakStartMinutes = breakTime.startHour * 60 + breakTime.startMinute
      
      // 出勤時刻が休憩時間より後の場合：表示しない
      return clockInMinutes <= breakStartMinutes
    },
    
      // 勤怠関連申請ダイアログを開く（申請欄の+アイコン押下時）
      openApplicationDialog(day) {
        this.selectedDayForApplication = day
        this.selectedApplicationType = null
        this.showApplicationDialog = true
      },
      
      // 勤怠関連申請ダイアログを開く（申請中または承認済みのアイコン押下時）
      openApplicationDialogWithType(day) {
        this.selectedDayForApplication = day
        
        // どの申請タイプが申請中または承認済みかを判定
        // 優先順位: 日次確定 > 休日出勤 > 休暇 > 残業 > 早朝勤務 > 振替
        if (day.approvalStatus === 'PENDING' || day.approvalStatus === 'APPROVED') {
          this.selectedApplicationType = 'dailyConfirmation'
          this.selectedApplicationStatus = day.approvalStatus
        } else if (day.holidayWorkApplicationStatus === 'PENDING' || day.holidayWorkApplicationStatus === 'APPROVED') {
          this.selectedApplicationType = 'holidayWork'
          this.selectedApplicationStatus = day.holidayWorkApplicationStatus
        } else if (day.vacationApplicationStatus === 'PENDING' || day.vacationApplicationStatus === 'APPROVED') {
          this.selectedApplicationType = 'vacation'
          this.selectedApplicationStatus = day.vacationApplicationStatus
        } else {
          // その他の申請タイプはAPIで取得する必要があるが、とりあえずnull
          this.selectedApplicationType = null
          this.selectedApplicationStatus = null
        }
        
        this.showApplicationDialog = true
      },
      
      // 勤怠関連申請ダイアログを閉じる
      closeApplicationDialog() {
        this.showApplicationDialog = false
        this.selectedDayForApplication = null
        this.selectedApplicationType = null
        this.selectedApplicationStatus = null
      },
      
      // 申請完了時の処理
      async handleApplicationSubmitted() {
        // データを再読み込み
        await this.loadAttendanceData()
      },
      
      // 日次確定ボタン押下（日付欄の+アイコン用）
      async confirmDaily(day) {
        // 1. 日次確定チェック
        const checkResult = await this.checkDailyConfirmation(day)
        
        if (!checkResult.isValid) {
          // エラーがある場合はエラーダイアログを表示
          this.errorCheckDialogMessage = checkResult.errorMessage
          this.showErrorCheckDialog = true
          return
        }
        
        // 2. チェックが正常に通過した場合のみ確認ダイアログを表示
        this.confirmDialogMessage = `${day.dateNumber}${day.dateDayOfWeek}の勤務を確定申請しますか?`
        this.pendingDailyConfirmation = day
        this.showConfirmDialog = true
      },
      
      // 日次確定の事前チェック
      async checkDailyConfirmation(day) {
        try {
          // 日次勤務データ取得
          const attendanceResponse = await getDailyAttendance(this.employeeId, day.date)
          
          // データが取得できない場合、出退社時刻が未入力として扱う
          let attendance = null
          if (attendanceResponse.success && attendanceResponse.attendance) {
            attendance = attendanceResponse.attendance
          }
          
          // 1. 出退社時刻チェック
          const hasClockIn = attendance ? !!attendance.CLOCK_IN_TIME : false
          const hasClockOut = attendance ? !!attendance.CLOCK_OUT_TIME : false
          
          if (!hasClockIn && !hasClockOut) {
            return {
              isValid: false,
              errorMessage: '出退社時刻が未入力のため、日次確定できません。'
            }
          } else if (!hasClockIn) {
            return {
              isValid: false,
              errorMessage: '出社時刻が未入力のため、日次確定できません。'
            }
          } else if (!hasClockOut) {
            return {
              isValid: false,
              errorMessage: '退社時刻が未入力のため、日次確定できません。'
            }
          }
          
          // データが存在しない場合は、ここで終了
          if (!attendance) {
            return { isValid: false, errorMessage: '出退社時刻が未入力のため、日次確定できません。' }
          }
          
          // 2. 勤務場所チェック
          if (!attendance.WORK_LOCATION_CODE) {
            return {
              isValid: false,
              errorMessage: '勤務場所を選択してください'
            }
          }
          
          // 3. 工数実績取得
          const workHoursResponse = await getWorkHours(this.employeeId, day.date)
          let workHoursTotal = 0
          
          if (workHoursResponse.success && workHoursResponse.workHours) {
            workHoursTotal = workHoursResponse.workHours.reduce(
              (sum, wh) => sum + (parseFloat(wh.WORK_HOURS_VALUE) || 0),
              0
            )
          }
          
          // 4. 工数合計と実労働時間の一致チェック
          const actualWorkHours = parseFloat(attendance.ACTUAL_WORK_HOURS) || 0
          if (actualWorkHours > 0 && Math.abs(actualWorkHours - workHoursTotal) > 0.01) {
            return {
              isValid: false,
              errorMessage: '工数の合計と実労働時間が合いません'
            }
          }
          
          // 5. 手入力の場合は備考チェック
          if ((attendance.CLOCK_IN_TYPE === 'MANUAL' || attendance.CLOCK_OUT_TYPE === 'MANUAL') && !attendance.REMARK_TEXT) {
            return {
              isValid: false,
              errorMessage: '手入力の場合は備考に理由を入力してください'
            }
          }
          
          return { isValid: true }
        } catch (error) {
          console.error('日次確定チェックエラー:', error)
          // 認証エラー（401）の場合は認証エラーダイアログを表示
          if (error.status === 401 || error.message?.includes('認証') || error.message?.includes('ログイン')) {
            this.showAuthErrorDialogFunc()
            return { isValid: false, errorMessage: '' }
          }
          return {
            isValid: false,
            errorMessage: 'チェック処理中にエラーが発生しました。'
          }
        }
      },
      
      // 確認ダイアログのOKボタン押下処理
      async handleConfirmDialogOk() {
        if (!this.pendingDailyConfirmation) {
          this.closeConfirmDialog()
          return
        }
        
        const day = this.pendingDailyConfirmation
        this.closeConfirmDialog()
        
        // ローディング表示開始
        this.loading = true
        
        try {
          const response = await submitDailyConfirmation(this.employeeId, day.date)
          
          if (response.success) {
            // データを再読み込み
            await this.loadAttendanceData()
          } else {
            throw new Error(response.message)
          }
        } catch (error) {
          console.error('日次確定エラー:', error)
          // 認証エラー（401）の場合は認証エラーダイアログを表示
          if (error.status === 401 || error.message?.includes('認証') || error.message?.includes('ログイン')) {
            this.showAuthErrorDialogFunc()
            return
          }
          // エラーダイアログを表示
          this.errorCheckDialogMessage = error.message || '日次確定申請に失敗しました'
          this.showErrorCheckDialog = true
        } finally {
          this.loading = false
        }
      },
      
      // 確認ダイアログを閉じる
      closeConfirmDialog() {
        this.showConfirmDialog = false
        this.confirmDialogMessage = ''
        this.pendingDailyConfirmation = null
      },
      
      // エラーチェックダイアログを閉じる
      closeErrorCheckDialog() {
        this.showErrorCheckDialog = false
        this.errorCheckDialogMessage = ''
      },
    
    // 工数実績入力画面を開く
    openWorkHours(day) {
      this.selectedDayForWorkHours = day
      this.showWorkHoursDialog = true
    },
    
    // 工数実績ダイアログを閉じる
    closeWorkHoursDialog() {
      this.showWorkHoursDialog = false
      this.selectedDayForWorkHours = null
    },
    
    // 工数実績登録完了時の処理
    handleWorkHoursRegistered(result) {
      this.showWorkHoursDialog = false
      this.selectedDayForWorkHours = null
      // 勤務表データを再取得
      this.loadAttendanceData()
    },
    
    // 備考入力ダイアログを開く
    async openRemarks(day) {
      try {
        // 該当日の勤怠データを取得
        const [year, month, date] = day.date.split('-')
        const response = await getMonthlyAttendance(this.employeeId, year, month)
        
        if (response.success) {
          const apiRecord = response.dailyData.find(record => record.WORK_DATE === day.date)
          
          // ダイアログの状態を設定
          this.selectedDayForRemarks = day
          this.remarkText = apiRecord?.REMARK_TEXT || ''
          this.currentRemarksApprovalStatus = apiRecord?.APPROVAL_STATUS || 'NOT_SUBMITTED'
          this.remarksApiRecord = apiRecord
          this.remarksInfoText = this.getRemarksInfoText(apiRecord)
          this.showRemarksDialog = true
        } else {
          // エラー時はデフォルト値で表示
          this.selectedDayForRemarks = day
          this.remarkText = ''
          this.currentRemarksApprovalStatus = day.approvalStatus || 'NOT_SUBMITTED'
          this.remarksApiRecord = null
          this.remarksInfoText = this.getRemarksInfoText(day)
          this.showRemarksDialog = true
        }
      } catch (error) {
        console.error('備考データ取得エラー:', error)
        // 認証エラー（401）の場合は認証エラーダイアログを表示
        if (error.status === 401 || error.message?.includes('認証') || error.message?.includes('ログイン')) {
          this.showAuthErrorDialogFunc()
          return
        }
        // その他のエラー時はデフォルト値でダイアログを表示
        this.selectedDayForRemarks = day
        this.remarkText = ''
        this.currentRemarksApprovalStatus = day.approvalStatus || 'NOT_SUBMITTED'
        this.remarksApiRecord = null
        this.remarksInfoText = this.getRemarksInfoText(day)
        this.showRemarksDialog = true
      }
    },
    
    // 備考ダイアログに表示する打刻漏れ・手入力修正の情報を生成
    getRemarksInfoText(record) {
      if (!record) return ''
      
      const info = []
      
      // APIレコードから情報を取得（優先）
      const clockInType = record.CLOCK_IN_TYPE || record.clockInType
      const clockOutType = record.CLOCK_OUT_TYPE || record.clockOutType
      const originalClockInTime = record.ORIGINAL_CLOCK_IN_TIME || record.originalClockInTime
      const originalClockOutTime = record.ORIGINAL_CLOCK_OUT_TIME || record.originalClockOutTime
      const clockInTime = record.CLOCK_IN_TIME || record.clockInTime
      const clockOutTime = record.CLOCK_OUT_TIME || record.clockOutTime
      
      // 打刻漏れの判定（打刻のし忘れなどで手入力で入力した場合）
      // 打刻種別がMANUALで、かつ元の打刻時刻（ORIGINAL_CLOCK_IN_TIME/ORIGINAL_CLOCK_OUT_TIME）がない場合
      // これは打刻のし忘れなどで手入力で入力したことを示す
      const hasClockInMissing = clockInType === 'MANUAL' && !originalClockInTime && clockInTime
      const hasClockOutMissing = clockOutType === 'MANUAL' && !originalClockOutTime && clockOutTime
      
      if (hasClockInMissing && hasClockOutMissing) {
        info.push('出退打刻なし')
      } else if (hasClockInMissing) {
        info.push('出社打刻なし')
      } else if (hasClockOutMissing) {
        info.push('退社打刻なし')
      }
      
      // 打刻時刻の手入力修正の判定
      if (clockInType && originalClockInTime && clockInTime) {
        const originalTime = this.formatTimeForRemarks(originalClockInTime)
        const currentTime = this.formatTimeForRemarks(clockInTime)
        if (originalTime !== currentTime) {
          info.push(`(出社打刻 ${currentTime})`)
        }
      }
      
      if (clockOutType && originalClockOutTime && clockOutTime) {
        const originalTime = this.formatTimeForRemarks(originalClockOutTime)
        const currentTime = this.formatTimeForRemarks(clockOutTime)
        if (originalTime !== currentTime) {
          info.push(`(退社打刻 ${currentTime})`)
        }
      }
      
      return info.length > 0 ? info.join('、') : ''
    },
    
    // 備考ダイアログ用の時刻フォーマット
    formatTimeForRemarks(timeStr) {
      if (!timeStr) return ''
      if (typeof timeStr === 'string' && timeStr.includes('T')) {
        const date = new Date(timeStr)
        const hours = date.getHours()
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${hours}:${minutes}`
      }
      if (typeof timeStr === 'string' && /^\d{2}:\d{2}$/.test(timeStr)) {
        const [hours, minutes] = timeStr.split(':')
        const hourNum = parseInt(hours, 10)
        return `${hourNum}:${minutes}`
      }
      return timeStr
    },
    
    // 日付をダイアログ用フォーマットに変換
    formatDateForDialog(day) {
      if (!day || !day.date) return ''
      
      const date = new Date(day.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const dateNum = date.getDate()
      const dayNames = ['日', '月', '火', '水', '木', '金', '土']
      const dayOfWeek = dayNames[date.getDay()]
      
      return `${year}年${month}月${dateNum}日${dayOfWeek}曜日`
    },
    
    // 備考を保存
    async saveRemarks() {
      if (!this.selectedDayForRemarks) return
      
      // 保存前の日付を保持（ダイアログを閉じた後でも参照できるように）
      const targetDate = this.selectedDayForRemarks.date
      const savedRemarkText = this.remarkText
      
      try {
        this.loading = true
        
        // 勤怠記録を更新
        const attendanceData = {
          ATTENDANCE_ID: this.selectedDayForRemarks.attendanceId,
          EMPLOYEE_ID: this.employeeId,
          WORK_DATE: this.selectedDayForRemarks.date,
          REMARK_TEXT: this.remarkText
        }
        
        const response = await updateAttendanceRecord(attendanceData)
        
        if (response.success) {
          // データを再読み込み
          await this.loadAttendanceData()
          
          // Vueのリアクティビティを確実にするため、nextTickで待機
          await this.$nextTick()
          
          // データが正しく更新されたか確認
          const updatedDay = this.attendanceData.find(day => day.date === targetDate)
          if (updatedDay) {
            // 備考が正しく更新されていない場合、直接更新
            if (updatedDay.remarkText !== savedRemarkText) {
              // APIから取得したデータが正しくない場合、直接更新
              this.$set(updatedDay, 'remarkText', savedRemarkText)
            }
          }
          
          // ダイアログを閉じる
          this.closeRemarksDialog()
          
          // 強制的に再レンダリング
          this.$forceUpdate()
        } else {
          throw new Error(response.message || '備考の保存に失敗しました')
        }
      } catch (error) {
        console.error('備考保存エラー:', error)
        // 認証エラー（401）の場合は認証エラーダイアログを表示
        if (error.status === 401 || error.message?.includes('認証') || error.message?.includes('ログイン')) {
          this.showAuthErrorDialogFunc()
          return
        }
        console.error(error.message || '備考の保存に失敗しました')
      } finally {
        this.loading = false
      }
    },
    
    // 備考ダイアログを閉じる
    closeRemarksDialog() {
      this.showRemarksDialog = false
      this.selectedDayForRemarks = null
      this.remarkText = ''
      this.currentRemarksApprovalStatus = null
      this.remarksInfoText = ''
      this.remarksApiRecord = null
    },
    
    // 勤怠情報入力ダイアログを開く
    openAttendanceInputDialog(day, focusField) {
      this.selectedDayForInput = day
      this.inputDialogFocus = focusField
      this.showInputDialog = true
    },
    
    // 勤怠情報入力ダイアログを閉じる
    closeInputDialog() {
      this.showInputDialog = false
      this.selectedDayForInput = null
      this.inputDialogFocus = 'clockIn'
    },
    
    // 勤怠情報入力完了時の処理
    async handleInputUpdated(result) {
      // データを再読み込み
      await this.loadAttendanceData()
      
      // 更新された日の行を更新（手入力フラグを反映）
      const updatedDay = this.attendanceData.find(d => d.date === result.date)
      if (updatedDay) {
        // 出社時刻が空欄の場合は背景色を付けない（取り消し）
        if (!updatedDay.clockIn || updatedDay.clockIn.trim() === '') {
          updatedDay.clockInType = ''
        } else if (result.isClockInManual) {
          // 出社時間が手入力の場合のみMANUALに設定
          updatedDay.clockInType = 'MANUAL'
        } else {
          // 手入力でない場合は、APIから取得したデータを保持（既存の打刻種別を維持）
          // loadAttendanceData()で既に正しい値が設定されているので、変更しない
        }
        
        // 退社時刻が空欄の場合は背景色を付けない（取り消し）
        if (!updatedDay.clockOut || updatedDay.clockOut.trim() === '') {
          updatedDay.clockOutType = ''
        } else if (result.isClockOutManual) {
          // 退社時間が手入力の場合のみMANUALに設定
          updatedDay.clockOutType = 'MANUAL'
        } else {
          // 手入力でない場合は、APIから取得したデータを保持（既存の打刻種別を維持）
          // loadAttendanceData()で既に正しい値が設定されているので、変更しない
        }
      }
    },
    
    // 認証エラーダイアログを表示
    showAuthErrorDialogFunc() {
      this.showAuthErrorDialog = true
    },
    
    // ログイン画面へリダイレクト
    redirectToLogin() {
      this.showAuthErrorDialog = false
      this.$router.push('/')
    },
    
    // グラフツールチップを表示
    showGraphTooltip(day, event) {
      this.tooltipDay = day
      this.showTooltip = true
      this.updateGraphTooltipPosition(event)
    },
    
    // グラフツールチップを非表示
    hideGraphTooltip() {
      this.showTooltip = false
      this.tooltipDay = null
    },
    
    // グラフツールチップの位置を更新
    updateGraphTooltipPosition(event) {
      if (!this.showTooltip) return
      
      // 次のフレームでツールチップの実際のサイズを取得するため、$nextTickを使用
      this.$nextTick(() => {
        // refでツールチップ要素を取得（v-for内のため配列の可能性がある）
        let tooltipElement = null
        if (this.$refs.graphTooltip) {
          // refが配列の場合、最初の要素を取得
          tooltipElement = Array.isArray(this.$refs.graphTooltip) 
            ? this.$refs.graphTooltip[0] 
            : this.$refs.graphTooltip
        }
        
        // refが取得できない場合、querySelectorで取得を試みる
        if (!tooltipElement) {
          tooltipElement = document.querySelector('.graph-tooltip')
        }
        
        if (!tooltipElement) return
        
        this.updateTooltipPositionWithElement(tooltipElement, event)
      })
    },
    
    // ツールチップ要素とイベントを受け取り、位置を計算する
    updateTooltipPositionWithElement(tooltipElement, event) {
      // ツールチップの実際のサイズを取得
      const tooltipRect = tooltipElement.getBoundingClientRect()
      const tooltipWidth = tooltipRect.width || 280
      const tooltipHeight = tooltipRect.height || 400
      
      const tooltipOffset = 10 // オフセット
      
      // カーソルの位置を取得
      const cursorX = event.clientX
      const cursorY = event.clientY
      
      // イベントが発生した要素（グラフのバー）の位置を取得
      const targetElement = event.target
      let targetRect = null
      if (targetElement) {
        targetRect = targetElement.getBoundingClientRect()
      }
      
      // X方向の位置決定：ターゲット要素またはカーソルにできるだけ近づける
      let left
      const referenceX = targetRect ? targetRect.right : cursorX
      
      // まず右側に表示を試みる
      const rightSide = referenceX + tooltipOffset
      if (rightSide + tooltipWidth <= window.innerWidth - tooltipOffset) {
        // 右側に表示可能
        left = rightSide
      } else {
        // 右側に表示できない場合、左側に表示
        const leftReferenceX = targetRect ? targetRect.left : cursorX
        const leftSide = leftReferenceX - tooltipWidth - tooltipOffset
        if (leftSide >= tooltipOffset) {
          // 左側に表示可能
          left = leftSide
        } else {
          // 左側にも表示できない場合、画面内に収める
          left = Math.max(tooltipOffset, cursorX - tooltipWidth)
          if (left + tooltipWidth > window.innerWidth - tooltipOffset) {
            left = window.innerWidth - tooltipWidth - tooltipOffset
          }
        }
      }
      
      // Y方向の位置決定：ターゲット要素またはカーソルにできるだけ近づける
      let top
      const referenceY = targetRect ? targetRect.top : cursorY
      
      // まずターゲット要素の上端またはカーソルの位置に配置を試みる
      top = referenceY + tooltipOffset
      
      // 画面下端を超える場合の処理
      if (top + tooltipHeight > window.innerHeight - tooltipOffset) {
        // ターゲット要素の下端を基準にする
        const targetBottom = targetRect ? targetRect.bottom : cursorY
        
        // ターゲット要素の上側に表示できるスペースを計算
        const spaceAbove = referenceY - tooltipOffset
        // ターゲット要素の下側に表示できるスペースを計算
        const spaceBelow = window.innerHeight - tooltipOffset - targetBottom
        
        // 上側と下側のスペースを比較して、より近い方に配置
        if (spaceAbove >= tooltipHeight) {
          // 上側に十分なスペースがある場合、ターゲット要素の上側に配置
          top = referenceY - tooltipHeight - tooltipOffset
        } else if (spaceBelow >= tooltipHeight) {
          // 下側に十分なスペースがある場合、ターゲット要素の下側に配置
          top = targetBottom + tooltipOffset
        } else {
          // どちらにも十分なスペースがない場合、より近い方に配置
          if (spaceAbove > spaceBelow) {
            // 上側の方が近い場合
            top = tooltipOffset
          } else {
            // 下側の方が近い場合、画面下端に合わせる
            top = window.innerHeight - tooltipHeight - tooltipOffset
          }
        }
      }
      
      // 画面上端を超える場合は調整
      if (top < tooltipOffset) {
        top = tooltipOffset
      }
      
      this.tooltipStyle = {
        top: `${top}px`,
        left: `${left}px`
      }
    },
    
    
    // ツールチップ: 標準の勤務時間を取得
    getTooltipScheduledWorkTime(day) {
      // 常に標準勤務時間を表示
      return '9:00-17:30'
    },
    
    // ツールチップ: 所定休憩時間を取得
    getTooltipScheduledBreakTime(day) {
      // 常に所定休憩時間を表示
      return '12:00-13:00'
    },
    
    // ツールチップ: 休憩時間を取得（複数対応）
    getTooltipBreakTimes(day) {
      if (!day.breakTimes || day.breakTimes.length === 0) {
        return '-'
      }
      return day.breakTimes
        .map(bt => `${bt.startTime}-${bt.endTime}`)
        .join(', ')
    },
    
    // ツールチップ: 総労働時間を取得（出勤から退勤までの時間）
    getTooltipTotalWorkTime(day) {
      if (!day.clockIn || !day.clockOut) {
        return '-'
      }
      
      // 時刻文字列を分割（H:MM形式またはHH:MM形式に対応）
      const parseTime = (timeStr) => {
        if (!timeStr || typeof timeStr !== 'string') return null
        const parts = timeStr.split(':')
        if (parts.length !== 2) return null
        const hour = parseInt(parts[0], 10)
        const minute = parseInt(parts[1], 10)
        if (isNaN(hour) || isNaN(minute)) return null
        return { hour, minute }
      }
      
      const clockIn = parseTime(day.clockIn)
      const clockOut = parseTime(day.clockOut)
      
      if (!clockIn || !clockOut) {
        return '-'
      }
      
      const clockInMinutes = clockIn.hour * 60 + clockIn.minute
      const clockOutMinutes = clockOut.hour * 60 + clockOut.minute
      
      // 24時間を超える場合の処理（日をまたぐ場合）
      let totalMinutes = clockOutMinutes - clockInMinutes
      if (totalMinutes < 0) {
        // 日をまたぐ場合（例: 22:00出勤、翌日2:00退勤）
        totalMinutes = (24 * 60 - clockInMinutes) + clockOutMinutes
      }
      
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      
      return `${hours}:${String(minutes).padStart(2, '0')}`
    },
    
    // ツールチップ: 休憩時間合計を取得
    getTooltipTotalBreakTime(day) {
      if (!day.breakTimes || day.breakTimes.length === 0) {
        return '0:00'
      }
      
      let totalMinutes = 0
      for (const bt of day.breakTimes) {
        const [startHour, startMin] = bt.startTime.split(':').map(Number)
        const [endHour, endMin] = bt.endTime.split(':').map(Number)
        
        const startMinutes = startHour * 60 + startMin
        const endMinutes = endHour * 60 + endMin
        totalMinutes += (endMinutes - startMinutes)
      }
      
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      
      return `${hours}:${String(minutes).padStart(2, '0')}`
    },
    
    // ツールチップ: 休暇時の総労働時間を取得（7:30固定）
    getTooltipTotalWorkTimeForVacation(day) {
      return '7:30'
    },
    
    // 前日までの累積実労働時間を計算（浮動小数点数の誤差を避けるため分単位で計算）
    getPreviousDayCumulativeWorkHours(day) {
      if (!this.attendanceData || this.attendanceData.length === 0) {
        return 0
      }
      
      // 年月を取得（最初の日付から）
      const firstDate = this.attendanceData[0].date
      const [year, month] = firstDate.split('-').map(Number)
      
      // 前日までの実労働時間の合計を分単位で計算（浮動小数点数の誤差を避けるため）
      let totalMinutes = 0
      for (const d of this.attendanceData) {
        // その日より前の日付のみをカウント
        if (d.date >= day.date) break
        if (d.clockIn && d.clockOut && d.actualWorkHours) {
          const hours = parseFloat(d.actualWorkHours) || 0
          // 時間を分に変換（浮動小数点数の誤差を避けるため）
          totalMinutes += Math.round(hours * 60)
        }
      }
      
      // 分を時間に変換
      return totalMinutes / 60
    },
    
    // その日の実労働時間を所定内労働、法定時間内残業、法定時間外残業に分割
    calculateDailyWorkHourBreakdown(day) {
      if (!day.clockIn || !day.clockOut || !day.actualWorkHours) {
        return {
          scheduledWorkHours: 0,
          withinLegalOvertime: 0,
          overLegalOvertime: 0
        }
      }
      
      // 年月を取得
      const [year, month] = day.date.split('-').map(Number)
      
      // 月全体の所定出勤日数を計算
      const scheduledWorkDays = this.getScheduledWorkDaysForMonth(year, month)
      
      // 月の所定労働時間と法定労働時間
      const monthlyScheduledWorkHours = scheduledWorkDays * 7.5
      const monthlyLegalWorkHours = scheduledWorkDays * 8
      
      // 前日までの累積実労働時間
      const previousCumulativeWorkHours = this.getPreviousDayCumulativeWorkHours(day)
      
      // その日の実労働時間
      const dailyActualWorkHours = parseFloat(day.actualWorkHours) || 0
      
      // 月の所定労働時間の残り（浮動小数点数の誤差を考慮して、分単位で計算）
      const remainingScheduledWorkHoursRaw = Math.max(0, monthlyScheduledWorkHours - previousCumulativeWorkHours)
      // 分単位に変換してから時間単位に戻すことで、精度を向上
      const remainingScheduledWorkHoursMinutes = Math.round(remainingScheduledWorkHoursRaw * 60)
      const remainingScheduledWorkHours = remainingScheduledWorkHoursMinutes / 60
      
      // 月の法定労働時間の残り（浮動小数点数の誤差を考慮して、分単位で計算）
      const remainingLegalWorkHoursRaw = Math.max(0, monthlyLegalWorkHours - previousCumulativeWorkHours)
      const remainingLegalWorkHoursMinutes = Math.round(remainingLegalWorkHoursRaw * 60)
      const remainingLegalWorkHours = remainingLegalWorkHoursMinutes / 60
      
      let scheduledWorkHours = 0
      let withinLegalOvertime = 0
      let overLegalOvertime = 0
      
      // 前日までの累積が月の所定労働時間以下の場合
      if (previousCumulativeWorkHours < monthlyScheduledWorkHours) {
        // 所定内労働: 月の所定労働時間の残りまで（分単位で計算して精度を保つ）
        const dailyActualWorkMinutes = Math.round(dailyActualWorkHours * 60)
        const remainingScheduledWorkMinutes = Math.round(remainingScheduledWorkHours * 60)
        const scheduledWorkMinutes = Math.min(dailyActualWorkMinutes, remainingScheduledWorkMinutes)
        scheduledWorkHours = scheduledWorkMinutes / 60
        
        // その日の実労働時間が所定内労働の残りを超えている場合
        const remainingAfterScheduled = dailyActualWorkHours - scheduledWorkHours
        if (remainingAfterScheduled > 0) {
          // 法定時間内残業の残り = 月の法定労働時間の残り - 所定内労働として使った分
          // ただし、前日までの累積が月の所定労働時間以下の場合、法定時間内残業の残りは
          // 月の法定労働時間 - 前日までの累積 - 所定内労働として使った分
          const remainingForLegal = remainingLegalWorkHours - scheduledWorkHours
          withinLegalOvertime = Math.min(remainingAfterScheduled, remainingForLegal)
          
          // 法定時間外残業: それ以上
          overLegalOvertime = remainingAfterScheduled - withinLegalOvertime
        }
      } else {
        // 前日までの累積が月の所定労働時間を超えている場合
        // 所定内労働は表示しない
        
        // 前日までの累積が月の法定労働時間以下の場合
        if (previousCumulativeWorkHours < monthlyLegalWorkHours) {
          // 法定時間内残業: 月の法定労働時間の残りまで
          withinLegalOvertime = Math.min(dailyActualWorkHours, remainingLegalWorkHours)
          
          // 法定時間外残業: それ以上
          overLegalOvertime = dailyActualWorkHours - withinLegalOvertime
        } else {
          // 前日までの累積が月の法定労働時間を超えている場合
          // 法定時間内残業は表示しない
          // 法定時間外残業: その日の実労働時間すべて
          overLegalOvertime = dailyActualWorkHours
        }
      }
      
      return {
        scheduledWorkHours,
        withinLegalOvertime,
        overLegalOvertime
      }
    },
    
    // ツールチップ: 所定内労働時間を取得
    getTooltipScheduledWorkHours(day) {
      if (!day.clockIn || !day.clockOut || !day.actualWorkHours) {
        return '-'
      }
      
      const { scheduledWorkHours } = this.calculateDailyWorkHourBreakdown(day)
      return this.formatHoursToHMM(scheduledWorkHours)
    },
    
    // ツールチップ: 所定内労働を表示するかどうか
    shouldShowScheduledWorkHours(day) {
      if (!day.clockIn || !day.clockOut || !day.actualWorkHours) {
        return false
      }
      
      const { scheduledWorkHours } = this.calculateDailyWorkHourBreakdown(day)
      return scheduledWorkHours > 0
    },
    
    // その日付までの累積労働時間を計算
    calculateCumulativeWorkHours(cutoffDateStr) {
      if (!this.attendanceData || this.attendanceData.length === 0) {
        return { totalWorkHours: 0, scheduledWorkHoursUntilCutoff: 0 }
      }
      
      // 年月を取得（最初の日付から）
      const firstDate = this.attendanceData[0].date
      const [year, month] = firstDate.split('-').map(Number)
      
      // その日付までの実労働時間の合計を計算
      let totalWorkHours = 0
      for (const day of this.attendanceData) {
        if (day.date > cutoffDateStr) break
        if (day.clockIn && day.clockOut && day.actualWorkHours) {
          totalWorkHours += parseFloat(day.actualWorkHours) || 0
        }
      }
      
      // その日付までの所定出勤日数を計算
      const scheduledWorkDaysUntilCutoff = this.getScheduledWorkDaysUntilDate(year, month, cutoffDateStr)
      
      // 所定労働時間（7.5時間/日 × 所定出勤日数）
      const scheduledWorkHoursUntilCutoff = scheduledWorkDaysUntilCutoff * 7.5
      
      return { totalWorkHours, scheduledWorkHoursUntilCutoff }
    },
    
    // ツールチップ: 法定時間内残業を表示するかどうか
    shouldShowMonthlyWithinLegalOvertime(day) {
      if (!day.clockIn || !day.clockOut || !day.actualWorkHours) {
        return false
      }
      
      const { withinLegalOvertime } = this.calculateDailyWorkHourBreakdown(day)
      // 浮動小数点数の誤差を考慮して、分単位で判定（1分以上の場合のみ表示）
      return Math.round(withinLegalOvertime * 60) >= 1
    },
    
    // ツールチップ: 法定時間外残業を表示するかどうか
    shouldShowMonthlyOverLegalOvertime(day) {
      if (!day.clockIn || !day.clockOut || !day.actualWorkHours) {
        return false
      }
      
      const { overLegalOvertime } = this.calculateDailyWorkHourBreakdown(day)
      // 浮動小数点数の誤差を考慮して、分単位で判定（1分以上の場合のみ表示）
      return Math.round(overLegalOvertime * 60) >= 1
    },
    
    // ツールチップ: 法定時間内残業を取得
    getMonthlyWithinLegalOvertime(day) {
      const { withinLegalOvertime } = this.calculateDailyWorkHourBreakdown(day)
      return this.formatHoursToHMM(withinLegalOvertime)
    },
    
    // ツールチップ: 法定時間外残業を取得
    getMonthlyOverLegalOvertime(day) {
      const { overLegalOvertime } = this.calculateDailyWorkHourBreakdown(day)
      return this.formatHoursToHMM(overLegalOvertime)
    },
    
    // その日付までの累積残業時間を計算
    calculateCumulativeOvertime(cutoffDateStr) {
      if (!this.attendanceData || this.attendanceData.length === 0) {
        return { withinLegalOvertime: 0, overLegalOvertime: 0 }
      }
      
      // 年月を取得（最初の日付から）
      const firstDate = this.attendanceData[0].date
      const [year, month] = firstDate.split('-').map(Number)
      
      // その日付までの実労働時間の合計を計算
      let totalWorkHours = 0
      for (const day of this.attendanceData) {
        if (day.date > cutoffDateStr) break
        if (day.clockIn && day.clockOut && day.actualWorkHours) {
          totalWorkHours += parseFloat(day.actualWorkHours) || 0
        }
      }
      
      // 月全体の所定出勤日数を計算（その日付までの日数ではなく、月全体）
      const scheduledWorkDays = this.getScheduledWorkDaysForMonth(year, month)
      
      // 月全体の所定労働時間（7.5時間/日 × 月全体の所定出勤日数）
      const scheduledWorkHours = scheduledWorkDays * 7.5
      
      // 月全体の法定労働時間（8時間/日 × 月全体の所定出勤日数）
      const legalWorkHours = scheduledWorkDays * 8
      
      // 実労働時間が月全体の所定労働時間を超えている場合のみ残業を計算
      let withinLegalOvertime = 0
      let overLegalOvertime = 0
      
      if (totalWorkHours > scheduledWorkHours) {
        // 実労働時間が月全体の所定労働時間を超えている
        const overtimeHours = totalWorkHours - scheduledWorkHours
        
        // 法定時間内残業: 超過分のうち、月全体の法定労働時間以内の部分
        // 上限: (月全体の所定出勤日数 * 8:00) - 月全体の所定労働時間
        const maxWithinLegalOvertime = legalWorkHours - scheduledWorkHours
        withinLegalOvertime = Math.min(overtimeHours, maxWithinLegalOvertime)
        
        // 法定時間外残業: 実労働時間が月全体の法定労働時間を超えた部分
        if (totalWorkHours > legalWorkHours) {
          overLegalOvertime = totalWorkHours - legalWorkHours
        }
      }
      
      return { withinLegalOvertime, overLegalOvertime }
    },
    
    // 月全体の所定出勤日数を計算
    getScheduledWorkDaysForMonth(year, month) {
      const daysInMonth = new Date(year, month, 0).getDate()
      
      let scheduledWorkDays = 0
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day)
        const dayOfWeek = date.getDay()
        
        // 土日を除外
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          continue
        }
        
        // 祝日を除外
        try {
          if (HolidayJp.isHoliday(date)) {
            continue
          }
        } catch (error) {
          // 祝日判定でエラーが発生した場合は、平日として扱う
          console.error('祝日判定エラー:', error)
        }
        
        scheduledWorkDays++
      }
      
      return scheduledWorkDays
    },
    
    // その日付までの所定出勤日数を計算
    getScheduledWorkDaysUntilDate(year, month, cutoffDateStr) {
      const cutoffDate = new Date(cutoffDateStr)
      const cutoffDay = cutoffDate.getDate()
      const daysInMonth = new Date(year, month, 0).getDate()
      
      let scheduledWorkDays = 0
      for (let day = 1; day <= cutoffDay; day++) {
        const date = new Date(year, month - 1, day)
        const dayOfWeek = date.getDay()
        
        // 土日を除外
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          continue
        }
        
        // 祝日を除外
        try {
          if (HolidayJp.isHoliday(date)) {
            continue
          }
        } catch (error) {
          // 祝日判定でエラーが発生した場合は、平日として扱う
          console.error('祝日判定エラー:', error)
        }
        
        scheduledWorkDays++
      }
      
      return scheduledWorkDays
    },
    
    // H:MM形式の時間を小数に変換
    parseHoursToDecimal(timeStr) {
      if (!timeStr || timeStr === '0:00' || timeStr === '-') {
        return 0
      }
      
      const parts = timeStr.split(':')
      if (parts.length !== 2) {
        return 0
      }
      
      const hours = parseInt(parts[0], 10) || 0
      const minutes = parseInt(parts[1], 10) || 0
      
      return hours + minutes / 60
    },
    
    // 時間（小数）をH:MM形式に変換
    formatHoursToHMM(hours) {
      if (!hours || hours === 0) {
        return '0:00'
      }
      
      // 浮動小数点数の誤差を考慮して、分単位で計算
      // 例: 0.75時間 = 45分、0.733333...時間 = 44分
      const totalMinutes = Math.round(hours * 60)
      const wholeHours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      
      return `${wholeHours}:${String(minutes).padStart(2, '0')}`
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

.timesheet-container {
  position: relative;
  width: 100%;
  min-width: 1920px;
  min-height: 1080px;
  padding-top: 158px; /* ヘッダー(90px) + 青色セクション(68px) */
  overflow-y: auto;
  background: rgb(255, 255, 255);
  font-family: Arial, sans-serif;
}

/* Blue Header */
.blue-header {
  position: fixed;
  top: 90px; /* AppHeaderの高さ（90px） */
  left: 0;
  width: 100%;
  height: 68px;
  margin: 0;
  z-index: 999;
}

.header-wrapper {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 68px;
}

/* Rectangle 120: 青色の背景 */
.header-background {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 68px;
}

/* Rectangle 174: 灰色の縦線 */
.divider-line {
  position: absolute;
  left: 91px;
  top: 14px;
  width: 3px;
  height: 47px;
  background-color: rgb(217, 217, 217);
}

/* 勤務表 */
.title-text {
  position: absolute;
  left: 104px;
  top: 16px;
  width: 73px;
  height: 27px;
  color: rgb(255, 255, 255);
  font-size: 23px;
  font-family: Arial;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 部署情報 */
.department-info {
  position: absolute;
  left: 619px;
  top: 27px;
  width: 328px;
  height: 38px;
  color: rgb(255, 255, 255);
  font-size: 15px;
  font-family: Arial;
  text-align: left;
  white-space: pre-line;
}

/* Rectangle 179: 青緑色の矩形 */
.user-background {
  position: absolute;
  right: calc(100% - 1595px - 55px);
  top: 10px;
  width: 55px;
  height: 51px;
  background-color: rgb(129, 153, 175);
}

/* 人物アイコン */
.user-icon {
  position: absolute;
  right: calc(100% - 1609px - 26px);
  top: 17px;
  width: 26px;
  height: 46px;
}

.user-head {
  position: absolute;
  left: 4px;
  top: 0px;
  width: 19px;
  height: 17px;
}

.user-body {
  position: absolute;
  left: 2px;
  top: 18px;
  width: 22px;
  height: 20px;
}

/* ボタン */
.button-green {
  position: absolute;
  right: calc(100% - 1657px - 64px);
  top: 2px;
  width: 64px;
  height: 51px;
  background-color: rgb(179, 210, 44);
  border-radius: 0 0 10px 10px;
}

.button-blue {
  position: absolute;
  right: calc(100% - 1729px - 64px);
  top: 2px;
  width: 64px;
  height: 51px;
  background-color: rgb(94, 168, 197);
  border-radius: 0 0 10px 10px;
}

.button-yellow {
  position: absolute;
  right: calc(100% - 1803px - 64px);
  top: 2px;
  width: 64px;
  height: 51px;
  background-color: rgb(242, 183, 27);
  border-radius: 0 0 10px 10px;
}

/* HELP テキスト */
.help-question {
  position: absolute;
  right: calc(100% - 1820px - 32px);
  top: 5px;
  width: 32px;
  height: 25px;
  color: rgb(255, 255, 255);
  font-size: 28px;
  font-family: Arial;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-text {
  position: absolute;
  right: calc(100% - 1820px - 34px);
  top: 38px;
  width: 34px;
  height: 11px;
  color: rgb(255, 255, 255);
  font-size: 11px;
  font-family: Arial;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* カレンダーアイコン */
.calendar-icon {
  position: absolute;
  right: calc(100% - 1745px - 34px);
  top: 6px;
  width: 34px;
  height: 31px;
}

/* 休暇情報 */
.vacation-info {
  position: absolute;
  right: calc(100% - 1737px - 49px);
  top: 38px;
  width: 49px;
  height: 11px;
  color: rgb(255, 255, 255);
  font-size: 11px;
  font-family: Arial;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ロゴ: 楕円 */
.logo-circle {
  position: absolute;
  left: 30px;
  top: 20px;
  width: 34px;
  height: 32px;
}

/* 時計の針 */
.clock-long-hand {
  position: absolute;
  left: 40px;
  top: 29px;
  width: 15px;
  height: 1px;
  transform: rotate(-90deg);
}

.clock-short-hand {
  position: absolute;
  left: 47px;
  top: 37px;
  width: 8px;
  height: 1px;
}

/* Attendance Sheet テキスト */
.attendance-sheet-text {
  position: absolute;
  left: 85px;
  top: 50px;
  width: 133px;
  height: 19px;
  color: rgb(137, 164, 188);
  font-size: 12px;
  font-family: Arial;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 社員名 */
.employee-name {
  position: absolute;
  right: calc(100% - 1405px - 146px);
  top: 48px;
  width: 146px;
  height: 20px;
  color: rgb(255, 255, 255);
  font-size: 15px;
  font-family: Arial;
  text-align: left;
}

/* テーブル上部操作エリア */
.table-operation-area {
  position: relative;
  width: 100%;
  max-width: 1880px;
  margin: -15px 0 20px 0;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 年月選択（テーブル用） */
.year-month-select {
  padding: 6px 12px;
  font-size: 14px;
  font-family: Arial, sans-serif;
  border: 1px solid rgb(200, 200, 200);
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  outline: none;
}

.year-month-select:hover {
  border-color: rgb(37, 100, 153);
}

.year-month-select:focus {
  border-color: rgb(37, 100, 153);
  box-shadow: 0 0 0 2px rgba(37, 100, 153, 0.1);
}

/* ナビゲーションリンク */
.nav-link {
  padding: 6px 12px;
  font-size: 14px;
  font-family: Arial, sans-serif;
  color: rgb(37, 100, 153);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s;
}

.nav-link:hover {
  color: rgb(25, 158, 214);
  text-decoration: underline;
}

/* 右側のリンクグループ */
.right-links {
  margin-left: auto;
  margin-right: 355px;
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 情報リンク */
.info-link {
  font-size: 14px;
  font-family: Arial, sans-serif;
  color: rgb(37, 100, 153);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s;
}

.info-link:hover {
  color: rgb(25, 158, 214);
  text-decoration: underline;
}

/* ステータス表示 */
.status-display {
  display: inline-flex;
  align-items: center;
}

.status-label {
  font-size: 14px;
  font-family: Arial, sans-serif;
  color: rgb(0, 0, 0);
  white-space: nowrap;
  margin-right: 5px;
}

.status-icon {
  font-size: 14px;
  font-family: Arial, sans-serif;
  color: rgb(37, 100, 153);
  margin: 0 3px;
}

.status-text-display {
  font-size: 14px;
  font-family: Arial, sans-serif;
  color: rgb(37, 100, 153);
  white-space: nowrap;
}

/* 承認申請ボタン */
.approval-request-button {
  padding: 4px 10px;
  font-size: 12px;
  font-family: Arial, sans-serif;
  font-weight: bold;
  color: white;
  background-color: rgb(37, 100, 153);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.approval-request-button:hover {
  background-color: rgb(25, 158, 214);
}

.approval-request-button:active {
  background-color: rgb(30, 83, 125);
}

/* 勤務表テーブル */
.timesheet-table-container {
  position: relative;
  width: 100%;
  max-width: 1880px;
  margin: -35px 0 20px 0;
  padding: 0 20px;
}

/* ローディング表示 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgb(200, 200, 200);
  border-top: 5px solid rgb(37, 100, 153);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay p {
  margin-top: 20px;
  font-size: 16px;
  color: rgb(51, 51, 51);
}

/* エラー表示 */
.error-message {
  padding: 20px;
  margin: 20px;
  background-color: rgb(255, 240, 240);
  border: 1px solid rgb(255, 200, 200);
  border-radius: 4px;
  color: rgb(200, 0, 0);
  text-align: center;
}

.retry-button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: rgb(37, 100, 153);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.retry-button:hover {
  background-color: rgb(25, 158, 214);
}


/* テーブルの縦線を一括管理 */
.table-header,
.table-row {
  background-image: 
    linear-gradient(to right, rgb(235, 235, 235) 1px, transparent 1px),
    linear-gradient(to right, rgb(235, 235, 235) 1px, transparent 1px),
    linear-gradient(to right, rgb(235, 235, 235) 1px, transparent 1px),
    linear-gradient(to right, rgb(235, 235, 235) 1px, transparent 1px),
    linear-gradient(to right, rgb(235, 235, 235) 1px, transparent 1px),
    linear-gradient(to right, rgb(235, 235, 235) 1px, transparent 1px),
    linear-gradient(to right, rgb(235, 235, 235) 1px, transparent 1px),
    linear-gradient(to right, rgb(235, 235, 235) 1px, transparent 1px);
  background-position: 
    82px 0,   /* 日付と勤務状況の間 */
    126px 0,  /* 勤務状況と申請の間 */
    166px 0,  /* 申請と出社の間 */
    219px 0,  /* 出社と退社の間 */
    273px 0,  /* 退社と勤務場所の間 */
    342px 0,  /* 勤務場所と工数の間 */
    385px 0,  /* 工数と時間軸の間 */
    1275px 0; /* 時間軸と備考の間 */
  background-size: 
    1px 100%,
    1px 100%,
    1px 100%,
    1px 100%,
    1px 100%,
    1px 100%,
    1px 100%,
    1px 100%;
  background-repeat: no-repeat;
}

/* 時間軸行（下）には縦線を適用しない */
.time-axis-bottom {
  background-image: none;
}

/* テーブルヘッダー */
.table-header {
  position: relative;
  width: 1487px;
  height: 40px;
  background-color: rgb(247, 247, 247);
  border: 1px solid rgb(235, 235, 235);
  display: flex;
  align-items: center;
  font-size: 13px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
}

/* 時間軸行（下） */
.time-axis-bottom {
  height: 30px;
  background-color: rgb(247, 247, 247);
}


.header-date {
  position: absolute;
  left: 28px;
  width: 45px;
  text-align: left;
}

.header-work-status {
  position: absolute;
  left: 77px;
  width: 52px;
  text-align: center;
  line-height: 1.2;
}

.header-approval {
  position: absolute;
  left: 134px;
  width: 30px;
  text-align: left;
}

.header-clock-in {
  position: absolute;
  left: 180px;
  width: 27px;
  text-align: left;
}

.header-clock-out {
  position: absolute;
  left: 233px;
  width: 27px;
  text-align: left;
}

.header-location {
  position: absolute;
  left: 282px;
  width: 55px;
  text-align: left;
}

.header-work-hours {
  position: absolute;
  left: 350px;
  width: 27px;
  text-align: left;
}

.header-graph {
  position: absolute;
  left: 392px;
  width: 1087px;
  font-size: 14px;
  height: 100%;
}

.time-label {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-family: Arial, sans-serif;
  color: rgb(51, 51, 51);
}

.header-remarks {
  position: absolute;
  left: 1360px;
  width: 27px;
  text-align: right;
}

/* テーブル行 */
.table-row {
  position: relative;
  width: 1487px;
  height: 27px;
  border: 1px solid rgb(235, 235, 235);
  display: flex;
  align-items: center;
  font-size: 14px;
  font-family: Arial, sans-serif;
  background-color: white;
  color: rgb(0, 0, 0);
}


/* 行の背景色 */
.sunday-row {
  background-color: rgb(255, 232, 217);
  height: 24px;
}

.saturday-row {
  background-color: rgb(232, 245, 255);
}

.vacation-row {
  background-color: #FFCFA5;
}

/* セル */
.cell-date {
  position: absolute;
  left: 22px;
  width: 60px;
  text-align: right;
  padding-right: 5px;
}

/* 日付の数字部分（常に黒色） */
.date-number {
  color: rgb(0, 0, 0);
}

/* 日付の曜日部分 */
.date-day-of-week {
  color: rgb(0, 0, 0); /* デフォルトは黒色 */
}

/* 曜日の色 */
.sunday-text {
  color: rgb(255, 0, 0); /* 赤色 */
}

.saturday-text {
  color: rgb(0, 0, 255); /* 青色 */
}

.cell-work-status {
  position: absolute;
  left: 96px;
  width: 18px;
  height: 18px;
}

.nikori-icon {
  width: 18px;
  height: 18px;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nikori-icon svg {
  pointer-events: none;
}

.warning-icon {
  width: 18px;
  height: 18px;
  cursor: default;
}

.icon-circle-blue {
  width: 18px;
  height: 18px;
  background-color: rgb(94, 168, 198);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 打刻時刻と入力時刻が異なる場合の警告アイコン */
.stamp-manual-mismatch-icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
}

.icon-circle-yellow {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #FFFF4D; /* 黄色 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-exclamation {
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.icon-exclamation-black {
  color: rgb(0, 0, 0);
  font-size: 14px;
  font-weight: bold;
}

.cell-approval {
  position: absolute;
  left: 138px;
  width: 17px;
  height: 17px;
}

.plus-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 17px;
  height: 17px;
  z-index: 11;
  position: relative;
  top: 1px;
}

.daily-confirm-button {
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 17px;
  height: 17px;
  z-index: 1;
}

.plus-icon-circle {
  position: relative;
  width: 17px;
  height: 17px;
  background-color: rgb(217, 217, 217);
  border-radius: 50%;
}

.plus-icon-vertical {
  position: absolute;
  left: 7px;
  top: 4px;
  width: 3px;
  height: 9px;
  background-color: rgb(255, 255, 255);
}

.plus-icon-horizontal {
  position: absolute;
  left: 4px;
  top: 7px;
  width: 9px;
  height: 3px;
  background-color: rgb(255, 255, 255);
}

.check-icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 17px;
  height: 17px;
  background-color: rgb(37, 100, 153);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pending-icon.clickable-icon {
  cursor: pointer;
}

.pending-icon.clickable-icon:hover {
  opacity: 0.8;
}

.check-icon.clickable-icon {
  cursor: pointer;
}

.check-icon.clickable-icon:hover {
  opacity: 0.8;
}

.pending-icon {
  position: relative;
  top: 1px;
  width: 17px;
  height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pending-icon-daily {
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 17px;
  height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon-daily {
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 17px;
  height: 17px;
  background-color: rgb(37, 100, 153);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell-clock-in {
  position: absolute;
  left: 169px;
  width: 50px;
  text-align: left;
}

.cell-clock-out {
  position: absolute;
  left: 222px;
  width: 50px;
  text-align: left;
}

.time-text {
  font-size: 12px;
  color: rgb(0, 0, 0);
  text-align: center;
  display: inline-block;
  width: 100%;
  height: 22px;
  line-height: 18px;
  padding: 2px 2px;
  box-sizing: border-box;
}

/* 出社・退社列のテキストボックス（編集可能状態） */
.time-input-cell {
  width: 100%;
  height: 22px;
  font-size: 12px;
  color: rgb(0, 0, 0);
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 2px;
  background-color: #fff;
  cursor: pointer;
  padding: 2px 2px;
  box-sizing: border-box;
}


.time-input-cell:focus {
  outline: none;
  border: 1px solid #ccc;
  box-shadow: none;
}

.time-input-cell.manual-bg {
  background-color: rgb(255, 255, 0);
}

.manual-bg {
  background-color: rgb(255, 255, 0);
  padding: 2px 4px;
}

/* 勤務場所テキストボックス */
.location-input-cell {
  width: 100%;
  height: 22px;
  font-size: 12px;
  color: rgb(0, 0, 0);
  text-align: left;
  border: 1px solid #ccc;
  border-radius: 2px;
  background-color: #fff;
  cursor: pointer;
  padding: 2px 4px;
  box-sizing: border-box;
}


.location-text {
  font-size: 12px;
  color: rgb(0, 0, 0);
  display: inline-block;
  width: 100%;
  text-align: left;
  height: 22px;
  line-height: 18px;
  padding: 2px 4px;
  box-sizing: border-box;
}

/* 土日祝の勤務場所ラベルを右にずらす */
.cell-location.no-interaction .location-text {
  padding: 2px 4px;
}

/* クリック可能なセル */
.clickable-cell {
  cursor: pointer;
  display: inline-block;
  min-width: 100%;
  min-height: 20px;
}

.clickable-cell:hover {
  background-color: rgba(33, 150, 243, 0.1);
}

.empty-cell {
  display: inline-block;
  min-width: 100%;
  min-height: 20px;
}

.cell-clock-in,
.cell-clock-out,
.cell-location {
  cursor: pointer;
}

.cell-clock-in:hover,
.cell-clock-out:hover,
.cell-location:hover {
  background-color: rgba(33, 150, 243, 0.1);
}

/* 土日祝のセルはクリック不可・ハイライトなし */
.cell-clock-in.no-interaction,
.cell-clock-out.no-interaction,
.cell-location.no-interaction {
  cursor: default;
}

.cell-clock-in.no-interaction:hover,
.cell-clock-out.no-interaction:hover,
.cell-location.no-interaction:hover {
  background-color: transparent;
}

/* 申請中のセルはハイライトなし（クリックは可能） */
.cell-clock-in.no-highlight:hover,
.cell-clock-out.no-highlight:hover,
.cell-location.no-highlight:hover {
  background-color: transparent;
}

.clickable-cell.no-highlight:hover {
  background-color: transparent;
}

.cell-location {
  position: absolute;
  left: 278px;
  width: 60px;
  font-size: 13px;
  text-align: left;
}

.cell-work-hours {
  position: absolute;
  left: 356px;
  width: 35px;
  text-align: left;
}

.work-hours-link {
  font-size: 13px;
  color: rgb(61, 59, 254);
  text-decoration: underline;
  margin-left: -4px;
}

.work-hours-link:hover {
  color: rgb(100, 100, 255);
}

.work-hours-error {
  position: absolute;
  left: -12px;
  top: 1px;
  font-size: 18px;
  color: #c00;
  font-weight: bold;
  line-height: 17px;
}

.cell-graph {
  position: absolute;
  left: 392px;
  width: 1087px;
  height: 100%;
  cursor: default;
}

/* 時間軸の罫線 */
.time-axis-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.time-line {
  position: absolute;
  top: 0;
  width: 1px;
  height: 100%;
}

.time-line-normal {
  background-color: rgb(228, 228, 228); /* #E4E4E4 */
}

.time-line-bold {
  background-color: rgb(198, 198, 198); /* #C6C6C6 */
}

.work-graph {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.graph-bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 11px;
  z-index: 2;
  cursor: pointer;
  pointer-events: auto;
}

/* 所定内労働セグメント */
.graph-bar-scheduled {
  background-color: #4B9EE4;
}

/* 法定時間内残業セグメント */
.graph-bar-within-legal {
  background-color: #B0B000;
}

/* 法定時間外残業セグメント */
.graph-bar-over-legal {
  background-color: #E28E1C;
}

/* 標準勤務時間帯のグレー長方形（平日のみ） */
.scheduled-work-time-bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 11px;
  background-color: rgb(228, 228, 228); /* グレー */
  z-index: 1; /* 勤務時間バーの下に表示 */
  cursor: pointer;
  pointer-events: auto;
}

/* 有給休暇または夏季休暇の所定内労働時間帯（薄い青） */
.vacation-work-time-bar {
  background-color: #4B9EE4; /* 薄い青 */
  z-index: 1;
}

/* 代休の所定内労働時間帯（#1A69AB） */
.compensatory-work-time-bar {
  background-color: #1A69AB; /* 青色 */
  z-index: 1;
}

/* 有給休暇または夏季休暇の細い白線 */
.vacation-white-line {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 1px;
  background-color: rgb(255, 255, 255); /* 白 */
  z-index: 3; /* グラフバーの上に表示 */
  pointer-events: none;
}

/* 休憩時間のグレー長方形（休日出勤申請が承認されている場合） */
.scheduled-break-time-bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 11px;
  background-color: #BBBBBB; /* 濃いグレー */
  z-index: 1; /* 勤務時間バーの下に表示 */
  cursor: pointer;
  pointer-events: auto;
}

/* 有給休暇または夏季休暇の休憩時間の長方形 */
.vacation-break-time-bar {
  background-color: #1A69AB !important; /* 青色（優先順位を上げる） */
  z-index: 2; /* 所定内労働時間帯の上に表示 */
}

/* 代休の休憩時間の長方形（#1A69AB） */
.compensatory-break-time-bar {
  background-color: #1A69AB !important; /* 青色（優先順位を上げる） */
  z-index: 2; /* 所定内労働時間帯の上に表示 */
}

/* 休憩時間の四角形 */
.break-time-bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 11px;
  z-index: 2;
  cursor: pointer;
  pointer-events: auto;
}

/* 出退勤時刻マーカー（▼マーク） */
.clock-marker {
  position: absolute;
  transform: translate(-50%, -100%);
  z-index: 3;
  pointer-events: none;
}

/* 有給休暇または夏季休暇のオレンジ色のアイコンマーカー */
.vacation-application-marker {
  position: absolute;
  transform: translate(-50%, 0);
  z-index: 4;
  pointer-events: none;
}

/* 休日出勤申請マーカー（緑の↑マーク） */
.holiday-work-application-marker {
  position: absolute;
  transform: translate(-50%, 0);
  z-index: 3;
  pointer-events: none;
}

.cell-remarks {
  position: absolute;
  left: 1280px;
  width: 200px;
  height: 17px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  pointer-events: auto;
}

.cell-remarks .plus-button {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  pointer-events: auto;
}

.remarks-text {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 180px;
  height: 17px;
  font-size: 12px;
  color: rgb(0, 0, 0);
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  z-index: 100;
  pointer-events: auto;
  background-color: transparent;
  text-decoration: none;
  line-height: 17px;
}

.remarks-text:hover {
  text-decoration: none;
}

/* テーブル右下のリンクとボタン */
.table-bottom-links {
  position: relative;
  width: 100%;
  max-width: 1455px;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 20px;
  padding: 0 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
}

/* Bottom: 月次サマリー情報 */
.bottom-summary {
  position: relative;
  left: 40px;
  width: 532px;
  height: 85px;
  margin-top: -40px;
  margin-bottom: 50px;
}

/* 左側グループ */
.summary-group-left {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 260px;
  height: 85px;
}

.summary-background-left {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 260px;
  height: 85px;
  background-color: rgb(213, 228, 233);
}

.summary-label-left {
  position: absolute;
  left: 14px;
  width: 79px;
  font-size: 12px;
  font-family: Arial;
  color: rgb(128, 145, 183);
  white-space: nowrap;
}

.summary-divider-left {
  position: absolute;
  left: 166px;
  top: 0px;
  width: 1px;
  height: 85px;
  background-color: rgb(255, 255, 255);
}

.summary-value-left {
  position: absolute;
  font-size: 12px;
  font-family: Arial;
  color: rgb(0, 0, 0);
  white-space: nowrap;
  text-align: right;
}

/* 右側グループ */
.summary-group-right {
  position: absolute;
  left: 272px;
  top: 0px;
  width: 260px;
  height: 85px;
}

.summary-background-right {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 260px;
  height: 85px;
  background-color: rgb(213, 228, 233);
}

.summary-label-right {
  position: absolute;
  left: 14px;
  font-size: 12px;
  font-family: Arial;
  color: rgb(128, 145, 183);
  white-space: nowrap;
}

.summary-divider-right {
  position: absolute;
  left: 166px;
  top: 0px;
  width: 1px;
  height: 85px;
  background-color: rgb(255, 255, 255);
}

.summary-value-right {
  position: absolute;
  font-size: 12px;
  font-family: Arial;
  color: rgb(0, 0, 0);
  white-space: nowrap;
  text-align: right;
}

/* 備考ダイアログ（モーダル） */
.remarks-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.remarks-dialog-container {
  position: relative;
  width: 552px;
  height: 241px;
  background-color: transparent;
}

.remarks-dialog-border {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 552px;
  height: 241px;
  z-index: 1;
}

.remarks-dialog-header-bg {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 552px;
  height: 38px;
  z-index: 2;
}

.remarks-dialog-title {
  position: absolute;
  left: 19px;
  top: 6px;
  width: 41.4px;
  height: 23.99px;
  font-size: 18px;
  font-family: Arial;
  font-weight: bold;
  text-align: center;
  color: rgb(51, 51, 51);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.remarks-dialog-close {
  position: absolute;
  left: 526px;
  top: 1px;
  width: 12.42px;
  height: 22.58px;
  font-size: 21px;
  font-family: Arial;
  text-align: center;
  color: rgb(143, 174, 203);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  transition: color 0.2s;
}

.remarks-dialog-close:hover {
  color: rgb(100, 130, 160);
}

.remarks-dialog-date {
  position: absolute;
  left: 22px;
  top: 47px;
  width: 207px;
  height: 20px;
  font-size: 17px;
  font-family: Arial;
  text-align: left;
  color: rgb(51, 51, 51);
  display: flex;
  align-items: center;
  z-index: 3;
}

.remarks-info-banner {
  position: absolute;
  left: 22px;
  top: 70px;
  width: 496px;
  padding: 2px 8px;
  background-color: rgb(255, 255, 0); /* 黄色の背景 */
  color: rgb(0, 0, 0); /* 黒文字 */
  font-size: 14px;
  font-family: Arial;
  text-align: left;
  z-index: 3;
  border-radius: 2px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.remarks-dialog-textbox-bg {
  position: absolute;
  left: 22px;
  top: 95px;
  width: 496px;
  height: 106px;
  z-index: 2;
}

.remarks-dialog-textarea {
  position: absolute;
  left: 26px;
  top: 80px;
  width: 488px;
  height: 102px;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: Arial;
  padding: 5px;
  resize: none;
  background-color: transparent;
  z-index: 3;
  color: rgb(0, 0, 0);
}

.remarks-textarea-disabled {
  background-color: rgb(240, 240, 240);
  color: rgb(100, 100, 100);
  cursor: not-allowed;
}

.remarks-dialog-register-bg {
  position: absolute;
  left: 197px;
  top: 203px;
  width: 46px;
  height: 30px;
  background-color: rgb(16, 141, 197);
  border-radius: 0px;
  cursor: pointer;
  z-index: 2;
  transition: background-color 0.2s;
}

.remarks-dialog-register-bg:hover {
  background-color: rgb(20, 160, 220);
}

.remarks-dialog-register-text {
  position: absolute;
  left: 202px;
  top: 208px;
  width: 35.88px;
  height: 21.17px;
  font-size: 16px;
  font-family: Arial;
  font-weight: bold;
  text-align: center;
  color: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  pointer-events: none;
}

.remarks-dialog-cancel {
  position: absolute;
  left: 253px;
  top: 208px;
  width: 89.7px;
  height: 21.17px;
  font-size: 13px;
  font-family: Arial;
  text-align: center;
  text-decoration: underline;
  color: rgb(118, 130, 255);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  transition: color 0.2s;
}

.remarks-dialog-cancel:hover {
  color: rgb(150, 160, 255);
}

.remarks-dialog-close-button {
  position: absolute;
  left: 245px;
  top: 208px;
  width: 60px;
  height: 21.17px;
  font-size: 13px;
  font-family: Arial;
  text-align: center;
  color: rgb(118, 130, 255);
  text-decoration: underline;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  transition: color 0.2s;
}

.remarks-dialog-close-button:hover {
  color: rgb(150, 160, 255);
}

/* 認証エラーダイアログ（モーダル） */
.auth-error-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
}

.auth-error-dialog-container {
  position: relative;
  width: 552px;
  height: 231px;
  background-color: transparent;
}

.auth-error-dialog-border {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 552px;
  height: 231px;
  z-index: 1;
}

.auth-error-dialog-header-bg {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 552px;
  height: 38px;
  z-index: 2;
}

.auth-error-dialog-title {
  position: absolute;
  left: 19px;
  top: 12px;
  width: 41.4px;
  height: 23.99px;
  font-size: 18px;
  font-family: Arial;
  font-weight: bold;
  text-align: center;
  color: rgb(51, 51, 51);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.auth-error-dialog-message {
  position: absolute;
  left: 22px;
  top: 60px;
  width: 508px;
  height: 100px;
  font-size: 16px;
  font-family: Arial;
  text-align: center;
  color: rgb(51, 51, 51);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.auth-error-dialog-ok-bg {
  position: absolute;
  left: 253px;
  top: 193px;
  width: 46px;
  height: 30px;
  background-color: rgb(16, 141, 197);
  border-radius: 0px;
  cursor: pointer;
  z-index: 2;
  transition: background-color 0.2s;
}

.auth-error-dialog-ok-bg:hover {
  background-color: rgb(20, 160, 220);
}

/* 確認ダイアログ（日次確定申請用） */
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.confirm-dialog-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  min-width: 400px;
  max-width: 500px;
  overflow: hidden;
}

.confirm-dialog-header {
  background-color: #D7EBFF;
  padding: 15px 20px;
  border-radius: 8px 8px 0 0;
}

.confirm-dialog-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.confirm-dialog-body {
  padding: 30px 20px;
}

.confirm-dialog-message {
  font-size: 14px;
  color: #333;
  text-align: center;
  line-height: 1.6;
  margin: 0;
}

.confirm-dialog-footer {
  padding: 12px 20px 20px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.confirm-dialog-ok-button {
  padding: 10px 24px;
  background-color: rgb(37, 100, 153);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  min-width: 80px;
}

.confirm-dialog-ok-button:hover {
  background-color: rgb(25, 80, 133);
}

.confirm-dialog-cancel-button {
  padding: 10px 24px;
  background-color: rgb(100, 100, 100);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  min-width: 80px;
}

.confirm-dialog-cancel-button:hover {
  background-color: rgb(80, 80, 80);
}

/* エラーチェックダイアログ（日次確定申請チェック用） */
.error-check-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.error-check-dialog-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  min-width: 400px;
  max-width: 500px;
  overflow: hidden;
}

.error-check-dialog-header {
  background-color: #D7EBFF;
  padding: 15px 20px;
  border-radius: 8px 8px 0 0;
}

.error-check-dialog-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.error-check-dialog-body {
  padding: 30px 20px;
}

.error-check-dialog-message {
  font-size: 14px;
  color: #333;
  text-align: center;
  line-height: 1.6;
  margin: 0;
}

.error-check-dialog-footer {
  padding: 12px 20px 20px;
  text-align: center;
}

.error-check-dialog-ok-button {
  padding: 10px 24px;
  background-color: rgb(37, 100, 153);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  min-width: 80px;
}

.error-check-dialog-ok-button:hover {
  background-color: rgb(25, 80, 133);
}

.auth-error-dialog-ok-text {
  position: absolute;
  left: 258px;
  top: 198px;
  width: 35.88px;
  height: 21.17px;
  font-size: 16px;
  font-family: Arial;
  font-weight: bold;
  text-align: center;
  color: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  pointer-events: none;
}

/* グラフツールチップ */
.graph-tooltip {
  position: fixed;
  z-index: 10002;
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(200, 200, 200);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 10px 12px;
  min-width: 250px;
  max-width: 300px;
  width: 280px;
  pointer-events: none;
  max-height: 80vh;
  overflow-y: auto;
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ツールチップ見出し */
.tooltip-header {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-family: Arial, sans-serif;
  font-weight: bold;
  color: rgb(0, 0, 0);
  margin-bottom: 2px;
}

.tooltip-header-text {
  color: rgb(0, 0, 0);
}

/* ツールチップアイコン */
.tooltip-icon {
  font-size: 10px;
  line-height: 1;
  margin-right: 2px;
  flex-shrink: 0;
}

.tooltip-icon-gray {
  color: rgb(100, 100, 100);
}

.tooltip-icon-blue {
  color: rgb(37, 100, 153);
}

.tooltip-icon-light-blue {
  color: #4B9EE4; /* 所定内労働用 */
}

.tooltip-icon-yellow {
  color: #B0B000; /* 法定時間内残業用 */
}

.tooltip-icon-orange {
  color: #E28E1C; /* 法定時間外残業用 */
}

/* 区切り線 */
.tooltip-divider {
  height: 1px;
  background-color: rgb(200, 200, 200);
  margin: 4px 0;
}

.tooltip-row {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-family: Arial, sans-serif;
  line-height: 1.4;
  gap: 8px;
}

.tooltip-label {
  color: rgb(100, 100, 100);
  white-space: nowrap;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tooltip-value {
  color: rgb(0, 0, 0);
  text-align: left;
  font-weight: normal;
  word-break: break-word;
  flex-shrink: 0;
  margin-left: auto;
  padding-left: 8px;
}

</style>






