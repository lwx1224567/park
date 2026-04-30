<template>
  <div class="inspection-progress" v-if="isShow">
    <div class="device-container">
      <div class="title">巡检设备列表</div>
      <div class="device-ul">
        <div class="device-li" v-for="(device, index) in inspectionDeviceList" :key="index">
          <div class="name">{{ device.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';

  const inspectionDeviceList = ref<any>([]);
  const isShow = ref<boolean>(false);

  const handleInspectionProgress = (data) => {
    isShow.value = data.show || false;
  };

  onMounted(() => {
    TKEvenBus.getInstance().on('inspectionProgress', handleInspectionProgress);
  });
</script>

<style scoped lang="less">
  .inspection-progress {
    position: absolute;
    top: 20%;
    right: 2%;
    z-index: 100;
    width: 300px;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid #5299d3;
    padding: 10px;

    .device-container {
      .title {
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .device-ul {
        .device-li {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          color: #fff;
        }
      }
    }
  }
</style>
