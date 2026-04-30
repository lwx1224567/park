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
        <Park :name="item.component"></Park>
      </Border3>
    </div>
  </div>
  <div
    class="cockpit-container right-0"
    :style="`grid-template-rows: repeat(${layoutsData.right.row}, 1fr);`"
  >
    <div
      v-for="(item, index) in layoutsData.right.components"
      :key="index"
      :style="`grid-row: ${item.column};`"
    >
      <Border3 :name="item.componentLabel" :delay="index * 0.5">
        <Park :name="item.component"></Park>
      </Border3>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue';
  import { Border3 } from '@/components/Border';
  import { useLayoutsStore } from '@/store/modules/layouts';
  import { useParkStore } from '@/store/modules/park';
  import Park from '@/components/CockpitLayouts/src/park/index.vue';
  const layoutsStore = useLayoutsStore();
  const layoutsData = computed(() => layoutsStore.getParkConfig) as any;
  const parkStore = useParkStore();
  parkStore.initData(); //初始化园区驾驶舱数据
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
