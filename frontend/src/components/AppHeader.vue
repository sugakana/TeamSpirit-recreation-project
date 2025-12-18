<template>
  <header class="app-header">
    <!-- Rectangle 191 - ヘッダー背景 -->
    <div class="rect-191"></div>
    
    <!-- Rectangle 415 - 青い線 -->
    <div class="rect-415"></div>
    
    <!-- Rectangle 175 - 検索バー -->
    <div class="rect-175" :style="searchBarStyle">
      <!-- TEXT: 検索 -->
      <span class="text-search" :style="searchTextStyle">検索</span>
    </div>
    
    <!-- ロゴ（Ellipse 11-16） -->
    <div class="ellipse-11"></div>
    <div class="ellipse-12"></div>
    <div class="ellipse-13"></div>
    <div class="ellipse-14"></div>
    <div class="ellipse-15"></div>
    <div class="ellipse-16"></div>
    
    <!-- Rectangle 187 - お気に入りボタン -->
    <div class="rect-187"></div>
    
    <!-- Star 1 -->
    <svg class="star-1" viewBox="0 0 15.342482566833496 15.342482566833496">
      <path d="M 7.671241283416748 0 L 9.358911365770432 5.369834898391723 L 15.342482566833496 5.369834898391723 L 10.491785601531532 8.68264766844177 L 12.179455683885216 14.052482566833493 L 7.671241283416748 10.739669796783446 L 3.16302688294828 14.052482566833493 L 4.850696965301964 8.68264766844177 L 0 5.369834898391723 L 5.983571201063064 5.369834898391723 Z" fill="rgb(145, 145, 145)"/>
    </svg>
    
    <!-- Line 6 -->
    <div class="line-6"></div>
    
    <!-- Polygon 4 -->
    <svg class="polygon-4" viewBox="0 0 8.249191284179688 5.916497230529785">
      <g transform="rotate(-179.8319352989513 4.124595642089844 2.9582486152648925)">
        <path d="M 4.124595642089844 0 L 8.249191284179688 5.916497230529785 L 0 5.916497230529785 Z" fill="rgb(145, 145, 145)"/>
      </g>
    </svg>
    
    <!-- Rectangle 188 - 追加ボタン -->
    <div class="rect-188"></div>
    
    <!-- TEXT: ＋ -->
    <span class="text-plus">＋</span>
    
    <!-- Polygon 5 - 通知ベル -->
    <svg class="polygon-5" viewBox="0 0 34.22553634643555 32.59574890136719">
      <path d="M 17.112768173217775 0 L 34.22553634643555 32.59574890136719 L 0 32.59574890136719 Z" fill="rgb(145, 145, 145)"/>
    </svg>
    
    <!-- Polygon 7 -->
    <svg class="polygon-7" viewBox="0 0 11.408513069152832 13.038299560546875">
      <path d="M 5.704256534576416 0 L 11.408513069152832 13.038299560546875 L 0 13.038299560546875 Z" fill="rgb(145, 145, 145)" stroke="rgb(255, 255, 255)" stroke-width="1.6297874450683594"/>
    </svg>
    
    <!-- Polygon 8 -->
    <svg class="polygon-8" viewBox="0 0 14.66808795928955 14.66808795928955">
      <path d="M 7.334043979644775 0 L 14.66808795928955 14.66808795928955 L 0 14.66808795928955 Z" fill="rgb(145, 145, 145)" stroke="rgb(255, 255, 255)" stroke-width="1.6297874450683594"/>
    </svg>
    
    <!-- Rectangle 189 -->
    <div class="rect-189"></div>
    
    <!-- VECTOR: Line 7 -->
    <svg class="line-7" viewBox="0 0 6.5191497802734375 1.6297874450683594" transform="rotate(-90)" transform-origin="center">
      <path d="M 0 1.6297874450683594 L 3.2595748901367188 1.6297874450683594 L 4.889362335205078 0 L 6.5191497802734375 0" stroke="rgb(255, 255, 255)" stroke-width="1.6297874450683594" fill="none"/>
    </svg>
    
    <!-- TEXT: ？ -->
    <span class="text-question">？</span>
    
    <!-- Rectangle 190 -->
    <div class="rect-190"></div>
    
    <!-- VECTOR: Ellipse 17 - 設定アイコン -->
    <svg class="ellipse-17" viewBox="0 0 14.162758827209473 17.112897872924805">
      <path d="M 14.162758827209473 13.900216347169794 C 14.162758827209473 17.73337082050256 10.668605905887496 17.06885073189026 7.086321562371138 17.06885073189026 C 2.958676279864364 17.06885073189026 0.6004959508203215 17.068851013269725 0.01099065517474357 15.484676480296896 C 0.01099065517474357 11.651522006964129 -0.5895192239286535 0.5900955025186848 7.086321562371138 3.155821140524344e-10 C 14.162758827209473 0.5827466095834795 14.162758827209473 10.067061873837027 14.162758827209473 13.900216347169794 Z" fill="rgb(145, 145, 145)"/>
    </svg>
    
    <!-- Ellipse 18 -->
    <div class="ellipse-18"></div>
    
    <!-- Ellipse 5 - ユーザーアイコン外側 -->
    <div class="ellipse-5"></div>
    
    <!-- Ellipse 6 - ユーザーアイコン内側 -->
    <div class="ellipse-6"></div>
    
    <!-- VECTOR: Ellipse 9 - ユーザー顔 -->
    <svg class="ellipse-9" viewBox="0 0 18.24166488647461 23.547868728637695">
      <path d="M 18.19546012824422 8.664351645652648 C 18.19546012824422 13.480440452884796 14.206365483275217 23.547868728637695 9.405398243396792 23.547868728637695 C 4.604431003518368 23.547868728637695 0.07472661124637638 14.257616093829245 0.07472661124637638 9.441527286597097 C -0.6497277870835096 1.9669846637881019 4.014448622516429 0 8.815415862394854 0 C 13.616383102273279 0 18.785555623788742 1.1242425484873504 18.19546012824422 8.664351645652648 Z" fill="rgb(255, 255, 255)"/>
    </svg>
    
    <!-- Ellipse 10 - ユーザー目 -->
    <div class="ellipse-10"></div>
    
    <!-- TEXT: TeamSpirit (ナビゲーション) -->
    <span class="text-teamspirit-nav">TeamSpirit</span>
    
    <!-- ナビゲーションメニューの背景（ダークブルーセクション） -->
    <div class="nav-menu-container">
      <!-- ナビゲーションメニュー -->
      <div 
        v-for="menu in navigationMenus" 
        :key="menu.id"
        class="nav-menu-item"
        :class="{ 
          active: currentPage === menu.id,
          hovered: hoveredMenu === menu.id
        }"
        :style="{
          left: getMenuPosition(menu).left + 'px',
          top: getMenuPosition(menu).top + 'px'
        }"
        @click="handleMenuClick(menu.id)"
        @mouseenter="hoveredMenu = menu.id"
        @mouseleave="hoveredMenu = null"
      >
        <!-- 背景Rectangle -->
        <div 
          class="nav-menu-bg"
          :style="{
            left: '0px',
            top: '0px',
            width: getMenuPosition(menu).width + 'px',
            height: getMenuPosition(menu).height + 'px'
          }"
        >
          <!-- インジケーター（アクティブ時のみ表示、Rectangle67の上に青い線） -->
          <div 
            v-if="currentPage === menu.id"
            class="nav-menu-indicator"
            :style="{
              left: '-1px',
              top: '-4px',
              width: (getMenuPosition(menu).width + 2) + 'px',
              height: '4px'
            }"
          ></div>
          
          <!-- テキスト -->
          <span class="nav-menu-text">{{ menu.label }}</span>
        </div>
      </div>
    </div>
    
    <!-- 通知バッジ -->
    <div class="ellipse-8"></div>
    <div class="ellipse-7"></div>
    
    <!-- GROUP: Group 3 - メニューアイコン -->
    <div class="group-3">
      <div class="ellipse-27"></div>
      <div class="ellipse-28"></div>
      <div class="ellipse-29"></div>
      <div class="ellipse-30"></div>
      <div class="ellipse-31"></div>
      <div class="ellipse-32"></div>
      <div class="ellipse-33"></div>
      <div class="ellipse-34"></div>
      <div class="ellipse-35"></div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    // 現在のページを親コンポーネントから受け取る
    currentPage: {
      type: String,
      default: 'home'
    }
  },
  data() {
    return {
      hoveredMenu: null, // ホバー中のメニュー
      isSmallScreen: false, // 小さい画面かどうか
      navigationMenus: [
        {
          id: 'home',
          label: 'ホーム',
          route: '/home',
          position: {
            left: 211,
            top: 26,
            width: 78,
            height: 39,
            textLeft: 226,
            textTop: 40
          },
          positionSmall: {
            left: 211,
            top: 26,
            width: 78,
            height: 39,
            textLeft: 226,
            textTop: 40
          }
        },
        {
          id: 'timesheet',
          label: '勤務表',
          route: '/timesheet',
          position: {
            left: 289,
            top: 26,
            width: 70,
            height: 39,
            textLeft: 306,
            textTop: 40
          },
          positionSmall: {
            left: 289,
            top: 26,
            width: 70,
            height: 39,
            textLeft: 306,
            textTop: 40
          }
        },
        {
          id: 'effort',
          label: '工数実績',
          route: '/effort',
          position: {
            left: 359,
            top: 26,
            width: 88,
            height: 39,
            textLeft: 381,
            textTop: 40
          },
          positionSmall: {
            left: 359,
            top: 26,
            width: 88,
            height: 39,
            textLeft: 381,
            textTop: 40
          }
        },
        {
          id: 'report',
          label: 'レポート',
          route: '/report',
          position: {
            left: 447,
            top: 26,
            width: 78,
            height: 39,
            textLeft: 475,
            textTop: 40
          },
          positionSmall: {
            left: 447,
            top: 26,
            width: 78,
            height: 39,
            textLeft: 475,
            textTop: 40
          }
        }
      ]
    }
  },
  computed: {
    searchBarConfig() {
      if (this.isSmallScreen) {
        return {
          left: 'auto',
          right: '120px',
          top: '12px',
          width: 'min(300px, calc(100% - 200px))',
          height: '28px',
          leftValue: null // 右寄せの場合はnull
        }
      }
      return {
        left: '746px',
        top: '5px',
        width: '445px',
        height: '32px',
        leftValue: 746 // 検索ラベルの位置計算用
      }
    },
    searchBarStyle() {
      const config = this.searchBarConfig
      const style = {
        top: config.top,
        width: config.width,
        height: config.height
      }
      if (config.left) {
        style.left = config.left
      }
      if (config.right) {
        style.right = config.right
      }
      return style
    },
    searchTextStyle() {
      if (this.isSmallScreen) {
        return {
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '13px'
        }
      }
      // 検索バー内で相対的に配置
      return {
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '14.942859649658203px'
      }
    }
  },
  mounted() {
    this.checkScreenSize()
    window.addEventListener('resize', this.checkScreenSize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreenSize)
  },
  methods: {
    checkScreenSize() {
      this.isSmallScreen = window.innerWidth <= 1199
    },
    getMenuPosition(menu) {
      if (this.isSmallScreen) {
        return menu.positionSmall
      }

      return menu.position
    },
    handleMenuClick(menuId) {
      // 親コンポーネントにメニュークリックイベントを通知
      this.$emit('menu-click', menuId)
      
      // ルーティング処理
      const menu = this.navigationMenus.find(m => m.id === menuId)
      if (menu && menu.route) {
        this.$router.push(menu.route)
      }
    }
  }
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0px;
  left: 0;
  width: 100%;
  height: 90px;
  z-index: 1000;
}

/* 画面幅が1200px未満の場合、ヘッダーもレスポンシブに */
@media (max-width: 1199px) {
  .app-header {
    width: 100vw;
    max-width: 100vw;
    left: 0;
  }
}

/* ヘッダー背景 */
.rect-191 {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 87px;
  background-color: rgb(255, 255, 255);
}

/* Rectangle 415 - 青い線 */
.rect-415 {
  position: absolute;
  left: 0px;
  top: 87px;
  width: 100%;
  height: 3px;
  background-color: #0070D2;
}

/* 検索バー */
.rect-175 {
  position: absolute;
  background-color: rgb(255, 254, 254);
  border: 1.3714287281036377px solid rgb(0, 0, 0);
}

.text-search {
  position: absolute;
  width: auto;
  height: auto;
  font-family: Arial;
  color: rgb(0, 0, 0);
  pointer-events: none;
  white-space: nowrap;
}

/* ロゴ（Ellipse 11-16） */
.ellipse-11 {
  position: absolute;
  left: 20.5px;
  top: 3px;
  width: 23px;
  height: 20px;
  background-color: rgb(0, 161, 224);
  border-radius: 50%;
}

.ellipse-12 {
  position: absolute;
  left: 36px;
  top: 4px;
  width: 20px;
  height: 17px;
  background-color: rgb(0, 161, 224);
  border-radius: 50%;
}

.ellipse-13 {
  position: absolute;
  left: 47px;
  top: 8px;
  width: 26px;
  height: 26px;
  background-color: rgb(0, 161, 224);
  border-radius: 50%;
}

.ellipse-14 {
  position: absolute;
  left: 38px;
  top: 19px;
  width: 21.5px;
  height: 18.5px;
  background-color: rgb(0, 161, 224);
  border-radius: 50%;
}

.ellipse-15 {
  position: absolute;
  left: 23px;
  top: 17px;
  width: 26px;
  height: 26px;
  background-color: rgb(0, 161, 224);
  border-radius: 50%;
}

.ellipse-16 {
  position: absolute;
  left: 16px;
  top: 15px;
  width: 21.5px;
  height: 21.5px;
  background-color: rgb(0, 161, 224);
  border-radius: 50%;
}

/* お気に入りボタン */
.rect-187 {
  position: absolute;
  right: calc(100% - 1619.2947998046875px - 48.3878288269043px);
  top: 5.72076416015625px;
  width: 48.3878288269043px;
  height: 29.50477409362793px;
  border: 1.180190920829773px solid rgb(145, 145, 145);
  border-radius: 5.900954723358154px;
  background-color: transparent;
}

.star-1 {
  position: absolute;
  right: calc(100% - 1627.5560302734375px - 15.342482566833496px);
  top: 12.801910400390625px;
  width: 15.342482566833496px;
  height: 15.342482566833496px;
}

.line-6 {
  position: absolute;
  right: calc(100% - 1646.4390869140625px - 1.180190920829773px);
  top: 5.72076416015625px;
  width: 1.180190920829773px;
  height: 29.50477409362793px;
  background-color: rgb(145, 145, 145);
}

.polygon-4 {
  position: absolute;
  right: calc(100% - 1655px - 8.249191284179688px);
  top: 17.51490306854248px;
  width: 8.249191284179688px;
  height: 5.916497230529785px;
}

.rect-188 {
  position: absolute;
  right: calc(100% - 1686.565673828125px - 24.78400993347168px);
  top: 9.261336326599121px;
  width: 24.78400993347168px;
  height: 23.603818893432617px;
  background-color: rgb(145, 145, 145);
  border-radius: 5.900954723358154px;
}

.text-plus {
  position: absolute;
  right: calc(100% - 1690.106201171875px - 18.883054733276367px);
  top: 7px;
  width: 18.883054733276367px;
  height: 18.883054733276367px;
  font-size: 17.702863693237305px;
  font-family: Arial;
  color: rgb(255, 255, 255);
}

.polygon-5 {
  position: absolute;
  right: calc(100% - 1725.511962890625px - 34.22553634643555px);
  top: 8.081145286560059px;
  width: 34.22553634643555px;
  height: 32.59574890136719px;
}

.polygon-7 {
  position: absolute;
  right: calc(100% - 1740.18017578125px - 11.408513069152832px);
  top: 16.23011016845703px;
  width: 11.408513069152832px;
  height: 13.038299560546875px;
}

.polygon-8 {
  position: absolute;
  right: calc(100% - 1733.660888671875px - 14.66808795928955px);
  top: 14.600433349609375px;
  width: 14.66808795928955px;
  height: 14.66808795928955px;
}

.rect-189 {
  position: absolute;
  right: calc(100% - 1730.4010009765625px - 24.44681167602539px);
  top: 24.37907600402832px;
  width: 24.44681167602539px;
  height: 1.6297874450683594px;
  background-color: rgb(255, 255, 255);
}

.line-7 {
  position: absolute;
  right: calc(100% - 1744.25439453125px - 6.5191497802734375px);
  top: 26.008752822875977px;
  width: 6.5191497802734375px;
  height: 1.6297874450683594px;
}

.text-question {
  position: absolute;
  right: calc(100% - 1772px - 33.045345306396484px);
  top: 0px;
  width: 33.045345306396484px;
  height: 35.918853759765625px;
  font-size: 25.861574172973633px;
  font-family: Arial;
  color: rgb(145, 145, 145);
}

.rect-190 {
  position: absolute;
  right: calc(100% - 1811.6658935546875px - 23.603818893432617px);
  top: 24.603818893432617px;
  width: 23.603818893432617px;
  height: 2.360381841659546px;
  background-color: rgb(145, 145, 145);
}

.ellipse-17 {
  position: absolute;
  right: calc(100% - 1816.3861083984375px - 14.162758827209473px);
  top: 9.851431846618652px;
  width: 14.162758827209473px;
  height: 17.112897872924805px;
}

.ellipse-18 {
  position: absolute;
  right: calc(100% - 1819.92724609375px - 7.081145763397217px);
  top: 28.14439010620117px;
  width: 7.081145763397217px;
  height: 3.5405728816986084px;
  background-color: rgb(145, 145, 145);
  border-radius: 50%;
}

.ellipse-5 {
  position: absolute;
  right: calc(100% - 1858.87353515625px - 40.12649154663086px);
  top: 1px;
  width: 40.12649154663086px;
  height: 41.30668258666992px;
  background-color: rgb(147, 147, 147);
  border-radius: 50%;
}

.ellipse-6 {
  position: absolute;
  right: calc(100% - 1860.0537109375px - 37.766109466552734px);
  top: 2.1801910400390625px;
  width: 37.766109466552734px;
  height: 38.9463005065918px;
  background-color: rgb(85, 104, 136);
  border-radius: 50%;
}

.ellipse-9 {
  position: absolute;
  right: calc(100% - 1869.531005859375px - 18.24166488647461px);
  top: 15.162290573120117px;
  width: 18.24166488647461px;
  height: 23.547868728637695px;
}

.ellipse-10 {
  position: absolute;
  right: calc(100% - 1874.2159423828125px - 9.441527366638184px);
  top: 17.522672653198242px;
  width: 9.441527366638184px;
  height: 7.081145763397217px;
  background-color: rgb(85, 104, 136);
  border-radius: 50%;
}

/* ナビゲーション */
.text-teamspirit-nav {
  position: absolute;
  left: 89px;
  top: 60px;
  width: 135px;
  height: 22px;
  font-size: 19px; /* 少し小さく */
  font-family: Arial;
  color: rgb(51, 51, 51);
}

/* ナビゲーションメニューのコンテナ */
.nav-menu-container {
  position: absolute;
  left: 0px;
  top: 22px;
  width: 100%;
  height: 39px;
  background-color: transparent;
  z-index: 998;
}

/* ナビゲーションメニューアイテム */
.nav-menu-item {
  position: absolute;
  cursor: pointer;
  z-index: 1000;
}

.nav-menu-bg {
  position: absolute;
  background-color: transparent;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  z-index: 0; /* Rectangle67のz-indexを明示的に設定 */
}

.nav-menu-item.active .nav-menu-bg {
  background-color: rgb(229, 240, 250);
}

.nav-menu-item.hovered .nav-menu-bg {
  background-color: rgb(230, 239, 247);
}

/* アクティブ状態のメニューにホバーしても、アクティブ背景色を維持 */
.nav-menu-item.active.hovered .nav-menu-bg {
  background-color: rgb(229, 240, 250);
}

.nav-menu-indicator {
  position: absolute;
  background-color: rgb(0, 112, 210);
  border-radius: 0;
  z-index: 1; /* Rectangle67の上に配置 */
}

.nav-menu-text {
  position: absolute;
  width: auto;
  height: auto;
  font-size: 13px; /* 少し小さく */
  font-family: Arial;
  color: rgb(29, 29, 29);
  pointer-events: none;
  white-space: nowrap;
  line-height: 1;
  left: 50%;
  top: 14px; /* Rectangle67の上から14px下に配置（26px + 14px = 40px）ラベル位置を維持 */
  transform: translateX(-50%);
  z-index: 1000; /* ラベルをRectangle68より上に配置 */
}

/* 通知バッジ */
.ellipse-8 {
  position: absolute;
  right: calc(100% - 1867.1348876953125px - 4.720763683319092px);
  top: 10.441527366638184px;
  width: 4.720763683319092px;
  height: 4.720763683319092px;
  background-color: rgb(255, 255, 255);
  border-radius: 50%;
}

.ellipse-7 {
  position: absolute;
  right: calc(100% - 1886.0179443359375px - 4.720763683319092px);
  top: 10.441527366638184px;
  width: 4.720763683319092px;
  height: 4.720763683319092px;
  background-color: rgb(255, 255, 255);
  border-radius: 50%;
}

/* メニューアイコン */
.group-3 {
  position: absolute;
  left: 28px;
  top: 60px;
  width: 22px; /* 少し小さく */
  height: 22px; /* 少し小さく */
}

.ellipse-27 {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 6px; /* 少し小さく */
  height: 6px; /* 少し小さく */
  background-color: rgb(82, 80, 80);
  border-radius: 50%;
}

.ellipse-28 {
  position: absolute;
  left: 8px; /* 間隔を調整 */
  top: 0px;
  width: 6px; /* 少し小さく */
  height: 6px; /* 少し小さく */
  background-color: rgb(82, 80, 80);
  border-radius: 50%;
}

.ellipse-29 {
  position: absolute;
  left: 16px; /* 間隔を調整 */
  top: 0px;
  width: 6px; /* 少し小さく */
  height: 6px; /* 少し小さく */
  background-color: rgb(82, 80, 80);
  border-radius: 50%;
}

.ellipse-30 {
  position: absolute;
  left: 0px;
  top: 8px; /* 間隔を調整 */
  width: 6px; /* 少し小さく */
  height: 6px; /* 少し小さく */
  background-color: rgb(82, 80, 80);
  border-radius: 50%;
}

.ellipse-31 {
  position: absolute;
  left: 8px; /* 間隔を調整 */
  top: 8px; /* 間隔を調整 */
  width: 6px; /* 少し小さく */
  height: 6px; /* 少し小さく */
  background-color: rgb(82, 80, 80);
  border-radius: 50%;
}

.ellipse-32 {
  position: absolute;
  left: 16px; /* 間隔を調整 */
  top: 8px; /* 間隔を調整 */
  width: 6px; /* 少し小さく */
  height: 6px; /* 少し小さく */
  background-color: rgb(82, 80, 80);
  border-radius: 50%;
}

.ellipse-33 {
  position: absolute;
  left: 0px;
  top: 16px; /* 間隔を調整 */
  width: 6px; /* 少し小さく */
  height: 6px; /* 少し小さく */
  background-color: rgb(82, 80, 80);
  border-radius: 50%;
}

.ellipse-34 {
  position: absolute;
  left: 8px; /* 間隔を調整 */
  top: 16px; /* 間隔を調整 */
  width: 6px; /* 少し小さく */
  height: 6px; /* 少し小さく */
  background-color: rgb(82, 80, 80);
  border-radius: 50%;
}

.ellipse-35 {
  position: absolute;
  left: 16px; /* 間隔を調整 */
  top: 16px; /* 間隔を調整 */
  width: 6px; /* 少し小さく */
  height: 6px; /* 少し小さく */
  background-color: rgb(82, 80, 80);
  border-radius: 50%;
}

/* レスポンシブ対応: 小さい画面でのコンパクトレイアウト */
@media (max-width: 1199px) {
  /* TeamSpiritテキストの位置調整 */
  .text-teamspirit-nav {
    top: 67px;
  }
  
  /* メニューアイコンの位置調整 */
  .group-3 {
    top: 67px;
  }
}
</style>

