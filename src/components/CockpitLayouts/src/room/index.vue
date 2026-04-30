<template>
  <div class="view-container">
    <!-- 环境监测 -->
    <EnvironmentalMonitoring v-if="name == 'environmental-monitoring'" />
    <!-- 机房运维 -->
    <RoomOperations v-if="name == 'room-operations'" />
    <!-- 配电详情 -->
    <DistributionDetails v-if="name == 'distribution-details'" />
    <!-- 实时告警 -->
    <RealTimeAlerts v-if="name == 'real-time-alerts'" />
    <!-- 告警统计 -->
    <AlarmStatistics v-if="name == 'alarm-statistics'" />
    <!-- 事件总览 -->
    <EventOverview v-if="name == 'event-overview'" />
    <!-- 综合信息 -->
    <ComprehensiveInfo v-if="name == 'comprehensive-info'" />
    <!-- 设备列表 -->
    <DeviceList v-if="name == 'device-list'" />
    <!-- 视频监控 -->
    <VideoSurveillance v-if="name == 'video-surveillance'" />
    <!-- 数据分析 -->
    <DataAnalysis v-if="name == 'data-analysis'" />
  </div>
</template>
<script setup lang="ts">
  import EnvironmentalMonitoring from './components/EnvironmentalMonitoring.vue'; //环境监测
  import RoomOperations from './components/RoomOperations.vue'; //机房运维
  import DistributionDetails from './components/DistributionDetails.vue'; //配电详情
  import RealTimeAlerts from './components/RealTimeAlerts.vue'; //实时告警
  import AlarmStatistics from './components/AlarmStatistics.vue'; //告警统计
  import EventOverview from './components/EventOverview.vue'; //事件总览
  import ComprehensiveInfo from './components/ComprehensiveInfo.vue'; //综合信息
  import DeviceList from './components/DeviceList.vue'; //设备列表
  import VideoSurveillance from './components/VideoSurveillance.vue'; //视频监控
  import DataAnalysis from './components/DataAnalysis.vue'; //数据分析
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
