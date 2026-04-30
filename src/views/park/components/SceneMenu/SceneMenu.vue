<template>
  <div class="scene-menu-wrapper">
    <!-- 基础菜单 -->
    <BasicMenu />
    <!-- 机房运维菜单 -->
    <RoomMenu v-if="menuConfig.type.includes('room')" :curLayer="menuConfig.data" />
    <!-- 周界安防菜单 -->
    <SecurityMenu v-if="menuConfig.type.includes('security')" />
    <!-- 园区设施菜单 -->
    <FacilityMenu v-if="menuConfig.type.includes('facility')" />
  </div>
  <LayersMenu />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';
  import BasicMenu from './src/BasicMenu.vue'; //机房菜单
  import RoomMenu from './src/RoomMenu.vue'; //机房菜单
  import SecurityMenu from './src/SecurityMenu.vue'; //周界安防菜单
  import FacilityMenu from './src/FacilityMenu.vue'; //园区设施菜单
  import LayersMenu from './src/LayersMenu.vue';
  // 菜单配置
  const menuConfig = ref({
    type: [] as string[],
    data: {} as any,
  });

  //菜单显示隐藏
  const toggleMenu = (config) => {
    menuConfig.value = config;
  };

  onMounted(async () => {
    TKEvenBus.getInstance().on('toggleSceneMenu', toggleMenu);
  });
</script>

<style scoped lang="less">
  .scene-menu-wrapper {
    display: flex;
    position: absolute;
    top: 5vw;
    right: 25%;
    flex-direction: column;
    width: 50px;
    height: auto;
    gap: 15px;

    .item {
      width: 100%;
      height: 50px;
      transition: all 0.3s;
      border: 1px solid #03a3ff;
      background: radial-gradient(circle, #043870 0%, #174474 50%, #6196c4 100%);
      cursor: pointer;

      .icom {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;

        img {
          width: 80%;
          height: auto;
        }
      }

      &:hover {
        transform: translateY(-2px);
        background: radial-gradient(circle, #006cff 0%, #006cff 50%, #6196c4 100%);
      }

      &.active {
        background: radial-gradient(circle, #006cff 0%, #006cff 50%, #6196c4 100%);
      }
    }
  }
</style>
