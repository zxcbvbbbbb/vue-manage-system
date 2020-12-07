<template>
  <div class="manage">
    <el-card shadow="hover" style="height:100%" v-loading="config.loading" element-loading-text="执行中..."></el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        keyword: ''
      },
      formLabel: [
        {
          model: 'keyword',
          label: ''
        }
      ],
      config: {
        loading: false
      }
    }
  },
  methods: {
    export_znsms_execl() {
      this.config.loading = true
      this.$http
        .get('/znsms/')
        .then(res => {
          if (res.data.code === 1) {
            console.log('---> export znsms excel')
            this.config.loading = false
            this.$elMessage('数据导出路径D:/znsms_put.xlsx', 'success')
          } else {
            this.$elMessage(res.data.msg, 'warning')
          }
        })
        .catch(err => {
          console.log('此处应有err')
        })
    }
  },
  created() {
    this.export_znsms_execl()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
</style>
