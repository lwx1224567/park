<template>
  <a-layout-header class="en-layout-header" :style="`position: ${position};`">
    <top
      :name="globSetting.title"
      :mate="
        !isScene
          ? { path: '/asset/index', title: '管理中台' }
          : { path: '/tkzw/park', title: '场景视图' }
      "
    />
    <slot />
  </a-layout-header>
</template>

<script lang="ts" setup>
  import Top from './components/top/index.vue';
  import { useGlobSetting } from '@/hooks/setting';

  const props = defineProps({
    position: {
      type: String,
      required: true,
      default: () => 'fixed',
    },
    isScene: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  });

  const globSetting = useGlobSetting();
</script>
<style lang="less" scoped>
  .en-layout-header {
    z-index: 101;
    width: 100%;
    height: auto;
    margin: 0;
    padding: 0;
    background-color: transparent;
    line-height: initial;
    user-select: none;
  }
</style>
