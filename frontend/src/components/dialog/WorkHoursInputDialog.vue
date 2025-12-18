<template>
  <div v-if="visible" class="dialog-overlay" @click.self="closeDialog">
    <div class="dialog-container">
      <!-- ヘッダー部分 -->
      <div class="dialog-header">
        <span class="dialog-title">工数実績入力</span>
        <button class="close-button" @click="closeDialog">×</button>
      </div>
      
      <!-- 日付と実労働時間表示 -->
      <div class="info-display">
        {{ formattedDate }}　実労働時間：{{ formattedActualWorkHours }}
        <span v-if="!isWorkHoursConfirmed" class="provisional">（暫定）</span>
      </div>
      
      <!-- タスクヘッダー -->
      <div class="task-header">
        <span class="header-hash">#</span>
        <span class="header-task">タスク</span>
        <div class="search-box">
          <span class="search-text">🔍（全件表示）</span>
        </div>
        <div class="header-time-area">
          <span class="header-time-label">作業時間・ボリューム</span>
          <div class="scale-labels">
            <span class="scale-num">0</span>
            <span class="scale-num">1</span>
            <span class="scale-num">2</span>
            <span class="scale-num">3</span>
            <span class="scale-num">4</span>
            <span class="scale-num">5</span>
            <span class="scale-num">6</span>
            <span class="scale-num">7</span>
            <span class="scale-num">8</span>
            <span class="scale-num">9</span>
            <span class="scale-num">10</span>
          </div>
        </div>
      </div>
      
      <!-- タスク一覧 -->
      <div class="task-list">
        <div 
          v-for="(task, index) in tasks" 
          :key="index" 
          :class="['task-row', { 'odd-row': index % 2 === 0 }]"
        >
          <!-- 行番号 -->
          <span class="row-number">{{ index + 1 }}</span>
          
          <!-- タスク名 -->
          <span class="task-name" :title="task.displayName">{{ task.displayName }}</span>
          
          <!-- 右側エリア -->
          <div class="task-right-area">
            <!-- スライダー -->
            <div class="slider-wrapper">
              <div class="slider-track">
                <div class="slider-progress" :style="{ width: (task.sliderValue / 10 * 100) + '%' }"></div>
                <div class="slider-markers">
                  <div v-for="n in 11" :key="n" class="marker-dot"></div>
                </div>
              </div>
              <input 
                type="range" 
                class="slider-input"
                :value="task.sliderValue"
                min="0" 
                max="10" 
                step="0.25"
                @input="onSliderChange(index, $event)"
              />
            </div>
            
            <!-- 時間入力 -->
            <input 
              type="text" 
              class="time-input"
              :value="task.timeDisplay"
              @change="onTimeChange(index, $event)"
              @blur="onTimeBlur(index, $event)"
              placeholder="0:00"
            />
            
            <!-- 時計アイコン -->
            <button class="clock-button" @click="onClockClick(index)" title="残り時間を自動入力">
              🕐
            </button>
          </div>
          
          <!-- 作業コード（2行目） -->
          <div class="work-code-row">
            <span class="work-code-label">作業コード</span>
            <input 
              type="text" 
              class="work-code-input"
              v-model="task.workCode"
              maxlength="50"
            />
          </div>
        </div>
        
        <!-- タスクがない場合の表示 -->
        <div v-if="tasks.length === 0 && !isLoading" class="no-task-message">
          表示するタスクがありません。ジョブマスタにデータを登録してください。
        </div>
      </div>
      
      <!-- 合計行 -->
      <div class="total-row">
        <span class="total-label">合計</span>
        <span class="total-time">{{ formattedTotalTime }}</span>
      </div>
      
      <!-- 操作ボタンエリア -->
      <div class="button-area">
        <button class="register-button" @click="onRegister" :disabled="isLoading">登録</button>
        <a class="cancel-link" @click="closeDialog">キャンセル</a>
      </div>
      
      <!-- エラーメッセージ -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      
      <!-- ローディング表示 -->
      <div v-if="isLoading" class="loading-overlay">
        <span>読み込み中...</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'WorkHoursInputDialog',
  
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    employeeId: {
      type: String,
      required: true
    },
    workDate: {
      type: String,
      required: true
    },
    actualWorkHours: {
      type: Number,
      default: 0
    },
    isWorkHoursConfirmed: {
      type: Boolean,
      default: false
    },
    attendanceId: {
      type: Number,
      default: null
    }
  },
  
  data() {
    return {
      tasks: [],
      jobMaster: [],
      existingWorkHours: [],
      errorMessage: '',
      isLoading: false
    }
  },
  
  computed: {
    formattedDate() {
      if (!this.workDate) return ''
      const date = new Date(this.workDate)
      const weekdays = ['日', '月', '火', '水', '木', '金', '土']
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const weekday = weekdays[date.getDay()]
      return `${year}年${month}月${day}日${weekday}曜日`
    },
    
    formattedActualWorkHours() {
      return this.formatHoursToTime(this.actualWorkHours)
    },
    
    totalWorkHours() {
      return this.tasks.reduce((sum, task) => sum + (task.workHours || 0), 0)
    },
    
    formattedTotalTime() {
      return this.formatHoursToTime(this.totalWorkHours)
    }
  },
  
  watch: {
    visible: {
      handler(newVal) {
        if (newVal) {
          this.initializeDialog()
          // スクロールをロック
          document.body.style.overflow = 'hidden'
        } else {
          // スクロールをアンロック
          document.body.style.overflow = ''
        }
      },
      immediate: true
    }
  },
  
  mounted() {
    // マウント時にvisibleがtrueの場合は初期化
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
    formatHoursToTime(hours) {
      if (!hours && hours !== 0) return '0:00'
      const h = Math.floor(hours)
      const m = Math.round((hours - h) * 60)
      return `${h}:${m.toString().padStart(2, '0')}`
    },
    
    parseTimeToHours(timeStr) {
      if (!timeStr) return null
      // H:MM形式の厳密なチェック
      const match = timeStr.match(/^(\d+):(\d{2})$/)
      if (!match) return null
      const hours = parseInt(match[1], 10)
      const minutes = parseInt(match[2], 10)
      // 分が60未満であることを確認
      if (minutes >= 60) return null
      return hours + minutes / 60
    },
    
    async initializeDialog() {
      this.errorMessage = ''
      this.isLoading = true
      this.tasks = []
      
      try {
        console.log('工数実績入力ダイアログ初期化:', {
          employeeId: this.employeeId,
          workDate: this.workDate
        })
        
        const [jobsRes, workHoursRes] = await Promise.all([
          axios.get('/api/master/jobs', {
            params: {
              workDate: this.workDate
            }
          }),
          axios.get('/api/work-hours', {
            params: {
              employeeId: this.employeeId,
              workDate: this.workDate
            }
          })
        ])
        
        console.log('ジョブマスタ取得結果:', jobsRes.data)
        console.log('工数実績取得結果:', workHoursRes.data)
        
        if (jobsRes.data.success) {
          this.jobMaster = jobsRes.data.jobs || []
          console.log('取得したジョブマスタ数:', this.jobMaster.length)
          if (this.jobMaster.length === 0) {
            console.warn('ジョブマスタが空です。データベースにジョブが登録されているか確認してください。')
          }
        } else {
          console.error('ジョブマスタ取得失敗:', jobsRes.data.message)
          this.errorMessage = jobsRes.data.message || 'ジョブマスタの取得に失敗しました。'
        }
        
        if (workHoursRes.data.success) {
          this.existingWorkHours = workHoursRes.data.workHours || []
          console.log('取得した工数実績数:', this.existingWorkHours.length)
        } else {
          console.error('工数実績取得失敗:', workHoursRes.data.message)
          // 工数実績の取得失敗は致命的ではないので、エラーは表示しない
        }
        
        this.buildTaskList()
        console.log('構築後のタスク数:', this.tasks.length)
        
      } catch (error) {
        console.error('初期化エラー:', error)
        console.error('エラー詳細:', error.response?.data || error.message)
        this.errorMessage = error.response?.data?.message || 'データの取得に失敗しました。'
      } finally {
        this.isLoading = false
      }
    },
    
    buildTaskList() {
      console.log('buildTaskList開始 - ジョブマスタ数:', this.jobMaster.length, '既存工数実績数:', this.existingWorkHours.length)
      
      // ジョブマスタが空の場合はエラー
      if (!this.jobMaster || this.jobMaster.length === 0) {
        console.warn('ジョブマスタが空です')
        this.tasks = []
        return
      }
      
      // 既存工数実績があるジョブコードのリスト
      const existingJobCodes = this.existingWorkHours.map(wh => wh.JOB_CODE)
      
      // 既存工数実績のジョブを先に追加
      const tasksFromExisting = this.existingWorkHours.map(wh => {
        const job = this.jobMaster.find(j => j.JOB_CODE === wh.JOB_CODE)
        const workHours = parseFloat(wh.WORK_HOURS_VALUE) || 0
        return {
          jobCode: wh.JOB_CODE,
          displayName: job?.JOB_NAME || wh.JOB_NAME || wh.JOB_CODE,
          workHours: workHours,
          sliderValue: Math.min(workHours, 10),
          timeDisplay: this.formatHoursToTime(workHours),
          workCode: wh.WORK_CODE || '',
          workHoursId: wh.WORK_HOURS_ID,
          inputType: wh.INPUT_TYPE || 'TIME',
          workVolume: wh.WORK_VOLUME
        }
      })
      
      // ジョブマスタから残りのジョブを追加（既存工数実績がないジョブ）
      const tasksFromMaster = this.jobMaster
        .filter(job => !existingJobCodes.includes(job.JOB_CODE))
        .map(job => ({
          jobCode: job.JOB_CODE,
          displayName: job.JOB_NAME,
          workHours: 0,
          sliderValue: 0,
          timeDisplay: '0:00',
          workCode: '',
          workHoursId: null,
          inputType: 'TIME',
          workVolume: null
        }))
      
      this.tasks = [...tasksFromExisting, ...tasksFromMaster]
      
      console.log('構築されたタスクリスト:', this.tasks)
      console.log('既存工数実績から:', tasksFromExisting.length, 'ジョブマスタから:', tasksFromMaster.length, '合計:', this.tasks.length)
    },
    
    onSliderChange(index, event) {
      const value = parseFloat(event.target.value)
      this.tasks[index].sliderValue = value
      this.tasks[index].workHours = value
      this.tasks[index].timeDisplay = this.formatHoursToTime(value)
    },
    
    onTimeChange(index, event) {
      const timeStr = event.target.value
      
      // チェック仕様 No.1（作業時間フォーマットチェック）に準拠
      // 1. フォーマットチェック
      const hours = this.parseTimeToHours(timeStr)
      if (hours === null) {
        // E_JOB_001: 作業時間の形式が正しくありません。H:MM形式で入力してください。
        this.errorMessage = '作業時間の形式が正しくありません。'
        // 直前の値に戻す
        event.target.value = this.tasks[index].timeDisplay
        return
      }
      
      // 2. 数値範囲チェック（0:00未満）
      if (hours < 0) {
        // E_JOB_002: 作業時間は0:00以上で入力してください。
        this.errorMessage = '作業時間は0:00以上で入力してください。'
        // 直前の値に戻す
        event.target.value = this.tasks[index].timeDisplay
        return
      }
      
      // 3. 数値範囲チェック（24:00超過）
      if (hours > 24) {
        // E_JOB_003: 作業時間は24:00以下で入力してください。
        this.errorMessage = '作業時間は24:00以下で入力してください。'
        // 直前の値に戻す
        event.target.value = this.tasks[index].timeDisplay
        return
      }
      
      // チェック通過：エラーメッセージをクリア
      this.errorMessage = ''
      
      // 作業時間入力変更処理（詳細設計書の仕様に準拠）
      // 1. スライダー連動
      this.tasks[index].sliderValue = Math.min(hours, 10)
      
      // 2. 入力データ更新
      this.tasks[index].workHours = hours
      this.tasks[index].timeDisplay = this.formatHoursToTime(hours)
      
      // 3. 合計時間再算出（computedプロパティで自動更新される）
    },
    
    onTimeBlur(index, event) {
      const timeStr = event.target.value
      if (!timeStr) {
        // 空欄の場合は0:00に設定
        this.tasks[index].workHours = 0
        this.tasks[index].sliderValue = 0
        this.tasks[index].timeDisplay = '0:00'
        return
      }
      
      // フォーマットチェック
      const hours = this.parseTimeToHours(timeStr)
      if (hours === null) {
        // フォーマットエラーの場合は直前の値に戻す
        event.target.value = this.tasks[index].timeDisplay
        this.errorMessage = '作業時間の形式が正しくありません。'
        return
      }
      
      // 正常な場合はフォーマット済みの値を表示
      this.tasks[index].timeDisplay = this.formatHoursToTime(hours)
      this.errorMessage = ''
    },
    
    onClockClick(index) {
      // 時計アイコン押下処理（詳細設計書の仕様に準拠）
      // 編集仕様 No.3（残り時間算出）に従う
      
      // 1. 残り時間算出
      // 残り時間 = 実労働時間 - （合計作業時間 - 該当タスクの作業時間）
      const otherTasksTotal = this.tasks.reduce((sum, task, i) => {
        if (i === index) return sum
        return sum + (task.workHours || 0)
      }, 0)
      
      let remainingHours = this.actualWorkHours - otherTasksTotal
      // 残り時間が負の値の場合は0に設定
      if (remainingHours < 0) remainingHours = 0
      
      // 2. 作業時間自動入力
      // 算出した残り時間を該当タスクの作業時間入力欄に設定する
      this.tasks[index].workHours = remainingHours
      
      // スライダーも連動して更新する
      this.tasks[index].sliderValue = Math.min(remainingHours, 10)
      this.tasks[index].timeDisplay = this.formatHoursToTime(remainingHours)
      
      // 3. 入力データ更新（上記で既に更新済み）
      
      // 4. 合計時間再算出（computedプロパティで自動更新される）
    },
    
    async onRegister() {
      this.errorMessage = ''
      
      // チェック仕様 No.2（工数実績入力チェック）に準拠
      for (const task of this.tasks) {
        if (task.workCode && task.workCode.length > 50) {
          // E_JOB_004: 作業コードは50文字以内で入力してください。
          this.errorMessage = '作業コードは50文字以内で入力してください。'
          return
        }
      }
      
      try {
        this.isLoading = true
        
        for (const existing of this.existingWorkHours) {
          await axios.delete(`/api/work-hours/${existing.WORK_HOURS_ID}`)
        }
        
        const tasksToSave = this.tasks.filter(task => task.workHours > 0)
        
        for (const task of tasksToSave) {
          await axios.post('/api/work-hours', {
            attendanceId: this.attendanceId,
            employeeId: this.employeeId,
            workDate: this.workDate,
            jobCode: task.jobCode,
            workCode: task.workCode || null,
            workHoursValue: task.workHours,
            workVolume: task.workVolume,
            inputType: task.inputType
          })
        }
        
        this.$emit('update:visible', false)
        this.$emit('registered', {
          totalWorkHours: this.totalWorkHours,
          workDate: this.workDate
        })
        
      } catch (error) {
        console.error('登録エラー:', error)
        this.errorMessage = '工数実績の登録に失敗しました。'
      } finally {
        this.isLoading = false
      }
    },
    
    closeDialog() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
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
  width: 1010px;
  background-color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* ヘッダー */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #D0E8F7;
  height: 33px;
}

.dialog-title {
  font-size: 16px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 16px;
  color: #7C96AE;
  cursor: pointer;
}

/* 日付・実労働時間表示 */
.info-display {
  padding: 8px 16px;
  font-size: 14px;
  color: #333;
}

.provisional {
  color: #999;
}

/* タスクヘッダー */
.task-header {
  position: relative;
  display: flex;
  align-items: flex-start;
  background-color: #D0E8F7;
  border-radius: 7px;
  margin: 0 6px;
  padding: 8px 10px;
  height: 50px;
}

.header-hash {
  font-size: 15px;
  color: #333;
  width: 20px;
  margin-top: 9px;
}

.header-task {
  font-size: 15px;
  color: #333;
  margin-left: 200px;
  margin-top: 4px;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 4px 8px;
  margin-left: 16px;
  margin-top: 4px;
  width: 174px;
  height: 26px;
}

.search-text {
  font-size: 13px;
  color: #b4b4b4;
}

.header-time-area {
  position: absolute;
  right: 112px;
  top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-time-label {
  font-size: 12px;
  color: #333;
  margin-bottom: 5px;
}

.scale-labels {
  display: flex;
  width: 260px;
  justify-content: space-between;
  margin-top: 0;
  position: relative;
  top: 0;
  line-height: 1;
  gap: 0;
  padding: 0;
  align-items: center;
}

.scale-num {
  font-size: 12px;
  color: #666;
  width: auto;
  min-width: 0;
  text-align: center;
  flex-shrink: 0;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* タスク一覧 */
.task-list {
  max-height: 250px;
  overflow-y: auto;
}

.task-row {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border: 1px solid #e0e0e0;
  margin: 0 6px;
  padding: 10px;
  min-height: 61px;
  background-color: #fff;
}

.odd-row {
  background-color: #f9f9f9;
}

.row-number {
  font-size: 15px;
  font-weight: bold;
  font-style: italic;
  color: #333;
  width: 20px;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.task-name {
  font-size: 12px;
  color: #0070D2;
  width: 550px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  text-align: left;
  justify-content: flex-start;
}

.task-right-area {
  position: absolute;
  right: 15px;
  top: 3px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* スライダー */
.slider-wrapper {
  position: relative;
  width: 260px;
  height: 14px;
}

.slider-track {
  position: absolute;
  top: 3px;
  left: 0;
  width: 100%;
  height: 9px;
  background-color: #e0e0e0;
  border-radius: 5px;
}

.slider-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #4A9EFF;
  border-radius: 5px;
}

.slider-markers {
  position: absolute;
  top: 3px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.marker-dot {
  width: 3px;
  height: 3px;
  background-color: #fff;
  border-radius: 50%;
}

.slider-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 11px;
  height: 11px;
  background: #fff;
  border: 2px solid #4A9EFF;
  border-radius: 50%;
  cursor: pointer;
}

.slider-input::-moz-range-thumb {
  width: 11px;
  height: 11px;
  background: #fff;
  border: 2px solid #4A9EFF;
  border-radius: 50%;
  cursor: pointer;
}

/* 時間入力 */
.time-input {
  width: 56px;
  height: 22px;
  border: 1px solid #ccc;
  border-radius: 2px;
  text-align: center;
  font-size: 14px;
  color: #333;
}

/* 時計ボタン */
.clock-button {
  width: 27px;
  height: 27px;
  background-color: #0096FF;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.clock-button:hover {
  background-color: #007ACC;
}

/* 作業コード */
.work-code-row {
  position: absolute;
  right: 125px;
  bottom: 8px;
  display: flex;
  align-items: center;
}

.work-code-label {
  font-size: 12px;
  color: #666;
  margin-right: 8px;
}

.work-code-input {
  width: 111px;
  height: 20px;
  border: 1px solid #ccc;
  border-radius: 2px;
  font-size: 13px;
  padding: 0 4px;
}

/* タスクなしメッセージ */
.no-task-message {
  padding: 40px;
  text-align: center;
  color: #666;
  font-size: 16px;
}

/* 合計行 */
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e0e0e0;
  margin: 0 6px;
  padding: 6px 38px;
  background-color: #fff;
  height: 28px;
}

.total-label {
  font-size: 14px;
  color: #333;
}

.total-time {
  font-size: 14px;
  color: #333;
  position: absolute;
  right: 95px;
}

/* 操作ボタン */
.button-area {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  gap: 16px;
}

.register-button {
  width: 51px;
  height: 33px;
  background-color: #108DC5;
  border: none;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}

.register-button:hover {
  background-color: #0A7AAF;
}

.register-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.cancel-link {
  font-size: 15px;
  color: #0070D2;
  text-decoration: underline;
  cursor: pointer;
}

/* エラーメッセージ */
.error-message {
  padding: 8px 16px;
  color: #c00;
  font-size: 14px;
  text-align: center;
  background-color: #ffe0e0;
  margin: 0 6px 6px 6px;
}

/* ローディング */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #666;
}
</style>
