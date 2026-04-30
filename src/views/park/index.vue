<template>
  <div class="park">
    <Park></Park>
    <div class="action-bottom">
      <BusinessMenu></BusinessMenu>
    </div>
    <BasicLayouts v-if="cockpitType === 'park'" />
    <RoomLayouts v-if="cockpitType === 'room'" />
    <CabinetLayouts v-if="cockpitType === 'cabinet'" />
    <SceneMenu></SceneMenu>
    <!-- 临时测试按钮 -->
    <div
      style="position: absolute; top: 80px; left: 50%; transform: translateX(-50%); z-index: 999"
    >
      <button
        @click="goToDeviceDetail"
        style="
          padding: 8px 16px;
          background: #0096ff;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        "
      >
        测试设备详情页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';
  import Park from '@/views/park/components/Park.vue';
  import { BasicLayouts, RoomLayouts, CabinetLayouts } from '@/components/CockpitLayouts';
  import BusinessMenu from './components/BusinessMenu.vue';
  import SceneMenu from './components/SceneMenu/SceneMenu.vue';
  import { useRouter } from 'vue-router'; // ✅ 引入 useRouter

  const router = useRouter(); // ✅ 实例化 router
  const cockpitType = ref('park');

  const toggleCockpit = (type) => {
    cockpitType.value = type;
  };

  // ✅ 跳转方法
  const goToDeviceDetail = () => {
    router.push('/park/device-detail/test-001');
  };

  onMounted(async () => {
    TKEvenBus.getInstance().on('toggleCockpit', toggleCockpit);
  });

  onBeforeUnmount(() => {
    TKEvenBus.getInstance().off('toggleCockpit', toggleCockpit);
  });
</script>

<style scoped lang="less">
  .park {
    position: relative;
    width: 100%;
    height: 100%;

    .action-bottom {
      position: absolute;
      z-index: 10;
      right: 25%;
      bottom: 0;
      left: 25%;
    }
  }
</style>
