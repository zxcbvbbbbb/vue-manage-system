<template>
  <div style="height: 100%" ref="echart" v-loading="config.loading" element-loading-text="加载中...">
    echart
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    config: Object,
    chartData: {
      type: Object,
      default() {
        return {
          xData: [],
          series: []
        }
      }
    },
    isAxisChart: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    options() {
      return this.isAxisChart ? this.axisOption : this.normalOption
    }
  },
  watch: {
    chartData: {
      handler: function() {
        this.initChart()
      },
      deep: true
    }
  },
  data() {
    return {
      ecahrt: null,
      axisOption: {
        legend: {
          textStyle: {
            color: '#333'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: {
            lineStyle: {
              color: '#17b3a3'
            }
          },
          axisLabel: {
            color: '#333'
          }
        },
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#17b3a3'
              }
            }
          }
        ],
        color: [
          '#2ec7c9',
          '#b6a2de',
          '#5ab1ef',
          '#ffb980',
          '#d87a80',
          '#8d98b3',
          '#e5cf0d',
          '#97b552',
          '#95706d',
          '#dc69aa',
          '#07a2a4',
          '#9a7fd1',
          '#588dd5',
          '#f5994e',
          '#c05050',
          '#59678c',
          '#c9ab00',
          '#7eb00a',
          '#6f5553',
          '#c14089'
        ],
        series: []
      },
      normalOption: {
        title: {
          text: '在中国租个房子有多贵？',
          subtext: '市中心一室月租费',
          subtextStyle: {
            color: 'rgba(255, 0, 0, 1)',
            fontSize: 14,
            fontFamily: 'Courier New'
          }
        },
        grid: {
          top: 100
        },
        angleAxis: {
          type: 'category',
          data: []
        },
        tooltip: {
          show: true
        },
        radiusAxis: {},
        polar: {},
        // color: ['#0f78f4', '#dd536b', '#9462e5', '#a6a6a6', '#e1bb22', '#39c362', '#3ed1cf'],
        color: ['#87CEFA'],
        series: []
      }
    }
  },
  methods: {
    initChart() {
      this.initChartData()
      if (this.echart) {
        this.echart.setOption(this.options)
      } else {
        this.echart = echarts.init(this.$refs.echart)
        this.echart.setOption(this.options)
      }
    },
    initChartData() {
      if (this.isAxisChart) {
        this.axisOption.xAxis.data = this.chartData.xData
        this.axisOption.series = this.chartData.series
      } else {
        this.normalOption.series = this.chartData.series
        this.normalOption.angleAxis.data = this.chartData.angleAxis
        this.normalOption.title.text = this.chartData.name
        this.normalOption.title.subtext = this.chartData.info
        if (this.chartData.info[0] === '正常') {
          this.normalOption.title.subtextStyle.color = 'rgba(26, 169, 105, 1)'
          this.normalOption.title.subtextStyle.fontSize = 15
        }
        console.log('-->this.chartData.series', this.chartData.series)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
