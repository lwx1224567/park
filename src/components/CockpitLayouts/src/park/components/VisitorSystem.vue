<template>
  <div class="summary">
    <div class="stats">
      <div class="stat">
        <div class="icon-box">
          <img
            src="@/assets/components/SecurityStatus/SecurityStatus-monitoringStatus.png"
            alt="访客数量"
            class="custom-icon"
          />
        </div>
        <div class="content">
          <div class="label">访客数量</div>
          <div class="value strong">{{ formatNumber(state.todayVisitor) }}</div>
        </div>
      </div>
      <div class="stat">
        <div class="icon-box">
          <img
            src="@/assets/components/SecurityStatus/SecurityStatus-electronicFence.png"
            alt="预约数量"
            class="custom-icon"
          />
        </div>
        <div class="content">
          <div class="label">预约数量</div>
          <div class="value">{{ formatNumber(state.todayReservation) }}</div>
        </div>
      </div>
      <div class="stat">
        <div class="icon-box">
          <img
            src="@/assets/components/SecurityStatus/SecurityStatus-NumberInvasions.png"
            alt="备案车辆"
            class="custom-icon"
          />
        </div>
        <div class="content">
          <div class="label">备案车辆</div>
          <div class="value">{{ formatNumber(state.todayRecordCar) }}</div>
        </div>
      </div>
      <div class="stat">
        <div class="icon-box">
          <img
            src="@/assets/components/SecurityStatus/SecurityStatus-runtimeDuration.png"
            alt="当前在园"
            class="custom-icon"
          />
        </div>
        <div class="content">
          <div class="label">当前在园</div>
          <div class="value">{{ formatNumber(state.todayInPark) }}</div>
        </div>
      </div>
    </div>

    <v-chart autoresize :option="chartOption" />
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted, computed } from 'vue';
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import { BarChart } from 'echarts/charts';
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
  } from 'echarts/components';
  import VChart from 'vue-echarts';
  import { useParkStore } from '@/store/modules/park';

  // 注册 ECharts 组件
  use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

  const parkStore = useParkStore();
  const state = reactive({
    todayVisitor: 0,
    todayReservation: 0,
    todayRecordCar: 0,
    todayInPark: 0,
  });

  function formatNumber(n?: number) {
    if (n === undefined || n === null) return '—';
    return new Intl.NumberFormat('zh-CN').format(n);
  }

  const chartOption = computed(() => {
    const visitorStats = parkStore.getVisitorStatistics;
    const visitorTrends = parkStore.getVisitorTrends;

    // 更新本地状态
    state.todayVisitor = visitorStats.todayVisitor || 0;
    state.todayReservation = visitorStats.todayReservation || 0;
    state.todayRecordCar = visitorStats.todayRecordCar || 0;
    state.todayInPark = visitorStats.todayInPark || 0;

    const chartData = visitorTrends || [];
    const xAxisData = chartData.map((item: any) => item.day || item.label);
    const seriesData = chartData.map((item: any) => parseFloat(item.avgValue || item.value));

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(59, 130, 246, 0.2)',
            shadowBlur: 10,
          },
        },
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        borderColor: 'rgba(59, 130, 246, 0.6)',
        borderWidth: 1,
        borderRadius: 8,
        padding: [12, 16],
        textStyle: {
          color: '#fff',
          fontSize: 13,
          fontWeight: '500',
        },
        extraCssText:
          'box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.3); backdrop-filter: blur(10px);',
        formatter: (params: any) => {
          const data = params[0];
          const date = data.name;
          const value = data.value.toLocaleString();

          return `
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="color: #9cc6ff; font-size: 12px;">
              时间：${date}
            </div>
            <div style="color: #fff; font-size: 16px; font-weight: 600; margin-top: 2px;">
              平均流量：${value}人
            </div>
          </div>
        `;
        },
      },
      grid: {
        left: '0%',
        right: '0%',
        top: '6%',
        bottom: '4%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        show: false,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        // name: '访客数量 (人)',
        // nameTextStyle: {
        //   color: '#999'
        // },
        min: 0,
        max: 'dataMax',
        axisLine: {
          lineStyle: {
            color: '#666',
          },
        },
        axisLabel: {
          color: '#FFFFFF',
          formatter: (value: number) => {
            return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
          },
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#333',
          },
        },
      },
      series: [
        {
          name: '访客数量',
          type: 'bar',
          data: seriesData,
          barWidth: '60%',
          barMaxWidth: 50,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(16,86,232,0.8)' },
                { offset: 1, color: 'rgba(59,128,188,0.46)' },
              ],
            },
          },
          emphasis: {
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#667eea' },
                  { offset: 1, color: '#764ba2' },
                ],
              },
            },
          },
        },
      ],
    };
  });

  onMounted(async () => {
    // 数据通过 initData 自动获取，这里不需要手动调用
  });
</script>

<style scoped lang="less">
  .summary {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 2px 6px;
    color: #cfe8ff;
    gap: 8px;
  }

  .header-line {
    display: flex;
    align-items: center;
    padding: 20px 14px;
    overflow: hidden;
    border: 1px solid rgb(59 130 246 / 25%);
    border-radius: 8px;
    background: linear-gradient(90deg, rgb(17 66 122 / 25%), rgb(17 66 122 / 5%));
    text-overflow: ellipsis;
    white-space: nowrap;
    gap: 8px;
  }

  .header-line .park {
    color: #e8f2ff;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.2px;
  }

  .header-line .owner {
    margin-left: auto;
    color: #b6d4ff;
    font-size: 18px;
    font-weight: 700;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    flex-shrink: 0;
    height: 100px;
    gap: 6px;
  }

  .stat {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 4px 8px;
    border: 1px solid rgb(59 130 246 / 25%);
    border-radius: 8px;
    background: linear-gradient(90deg, rgb(17 66 122 / 18%), rgb(17 66 122 / 4%));
    gap: 8px;
  }

  .icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    color: #fff;
  }

  .header-line .icon-box {
    width: 45px;
    height: 45px;
  }

  .custom-icon {
    width: 30px;
    height: 30px;
    object-fit: contain;
  }

  .header-line .custom-icon {
    width: 45px;
    height: 45px;
  }

  .content {
    flex: 1;
  }

  .label {
    color: #9cc6ff;
    font-size: 14px;
  }

  .value {
    color: #e8f2ff;
    font-size: 14px;
  }

  .header-line .label {
    font-size: 16px;
  }

  .header-line .value {
    font-size: 18px;
    font-weight: 600;
  }

  .value.strong {
    font-weight: 600;
  }

  .unit {
    margin-left: 2px;
    color: #9cc6ff;
    font-size: 12px;
  }

  .sub {
    margin-top: 2px;
    color: #9cc6ff;
    font-size: 12px;
  }

  .chart-container {
    flex-shrink: 0;
    width: 100%;
    height: calc(100% - 100px);
    margin-top: 10px;
    border: 1px solid rgb(59 130 246 / 25%);
    border-radius: 8px;
    background: linear-gradient(90deg, rgb(17 66 122 / 18%), rgb(17 66 122 / 4%));
  }
</style>
