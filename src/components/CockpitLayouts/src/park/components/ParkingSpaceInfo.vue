<template>
  <div class="view">
    <div class="content">
      <div class="echarts-box">
        <div class="echarts">
          <v-chart autoresize :option="carNumberOption"></v-chart>
          <div class="title">车位数量</div>
        </div>
      </div>
      <div class="echarts-box">
        <div class="echarts">
          <v-chart autoresize :option="chargeNumberOption"></v-chart>
          <div class="title">充电桩数量</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  //车位信息信息
  import { computed, onMounted, ref, watch } from 'vue';
  import * as echarts from 'echarts';
  import { useParkStore } from '@/store/modules/park';
  const parkStore = useParkStore();
  const carNumberOption = ref({}); // 停车位图表配置项
  const chargeNumberOption = ref({}); // 充电位图表配置项
  const viewData = computed(() => parkStore.getParkingSpaceInfo) as any;
  //监听数据
  watch(viewData.value, () => {
    setCarNumberOption();
    setChargeNumberOption();
  });

  /**
   * @description: 设置停车位图表配置项
   */
  const setCarNumberOption = () => {
    if (viewData.value) {
      const data =
        (Number(viewData.value.parkingSpaceRepairCount) + Number(viewData.value.usedCount)) /
        viewData.value.parkingSpaceCount;
      const num = data * 100;
      carNumberOption.value = {
        title: [
          {
            text: `${num.toFixed(2)}%`,
            textStyle: {
              fontSize: 24,
              fontFamily: 'MiSans-Bold',
              fontWeight: 'bold',
              color: '#fff',
            },
            x: 'center',
            y: '36%',
          },
          {
            text: `${Number(viewData.value.parkingSpaceRepairCount) + Number(viewData.value.usedCount)}/${viewData.value.parkingSpaceCount}`, // 你可以自定义第二个标题的文本
            textStyle: {
              // 根据需要设置第二个标题的样式
              fontSize: 18,
              color: '#c5e4ff',
            },
            x: 'center', // 你可以设置第二个标题的位置
            y: '60%',
          },
        ],
        series: [
          {
            type: 'liquidFill',
            waveAnimation: 1,
            data: [data - 0.1, data - 0.01],
            color: ['rgba(30, 201, 255, 1)', 'rgba(30, 201, 255, 0.5)'],
            amplitude: 10,
            radius: '80%',
            backgroundStyle: {
              color: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.55,
                colorStops: [
                  {
                    offset: 0.5,
                    color: 'rgba(65, 65, 36, 0)', // 0% 处的颜色
                  },
                  {
                    offset: 0.75,
                    color: 'rgba(65, 65, 36, 0)', // 100% 处的颜色
                  },
                  {
                    offset: 0.95,
                    color: 'rgba(65, 65, 36, 0)', // 100% 处的颜色
                  },
                ],
                globalCoord: false, // 缺省为 false
              },
            },
            outline: {
              show: false,
            },
            label: {
              normal: {
                formatter: '',
              },
            },
          },
          {
            type: 'pie',
            name: '饼状背景渐变背景',
            radius: ['0%', '80%'],
            center: ['50%', '50%'],
            startAngle: 110,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                color: new echarts.graphic.RadialGradient(
                  0.5,
                  0.5,
                  0.5,
                  [
                    {
                      offset: 0,
                      color: 'rgba(255,255,255,0.1)',
                    },
                    {
                      offset: 0.5,
                      color: 'rgba(255,255,255,0.1)',
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(255,255,255,0.1)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(255,255,255,0.4)',
                    },
                  ],
                  false,
                ),
              },
            },
            tooltip: {
              show: false,
            },
            label: {
              show: false,
            },
            data: [50],
          },
          {
            type: 'pie',
            name: '饼状背景渐变背景',
            radius: ['80%', '85%'],
            center: ['50%', '50%'],
            startAngle: 110,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                color: 'rgba(30, 201, 255, 0.6)',
              },
            },
            tooltip: {
              show: false,
            },
            label: {
              show: false,
            },
            data: [50],
          },
          {
            type: 'pie',
            name: '饼状背景渐变背景',
            radius: ['85%', '90%'],
            center: ['50%', '50%'],
            startAngle: 110,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                color: 'rgba(30, 201, 255, 0.8)',
              },
            },
            tooltip: {
              show: false,
            },
            label: {
              show: false,
            },
            data: [50],
          },
          {
            type: 'pie',
            name: '饼状背景渐变背景',
            radius: ['90%', '96%'],
            center: ['50%', '50%'],
            startAngle: 110,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                color: 'rgba(30, 201, 255, 0.3)',
              },
            },
            tooltip: {
              show: false,
            },
            label: {
              show: false,
            },
            data: [50],
          },
        ],
      };
    } else {
      carNumberOption.value = {
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
   * @description: 设置充电桩图表配置项
   */
  const setChargeNumberOption = () => {
    if (viewData.value) {
      const data =
        (Number(viewData.value.chargingPileRepairCount) +
          Number(viewData.value.chargingPileUsedCount)) /
        viewData.value.chargingPileCount;
      const num = data * 100;
      chargeNumberOption.value = {
        title: [
          {
            text: `${num.toFixed(2)}%`,
            textStyle: {
              fontSize: 24,
              fontFamily: 'MiSans-Bold',
              fontWeight: 'bold',
              color: '#fff',
            },
            x: 'center',
            y: '36%',
          },
          {
            text: `${Number(viewData.value.chargingPileRepairCount) + Number(viewData.value.chargingPileUsedCount)}/${viewData.value.chargingPileCount}`, // 你可以自定义第二个标题的文本
            textStyle: {
              // 根据需要设置第二个标题的样式
              fontSize: 18,
              color: '#c5e4ff',
            },
            x: 'center', // 你可以设置第二个标题的位置
            y: '60%',
          },
        ],
        series: [
          {
            type: 'liquidFill',
            waveAnimation: 1,
            data: [data - 0.1, data - 0.01],
            color: ['rgba(20, 228, 138, 1)', 'rgba(20, 228, 138, 0.5)'],
            amplitude: 10,
            radius: '80%',
            backgroundStyle: {
              color: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.55,
                colorStops: [
                  {
                    offset: 0.5,
                    color: 'rgba(65, 65, 36, 0)', // 0% 处的颜色
                  },
                  {
                    offset: 0.75,
                    color: 'rgba(65, 65, 36, 0)', // 100% 处的颜色
                  },
                  {
                    offset: 0.95,
                    color: 'rgba(65, 65, 36, 0)', // 100% 处的颜色
                  },
                ],
                globalCoord: false, // 缺省为 false
              },
            },
            outline: {
              show: false,
            },
            label: {
              normal: {
                formatter: '',
              },
            },
          },
          {
            type: 'pie',
            name: '饼状背景渐变背景',
            radius: ['0%', '80%'],
            center: ['50%', '50%'],
            startAngle: 110,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                color: new echarts.graphic.RadialGradient(
                  0.5,
                  0.5,
                  0.5,
                  [
                    {
                      offset: 0,
                      color: 'rgba(255,255,255,0.1)',
                    },
                    {
                      offset: 0.5,
                      color: 'rgba(255,255,255,0.1)',
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(255,255,255,0.1)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(255,255,255,0.4)',
                    },
                  ],
                  false,
                ),
              },
            },
            tooltip: {
              show: false,
            },
            label: {
              show: false,
            },
            data: [50],
          },
          {
            type: 'pie',
            name: '饼状背景渐变背景',
            radius: ['80%', '85%'],
            center: ['50%', '50%'],
            startAngle: 110,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                color: 'rgba(20, 228, 138, 0.6)',
              },
            },
            tooltip: {
              show: false,
            },
            label: {
              show: false,
            },
            data: [50],
          },
          {
            type: 'pie',
            name: '饼状背景渐变背景',
            radius: ['85%', '90%'],
            center: ['50%', '50%'],
            startAngle: 110,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                color: 'rgba(20, 228, 138, 0.8)',
              },
            },
            tooltip: {
              show: false,
            },
            label: {
              show: false,
            },
            data: [50],
          },
          {
            type: 'pie',
            name: '饼状背景渐变背景',
            radius: ['90%', '96%'],
            center: ['50%', '50%'],
            startAngle: 110,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                color: 'rgba(20, 228, 138, 0.3)',
              },
            },
            tooltip: {
              show: false,
            },
            label: {
              show: false,
            },
            data: [50],
          },
        ],
      };
    } else {
      chargeNumberOption.value = {
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
    setCarNumberOption();
    setChargeNumberOption();
  });
</script>
<style lang="less" scoped>
  .view {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    .content {
      display: flex;
      position: relative;
      width: 100%;
      aspect-ratio: 1;

      .echarts-box {
        display: flex;
        position: relative;
        justify-content: center;
        width: 50%;
        height: 100%;

        .echarts {
          position: absolute;
          top: 50%;
          width: 100%;
          transform: translateY(-52%);
          aspect-ratio: 1;

          .title {
            position: absolute;
            right: 0;
            bottom: -8%;
            left: 0;
            width: 100%;
            color: #d8effc;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
          }
        }
      }
    }
  }
</style>
