<template>
  <div class="effort-container">
    <!-- 共通ヘッダーコンポーネント -->
    <AppHeader 
      :current-page="currentPage" 
      @menu-click="handleMenuClick"
    />
    
    <!-- 工数実績のメインコンテンツ -->
    <div class="effort-content">
      <h1>工数実績画面</h1>
      <p>ここに工数実績の内容が表示されます</p>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'

export default {
  name: 'EffortScreen',
  components: {
    AppHeader
  },
  data() {
    return {
      currentPage: 'effort' // 現在のページ
    }
  },
  methods: {
    handleMenuClick(menuId) {
      this.currentPage = menuId
    }
  }
}
</script>

<style scoped>
.effort-container {
  position: relative;
  width: 100%;
  min-width: 1920px;
  min-height: 1080px;
  padding-top: 90px; /* ヘッダーの高さ分（90px）を確保 */
  overflow: hidden;
  background: linear-gradient(to bottom, rgb(27, 94, 157), rgb(176, 196, 223));
}

.effort-content {
  position: absolute;
  left: 50px;
  top: 120px; /* 150px - 93px (ヘッダー分の調整) */
  color: white;
}

h1 {
  font-size: 32px;
  margin-bottom: 20px;
}

p {
  font-size: 18px;
}
</style>

