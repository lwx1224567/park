<template>
  <div class="main left-0">
    <Border3 name="综合信息" :delay="0">
      <LeftTop :park-id="parkId" />
    </Border3>
    <Border3 name="动态事件" :delay="0.5">
      <LeftCenter :park-id="parkId" />
    </Border3>
    <Border3 name="能效管理" :delay="1">
      <LeftBottom :park-id="parkId" />
    </Border3>
  </div>

  <div class="main right-0">
    <Border3 name="安防状态" :delay="0">
      <RightTop :park-id="parkId" />
    </Border3>
    <Border3 name="视频监控" :delay="0.5">
      <RightCenter :park-id="parkId" />
    </Border3>
    <Border3 name="告警统计" :delay="1">
      <RightBottom :park-id="parkId" />
    </Border3>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { Border3 } from '@/components/Border';
  import {
    LeftTop,
    LeftCenter,
    LeftBottom,
    RightTop,
    RightCenter,
    RightBottom,
  } from './components';

  // 统一定义园区ID
  const parkId = ref('1972546232370827265');
</script>

<style scoped lang="less">
  .main {
    display: flex;
    position: absolute;
    z-index: 10;
    top: 100px;
    bottom: 0;
    flex-direction: column;
    width: 22%;
    padding: 0 15px 15px;
    gap: 20px;

    .item {
      flex: 1;
    }

    .grid-wrap {
      position: relative;
      height: 100%;
    }
  }
</style>
