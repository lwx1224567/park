<template>
  <div class="view">
    <div class="flex-1">
      <div class="ups-item">
        <div class="title">UPS输入</div>
        <div class="content left mb-[5px]">
          <div class="w-[60%]">
            <span>电流电压：</span>
            <span class="color-[#00ffa8]">{{ viewData.upsInput?.inputCurrent || '-' }}A</span>
            <span>/</span>
            <span class="color-[#ffea00]">{{ viewData.upsInput?.inputVoltage || '-' }}V</span>
          </div>
          <div class="w-[40%]">
            <span>频率：</span>
            <span class="color-[#ffea00]">{{ viewData.upsInput?.frequency || '-' }}Hz</span>
          </div>
        </div>
      </div>
      <div class="ups-item">
        <div class="title">UPS输出</div>
        <div class="content right">
          <div class="w-[60%]">
            <span>电流电压：</span>
            <span class="color-[#00ffa8]">{{ viewData.upsOutput?.outputCurrent || '-' }}A</span>
            <span>/</span>
            <span class="color-[#ffea00]">{{ viewData.upsOutput?.outputVoltage || '-' }}V</span>
          </div>
          <div class="w-[40%]">
            <span>频率：</span>
            <span class="color-[#ffea00]">{{ viewData.upsOutput?.frequency || '-' }}Hz</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-auto relative">
      <div class="absolute inset-0 flex gap-[10px]">
        <div class="h-full aspect-ratio-1">
          <v-chart autoresize :option="option"></v-chart>
        </div>
        <div class="h-full flex-auto flex justify-center items-center">
          <div class="progress-container w-full">
            <div class="progress">
              <div class="w-full flex justify-between items-center text-[13px]">
                <span class="color-[#ffffff]">电池备用时间</span>
                <span class="color-[#70b660]">{{ viewData.batteryBackupTime || '-' }}h</span>
              </div>
              <a-progress :percent="(viewData.batteryBackupTime / 10) * 100" :show-info="false" />
            </div>
            <div class="progress">
              <div class="w-full flex justify-between items-center text-[13px]">
                <span class="color-[#ffffff]">电池电压</span>
                <span class="color-[#70b660]">{{ viewData.battery?.voltage || '-' }}V</span>
              </div>
              <a-progress :percent="(viewData.battery?.voltage / 380) * 100" :show-info="false" />
            </div>
            <div class="progress">
              <div class="w-full flex justify-between items-center text-[13px]">
                <span class="color-[#ffffff]">电池电阻</span>
                <span class="color-[#70b660]">{{ viewData.battery?.resistance || '-' }}Ω</span>
              </div>
              <a-progress
                :percent="(viewData.battery?.resistance / 100) * 100"
                :show-info="false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  //配电详情
  import { computed, onMounted, ref } from 'vue';
  import { useRoomStore } from '@/store/modules/room';
  import * as echarts from 'echarts';
  const roomStore = useRoomStore();
  const viewData = computed(() => roomStore.getPistributionDetailData) as any; //视图数据
  const option = ref({}); // 图表配置项
  /**
   * @description: 设置图表数据
   */
  const setOption = () => {
    if (viewData.value.loadRate) {
      const num = viewData.value.loadRate * 100;
      option.value = {
        title: [
          {
            text: `${num.toFixed(2)}%`,
            textStyle: {
              fontSize: 18,
              fontFamily: 'MiSans-Bold',
              fontWeight: 'normal',
              color: '#fff',
            },
            x: 'center',
            y: '32%',
          },
          {
            text: '负载量', // 你可以自定义第二个标题的文本
            textStyle: {
              // 根据需要设置第二个标题的样式
              fontSize: 14,
              color: '#c5e4ff',
            },
            x: 'center', // 你可以设置第二个标题的位置
            y: '52%',
          },
        ],
        series: [
          {
            type: 'liquidFill',
            waveAnimation: 1,
            data: [viewData.value.loadRate - 0.1, viewData.value.loadRate - 0.01],
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
    flex-direction: column;
    gap: 1px;
    width: 100%;
    height: 100%;
    user-select: none;

    .ups-item {
      width: 100%;
      color: #fff;

      .title {
        padding: 0 5px 2px;
        font-size: 14px;
        font-weight: normal;
      }

      .content {
        display: flex;
        align-items: center;
        width: 100%;
        height: 28px;
        padding: 0 15px;
        background: rgb(2 181 226 / 15%);
        font-size: 14px;

        &.left {
          position: relative;
          border-radius: 0 16px 16px 0;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 8px;
            height: 100%;
            background: #b5d0e6;
          }
        }

        &.right {
          position: relative;
          border-radius: 16px 0 0 16px;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 8px;
            height: 100%;
            background: #b5d0e6;
          }
        }
      }
    }

    .progress-container {
      .progress {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;

        .ant-progress{
          line-height: 8px;
        }

        .ant-progress-line{
          margin-bottom: 4px;
        }
      }
    }
  }
</style>
