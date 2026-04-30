<template>
  <div class="energy-electricity">
    <div class="header">
      <h3>{{ currentDataTitle }}</h3>
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

    <div class="chart-container" ref="chartContainerRef">
      <button
        class="nav-btn left"
        @click="prevData"
        :class="{ disabled: currentDataType === 'temperature' }"
      >
        ◀
      </button>
      <v-chart autoresize :option="chartOption" style="width: 100%; height: 100%" />
      <button
        class="nav-btn right"
        @click="nextData"
        :class="{ disabled: currentDataType === 'power' }"
      >
        ▶
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import VChart from 'vue-echarts';
  import { useRoomStore } from '@/store/modules/room';

  // 使用 store
  const roomStore = useRoomStore();

  // 数据类型配置
  const dataTypes = [
    { key: 'temperature', label: '温度', unit: '°C' },
    { key: 'humidity', label: '湿度', unit: '%' },
    { key: 'power', label: '用电', unit: 'kWh' },
  ];

  // 当前数据类型
  const currentDataType = ref('temperature');
  const chartContainerRef = ref();

  // 标签页配置
  const tabs = [
    { key: 'day', label: '日' },
    { key: 'week', label: '周' },
    { key: 'month', label: '月' },
  ];

  // 当前激活的标签页
  const activeTab = ref('week');

  // 切换标签页
  const switchTab = (tabKey: string) => {
    activeTab.value = tabKey;
  };

  // 获取当前数据类型配置
  const currentDataTypeConfig = computed(() => {
    return dataTypes.find((dt) => dt.key === currentDataType.value) || dataTypes[0];
  });

  // 获取当前标题
  const currentDataTitle = computed(() => {
    return currentDataTypeConfig.value.label;
  });

  // 上一组数据
  const prevData = () => {
    const currentIndex = dataTypes.findIndex((dt) => dt.key === currentDataType.value);
    if (currentIndex > 0) {
      currentDataType.value = dataTypes[currentIndex - 1].key;
    }
  };

  // 下一组数据
  const nextData = () => {
    const currentIndex = dataTypes.findIndex((dt) => dt.key === currentDataType.value);
    if (currentIndex < dataTypes.length - 1) {
      currentDataType.value = dataTypes[currentIndex + 1].key;
    }
  };

  // 计算图表配置
  const chartOption = computed(() => {
    let xAxisData: string[] = [];
    let seriesData: number[] = [];

    // 从 store 获取数据
    const dataAnalysisData = roomStore.getDataAnalysisData;

    // 根据当前数据类型获取对应的趋势数据
    let currentTrendData: any = {};
    const dataKeyMap: Record<string, string> = {
      temperature: 'templureTrend',
      humidity: 'humidityTrend',
      power: 'powerTrend',
    };

    const trendKey = dataKeyMap[currentDataType.value];
    if (dataAnalysisData && dataAnalysisData[trendKey]) {
      currentTrendData = dataAnalysisData[trendKey];
    }

    // 根据当前标签页获取对应的数据列表
    switch (activeTab.value) {
      case 'day':
        xAxisData = currentTrendData.dayList?.map((item: any) => item.day) || [];
        seriesData =
          currentTrendData.dayList?.map((item: any) => parseFloat(item.value || 0)) || [];
        break;
      case 'week':
        xAxisData = currentTrendData.weekList?.map((item: any) => `第${item.week}周`) || [];
        seriesData =
          currentTrendData.weekList?.map((item: any) => parseFloat(item.value || 0)) || [];
        break;
      case 'month':
        xAxisData = currentTrendData.monthList?.map((item: any) => item.month) || [];
        seriesData =
          currentTrendData.monthList?.map((item: any) => parseFloat(item.value || 0)) || [];
        break;
    }

    return {
      title: {
        text: `单位：${currentDataTypeConfig.value.unit}`,
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
          type: 'shadow',
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#333',
        textStyle: {
          color: '#fff',
        },
        formatter: (params: any) => {
          const data = params[0];
          const dataLabel = currentDataTypeConfig.value.label;
          return `${data.name}<br/>${dataLabel}: ${data.value.toLocaleString()} ${currentDataTypeConfig.value.unit}`;
        },
      },
      grid: {
        top: '30px',
        bottom: '10px',
        left: '30px',
        right: '30px',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          margin: 10,
          interval: 'auto',
          color: 'rgba(220, 254, 255, 1)',
          textStyle: {
            fontSize: 12,
          },
          rotate: 0,
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
          name: currentDataTypeConfig.value.label,
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
    };
  });
</script>

<style scoped lang="less">
  .energy-electricity {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 0;
    border-radius: 8px;
    backdrop-filter: blur(1px);

    .header {
      display: flex;
      //margin-bottom: 20px;
      flex-shrink: 0;
      align-items: center;
      justify-content: space-between;

      h3 {
        margin: 0;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
      }

      .tabs {
        display: flex;

        .tab {
          position: relative;
          padding: 4px 14px;
          transition: all 0.3s ease;
          background: rgb(255 255 255 / 10%);
          color: #ccc;
          font-size: 14px;
          line-height: 22px;
          cursor: pointer;
          clip-path: polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%);

          /* 提升命中区域 */
          &::before {
            content: '';
            position: absolute;
            inset: 0;
            clip-path: inherit;
          }

          &:hover {
            background: rgb(255 255 255 / 20%);
            color: #fff;
          }

          &.active {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            box-shadow: 0 2px 8px rgb(79 172 254 / 30%);
            color: #fff;
          }
        }
      }
    }

    .chart-container {
      position: relative;
      flex: 1;
      width: 100%;
      min-height: 0; /* 重要：允许flex子项收缩 */
      padding: 0;
      border-radius: 8px;

      .nav-btn {
        display: flex;
        position: absolute;
        z-index: 10;
        top: 50%;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        transform: translateY(-50%);
        transition: all 0.3s ease;
        border: none;
        background: rgb(0 0 0 / 0%);
        color: #fff;
        font-size: 24px;
        cursor: pointer;

        // &:hover {
        //   background: rgba(0, 0, 0, 0.5);
        // }

        // &:active {
        //   background: rgba(0, 0, 0, 0.7);
        // }

        &.disabled {
          opacity: 0.3;
          cursor: not-allowed;
          pointer-events: none;
        }

        &.left {
          left: 0;
        }

        &.right {
          right: 0;
        }
      }
    }
  }
</style>
