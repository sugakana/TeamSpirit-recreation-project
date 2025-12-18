<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: rgb(255, 255, 255);
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  display: block;
  background-color: rgb(255, 255, 255);
}

/* 画面幅が1200px未満の場合、横スクロールを防止 */
@media (max-width: 1199px) {
  html {
    width: 100%;
    overflow-x: hidden;
  }
  
  body {
    overflow-x: hidden;
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0;
    padding: 0;
  }
  
  #app {
    overflow-x: hidden;
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0;
    padding: 0;
  }
}
</style>


