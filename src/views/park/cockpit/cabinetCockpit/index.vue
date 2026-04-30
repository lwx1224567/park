<template>
  <div class="main left-0">
    <Border3 name="机柜信息" :delay="0">
      <LeftTop :cabinet-id="cabinetId" />
    </Border3>
    <Border3 name="设备列表" :delay="0.5">
      <LeftCenter :cabinet-id="cabinetId" />
    </Border3>
    <Border3 name="告警与事件总览" :delay="1">
      <LeftBottom :cabinet-id="cabinetId" />
    </Border3>
  </div>

  <div class="main right-0">
    <Border3 name="设备信息" :delay="0">
      <RightTop />
    </Border3>
    <Border3 name="端口分布" :delay="0.5">
      <RightCenter @port-click="handlePortClick" />
    </Border3>
    <Border3 name="端口连接关系" :delay="1">
      <RightBottom :port-id="portId" :link-id="linkId" />
    </Border3>
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
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

  // 统一定义机柜ID
  const cabinetId = ref('');

  // 端口连接关系参数
  const portId = ref('1');
  const linkId = ref('1');

  // 处理端口点击事件
  const handlePortClick = (newPortId: string, newLinkId: string) => {
    portId.value = newPortId;
    linkId.value = newLinkId;
  };
  /**
   * @description: 初始化机柜
   * @param {string} id
   * @return {void}
   */
  const initCabinetStorey = (config) => {
    cabinetId.value = config.id;
  };
  onMounted(() => {
    TKEvenBus.getInstance().on('initCabinetStorey', initCabinetStorey);
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

    .grid-wrap {
      position: relative;
      height: 100%;
    }
  }
</style>
