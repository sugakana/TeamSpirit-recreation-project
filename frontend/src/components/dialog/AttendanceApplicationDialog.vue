<template>
  <div v-if="visible" class="dialog-overlay" @click.self="closeDialog">
    <div class="dialog-container">
      <!-- ヘッダー部分（青色バー）-->
      <div class="dialog-header">
        <span class="dialog-title">勤怠関連申請</span>
        <button class="close-button" @click="closeDialog">×</button>
      </div>
      
      <!-- 日付表示 -->
      <div class="date-display">{{ formattedDate }}</div>
      
      <!-- メニュー画面 -->
      <div v-if="currentTab === 'menu'" class="content-area">
        <!-- タブリスト-->
        <div class="tab-list">
          <div class="tab active">
            <span class="tab-title">メニュー</span>
          </div>
          <div v-if="activeApplicationTab" class="tab" @click="switchTab(activeApplicationTab)">
            <span class="tab-title">{{ getTabName(activeApplicationTab) }}</span>
            <button class="tab-close-button" @click.stop="closeApplicationTab">×</button>
          </div>
        </div>
        
        <!-- メインコンテンツエリア -->
        <div class="main-content-area">
          <!-- 左側のメニューリスト-->
          <div class="menu-list">
            <button 
              class="menu-item" 
              :class="{ 
                'menu-item-disabled': isDailyConfirmationDisabled || isPendingOrApproved('dailyConfirmation')
              }"
              :disabled="isDailyConfirmationDisabled || isPendingOrApproved('dailyConfirmation')"
              @click="selectMenuItem('dailyConfirmation')"
            >
              日次確定
            </button>
            <button 
              class="menu-item" 
              :class="{ 
                'menu-item-disabled': isVacationDisabled || isPendingOrApproved('vacation')
              }"
              :disabled="isVacationDisabled || isPendingOrApproved('vacation')"
              @click="selectMenuItem('vacation')"
            >
              休暇申請
            </button>
            <button 
              class="menu-item" 
              :class="{ 
                'menu-item-disabled': isHolidayWorkDisabled || isPendingOrApproved('holidayWork')
              }"
              :disabled="isHolidayWorkDisabled || isPendingOrApproved('holidayWork')"
              @click="selectMenuItem('holidayWork')"
            >
              休日出勤申請
            </button>
            <button 
              class="menu-item" 
              :class="{ 
                'menu-item-disabled': isOvertimeDisabled || isPendingOrApproved('overtime')
              }"
              :disabled="isOvertimeDisabled || isPendingOrApproved('overtime')"
              @click="selectMenuItem('overtime')"
            >
              残業申請
            </button>
            <button 
              class="menu-item" 
              :class="{ 
                'menu-item-disabled': isEarlyWorkDisabled || isPendingOrApproved('earlyWork')
              }"
              :disabled="isEarlyWorkDisabled || isPendingOrApproved('earlyWork')"
              @click="selectMenuItem('earlyWork')"
            >
              早朝勤務申請
            </button>
            <button 
              class="menu-item"
              :class="{ 
                'menu-item-disabled': isPendingOrApproved('transfer')
              }"
              :disabled="isPendingOrApproved('transfer')"
              @click="selectMenuItem('transfer')"
            >
              振替申請
            </button>
          </div>
          
          <!-- 右側の説明文 -->
          <div class="menu-descriptions">
            <p 
              v-for="(description, key) in menuDescriptions" 
              :key="key"
              class="menu-description"
            >
              {{ description }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- 日次確定申請フォーム -->
      <div v-if="currentTab === 'dailyConfirmation'" class="content-area">
        <!-- タブリスト-->
        <div class="tab-list">
          <div class="tab active" @click="switchToMenu">
            <span class="tab-title">メニュー</span>
          </div>
          <div class="tab active">
            <span class="tab-title">{{ getTabName(currentTab) }}</span>
            <button class="tab-close-button" @click="closeApplicationTab">×</button>
          </div>
        </div>
        
        <div class="form-container daily-confirmation-container">
          <div class="daily-confirmation-content">
            <div class="daily-confirmation-fields">
              <div class="form-row">
                <label class="form-label">出退社時刻</label>
                <div class="daily-confirmation-value">{{ dailyConfirmationForm.clockInOut }}</div>
              </div>
              
              <div class="form-row">
                <label class="form-label">休憩時間</label>
                <div class="daily-confirmation-value">{{ dailyConfirmationForm.breakTime }}</div>
              </div>
              
              <div class="form-row">
                <label class="form-label">総労働時間</label>
                <div class="daily-confirmation-value">{{ dailyConfirmationForm.totalWorkHours }}</div>
              </div>
              
              <div class="form-row">
                <label class="form-label">実労働時間</label>
                <div class="daily-confirmation-value">{{ dailyConfirmationForm.actualWorkHours }}</div>
              </div>
              
              <div class="form-row form-row-textarea">
                <label class="form-label">備考</label>
                <textarea 
                  v-model="dailyConfirmationForm.remark"
                  class="textarea-input daily-confirmation-textarea"
                  rows="1"
                  :disabled="!isEditable('dailyConfirmation')"
                  :readonly="!isEditable('dailyConfirmation')"
                ></textarea>
              </div>
              
              <!-- エラーメッセージ表示 -->
              <div v-if="dailyConfirmationError" class="form-row">
                <div class="daily-confirmation-error-message">{{ dailyConfirmationError }}</div>
              </div>
              
              <!-- 申請情報セクション（申請中または承認済みの場合のみ表示） -->
              <div v-if="isPendingOrApproved('dailyConfirmation')" class="application-info-section">
                <div class="form-row">
                  <label class="form-label form-label-inline">申請日時</label>
                  <div class="daily-confirmation-value daily-confirmation-value-inline">{{ formatApplicationDate('dailyConfirmation') }}</div>
                </div>
                
                <div class="form-row">
                  <label class="form-label form-label-inline">状況</label>
                  <div class="daily-confirmation-value daily-confirmation-value-inline">{{ formatStatus('dailyConfirmation') }}</div>
                </div>
                
                <!-- 承認履歴テーブル -->
                <div class="form-row form-row-full-width">
                  <label class="form-label form-label-inline">承認履歴</label>
                  <div class="approval-history-container">
                    <table class="approval-history-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>日時</th>
                          <th>状況</th>
                          <th>実行者</th>
                          <th>コメント</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(history, index) in getApprovalHistory('dailyConfirmation')" :key="index">
                          <td>{{ history.seqNo }}</td>
                          <td>{{ history.actionDateTime }}</td>
                          <td>{{ history.status }}</td>
                          <td>{{ history.actorName }}</td>
                          <td>{{ history.comment || '' }}</td>
                        </tr>
                        <tr v-if="getApprovalHistory('dailyConfirmation').length === 0">
                          <td colspan="5" class="no-history">承認履歴はありません</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="daily-confirmation-buttons">
              <button 
                v-if="!isPendingOrApproved('dailyConfirmation')" 
                class="submit-button daily-confirmation-submit" 
                @click="submitDailyConfirmation"
                :disabled="currentTab === 'menu'"
              >
                承認申請
              </button>
              <button 
                v-if="isPendingOrApproved('dailyConfirmation')" 
                class="cancel-button cancel-application-button" 
                @click="cancelDailyConfirmation"
                :disabled="currentTab === 'menu'"
              >
                {{ getCancelButtonLabel('dailyConfirmation') }}
              </button>
              <a href="#" class="cancel-link" @click.prevent="closeApplicationTab">キャンセル</a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 休暇申請フォーム -->
      <div v-if="currentTab === 'vacation'" class="content-area">
        <!-- タブリスト-->
        <div class="tab-list">
          <div class="tab active" @click="switchToMenu">
            <span class="tab-title">メニュー</span>
          </div>
          <div class="tab active">
            <span class="tab-title">{{ getTabName(currentTab) }}</span>
            <button class="tab-close-button" @click="closeApplicationTab">×</button>
          </div>
        </div>
        
        <div class="form-container">
          <div class="form-content-wrapper">
            <div class="form-content-left">
              <!-- 申請中または承認済みの場合：読み取り専用の詳細表示 -->
              <template v-if="isPendingOrApproved('vacation')">
                <div class="form-group form-group-inline">
                  <label class="label-inline">休暇種類</label>
                  <div class="info-text info-text-inline">{{ getVacationTypeName(vacationForm.vacationType) }}</div>
                </div>
                
                <div v-if="vacationForm.vacationType === 'PAID_LEAVE'" class="form-group form-group-inline">
                  <label class="label-inline">有休残日数</label>
                  <div class="info-text info-text-inline">{{ Math.floor(paidLeaveBalance) }}日</div>
                </div>
                
                <div v-if="vacationForm.vacationType !== 'SUBSTITUTE_HOLIDAY'" class="form-group form-group-inline">
                  <label class="label-inline">期間</label>
                  <div class="info-text info-text-inline">
                    {{ this.formatDate(vacationForm.startDate) }}
                    <span v-if="vacationForm.enableEndDate && vacationForm.endDate && vacationForm.endDate !== vacationForm.startDate">
                      ～ {{ this.formatDate(vacationForm.endDate) }}
                    </span>
                  </div>
                </div>
                
                <div class="form-group form-group-inline form-group-compact">
                  <label class="label-inline label-top-aligned">備考</label>
                  <div class="info-text info-text-inline info-text-multiline">{{ vacationForm.reason || '' }}</div>
                </div>
                
                <div class="form-group form-group-inline form-group-compact">
                  <label class="label-inline">連絡先</label>
                  <div class="info-text info-text-inline">{{ vacationForm.contact || '' }}</div>
                </div>
                
                <!-- 申請情報セクション -->
                <div class="application-info-section">
                  <div class="form-group form-group-inline">
                    <label class="label-inline">申請日時</label>
                    <div class="info-text info-text-inline">{{ formatApplicationDate('vacation') }}</div>
                  </div>
                  
                  <div class="form-group form-group-inline">
                    <label class="label-inline">状況</label>
                    <div class="info-text info-text-inline">{{ formatStatus('vacation') }}</div>
                  </div>
                  
                  <!-- 承認履歴テーブル -->
                  <div class="form-group form-group-inline form-group-full-width">
                    <label class="label-inline">承認履歴</label>
                    <div class="approval-history-container">
                      <table class="approval-history-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>日時</th>
                            <th>状況</th>
                            <th>実行者</th>
                            <th>コメント</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(history, index) in getApprovalHistory('vacation')" :key="index">
                            <td>{{ history.seqNo }}</td>
                            <td>{{ history.actionDateTime }}</td>
                            <td>{{ history.status }}</td>
                            <td>{{ history.actorName }}</td>
                            <td>{{ history.comment || '' }}</td>
                          </tr>
                          <tr v-if="getApprovalHistory('vacation').length === 0">
                            <td colspan="5" class="no-history">承認履歴はありません</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div v-if="vacationForm.vacationType === 'SUBSTITUTE_HOLIDAY'" class="form-group form-group-inline">
                  <label class="label-inline">代休取得可能日数</label>
                  <div class="info-text info-text-inline">{{ compensatoryLeaveBalance }}日</div>
                </div>
              </template>
              
              <!-- 未申請の場合：編集可能なフォーム -->
              <template v-else>
                <div class="form-group form-group-inline">
                  <label class="label-inline">休暇種類</label>
                  <select 
                    v-model="vacationForm.vacationType" 
                    @change="onVacationTypeChange"
                    class="select-inline"
                  >
                    <option value="">選択してください</option>
                    <option v-for="type in filteredVacationTypes" :key="type.code" :value="type.code">
                      {{ type.name }}
                    </option>
                  </select>
                </div>
                
                <div v-if="vacationForm.vacationType === 'PAID_LEAVE'" class="form-group form-group-inline">
                  <label class="label-inline">有休残日数</label>
                  <div class="info-text info-text-inline">{{ Math.floor(paidLeaveBalance) }}日</div>
                </div>
                
                <div v-if="vacationForm.vacationType !== 'SUBSTITUTE_HOLIDAY'" class="form-group form-group-inline">
                  <label class="label-inline">期間</label>
                  <div class="date-range date-range-inline">
                    <input 
                      type="date" 
                      v-model="vacationForm.startDate"
                      class="date-input"
                      disabled
                      readonly
                    />
                    <input 
                      type="checkbox" 
                      v-model="vacationForm.enableEndDate"
                      class="date-range-checkbox"
                      id="enable-end-date-checkbox"
                    />
                    <label for="enable-end-date-checkbox" class="date-range-checkbox-label">～</label>
                    <input 
                      type="date" 
                      v-model="vacationForm.endDate"
                      class="date-input"
                      :min="vacationForm.startDate"
                      :disabled="!vacationForm.enableEndDate"
                      :readonly="!vacationForm.enableEndDate"
                    />
                  </div>
                </div>
                
                <div class="form-group form-group-inline form-group-compact">
                  <label class="label-inline">備考</label>
                  <textarea 
                    v-model="vacationForm.reason"
                    class="textarea-input textarea-input-large textarea-inline"
                    rows="1"
                  ></textarea>
                </div>
                
                <div class="form-group form-group-inline form-group-compact">
                  <label class="label-inline">連絡先</label>
                  <input 
                    type="text" 
                    v-model="vacationForm.contact"
                    class="text-input"
                  />
                </div>
              </template>
              
              <!-- 代休取得可能日数（編集フォーム側） -->
              <template v-if="!isPendingOrApproved('vacation')">
                <div v-if="vacationForm.vacationType === 'SUBSTITUTE_HOLIDAY'" class="form-group form-group-inline">
                  <label class="label-inline">代休取得可能日数</label>
                  <div class="info-text info-text-inline">{{ compensatoryLeaveBalance }}日</div>
                </div>
              </template>
            </div>
            
            <!-- ボタンを下部に配置 -->
            <div class="form-buttons-right">
              <button 
                v-if="!isPendingOrApproved('vacation')" 
                class="submit-button" 
                @click="submitVacationApplication"
                :disabled="currentTab === 'menu'"
              >
                承認申請
              </button>
              <button 
                v-if="isPendingOrApproved('vacation')" 
                class="cancel-button cancel-application-button" 
                @click="cancelVacationApplication"
                :disabled="currentTab === 'menu'"
              >
                {{ getCancelButtonLabel('vacation') }}
              </button>
              <a href="#" class="cancel-link" @click.prevent="closeApplicationTab">キャンセル</a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 休日出勤申請フォーム -->
      <div v-if="currentTab === 'holidayWork'" class="content-area">
        <!-- タブリスト-->
        <div class="tab-list">
          <div class="tab active" @click="switchToMenu">
            <span class="tab-title">メニュー</span>
          </div>
          <div class="tab active">
            <span class="tab-title">{{ getTabName(currentTab) }}</span>
            <button class="tab-close-button" @click="closeApplicationTab">×</button>
          </div>
        </div>
        
        <div class="form-container">
          <div class="form-content-wrapper">
            <div class="form-content-left">
              <!-- 当月時間外残業 -->
              <div class="form-group form-group-inline">
                <label class="label-inline">当月時間外残業</label>
                <div class="overtime-display">{{ formattedMonthlyOvertime }}</div>
              </div>
              
              <!-- 時間入力と休憩時間を同じ行に配置 -->
              <div class="form-group form-group-inline form-group-compact">
                <label class="label-inline label-top-aligned">時間</label>
                <div class="time-break-container">
                  <div class="time-range">
                    <input 
                      type="time" 
                      v-model="holidayWorkForm.startTime"
                      class="time-input-narrow"
                      :disabled="!isEditable('holidayWork')"
                      :readonly="!isEditable('holidayWork')"
                    />
                    <span class="time-separator">～</span>
                    <input 
                      type="time" 
                      v-model="holidayWorkForm.endTime"
                      class="time-input-narrow"
                      :disabled="!isEditable('holidayWork')"
                      :readonly="!isEditable('holidayWork')"
                    />
                  </div>
                  <div class="break-time-container">
                    <span class="break-time-label">休憩時間</span>
                    <span class="break-time-display">{{ formattedBreakTime }}</span>
                    <a v-if="isEditable('holidayWork')" href="#" class="change-link" @click.prevent="openBreakTimeDialog">変更</a>
                    <span v-if="isPastHolidayWorkApplication" class="post-application-label">(事後申請)</span>
                  </div>
                </div>
              </div>
              
              <!-- 備考 -->
              <div class="form-group form-group-inline form-group-compact">
                <label class="label-inline label-top-aligned">備考</label>
                <textarea 
                  v-model="holidayWorkForm.reason"
                  class="textarea-input textarea-input-large textarea-inline"
                  rows="1"
                  :disabled="!isEditable('holidayWork')"
                  :readonly="!isEditable('holidayWork')"
                ></textarea>
              </div>
              
              <!-- 申請情報セクション（申請中または承認済みの場合のみ表示） -->
              <div v-if="isPendingOrApproved('holidayWork')" class="application-info-section">
                <div class="form-group form-group-inline">
                  <label class="label-inline">申請日時</label>
                  <div class="holiday-work-info-text info-text-inline">{{ formatApplicationDate('holidayWork') }}</div>
                </div>
                
                <div class="form-group form-group-inline">
                  <label class="label-inline">状況</label>
                  <div class="holiday-work-info-text info-text-inline">{{ formatStatus('holidayWork') }}</div>
                </div>
                
                <!-- 承認履歴テーブル -->
                <div class="form-group form-group-inline form-group-full-width">
                  <label class="label-inline">承認履歴</label>
                  <div class="approval-history-container">
                    <table class="approval-history-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>日時</th>
                          <th>状況</th>
                          <th>実行者</th>
                          <th>コメント</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(history, index) in getApprovalHistory('holidayWork')" :key="index">
                          <td>{{ history.seqNo }}</td>
                          <td>{{ history.actionDateTime }}</td>
                          <td>{{ history.status }}</td>
                          <td>{{ history.actorName }}</td>
                          <td>{{ history.comment || '' }}</td>
                        </tr>
                        <tr v-if="getApprovalHistory('holidayWork').length === 0">
                          <td colspan="5" class="no-history">承認履歴はありません</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- ボタンを下部に配置 -->
            <div class="form-buttons-right">
              <button 
                v-if="!isPendingOrApproved('holidayWork')" 
                class="submit-button" 
                @click="submitHolidayWorkApplication"
                :disabled="currentTab === 'menu'"
              >
                承認申請
              </button>
              <button 
                v-if="isPendingOrApproved('holidayWork')" 
                class="cancel-button cancel-application-button" 
                @click="cancelHolidayWorkApplication"
                :disabled="currentTab === 'menu'"
              >
                {{ getCancelButtonLabel('holidayWork') }}
              </button>
              <a href="#" class="cancel-link" @click.prevent="closeApplicationTab">キャンセル</a>
            </div>
          </div>
        </div>
        
        <!-- 休憩時間設定ダイアログ -->
        <div v-if="showBreakTimeDialog" class="dialog-overlay-break-time" @click.self="closeBreakTimeDialog">
          <div class="break-time-dialog">
            <div class="break-time-dialog-header">
              <span class="break-time-dialog-title">休憩時間の設定</span>
              <button class="break-time-dialog-close" @click="closeBreakTimeDialog">×</button>
            </div>
            
            <div class="break-time-dialog-content">
              <div class="break-time-list">
                <div 
                  v-for="(breakTime, index) in breakTimeList" 
                  :key="index"
                  class="break-time-row"
                >
                  <input 
                    type="time" 
                    v-model="breakTime.startTime"
                    class="break-time-input"
                  />
                  <span class="break-time-separator">～</span>
                  <input 
                    type="time" 
                    v-model="breakTime.endTime"
                    class="break-time-input"
                  />
                  <button 
                    class="break-time-delete"
                    @click="removeBreakTime(index)"
                    :disabled="breakTimeList.length === 1"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <button class="break-time-add" @click="addBreakTime">+</button>
            </div>
            
            <div class="break-time-dialog-buttons">
              <button class="break-time-ok" @click="confirmBreakTime">OK</button>
              <a href="#" class="break-time-cancel" @click.prevent="closeBreakTimeDialog">キャンセル</a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 残業申請フォーム -->
      <div v-if="currentTab === 'overtime'" class="content-area">
        <!-- タブリスト-->
        <div class="tab-list">
          <div class="tab active" @click="switchToMenu">
            <span class="tab-title">メニュー</span>
          </div>
          <div class="tab active">
            <span class="tab-title">{{ getTabName(currentTab) }}</span>
            <button class="tab-close-button" @click="closeApplicationTab">×</button>
          </div>
        </div>
        
        <div class="form-container">
          <div class="form-content-wrapper">
            <div class="form-content-left">
              <p class="form-description">残業を申請します。</p>
              
              <div class="form-group form-group-inline">
                <label class="label-inline">期間</label>
                <div class="date-range date-range-inline">
                  <input 
                    type="date" 
                    v-model="overtimeForm.startDate"
                    class="date-input"
                    :disabled="!isEditable('overtime')"
                    :readonly="!isEditable('overtime')"
                  />
                  <span class="date-separator">～</span>
                  <input 
                    type="date" 
                    v-model="overtimeForm.endDate"
                    class="date-input"
                    :disabled="!isEditable('overtime')"
                    :readonly="!isEditable('overtime')"
                  />
                </div>
              </div>
              
              <div class="form-group form-group-inline">
                <label class="label-inline">残業時間</label>
                <input 
                  type="number" 
                  v-model="overtimeForm.hours"
                  class="text-input text-input-inline"
                  placeholder="残業時間を時間単位で入力"
                  min="0"
                  step="0.5"
                  :disabled="!isEditable('overtime')"
                  :readonly="!isEditable('overtime')"
                />
              </div>
              
              <div class="form-group form-group-inline form-group-compact">
                <label class="label-inline">備考</label>
                <textarea 
                  v-model="overtimeForm.reason"
                  class="textarea-input textarea-input-large textarea-inline"
                  rows="1"
                  :disabled="!isEditable('overtime')"
                  :readonly="!isEditable('overtime')"
                ></textarea>
              </div>
              
              <!-- 申請情報セクション（申請中または承認済みの場合のみ表示） -->
              <div v-if="isPendingOrApproved('overtime')" class="application-info-section">
                <div class="form-group form-group-inline">
                  <label class="label-inline">申請日時</label>
                  <div class="info-text info-text-inline">{{ formatApplicationDate('overtime') }}</div>
                </div>
                
                <div class="form-group form-group-inline">
                  <label class="label-inline">状況</label>
                  <div class="info-text info-text-inline">{{ formatStatus('overtime') }}</div>
                </div>
                
                <!-- 承認履歴テーブル -->
                <div class="form-group form-group-inline form-group-full-width">
                  <label class="label-inline">承認履歴</label>
                  <div class="approval-history-container">
                    <table class="approval-history-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>日時</th>
                          <th>状況</th>
                          <th>実行者</th>
                          <th>コメント</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(history, index) in getApprovalHistory('overtime')" :key="index">
                          <td>{{ history.seqNo }}</td>
                          <td>{{ history.actionDateTime }}</td>
                          <td>{{ history.status }}</td>
                          <td>{{ history.actorName }}</td>
                          <td>{{ history.comment || '' }}</td>
                        </tr>
                        <tr v-if="getApprovalHistory('overtime').length === 0">
                          <td colspan="5" class="no-history">承認履歴はありません</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-buttons-right">
              <button 
                v-if="!isPendingOrApproved('overtime')" 
                class="submit-button" 
                @click="submitOvertimeApplication"
                :disabled="currentTab === 'menu'"
              >
                承認申請
              </button>
              <button 
                v-if="isPendingOrApproved('overtime')" 
                class="cancel-button cancel-application-button" 
                @click="cancelOvertimeApplication"
                :disabled="currentTab === 'menu'"
              >
                {{ getCancelButtonLabel('overtime') }}
              </button>
              <a href="#" class="cancel-link" @click.prevent="closeApplicationTab">キャンセル</a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 早朝勤務申請フォーム -->
      <div v-if="currentTab === 'earlyWork'" class="content-area">
        <!-- タブリスト-->
        <div class="tab-list">
          <div class="tab active" @click="switchToMenu">
            <span class="tab-title">メニュー</span>
          </div>
          <div class="tab active">
            <span class="tab-title">{{ getTabName(currentTab) }}</span>
            <button class="tab-close-button" @click="closeApplicationTab">×</button>
          </div>
        </div>
        
        <div class="form-container">
          <div class="form-content-wrapper">
            <div class="form-content-left">
              <p class="form-description">早朝勤務を申請します。</p>
              
              <div class="form-group form-group-inline">
                <label class="label-inline">期間</label>
                <div class="date-range date-range-inline">
                  <input 
                    type="date" 
                    v-model="earlyWorkForm.startDate"
                    class="date-input"
                    :disabled="!isEditable('earlyWork')"
                    :readonly="!isEditable('earlyWork')"
                  />
                  <span class="date-separator">～</span>
                  <input 
                    type="date" 
                    v-model="earlyWorkForm.endDate"
                    class="date-input"
                    :disabled="!isEditable('earlyWork')"
                    :readonly="!isEditable('earlyWork')"
                  />
                </div>
              </div>
              
              <div class="form-group form-group-inline form-group-compact">
                <label class="label-inline">備考</label>
                <textarea 
                  v-model="earlyWorkForm.reason"
                  class="textarea-input textarea-input-large textarea-inline"
                  rows="1"
                  :disabled="!isEditable('earlyWork')"
                  :readonly="!isEditable('earlyWork')"
                ></textarea>
              </div>
              
              <!-- 申請情報セクション（申請中または承認済みの場合のみ表示） -->
              <div v-if="isPendingOrApproved('earlyWork')" class="application-info-section">
                <div class="form-group form-group-inline">
                  <label class="label-inline">申請日時</label>
                  <div class="info-text info-text-inline">{{ formatApplicationDate('earlyWork') }}</div>
                </div>
                
                <div class="form-group form-group-inline">
                  <label class="label-inline">状況</label>
                  <div class="info-text info-text-inline">{{ formatStatus('earlyWork') }}</div>
                </div>
                
                <!-- 承認履歴テーブル -->
                <div class="form-group form-group-inline form-group-full-width">
                  <label class="label-inline">承認履歴</label>
                  <div class="approval-history-container">
                    <table class="approval-history-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>日時</th>
                          <th>状況</th>
                          <th>実行者</th>
                          <th>コメント</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(history, index) in getApprovalHistory('earlyWork')" :key="index">
                          <td>{{ history.seqNo }}</td>
                          <td>{{ history.actionDateTime }}</td>
                          <td>{{ history.status }}</td>
                          <td>{{ history.actorName }}</td>
                          <td>{{ history.comment || '' }}</td>
                        </tr>
                        <tr v-if="getApprovalHistory('earlyWork').length === 0">
                          <td colspan="5" class="no-history">承認履歴はありません</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-buttons-right">
              <button 
                v-if="!isPendingOrApproved('earlyWork')" 
                class="submit-button" 
                @click="submitEarlyWorkApplication"
                :disabled="currentTab === 'menu'"
              >
                承認申請
              </button>
              <button 
                v-if="isPendingOrApproved('earlyWork')" 
                class="cancel-button cancel-application-button" 
                @click="cancelEarlyWorkApplication"
                :disabled="currentTab === 'menu'"
              >
                {{ getCancelButtonLabel('earlyWork') }}
              </button>
              <a href="#" class="cancel-link" @click.prevent="closeApplicationTab">キャンセル</a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 振替申請フォーム -->
      <div v-if="currentTab === 'transfer'" class="content-area">
        <!-- タブリスト-->
        <div class="tab-list">
          <div class="tab active" @click="switchToMenu">
            <span class="tab-title">メニュー</span>
          </div>
          <div class="tab active">
            <span class="tab-title">{{ getTabName(currentTab) }}</span>
            <button class="tab-close-button" @click="closeApplicationTab">×</button>
          </div>
        </div>
        
        <div class="form-container">
          <div class="form-content-wrapper">
            <div class="form-content-left">
              <p class="form-description">振替を申請します。</p>
              
              <div class="form-group form-group-inline">
                <label class="label-inline">振替元日</label>
                <input 
                  type="date" 
                  v-model="transferForm.fromDate"
                  class="date-input date-input-inline"
                  :disabled="!isEditable('transfer')"
                  :readonly="!isEditable('transfer')"
                />
              </div>
              
              <div class="form-group form-group-inline">
                <label class="label-inline">振替先日</label>
                <input 
                  type="date" 
                  v-model="transferForm.toDate"
                  class="date-input date-input-inline"
                  :disabled="!isEditable('transfer')"
                  :readonly="!isEditable('transfer')"
                />
              </div>
              
              <div class="form-group form-group-inline form-group-compact">
                <label class="label-inline">備考</label>
                <textarea 
                  v-model="transferForm.reason"
                  class="textarea-input textarea-input-large textarea-inline"
                  rows="1"
                  :disabled="!isEditable('transfer')"
                  :readonly="!isEditable('transfer')"
                ></textarea>
              </div>
              
              <!-- 申請情報セクション（申請中または承認済みの場合のみ表示） -->
              <div v-if="isPendingOrApproved('transfer')" class="application-info-section">
                <div class="form-group form-group-inline">
                  <label class="label-inline">申請日時</label>
                  <div class="info-text info-text-inline">{{ formatApplicationDate('transfer') }}</div>
                </div>
                
                <div class="form-group form-group-inline">
                  <label class="label-inline">状況</label>
                  <div class="info-text info-text-inline">{{ formatStatus('transfer') }}</div>
                </div>
                
                <!-- 承認履歴テーブル -->
                <div class="form-group form-group-inline form-group-full-width">
                  <label class="label-inline">承認履歴</label>
                  <div class="approval-history-container">
                    <table class="approval-history-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>日時</th>
                          <th>状況</th>
                          <th>実行者</th>
                          <th>コメント</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(history, index) in getApprovalHistory('transfer')" :key="index">
                          <td>{{ history.seqNo }}</td>
                          <td>{{ history.actionDateTime }}</td>
                          <td>{{ history.status }}</td>
                          <td>{{ history.actorName }}</td>
                          <td>{{ history.comment || '' }}</td>
                        </tr>
                        <tr v-if="getApprovalHistory('transfer').length === 0">
                          <td colspan="5" class="no-history">承認履歴はありません</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-buttons-right">
              <button 
                v-if="!isPendingOrApproved('transfer')" 
                class="submit-button" 
                @click="submitTransferApplication"
                :disabled="currentTab === 'menu'"
              >
                承認申請
              </button>
              <button 
                v-if="isPendingOrApproved('transfer')" 
                class="cancel-button cancel-application-button" 
                @click="cancelTransferApplication"
                :disabled="currentTab === 'menu'"
              >
                {{ getCancelButtonLabel('transfer') }}
              </button>
              <a href="#" class="cancel-link" @click.prevent="closeApplicationTab">キャンセル</a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 下部操作エリア -->
      <div class="dialog-footer">
        <a href="#" @click.prevent="closeDialog" class="close-link">閉じる</a>
      </div>
      
      <!-- ローディング表示 -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>処理中...</p>
      </div>
      
      <!-- エラーダイアログ -->
      <div v-if="showErrorDialog" class="error-dialog-overlay" @click.self="closeErrorDialog">
        <div class="error-dialog-container">
          <div class="error-dialog-header">
            <span class="error-dialog-title">エラー</span>
          </div>
          <div class="error-dialog-message">
            {{ errorMessage }}
          </div>
          <button class="error-dialog-ok-button" @click="closeErrorDialog">OK</button>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script lang="js">
import HolidayJp from '@holiday-jp/holiday_jp'
import { 
  getHolidayWorkStatus, 
  getWorkHours, 
  getApplicationStatus, 
  getApplicationInfo, 
  cancelApplication,
  getVacationTypes,
  getVacationBalance,
  getHolidayWorkList,
  getMonthlyOvertime,
  getDailyAttendance,
  submitDailyConfirmation,
  saveRemark,
  apiRequest
} from '@/services/api'
import { formatDateWithWeekday, formatDate, formatDateTime, formatTime } from '@/utils/dateFormatter'
import { formatHoursMinutes, formatMonthlyOvertime, formatBreakTime } from '@/utils/timeFormatter'

// 申請タイプの定数リスト（共通化）
const APPLICATION_TYPES = ['dailyConfirmation', 'vacation', 'holidayWork', 'overtime', 'earlyWork', 'transfer']

// 申請ステータスの表示名マッピング（共通化）
const STATUS_DISPLAY_NAMES = {
  PENDING: '申請済み',
  APPROVED: '承認済み',
  REJECTED: '却下',
  NOT_SUBMITTED: '未申請'
}

// 申請取消ボタンのラベルマッピング（共通化）
const CANCEL_BUTTON_LABELS = {
  PENDING: '申請取消',
  APPROVED: '承認取消',
  default: '取消'
}

export default {
  name: 'AttendanceApplicationDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    targetDate: {
      type: String,
      required: true
    },
    employeeId: {
      type: String,
      required: true
    },
    initialApplicationType: {
      type: String,
      default: null
    },
    initialApplicationStatus: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      currentTab: 'menu',
      activeApplicationTab: null,
      loading: false,
      showErrorDialog: false,
      errorMessage: '',
      
      // 休暇種別マスタ
      vacationTypes: [],
      paidLeaveBalance: 0,
      // 休日出勤申請状態
      hasHolidayWorkApplication: false,
      // 代休取得可能日数
      compensatoryLeaveBalance: 0,
      
      // 勤怠データ（打刻時刻の状態確認用）
      attendanceData: null,
      
      // 打刻時刻の状態
      hasClockIn: false,
      hasClockOut: false,
      
      // 選択中のメニュー項目
      selectedMenuItem: 'dailyConfirmation',
      
      // 日次確定申請フォーム
      dailyConfirmationForm: {
        clockInOut: '',
        breakTime: '',
        totalWorkHours: '',
        actualWorkHours: '',
        remark: ''
      },
      // 日次確定申請のエラーメッセージ
      dailyConfirmationError: '',
      
      // 休暇申請フォーム
      vacationForm: {
        vacationType: '',
        startDate: '',
        endDate: '',
        enableEndDate: false, // 終了日を有効にするかどうか（初期値はfalse）
        reason: '',
        contact: ''
      },
      
      // 休日出勤申請フォーム
      holidayWorkForm: {
        startTime: '09:00',
        endTime: '17:30',
        breakHours: 1.0, // 時間単位（小数）
        reason: ''
      },
      
      // 残業申請フォーム
      overtimeForm: {
        startDate: '',
        endDate: '',
        hours: '',
        reason: ''
      },
      
      // 早朝勤務申請フォーム
      earlyWorkForm: {
        startDate: '',
        endDate: '',
        reason: ''
      },
      
      // 振替申請フォーム
      transferForm: {
        fromDate: '',
        toDate: '',
        reason: ''
      },
      
      // 当月時間外残業
      monthlyOvertime: 0,
      
      // 休憩時間設定ダイアログの表示状態
      showBreakTimeDialog: false,
      
      // 休憩時間リスト
      breakTimeList: [],
      
      // 申請状態（各申請タイプごと）（共通定数から生成）
      applicationStatuses: APPLICATION_TYPES.reduce((acc, type) => {
        acc[type] = 'NOT_SUBMITTED'
        return acc
      }, {}),
      
      // 申請ID（各申請タイプごと）（共通定数から生成）
      applicationIds: APPLICATION_TYPES.reduce((acc, type) => {
        acc[type] = null
        return acc
      }, {}),
      
      // 申請情報（申請日時、状況など）（共通定数から生成）
      applicationInfo: APPLICATION_TYPES.reduce((acc, type) => {
        acc[type] = {
          applicationDate: null,
          status: null,
          approvalHistory: []
        }
        return acc
      }, {}),
      
    }
  },
  computed: {
    formattedDate() {
      return formatDateWithWeekday(this.targetDate)
    },
    formattedMonthlyOvertime() {
      return formatMonthlyOvertime(this.monthlyOvertime)
    },
    formattedBreakTime() {
      return formatBreakTime(this.holidayWorkForm.breakHours)
    },
    currentDescription() {
      if (this.currentTab === 'menu') {
        return '申請タイプを選択してください。'
      }
      return ''
    },
    // 選択中のメニュー項目の説明文
    currentMenuDescription() {
      return this.menuDescriptions[this.selectedMenuItem] || '日次確定を申請します。'
    },
    // フィルタ済み休暇種別リスト（代休は条件付きで表示）
    filteredVacationTypes() {
      return this.vacationTypes.filter(type => {
        // 代休（SUBSTITUTE_HOLIDAY）は休日出勤申請がある場合のみ表示
        if (type.code === 'SUBSTITUTE_HOLIDAY') {
          return this.hasHolidayWorkApplication
        }
        // その他の休暇種別は常に表示
        return true
      })
    },
    // 全メニュー項目の説明文
    menuDescriptions() {
      return {
        dailyConfirmation: '日次確定を申請します。',
        vacation: '休暇、代休、時間単位休暇を申請します。',
        holidayWork: '休日出勤を申請します。',
        overtime: '残業を申請します。',
        earlyWork: '早朝勤務を申請します。',
        transfer: '振替を申請します。'
      }
    },
    // 申請中または承認済みかどうかを判定（各申請タイプごと）
    isPendingOrApproved() {
      return (applicationType) => {
        const status = this.applicationStatuses[applicationType]
        return status === 'PENDING' || status === 'APPROVED'
      }
    },
    // 編集可能かどうかを判定（申請中または承認済みの場合は編集不可）
    isEditable() {
      return (applicationType) => {
        const status = this.applicationStatuses[applicationType]
        return status !== 'PENDING' && status !== 'APPROVED'
      }
    },
    // 対象日が休日かどうかを判定
    isHoliday() {
      if (!this.targetDate) return false
      const date = new Date(this.targetDate)
      const dayOfWeek = date.getDay() // 0=日曜日, 6=土曜日
      
      // 土曜日または日曜日の場合
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return true
      }
      
      // 祝日判定（HolidayJpライブラリを使用）
      try {
        return HolidayJp.isHoliday(date)
      } catch (error) {
        return false
      }
    },
    // 対象日が平日かどうかを判定
    isWeekday() {
      return !this.isHoliday
    },
    // 過去の土日祝の申請かどうかを判定
    isPastHolidayWorkApplication() {
      if (!this.targetDate || !this.isHoliday) return false
      const targetDate = new Date(this.targetDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      targetDate.setHours(0, 0, 0, 0)
      // 過去の日付で、かつ土日祝の場合
      return targetDate < today && this.isHoliday
    },
    // 出社と退社の両方の打刻時刻が未入力かどうか
    isBothClockTimesEmpty() {
      if (!this.attendanceData) return true
      return !this.attendanceData.CLOCK_IN_TIME && !this.attendanceData.CLOCK_OUT_TIME
    },
    // 出社の打刻時刻は入力されているが退社の打刻時刻が未入力かどうか
    isClockOutTimeEmpty() {
      if (!this.attendanceData) return false
      return !!this.attendanceData.CLOCK_IN_TIME && !this.attendanceData.CLOCK_OUT_TIME
    },
    // 打刻時刻が未入力または退社時刻が未入力の場合（非活性条件）
    isClockTimeIncomplete() {
      // attendanceDataがnullの場合はtrueを返す
      if (!this.attendanceData) return true
      // 両方の時刻が未入力の場合（null、undefined、空文字列をチェック）
      const hasClockIn = this.attendanceData.CLOCK_IN_TIME && 
                         this.attendanceData.CLOCK_IN_TIME !== null && 
                         this.attendanceData.CLOCK_IN_TIME !== ''
      const hasClockOut = this.attendanceData.CLOCK_OUT_TIME && 
                          this.attendanceData.CLOCK_OUT_TIME !== null && 
                          this.attendanceData.CLOCK_OUT_TIME !== ''
      
      if (!hasClockIn && !hasClockOut) return true
      // 出社時刻はあるが退社時刻が未入力の場合
      if (hasClockIn && !hasClockOut) return true
      // それ以外はfalse（両方の時刻が入力されている）
      return false
    },
    // 日次確定ボタンが非活性かどうか
    isDailyConfirmationDisabled() {
      // 休日かつ休日出勤申請が未申請の場合
      if (this.isHoliday && !this.hasHolidayWorkApplication) {
        return true
      }
      // 打刻時刻が未入力または退社時刻が未入力の場合
      // attendanceDataがnullの場合はtrueを返す
      if (!this.attendanceData) {
        return true
      }
      // 両方の時刻が未入力の場合（null、undefined、空文字列をチェック）
      // Dateオブジェクト、文字列、null、undefinedのすべてのケースに対応
      const clockInTime = this.attendanceData.CLOCK_IN_TIME
      const clockOutTime = this.attendanceData.CLOCK_OUT_TIME
      
      // null、undefined、空文字列をチェック
      // Dateオブジェクトの場合は、無効な日付でないことを確認
      const hasClockIn = clockInTime != null && 
                         clockInTime !== '' &&
                         !(clockInTime instanceof Date && isNaN(clockInTime.getTime()))
      const hasClockOut = clockOutTime != null && 
                          clockOutTime !== '' &&
                          !(clockOutTime instanceof Date && isNaN(clockOutTime.getTime()))
      
      if (!hasClockIn && !hasClockOut) {
        return true
      }
      // 出社時刻はあるが退社時刻が未入力の場合
      if (hasClockIn && !hasClockOut) {
        return true
      }
      // それ以外はfalse（両方の時刻が入力されている）
      return false
    },
    // 休暇申請ボタンが非活性かどうか
    isVacationDisabled() {
      return this.isHoliday && !this.hasHolidayWorkApplication
    },
    // 残業申請ボタンが非活性かどうか
    isOvertimeDisabled() {
      return this.isHoliday && !this.hasHolidayWorkApplication
    },
    // 早朝勤務申請ボタンが非活性かどうか
    isEarlyWorkDisabled() {
      return this.isHoliday && !this.hasHolidayWorkApplication
    },
    // 休日出勤申請ボタンが非活性かどうか
    isHolidayWorkDisabled() {
      // 平日の場合は常に非活性（休日出勤申請は休日のみ可能）
      if (this.isWeekday) {
        return true
      }
      return false
    }
  },
  watch: {
    visible: {
      handler(newVal) {
        if (newVal) {
          this.initialize()
          // スクロールをロック
          document.body.style.overflow = 'hidden'
        } else {
          // スクロールをアンロック
          document.body.style.overflow = ''
        }
      },
      immediate: true
    },
    targetDate() {
      // targetDateが変更された時に勤怠データを再取得
      if (this.visible) {
        this.loadAttendanceDataForButtonControl()
      }
    },
    'vacationForm.enableEndDate'(newVal) {
      // チェックボックスが無効になった場合、終了日を開始日と同じにする
      if (!newVal && this.vacationForm.startDate) {
        this.vacationForm.endDate = this.vacationForm.startDate
      }
    },
    'vacationForm.startDate'(newVal) {
      // 開始日が変更され、終了日が無効な場合、終了日も同じ日付にする
      if (!this.vacationForm.enableEndDate && newVal) {
        this.vacationForm.endDate = newVal
      }
      // 開始日が変更され、終了日が開始日より前の場合は終了日を開始日にリセット
      if (this.vacationForm.enableEndDate && newVal && this.vacationForm.endDate && newVal > this.vacationForm.endDate) {
        this.vacationForm.endDate = newVal
      }
    }
  },
  methods: {
    async initialize() {
      this.loading = true
      try {
        // 初期申請状態が指定されている場合、先に設定（loadApplicationStatusesより前）
        if (this.initialApplicationType && this.initialApplicationStatus) {
          this.applicationStatuses[this.initialApplicationType] = this.initialApplicationStatus
        }
        
        // 休暇種別マスタ取得
        await this.loadVacationTypes()
        
        // 有給残日数取得
        await this.loadPaidLeaveBalance()
        
        // 休日出勤申請状態取得
        await this.loadHolidayWorkStatus()
        
        // 申請状態取得（各申請タイプごと）
        // 注意: initialApplicationStatusが既に設定されている場合は、loadApplicationStatuses内でスキップされる
        await this.loadApplicationStatuses()
        
        // 勤怠データ取得（打刻時刻の状態確認用）
        await this.loadAttendanceDataForButtonControl()
        
        // 打刻時刻の状態を取得
        await this.loadClockStatus()
        
        // フォームの初期値設定
        this.initializeForms()
        
        // 初期申請タイプがある場合、そのタブを開く
        if (this.initialApplicationType) {
          this.openApplicationTab(this.initialApplicationType)
        } else {
          this.currentTab = 'menu'
          this.activeApplicationTab = null
        }
      } catch (error) {
        this.showError('初期化に失敗しました。')
      } finally {
        this.loading = false
      }
    },
    
    initializeForms() {
      // 日次確定申請フォームの初期化
      this.dailyConfirmationForm = {
        clockInOut: '',
        breakTime: '',
        totalWorkHours: '',
        actualWorkHours: '',
        remark: ''
      }
      // エラーメッセージをクリア
      this.dailyConfirmationError = ''
      
      // 休暇申請フォームの初期化（年次有給休暇を選択）
      this.vacationForm.vacationType = 'PAID_LEAVE'
      this.vacationForm.startDate = this.targetDate
      this.vacationForm.endDate = this.targetDate
      this.vacationForm.enableEndDate = false
      this.vacationForm.reason = ''
      this.vacationForm.contact = ''
      
      // 休日出勤申請フォームの初期値は既に設定済み（startTime: '09:00', endTime: '17:30'）
      // 日付範囲フォームの初期化（共通処理）
      const dateRangeForms = [
        { form: this.overtimeForm, startField: 'startDate', endField: 'endDate' },
        { form: this.earlyWorkForm, startField: 'startDate', endField: 'endDate' },
        { form: this.transferForm, startField: 'fromDate', endField: 'toDate' }
      ]
      dateRangeForms.forEach(({ form, startField, endField }) => {
        form[startField] = this.targetDate
        form[endField] = this.targetDate
      })
    },
    
    async loadVacationTypes() {
      try {
        const data = await getVacationTypes()
        if (data.success) {
          this.vacationTypes = data.vacationTypes.map(type => ({
            code: type.VACATION_TYPE_CODE,
            name: type.VACATION_TYPE_NAME,
            isPaid: type.IS_PAID
          }))
        }
      } catch (error) {
        // エラー時は何もしない
      }
    },
    
    async loadPaidLeaveBalance() {
      try {
        const data = await getVacationBalance(this.employeeId, 'PAID_LEAVE')
        if (data.success) {
          this.paidLeaveBalance = data.balance || 0
        }
      } catch (error) {
        // エラー時は何もしない
      }
    },
    
    async loadHolidayWorkStatus() {
      try {
        const response = await getHolidayWorkStatus(this.employeeId, this.targetDate)
        if (response.success) {
          // 対象日の休日出勤申請または過去の休日出勤申請がある場合、代休を表示可能
          this.hasHolidayWorkApplication = response.hasHolidayWorkApplication || false
          // 休日出勤申請がある場合、代休取得可能日数を取得
          if (this.hasHolidayWorkApplication) {
            await this.loadCompensatoryLeaveBalance()
          }
        }
      } catch (error) {
        // エラー時はfalseとして扱う
        this.hasHolidayWorkApplication = false
      }
    },
    
    async loadApplicationStatuses() {
      // 各申請タイプの申請状態を取得（共通定数を使用）
      for (const applicationType of APPLICATION_TYPES) {
        // 初期申請状態が指定されている場合は、APIを呼び出さずにそれを使用
        if (this.initialApplicationType === applicationType && this.initialApplicationStatus) {
          this.applicationStatuses[applicationType] = this.initialApplicationStatus
          continue
        }
        
        try {
          const apiType = this.getApiType(applicationType)
          if (!apiType) continue
          
          const response = await getApplicationStatus(this.employeeId, apiType, this.targetDate)
          if (response.success) {
            this.applicationStatuses[applicationType] = response.status || 'NOT_SUBMITTED'
            this.applicationIds[applicationType] = response.applicationId || null
          }
        } catch (error) {
          // エラー時はNOT_SUBMITTEDとして扱う
          this.applicationStatuses[applicationType] = 'NOT_SUBMITTED'
          this.applicationIds[applicationType] = null
        }
      }
    },
    
    async loadCompensatoryLeaveBalance() {
      try {
        // 代休取得可能日数は、承認済みまたは申請中の休日出勤申請の日数をカウント
        // 対象日から過去1年間の休日出勤申請を取得
        const oneYearAgo = new Date(this.targetDate);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const oneYearAgoStr = oneYearAgo.toISOString().split('T')[0];
        
        const data = await getHolidayWorkList(this.employeeId, oneYearAgoStr, this.targetDate);
        
        if (data.success && data.applications) {
          // 承認済みまたは申請中の休日出勤申請の日数をカウント
          let totalDays = 0;
          for (const app of data.applications) {
            if (app.APPROVAL_STATUS === 'PENDING' || app.APPROVAL_STATUS === 'APPROVED') {
              const startDate = new Date(app.TARGET_START_DATE);
              const endDate = new Date(app.TARGET_END_DATE);
              const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
              totalDays += days;
            }
          }
          this.compensatoryLeaveBalance = totalDays;
        } else {
          this.compensatoryLeaveBalance = 0;
        }
      } catch (error) {
        this.compensatoryLeaveBalance = 0
      }
    },
    
    async loadClockStatus() {
      try {
        const data = await getDailyAttendance(this.employeeId, this.targetDate)
        
        if (data.success && data.attendance) {
          const attendance = data.attendance
          this.hasClockIn = !!attendance.CLOCK_IN_TIME
          this.hasClockOut = !!attendance.CLOCK_OUT_TIME
        } else {
          // 勤怠記録が存在しない場合
          this.hasClockIn = false
          this.hasClockOut = false
        }
      } catch (error) {
        // エラー時はfalseとして扱う
        this.hasClockIn = false
        this.hasClockOut = false
      }
    },
    
    async loadAttendanceDataForButtonControl() {
      try {
        const data = await getDailyAttendance(this.employeeId, this.targetDate)
        
        if (data.success && data.attendance) {
          this.attendanceData = data.attendance
          // Vueのリアクティビティを確実に発火させるために$nextTickを呼ぶ
          await this.$nextTick()
        } else {
          // 勤怠データが存在しない場合、nullを設定
          this.attendanceData = null
          await this.$nextTick()
        }
      } catch (error) {
        // エラー時はnullとして扱う
        this.attendanceData = null
        await this.$nextTick()
      }
    },
    
    async loadDailyAttendanceData() {
      try {
        const data = await getDailyAttendance(this.employeeId, this.targetDate)
        
        if (data.success && data.attendance) {
          const attendance = data.attendance
          
          // 出退社時刻を設定
          let clockIn = '--:--'

          if (attendance.CLOCK_IN_TIME) {
            clockIn = formatTime(attendance.CLOCK_IN_TIME)
          }

          let clockOut = '--:--'

          if (attendance.CLOCK_OUT_TIME) {
            clockOut = formatTime(attendance.CLOCK_OUT_TIME)
          }
          this.dailyConfirmationForm.clockInOut = `${clockIn}-${clockOut}`
          
          // 休憩時間を設定
          if (attendance.breakTimes && attendance.breakTimes.length > 0) {
            this.dailyConfirmationForm.breakTime = attendance.breakTimes
              .map(bt => `${formatTime(bt.BREAK_START_TIME)}-${formatTime(bt.BREAK_END_TIME)}`)
              .join(', ')
          } else {
            this.dailyConfirmationForm.breakTime = '---:---'
          }
          
          // 総労働時間を設定
          if (attendance.CLOCK_IN_TIME && attendance.CLOCK_OUT_TIME) {
            const clockInDate = new Date(attendance.CLOCK_IN_TIME)
            const clockOutDate = new Date(attendance.CLOCK_OUT_TIME)
            const totalMinutes = Math.floor((clockOutDate - clockInDate) / 1000 / 60)
            this.dailyConfirmationForm.totalWorkHours = formatHoursMinutes(totalMinutes)
          } else {
            this.dailyConfirmationForm.totalWorkHours = '0:00'
          }
          
          // 実労働時間を設定
          this.dailyConfirmationForm.actualWorkHours = formatHoursMinutes(Math.floor((attendance.ACTUAL_WORK_HOURS || 0) * 60))
          
          // 備考を設定
          this.dailyConfirmationForm.remark = attendance.REMARK_TEXT || ''
        }
      } catch (error) {
        this.showError('日次勤怠データの取得に失敗しました。')
      }
    },
    
    // 日付・時刻フォーマット関数はutilsの共通関数を直接使用（メソッドとして残すのは後方互換性のため）
    formatTime(dateTimeString) {
      return formatTime(dateTimeString)
    },
    
    formatHoursMinutes(totalMinutes) {
      return formatHoursMinutes(totalMinutes)
    },
    
    // 申請日時をフォーマット
    formatApplicationDate(applicationType) {
      const info = this.applicationInfo[applicationType]
      if (!info || !info.applicationDate) {
        return '---'
      }
      // APIから返される形式（YYYY/MM/DD HH:MM）をそのまま使用
      return info.applicationDate
    },
    
    // 状況をフォーマット
    formatStatus(applicationType) {
      const info = this.applicationInfo[applicationType]
      if (info && info.status) {
        // applicationInfoから取得したstatusを使用
        return info.status
      }
      // フォールバック：applicationStatusesから取得（共通定数を使用）
      const status = this.applicationStatuses[applicationType]
      return STATUS_DISPLAY_NAMES[status] || STATUS_DISPLAY_NAMES.NOT_SUBMITTED
    },
    
    // 申請取消ボタンのラベルを取得（共通定数を使用）
    getCancelButtonLabel(applicationType) {
      const status = this.applicationStatuses[applicationType]
      return CANCEL_BUTTON_LABELS[status] || CANCEL_BUTTON_LABELS.default
    },
    
    // 承認履歴を取得（共通メソッド）
    getApprovalHistory(applicationType) {
      const info = this.applicationInfo[applicationType]
      return info && info.approvalHistory ? info.approvalHistory : []
    },
    
    // 申請タイプをAPIタイプに変換（共通メソッド）
    getApiType(applicationType) {
      const apiTypeMap = {
        dailyConfirmation: 'DAILY_CONFIRMATION',
        vacation: 'VACATION',
        holidayWork: 'HOLIDAY_WORK',
        overtime: 'OVERTIME',
        earlyWork: 'EARLY_WORK',
        transfer: 'TRANSFER'
      }
      return apiTypeMap[applicationType]
    },
    
    // 申請送信メソッドを取得（共通メソッド）
    getSubmitMethod(applicationType) {
      const methodMap = {
        dailyConfirmation: this.submitDailyConfirmation,
        vacation: this.submitVacationApplication,
        holidayWork: this.submitHolidayWorkApplication,
        overtime: this.submitOvertimeApplication,
        earlyWork: this.submitEarlyWorkApplication,
        transfer: this.submitTransferApplication
      }
      return methodMap[applicationType]
    },
    
    // 申請取消メソッドを取得（共通メソッド）
    getCancelMethod(applicationType) {
      return () => this.cancelApplication(applicationType)
    },
    
    // 日付範囲のバリデーション（共通メソッド）
    validateDateRange(startDate, endDate, startLabel = '開始日', endLabel = '終了日') {
      if (!startDate) {
        this.showError(`${startLabel}を入力してください。`)
        return false
      }
      if (!endDate) {
        this.showError(`${endLabel}を入力してください。`)
        return false
      }
      if (startDate > endDate) {
        this.showError(`${startLabel}は${endLabel}より前の日付を入力してください。`)
        return false
      }
      return true
    },
    
    // 申請送信の共通処理（API呼び出しとエラーハンドリング）
    async submitApplicationCommon(config) {
      const {
        url,
        endpoint, // エンドポイント（優先的に使用）
        body,
        errorMessage,
        successCallback,
        errorLogMessage
      } = config
      
      this.loading = true
      try {
        // エンドポイントを抽出（endpointが指定されていない場合はURLから抽出）
        const apiEndpoint = endpoint || (url ? url.replace(/^https?:\/\/[^\/]+/, '').replace(/^\/api/, '') : '')
        const data = await apiRequest(apiEndpoint, {
          method: 'POST',
          body: JSON.stringify(body)
        })
        
        if (data.success) {
          // 成功時の追加処理があれば実行
          if (successCallback) {
            successCallback()
          }
          this.$emit('application-submitted')
          this.closeDialog()
        } else {
          this.showError(data.message || errorMessage)
        }
      } catch (error) {
        this.showError(errorMessage)
      } finally {
        this.loading = false
      }
    },
    
    
    // 申請情報を取得
    async loadApplicationInfo(applicationType) {
      try {
        const apiType = this.getApiType(applicationType)
        if (!apiType) return
        
        // 申請情報取得APIを呼び出し
        const response = await getApplicationInfo(this.employeeId, apiType, this.targetDate)
        
        if (response.success) {
          if (response.applicationDate) {
            this.applicationInfo[applicationType].applicationDate = response.applicationDate
            this.applicationInfo[applicationType].status = response.status || 'NOT_SUBMITTED'
            
            // applicationIdを設定
            if (response.applicationId) {
              this.applicationIds[applicationType] = response.applicationId
            }
            
            // 承認履歴をマッピング
            this.applicationInfo[applicationType].approvalHistory = (response.history || []).map((h, index) => ({
              seqNo: h.SEQ_NO || (index + 1),
              actionDateTime: h.ACTION_DATETIME || h.actionDateTime || '',
              status: h.ACTION_TYPE_DISPLAY || h.status || '',
              actorName: h.ACTOR_NAME || h.actorName || '',
              comment: h.COMMENT || h.comment || ''
            }))
          } else {
            // 申請情報がない場合（共通メソッドを使用）
            this.resetApplicationInfo(applicationType)
          }
        }
      } catch (error) {
        // エラー時も共通メソッドを使用
        this.resetApplicationInfo(applicationType)
      }
    },
    
    // 申請情報をリセット（共通メソッド）
    resetApplicationInfo(applicationType) {
      this.applicationInfo[applicationType].applicationDate = null
      this.applicationInfo[applicationType].status = 'NOT_SUBMITTED'
      this.applicationInfo[applicationType].approvalHistory = []
      this.applicationIds[applicationType] = null
    },
    
    // 日時をフォーマット（YYYY/MM/DD HH:MM形式）
    formatDateTime(dateTimeString) {
      return formatDateTime(dateTimeString)
    },
    
    // 日付をフォーマット（YYYY/MM/DD形式）
    formatDate(dateString) {
      return formatDate(dateString)
    },
    
    // 休暇種類の表示名を取得
    getVacationTypeName(vacationTypeCode) {
      if (!vacationTypeCode) return '---'
      const type = this.vacationTypes.find(t => t.code === vacationTypeCode)
      return type ? type.name : '---'
    },
    
    // メニュー項目をクリックしたときの処理（タブを開く）
    selectMenuItem(applicationType) {
      // 選択中のメニュー項目を更新（説明文表示用）
      this.selectedMenuItem = applicationType
      
      // 申請中または承認済みの場合はタブを開かない
      if (this.isPendingOrApproved(applicationType)) {
        return
      }
      
      // 非活性の場合は説明文のみ更新し、タブは開かない（共通処理）
      if (this.isApplicationDisabled(applicationType)) {
        return
      }
      
      // 非活性でない場合のみタブを開く
      this.openApplicationTab(applicationType)
    },
    
    // 申請タイプが非活性かどうかを判定（共通メソッド）
    isApplicationDisabled(applicationType) {
      const disabledMap = {
        dailyConfirmation: this.isDailyConfirmationDisabled,
        vacation: this.isVacationDisabled,
        holidayWork: this.isHolidayWorkDisabled,
        overtime: this.isOvertimeDisabled,
        earlyWork: this.isEarlyWorkDisabled,
        transfer: false // 振替申請は常に有効
      }
      return disabledMap[applicationType] || false
    },
    
    async openApplicationTab(applicationType) {
      // 既存のタブを閉じて新しいタブを開く
      this.activeApplicationTab = applicationType
      this.currentTab = applicationType
      
      // 申請状態を取得（initialApplicationStatusが指定されている場合は優先）
      // 注意: loadApplicationStatus内でinitialApplicationStatusをチェックしているが、
      // initializeメソッドで既に設定されているため、ここでも再設定する
      if (this.initialApplicationType === applicationType && this.initialApplicationStatus) {
        this.applicationStatuses[applicationType] = this.initialApplicationStatus
      } else {
        await this.loadApplicationStatus(applicationType)
      }
      
      // タブを開いた際の追加データ取得処理（共通マップを使用）
      const tabOpenDataLoadMap = {
        dailyConfirmation: this.loadDailyAttendanceData,
        holidayWork: this.loadMonthlyOvertime
      }
      const dataLoadMethod = tabOpenDataLoadMap[applicationType]
      if (dataLoadMethod) {
        await dataLoadMethod()
      }
      
      // 申請中または承認済みの場合、申請情報を取得（共通処理）
      if (this.isPendingOrApproved(applicationType)) {
        await this.loadApplicationInfo(applicationType)
      }
      
      // 申請中または承認済みの場合、申請データを読み込む（共通処理）
      if (this.isPendingOrApproved(applicationType)) {
        const loadApplicationDataMap = {
          vacation: this.loadVacationApplicationData,
          holidayWork: this.loadHolidayWorkApplicationData,
          overtime: this.loadOvertimeApplicationData,
          earlyWork: this.loadEarlyWorkApplicationData,
          transfer: this.loadTransferApplicationData
        }
        const loadMethod = loadApplicationDataMap[applicationType]
        if (loadMethod) {
          await loadMethod()
        }
      }
    },
    
    async loadApplicationStatus(applicationType) {
      // 初期申請状態が指定されている場合は、APIを呼び出さずにそれを使用
      if (this.initialApplicationType === applicationType && this.initialApplicationStatus) {
        this.applicationStatuses[applicationType] = this.initialApplicationStatus
        // applicationIdも設定する必要がある場合は、ここで設定
        // ただし、initialApplicationStatusからはapplicationIdが取得できないため、
        // 必要に応じてAPIを呼び出すか、TimesheetScreenから渡す必要がある
        return
      }
      
      // 申請タイプをAPIタイプに変換
      const apiType = this.getApiType(applicationType)
      if (!apiType) return
      
      try {
        const response = await getApplicationStatus(this.employeeId, apiType, this.targetDate)
        if (response.success) {
          this.applicationStatuses[applicationType] = response.status || 'NOT_SUBMITTED'
          this.applicationIds[applicationType] = response.applicationId || null
        }
      } catch (error) {
        this.applicationStatuses[applicationType] = 'NOT_SUBMITTED'
        this.applicationIds[applicationType] = null
      }
    },
    
    async loadHolidayWorkApplicationData() {
      // 休日出勤申請データを読み込む（申請中または承認済みの場合）
      try {
        const response = await getHolidayWorkStatus(this.employeeId, this.targetDate)
        if (response.success && response.applicationStatus) {
          // 申請データを取得してフォームに設定
          // TODO: 申請データ取得APIを実装して、申請時の値をフォームに設定
        }
      } catch (error) {
        // エラー時は何もしない
      }
    },
    
    async loadVacationApplicationData() {
      // 休暇申請データを読み込む（申請中または承認済みの場合）
      try {
        const response = await getApplicationInfo(this.employeeId, 'VACATION', this.targetDate)
        if (response.success && response.applicationData) {
          const data = response.applicationData
          // フォームに申請データを設定
          if (data.VACATION_TYPE_CODE) {
            this.vacationForm.vacationType = data.VACATION_TYPE_CODE
          }
          if (data.START_DATE) {
            this.vacationForm.startDate = data.START_DATE
          }
          if (data.END_DATE) {
            this.vacationForm.endDate = data.END_DATE
            this.vacationForm.enableEndDate = true
          } else if (data.START_DATE) {
            // 終了日がない場合は開始日と同じにする
            this.vacationForm.endDate = data.START_DATE
            this.vacationForm.enableEndDate = false
          }
          if (data.REASON) {
            this.vacationForm.reason = data.REASON
          }
          if (data.CONTACT_INFO) {
            this.vacationForm.contact = data.CONTACT_INFO
          }
        }
      } catch (error) {
        // エラー時は何もしない
      }
    },
    
    async loadOvertimeApplicationData() {
      // 残業申請データを読み込む（申請中または承認済みの場合）
      // TODO: 申請データ取得APIを実装して、申請時の値をフォームに設定
    },
    
    async loadEarlyWorkApplicationData() {
      // 早朝勤務申請データを読み込む（申請中または承認済みの場合）
      // TODO: 申請データ取得APIを実装して、申請時の値をフォームに設定
    },
    
    async loadTransferApplicationData() {
      // 振替申請データを読み込む（申請中または承認済みの場合）
      // TODO: 申請データ取得APIを実装して、申請時の値をフォームに設定
    },
    
    closeApplicationTab() {
      this.activeApplicationTab = null
      this.currentTab = 'menu'
    },
    
    switchToMenu() {
      // activeApplicationTabは保持したまま、表示だけメニューに切り替える
      this.currentTab = 'menu'
    },
    
    switchTab(tabName) {
      this.currentTab = tabName
    },
    
    getTabName(applicationType) {
      const names = {
        dailyConfirmation: '日次確定',
        vacation: '休暇申請',
        holidayWork: '休日出勤申請',
        overtime: '残業申請',
        earlyWork: '早朝勤務申請',
        transfer: '振替申請'
      }
      return names[applicationType] || ''
    },
    
    onVacationTypeChange() {
      // 有給休暇が選択された場合のみ残日数を再取得
      if (this.vacationForm.vacationType === 'PAID_LEAVE') {
        this.loadPaidLeaveBalance()
      }
      // 代休が選択された場合、代休取得可能日数を取得
      if (this.vacationForm.vacationType === 'SUBSTITUTE_HOLIDAY') {
        this.loadCompensatoryLeaveBalance()
      }
    },
    
    async submitDailyConfirmation() {
      // エラーメッセージをクリア
      this.dailyConfirmationError = ''
      
      // チェック仕様No.1に基づくバリデーション
      try {
        // 1. 対象日付の勤怠記録が存在するかチェック
        const attendanceData = await getDailyAttendance(this.employeeId, this.targetDate)
        
        if (!attendanceData.success || !attendanceData.attendance) {
          this.dailyConfirmationError = '対象日の勤怠記録が存在しません。'
          return
        }
        
        const attendance = attendanceData.attendance
        
        // 2. 出退社時刻が未入力の場合のチェック（E_APP_002）
        const hasClockIn = !!attendance.CLOCK_IN_TIME
        const hasClockOut = !!attendance.CLOCK_OUT_TIME
        
        if (!hasClockIn && !hasClockOut) {
          this.dailyConfirmationError = '出退社時刻が未入力のため、日次確定できません。'
          return
        } else if (!hasClockIn) {
          this.dailyConfirmationError = '出社時刻が未入力のため、日次確定できません。'
          return
        } else if (!hasClockOut) {
          this.dailyConfirmationError = '退社時刻が未入力のため、日次確定できません。'
          return
        }
        
        // 3. 勤務場所が未選択の場合のチェック（E_APP_003）
        if (!attendance.WORK_LOCATION_CODE) {
          this.dailyConfirmationError = '勤務場所を選択してください。'
          return
        }
        
        // 4. 工数合計と実労働時間が一致しない場合のチェック（E_APP_004）
        const workHoursResponse = await getWorkHours(this.employeeId, this.targetDate)
        let workHoursTotal = 0
        
        if (workHoursResponse.success && workHoursResponse.workHours) {
          workHoursTotal = workHoursResponse.workHours.reduce(
            (sum, wh) => sum + (parseFloat(wh.WORK_HOURS_VALUE) || 0),
            0
          )
        }
        
        const actualWorkHours = parseFloat(attendance.ACTUAL_WORK_HOURS) || 0
        if (actualWorkHours > 0 && Math.abs(actualWorkHours - workHoursTotal) > 0.01) {
          this.dailyConfirmationError = '工数の合計と実労働時間が合いません。'
          return
        }
        
        // 5. 手入力の場合、備考が未入力の場合のチェック（E_APP_005）
        if ((attendance.CLOCK_IN_TYPE === 'MANUAL' || attendance.CLOCK_OUT_TYPE === 'MANUAL') && !this.dailyConfirmationForm.remark) {
          this.dailyConfirmationError = '手入力の場合は備考に理由を入力してください。'
          return
        }
        
        // チェック通過後、備考を保存
        if (this.dailyConfirmationForm.remark) {
          await this.saveRemark()
        }
        
        // 日次確定申請を送信
        this.loading = true
        try {
          const data = await submitDailyConfirmation(this.employeeId, this.targetDate)
          
          if (data.success) {
            this.$emit('application-submitted')
            this.closeDialog()
          } else {
            // エラーメッセージをフォーム上に表示（赤文字）
            this.dailyConfirmationError = data.message || '日次確定申請に失敗しました'
          }
        } catch (error) {
          // エラーメッセージをフォーム上に表示（赤文字）
          this.dailyConfirmationError = '日次確定申請中にエラーが発生しました'
        } finally {
          this.loading = false
        }
      } catch (error) {
        this.dailyConfirmationError = 'バリデーション中にエラーが発生しました'
      }
    },
    
    async saveRemark() {
      try {
        const data = await saveRemark({
          employeeId: this.employeeId,
          workDate: this.targetDate,
          remarkText: this.dailyConfirmationForm.remark
        })
        if (!data.success) {
          // エラー時は何もしない
        }
      } catch (error) {
        // エラー時は何もしない
      }
    },
    
    async submitVacationApplication() {
      // 終了日が無効な場合、終了日を開始日と同じにする
      if (!this.vacationForm.enableEndDate) {
        this.vacationForm.endDate = this.vacationForm.startDate
      }
      
      // 有休残日数チェック（E_APP_015）
      if (this.vacationForm.vacationType === 'PAID_LEAVE') {
        const startDate = new Date(this.vacationForm.startDate)
        const endDate = new Date(this.vacationForm.endDate)
        const vacationDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
        
        if (vacationDays > this.paidLeaveBalance) {
          this.showError('有給休暇の残日数が不足しています。')
          return
        }
      }
      
      await this.submitApplicationCommon({
        endpoint: '/application/vacation/apply',
        body: {
          employeeId: this.employeeId,
          vacationTypeCode: this.vacationForm.vacationType,
          startDate: this.vacationForm.startDate,
          endDate: this.vacationForm.endDate,
          reason: this.vacationForm.reason,
          contact: this.vacationForm.contact
        },
        errorMessage: '休暇申請に失敗しました',
        errorLogMessage: '休暇申請エラー:'
      })
    },
    
    async loadMonthlyOvertime() {
      try {
        const today = new Date(this.targetDate)
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        
        const data = await getMonthlyOvertime(this.employeeId, String(year), month)
        
        if (data.success) {
          this.monthlyOvertime = data.overtimeHours || 0
        } else {
          this.monthlyOvertime = 0
        }
      } catch (error) {
        this.monthlyOvertime = 0
      }
    },
    
    openBreakTimeDialog() {
      // 現在の休憩時間をリストに反映
      if (this.breakTimeList.length === 0) {
        this.breakTimeList = [{ startTime: '12:00', endTime: '13:00' }]
      }
      this.showBreakTimeDialog = true
    },
    
    closeBreakTimeDialog() {
      this.showBreakTimeDialog = false
    },
    
    addBreakTime() {
      this.breakTimeList.push({ startTime: '', endTime: '' })
    },
    
    removeBreakTime(index) {
      if (this.breakTimeList.length > 1) {
        this.breakTimeList.splice(index, 1)
      }
    },
    
    confirmBreakTime() {
      // バリデーション
      for (let i = 0; i < this.breakTimeList.length; i++) {
        const breakTime = this.breakTimeList[i]
        if (!breakTime.startTime || !breakTime.endTime) {
          this.showError('開始時刻と終了時刻を入力してください。')
          return
        }
        if (breakTime.startTime >= breakTime.endTime) {
          this.showError('開始時刻は終了時刻より前の時刻を入力してください。')
          return
        }
      }
      
      // 休憩時間の重複チェック
      for (let i = 0; i < this.breakTimeList.length; i++) {
        for (let j = i + 1; j < this.breakTimeList.length; j++) {
          const break1 = this.breakTimeList[i]
          const break2 = this.breakTimeList[j]
          if (
            (break1.startTime <= break2.startTime && break2.startTime < break1.endTime) ||
            (break1.startTime < break2.endTime && break2.endTime <= break1.endTime) ||
            (break2.startTime <= break1.startTime && break1.startTime < break2.endTime) ||
            (break2.startTime < break1.endTime && break1.endTime <= break2.endTime)
          ) {
            this.showError('休憩時間が重複しています。')
            return
          }
        }
      }
      
      // 休憩時間の合計を計算
      let totalBreakMinutes = 0
      for (const breakTime of this.breakTimeList) {
        const start = this.timeToMinutes(breakTime.startTime)
        const end = this.timeToMinutes(breakTime.endTime)
        totalBreakMinutes += (end - start)
      }
      
      // 時間単位に変換
      this.holidayWorkForm.breakHours = totalBreakMinutes / 60
      
      this.closeBreakTimeDialog()
    },
    
    timeToMinutes(timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number)
      return hours * 60 + minutes
    },
    
    async submitHolidayWorkApplication() {
      // バリデーション
      if (!this.holidayWorkForm.startTime) {
        this.showError('開始時間を入力してください。')
        return
      }
      if (!this.holidayWorkForm.endTime) {
        this.showError('終了時間を入力してください。')
        return
      }
      if (this.holidayWorkForm.startTime >= this.holidayWorkForm.endTime) {
        this.showError('開始時間は終了時間より前の時刻を入力してください。')
        return
      }
      if (!this.holidayWorkForm.breakHours || this.holidayWorkForm.breakHours <= 0) {
        this.showError('休憩時間を入力してください。')
        return
      }
      
      await this.submitApplicationCommon({
        endpoint: '/application/holiday-work',
        body: {
          employeeId: this.employeeId,
          workDate: this.targetDate,
          startTime: this.holidayWorkForm.startTime,
          endTime: this.holidayWorkForm.endTime,
          breakHours: this.holidayWorkForm.breakHours,
          reason: this.holidayWorkForm.reason
        },
        errorMessage: '休日出勤申請に失敗しました',
        errorLogMessage: '休日出勤申請エラー:',
        successCallback: () => {
          // 休日出勤申請状態を更新
          this.hasHolidayWorkApplication = true
        }
      })
    },
    
    async submitOvertimeApplication() {
      // バリデーション
      if (!this.validateDateRange(this.overtimeForm.startDate, this.overtimeForm.endDate)) {
        return
      }
      if (!this.overtimeForm.hours || this.overtimeForm.hours <= 0) {
        this.showError('残業時間を入力してください。')
        return
      }
      
      await this.submitApplicationCommon({
        endpoint: '/application/overtime',
        body: {
          employeeId: this.employeeId,
          startDate: this.overtimeForm.startDate,
          endDate: this.overtimeForm.endDate,
          hours: this.overtimeForm.hours,
          reason: this.overtimeForm.reason
        },
        errorMessage: '残業申請に失敗しました',
        errorLogMessage: '残業申請エラー:'
      })
    },
    
    async submitEarlyWorkApplication() {
      // バリデーション
      if (!this.validateDateRange(this.earlyWorkForm.startDate, this.earlyWorkForm.endDate)) {
        return
      }
      
      await this.submitApplicationCommon({
        endpoint: '/application/early-work',
        body: {
          employeeId: this.employeeId,
          startDate: this.earlyWorkForm.startDate,
          endDate: this.earlyWorkForm.endDate,
          reason: this.earlyWorkForm.reason
        },
        errorMessage: '早朝勤務申請に失敗しました',
        errorLogMessage: '早朝勤務申請エラー:'
      })
    },
    
    async submitTransferApplication() {
      // バリデーション
      if (!this.transferForm.fromDate) {
        this.showError('振替元日を入力してください。')
        return
      }
      if (!this.transferForm.toDate) {
        this.showError('振替先日を入力してください。')
        return
      }
      
      // 振替元日と振替先日が同じ場合のチェック（E_APP_053）
      if (this.transferForm.fromDate === this.transferForm.toDate) {
        this.showError('振替元日と振替先日は異なる日付を入力してください。')
        return
      }
      
      await this.submitApplicationCommon({
        endpoint: '/application/transfer',
        body: {
          employeeId: this.employeeId,
          fromDate: this.transferForm.fromDate,
          toDate: this.transferForm.toDate,
          reason: this.transferForm.reason
        },
        errorMessage: '振替申請に失敗しました',
        errorLogMessage: '振替申請エラー:'
      })
    },
    
    showError(message) {
      this.errorMessage = message
      this.showErrorDialog = true
    },
    
    closeErrorDialog() {
      this.showErrorDialog = false
      this.errorMessage = ''
    },
    
    closeDialog() {
      this.$emit('close')
    },
    
    // 申請取消（共通メソッド）
    async cancelApplication(applicationType) {
      // 申請情報を取得（applicationIdを取得するため）
      await this.loadApplicationInfo(applicationType)
      
      // applicationIdが取得できていない場合は、申請状態を取得
      if (!this.applicationIds[applicationType]) {
        await this.loadApplicationStatus(applicationType)
      }
      
      // 直接申請取消を実行
      await this.executeCancelApplication(applicationType)
    },
    
    // 各申請タイプごとの取消メソッド（後方互換性のため残す）
    async cancelDailyConfirmation() {
      return this.cancelApplication('dailyConfirmation')
    },
    
    async cancelVacationApplication() {
      return this.cancelApplication('vacation')
    },
    
    async cancelHolidayWorkApplication() {
      return this.cancelApplication('holidayWork')
    },
    
    async cancelOvertimeApplication() {
      return this.cancelApplication('overtime')
    },
    
    async cancelEarlyWorkApplication() {
      return this.cancelApplication('earlyWork')
    },
    
    async cancelTransferApplication() {
      return this.cancelApplication('transfer')
    },
    
    // 申請取消を実行
    async executeCancelApplication(applicationType) {
      if (!applicationType) return
      
      // applicationIdが取得されていない場合は、申請状態を取得
      if (!this.applicationIds[applicationType]) {
        await this.loadApplicationStatus(applicationType)
      }
      
      this.loading = true
      try {
        const apiType = this.getApiType(applicationType)
        if (!apiType) return
        
        const applicationId = this.applicationIds[applicationType]
        
        // 日次確定の場合はtargetDateを渡す（共通マップを使用）
        const cancelDateMap = {
          dailyConfirmation: this.targetDate
        }
        const cancelDate = cancelDateMap[applicationType] || null
        
        const response = await cancelApplication(
          this.employeeId,
          apiType,
          applicationId,
          cancelDate
        )
        
        if (response.success) {
          // 申請取消成功後の追加処理（共通マップを使用）
          const cancelSuccessCallbackMap = {
            holidayWork: async () => {
              await this.loadHolidayWorkStatus()
              // 代休が選択されている場合、代休取得可能日数を再計算
              if (this.vacationForm.vacationType === 'SUBSTITUTE_HOLIDAY') {
                await this.loadCompensatoryLeaveBalance()
              }
            }
          }
          const successCallback = cancelSuccessCallbackMap[applicationType]
          if (successCallback) {
            await successCallback()
          }
          this.$emit('application-submitted')
          this.closeDialog()
        } else {
          this.showError(response.message || '申請取消に失敗しました')
        }
      } catch (error) {
        this.showError(error.message || '申請取消中にエラーが発生しました')
      } finally {
        this.loading = false
      }
    },
    
  },
  
  beforeUnmount() {
    // コンポーネント破棄時にスクロールをアンロック
    document.body.style.overflow = ''
  }
}
</script>

<style scoped>
.dialog-overlay {
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

.dialog-container {
  position: relative;
  width: 710px;
  height: 396px;
  background-color: white;
  border: 1px solid rgb(117, 157, 192);
  border-radius: 0px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ヘッダー */
.dialog-header {
  background-color: rgb(205, 231, 255);
  color: rgb(25, 24, 24);
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 35px;
}

.dialog-title {
  font-size: 14.159px;
  font-family: Arial, sans-serif;
  color: rgb(25, 24, 24);
}

.close-button {
  background: none;
  border: none;
  color: rgb(136, 164, 191);
  font-size: 14.159px;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 18px;
  height: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: rgb(100, 120, 140);
}

/* 日付表示 */
.date-display {
  padding: 10px 13px;
  font-size: 14.159px;
  font-family: Arial, sans-serif;
  color: rgb(25, 24, 24);
  background-color: white;
}

/* コンテンツエリア */
.content-area {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: white;
}

/* タブリスト*/
.tab-list {
  display: flex;
  gap: 0;
  margin: 0 10px;
  background-color: white;
  border-bottom: 1px solid rgb(181, 188, 199);
}

/* タブ*/
.tab {
  min-width: 75px;
  height: 34px;
  background-color: rgb(252, 252, 252);
  border-top: 1px solid rgb(181, 188, 199);
  border-right: 1px solid rgb(181, 188, 199);
  border-bottom: 1px solid rgb(252, 252, 252);
  border-left: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  cursor: pointer;
  position: relative;
  gap: 8px;
  transition: background-color 0.2s;
  z-index: 2;
  margin-bottom: -1px;
}

.tab:first-child {
  border-left: 1px solid rgb(181, 188, 199);
}

.tab:hover {
  background-color: rgb(245, 245, 245);
  border-bottom: 1px solid rgb(245, 245, 245);
}

.tab.active {
  background-color: rgb(252, 252, 252);
  cursor: pointer;
  border-bottom: 1px solid rgb(252, 252, 252);
  z-index: 2;
}

.tab-title {
  font-size: 14.159px;
  font-family: Arial, sans-serif;
  color: rgb(0, 0, 0);
  white-space: nowrap;
}

.tab-close-button {
  background: none;
  border: none;
  color: rgb(136, 164, 191);
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-close-button:hover {
  color: rgb(100, 120, 140);
}

/* メインコンテンツエリア */
.main-content-area {
  margin: 0 10px 50px 10px;
  flex: 0 1 auto;
  background-color: rgb(252, 252, 252);
  border-left: 1px solid rgb(181, 188, 199);
  border-right: 1px solid rgb(181, 188, 199);
  border-bottom: 1px solid rgb(181, 188, 199);
  border-top: none;
  padding: 6px 15px;
  display: flex;
  overflow-y: auto;
  min-height: 0;
  align-items: flex-start;
}

/* メニューリスト*/
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 199px;
  flex-shrink: 0;
  margin-left: 0px;
}

.menu-item {
  width: 199px;
  height: 31px;
  background-color: rgb(217, 217, 217);
  border: none;
  border-radius: 0px;
  padding: 6px 9px;
  cursor: pointer;
  font-size: 14.159px;
  font-family: Arial, sans-serif;
  color: rgb(0, 0, 0);
  text-align: left;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: rgb(200, 200, 200);
}

.menu-item:disabled,
.menu-item-disabled {
  background-color: rgb(217, 217, 217);
  color: rgb(255, 255, 255);
  cursor: not-allowed;
  opacity: 1;
}

.menu-item:disabled:hover,
.menu-item-disabled:hover {
  background-color: rgb(217, 217, 217);
}

/* メニュー説明文エリア */
.menu-descriptions {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-left: 8px;
  padding-top: 0px;
  flex: 1;
  min-width: 200px;
  position: relative;
  z-index: 1;
}

.menu-description {
  height: 31px;
  margin: 0;
  padding: 6px 0;
  font-size: 14.159px;
  font-family: Arial, sans-serif;
  color: rgb(0, 0, 0);
  line-height: 19px;
  display: flex;
  align-items: center;
  white-space: normal;
  word-wrap: break-word;
  min-width: 0;
  width: 100%;
}

/* フォーム */
.form-container {
  margin: 0 10px 50px 10px;
  flex: 0 1 auto;
  background-color: rgb(252, 252, 252);
  border-left: 1px solid rgb(181, 188, 199);
  border-right: 1px solid rgb(181, 188, 199);
  border-bottom: 1px solid rgb(181, 188, 199);
  border-top: none;
  padding: 20px;
  overflow-y: auto;
}

.form-description {
  padding: 15px;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
  font-size: 14px;
}


.text-input,
.date-input,
.textarea-input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.text-input:focus,
.date-input:focus,
.time-input:focus,
.textarea-input:focus,
select:focus {
  outline: none;
  border-color: rgb(37, 100, 153);
  box-shadow: 0 0 0 2px rgba(37, 100, 153, 0.1);
}

.textarea-input {
  padding: 1px 6px;
  font-size: 14.159px;
  line-height: 1.1;
  height: 12px;
  min-height: 12px;
  resize: none;
  margin-bottom: 4px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-separator {
  color: #666;
}

.date-range-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin: 0;
  flex-shrink: 0;
}

.date-range-checkbox:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.date-range-checkbox-label {
  color: #333;
  font-size: 14px;
  margin: 0;
  margin-top: 7px;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.info-text {
  padding: 10px;
  color: #333;
}

.holiday-work-info-text {
  flex: 1;
  font-size: 14.159px;
  font-family: Arial, sans-serif;
  color: rgb(0, 0, 0);
  padding: 0;
  margin: 0;
}

/* 休日出勤申請の申請日時の値を少し下に */
.application-info-section .form-group-inline:first-child .holiday-work-info-text {
  margin-top: 12px;
}

/* 休日出勤申請の状況の値を少し上に */
.application-info-section .form-group-inline:nth-child(2) .holiday-work-info-text {
  margin-top: 8px;
}

/* 休暇申請の申請状況を上に詰める */
.application-info-section .form-group-inline:first-child {
  margin-bottom: 2px;
}

/* 休暇申請の申請日時と状況のフォントサイズを統一し、ラベルの位置まで上にずらす */
.application-info-section .form-group-inline:first-child .info-text-inline,
.application-info-section .form-group-inline:nth-child(2) .info-text-inline {
  font-size: 14.159px;
  font-family: Arial, sans-serif;
  margin-top: 0px;
  line-height: 1.5;
}

/* 休暇申請の状況と承認履歴を上にずらす */
.application-info-section .form-group-inline:nth-child(2) {
  margin-top: -16px;
  margin-bottom: 2px;
}

.application-info-section .form-group-inline:nth-child(3) {
  margin-top: -16px;
}

/* 日次確定フォーム専用スタイル */
.daily-confirmation-container {
  padding: 6px 15px;
  display: flex;
  flex-direction: column;
}

.daily-confirmation-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex: 1;
}

.daily-confirmation-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: flex-start;
  padding-top: 0;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 24px;
  width: 100%;
}

.form-row-textarea {
  align-items: flex-start;
  margin-top: 0;
}

.form-label {
  min-width: 120px;
  font-size: 14.159px;
  font-family: Arial, sans-serif;
  color: rgb(0, 0, 0);
  font-weight: normal;
  padding: 0;
}

.form-label-inline {
  min-width: 80px;
  white-space: nowrap;
}

.daily-confirmation-value {
  flex: 1;
  font-size: 14.159px;
  font-family: Arial, sans-serif;
  color: rgb(0, 0, 0);
  padding: 0;
  margin: 0;
}

.daily-confirmation-value-inline {
  flex: 1;
  margin-left: 0;
}

.daily-confirmation-textarea {
  flex: 1;
  margin: 0;
  border: 1px solid rgb(173, 216, 230);
  background-color: white;
  padding: 6px;
  font-size: 14.159px;
  line-height: 1.5;
  min-height: 60px;
  resize: vertical;
  margin-bottom: 4px;
}

.daily-confirmation-error-message {
  flex: 1;
  font-size: 14.159px;
  font-family: Arial, sans-serif;
  color: #ff0000;
  padding: 4px 0;
  margin-left: 120px;
}

.daily-confirmation-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  min-width: 120px;
}

.daily-confirmation-submit {
  padding: 12px 24px;
  width: 100%;
  white-space: nowrap;
}

.cancel-link {
  background: none;
  border: none;
  color: rgb(96, 96, 255);
  text-decoration: underline;
  font-size: 12px;
  font-family: Arial, sans-serif;
  cursor: pointer;
  padding: 0;
  text-align: left;
}

.cancel-link:hover {
  color: rgb(70, 70, 200);
}

/* フォームコンテナのレイアウト */
.form-content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.form-content-left {
  flex: 1;
}

/* ボタン */
.form-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.form-buttons-right {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  margin-top: 0;
}

.form-buttons-right .cancel-link {
  margin-right: 8px;
}

.submit-button {
  padding: 6px 16px;
  background-color: rgb(37, 100, 153);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: rgb(25, 80, 133);
}

.cancel-button {
  padding: 12px 30px;
  background-color: #f0f0f0;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button:hover {
  background-color: #e0e0e0;
  border-color: #999;
}

.cancel-application-button {
  padding: 6px 16px;
  background-color: #dc3545 !important;
  color: white !important;
  border: none !important;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-application-button:hover {
  background-color: #c82333 !important;
}

/* 入力欄のdisabled/readonlyスタイル */
input:disabled,
textarea:disabled,
select:disabled {
  background-color: #f5f5f5 !important;
  color: #666 !important;
  cursor: not-allowed !important;
}

input[readonly],
textarea[readonly] {
  background-color: #f5f5f5 !important;
  color: #666 !important;
  cursor: default !important;
}

/* フッター */
.dialog-footer {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
}

.close-link {
  color: rgb(96, 96, 255);
  text-decoration: underline;
  font-size: 14.159px;
  font-family: Arial, sans-serif;
}

.close-link:hover {
  color: rgb(70, 70, 200);
}

/* 休日出勤申請フォーム用スタイル */
.overtime-display {
  font-size: 14px;
  color: #333;
  padding: 0;
  margin-top: 12px;
}

/* 休日出勤申請フォームの時間セクションを上にずらす */
.form-content-left > .form-group-compact:has(.time-break-container) {
  margin-top: -15px;
  margin-bottom: 10px;
}

/* 休日出勤申請フォームの申請情報セクションを上にずらす */
.form-content-left > .form-group-compact:has(.time-break-container) ~ .application-info-section {
  margin-top: -10px;
}

/* 休日出勤申請フォームの(事後申請)ラベルを上にずらす */
.form-content-left > .form-group-compact:has(.time-break-container) .post-application-label {
  margin-top: -6px;
  display: inline-block;
}

/* 休日出勤申請フォームの申請情報セクション内のラベル（申請日時、状況、承認履歴）を上にずらす */
.form-content-left > .form-group-compact:has(.time-break-container) ~ .application-info-section .label-inline {
  margin-top: 0px;
}

/* 休日出勤申請フォームの承認履歴テーブルを上にずらす */
.form-content-left > .form-group-compact:has(.time-break-container) ~ .application-info-section .approval-history-container {
  margin-top: -2px;
}

.form-group-inline {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
  margin-top: 0;
  width: 100%;
}

.form-group-compact {
  margin-bottom: 6px;
}

.label-inline {
  margin-bottom: 0;
  white-space: nowrap;
  line-height: 1.5;
  padding: 0;
  margin-top: 10px;
  min-width: 80px;
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.label-top-aligned {
  margin-top: 0;
  align-self: flex-start;
}

.time-break-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.time-range {
  display: flex;
  align-items: center;
  gap: 4px;
}

.time-input-narrow {
  width: 70px;
  padding: 2px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  font-family: inherit;
  height: 24px;
  line-height: 1.2;
  box-sizing: border-box;
}

.time-input-narrow::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}

.time-input-narrow:focus {
  outline: none;
  border-color: rgb(37, 100, 153);
  box-shadow: 0 0 0 2px rgba(37, 100, 153, 0.1);
}

.time-input {
  flex: 1;
}

.time-separator {
  color: #666;
  font-size: 14px;
}

.break-time-container {
  display: flex;
  align-items: center;
  gap: 4px;
}

.break-time-label {
  font-size: 14px;
  color: #333;
  font-weight: normal;
  line-height: 1.5;
}

.break-time-display {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.textarea-input-large {
  min-height: 40px;
  resize: vertical;
}

.textarea-inline {
  flex: 1;
  margin-top: 0;
  width: 100%;
  min-width: 0;
}

/* インライン要素用のスタイル */
.select-inline {
  flex: 1;
  min-width: 0;
}

.text-input-inline {
  flex: 1;
  min-width: 0;
}

.date-input-inline {
  flex: 1;
  min-width: 0;
}

.date-range-inline {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-text-inline {
  flex: 1;
  margin-top: 9px;
}

.info-text-multiline {
  flex: 1;
  margin-top: 9px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.form-label-inline {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 0;
  white-space: nowrap;
  min-width: 80px;
}

.daily-confirmation-value-inline {
  display: inline-block;
  margin-left: 0;
}

.change-link {
  color: rgb(96, 96, 255);
  text-decoration: underline;
  font-size: 14px;
  cursor: pointer;
  margin-top: -3px;
}

.change-link:hover {
  color: rgb(70, 70, 200);
}

.post-application-label {
  font-size: 14px;
  color: #666;
  margin-left: 4px;
}

/* 休憩時間設定ダイアログ */
.dialog-overlay-break-time {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.break-time-dialog {
  background: white;
  border-radius: 8px;
  padding: 20px;
  min-width: 400px;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.break-time-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.break-time-dialog-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.break-time-dialog-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.break-time-dialog-close:hover {
  color: #333;
}

.break-time-dialog-content {
  margin-bottom: 20px;
}

.break-time-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.break-time-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.break-time-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.break-time-separator {
  color: #666;
  font-size: 14px;
}

.break-time-delete {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  opacity: 0.6;
}

.break-time-delete:hover:not(:disabled) {
  opacity: 1;
}

.break-time-delete:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.break-time-add {
  width: 100%;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

.break-time-add:hover {
  background-color: #e0e0e0;
}

.break-time-dialog-buttons {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.break-time-ok {
  padding: 10px 20px;
  background-color: rgb(37, 100, 153);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.break-time-ok:hover {
  background-color: rgb(25, 80, 133);
}

.break-time-cancel {
  color: rgb(96, 96, 255);
  text-decoration: underline;
  font-size: 14px;
  cursor: pointer;
}

.break-time-cancel:hover {
  color: rgb(70, 70, 200);
}

/* ローディング */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f0f0f0;
  border-top: 5px solid rgb(37, 100, 153);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay p {
  margin-top: 15px;
  color: #666;
  font-size: 14px;
}

/* エラーダイアログ */
.error-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10001;
}

.error-dialog-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  min-width: 400px;
  max-width: 500px;
}

.error-dialog-header {
  background-color: #dc3545;
  color: white;
  padding: 15px 20px;
  border-radius: 8px 8px 0 0;
}

.error-dialog-title {
  font-size: 18px;
  font-weight: bold;
}

.error-dialog-message {
  padding: 30px 20px;
  font-size: 14px;
  color: #333;
  text-align: center;
  line-height: 1.6;
}

.error-dialog-ok-button {
  width: 100px;
  margin: 0 auto 20px;
  display: block;
  padding: 10px 20px;
  background-color: rgb(37, 100, 153);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.error-dialog-ok-button:hover {
  background-color: rgb(25, 80, 133);
}

/* 申請情報セクション */
.application-info-section {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
}

.form-row-full-width {
  flex-direction: column;
  align-items: flex-start;
}

.form-group-full-width {
  flex-direction: column;
  align-items: flex-start;
}

/* 承認履歴テーブル */
.approval-history-container {
  width: 100%;
  margin-top: 8px;
}

.approval-history-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14.159px;
  font-family: Arial, sans-serif;
}

.approval-history-table thead {
  background-color: rgb(205, 231, 255);
}

.approval-history-table th {
  padding: 8px;
  text-align: left;
  border: 1px solid rgb(181, 188, 199);
  font-weight: normal;
  color: rgb(0, 0, 0);
}

.approval-history-table td {
  padding: 8px;
  border: 1px solid rgb(181, 188, 199);
  background-color: white;
  color: rgb(0, 0, 0);
}

.approval-history-table tbody tr:nth-child(even) {
  background-color: rgb(252, 252, 252);
}

.approval-history-table .no-history {
  text-align: center;
  color: #666;
  font-style: italic;
}

.approval-history-container {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid rgb(181, 188, 199);
}


/* 休暇申請フォームの「有休残日数」「期間」「備考」「連絡先」を上にずらす */
/* 有休残日数セクション（info-text-inlineを含むform-group-inline） */
.form-content-left > .form-group-inline:has(.info-text-inline) {
  margin-top: -20px;
  margin-bottom: 8px;
  gap: 2px;
}

/* 期間セクション（date-range-inlineを含むform-group-inline） */
.form-content-left > .form-group-inline:has(.date-range-inline) {
  margin-top: -20px;
  margin-bottom: 8px;
}

/* 期間セクションの日付入力フィールドの縦幅を狭める */
.form-content-left > .form-group-inline:has(.date-range-inline) .date-input {
  padding: 6px 10px;
  height: 28px;
  box-sizing: border-box;
  width: 140px;
  flex: 0 0 auto;
  margin-top: -9px;
}

/* 期間セクションのチェックボックスとラベルを上にずらす */
.form-content-left > .form-group-inline:has(.date-range-inline) .date-range-checkbox {
  margin-top: -9px;
}

.form-content-left > .form-group-inline:has(.date-range-inline) .date-range-checkbox-label {
  margin-top: -2px;
}

/* 期間セクションの日付入力フィールドをラベルと同じ位置まで下げる */
.form-content-left > .form-group-inline:has(.date-range-inline) .date-range-inline {
  margin-top: 10px;
}

/* 備考セクション（textarea-input-largeを含むform-group-compact） */
.form-content-left > .form-group-compact:has(.textarea-input-large) {
  margin-top: -25px;
  margin-bottom: 15px;
}

/* 休日出勤申請フォームの備考セクションを上にずらす */
.form-content-left > .form-group-compact:has(.time-break-container) ~ .form-group-compact:has(.textarea-input-large) {
  margin-top: -20px;
  margin-bottom: 15px;
}

/* 備考のテキストボックスを大きくする */
.form-content-left > .form-group-compact:has(.textarea-input-large) .textarea-input-large {
  min-height: 50px;
}

/* 備考のテキストボックスを下にずらす */
.form-content-left > .form-group-compact:has(.textarea-input-large) .textarea-inline {
  margin-top: 15px;
}

/* 連絡先セクション（text-inputを含むform-group-compact、ただしtextarea-input-largeを含まないもの） */
.form-content-left > .form-group-compact:has(.text-input):not(:has(.textarea-input-large)) {
  margin-top: -20px;
  margin-bottom: 0;
}

/* 連絡先のテキストボックスを1行に収まる大きさにし、ラベルと同じ並びになるように下にずらす */
.form-content-left > .form-group-compact:has(.text-input):not(:has(.textarea-input-large)) .text-input {
  height: 24px;
  margin-top: 9px;
}

/* 有休残日数と日数のラベルを少し上にずらす */
.form-content-left > .form-group-inline:has(.info-text-inline) .label-inline {
  margin-top: 5px;
}

.form-content-left > .form-group-inline:has(.info-text-inline) .info-text-inline {
  margin-top: -7px;
  font-size: 14px;
}
</style>
