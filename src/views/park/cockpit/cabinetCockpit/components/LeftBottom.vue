<template>
  <div class="main-container">
    <div class="tabs-nav">
      <TabsNav v-model:active="tabsIndex" :tabs="['告警', '事件']" />
    </div>
    <div class="alarm-chart" v-if="tabsIndex === 0">
      <div class="chart-container"><v-chart autoresize :option="alarmOption"></v-chart></div>
      <div class="list">
        <div class="listItem cur" v-for="(item, index) in alarmChartData" :key="index">
          <div class="listIteml">
            <div
              class="dot"
              :style="
                'background: linear-gradient(80deg,' +
                item.color1 +
                ' 0%, ' +
                item.color2 +
                ' 100%);'
              "
            ></div>
            <span class="nameBody">{{ item.name }}</span>
          </div>
          <div class="listItemr">
            <div class="listItemr2">
              <em class="num">{{ item.value }}次</em>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="event-chart" v-if="tabsIndex === 1"
      ><v-chart autoresize :option="eventOption"></v-chart
    ></div>
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { getCabinetAlarmPreview } from '@/api/cockpit/cabinetManage';
  import { TabsNav } from '@/components/Tabs';
  import * as echarts from 'echarts';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';

  // 接收父组件传递的机柜ID
  const props = defineProps<{
    cabinetId: string;
  }>();

  const tabsIndex = ref(0); // tab索引
  const alarmOption = ref({}); // 告警图表配置项
  const eventOption = ref({}); // 事件图表配置项
  const alarmChartData = ref<any[]>([]); // 告警图表数据
  // 告警级别映射
  const levelMap = {
    1: {
      name: '一级告警',
      color1: 'rgba(77, 223, 253, 1.00)',
      color2: 'rgba(0, 234, 255, 1.00)',
    },
    2: {
      name: '二级告警',
      color1: 'rgba(0, 145, 255, 1.00)',
      color2: 'rgba(0, 145, 255, 1.00)',
    },
    3: {
      name: '三级告警',
      color1: 'rgba(254, 85, 2, 1.00)',
      color2: 'rgba(254, 85, 2, 1.00)',
    },
  };
  /**
   * @description: 告警设置图表数据
   */
  const setAlarmOption = (data) => {
    if (data.length > 0) {
      alarmOption.value = {
        color: buildAlarmChartColors(data),
        tooltip: {
          trigger: 'item',
          confine: true,
        },
        series: [
          {
            name: '告警等级',
            type: 'pie',
            roundCap: true,
            radius: ['40%', '80%'],
            center: ['50%', '50%'],
            borderCap: 'round',
            label: {
              show: false,
              position: 'outside',
              formatter: '{b}\n{c}',
              fontSize: 12,
              lineHeight: 20,
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 10,
            },
            data: buildAlarmData(data),
            itemStyle: {
              borderColor: 'rgba(4, 43, 88, 1.00)',
              borderWidth: 2,
            },
          },
        ],
      };
    } else {
      alarmOption.value = {
        title: {
          text: '暂无数据',
          left: 'right',
          top: 'middle',
          textAlign: 'center',
          textVerticalAlign: 'middle',
          textStyle: {
            fontFamily: 'Manteka',
            fontSize: 16,
            fontWeight: 'normal',
            color: '#fff',
          },
        },
        series: [],
      };
    }
  };

  /**
   * @description: 获取数据
   */
  const getData = async () => {
    try {
      const res = await getCabinetAlarmPreview(props.cabinetId);
      alarmChartData.value = buildAlarmData(res.alarmPreview);
      setAlarmOption(res.alarmPreview);
      setEventOption(res.alarmClassifyTop5);
    } catch (error) {
      // 忽略请求取消的错误
      if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
        // console.error('获取告警数据失败:', error);
      }
    }
  };
  /**
   * @description: 告警数据构建
   */
  const buildAlarmData = (data) => {
    return data.map((item) => ({
      name: levelMap[item.level]?.name || '未知告警',
      value: item.count,
      color1: levelMap[item.level]?.color1 || 'rgba(255, 255, 255, 0.5)',
      color2: levelMap[item.level]?.color2 || 'rgba(255, 255, 255, 0.5)',
      itemStyle: {
        borderColor: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          {
            offset: 0,
            color: levelMap[item.level]?.color1 || 'rgba(255, 255, 255, 0.5)',
          },
          {
            offset: 1,
            color: levelMap[item.level]?.color2 || 'rgba(255, 255, 255, 0.5)',
          },
        ]),
        borderWidth: 2,
        borderType: 'solid',
      },
      label: {
        color: levelMap[item.level]?.color1 || 'rgba(255, 255, 255, 0.5)', // 使用 color1 作为标签颜色
      },
      labelLine: {
        lineStyle: {
          color: levelMap[item.level]?.color1 || 'rgba(255, 255, 255, 0.5)', // 使用 color1 作为引导线颜色
        },
      },
    }));
  };
  /**
   * @description: 告警图表颜色构建
   */
  const buildAlarmChartColors = (data) => {
    return data.map((item) => ({
      ...new echarts.graphic.LinearGradient(0, 0, 1, 1, [
        {
          offset: 0,
          color: levelMap[item.level]?.color1 || 'rgba(255, 255, 255, 0.5)',
        },
        {
          offset: 1,
          color: levelMap[item.level]?.color2 || 'rgba(255, 255, 255, 0.5)',
        },
      ]),
    }));
  };

  /**
   * @description: 事件设置图表数据
   */
  const setEventOption = (data) => {
    if (data.length > 0) {
      const totalEvents = data.reduce((acc, cur) => acc + cur.count, 0);
      eventOption.value = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(6, 23, 55, 0.9)',
          borderColor: 'rgba(59, 130, 246, 0.35)',
          textStyle: { color: '#e8f2ff' },
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          right: 50,
          top: 'center',
          textStyle: { color: '#e8f2ff', fontSize: 16 },
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 12,
          data: data.map((item) => item.type),
        },
        graphic: {
          type: 'text',
          left: '33%',
          top: '39%',
          style: {
            text: `${totalEvents}\n总数`,
            textAlign: 'center',
            textVerticalAlign: 'middle',
            fontSize: 18,
            fontWeight: 'bold',
            fill: '#e8f2ff',
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowBlur: 4,
            lineHeight: 24,
          },
        },
        series: [
          {
            name: '事件统计',
            type: 'pie',
            radius: ['32%', '56%'],
            center: ['38%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: buildEventData(data),
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.4)',
              },
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx: number) {
              return Math.random() * 200;
            },
          },
        ],
      };
    } else {
      eventOption.value = {
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
   * @description: 事件数据构建
   */
  const buildEventData = (data) => {
    return data.map((item) => ({
      name: item.type,
      value: item.count,
    }));
  };

  onMounted(() => {
    getData();
  });

  // 监听机柜ID变化，刷新告警/事件
  watch(
    () => props.cabinetId,
    () => {
      getData();
    }
  );
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

    .alarm-chart {
      display: flex;
      position: relative;
      flex-flow: row nowrap;
      align-items: center;
      width: 100%;
      height: 100%;
      place-content: flex-start flex-end;

      .chart-container {
        position: relative;
        width: 55%;
        height: 100%;
      }

      .list {
        display: flex;
        position: relative;
        flex-flow: column nowrap;
        place-content: flex-start space-around;
        align-items: flex-start;
        width: calc(50% - 20px);
        height: calc(100% - 0px);
        margin-right: 10px;

        .listItem {
          display: flex;
          flex-flow: row nowrap;
          place-content: flex-start space-between;
          align-items: center;
          width: calc(100% - 17px);
          height: 34px;
          margin-left: 8.5px;
          background: url('@/assets/images/layouts/title-item-bg.png') no-repeat;
          background-size: 100% 100%;
          font-size: 11.9px;

          .listIteml {
            display: flex;
            flex-flow: row nowrap;
            place-content: flex-start flex-start;
            align-items: center;
            width: 110.5px;
            color: #d4edff;
            font-size: 13.6px;
            font-weight: 500;

            .nameBody {
              flex-grow: 1;
              width: calc(85% - 23.8px);
              height: 21.25px;
              color: #d4edff;
              font-size: 13.6px;
              font-weight: 500;
              text-align: justify;
              text-align-last: justify;

              &::after {
                content: '';
                display: inline-block;
                width: 100%;
              }
            }
          }

          .listItemr {
            display: flex;
            flex-flow: row nowrap;
            place-content: flex-start flex-end;
            align-items: center;

            .listItemr2 {
              display: flex;
              flex-flow: row nowrap;
              place-content: flex-start flex-end;
              align-items: center;
              width: 59.5px;
            }

            span {
              margin-top: 4.25px;
              color: #d4edff;
              font-size: 10.2px;
              font-weight: 500;
            }

            em {
              color: #fff;
              font-family: DIN-Bold;
              font-size: 13.6px;
              font-weight: 500;
            }
          }

          span {
            color: rgb(255 255 255 / 100%);
            font-size: 11.9px;
            font-weight: 400;
            line-height: 17px;
          }

          .dot {
            flex-shrink: 0;
            width: 6.8px;
            height: 6.8px;
            margin-right: 8.5px;
            margin-left: 8.5px;
            border-radius: 50%;
          }

          .dot.disabled {
            background: rgba(#999, 0.8) !important;
          }

          span.disabled {
            color: rgba(#999, 0.8) !important;
          }

          .num {
            margin-right: 8.5px;
            color: #fff;
            font-family: DIN-Bold;
            font-size: 15.3px;
            font-weight: 500;
            text-shadow: 0 0 8.5px #258af3;
          }
        }
      }
    }

    .event-chart {
      width: 100%;
      height: 100%;
    }
  }
</style>
