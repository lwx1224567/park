<template>
  <div class="view-container">
    <!-- 综合信息 -->
    <BasicInfo v-if="name == 'basic-info'" />
    <!-- 设备列表 -->
    <DeviceList v-if="name == 'device-list'" />
    <!-- 告警统计 -->
    <AlarmStatistics v-if="name == 'alarm-statistics'" />
    <!-- 事件总览 -->
    <EventOverview v-if="name == 'event-overview'" />
    <!-- 实时告警 -->
    <RealTimeAlerts v-if="name == 'real-time-alerts'" />
  </div>
</template>
<script setup lang="ts">
  import BasicInfo from './components/BasicInfo.vue'; //综合信息
  import DeviceList from './components/DeviceList.vue'; //设备列表
  import AlarmStatistics from './components/AlarmStatistics.vue'; //告警统计
  import EventOverview from './components/EventOverview.vue'; //事件总览
  import RealTimeAlerts from './components/RealTimeAlerts.vue'; //实时告警
  const props = defineProps({
    name: {
      type: String,
      default: '',
    },
  });
</script>
<style lang="less" scoped>
  .view-container {
    width: 100%;
    height: 100%;
  }
</style>
