<template>
  <div id="left-top-chart">

  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import {ref, onMounted} from "vue";
import {getAlarmLevel, getAlarmClassifyTop5} from '@/api/system/AlarmManage';

let chart, option;

onMounted(() => {
  // 获取dom元素
  const chartDom = document.getElementById('left-top-chart');
  // 初始化echarts
  chart = echarts.init(chartDom);
  option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        name: '告警等级统计',
        type: 'pie',
        radius: '50%',
        data: [
          {value: 1048, name: 'Search Engine'},
          {value: 735, name: 'Direct'},
          {value: 580, name: 'Email'},
          {value: 484, name: 'Union Ads'},
          {value: 300, name: 'Video Ads'}
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  getAlarmLevel().then((data) => {
    option.series[0].data = data["alarmLevel"];
    console.log()
    chart.setOption(option);
  })

})

</script>


<style scoped lang="less">
#left-top-chart {
  height: 100%;
  width: 100%;
}
</style>
