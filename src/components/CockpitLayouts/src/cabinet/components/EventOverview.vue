<template>
  <div class="view">
    <v-chart autoresize :option="option"></v-chart>
  </div>
</template>
<script setup lang="ts">
  //事件总览
  import { computed, onMounted, ref, watch } from 'vue';
  import * as echarts from 'echarts';
  import { useCabinetStore } from '@/store/modules/cabinet';
  const cabinetStore = useCabinetStore();
  const option = ref({}); // 图表配置项

  const viewData = computed(() => cabinetStore.getCabinetEventPreviewData) as any; //视图数据
  //监听数据
  watch(viewData.value, () => {
    setOption();
  });
  // 定义每个柱子的渐变颜色
  const colors = [
    ['#3977E6', '#37BBF8'], // 第一个柱子的颜色
    ['#FF5733', '#FFC371'], // 第二个柱子的颜色
    ['#33FF57', '#71FFC3'], // 第三个柱子的颜色
    ['#FF33A1', '#FF71C3'], // 第四个柱子的颜色
    ['#3357FF', '#71C3FF'], // 第五个柱子的颜色
  ];

  /**
   * @description: 设置图表数据
   */
  const setOption = () => {
    if (viewData.value.length > 0) {
      option.value = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        //图表位置
        grid: {
          top: '0%',
          left: '5%',
          right: '5%',
          bottom: '0%',
          containLabel: true, //显示坐标轴
        },
        //X轴
        xAxis: {
          type: 'value',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          //不显示X轴刻度线和数字
          splitLine: { show: false },
          axisLabel: { show: false },
        },
        yAxis: {
          type: 'category',
          data: viewData.value.map((obj) => obj.type),
          inverse: true, //升序
          splitLine: { show: false },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          offset: 10, //key和图间距
          //动画部分
          animationDuration: 300,
          animationDurationUpdate: 300,
          axisLabel: {
            textStyle: {
              color: '#FFFFFF', ///Y轴字体颜色
              fontSize: 14,
            },
          },
        },
        series: [
          {
            realtimeSort: true, //柱状图自动排序，排序自动让Y轴名字跟着数据动
            name: '数量',
            type: 'bar',
            data: viewData.value.map((obj, index) => ({
              value: obj.count,
              itemStyle: {
                barBorderRadius: 7,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: colors[0][0] },
                  { offset: 1, color: colors[0][1] },
                ]),
              },
            })),
            barWidth: 14,
            barGap: 10,
            smooth: true,
            valueAnimation: true,
          },
        ],
        //动画部分
        animationDuration: 0,
        animationDurationUpdate: 3000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear',
      };
    } else {
      option.value = {
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
    setOption();
  });
</script>
<style lang="less" scoped>
  .view {
    display: flex;
    width: 100%;
    height: 100%;
  }
</style>
