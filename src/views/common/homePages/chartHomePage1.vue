<template>
  <el-card shadow="never">
    <div id="chartHomePage1" style="width:100%;height: 500px;margin: 0 auto"></div>
  </el-card>
</template>
<script>
  import echarts from 'echarts'
  export default {
    data () {
      return {
        chartHomePage1: null
      }
    },
    methods: {
      init (todo, done) {
        document.getElementById('chartHomePage1').removeAttribute('_echarts_instance_');
        this.drawHomePage1(todo, done)
      },
      drawHomePage1 (todo, done) {
        this.chartHomePage1 = echarts.init(document.getElementById('chartHomePage1'))
        // var value = 83;
        var option = {
          backgroundColor: '#fff',
          title: [
            {
              text: '累计待审核备案数量',
              x: 'center',
              textStyle: {
                fontSize: 18
              }
            },
            {
              text: `${todo} 个`,
              x: 'center',
              y: '8%',
              subtext: '',
              subtextStyle: {
                fontSize: 14
              },
              textStyle: {
                fontSize: 28
              }
            }
          ],
          tooltip: {},
          // animationDurationUpdate: function (idx) {
          //   // 越往后的数据延迟越大
          //   return idx * 100;
          // },
          animationEasingUpdate: 'bounceIn',
          color: ['#fff', '#fff', '#fff'],
          series: [{
            type: 'graph',
            layout: 'force',
            force: {
              repulsion: 500,
              edgeLength: 10
            },
            roam: false,
            label: {
              normal: {
                show: true,
                fontSize: 20
              }
            },
            data: [
              {
                'name': '已审核',
                'value': done,
                'symbolSize': 80,
                'draggable': true,
                'itemStyle': {
                  'normal': {
                    'borderColor': '#ccc',
                    'borderWidth': 4,
                    'shadowBlur': 100,
                    'shadowColor': '#ccc',
                    'color': '#ccc'
                  }
                }
              },
              {
                'name': '待审核',
                'value': todo,
                'symbolSize': 160,
                'draggable': true,
                'itemStyle': {
                  'normal': {
                    'borderColor': 'rgb(27, 94, 93)',
                    'borderWidth': 4,
                    'shadowBlur': 100,
                    'shadowColor': 'rgb(27, 94, 93)',
                    'color': 'rgb(27, 94, 93)'
                  }
                }
              }]
          }]
        }
        this.chartHomePage1.setOption(option, true)
        window.addEventListener('resize', () => {
          this.chartHomePage1.resize()
        })
        var _this = this
        this.chartHomePage1.on('click', function (params) {
          if (params.dataIndex === 1) {
            _this.$router.push({name: 'todoList', params: {type: 'todo'}})
          } else {
            _this.$router.push({name: 'todoList', params: {type: 'done'}})
          }
        })
      }
    }
  }
</script>
