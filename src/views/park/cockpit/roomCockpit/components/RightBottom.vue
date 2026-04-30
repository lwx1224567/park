<template>
  <div class="main-container">
    <div class="tabs-nav">
      <TabsNav v-model:active="tabsIndex" :tabs="['温度', '能耗']" />
    </div>
    <v-chart v-if="tabsIndex === 0" autoresize :option="temperatureOption"></v-chart>
    <v-chart v-if="tabsIndex === 1" autoresize :option="energyConsumptionTrendOption"></v-chart>
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { TabsNav } from '@/components/Tabs';
  import * as echarts from 'echarts';
  import dayjs from 'dayjs';
  import { getDataAnalysis } from '@/api/cockpit/roomManage';
  import dot from '@/assets/images/layouts/icon-dot-green.png';
  const props = defineProps({
    id: {
      type: String,
      required: true,
      default: () => '',
    },
  });
  //监听id变化
  watch(
    () => props.id,
    (newId) => {
      if (newId) {
        getData();
      }
    },
  );
  const tabsIndex = ref(0); // tab索引
  const temperatureOption = ref({}); // 温度图表配置项
  const energyConsumptionTrendOption = ref({}); // 能耗图表配置项
  /**
   * @description: 获取数据
   */
  const getData = async () => {
    const res = await getDataAnalysis(props.id);
    setTemperatureOption(res.temperatureTrend);
    setenergyConsumptionTrendOption(res.energyConsumptionTrend);
  };
  /**
   * @description: 设置温度图表数据
   */
  const setTemperatureOption = (data) => {
    if (data.length > 0) {
      temperatureOption.value = {
        title: {
          text: '单位：℃', // 标题文本
          left: '15', // 标题的位置，默认是居中，可以是：'left'、'right'、'center'
          top: '0', // 标题的垂直位置，可以是：'top'、'bottom'、'middle'
          textStyle: {
            // 主标题文本样式
            color: '#DCFEFF', // 主标题文字的颜色
            fontSize: 12, // 主标题文字字体大小
            fontFamily: 'PingFang', // 主标题文字的字体系列
            fontWeight: 500, // 粗体
          },
        },
        grid: {
          top: '40px',
          bottom: '20px',
          left: '20px',
          right: '20px',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgba(255, 174, 0, 0.1)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(255, 174, 0, 0.5)',
                  },
                ],
                false,
              ),
            },
          },
        },
        legend: {
          top: 0,
          right: 0,
          itemWidth: 10,
          itemHeight: 10,
          show: false,
          textStyle: {
            color: 'rgba(157, 185, 233, 1)',
            fontSize: '14',
          },
          data: [{ name: '温度', icon: 'image://' + dot }],
        },
        xAxis: [
          {
            data: data.map((item) => `${dayjs(item.time).format('HH')}时`),
            axisLabel: {
              margin: 10,
              interval: 1,
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
        ],
        yAxis: [
          {
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
        ],
        series: [
          {
            name: '温度',
            type: 'line',
            data: data.map((item) => item.value),
            smooth: false,
            symbol: 'image://' + dot, //数值点设定为实心点
            symbolSize: 11, // 折线的点的大小
            itemStyle: {
              normal: {
                color: 'rgba(102, 255, 166, 1)', //点的颜色
                lineStyle: {
                  color: 'rgba(102, 255, 166, 1)', //线的颜色
                  width: 1, // 折线图线条粗细设置
                },
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(102, 255, 166, 0.5)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(102, 255, 166,0)',
                    },
                  ],
                  false,
                ),
              },
            },
          },
        ],
      };
    } else {
      temperatureOption.value = {
        title: {
          text: '暂无数据',
          x: 'center',
          y: 'center',
          textStyle: {
            fontFamily: 'Manteka',
            fontSize: '16',
            fontWeight: 'normal',
            color: '#fff',
          },
        },
      };
    }
  };
  /**
   * @description: 设置能耗趋势图表数据
   */
  const setenergyConsumptionTrendOption = (data) => {
    if (data.length > 0) {
      energyConsumptionTrendOption.value = {
        title: {
          text: '单位：Wh', // 标题文本
          left: '15', // 标题的位置，默认是居中，可以是：'left'、'right'、'center'
          top: '0', // 标题的垂直位置，可以是：'top'、'bottom'、'middle'
          textStyle: {
            // 主标题文本样式
            color: '#DCFEFF', // 主标题文字的颜色
            fontSize: 12, // 主标题文字字体大小
            fontFamily: 'PingFang', // 主标题文字的字体系列
            fontWeight: 500, // 粗体
          },
        },
        grid: {
          top: '30px',
          bottom: '10px',
          left: '20px',
          right: '20px',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgba(255, 174, 0, 0.1)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(255, 174, 0, 0.5)',
                  },
                ],
                false,
              ),
            },
          },
        },
        legend: {
          top: 10,
          right: 14,
          show: false, // 隐藏图例
          itemWidth: 10,
          itemHeight: 4,
          textStyle: {
            color: 'rgba(220, 254, 255, 1)',
            fontSize: '12',
          },
        },
        xAxis: [
          {
            data: data.map((item) => `${dayjs(item.time).format('HH')}时`),
            axisLabel: {
              margin: 10,
              interval: 1,
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
        ],
        yAxis: [
          {
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
        ],
        series: [
          {
            name: '能耗',
            type: 'bar',
            data: data.map((item) => item.value),
            barWidth: '10',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(11, 224, 166, 0.52)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(11, 224, 166, 0.2)',
                    },
                  ],
                  false,
                ),
              },
            },
            markPoint: {
              symbol: 'path://M62 62h900v900h-900v-900z', // 使用 SVG path 绘制扁圆形状
              symbolSize: [10, 3], // 设置扁圆的宽和高
              itemStyle: {
                color: 'rgba(11, 224, 166, 1)', // 圆盘颜色
              },
              data: data.map((obj, index) => ({
                xAxis: index, // 对应柱子的横坐标
                yAxis: obj.value + 1, // 柱子的值加上一些偏移量
              })),
            },
          },
        ],
      };
    } else {
      energyConsumptionTrendOption.value = {
        title: {
          text: '暂无数据',
          x: 'center',
          y: 'center',
          textStyle: {
            fontFamily: 'Manteka',
            fontSize: '16',
            fontWeight: 'normal',
            color: '#fff',
          },
        },
      };
    }
  };
  onMounted(() => {
    getData();
  });
</script>

<style scoped lang="less">
  .main-container {
    width: 100%;
    height: 100%;

    .tabs-nav {
      position: absolute;
      top: -30px;
      right: 0;
      height: 30px;
    }
  }
</style>
