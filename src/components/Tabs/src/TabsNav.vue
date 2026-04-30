<template>
  <div class="tabs-container">
    <div
      class="tab"
      :class="{ active: active == index }"
      v-for="(item, index) in tabs"
      :key="index"
      @click="getactive(index)"
    >
      <span>{{ item }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  const props = defineProps({
    tabs: { type: Array, default: () => [] },
    active: { type: [Number, String], default: 0 },
  });
  const emit = defineEmits(['update:active']);
  function getactive(e: number | string) {
    emit('update:active', e);
  }
</script>
<style lang="less" scoped>
  .tabs-container {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    transform-origin: right center;

    .tab {
      display: flex;
      position: relative;
      flex-flow: row nowrap;
      align-items: center;
      width: 86.7px;
      height: 100%;
      margin-right: -8.5px;
      opacity: 1;
      background: url('@/assets/images/layouts/tab-bg.png') center center no-repeat;
      background-size: 100% 100%;
      color: #00a2ff;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      place-content: flex-start center;

      &.active,
      &:hover {
        background: url('@/assets/images/layouts/tab-bg-active.png') center center no-repeat;
        background-size: 100% 100%;
        color: #fff;
      }
    }
  }
</style>
