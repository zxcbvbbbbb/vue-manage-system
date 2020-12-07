<template>
  <div class="manage">
    <!-- <div class="manage-header"><common-form></common-form></div> -->
    <!-- <div class="manage-content"><common-content></common-content></div> -->
    <!-- <el-row>
      <el-table :data="tableData">
        <el-table-column v-for="(val, key) in tableLabel" :key="key" :prop="key" :label="val"></el-table-column>
      </el-table>
    </el-row> -->
    <el-row :gutter="12">
      <el-col :span="12">
        <el-card shadow="hover" class="url">
          <cities-echart style="height: 430px" :chartData="echartData.urls" :isAxisChart="false"></cities-echart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="storage">
          <cities-echart style="height: 430px" :chartData="echartData.urls" :isAxisChart="false"></cities-echart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import commonForm from '../../components/commonForm'
import commonContent from '../../components/commonContent'
import CitiesEchart from '../../components/CitiesEchart'
import axios from 'axios'
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
      echartData: {
        urls: {
          xData: [],
          // angleAxis: { data: [] },
          angleAxis: [],
          series: [],
          error: []
        }
      }
    }
  },
  methods: {
    getData(url) {
      axios.get(url).then(res => {
        const name = res.data.name
        const urlsData = res.data.data
        const cities = res.data.cities
        // this.tableData = res.data.data
        console.log('-->this.urlsData', urlsData)
        console.log('-->cities', cities)
        // urlsData.map(function(d) {
        //   this.echartData
        // })
        urlsData.forEach(key => {
          if (key.length == 3) {
            console.log('--> key length', key)
            this.echartData.urls.error.push(key[2])
          }
        })
        this.echartData.urls.angleAxis = cities
        this.echartData.urls.name = name
        this.echartData.urls.series.push(
          {
            type: 'bar',
            itemStyle: {
              color: 'transparent'
            },
            data: urlsData.map(function(d) {
              return d[0]
            }),
            coordinateSystem: 'polar',
            stack: '最大最小值',
            silent: true
          },
          {
            type: 'bar',
            data: urlsData.map(function(d) {
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
