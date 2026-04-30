<template>
  <div class="view">
    <div class="item" v-for="(item, index) in labelData" :key="index">
      <div class="icon">
        <img :src="item.icon" alt="" />
      </div>
      <div class="label">
        <div class="title">{{ item.label }}：</div>
        <div class="value">
          <template
            v-if="
              item.key === 'airQuality' || item.key === 'smokeDetector' || item.key === 'flooding'
            "
          >
            <span :class="viewData[item.key] == '正常' ? 'success' : 'warning'">
              {{ viewData[item.key] || '--' }}{{ item.unit }}
            </span>
          </template>
          <template v-else> {{ viewData[item.key] || '--' }}{{ item.unit }} </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  //环境监测
  import { computed } from 'vue';
  import { useRoomStore } from '@/store/modules/room';
  const roomStore = useRoomStore();
  const labelData = [
    { label: '温度', key: 'temperature', icon: '/src/assets/icon/temperature.png', unit: '℃' },
    { label: '湿度', key: 'humidity', icon: '/src/assets/icon/humidity.png', unit: '%' },
    { label: '气体', key: 'airQuality', icon: '/src/assets/icon/gas.png', unit: '' },
    { label: '烟感', key: 'smokeDetector', icon: '/src/assets/icon/smoke-detector.png', unit: '' },
    { label: '水浸', key: 'flooding', icon: '/src/assets/icon/flooding.png', unit: '' },
  ];
  const viewData = computed(() => roomStore.getEnvironmentData) as any; //视图数据
</script>
<style lang="less" scoped>
  .view {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    width: 100%;
    height: 100%;

    .item {
      display: flex;
      position: relative;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      user-select: none;

      .icon {
        width: 50%;

        img {
          width: 100%;
        }
      }

      .label {
        display: flex;
        font-size: 16px;

        .title {
          color: #24bfff;
        }

        .value {
          .success {
            color: #00c800;
          }

          .warning {
            color: #ffa500;
          }
        }
      }
    }
  }
</style>
