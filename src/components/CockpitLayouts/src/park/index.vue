<template>
  <div class="view-container">
    <!-- 综合信息 -->
    <BasicInfo v-if="name == 'basic-info'" />
    <!-- 动态事件 -->
    <DynamicEvents v-if="name == 'dynamic-event'" />
    <!-- 告警统计 -->
    <AlarmStatistics v-if="name == 'alarm-statistics'" />
    <!-- 告警排行榜TOP5 -->
    <AlarmRankingTop5 v-if="name == 'alarm-ranking-top5'" />
    <!-- 停车位信息 -->
    <ParkingSpaceInfo v-if="name == 'parking-space-info'" />
    <!-- 安防状态-->
    <SecurityStatus v-if="name == 'security-status'" />
    <!-- 视频监控-->
    <VideoSurveillance v-if="name == 'video-surveillance'" />
    <!-- 能耗分析-用电-->
    <EnergyElectricity v-if="name == 'energy-electricity'" />
    <!-- 能耗分析-用水-->
    <EnergyWater v-if="name == 'energy-water'" />
    <!-- 能耗分析-天然气-->
    <EnergyGas v-if="name == 'energy-gas'" />
    <!-- 访客数据-->
    <VisitorSystem v-if="name == 'visitor-system'" />
    <!-- 维保信息-->
    <MaintenanceStatistics v-if="name == 'maintenance-statistics'" />
  </div>
</template>
<script setup lang="ts">
  import BasicInfo from './components/BasicInfo.vue'; //综合信息
  import DynamicEvents from './components/DynamicEvents.vue'; //动态事件
  import AlarmStatistics from './components/AlarmStatistics.vue'; //告警统计
  import AlarmRankingTop5 from './components/AlarmRankingTop5.vue'; //告警排行榜TOP5
  import ParkingSpaceInfo from './components/ParkingSpaceInfo.vue'; //停车位信息
  import SecurityStatus from './components/SecurityStatus.vue'; //安防状态
  import VideoSurveillance from './components/VideoSurveillance.vue'; //监控视频
  import EnergyElectricity from './components/EnergyElectricity.vue'; //能耗分析-用电
  import EnergyWater from './components/EnergyWater.vue'; //能耗分析-用电
  import EnergyGas from './components/EnergyGas.vue'; //能耗分析-用电
  import VisitorSystem from './components/VisitorSystem.vue'; //访客系统
  import MaintenanceStatistics from './components/MaintenanceStatistics.vue'; //维保信息
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
