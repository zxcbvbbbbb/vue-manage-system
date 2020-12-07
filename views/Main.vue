<template>
  <el-container style="height:100%">
    <el-aside width="auto"><common-aside></common-aside></el-aside>
    <el-container>
      <el-header><common-header></common-header></el-header>
      <common-tab></common-tab>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import commonHeader from '../components/commonHeader'
import commonAside from '../components/commonAside'
import commonTab from '../components/commonTab'
export default {
  components: {
    commonAside,
    commonHeader,
    commonTab
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  background: #333;
}
.el-main {
  padding-top: 0;
}
</style>
