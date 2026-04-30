<template>
  <a-layout class="en-default-layout">
    <LayoutHeader :position="headPosition" :isScene="showMenu">
      <BasicMenu :menuLabel="menuLabel" v-if="showMenu && menuType === 'top'" />
    </LayoutHeader>
    <LayoutContent>
      <template #sider>
        <Menu v-if="showMenu && menuType === 'left'" />
      </template>
    </LayoutContent>
  </a-layout>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import LayoutHeader from './header/index.vue';
  import LayoutContent from './content/index.vue';
  import { BasicMenu } from '@/components/MenuPanel';
  import Menu from './menu/visitor.vue';

  import WOW from 'wow.js';
  const props = defineProps({
    showMenu: {
      type: Boolean,
      default: () => true,
    },
    headPosition: {
      type: String,
      default: () => 'fixed',
    },
    menuType: {
      type: String,
      default: () => 'top',
    },
    menuLabel: {
      type: String,
      default: () => '',
    },
  });

  onMounted(() => {
    const wow = new WOW({
      boxClass: 'wow',
      animateClass: 'animated',
      offset: 0,
      mobile: true,
      live: true,
      scrollContainer: null,
      resetAnimation: true,
    });
    wow.init();
  });
</script>
<style lang="less" scoped>
  .en-default-layout {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
    background: url('@/assets/images/layouts/layout-bg.png') no-repeat center;
    background-size: 100% 100%;
  }
</style>
