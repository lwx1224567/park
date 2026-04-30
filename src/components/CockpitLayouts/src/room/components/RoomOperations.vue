<template>
  <div class="view">
    <div class="echarts-box">
      <v-chart autoresize :option="option"></v-chart>
    </div>
    <div class="progress-box">
      <div class="progress">
        <div class="title">
          <div>机柜空间利用率：</div>
          <div>{{ ((viewData.usagedU / viewData.sumU) * 100).toFixed(2) }}%</div>
        </div>
        <a-progress
          :percent="(viewData.usagedU / viewData.sumU) * 100"
          :stroke-color="{
            '0%': '#87d068',
            '100%': '#ffec19',
          }"
          :show-info="false"
        />
      </div>
      <div class="progress">
        <div class="title">
          <div>当前负载：</div>
          <div>{{ ((viewData.load / 1000000) * 100).toFixed(2) }}%</div>
        </div>
        <a-progress
          :percent="(viewData.load / 1000000) * 100"
          :stroke-color="{
            '0%': '#108ee9',
            '100%': '#21e970',
          }"
          :show-info="false"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import * as echarts from 'echarts';
  import 'echarts-gl';
  import { getPie3D } from './chart.js';
  //机房运维
  import { computed, onMounted, ref } from 'vue';
  import { useRoomStore } from '@/store/modules/room';
  const roomStore = useRoomStore();
  const option = ref<any>({}); // 图表配置项
  const viewData = computed(() => roomStore.getRoomOperationData) as any; //视图数据

  // 图表初始化
  function initChart() {
    // 传入数据生成 option, 构建3d饼状图, 参数工具文件已经备注的很详细
    option.value = getPie3D(
      viewData.value.deviceCount.map((Item) => ({ name: Item.nameZh, value: Item.count, ...Item })),
      0.6,
      180,
      26,
      18,
      1,
    );
    // 是否需要label指引线，如果要就添加一个透明的2d饼状图并调整角度使得labelLine和3d的饼状图对齐，并再次setOption
    option.value.series.push({
      name: '', //自己根据场景修改
      backgroundColor: 'transparent',
      type: 'pie',
      label: {
        opacity: 1,
        fontSize: 13,
        lineHeight: 20,
      },
      startAngle: -40, // 起始角度，支持范围[0, 360]。
      clockwise: false, // 饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
      radius: ['20%', '60%'],
      center: ['50%', '50%'],
      data: viewData.value.deviceCount.map((Item) => ({
        name: Item.nameZh,
        value: Item.count,
        ...Item,
      })),
      itemStyle: {
        opacity: 0, //这里必须是0，不然2d的图会覆盖在表面
      },
    });
  }

  onMounted(() => {
    initChart();
  });
</script>
<style lang="less" scoped>
  .view {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .echarts-box {
      flex: auto;
      width: 100%;
    }

    .progress-box {
      display: flex;
      flex-direction: column;
      width: 100%;

      .progress {
        display: flex;
        flex-direction: column;
        width: 100%;

        .title {
          display: flex;
          justify-content: space-between;
          width: 100%;
          color: #d8effc;
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
  }
</style>
