<template>
  <div
    class="cockpit-container left-0"
    :style="`grid-template-rows: repeat(${layoutsData.left.row}, 1fr);`"
  >
    <div
      v-for="(item, index) in layoutsData.left.components"
      :key="index"
      :style="`grid-row: ${item.column};`"
    >
      <Border3 :name="item.componentLabel" :delay="index * 0.5">
        <Cabinet :name="item.component"></Cabinet>
      </Border3>
    </div>
  </div>
  <div
    class="cockpit-container right-0"
    :style="`grid-template-rows: repeat(${layoutsData.right.row}, 1fr);`"
    v-if="isDevice"
  >
    <div
      v-for="(item, index) in layoutsData.right.components"
      :key="index"
      :style="`grid-row: ${item.column};`"
    >
      <Border3 :name="item.componentLabel" :delay="index * 0.5">
        <Device :name="item.component"></Device>
      </Border3>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
  import { Border3 } from '@/components/Border';
  import { useLayoutsStore } from '@/store/modules/layouts';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';
  import Cabinet from '@/components/CockpitLayouts/src/cabinet/index.vue';
  import Device from '@/components/CockpitLayouts/src/device/index.vue';
  const isDevice = ref(false);
  const layoutsStore = useLayoutsStore();
  const layoutsData = computed(() => layoutsStore.getCabinetConfig) as any;
  // 设备切换
  const toggleDeviceView = (status) => {
    isDevice.value = status;
  };
  onMounted(() => {
    TKEvenBus.getInstance().on('toggleDeviceView', toggleDeviceView);// 设备切换视图切换
  });
  onBeforeUnmount(() => {
    TKEvenBus.getInstance().off('toggleDeviceView', toggleDeviceView);// 清理所有事件监听器，防止内存泄漏
  });
</script>
<style lang="less" scoped>
  .cockpit-container {
    display: grid;
    position: absolute;
    z-index: 10;
    top: 5vw;
    bottom: 0;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(1, 1fr);
    flex-direction: column;
    width: 25%;
    padding: 0 15px 15px;
    gap: 15px;
  }
</style>
