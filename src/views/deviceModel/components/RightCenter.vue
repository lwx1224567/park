<!--展示设备基础告警统计，不同的设备展示的位置不一样-->
<template>
  <div class="analysis-card">
    <div class="chart-wrapper">
      <div ref="ringChart" class="chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, nextTick } from 'vue';
  import * as echarts from 'echarts';

  const ringChart = ref<HTMLElement | null>(null);
  let chartInstance: echarts.ECharts | null = null;

  const pieData = [
    { value: 60, name: '数据1', itemStyle: { color: '#00ffa2' } },
    { value: 10, name: '数据2', itemStyle: { color: '#2b47ff' } },
    { value: 20, name: '数据3', itemStyle: { color: '#00e1ff' } },
    { value: 20, name: '数据4', itemStyle: { color: '#ffcc00' } }
  ];

  const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);

  const initChart = () => {
    if (ringChart.value) {
      chartInstance = echarts.init(ringChart.value);
      const option = {
        series: [
          {
            type: 'gauge',
            center: ['50%', '50%'],
            radius: '95%',
            startAngle: 90,
            endAngle: -269.999,
            axisLine: { show: false },
            pointer: { show: false },
            axisTick: {
              distance: 0,
              length: 6,
              lineStyle: { color: '#1890FF', width: 2 }
            },
            splitLine: {
              distance: 0,
              length: 8,
              lineStyle: { color: '#1890FF', width: 3 }
            },
            axisLabel: { show: false },
            detail: { show: false },
            data: [{ value: 0 }]
          },
          {
            type: 'pie',
            radius: ['50%', '65%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 0,
              borderColor: '#062757',
              borderWidth: 2
            },
            emphasis:{
              scale: true,
              label:{
                show: true,
              },
              labelLine: {
                show: true
              }
            },
            label: {
              show: true,
              formatter: function(params) {
                return `{num|${params.value}}\n{name|${params.name}}`;
              },
              rich: {
                num: {
                  color: 'auto',
                  fontSize: 12,
                  fontWeight: 'bold'
                },
                name: {
                  color: '#fff',
                  fontSize: 12
                }
              },
              lineHeight: 20,
            },
            labelLine: {
              show: true,
              length: 20,
              length2: 30,
              lineStyle: function(params) {
                return { color: params.color };
              }
            },
            data: pieData
          },
          {
            type: 'pie',
            radius: [0, '50%'],
            center: ['50%', '50%'],
            silent: true,
            label: {
              show: true,
              position: 'center',
              formatter: `{val|${totalValue}}\n{name|数据}`,
              rich: {
                val: {
                  color: '#ffcc00',
                  fontSize: 14,
                  fontWeight: 'bold',
                  padding: [5, 0]
                },
                name: {
                  color: '#fff',
                  fontSize: 14
                }
              }
            },
            data: [{ value: 1 }],
            itemStyle: { color: 'transparent' }
          }
        ]
      };
      chartInstance.setOption(option);
    }
  };

  onMounted(() => {
    nextTick(() => {
      initChart();
    });
  });

  onUnmounted(() => {
    if (chartInstance) {
      chartInstance.dispose();
    }
  });
</script>

<style scoped>
  .analysis-card {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 10px 8px;
    box-sizing: border-box;
  }

  .chart-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chart {
    width: 100%;
    height: 100%;
  }
</style>
