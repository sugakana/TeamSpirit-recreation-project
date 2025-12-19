<template>
  <div class="home-container">
    <!-- ヘッダーコンポーネント -->
    <AppHeader 
      :current-page="currentPage" 
      @menu-click="handleMenuClick"
    />
    
    <!-- Rectangle 199 - 勤怠カード背景 -->
    <div class="rect-199"></div>
    
    <!-- Rectangle 200 - お知らせカード背景 -->
    <div class="rect-200" :class="{ 'below-rect-199': currentPage === 'home' }"></div>
    
    <!-- TEXT: TeamSpirit (勤怠セクション) -->
    <span class="text-teamspirit-attendance">TeamSpirit</span>
    
    <!-- TEXT: 日付表示内 -->
    <span class="text-date-inner">{{ currentDate }}</span>
    
    <!-- TEXT: 曜日表示内 -->
    <span class="text-day-inner">{{ currentDay }}</span>
    
    <!-- Rectangle 1 - 打刻フォーム背景 -->
    <div class="rect-1"></div>
    
    <!-- TEXT: 勤怠場所を選択して打刻をしてください -->
    <span class="text-instruction">勤怠場所を選択して打刻をしてください</span>
    
    <!-- VECTOR: Polygon 1 - 緑のアイコン -->
    <svg class="polygon-1" viewBox="0 0 5.600547790527344 5.958576679229736" transform="rotate(-179.44722767686113)">
      <path d="M 2.8002727205264852 5.958576679229737 L 5.600547790527344 0 L 0 0 L 2.8002727205264852 5.958576679229737 Z" fill="rgb(180, 210, 44)"/>
    </svg>
    
    <!-- Rectangle 53 - 緑のアイコンボックス -->
    <div class="rect-53"></div>
    
    <!-- VECTOR: Polygon 2 - 青のアイコン -->
    <svg class="polygon-2" viewBox="0 0 5.600547790527344 5.958576679229736" transform="rotate(-179.44722767686113)">
      <path d="M 2.8002727205264852 5.958576679229737 L 5.600547790527344 0 L 0 0 L 2.8002727205264852 5.958576679229737 Z" fill="rgb(111, 206, 248)"/>
    </svg>
    
    <!-- Rectangle 58 - 青のアイコンボックス -->
    <div class="rect-58"></div>
    
    <!-- VECTOR: Polygon 3 - オレンジのアイコン -->
    <svg class="polygon-3" viewBox="0 0 5.600547790527344 5.958576679229736" transform="rotate(-179.44722767686113)">
      <path d="M 2.8002727205264852 5.958576679229737 L 5.600547790527344 0 L 0 0 L 2.8002727205264852 5.958576679229737 Z" fill="rgb(255, 210, 139)"/>
    </svg>
    
    <!-- Rectangle 63 - オレンジのアイコンボックス -->
    <div class="rect-63"></div>
    
    <!-- Ellipse 1 - 緑のアイコン内の円 -->
    <div class="ellipse-1"></div>
    
    <!-- Ellipse 2 - オレンジのアイコン内の円 -->
    <div class="ellipse-2"></div>
    
    <!-- Line 2 -->
    <div class="line-2"></div>
    
    <!-- Line 3 -->
    <div class="line-3"></div>
    
    <!-- Rectangle 54 - 通勤ボタン -->
    <button 
      class="rect-54 workplace-btn" 
      :class="{ active: selectedWorkplace === 'commute' }" 
      :disabled="!isWorkplaceSelectable"
      @click="selectWorkLocation('commute')"
    >
      <span class="text-commute">通勤</span>
    </button>
    
    <!-- Rectangle 56 - 直行、直帰、直行直帰ボタン -->
    <button 
      class="rect-56 workplace-btn" 
      :class="{ active: selectedWorkplace === 'direct' }" 
      :disabled="!isWorkplaceSelectable"
      @click="selectWorkLocation('direct')"
    >
      <span class="text-direct">直行、直近、直行直帰</span>
    </button>
    
    <!-- Rectangle 57 - 出張ボタン -->
    <button 
      class="rect-57 workplace-btn" 
      :class="{ active: selectedWorkplace === 'business' }" 
      :disabled="!isWorkplaceSelectable"
      @click="selectWorkLocation('business')"
    >
      <span class="text-business">出張</span>
    </button>
    
    <!-- Rectangle 55 - 在宅ボタン -->
    <button 
      class="rect-55 workplace-btn" 
      :class="{ active: selectedWorkplace === 'home' }" 
      :disabled="!isWorkplaceSelectable"
      @click="selectWorkLocation('home')"
    >
      <span class="text-home-work">在宅</span>
    </button>
    
    <!-- Rectangle 59 - 青のアイコン内のドキュメント -->
    <div class="rect-59"></div>
    
    <!-- Rectangle 60 -->
    <div class="rect-60"></div>
    
    <!-- Rectangle 61 -->
    <div class="rect-61"></div>
    
    <!-- Rectangle 176 -->
    <div class="rect-176"></div>
    
    <!-- Rectangle 62 -->
    <div class="rect-62"></div>
    
    <!-- TEXT: ￥ -->
    <span class="text-yen">￥</span>
    
    <!-- Rectangle 64 -->
    <div class="rect-64"></div>
    
    <!-- Rectangle 65 -->
    <div class="rect-65"></div>
    
    <!-- Rectangle 66 -->
    <div class="rect-66"></div>
    
    <!-- Rectangle 69 - 日付表示ボックス -->
    <div class="rect-69"></div>
    
    <!-- TEXT: 日付表示ボックス内 -->
    <span class="text-date-box">{{ currentDate }}</span>
    
    <!-- TEXT: 時刻表示 -->
    <span class="text-time">{{ currentTime }}</span>
    
    <!-- TEXT: 曜日表示ボックス内 -->
    <span class="text-day-box">{{ currentDay }}</span>
    
    <!-- GROUP: Group 2 - 日付表示のインジケーター -->
    <div class="group-2">
      <div class="group-1">
        <div class="ellipse-4"></div>
      </div>
      <div class="ellipse-3"></div>
    </div>
    
    <!-- Rectangle 195 - 出勤ボタン -->
    <button 
      class="rect-195 punch-btn" 
      :disabled="!isClockInEnabled"
      @click="clockIn"
    ></button>
    <span class="text-punch-start">出勤</span>
    
    <!-- Rectangle 196 - 退勤ボタン -->
    <button 
      class="rect-196 punch-btn" 
      :disabled="!isClockOutEnabled"
      @click="clockOut"
    ></button>
    <span class="text-punch-end">退勤</span>
    
    <!-- Rectangle 198 - 定時出勤ボタン -->
    <button 
      class="rect-198 punch-btn" 
      :disabled="!isScheduledClockInEnabled"
      @click="clockInScheduled"
    ></button>
    <span class="text-punch-scheduled-start">定時<br>出勤</span>
    
    <!-- Rectangle 197 - 定時退勤ボタン -->
    <button 
      class="rect-197 punch-btn" 
      :disabled="!isScheduledClockOutEnabled"
      @click="clockOutScheduled"
    ></button>
    <span class="text-punch-scheduled-end">定時<br>退勤</span>
    
    <!-- Group: Rectangle 200内のテキスト -->
    <div class="group-announcements">
      <!-- TEXT: お知らせ -->
      <span class="text-announcements-title">お知らせ</span>
      
      <!-- TEXT: お知らせ1 -->
      <span v-if="notifications[0]" class="text-announcement-1">{{ notifications[0] }}</span>
      
      <!-- TEXT: お知らせ2 -->
      <span v-if="notifications[1]" class="text-announcement-2">{{ notifications[1] }}</span>
      
      <!-- TEXT: お知らせ3 -->
      <span v-if="notifications[2]" class="text-announcement-3">{{ notifications[2] }}</span>
      
      <!-- TEXT: お知らせ4 -->
      <span v-if="notifications[3]" class="text-announcement-4">{{ notifications[3] }}</span>
    </div>
    
    <!-- VECTOR: Line 10 - 波線 -->
    <svg class="line-10" viewBox="0 0 27 6" preserveAspectRatio="none">
      <path d="M 0 0 L 13.450692645617476 6 L 27.000000000000004 0" stroke="rgb(197, 217, 232)" stroke-width="3" stroke-linecap="round" fill="none"/>
    </svg>
    
    <!-- Rectangle 206 -->
    <div class="rect-206"></div>
    
    <!-- Rectangle 207 -->
    <div class="rect-207"></div>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import HolidayJp from '@holiday-jp/holiday_jp'
import { getHolidayWorkStatus, getTodayAttendance, clockIn, clockInScheduled, clockOut, clockOutScheduled, getNotifications } from '@/services/api.js'

export default {
  name: 'HomeScreen',
  components: {
    AppHeader
  },
  data() {
    return {
      // 勤務場所関連
      selectedWorkplace: null, // 初期状態は未選択
      
      // 日時表示
      currentDate: '',
      currentTime: '',
      currentDay: '',
      clockInterval: null, // 時計更新用のインターバル
      
      // ナビゲーション
      currentPage: 'home', // 現在のページ
      
      // 勤怠情報
      attendanceRecordId: null, // 当日の勤怠記録ID
      isClockInDone: false, // 出勤打刻済みフラグ
      isClockOutDone: false, // 退勤打刻済みフラグ
      isOnBreak: false, // 中断中フラグ
      
      // お知らせ
      notifications: [], // お知らせリスト
      
      // 休日出勤申請
      isHolidayWorkApproved: false // 休日出勤申請承認済みフラグ
    }
  },
  computed: {
    // 当日が土日祝かどうか
    isHoliday() {
      const today = new Date()
      const dayOfWeek = today.getDay() // 0=日曜日, 6=土曜日
      
      // 土日を判定
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return true
      }
      
      // 祝日を判定
      try {
        return HolidayJp.isHoliday(today)
      } catch (error) {
        console.error('祝日判定エラー:', error)
        return false
      }
    },
    // 打刻可能かどうか（平日、または土日祝で休日出勤申請が承認済み）
    canClock() {
      return !this.isHoliday || this.isHolidayWorkApproved
    },
    // 勤務場所選択可能かどうか（常に選択可能）
    isWorkplaceSelectable() {
      // いつでも選択可能
      return true
    },
    // 出勤ボタンが有効かどうか（未出勤、または中断中、かつ打刻可能）
    isClockInEnabled() {
      return this.canClock && (!this.isClockInDone || this.isOnBreak)
    },
    // 定時出勤ボタンが有効かどうか（未出勤、かつ現在時刻が9:00以前、かつ打刻可能）
    isScheduledClockInEnabled() {
      if (!this.canClock || this.isClockInDone) return false
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      return hours < 9 || (hours === 9 && minutes === 0)
    },
    // 退勤ボタンが有効かどうか（出勤済み、かつ未退勤、かつ中断中でない、かつ打刻可能）
    isClockOutEnabled() {
      return this.canClock && this.isClockInDone && !this.isClockOutDone && !this.isOnBreak
    },
    // 定時退勤ボタンが有効かどうか（出勤済み、かつ未退勤、かつ中断中でない、かつ現在時刻が17:30以降、かつ打刻可能）
    isScheduledClockOutEnabled() {
      if (!this.canClock || !this.isClockInDone || this.isClockOutDone || this.isOnBreak) return false
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      return hours > 17 || (hours === 17 && minutes >= 30)
    }
  },
  mounted() {
    this.initializeHomeScreen()
  },
  beforeUnmount() {
    // 時計更新のインターバルをクリア
    if (this.clockInterval) {
      clearInterval(this.clockInterval)
    }
  },
  methods: {
    // 初期表示処理
    async initializeHomeScreen() {
      // 1. ログイン情報の確認
      // TODO: セッションストレージまたはVuexストアからログイン情報を取得
      
      // 2. お知らせ情報の取得
      await this.fetchNotifications()
      
      // 3. 当日の勤怠情報の取得
      await this.fetchTodayAttendance()
      
      // 4. 休日出勤申請の確認（当日が土日祝の場合のみ）
      await this.fetchHolidayWorkStatus()
      
      // 5. ボタンの活性/非活性制御はcomputedプロパティで自動制御
      
      // 6. 時計表示の開始
      this.startClock()
    },
    
    // お知らせ情報の取得
    async fetchNotifications() {
      try {
        const employeeId = localStorage.getItem('employeeId') || '000001'
        const data = await getNotifications(employeeId)
        
        if (data.success && data.notifications && Array.isArray(data.notifications)) {
          // バックエンドから文字列配列が返されるので、そのまま使用
          // オブジェクトの場合はCONTENTまたはTITLEを取得、文字列の場合はそのまま使用
          this.notifications = data.notifications.slice(0, 4).map(n => {
            if (typeof n === 'string') {
              return n
            } else if (n && typeof n === 'object') {
              return n.CONTENT || n.TITLE || ''
            }
            return ''
          }).filter(n => n) // 空文字列を除外
        } else {
          // APIからの取得に失敗した場合は固定データを使用
          this.notifications = [
            '12月・1月の年休取得推奨日は、12/12(金)、12/25(木)、1/23(金)です。推奨日を中心にチームで調整し合うなどして、年休を取得しましょう。',
            '【経企からのお知らせ】毎日KOUKAヘログインして(連続ログインでボーナスKoinゲット)、日々の感謝・称賛の気持ちを伝えましょう! [https://cac.kouka-bc.com/]',
            '【情シより】不明点はまずはFAQでご確認ください。<C-FAQ (okbiz.jp)>。また、操作マニュアルは「勤務表」、「工数実績」の「? HELP」 タブから取得できます。',
            '日次承認済みの工数実績をデータとして取得可能となりました。レポートから「07_工数実績出力レポート」を選択してください。詳細な手順はHelpサイトにあります。'
          ]
        }
      } catch (error) {
        console.error('お知らせ情報の取得に失敗しました:', error)
        // エラー時は固定データを使用
        this.notifications = [
          '12月・1月の年休取得推奨日は、12/12(金)、12/25(木)、1/23(金)です。推奨日を中心にチームで調整し合うなどして、年休を取得しましょう。',
          '【経企からのお知らせ】毎日KOUKAヘログインして(連続ログインでボーナスKoinゲット)、日々の感謝・称賛の気持ちを伝えましょう! [https://cac.kouka-bc.com/]',
          '【情シより】不明点はまずはFAQでご確認ください。<C-FAQ (okbiz.jp)>。また、操作マニュアルは「勤務表」、「工数実績」の「? HELP」 タブから取得できます。',
          '日次承認済みの工数実績をデータとして取得可能となりました。レポートから「07_工数実績出力レポート」を選択してください。詳細な手順はHelpサイトにあります。'
        ]
      }
    },
    
    // 当日の勤怠情報の取得
    async fetchTodayAttendance() {
      try {
        const employeeId = localStorage.getItem('employeeId') || '000001'
        const data = await getTodayAttendance(employeeId)
        
        if (data.success && data.attendance) {
          const attendance = data.attendance
          this.attendanceRecordId = attendance.attendanceId
          this.isClockInDone = attendance.clockInTime !== null
          this.isClockOutDone = attendance.clockOutTime !== null
          this.isOnBreak = attendance.isOnBreak || false
          // 勤務場所は初回表示時のみ設定（ユーザーの選択を上書きしない）
          // バックエンドのコードをフロントエンド形式に変換
          if (!this.selectedWorkplace && attendance.workLocationCode) {
            const codeMap = {
              'COMMUTE': 'commute',
              'REMOTE': 'home',
              'DIRECT': 'direct',
              'BUSINESS_TRIP': 'business'
            }
            this.selectedWorkplace = codeMap[attendance.workLocationCode] || null
          }
        } else {
          // 当日の勤怠記録がない場合は初期状態
          this.attendanceRecordId = null
          this.isClockInDone = false
          this.isClockOutDone = false
          this.isOnBreak = false
          // 勤務場所はユーザーの選択を維持
        }
      } catch (error) {
        console.error('当日の勤怠情報の取得に失敗しました:', error)
        // エラー時は初期状態を設定
        this.attendanceRecordId = null
        this.isClockInDone = false
        this.isClockOutDone = false
        this.isOnBreak = false
        // 勤務場所はユーザーの選択を維持
      }
    },
    
    // 休日出勤申請状態の取得
    async fetchHolidayWorkStatus() {
      // 当日が土日祝の場合のみ取得
      if (!this.isHoliday) {
        this.isHolidayWorkApproved = false
        return
      }
      
      try {
        const employeeId = localStorage.getItem('employeeId') || '000001'
        const today = new Date()
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const date = String(today.getDate()).padStart(2, '0')
        const targetDate = `${year}-${month}-${date}`
        
        const response = await getHolidayWorkStatus(employeeId, targetDate)
        
        if (response.success) {
          // 申請が存在し、申請中（PENDING）または承認済み（APPROVED）の場合にtrue
          this.isHolidayWorkApproved = response.hasHolidayWorkApplication && 
            (response.applicationStatus === 'PENDING' || response.applicationStatus === 'APPROVED')
        } else {
          this.isHolidayWorkApproved = false
        }
      } catch (error) {
        console.error('休日出勤申請状態の取得に失敗しました:', error)
        // エラー時はfalseとして扱う（打刻不可）
        this.isHolidayWorkApproved = false
      }
    },
    
    // 時計表示の開始（1秒ごとに更新）
    startClock() {
      this.updateClock()
      this.clockInterval = setInterval(() => {
        this.updateClock()
      }, 1000)
    },
    
    // 時計の更新
    updateClock() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const date = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      
      this.currentDate = `${year}/${month}/${date}`
      this.currentTime = `${hours}:${minutes}`
      
      const dayNames = ['(SUN)', '(MON)', '(TUE)', '(WED)', '(THU)', '(FRI)', '(SAT)']
      this.currentDay = dayNames[now.getDay()]
    },
    
    // 勤務場所選択処理
    selectWorkLocation(locationCode) {
      if (!this.isWorkplaceSelectable) return
      this.selectedWorkplace = locationCode
    },
    
    // 勤務場所コードをバックエンド形式に変換
    convertWorkLocationCode(frontendCode) {
      const codeMap = {
        'commute': 'COMMUTE',
        'home': 'REMOTE',
        'direct': 'DIRECT',
        'business': 'BUSINESS_TRIP'
      }
      return codeMap[frontendCode] || 'COMMUTE'
    },
    
    // 出勤打刻処理（通常の出勤または中断後の再開）
    async clockIn() {
      if (!this.isClockInEnabled) return
      
      // 勤務場所が未選択の場合はデフォルト値（通勤）を使用
      const workLocationCode = this.convertWorkLocationCode(this.selectedWorkplace || 'commute')
      
      try {
        const employeeId = localStorage.getItem('employeeId') || '000001'
        const data = await clockIn(employeeId, workLocationCode)
        
        if (data.success) {
          if (this.isOnBreak) {
            // 中断中の場合：再開打刻（出勤ボタンを押すことで休憩終了 + 再出勤）
            this.isOnBreak = false
          } else {
            // 通常の出勤打刻
            this.isClockInDone = true
          }
          // 勤務場所の選択状態を維持（上書きしない）
        } else {
          throw new Error(data.message || '出勤打刻に失敗しました')
        }
      } catch (error) {
        console.error('出勤打刻に失敗しました:', error)
      }
    },
    
    // 定時出勤打刻処理
    async clockInScheduled() {
      if (!this.isScheduledClockInEnabled) return
      
      // 勤務場所が未選択の場合はデフォルト値（通勤）を使用
      const workLocationCode = this.convertWorkLocationCode(this.selectedWorkplace || 'commute')
      
      try {
        const employeeId = localStorage.getItem('employeeId') || '000001'
        const data = await clockInScheduled(employeeId, workLocationCode)
        
        if (data.success) {
          this.isClockInDone = true
          // 勤務場所の選択状態を維持（上書きしない）
        } else {
          throw new Error(data.message || '定時出勤打刻に失敗しました')
        }
      } catch (error) {
        console.error('定時出勤打刻に失敗しました:', error)
      }
    },
    
    // 退勤打刻処理（通常の退勤または中断開始）
    async clockOut() {
      if (!this.isClockOutEnabled) return
      
      try {
        // 退勤ボタンは2つの機能がある：
        // 1. 中断していない場合：中断開始（休憩開始）
        // 2. 中断している場合：通常の退勤
        
        let workLocationCode = null

        if (this.selectedWorkplace) {
          workLocationCode = this.convertWorkLocationCode(this.selectedWorkplace)
        }
        
        const employeeId = localStorage.getItem('employeeId') || '000001'
        const data = await clockOut(employeeId, workLocationCode)
        
        if (data.success) {
          if (data.isOnBreak) {
            // 中断開始（休憩開始）
            this.isOnBreak = true
          } else {
            // 通常の退勤
            this.isClockOutDone = true
            this.isOnBreak = false
          }
        } else {
          throw new Error(data.message || '退勤打刻に失敗しました')
        }
      } catch (error) {
        console.error('退勤打刻に失敗しました:', error)
      }
    },
    
    // 定時退勤打刻処理
    async clockOutScheduled() {
      if (!this.isScheduledClockOutEnabled) return
      
      try {
        let workLocationCode = null

        if (this.selectedWorkplace) {
          workLocationCode = this.convertWorkLocationCode(this.selectedWorkplace)
        }
        
        const employeeId = localStorage.getItem('employeeId') || '000001'
        const data = await clockOutScheduled(employeeId, workLocationCode)
        
        if (data.success) {
          this.isClockOutDone = true
        } else {
          throw new Error(data.message || '定時退勤打刻に失敗しました')
        }
      } catch (error) {
        console.error('定時退勤打刻に失敗しました:', error)
      }
    },
    
    handleMenuClick(menuId) {
      this.currentPage = menuId
    }
  }
}
</script>

<style scoped>
.home-container {
  position: relative;
  width: 100%;
  min-width: 1200px;
  max-width: 1920px;
  min-height: 1080px;
  margin: 0 auto;
  padding-top: 90px; /* ヘッダーの高さ分（90px）を確保 */
  overflow: hidden;
  background: linear-gradient(to bottom, rgb(27, 94, 157), rgb(176, 196, 223));
}

/* 1920px以上の場合、幅を固定して中央配置を確実にする */
@media (min-width: 1920px) {
  .home-container {
    width: 1920px;
    max-width: 1920px;
  }
}

/* 画面幅が1200px未満の場合、レスポンシブレイアウトに変更 */
@media (max-width: 1199px) {
  .home-container {
    width: 100vw !important;
    min-width: 0 !important;
    max-width: 100vw !important;
    min-height: 100vh;
    margin: 0 !important;
    left: 0 !important;
    right: 0;
  }
}

/* カード背景 */
.rect-199 {
  position: absolute;
  left: 16px;
  top: 307px; /* HTMLファイルの位置に合わせる */
  width: 1872px;
  height: 190px;
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  z-index: 1;
}

.rect-200 {
  position: absolute;
  left: 16px;
  top: 105px; /* HTMLファイルの位置に合わせる */
  width: 1872px;
  height: 190px;
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  z-index: 1; /* 打刻ボタンなどの下に配置 */
}

/* 小さい画面でのカード調整 */
@media (max-width: 1199px) {
  .rect-199,
  .rect-200 {
    left: 2%;
    width: calc(100% - 4%);
    max-width: calc(100% - 4%);
  }
}

/* お知らせ */
.group-announcements {
  position: relative;
}

.text-announcements-title {
  position: absolute;
  left: 37px;
  top: 20px; 
  width: 88px;
  height: 22px;
  font-size: 19px;
  font-family: Arial;
  font-weight: bold;
  color: rgb(51, 51, 51);
  text-decoration: underline;
  z-index: 5; /* Rectangle200の上に表示 */
}

.text-announcement-1 {
  position: absolute;
  left: 37px;
  top: 60px; /* 元の間隔を維持 */
  width: calc(100% - 74px);
  height: 18px;
  font-size: 13px;
  font-family: Arial;
  font-weight: bold;
  color: rgb(102, 102, 102);
  z-index: 5;
}

.text-announcement-2 {
  position: absolute;
  left: 37px;
  top: 95px; /* 元の間隔を維持 */
  width: calc(100% - 74px);
  height: 18px;
  font-size: 13px;
  font-family: Arial;
  font-weight: bold;
  color: rgb(102, 102, 102);
  z-index: 5;
}

.text-announcement-3 {
  position: absolute;
  left: 37px;
  top: 132px; /* 元の間隔を維持 */
  width: calc(100% - 74px);
  height: 18px;
  font-size: 13px;
  font-family: Arial;
  font-weight: bold;
  color: rgb(102, 102, 102);
  z-index: 5;
}

.text-announcement-4 {
  position: absolute;
  left: 37px;
  top: 170px; /* 元の間隔を維持、Rectangle200の範囲内（295px以下）に収まる */
  width: calc(100% - 74px);
  height: 18px;
  font-size: 13px;
  font-family: Arial;
  font-weight: bold;
  color: rgb(102, 102, 102);
  z-index: 5; /* Rectangle200の上に表示 */
}

/* 勤怠セクション */
.text-teamspirit-attendance {
  position: absolute;
  left: 39px;
  top: 320px; /* HTMLファイルの位置に合わせる */
  width: 164px;
  height: 35px;
  font-size: 19px;
  font-family: Arial;
  font-weight: bold;
  color: rgb(51, 51, 51);
  z-index: 10; /* Rectangle200の上に表示 */
}

.text-date-inner {
  position: absolute;
  left: 76px;
  top: 406px;
  width: 48px;
  height: 9px;
  font-size: 10px;
  font-family: Arial;
  color: rgb(255, 255, 255);
  text-align: center;
  z-index: 10;
}

.text-day-inner {
  position: absolute;
  left: 87px;
  top: 444px;
  width: 26px;
  height: 9px;
  font-size: 10px;
  font-family: Arial;
  color: rgb(255, 255, 255);
  text-align: center;
  z-index: 10;
}

.rect-1 {
  position: absolute;
  left: 41px;
  top: 378px;
  width: 628px;
  height: 97px;
  background-color: rgb(255, 255, 255);
  border: 2px solid rgb(237, 242, 246);
  z-index: 10; /* Rectangle200の上に表示 */
}

.text-instruction {
  position: absolute;
  left: 168px;
  top: 381px;
  width: 225px;
  height: 13px;
  font-size: 11px;
  font-family: Arial;
  color: rgb(51, 51, 51);
  z-index: 10; /* Rectangle200の上に表示 */
}

/* 勤務場所アイコン */
.polygon-1 {
  position: absolute;
  left: 494px;
  top: 379px;
  width: 6px;
  height: 6px;
  z-index: 10; /* Rectangle200の上に表示 */
}

.rect-53 {
  position: absolute;
  left: 491px;
  top: 373px;
  width: 52px;
  height: 32px;
  background-color: rgb(180, 210, 44);
  border-radius: 0 0 5px 5px;
  z-index: 10;
}

.polygon-2 {
  position: absolute;
  left: 553px;
  top: 379px;
  width: 6px;
  height: 6px;
  z-index: 10;
}

.rect-58 {
  position: absolute;
  left: 550px;
  top: 373px;
  width: 52px;
  height: 32px;
  background-color: rgb(111, 206, 248);
  border-radius: 0 0 5px 5px;
  z-index: 10;
}

.polygon-3 {
  position: absolute;
  left: 611px;
  top: 379px;
  width: 6px;
  height: 6px;
  z-index: 10;
}

.rect-63 {
  position: absolute;
  left: 608px;
  top: 373px;
  width: 52px;
  height: 32px;
  background-color: rgb(255, 210, 139);
  border-radius: 0 0 5px 5px;
  z-index: 10;
}

.ellipse-1 {
  position: absolute;
  left: 505px;
  top: 379px;
  width: 24px;
  height: 23px;
  border: 1px solid rgb(255, 255, 255);
  border-radius: 50%;
  z-index: 10;
}

.ellipse-2 {
  position: absolute;
  left: 622px;
  top: 379px;
  width: 25px;
  height: 23px;
  border: 1px solid rgb(255, 255, 255);
  border-radius: 50%;
  z-index: 10;
}

.line-2 {
  position: absolute;
  left: 513px;
  top: 385px;
  width: 11px;
  height: 1px;
  background-color: rgb(255, 255, 255);
  transform: rotate(-90deg);
  transform-origin: center;
  z-index: 10;
}

.line-3 {
  position: absolute;
  left: 517px;
  top: 391px;
  width: 8px;
  height: 1px;
  background-color: rgb(255, 255, 255);
  z-index: 10;
}

/* 勤務場所ボタン */
.workplace-btn {
  position: absolute;
  border: 1px solid rgb(241, 243, 245);
  cursor: pointer;
  padding: 0;
  margin: 0;
  background-color: rgb(255, 254, 254);
  font-size: 13px;
  font-family: Arial;
  color: rgb(96, 96, 96);
  text-align: center;
  line-height: 28px;
}

.rect-54 {
  left: 168px;
  top: 398px;
  width: 49px;
  height: 28px;
  z-index: 10; /* Rectangle200の上に表示 */
}

.rect-55 {
  left: 217px;
  top: 398px;
  width: 49px;
  height: 28px;
  z-index: 10;
}

.rect-56 {
  left: 265px;
  top: 398px;
  width: 144px;
  height: 28px;
  z-index: 10;
}

.rect-57 {
  left: 408px;
  top: 398px;
  width: 50px;
  height: 28px;
  z-index: 10;
}

.workplace-btn.active {
  background-color: rgb(74, 146, 215);
  color: rgb(255, 255, 255);
}

.workplace-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-commute,
.text-home-work,
.text-direct,
.text-business {
  display: block;
  width: 100%;
  height: 100%;
  line-height: 28px;
}

/* 青のアイコン内のドキュメント */
.rect-59 {
  position: absolute;
  left: 564px;
  top: 380px;
  width: 23px;
  height: 22px;
  border: 1px solid rgb(255, 255, 255);
  z-index: 10; /* Rectangle200の上に表示 */
}

.rect-60 {
  position: absolute;
  left: 570px;
  top: 381px;
  width: 12px;
  height: 1px;
  background-color: rgb(255, 255, 255);
  z-index: 10;
}

.rect-61 {
  position: absolute;
  left: 569px;
  top: 385px;
  width: 12px;
  height: 1px;
  background-color: rgb(255, 255, 255);
  z-index: 10;
}

.rect-176 {
  position: absolute;
  left: 569px;
  top: 392px;
  width: 12px;
  height: 1px;
  background-color: rgb(255, 255, 255);
  z-index: 10;
}

.rect-62 {
  position: absolute;
  left: 569px;
  top: 389px;
  width: 12px;
  height: 1px;
  background-color: rgb(255, 255, 255);
  z-index: 10;
}

.text-yen {
  position: absolute;
  left: 628px;
  top: 379px;
  width: 14px;
  height: 13px;
  font-size: 13px;
  font-family: Arial;
  color: rgb(255, 255, 255);
  text-align: center;
  z-index: 10;
}

.rect-64 {
  position: absolute;
  left: 569px;
  top: 379px;
  width: 2px;
  height: 4px;
  background-color: rgb(255, 255, 255);
  z-index: 10;
}

.rect-65 {
  position: absolute;
  left: 574px;
  top: 379px;
  width: 2px;
  height: 4px;
  background-color: rgb(255, 255, 255);
  z-index: 10;
}

.rect-66 {
  position: absolute;
  left: 580px;
  top: 379px;
  width: 2px;
  height: 4px;
  background-color: rgb(255, 255, 255);
  z-index: 10;
}

/* 日付表示ボックス */
.rect-69 {
  position: absolute;
  left: 43px;
  top: 380px;
  width: 115px;
  height: 95px;
  background-color: rgb(37, 100, 152);
  z-index: 10; /* Rectangle200の上に表示 */
}

.text-date-box {
  position: absolute;
  left: 70px;
  top: 416px;
  width: 48px;
  height: 9px;
  font-size: 13px; 
  font-family: Arial;
  color: rgb(255, 255, 255);
  text-align: center;
  z-index: 10;
}

.text-time {
  position: absolute;
  left: 67px;
  top: 430px; 
  width: 67px;
  height: 27px;
  font-size: 27px;
  font-family: Arial;
  color: rgb(255, 255, 255);
  text-align: center;
  z-index: 10;
}

.text-day-box {
  position: absolute;
  left: 87px;
  top: 459px; /* 少し下にずらす */
  width: 26px;
  height: 9px;
  font-size: 11px; /* 少し大きく */
  font-family: Arial;
  color: rgb(255, 255, 255);
  text-align: center;
  z-index: 10;
}

.group-2 {
  position: absolute;
  left: 95px;
  top: 387px; /* HTMLファイルの位置に合わせる */
  width: 12px;
  height: 4px;
  overflow: visible;
  z-index: 10;
}

.group-1 {
  position: absolute;
  left: 8px;
  top: 0px;
  width: 4px;
  height: 4px;
  overflow: visible;
}

.ellipse-4 {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 4px;
  height: 4px;
  background-color: rgb(197, 217, 232);
  border-radius: 50%;
}

.ellipse-3 {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 4px;
  height: 4px;
  background-color: rgb(197, 217, 232);
  border-radius: 50%;
}

/* 打刻ボタン */
.punch-btn {
  position: absolute;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  background-color: rgb(37, 100, 152);
  border-radius: 0px;
}

.punch-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: rgb(100, 100, 100);
}

.rect-195 {
  left: 671px;
  top: 379px; /* HTMLファイルの位置に合わせる */
  width: 48px;
  height: 46px;
  z-index: 10; /* Rectangle200の上に表示 */
}

.rect-196 {
  left: 721px;
  top: 379px; /* HTMLファイルの位置に合わせる */
  width: 48px;
  height: 46px;
  z-index: 10;
}

.rect-198 {
  left: 671px;
  top: 426px; /* HTMLファイルの位置に合わせる */
  width: 48px;
  height: 48px;
  z-index: 10;
}

.rect-197 {
  left: 721px;
  top: 426px; /* HTMLファイルの位置に合わせる */
  width: 48px;
  height: 48px;
  z-index: 10;
}

.text-punch-start {
  position: absolute;
  left: 671px;
  top: 379px;
  width: 48px;
  height: 46px;
  font-size: 13px;
  font-family: Arial;
  color: rgb(255, 255, 255);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 10; /* Rectangle200の上に表示 */
  writing-mode: horizontal-tb;
}

.text-punch-end {
  position: absolute;
  left: 721px;
  top: 379px;
  width: 48px;
  height: 46px;
  font-size: 13px;
  font-family: Arial;
  color: rgb(255, 255, 255);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 10;
  writing-mode: horizontal-tb;
}

.text-punch-scheduled-start {
  position: absolute;
  left: 671px;
  top: 426px;
  width: 48px;
  height: 48px;
  font-size: 13px;
  font-family: Arial;
  color: rgb(100, 238, 236);
  text-align: center;
  white-space: pre-line;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 10;
  writing-mode: horizontal-tb;
}

.text-punch-scheduled-end {
  position: absolute;
  left: 721px;
  top: 426px;
  width: 48px;
  height: 48px;
  font-size: 13px;
  font-family: Arial;
  color: rgb(100, 238, 236);
  text-align: center;
  white-space: pre-line;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 10; /* Rectangle200の上に表示 */
  writing-mode: horizontal-tb;
}

/* 波線 */
.line-10 {
  position: absolute;
  left: 87px;
  top: 391px; /* HTMLファイルの位置に合わせる */
  width: 27px;
  height: 6px;
  z-index: 10; /* Rectangle200の上に表示 */
}

.rect-206 {
  position: absolute;
  left: 95px;
  top: 395px; /* HTMLファイルの位置に合わせる */
  width: 4px;
  height: 12px;
  background-color: rgb(197, 217, 232);
  border-radius: 5px;
  z-index: 10;
}

.rect-207 {
  position: absolute;
  left: 103px;
  top: 395px; /* HTMLファイルの位置に合わせる */
  width: 4px;
  height: 12px;
  background-color: rgb(197, 217, 232);
  border-radius: 5px;
  z-index: 10;
}

/* 小さい画面でのお知らせテキスト調整 */
@media (max-width: 1199px) {
  .text-announcements-title,
  .text-announcement-1,
  .text-announcement-2,
  .text-announcement-3,
  .text-announcement-4 {
    left: 2.5%;
    width: calc(100% - 5%);
  }
}
</style>
