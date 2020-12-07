<template>
  <div class="manage">
    <!-- <el-row>
      <el-table :data="tableData">
        <el-table-column v-for="(val, key) in tableLabel" :key="key" :prop="key" :label="val"></el-table-column>
      </el-table>
    </el-row> -->
    <el-row :gutter="12">
      <el-col :span="12">
        <el-card shadow="hover" class="url">
          <cities-echart :config="config" style="height: 430px" :chartData="echartData.urls" :isAxisChart="false"></cities-echart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="storage">
          <cities-echart :config="config" style="height: 430px" :chartData="echartData.storages" :isAxisChart="false"></cities-echart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CitiesEchart from '../../components/CitiesEchart'
export default {
  // components: {
  //   commonForm,
  //   commonContent
  // }
  components: {
    CitiesEchart
  },
  data() {
    return {
      // tableLabel: {
      //   sno: '学号',
      //   name: '姓名',
      //   gender: '性别',
      //   birthday: '生日',
      //   mobile: '手机号',
      //   email: '邮箱',
      //   address: '住址',
      //   image: '头像'
      // }
      config: {
        loading: false
      },
      echartData: {
        urls: {
          xData: [],
          // angleAxis: { data: [] },
          angleAxis: [],
          series: [],
          info: []
        },
        storages: {
          xData: [],
          angleAxis: [],
          series: [],
          info: []
        }
      }
    }
  },
  methods: {
    getData(url) {
      this.config.loading = true
      this.$http.get(url).then(res => {
        const urlsData = res.data.data.urlsData
        const urlsState = urlsData.urlsState
        const cities = urlsData.cities
        const name = urlsData.name
        this.config.loading = false
        console.log('-->this.urlsData', urlsData)
        console.log('-->cities', cities)
        // urlsData.map(function(d) {
        //   this.echartData
        // })
        urlsState.forEach(key => {
          if (key.length == 3) {
            this.echartData.urls.info.push(key[2] + '\n')
          }
        })
        console.log('-->urls info', this.echartData.urls.info)
        if (this.echartData.urls.info.length === 0) {
          this.echartData.urls.info.push('正常')
        }
        this.echartData.urls.angleAxis = cities
        this.echartData.urls.name = name
        this.echartData.urls.series.push(
          {
            type: 'bar',
            itemStyle: {
              color: 'transparent'
            },
            data: urlsState.map(function(d) {
              return d[0]
            }),
            coordinateSystem: 'polar',
            stack: '最大最小值',
            silent: true
          },
          {
            type: 'bar',
            data: urlsState.map(function(d) {
              return d[1] - d[0]
            }),
            coordinateSystem: 'polar',
            stack: '最大最小值'
          }
        )
        const storagesData = res.data.data.storagesData
        const storagesState = storagesData.storagesState
        const names = storagesData.names
        const s_name = storagesData.s_name
        console.log('-->this.storagesData', storagesData)
        console.log('-->names', names)
        storagesState.forEach(key => {
          if (key.length == 3) {
            this.echartData.storages.info.push(key[2] + '\n')
          }
        })
        console.log('-->new info', this.echartData.storages.info.length)
        if (this.echartData.storages.info.length === 0) {
          this.echartData.storages.info.push('正常')
        }
        this.echartData.storages.angleAxis = names
        this.echartData.storages.name = s_name
        this.echartData.storages.series.push(
          {
            type: 'bar',
            itemStyle: {
              color: 'transparent'
            },
            data: storagesState.map(function(d) {
              return d[0]
            }),
            coordinateSystem: 'polar',
            stack: '最大最小值',
            silent: true
          },
          {
            type: 'bar',
            data: storagesState.map(function(d) {
              return d[1] - d[0]
            }),
            coordinateSystem: 'polar',
            stack: '最大最小值'
          }
        )
      })
    }
  },
  created() {
    this.getData('/urls/')
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
</style>
