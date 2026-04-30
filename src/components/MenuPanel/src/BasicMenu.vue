<template>
  <div class="menu-container">
    <BaseMenuItem v-for="(item, index) in menuData" :key="index" :menu="item" />
  </div>
</template>
<script setup name="Menu">
  import { computed } from 'vue';
  import BaseMenuItem from './BaseMenuItem.vue';

  import { useMenuStore } from '@/store/modules/menu';
  const props = defineProps({
    menuLabel: {
      type: String,
      default: () => '',
    },
  });

  const menuStore = useMenuStore();
  const menuData = computed(() => menuStore.getMenuList[props.menuLabel]);
</script>

<style lang="scss" scoped>
  .menu-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 0 15px 10px;
    text-align: center;
    gap: 20px;
  }
</style>
