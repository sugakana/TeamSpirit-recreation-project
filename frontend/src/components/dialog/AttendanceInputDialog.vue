<template>
  <div v-if="visible" class="dialog-overlay" @click.self="closeDialog">
    <div class="dialog-container" :style="{ height: dialogHeight + 'px' }">
      <!-- ヘッダー部分 -->
      <div class="dialog-header">
        <span class="dialog-title">勤怠情報入力</span>
        <button class="close-button" @click="closeDialog">×</button>
      </div>
      
      <!-- 日付表示 -->
      <div class="date-display">{{ formattedDate }}</div>
      
      <!-- 入力エリア -->
      <div class="input-area" :style="{ height: inputAreaHeight + 'px' }">
        <!-- 出社 -->
        <div class="input-row clock-in-row">
          <label class="input-label clock-in-label">出社</label>
          <input 
            type="text" 
            v-model="form.clockIn"
            :disabled="isReadOnly"
            class="time-input"
            @input="onClockInChange"
            ref="clockInInput"
          />
          <span 
            v-if="isClockInManual && originalClockIn" 
            class="stamp-time-label"
          >
            打刻 {{ originalClockIn }}
          </span>
        </div>
        
        <!-- 退社 -->
        <div class="input-row clock-out-row">
          <label class="input-label clock-out-label">退社</label>
          <input 
            type="text" 
            v-model="form.clockOut"
            :disabled="isReadOnly"
            class="time-input"
            @input="onClockOutChange"
            ref="clockOutInput"
          />
          <span 
            v-if="isClockOutManual && originalClockOut" 
            class="stamp-time-label"
          >
            打刻 ({{ originalClockOut }})
          </span>
        </div>
        
        <!-- 休憩（動的表示） -->
        <div 
          v-for="index in visibleBreakCount" 
          :key="`break-${index}`"
          class="input-row break-row"
          :style="{ top: getBreakRowTop(index) + 'px' }"
        >
          <label class="input-label break-label">休憩{{ index }}</label>
          <input 
            type="text" 
            v-model="form[`break${index}Start`]"
            :disabled="isReadOnly"
            class="time-input time-input-small"
          />
          <span class="tilde">～</span>
          <input 
            type="text" 
            v-model="form[`break${index}End`]"
            :disabled="isReadOnly"
            class="time-input time-input-small"
          />
          <button 
            v-if="!isReadOnly && index === visibleBreakCount" 
            class="add-button" 
            :class="{ 'add-button-disabled': !canAddBreak }"
            :disabled="!canAddBreak"
            @click="addBreak"
            title="休憩を追加"
          >
            <span class="plus-icon">＋</span>
          </button>
        </div>
        
        <!-- 公用外出（動的表示） -->
        <div 
          v-for="index in visibleOutingCount" 
          :key="`outing-${index}`"
          class="input-row outing-row"
          :style="{ top: getOutingRowTop(index) + 'px' }"
        >
          <label class="input-label outing-label">公用外出{{ index }}</label>
          <input 
            type="text" 
            v-model="form[`outing${index}Start`]"
            :disabled="isReadOnly"
            class="time-input time-input-small"
          />
          <span class="tilde">～</span>
          <input 
            type="text" 
            v-model="form[`outing${index}End`]"
            :disabled="isReadOnly"
            class="time-input time-input-small"
          />
          <button 
            v-if="!isReadOnly && index === visibleOutingCount" 
            class="add-button" 
            :class="{ 'add-button-disabled': !canAddOuting }"
            :disabled="!canAddOuting"
            @click="addOuting"
            title="公用外出を追加"
          >
            <span class="plus-icon">＋</span>
          </button>
        </div>
        
        <!-- 勤務場所 -->
        <div class="input-row location-row" :style="{ top: getLocationRowTop() + 'px' }">
          <label class="input-label location-label">勤務場所</label>
          <select 
            v-model="form.workLocation"
            :disabled="isReadOnly"
            class="location-select"
          >
            <option value=""></option>
            <option 
              v-for="location in workLocations" 
              :key="location.code" 
              :value="location.code"
            >
              {{ location.name }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- 操作ボタンエリア（編集可能時） -->
      <div v-if="!isReadOnly" class="button-area" :style="{ top: buttonAreaTop + 'px' }">
        <button class="register-button" @click="onRegister">登録</button>
        <a href="#" class="cancel-link" @click.prevent="closeDialog">キャンセル</a>
        <button class="reset-button" @click="onReset">リセット</button>
      </div>
      
      <!-- 日次確定チェックボックス（編集可能時） -->
      <div v-if="!isReadOnly" class="daily-confirm-area" :style="{ top: dailyConfirmAreaTop + 'px' }">
        <label class="daily-confirm-checkbox">
          <input 
            type="checkbox" 
            v-model="form.isDailyConfirm"
            :disabled="isDailyConfirmationDisabled"
          />
          日次確定する
        </label>
      </div>
      
      <!-- 閉じるリンク（閲覧専用時） -->
      <div v-if="isReadOnly" class="close-link-area" :style="{ top: closeLinkAreaTop + 'px' }">
        <a href="#" class="close-link" @click.prevent="closeDialog">閉じる</a>
      </div>
      
      <!-- エラーメッセージ表示エリア（勤務場所の左下） -->
      <div v-if="validationError" class="validation-error-area" :style="{ top: validationErrorAreaTop + 'px' }">
        <span class="validation-error-message">{{ validationError }}</span>
      </div>
    </div>
    
    <!-- エラーダイアログ -->
    <div v-if="showErrorDialog" class="error-dialog-overlay">
      <div class="error-dialog-container">
        <div class="error-dialog-header">
          <span class="error-dialog-title">エラー</span>
        </div>
        <div class="error-dialog-body">
          <p class="error-dialog-message">{{ errorMessage }}</p>
        </div>
        <div class="error-dialog-footer">
          <button class="error-dialog-ok-button" @click="closeErrorDialog">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HolidayJp from '@holiday-jp/holiday_jp'
import { getDailyAttendance, updateAttendanceRecord, submitDailyConfirmation, getWorkLocations, getWorkHours, getHolidayWorkStatus } from '@/services/api'

export default {
  name: 'AttendanceInputDialog',
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
    initialFocus: {
      type: String,
      default: 'clockIn' // 'clockIn', 'clockOut', 'location'
    },
    approvalStatus: {
      type: String,
      default: 'NOT_SUBMITTED' // 'NOT_SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED'
    },
    initialData: {
      type: Object,
      default: null // 勤務表画面から渡される既存データ（clockIn, clockOut, locationなど）
    }
  },
  emits: ['close', 'updated'],
  data() {
    return {
      form: {
        clockIn: '',
        clockOut: '',
        break1Start: '',
        break1End: '',
        break2Start: '',
        break2End: '',
        break3Start: '',
        break3End: '',
        break4Start: '',
        break4End: '',
        break5Start: '',
        break5End: '',
        break6Start: '',
        break6End: '',
        break7Start: '',
        break7End: '',
        break8Start: '',
        break8End: '',
        break9Start: '',
        break9End: '',
        break10Start: '',
        break10End: '',
        outing1Start: '',
        outing1End: '',
        outing2Start: '',
        outing2End: '',
        outing3Start: '',
        outing3End: '',
        outing4Start: '',
        outing4End: '',
        outing5Start: '',
        outing5End: '',
        workLocation: '',
        isDailyConfirm: false
      },
      originalData: null,
      workLocations: [],
      isClockInManual: false,
      isClockOutManual: false,
      originalIsClockInManual: false, // APIから取得した元の手入力フラグ（リセット用）
      originalIsClockOutManual: false, // APIから取得した元の手入力フラグ（リセット用）
      originalClockIn: '',
      originalClockOut: '',
      clockInType: '', // 既存の出社時刻の打刻種別
      clockOutType: '', // 既存の退社時刻の打刻種別
      originalClockInType: '', // 元の打刻種別（STAMPまたはSCHEDULED）
      originalClockOutType: '', // 元の打刻種別（STAMPまたはSCHEDULED）
      showErrorDialog: false,
      errorMessage: '',
      validationError: '', // バリデーションエラーメッセージ（グレーの四角形の左下に表示）
      workHoursTotal: 0,
      actualWorkHours: 0,
      loading: false,
      visibleBreakCount: 2, // 初期表示は休憩1と休憩2
      visibleOutingCount: 2, // 初期表示は公用外出1と公用外出2
      // 休日出勤申請状態
      hasHolidayWorkApplication: false,
      // 勤怠データ（打刻時刻の状態確認用）
      attendanceData: null
    }
  },
  computed: {
    // 閲覧専用モード（申請中または承認済みの場合）
    isReadOnly() {
      return this.approvalStatus === 'PENDING' || this.approvalStatus === 'APPROVED'
    },
    // 休憩追加ボタンの活性状態（最大10個）
    canAddBreak() {
      return !this.isReadOnly && this.visibleBreakCount < 10
    },
    // 公用外出追加ボタンの活性状態（最大5個）
    canAddOuting() {
      return !this.isReadOnly && this.visibleOutingCount < 5
    },
    // 日付表示フォーマット
    formattedDate() {
      if (!this.targetDate) return ''
      const date = new Date(this.targetDate)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const dayNames = ['日', '月', '火', '水', '木', '金', '土']
      const dayOfWeek = dayNames[date.getDay()]
      return `${year}年${month}月${day}日${dayOfWeek}曜日`
    },
    // 勤務場所の行の位置（入力エリア内での相対位置）
    locationRowTopInArea() {
      // 出社: 4px, 退社: 36px
      // 休憩1: 68px, 休憩2以降: 前の行 + 31px
      // 公用外出1以降: 休憩の後 + 31px
      const breakStartTop = 68
      const rowSpacing = 31
      const breakRowsTop = breakStartTop + (this.visibleBreakCount - 1) * rowSpacing
      const outingRowsTop = breakRowsTop + this.visibleOutingCount * rowSpacing
      return outingRowsTop + rowSpacing
    },
    // 入力エリアの高さ
    inputAreaHeight() {
      // 勤務場所の行の位置 + 行の高さ(26px) + 余白
      return this.locationRowTopInArea + 26 + 4
    },
    // 勤務場所の行の位置（ダイアログ全体での絶対位置）
    locationRowTop() {
      const inputAreaTop = 64
      return inputAreaTop + this.locationRowTopInArea
    },
    // ボタンエリアの位置
    buttonAreaTop() {
      // 勤務場所の行の下に余白を追加
      // エラーメッセージがある場合は、その分下にずらす
      let errorAreaHeight = 0

      if (this.validationError) {
        errorAreaHeight = 20
      }
      return this.locationRowTop + 31 + 5 + errorAreaHeight
    },
    // 日次確定エリアの位置
    dailyConfirmAreaTop() {
      // ボタンエリアの下に余白を追加（下にずらすため余白を大きく）
      return this.buttonAreaTop + 46
    },
    // ダイアログの高さ
    dialogHeight() {
      // ヘッダー(32px) + 日付表示エリア(19px) + 入力エリアの高さ + 下部エリア + 余白
      const headerHeight = 32
      const dateDisplayHeight = 19
      const inputAreaTop = 64
      const bottomMargin = 20
      
      // エラーメッセージ表示エリアの高さ（エラーがある場合）
      let errorAreaHeight = 0

      if (this.validationError) {
        errorAreaHeight = 20
      }
      
      // 下部エリアの高さ（編集可能時と閲覧専用時で異なる）
      let bottomAreaHeight = 0
      if (this.isReadOnly) {
        // 閲覧専用時：閉じるリンクエリア(48px = padding 16px * 2 + テキスト高さ)
        bottomAreaHeight = 48
      } else {
        // 編集可能時：ボタンエリア(46px) + チェックボックスエリア(19px) + 余白(10px)
        bottomAreaHeight = 46 + 19 + 10
      }
      
      // エラーメッセージがある場合は、勤務場所の下に配置されるため、その分の高さを追加
      return headerHeight + dateDisplayHeight + this.inputAreaHeight + errorAreaHeight + bottomAreaHeight + bottomMargin
    },
    // 閉じるリンクエリアの位置（閲覧専用時）
    closeLinkAreaTop() {
      // 勤務場所の行の下に余白を追加
      // エラーメッセージがある場合は、その分下にずらす
      let errorAreaHeight = 0

      if (this.validationError) {
        errorAreaHeight = 20
      }
      return this.locationRowTop + 31 + 5 + errorAreaHeight
    },
    // エラーメッセージ表示エリアの位置（勤務場所の左下）
    validationErrorAreaTop() {
      // 勤務場所の行の下に配置
      return this.locationRowTop + 31 + 5
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
        console.error('祝日判定エラー:', error)
        return false
      }
    },
    // 日次確定チェックボックスが非活性かどうか
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
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        // ダイアログが表示される際に初期化処理を実行
        this.initializeDialog()
        // スクロールをロック
        document.body.style.overflow = 'hidden'
      } else {
        // スクロールをアンロック
        document.body.style.overflow = ''
      }
    },
    targetDate() {
      // 対象日付が変更された場合も再初期化
      if (this.visible) {
        this.initializeDialog()
      }
    },
    // フォームの出社・退社時刻が変更された場合、attendanceDataを更新
    'form.clockIn'() {
      // フォームの値が変更された場合、attendanceDataを更新（リアルタイムでチェックボックスの活性状態を更新）
      if (this.attendanceData) {
        // フォームの値をattendanceDataに反映（簡易的な更新）
        // 実際のAPIから取得した値とは異なる場合があるが、チェックボックスの活性状態判定には十分
        this.attendanceData = {
          ...this.attendanceData,
          CLOCK_IN_TIME: this.form.clockIn || null
        }
      }
    },
    'form.clockOut'() {
      // フォームの値が変更された場合、attendanceDataを更新（リアルタイムでチェックボックスの活性状態を更新）
      if (this.attendanceData) {
        // フォームの値をattendanceDataに反映（簡易的な更新）
        // 実際のAPIから取得した値とは異なる場合があるが、チェックボックスの活性状態判定には十分
        this.attendanceData = {
          ...this.attendanceData,
          CLOCK_OUT_TIME: this.form.clockOut || null
        }
      }
    }
  },
  mounted() {
    // コンポーネントがマウントされた時点でvisibleがtrueの場合も初期化
    if (this.visible) {
      this.initializeDialog()
      // スクロールをロック
      document.body.style.overflow = 'hidden'
    }
  },
  
  beforeUnmount() {
    // コンポーネント破棄時にスクロールをアンロック
    document.body.style.overflow = ''
  },
  methods: {
    // ダイアログ初期化
    async initializeDialog() {
      this.loading = true
      try {
        // フォームをリセット
        this.resetForm()
        
        // 勤務場所マスタ取得
        await this.loadWorkLocations()
        
        // 初期データを設定（勤務表画面から渡された既存データ）
        // 仕様書: 初期データが指定されている場合、フォームに初期値を設定する
        if (this.initialData) {
          this.form.clockIn = this.initialData.clockIn || ''
          this.form.clockOut = this.initialData.clockOut || ''
          this.form.workLocation = this.initialData.location || ''
        }
        
        // 日次勤務データ取得（APIから取得したデータで初期データを上書き）
        // 仕様書: APIから取得したデータで初期データを上書きする
        await this.loadDailyData()
        
        // 休日出勤申請状態取得
        await this.loadHolidayWorkStatus()
        
        // フォーカス設定
        this.$nextTick(() => {
          this.setInitialFocus()
        })
      } catch (error) {
        console.error('初期化エラー:', error)
        this.showError('データの取得に失敗しました。')
      } finally {
        this.loading = false
      }
    },
    
    // 勤務場所マスタ取得
    async loadWorkLocations() {
      try {
        const response = await getWorkLocations()
        if (response.success && response.workLocations) {
          this.workLocations = response.workLocations.map(loc => ({
            code: loc.WORK_LOCATION_CODE,
            name: loc.WORK_LOCATION_NAME
          }))
        }
      } catch (error) {
        console.error('勤務場所マスタ取得エラー:', error)
        // フォールバック（ホーム画面と同じ4種類）
        this.workLocations = [
          { code: 'COMMUTE', name: '通勤' },
          { code: 'REMOTE', name: '在宅' },
          { code: 'DIRECT', name: '直行、直帰、直行直帰' },
          { code: 'BUSINESS_TRIP', name: '出張' }
        ]
      }
    },
    
    // 日次勤務データ取得
    async loadDailyData() {
      try {
        // 現在のフォームの値をバックアップ（初期データを保持）
        const currentForm = JSON.parse(JSON.stringify(this.form))
        
        const response = await getDailyAttendance(this.employeeId, this.targetDate)
        
        if (response.success && response.attendance) {
          const data = response.attendance
          
          // 勤怠データを保存（打刻時刻の状態確認用）
          this.attendanceData = data
          
          // 時刻のフォーマット（HH:MM形式）
          const formatTime = (datetime) => {
            if (!datetime) return null
            // datetimeが文字列の場合とDateオブジェクトの場合に対応
            let date = datetime

            if (typeof datetime === 'string') {
              date = new Date(datetime)
            }
            if (isNaN(date.getTime())) return null
            // formatTimeNoLeadingZeroを使用（先頭0なしのH:MM形式）
            const hours = date.getHours()
            const minutes = String(date.getMinutes()).padStart(2, '0')
            return `${hours}:${minutes}`
          }
          
          // 仕様書: 出社時刻、退社時刻、勤務場所を初期データから設定する
          // ただし、APIから取得したデータで初期データを上書きする
          const apiClockIn = formatTime(data.CLOCK_IN_TIME)
          const apiClockOut = formatTime(data.CLOCK_OUT_TIME)
          const apiWorkLocation = data.WORK_LOCATION_CODE
          
          // APIから取得した値があればそれを使用、なければ現在の値（初期データ）を保持
          if (apiClockIn !== null) {
            this.form.clockIn = apiClockIn
          } else {
            this.form.clockIn = currentForm.clockIn
          }

          if (apiClockOut !== null) {
            this.form.clockOut = apiClockOut
          } else {
            this.form.clockOut = currentForm.clockOut
          }
          this.form.workLocation = apiWorkLocation || currentForm.workLocation
          
          // 元の打刻時刻を保存（手入力判定用）
          // 仕様書: 日次勤務データ.出勤打刻時刻（ATTENDANCE_RECORD.ORIGINAL_CLOCK_IN_TIME）
          // APIレスポンスから取得（ORIGINAL_CLOCK_IN_TIMEとORIGINAL_CLOCK_OUT_TIMEはデータベースから直接取得）
          this.originalClockIn = formatTime(data.ORIGINAL_CLOCK_IN_TIME) || ''
          this.originalClockOut = formatTime(data.ORIGINAL_CLOCK_OUT_TIME) || ''
          
          // 手入力フラグ（既存の値から設定）
          this.isClockInManual = data.IS_CLOCK_IN_MANUAL || false
          this.isClockOutManual = data.IS_CLOCK_OUT_MANUAL || false
          // リセット用に元の値を保存
          this.originalIsClockInManual = data.IS_CLOCK_IN_MANUAL || false
          this.originalIsClockOutManual = data.IS_CLOCK_OUT_MANUAL || false
          
          // 既存の打刻種別を保存（バックエンドで既存の打刻種別を保持するため）
          this.clockInType = data.CLOCK_IN_TYPE || ''
          this.clockOutType = data.CLOCK_OUT_TYPE || ''
          
          // 元の打刻種別を保存（打刻時刻に戻した場合に使用）
          // ORIGINAL_CLOCK_IN_TIMEが存在する場合、元の打刻種別はSTAMP（打刻機による記録）
          // CLOCK_IN_TYPEがMANUALの場合、元の打刻種別はSTAMPと仮定
          // CLOCK_IN_TYPEがSTAMPまたはSCHEDULEDの場合、そのまま使用
          if (data.ORIGINAL_CLOCK_IN_TIME) {
            if (data.CLOCK_IN_TYPE === 'MANUAL') {
              // 手入力の場合、元の打刻種別はSTAMPと仮定
              this.originalClockInType = 'STAMP'
            } else {
              // 打刻または定時の場合、そのまま使用
              this.originalClockInType = data.CLOCK_IN_TYPE || 'STAMP'
            }
          } else {
            this.originalClockInType = ''
          }
          if (data.ORIGINAL_CLOCK_OUT_TIME) {
            if (data.CLOCK_OUT_TYPE === 'MANUAL') {
              // 手入力の場合、元の打刻種別はSTAMPと仮定
              this.originalClockOutType = 'STAMP'
            } else {
              // 打刻または定時の場合、そのまま使用
              this.originalClockOutType = data.CLOCK_OUT_TYPE || 'STAMP'
            }
          } else {
            this.originalClockOutType = ''
          }
          
          // 休憩時間の設定
          // 仕様書: 休憩時間リストからBREAKタイプとOFFICIAL_OUTINGタイプを分けて設定
          if (data.breakTimes && data.breakTimes.length > 0) {
            // BREAKタイプの休憩時間を取得（BREAK_SEQ順にソート済み）
            const breaks = data.breakTimes
              .filter(b => b.BREAK_TYPE === 'BREAK')
              .sort((a, b) => (a.BREAK_SEQ || 0) - (b.BREAK_SEQ || 0))
            
            // 休憩データの設定（最大10個）
            breaks.forEach((breakData, index) => {
              if (index < 10) {
                const breakNum = index + 1
                const startTime = formatTime(breakData.BREAK_START_TIME)
                const endTime = formatTime(breakData.BREAK_END_TIME)
                if (startTime !== null) {
                  this.form[`break${breakNum}Start`] = startTime
                } else {
                  this.form[`break${breakNum}Start`] = ''
                }

                if (endTime !== null) {
                  this.form[`break${breakNum}End`] = endTime
                } else {
                  this.form[`break${breakNum}End`] = ''
                }
              }
            })
            
            // 休憩1のデフォルト値設定（データが存在しない場合）
            // 仕様書: 日次勤務データに休憩時間が存在しない場合、または休憩時間リストに休憩種別がBREAKのレコードが存在しない場合、休憩1にデフォルト値を設定する
            if (breaks.length === 0 || !this.form.break1Start || !this.form.break1End) {
              this.form.break1Start = '12:00'
              this.form.break1End = '13:00'
            }
            
            // OFFICIAL_OUTINGタイプの公用外出を取得（BREAK_SEQ順にソート済み）
            const outings = data.breakTimes
              .filter(b => b.BREAK_TYPE === 'OFFICIAL_OUTING')
              .sort((a, b) => (a.BREAK_SEQ || 0) - (b.BREAK_SEQ || 0))
            
            // 公用外出データの設定（最大5つ）
            outings.forEach((outingData, index) => {
              if (index < 5) {
                const outingNum = index + 1
                const startTime = formatTime(outingData.BREAK_START_TIME)
                const endTime = formatTime(outingData.BREAK_END_TIME)
                if (startTime !== null) {
                  this.form[`outing${outingNum}Start`] = startTime
                } else {
                  this.form[`outing${outingNum}Start`] = ''
                }

                if (endTime !== null) {
                  this.form[`outing${outingNum}End`] = endTime
                } else {
                  this.form[`outing${outingNum}End`] = ''
                }
              }
            })
          }
          
          // 実労働時間
          this.actualWorkHours = data.ACTUAL_WORK_HOURS || 0
          
          // 元データを保存（リセット用）
          this.originalData = JSON.parse(JSON.stringify(this.form))
          
          // 表示数を計算（データが存在する場合）
          this.calculateVisibleCounts()
        } else {
          // データが存在しない場合（attendanceがnull）
          // 初期データが設定されている場合はそのまま使用、なければ空フォーム
          // フォームの値は既に初期データが設定されているので、そのまま使用
          
          // 勤怠データをnullに設定（打刻時刻の状態確認用）
          this.attendanceData = null
          
          // 休憩1のデフォルト値設定
          // 仕様書: 日次勤務データに休憩時間が存在しない場合、または休憩時間リストに休憩種別がBREAKのレコードが存在しない場合、休憩1にデフォルト値を設定する
          if (!this.form.break1Start || !this.form.break1End) {
            this.form.break1Start = '12:00'
            this.form.break1End = '13:00'
          }
          
          this.originalData = JSON.parse(JSON.stringify(this.form))
          // 打刻種別をリセット（新規レコードの場合）
          this.clockInType = ''
          this.clockOutType = ''
          // 手入力フラグをリセット（新規レコードの場合）
          this.isClockInManual = false
          this.isClockOutManual = false
          this.originalIsClockInManual = false
          this.originalIsClockOutManual = false
          // 表示数を計算
          this.calculateVisibleCounts()
        }
        
        // 工数実績取得（日次確定チェック用）
        await this.loadWorkHours()
        
      } catch (error) {
        console.error('日次勤務データ取得エラー:', error)
        // エラー時は初期データがあればそのまま使用、なければ空フォーム
        // フォームの値は既に初期データが設定されているので、そのまま使用
        
        // 勤怠データをnullに設定（エラー時）
        this.attendanceData = null
        
        this.originalData = JSON.parse(JSON.stringify(this.form))
        // 打刻種別をリセット（エラー時）
        this.clockInType = ''
        this.clockOutType = ''
        // 手入力フラグをリセット（エラー時）
        this.isClockInManual = false
        this.isClockOutManual = false
        this.originalIsClockInManual = false
        this.originalIsClockOutManual = false
        // 表示数を計算
        this.calculateVisibleCounts()
      }
    },
    
    // 工数実績取得
    async loadWorkHours() {
      try {
        const response = await getWorkHours(this.employeeId, this.targetDate)
        if (response.success && response.workHours) {
          this.workHoursTotal = response.workHours.reduce(
            (sum, wh) => sum + (parseFloat(wh.WORK_HOURS_VALUE) || 0), 
            0
          )
        }
      } catch (error) {
        console.error('工数実績取得エラー:', error)
        this.workHoursTotal = 0
      }
    },
    
    // 休日出勤申請状態取得
    async loadHolidayWorkStatus() {
      try {
        const response = await getHolidayWorkStatus(this.employeeId, this.targetDate)
        if (response.success) {
          this.hasHolidayWorkApplication = response.hasHolidayWorkApplication || false
        }
      } catch (error) {
        console.error('休日出勤申請状態取得エラー:', error)
        // エラー時はfalseとして扱う
        this.hasHolidayWorkApplication = false
      }
    },
    
    // フォーカス設定
    setInitialFocus() {
      switch (this.initialFocus) {
        case 'clockIn':
          this.$refs.clockInInput?.focus()
          break
        case 'clockOut':
          this.$refs.clockOutInput?.focus()
          break
        case 'location':
          // プルダウンにフォーカスは設定しない
          break
        default:
          this.$refs.clockInInput?.focus()
      }
    },
    
    // 出社時刻変更
    onClockInChange() {
      // 変更直後は打刻情報を表示しない（次回ダイアログを開いたときに表示される）
      // isClockInManualはAPIから取得した値のみを使用し、リアルタイムでは変更しない
    },
    
    // 退社時刻変更
    onClockOutChange() {
      // 変更直後は打刻情報を表示しない（次回ダイアログを開いたときに表示される）
      // isClockOutManualはAPIから取得した値のみを使用し、リアルタイムでは変更しない
    },
    
    // 休憩追加
    addBreak() {
      // 上限チェック（最大10個）
      if (this.visibleBreakCount >= 10) {
        return
      }
      this.visibleBreakCount++
    },
    
    // 公用外出追加
    addOuting() {
      // 上限チェック（最大5個）
      if (this.visibleOutingCount >= 5) {
        return
      }
      this.visibleOutingCount++
    },
    
    // 登録ボタン押下
    async onRegister() {
      // エラーメッセージをクリア
      this.validationError = ''
      
      // 休憩・公用外出入力時の出社・退社時刻チェック（未来日付チェックより先に実行）
      if (!this.validateBreakOutingRequiresClockTime()) {
        return
      }
      
      // 未来日付・勤務当日チェック
      if (!this.validateFutureDate()) {
        return
      }
      
      // 入力チェック
      if (!this.validateInput()) {
        return
      }
      
      // 日次確定チェック（チェックボックスがONの場合）
      if (this.form.isDailyConfirm) {
        if (!this.validateDailyConfirm()) {
          return
        }
      }
      
      this.loading = true
      try {
        // 勤怠データ更新
        const breakTimes = this.buildBreakTimes()
        
        // 登録時に打刻時刻と入力時刻を比較して手入力フラグを判定
        // 空欄に戻した場合はfalseに設定
        let isClockInManualForSave = false
        if (this.form.clockIn && this.form.clockIn.trim() !== '') {
          if (this.originalClockIn && this.form.clockIn !== this.originalClockIn) {
            // 打刻時刻と異なる場合: 手入力として扱う
            isClockInManualForSave = true
          } else if (!this.originalClockIn) {
            // 元の打刻時刻が存在しない場合（新規入力）も手入力として扱う
            isClockInManualForSave = true
          } else {
            // 打刻時刻と同じ時刻に戻した場合: 手入力を解除
            isClockInManualForSave = false
          }
        }
        
        let isClockOutManualForSave = false
        if (this.form.clockOut && this.form.clockOut.trim() !== '') {
          if (this.originalClockOut && this.form.clockOut !== this.originalClockOut) {
            // 打刻時刻と異なる場合: 手入力として扱う
            isClockOutManualForSave = true
          } else if (!this.originalClockOut) {
            // 元の打刻時刻が存在しない場合（新規入力）も手入力として扱う
            isClockOutManualForSave = true
          } else {
            // 打刻時刻と同じ時刻に戻した場合: 手入力を解除
            isClockOutManualForSave = false
          }
        }
        
        // 空欄の場合はclockInType/clockOutTypeを空文字列に設定（背景色を付けないため）
        // 打刻時刻と同じ時刻に戻した場合、元の打刻種別（STAMPまたはSCHEDULED）に戻す
        let clockInType = ''

        if (this.form.clockIn && this.form.clockIn.trim() !== '') {
          if (isClockInManualForSave) {
            clockInType = 'MANUAL'
          } else {
            clockInType = this.originalClockInType || this.clockInType || 'STAMP'
          }
        }

        let clockOutType = ''

        if (this.form.clockOut && this.form.clockOut.trim() !== '') {
          if (isClockOutManualForSave) {
            clockOutType = 'MANUAL'
          } else {
            clockOutType = this.originalClockOutType || this.clockOutType || 'STAMP'
          }
        }
        
        const attendanceData = {
          employeeId: this.employeeId,
          workDate: this.targetDate,
          clockInTime: this.form.clockIn,
          clockOutTime: this.form.clockOut,
          workLocationCode: this.form.workLocation,
          isClockInManual: isClockInManualForSave,
          isClockOutManual: isClockOutManualForSave,
          clockInType: clockInType,
          clockOutType: clockOutType,
          breakTimes: breakTimes
        }
        
        const updateResponse = await updateAttendanceRecord(attendanceData)
        if (!updateResponse.success) {
          throw new Error(updateResponse.message || '勤怠データの更新に失敗しました')
        }
        
        // 日次確定処理
        if (this.form.isDailyConfirm) {
          const confirmResponse = await submitDailyConfirmation(this.employeeId, this.targetDate)
          if (!confirmResponse.success) {
            throw new Error(confirmResponse.message || '日次確定申請に失敗しました')
          }
        }
        
        // 更新完了を親コンポーネントに通知
        this.$emit('updated', {
          date: this.targetDate,
          isClockInManual: isClockInManualForSave,
          isClockOutManual: isClockOutManualForSave,
          isDailyConfirmed: this.form.isDailyConfirm
        })
        
        this.closeDialog()
        
      } catch (error) {
        console.error('登録エラー:', error)
        this.showError(error.message || '登録に失敗しました')
      } finally {
        this.loading = false
      }
    },
    
    // 休憩・公用外出入力時の出社・退社時刻チェック
    validateBreakOutingRequiresClockTime() {
      // 仕様書: 休憩または公用外出を新規に入力する場合、出社時刻または退社時刻のどちらかが入力されていないとエラー
      // ただし、休憩1のデフォルト値（12:00~13:00）のみが入っている場合は、新規入力として扱わない
      
      // 休憩1のデフォルト値のみかチェック
      const isOnlyDefaultBreak1 = 
        this.form.break1Start === '12:00' && 
        this.form.break1End === '13:00' &&
        !this.hasOtherBreaksOrOutings()
      
      // デフォルト値のみの場合は、新規入力として扱わない
      if (isOnlyDefaultBreak1) {
        return true
      }
      
      // 休憩または公用外出の入力があるかチェック
      let hasBreakOrOuting = false
      for (let i = 1; i <= this.visibleBreakCount; i++) {
        if ((this.form[`break${i}Start`] && this.form[`break${i}Start`].trim() !== '') ||
            (this.form[`break${i}End`] && this.form[`break${i}End`].trim() !== '')) {
          hasBreakOrOuting = true
          break
        }
      }
      if (!hasBreakOrOuting) {
        for (let i = 1; i <= this.visibleOutingCount; i++) {
          if ((this.form[`outing${i}Start`] && this.form[`outing${i}Start`].trim() !== '') ||
              (this.form[`outing${i}End`] && this.form[`outing${i}End`].trim() !== '')) {
            hasBreakOrOuting = true
            break
          }
        }
      }
      
      if (hasBreakOrOuting) {
        const hasClockIn = this.form.clockIn && this.form.clockIn.trim() !== ''
        const hasClockOut = this.form.clockOut && this.form.clockOut.trim() !== ''
        if (!hasClockIn && !hasClockOut) {
          this.validationError = '出社・退社時刻どちらかを入力してください。'
          return false
        }
      }
      
      return true
    },
    
    // 休憩1以外の休憩または公用外出が入力されているかチェック
    hasOtherBreaksOrOutings() {
      // 休憩2以降をチェック
      for (let i = 2; i <= this.visibleBreakCount; i++) {
        if ((this.form[`break${i}Start`] && this.form[`break${i}Start`].trim() !== '') ||
            (this.form[`break${i}End`] && this.form[`break${i}End`].trim() !== '')) {
          return true
        }
      }
      // 公用外出をチェック
      for (let i = 1; i <= this.visibleOutingCount; i++) {
        if ((this.form[`outing${i}Start`] && this.form[`outing${i}Start`].trim() !== '') ||
            (this.form[`outing${i}End`] && this.form[`outing${i}End`].trim() !== '')) {
          return true
        }
      }
      return false
    },
    
    // 未来日付・勤務当日チェック
    validateFutureDate() {
      // 対象日付が未来の日付（今日より後）かチェック
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      // 日付文字列（YYYY-MM-DD）をローカルタイムゾーンで正しく解釈する
      const dateParts = this.targetDate.split('-')
      const targetDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
      targetDate.setHours(0, 0, 0, 0)
      
      // 未来の日付（今日より後）の場合のみエラー
      if (targetDate > today) {
        // 勤務場所のみの変更の場合は例外として許可
        const hasClockIn = this.form.clockIn && this.form.clockIn.trim() !== ''
        const hasClockOut = this.form.clockOut && this.form.clockOut.trim() !== ''
        
        // 休憩1のデフォルト値のみかチェック
        const isOnlyDefaultBreak1 = 
          this.form.break1Start === '12:00' && 
          this.form.break1End === '13:00' &&
          !this.hasOtherBreaksOrOutings()
        
        // 休憩または公用外出の入力があるかチェック（デフォルト値のみは除外）
        let hasBreakOrOuting = false
        if (!isOnlyDefaultBreak1) {
          for (let i = 1; i <= this.visibleBreakCount; i++) {
            if ((this.form[`break${i}Start`] && this.form[`break${i}Start`].trim() !== '') ||
                (this.form[`break${i}End`] && this.form[`break${i}End`].trim() !== '')) {
              hasBreakOrOuting = true
              break
            }
          }
          if (!hasBreakOrOuting) {
            for (let i = 1; i <= this.visibleOutingCount; i++) {
              if ((this.form[`outing${i}Start`] && this.form[`outing${i}Start`].trim() !== '') ||
                  (this.form[`outing${i}End`] && this.form[`outing${i}End`].trim() !== '')) {
                hasBreakOrOuting = true
                break
              }
            }
          }
        }
        
        // 出社・退社・休憩・公用外出の入力がある場合、エラー
        // ただし、休憩1のデフォルト値のみの場合は除外
        if (hasClockIn || hasClockOut || hasBreakOrOuting) {
          this.validationError = '未来の日付は入力できません。'
          return false
        }
      }
      
      return true
    },
    
    // 入力チェック
    validateInput() {
      // エラーメッセージをクリア
      this.validationError = ''
      
      // 時刻形式チェック（H:MM形式）
      const timeRegex = /^([0-9]|[0-2][0-9]):([0-5][0-9])$/
      
      if (this.form.clockIn && !timeRegex.test(this.form.clockIn)) {
        this.validationError = '出社時刻の形式が正しくありません。'
        return false
      }
      
      if (this.form.clockOut && !timeRegex.test(this.form.clockOut)) {
        this.validationError = '退社時刻の形式が正しくありません。'
        return false
      }
      
      // 時刻整合性チェック（出社 < 退社）
      if (this.form.clockIn && this.form.clockOut) {
        const clockInMinutes = this.timeToMinutes(this.form.clockIn)
        const clockOutMinutes = this.timeToMinutes(this.form.clockOut)
        if (clockInMinutes >= clockOutMinutes) {
          this.validationError = '出社時刻は退社時刻より前に設定してください。'
          return false
        }
      }
      
      // 休憩時間チェック（表示されている分のみ）
      for (let i = 1; i <= this.visibleBreakCount; i++) {
        if (!this.validateBreakTime(this.form[`break${i}Start`], this.form[`break${i}End`], `休憩${i}`)) {
          return false
        }
      }
      
      // 公用外出時間チェック（表示されている分のみ）
      for (let i = 1; i <= this.visibleOutingCount; i++) {
        if (!this.validateBreakTime(this.form[`outing${i}Start`], this.form[`outing${i}End`], `公用外出${i}`)) {
          return false
        }
      }
      
      return true
    },
    
    // 休憩時間のバリデーション
    validateBreakTime(start, end, label) {
      const timeRegex = /^([0-9]|[0-2][0-9]):([0-5][0-9])$/
      
      // 両方空なら OK
      if (!start && !end) return true
      
      // 片方だけ入力されている場合はエラー
      if ((start && !end) || (!start && end)) {
        this.validationError = `${label}の開始時刻と終了時刻の両方を入力してください。`
        return false
      }
      
      // 形式チェック
      if (!timeRegex.test(start)) {
        this.validationError = `${label}の開始時刻の形式が正しくありません。`
        return false
      }
      if (!timeRegex.test(end)) {
        this.validationError = `${label}の終了時刻の形式が正しくありません。`
        return false
      }
      
      // 順序チェック
      const startMinutes = this.timeToMinutes(start)
      const endMinutes = this.timeToMinutes(end)
      if (startMinutes >= endMinutes) {
        this.validationError = `${label}の開始時刻は終了時刻より前に設定してください。`
        return false
      }
      
      return true
    },
    
    // 日次確定の事前チェック
    validateDailyConfirm() {
      // 出社時刻チェック
      if (!this.form.clockIn) {
        this.showError('出社時刻が入力されていません。')
        return false
      }
      
      // 退社時刻チェック
      if (!this.form.clockOut) {
        this.showError('退社時刻が入力されていません。')
        return false
      }
      
      // 勤務場所チェック
      if (!this.form.workLocation) {
        this.showError('勤務場所が選択されていません。')
        return false
      }
      
      // 工数実績チェック
      if (this.workHoursTotal === 0) {
        this.showError('工数実績が入力されていません。')
        return false
      }
      
      // 工数合計と実労働時間の一致チェック
      if (this.actualWorkHours > 0 && Math.abs(this.actualWorkHours - this.workHoursTotal) > 0.01) {
        this.showError('工数の合計と実労働時間が合いません。')
        return false
      }
      
      return true
    },
    
    // 時刻を分に変換
    timeToMinutes(timeStr) {
      if (!timeStr) return 0
      const [hours, minutes] = timeStr.split(':').map(Number)
      return hours * 60 + minutes
    },
    
    // 休憩時間データの構築
    buildBreakTimes() {
      const breakTimes = []
      
      // 休憩データ（表示されている分のみ）
      for (let i = 1; i <= this.visibleBreakCount; i++) {
        const start = this.form[`break${i}Start`]
        const end = this.form[`break${i}End`]
        if (start && end) {
          breakTimes.push({
            breakStartTime: start,
            breakEndTime: end,
            breakType: 'BREAK'
          })
        }
      }
      
      // 公用外出データ（表示されている分のみ）
      for (let i = 1; i <= this.visibleOutingCount; i++) {
        const start = this.form[`outing${i}Start`]
        const end = this.form[`outing${i}End`]
        if (start && end) {
          breakTimes.push({
            breakStartTime: start,
            breakEndTime: end,
            breakType: 'OFFICIAL_OUTING'
          })
        }
      }
      
      return breakTimes
    },
    
    // リセットボタン押下
    onReset() {
      // エラーメッセージをクリア
      this.validationError = ''
      
      // 仕様書: 編集仕様 No.2（入力内容リセット）
      // 日次勤務データ取得時の値に戻す
      if (this.originalData) {
        this.form = JSON.parse(JSON.stringify(this.originalData))
        // 休憩1のデフォルト値設定（データが存在しない場合）
        // 仕様書: データが存在しない場合は、その他の項目定義.休憩1デフォルト開始時刻（12:00）に戻す
        if (!this.form.break1Start || !this.form.break1End) {
          this.form.break1Start = '12:00'
          this.form.break1End = '13:00'
        }
        // 手入力フラグをリセット（APIから取得した値に戻す）
        this.isClockInManual = this.originalIsClockInManual
        this.isClockOutManual = this.originalIsClockOutManual
        // 元の打刻時刻もリセット（APIから取得した値に戻す）
        // ただし、originalDataに保存されている値を使用
        // 元データから表示数を再計算
        this.calculateVisibleCounts()
      } else {
        // 元データが存在しない場合は空フォームにリセット（休憩1のデフォルト値は設定済み）
        this.resetForm()
      }
    },
    
    // 表示数を計算（データが存在する場合）
    calculateVisibleCounts() {
      // 仕様書: 初期状態では、休憩1、休憩2、公用外出1、公用外出2の4つの入力枠が表示される
      // データが存在する場合は、最大の表示数を計算
      
      // 休憩の表示数を計算
      let maxBreakIndex = 0
      for (let i = 1; i <= 10; i++) {
        if (this.form[`break${i}Start`] || this.form[`break${i}End`]) {
          maxBreakIndex = i
        }
      }
      // 最低2つ、最大10個表示
      this.visibleBreakCount = Math.max(2, Math.min(10, maxBreakIndex || 2))
      
      // 公用外出の表示数を計算
      let maxOutingIndex = 0
      for (let i = 1; i <= 5; i++) {
        if (this.form[`outing${i}Start`] || this.form[`outing${i}End`]) {
          maxOutingIndex = i
        }
      }
      // 最低2つ、最大5つ表示
      this.visibleOutingCount = Math.max(2, Math.min(5, maxOutingIndex || 2))
    },
    
    // フォームリセット
    resetForm() {
      this.form = {
        clockIn: '',
        clockOut: '',
        break1Start: '12:00', // デフォルト値
        break1End: '13:00', // デフォルト値
        break2Start: '',
        break2End: '',
        break3Start: '',
        break3End: '',
        break4Start: '',
        break4End: '',
        break5Start: '',
        break5End: '',
        break6Start: '',
        break6End: '',
        break7Start: '',
        break7End: '',
        break8Start: '',
        break8End: '',
        break9Start: '',
        break9End: '',
        break10Start: '',
        break10End: '',
        outing1Start: '',
        outing1End: '',
        outing2Start: '',
        outing2End: '',
        outing3Start: '',
        outing3End: '',
        outing4Start: '',
        outing4End: '',
        outing5Start: '',
        outing5End: '',
        workLocation: '',
        isDailyConfirm: false
      }
      this.isClockInManual = false
      this.isClockOutManual = false
      this.originalIsClockInManual = false
      this.originalIsClockOutManual = false
      this.clockInType = ''
      this.clockOutType = ''
      this.visibleBreakCount = 2
      this.visibleOutingCount = 2
      this.validationError = ''
    },
    
    // エラー表示
    showError(message) {
      this.errorMessage = message
      this.showErrorDialog = true
    },
    
    // エラーダイアログを閉じる
    closeErrorDialog() {
      this.showErrorDialog = false
      this.errorMessage = ''
    },
    
    // ダイアログを閉じる
    closeDialog() {
      this.$emit('close')
    },
    
    // 休憩行の位置を計算（入力エリア内での相対位置）
    getBreakRowTop(index) {
      // 休憩1: 68px, 休憩2以降: 前の行 + 31px
      const breakStartTop = 68
      const rowSpacing = 31
      return breakStartTop + (index - 1) * rowSpacing
    },
    
    // 公用外出行の位置を計算（入力エリア内での相対位置）
    getOutingRowTop(index) {
      // 休憩の後に続く
      const breakStartTop = 68
      const rowSpacing = 31
      const breakRowsTop = breakStartTop + (this.visibleBreakCount - 1) * rowSpacing
      return breakRowsTop + index * rowSpacing
    },
    
    // 勤務場所の行の位置を計算（入力エリア内での相対位置）
    getLocationRowTop() {
      return this.locationRowTopInArea
    }
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
  z-index: 1000;
}

.dialog-container {
  position: relative;
  width: 339px;
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(117, 157, 192);
  font-family: Arial, sans-serif;
}

.dialog-header {
  position: absolute;
  left: -1px;
  top: 0;
  width: 339px;
  height: 32px;
  background-color: rgb(191, 223, 255);
  border: 1px solid #759DC0;
  border-width: 1px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding-left: 8px;
}

.dialog-title {
  font-size: 14.159px;
  font-weight: normal;
  color: rgb(0, 0, 0);
}

.close-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgb(0, 0, 0);
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  opacity: 0.8;
}

.date-display {
  position: absolute;
  left: 12px;
  top: 43px;
  font-size: 14.159px;
  color: rgb(0, 0, 0);
  height: 19px;
  display: flex;
  align-items: center;
}

.input-area {
  position: absolute;
  left: 12px;
  top: 64px;
  width: 318px;
  background-color: rgb(239, 239, 239);
  padding: 0;
}

.input-row {
  position: relative;
  margin-bottom: 0;
}

/* 出社 */
.clock-in-row {
  top: 4px;
}

/* 退社 */
.clock-out-row {
  top: 36px;
}

.input-label {
  position: absolute;
  left: 17px;
  top: 0;
  width: 121px;
  height: 26px;
  font-size: 13.319px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 0;
}

.clock-in-label,
.clock-out-label,
.location-label {
  background-color: rgb(75, 158, 228);
  color: rgb(255, 255, 255);
  font-weight: bold;
}

.break-label,
.outing-label {
  background-color: rgb(26, 105, 171);
  color: rgb(255, 255, 255);
  font-weight: normal;
}

.time-input {
  position: absolute;
  left: 146px;
  top: 3px;
  width: 45px;
  height: 20px;
  text-align: center;
}

.stamp-time-label {
  position: absolute;
  left: 220px;
  top: 4px;
  font-size: 11px;
  font-family: Arial, sans-serif;
  color: #7979D9;
  white-space: nowrap;
  padding: 0;
  border: none;
  background-color: transparent;
  box-sizing: border-box;
  outline: none !important;
  box-shadow: none !important;
}

.time-input:focus {
  outline: none !important;
  box-shadow: none !important;
  border: 1px solid rgb(0, 0, 0);
}

/* 休憩・公用外出の1つ目の時間入力フィールドの位置調整 */
.break-row .time-input-small:nth-child(2),
.outing-row .time-input-small:nth-child(2) {
  top: 3px;
}

.time-input-small {
  width: 45px;
  height: 20px;
  text-align: center;
  outline: none !important;
  box-shadow: none !important;
}

.time-input-small:focus {
  outline: none !important;
  box-shadow: none !important;
  border: 1px solid rgb(0, 0, 0);
}

.time-input-small:disabled {
  background-color: rgb(240, 240, 240);
  color: rgb(128, 128, 128);
  cursor: not-allowed;
}

/* 2つ目の時間入力フィールド（休憩・公用外出の終了時刻） */
.break-row .time-input-small:nth-child(4),
.outing-row .time-input-small:nth-child(4) {
  left: 233px;
  top: 3px;
}

.time-input:disabled {
  background-color: rgb(240, 240, 240);
  color: rgb(128, 128, 128);
  cursor: not-allowed;
}

.tilde {
  position: absolute;
  left: 190px;
  top: 0;
  width: 40px;
  font-size: 19.319px;
  font-weight: bold;
  color: rgb(0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
}

.break-row .tilde,
.outing-row .tilde {
  top: 0;
}

.add-button {
  position: absolute;
  left: 289px;
  top: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background-color: rgb(217, 217, 217);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.add-button:hover:not(:disabled) {
  background-color: rgb(200, 200, 200);
}

.add-button:disabled,
.add-button-disabled {
  background-color: rgb(240, 240, 240);
  cursor: not-allowed;
  opacity: 0.6;
}

.add-button:disabled .plus-icon::before,
.add-button:disabled .plus-icon::after,
.add-button-disabled .plus-icon::before,
.add-button-disabled .plus-icon::after {
  background-color: rgb(200, 200, 200);
}

.plus-icon {
  font-size: 0;
  color: rgb(255, 255, 255);
  font-weight: bold;
  line-height: 1;
  position: relative;
  width: 100%;
  height: 100%;
  display: block;
}

.plus-icon::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 10px;
  background-color: rgb(255, 255, 255);
}

.plus-icon::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(-90deg);
  width: 3.53px;
  height: 10.59px;
  background-color: rgb(255, 255, 255);
}

.location-select {
  position: absolute;
  left: 146px;
  top: 3px;
  width: 145px;
  height: 20px;
  padding: 2px 20px 2px 4px;
  border: 1px solid rgb(0, 0, 0);
  border-radius: 0;
  font-size: 13px;
  background-color: rgb(255, 255, 255);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23000' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 4px center;
  box-sizing: border-box;
  outline: none !important;
  box-shadow: none !important;
}

.location-select:focus {
  outline: none !important;
  box-shadow: none !important;
  border: 1px solid rgb(0, 0, 0);
}

.location-select:disabled {
  background-color: rgb(240, 240, 240);
  color: rgb(128, 128, 128);
  cursor: not-allowed;
}

.button-area {
  position: absolute;
  left: 0;
  width: 339px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
  gap: 0;
}

.register-button {
  position: absolute;
  left: 109px;
  top: 0;
  width: 49px;
  height: 30px;
  padding: 0;
  background-color: rgb(16, 141, 197);
  color: rgb(255, 255, 255);
  border: none;
  border-radius: 0;
  font-size: 16.319px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-button:hover {
  background-color: rgb(20, 160, 220);
}

.cancel-link {
  position: absolute;
  left: 169px;
  top: 6px;
  font-size: 14.319px;
  font-weight: bold;
  color: rgb(74, 74, 255);
  text-decoration: underline;
  cursor: pointer;
}

.cancel-link:hover {
  color: rgb(100, 100, 255);
}

.reset-button {
  position: absolute;
  left: 277px;
  top: 2px;
  width: 47px;
  height: 18px;
  padding: 0;
  background-color: rgb(240, 145, 153);
  color: rgb(255, 255, 255);
  border: none;
  border-radius: 0;
  font-size: 9.319px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reset-button:hover {
  background-color: rgb(230, 130, 140);
}

.daily-confirm-area {
  position: absolute;
  left: 0;
  width: 339px;
  padding: 0;
  text-align: left;
  height: 19px;
}

.daily-confirm-checkbox {
  position: absolute;
  left: 140px;
  top: 0;
  font-size: 14.159px;
  color: rgb(0, 0, 0);
  cursor: pointer;
  display: flex;
  align-items: center;
}

.daily-confirm-checkbox input {
  width: 18px;
  height: 15px;
  margin-right: 8px;
  border: 1px solid rgb(0, 0, 0);
  border-radius: 0;
}

.daily-confirm-checkbox input:disabled {
  background-color: rgb(240, 240, 240);
  cursor: not-allowed;
  opacity: 0.6;
}

.close-link-area {
  position: absolute;
  left: 0;
  width: 339px;
  padding: 16px;
  text-align: center;
}

.close-link {
  color: rgb(74, 74, 255);
  text-decoration: underline;
  font-size: 14px;
  cursor: pointer;
}

.close-link:hover {
  color: rgb(100, 100, 255);
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
  z-index: 2000;
}

.error-dialog-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 350px;
  max-width: 90%;
  overflow: hidden;
}

.error-dialog-header {
  background-color: #D7EBFF;
  padding: 12px 16px;
}

.error-dialog-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.error-dialog-body {
  padding: 24px 16px;
}

.error-dialog-message {
  font-size: 14px;
  color: #333;
  text-align: center;
  margin: 0;
}

.error-dialog-footer {
  padding: 12px 16px;
  text-align: center;
}

.error-dialog-ok-button {
  padding: 8px 32px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.error-dialog-ok-button:hover {
  background-color: #1976D2;
}

/* エラーメッセージ表示エリア（勤務場所の左下） */
.validation-error-area {
  position: absolute;
  left: 12px;
  width: 315px;
  padding: 0;
}

.validation-error-message {
  font-size: 13px;
  color: rgb(200, 0, 0);
  line-height: 1.5;
}
</style>










