<template>
  <div class="view">
    <div class="item-box">
      <div class="item">
        <div class="border-box">
          <div class="item-title">机柜信息：</div>
          <div class="item-content">{{ viewData.cabinetInfo.name || '--' }}</div>
        </div>
      </div>
    </div>
    <div class="item-box">
      <div class="item">
        <div class="border-box">
          <div class="item-title">机柜位置：</div>
          <div class="item-content">{{ viewData.cabinetInfo.address || '--' }}</div>
        </div>
      </div>
    </div>
    <div class="item-box">
      <div class="item">
        <div class="border-box">
          <div class="item-title">机柜类型：</div>
          <div class="item-content">{{ viewData.cabinetInfo.modelName || '--' }}</div>
        </div>
      </div>
    </div>
    <div class="item-box">
      <div class="item">
        <div class="border-box">
          <div class="item-title">机柜载重：</div>
          <div class="item-content">{{ viewData.ratedLoad || '--' }}</div>
        </div>
      </div>
    </div>
    <div class="item-box">
      <div class="item">
        <div class="border-box">
          <div class="item-title">剩余空间：</div>
          <div class="item-content">{{ viewData.sumU - viewData.usagedU || '--' }}</div>
        </div>
      </div>
    </div>
    <div class="item-box">
      <div class="progress-box">
        <div class="progress-title">实时温度：</div>
        <div class="progress">
          <a-progress
            :stroke-color="{
              '0%': '#108ee9',
              '100%': '#f8c517',
            }"
            :percent="(viewData.temperature / 100) * 100"
            :show-info="false"
          />
        </div>
        <div class="value">{{ viewData.temperature || '--' }}℃</div>
      </div>
    </div>
    <div class="item-box">
      <div class="progress-box">
        <div class="progress-title">实时湿度：</div>
        <div class="progress">
          <a-progress
            :stroke-color="{
              '0%': '#108ee9',
              '100%': '#f8c517',
            }"
            :show-info="false"
            :percent="(viewData.humidity / 100) * 100"
          />
        </div>
        <div class="value">{{ viewData.humidity || '--' }}%</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  //机柜基础信息
  import { computed } from 'vue';
  import { useCabinetStore } from '@/store/modules/cabinet';
  const cabinetStore = useCabinetStore();

  const viewData = computed(() => cabinetStore.getCabinetComprehensiveInformationData) as any;
</script>
<style lang="less" scoped>
  .view {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(7, 1fr);
    width: 100%;
    height: 100%;

    .item-box {
      display: flex;

      .item {
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
        padding-right: 45px;
        color: #d8effc;
        font-size: 18px;
        font-weight: bold;

        .border-box {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          border-bottom: 2px solid #30b4ff;
          gap: 10px;

          .item-content {
            flex: auto;
            overflow: hidden;
            text-align: right;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        &::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 38px;
          background: url('@/assets/icon/title-bg-icon.png') no-repeat center bottom;
          background-size: 100% auto;
        }
      }

      .progress-box {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        padding-right: 20px;
        color: #d8effc;
        font-size: 18px;
        font-weight: bold;
        gap: 10px;

        .progress {
          flex: auto;
          padding-top: 8px;
        }
      }
    }
  }
</style>
