<template>
  <div class="view">
    <div class="image-box">
      <img src="@/assets/images/layouts/room-image.png" alt="" />
    </div>
    <ul class="basis-container">
      <li class="item" v-for="(item, index) in fieldMap" :key="index">
        <div class="label">{{ item.label }}：</div>
        <div class="value">
          <span v-if="item.key === 'dutyName'">
            {{ viewData[item.key] || '---'
            }}{{ viewData.dutyPhone ? ' - ' + viewData.dutyPhone : '' }}{{ item.unit }}
          </span>
          <span v-else>{{ viewData[item.key] || '---' }}{{ item.unit }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
  //机房综合信息
  import { computed } from 'vue';
  import { useRoomStore } from '@/store/modules/room';

  const roomStore = useRoomStore();

  const fieldMap = [
    { label: '机房名称', key: 'name', unit: '' },
    { label: '负责人', key: 'dutyName', unit: '' },
    { label: '机房位置', key: 'address', unit: '' },
  ];
  const viewData = computed(() => roomStore.getComprehensiveInformationData) as any;
</script>
<style lang="less" scoped>
  .view {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 10px;
    color: #fff;
    font-size: 18px;

    .image-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 40%;
      margin-bottom: 20px;
      overflow: hidden;
      border-radius: 40px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .basis-container {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      min-height: 0;
      margin: 0;
      padding: 0;
      list-style: none;

      .item {
        display: flex;
        flex: 1 1 0;
        align-items: center;
        min-height: 0;
        color: #d8effc;
        font-weight: bold;

        &:not(:last-child) {
          margin-bottom: 10px;
        }

        .label {
          flex-shrink: 0;
          width: 150px;
          overflow: hidden;
          text-align: left;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .value {
          flex: 1;
          overflow: hidden;
          text-align: right;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
</style>
