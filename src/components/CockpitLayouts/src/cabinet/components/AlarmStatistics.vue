<template>
  <div class="view">
    <div class="echarts-box">
      <v-chart autoresize :option="option"></v-chart>
      <div class="desc">
        <div class="echartsTitle">{{ total }}</div>
        <div class="echartsDesc">告警次数</div>
      </div>
    </div>
    <div class="list">
      <div
        class="listItem"
        @click="getChecked(index)"
        v-for="(item, index) in viewData"
        :key="index"
      >
        <div class="label">
          <div
            class="dot"
            :class="{ disabled: !item.checked }"
            :style="
              'background: linear-gradient(80deg,' + item.color1 + ' 0%, ' + item.color2 + ' 100%);'
            "
          >
          </div>
          <span :class="{ disabled: !item.checked }">{{ item.name }}</span>
        </div>
        <em class="num">{{ getPercentage(item.value) }}</em>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  //告警统计
  import * as echarts from 'echarts';
  import { computed, onMounted, ref, watch } from 'vue';
  import { useCabinetStore } from '@/store/modules/cabinet';
  const cabinetStore = useCabinetStore();
  const basicData = computed(() => cabinetStore.getCabinetAlarmStatisticsData) as any;

  const viewData = ref<any[]>([]); // 视图数据
  const option = ref({}); // 图表配置项
  const total = computed(() => {
    return basicData.value.reduce((acc, cur) => acc + cur.count, 0);
  });
  //监听数据
  watch(basicData.value, () => {
    viewData.value = buildData(basicData.value);
    setOption();
  });
  /**
   * 获取选中的告警等级
   */
  const getChecked = (index) => {
    viewData.value[index].checked = !viewData.value[index].checked;
    setOption();
  };
  /**
   * 获取百分比
   * @param {number} value
   * @return {string}
   */
  const getPercentage = (value) => {
    return ((value / total.value) * 100).toFixed(2) + '%';
  };
  const levelMap = {
    1: {
      name: '紧急告警',
      color1: 'rgba(255, 106, 106, 1)',
      color2: 'rgba(199, 21, 21, 0.5)',
    },
    2: {
      name: '次要告警',
      color1: 'rgba(224, 103, 21, 1)',
      color2: 'rgba(232, 177, 27, 1)',
    },
    3: {
      name: '一般告警',
      color1: 'rgba(22, 124, 230, 1)',
      color2: 'rgba(56, 218, 237, 1)',
    },
  };
  /**
   * @description: 设置图表数据
   */
  const setOption = () => {
    if (viewData.value.length > 0) {
      let res = [] as any[];
      let colorList = [] as any[];
      viewData.value.forEach((el) => {
        if (el.checked) {
          const item = {
            ...el,
            itemStyle: {
              normal: {
                borderColor: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                  {
                    offset: 0,
                    color: el.color1,
                  },
                  {
                    offset: 1,
                    color: el.color2,
                  },
                ]),
              },
            },
          };
          res.push(item);
        }
        const colorItem = new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          {
            offset: 0,
            color: el.color1,
          },
          {
            offset: 1,
            color: el.color2,
          },
        ]);
        colorList.push(colorItem);
      });
      option.value = {
        color: colorList,
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['70%', '90%'],
            labelLine: {
              normal: {
                length: 10,
                lineStyle: {
                  type: 'dashed', // 设置为虚线
                  color: '#fff', // 可以指定虚线的颜色
                },
              },
            },
            label: {
              show: false,
              formatter: '{c}',
              color: '#fff',
              fontSize: 14,
            },
            itemStyle: {
              normal: {
                borderColor: '#3eebc4',
                borderWidth: 0,
              },
            },
            data: res,
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
  /**
   * @description: 构建图表数据
   */
  const buildData = (data) => {
    return data.map((item) => ({
      value: item.count,
      checked: true,
      ...levelMap[item.level],
    }));
  };
  onMounted(() => {
    if (basicData.value.length > 0) {
      viewData.value = buildData(basicData.value);
      setOption();
    }
  });
</script>
<style lang="less" scoped>
  .view {
    display: flex;
    width: 100%;
    height: 100%;

    .echarts-box {
      position: relative;
      width: 50%;
      background: url('@/assets/images/huanbg.png') center center no-repeat;

      .desc {
        display: flex;
        position: absolute;
        flex-flow: column nowrap;
        place-content: flex-start center;
        align-items: center;
        pointer-events: none;
        inset: 0;

        .echartsTitle {
          color: #00f8be;
          font-family: MicrosoftYaHei;
          font-size: 20px;
          font-weight: bold;
        }

        .echartsDesc {
          color: #fff;
          font-family: MicrosoftYaHei;
          font-size: 14px;
          font-weight: 400;
        }
      }
    }

    .list {
      display: flex;
      flex-flow: column nowrap;
      place-content: flex-start center;
      align-items: center;
      width: 50%;
      height: 100%;
      padding: 0 20px;

      .listItem {
        display: flex;
        flex-flow: row nowrap;
        place-content: flex-start space-between;
        align-items: center;
        width: 100%;
        padding: 5px 0;

        .label {
          display: flex;
          flex-flow: row nowrap;
          place-content: flex-start flex-start;
          align-items: center;
          font-weight: 400;
          cursor: pointer;

          .dot {
            width: 14px;
            height: 14px;
            margin-right: 10px;
            border: 2px solid rgb(255 255 255);
            border-radius: 50%;

            &.disabled {
              background: rgba(#999, 0.8) !important;
            }
          }

          span.disabled {
            color: rgba(#999, 0.8) !important;
          }
        }
      }
    }
  }
</style>
