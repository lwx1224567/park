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
        <Room :name="item.component"></Room>
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
        <Room :name="item.component"></Room>
      </Border3>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue';
  import { Border3 } from '@/components/Border';
  import { useLayoutsStore } from '@/store/modules/layouts';
  // import { useRoomStore } from '@/store/modules/room';
  import Room from '@/components/CockpitLayouts/src/room/index.vue';
  const layoutsStore = useLayoutsStore();
  const layoutsData = computed(() => layoutsStore.getRoomConfig) as any;
  // const roomStore = useRoomStore();
  // roomStore.initData(); //初始化机房驾驶舱数据
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
