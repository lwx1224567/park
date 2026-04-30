<template>
      <v-chart
        autoresize
        :option="chartOption"
        style="width: 100%; height: 100%;"
      />
</template>

<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue';
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { useParkStore } from '@/store/modules/park'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

const parkStore = useParkStore()
const state = reactive({
  totalCount: 0,
  repairingCount: 0,
  solvedCount: 0
});

const chartOption = computed(() => {
  const maintenanceData = parkStore.getMaintenanceStatistics
  
  // 如果数据为空对象，使用默认值
  if (!maintenanceData || Object.keys(maintenanceData).length === 0) {
    state.totalCount = 0
    state.repairingCount = 0
    state.solvedCount = 0
  } else {
    state.totalCount = maintenanceData.totalCount || 0
    state.repairingCount = maintenanceData.repairingCount || 0
    state.solvedCount = maintenanceData.solvedCount || 0
  }
  
  const data = [
    {
      name: '维修中',
      value: state.repairingCount,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59, 130, 246, 0.8)' },
            { offset: 1, color: 'rgba(37, 99, 235, 0.6)' }
          ]
        }
      }
    },
    {
      name: '已解决',
      value: state.solvedCount,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(156, 163, 175, 0.8)' },
            { offset: 1, color: 'rgba(107, 114, 128, 0.6)' }
          ]
        }
      }
    }
  ];

  return {
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: state.totalCount.toString(),
          fontSize: 24,
          fontWeight: 'bold',
          fill: '#fff',
          textAlign: 'center',
          textVerticalAlign: 'middle'
        }
      },
      {
        type: 'text',
        left: 'center',
        top: '55%',
        style: {
          text: '总数',
          fontSize: 14,
          fill: '#9cc6ff',
          textAlign: 'center',
          textVerticalAlign: 'middle'
        }
      }
    ],
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(59, 130, 246, 0.5)',
      borderWidth: 1,
      borderRadius: 8,
      padding: [12, 16],
      textStyle: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '500'
      },
      formatter: (params: any) => {
        const percentage = ((params.value / state.totalCount) * 100).toFixed(2);
        return `
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="color: #9cc6ff; font-size: 12px;">
              ${params.name}
            </div>
            <div style="color: #fff; font-size: 16px; font-weight: 600; margin-top: 2px;">
              ${params.value} (${percentage}%)
            </div>
          </div>
        `;
      }
    },
    series: [
      {
        name: '维修统计',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          position: 'outside',
          formatter: (params: any) => {
            const percentage = ((params.value / state.totalCount) * 100).toFixed(2);
            return `${params.name}\n${percentage}%`;
          },
          fontSize: 12,
          color: '#fff',
          fontWeight: '500'
        },
        labelLine: {
          show: true,
          length: 20,
          length2: 10,
          lineStyle: {
            color: '#9cc6ff',
            width: 1
          }
        },
        itemStyle: {
          borderRadius: 8,
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1
        }
      }
    ]
  };
});

onMounted(async () => {
  // 数据通过 initData 自动获取，这里不需要手动调用
});
</script>

