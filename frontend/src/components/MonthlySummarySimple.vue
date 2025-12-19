<template>
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
      <span v-if="monthlySummary" class="summary-value-left" style="top: 4px; right: 14px;">
        {{ monthlySummary.scheduledWorkDays }}日
      </span>
      
      <!-- 実出勤日数 -->
      <span v-if="monthlySummary" class="summary-value-left" style="top: 23px; right: 14px;">
        {{ monthlySummary.actualWorkDays }}日
      </span>
      
      <!-- 所定労働時間 -->
      <span v-if="monthlySummary" class="summary-value-left" style="top: 46px; right: 14px;">
        {{ monthlySummary.scheduledWorkHours }}
      </span>
      
      <!-- 総労働時間 -->
      <span v-if="monthlySummary" class="summary-value-left" style="top: 66px; right: 14px;">
        {{ monthlySummary.totalWorkHours }}
      </span>
    </div>
    
    <!-- Group 7 (右側) -->
    <div class="summary-group-right">
      <!-- 背景 -->
      <div class="summary-background-right"></div>
      
      <!-- 過不足時間 (MM/DDまで) -->
      <span v-if="monthlySummary && monthlySummary.cutoffDate" class="summary-label-right" style="top: 4px;">
        過不足時間 ({{ monthlySummary.cutoffDate }}まで)
      </span>
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
      <span v-if="monthlySummary" 
            class="summary-value-right" 
            :class="{ 'negative': monthlySummary.overUnderTime && monthlySummary.overUnderTime.trim().startsWith('-') }"
            style="top: 6px; right: 14px;">
        {{ monthlySummary.overUnderTime }}
      </span>
      
      <!-- 法定休日労働 -->
      <span v-if="monthlySummary" class="summary-value-right" style="top: 25px; right: 14px;">
        {{ monthlySummary.legalHolidayWork }}
      </span>
      
      <!-- 法定時間内残業 -->
      <span v-if="monthlySummary" class="summary-value-right" style="top: 46px; right: 14px;">
        {{ monthlySummary.withinLegalOvertime }}
      </span>
      
      <!-- 法定時間外残業 -->
      <span v-if="monthlySummary" class="summary-value-right" style="top: 67px; right: 14px;">
        {{ monthlySummary.overLegalOvertime }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MonthlySummarySimple',
  props: {
    monthlySummary: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped>
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

.summary-value-right.negative {
  color: rgb(0, 0, 0);
}
</style>
