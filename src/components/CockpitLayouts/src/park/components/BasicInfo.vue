<template>
  <div class="view">
    <div class="image-box">
      <img src="@/assets/icon/park-logo.png" alt="" />
    </div>
    <ul class="basis-container">
      <li class="item" v-for="(item, index) in fieldMap" :key="index">
        <div class="label">{{ item.label }}：</div>
        <div class="value">{{ viewData[item.key] || '---' }}{{ item.unit }}</div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
//园区基础信息
import { computed } from 'vue';
import { useParkStore } from '@/store/modules/park';
const parkStore = useParkStore();

const fieldMap = [
  { label: '园区名称', key: 'name', unit: '' },
  { label: '当日值班', key: 'dutyName', unit: '' },
  { label: '联系电话', key: 'dutyPhone', unit: '' },
  { label: '园区地址', key: 'address', unit: '' },
  { label: '占地面积', key: 'floorArea', unit: '㎡' },
];
const viewData = computed(() => parkStore.getBasicInfo) as any;
</script>
<style lang="less" scoped>
.view {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 18px;

  .image-box {
    width: 100px;
    padding: 20px 20px 20px 5px;

    img {
      width: 100%;
    }
  }

  .basis-container {
    display: flex;
    flex-direction: column;
    width: calc(100% - 100px);
    height: 100%;

    .item {
      display: flex;
      flex: 1;
      align-items: center;
      color: #d8effc;
      font-weight: bold;

      .label {
        width: 40%;
        overflow: hidden;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .value {
        flex: auto;
        overflow: hidden;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
