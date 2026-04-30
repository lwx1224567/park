<template>
  <div class="energy-electricity">
    <div class="header">
      <h3></h3>
      <div class="tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.key"
          :class="['tab', { active: activeTab === tab.key }]"
          @click="switchTab(tab.key)"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>
    
    <div class="chart-container">
      <v-chart
        autoresize
        :option="chartOption"
        style="width: 100%; height: 100%;"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { useParkStore } from '@/store/modules/park'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 使用 store
const parkStore = useParkStore()

// 标签页配置
const tabs = [
  { key: 'day', label: '日' },
  { key: 'week', label: '周' },
  { key: 'month', label: '月' }
]

// 当前激活的标签页
const activeTab = ref('week')

// 切换标签页
const switchTab = (tabKey: string) => {
  activeTab.value = tabKey
}

// 计算图表配置
const chartOption = computed(() => {
  let xAxisData: string[] = []
  let seriesData: number[] = []
  let title = ''

  // 从 store 获取数据
  const gasData = parkStore.getGasTrend

  switch (activeTab.value) {
    case 'day':
      xAxisData = gasData.dayList?.map((item: any) => item.day) || []
      seriesData = gasData.dayList?.map((item: any) => parseFloat(item.value)) || []
      title = '日天然气统计'
      break
    case 'week':
      xAxisData = gasData.weekList?.map((item: any) => `第${item.week}周`) || []
      seriesData = gasData.weekList?.map((item: any) => parseFloat(item.value)) || []
      title = '周天然气统计'
      break
    case 'month':
      xAxisData = gasData.monthList?.map((item: any) => item.month) || []
      seriesData = gasData.monthList?.map((item: any) => parseFloat(item.value)) || []
      title = '月天然气统计'
      break
  }

  return {
    title: {
      text: '单位：m³',
      left: '15',
      top: '0',
      textStyle: {
        color: '#DCFEFF',
        fontSize: 12,
        fontFamily: 'PingFang',
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
      textStyle: {
        color: '#fff'
      },
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>天然气: ${data.value.toLocaleString()} m³`
      }
    },
    grid: {
      top: '30px',
      bottom: '10px',
      left: '20px',
      right: '20px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        margin: 10,
        interval: 1,
        color: 'rgba(220, 254, 255, 1)',
        textStyle: {
          fontSize: 12,
        },
        rotate: activeTab.value === 'month' ? 45 : 0
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(8, 61, 98, 1.00)',
          type: 'dashed',
          width: 1,
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: 'rgba(39, 76, 129, 0.26)',
          width: 1,
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      splitNumber: 3,
      axisLabel: {
        color: 'rgba(220, 254, 255, 1)',
        textStyle: {
          fontSize: 12,
        },
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(8, 61, 98, 1.00)',
          type: 'dashed',
          width: 1,
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(8, 61, 98, 1.00)',
          type: 'dashed',
          width: 1,
        },
      },
    },
    series: [
      {
        name: '天然气',
        type: 'bar',
        data: seriesData,
        barWidth: '10',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(11, 224, 166, 0.52)',
              },
              {
                offset: 1,
                color: 'rgba(11, 224, 166, 0.2)',
              },
            ],
          },
        },
        markPoint: {
          symbol: 'path://M62 62h900v900h-900v-900z',
          symbolSize: [10, 3],
          itemStyle: {
            color: 'rgba(11, 224, 166, 1)',
          },
          data: seriesData.map((value, index) => ({
            xAxis: index,
            yAxis: value + 1,
          })),
        },
      },
    ],
  }
})

onMounted(async () => {
  // 数据通过 initData 自动获取，这里不需要手动调用
})
</script>

<style scoped lang="less">
.energy-electricity {
  width: 100%;
  height: 100%;
  padding: 5px;
  border-radius: 8px;
  backdrop-filter: blur(1px);
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    //margin-bottom: 20px;
    flex-shrink: 0;

    h3 {
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      margin: 0;
    }

    .tabs {
      display: flex;

      .tab {
        position: relative;
        padding: 4px 14px;
        background: rgba(255, 255, 255, 0.1);
        color: #ccc;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        line-height: 22px;
        clip-path: polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%);
        /* 提升命中区域 */
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          clip-path: inherit;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }

        &.active {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: #fff;
          box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3);
        }
      }
    }
  }

  .chart-container {
    flex: 1;
    border-radius: 8px;
    padding: 0px;
    width: 100%;
    min-height: 0; /* 重要：允许flex子项收缩 */
  }
}
</style>


