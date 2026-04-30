<template>
  <div class="main left-0">
    <Border3 name="机房信息" :delay="0"><LeftTop :id="id"></LeftTop> </Border3>
    <Border3 name="告警与事件总览" :delay="0.5"><LeftCenter :id="id"></LeftCenter> </Border3>
    <Border3 name="实时告警" :delay="1"><LeftBottom :id="id"></LeftBottom></Border3>
  </div>
  <div class="main right-0">
    <Border3 name="配电详情" :delay="0"><RightTop :id="id"></RightTop></Border3>
    <Border3 name="视频监控" :delay="0.5"><RightCenter :id="id"></RightCenter></Border3>
    <Border3 name="趋势分析" :delay="1"><RightBottom :id="id"></RightBottom></Border3>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';
  import { Border3 } from '@/components/Border';
  import {
    LeftTop,
    LeftCenter,
    LeftBottom,
    RightTop,
    RightCenter,
    RightBottom,
  } from './components';
  const id = ref('1972546232463101953');
  const initStorey = (roomId) => {
    id.value = roomId;
  };
  onMounted(() => {
    TKEvenBus.getInstance().on('initRoomId', initStorey);
  });
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
  }
</style>
