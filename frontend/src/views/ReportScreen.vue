<template>
  <div class="report-container">
    <!-- 共通ヘッダーコンポーネント -->
    <AppHeader 
      :current-page="currentPage" 
      @menu-click="handleMenuClick"
    />
    
    <!-- レポートのメインコンテンツ -->
    <div class="report-content">
      <h1>レポート画面</h1>
      <p>ここにレポートの内容が表示されます</p>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'

export default {
  name: 'ReportScreen',
  components: {
    AppHeader
  },
  data() {
    return {
      currentPage: 'report' // 現在のページ
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
.report-container {
  position: relative;
  width: 100%;
  min-width: 1920px;
  min-height: 1080px;
  padding-top: 90px; 
  overflow: hidden;
  background: linear-gradient(to bottom, rgb(27, 94, 157), rgb(176, 196, 223));
}

.report-content {
  position: absolute;
  left: 50px;
  top: 120px; 
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

