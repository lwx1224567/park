<template>
  <div class="view">
    <div class="tableHead">
      <div
        class="tableHeadItem"
        v-for="(item, index) in head"
        :key="index"
        :style="{ width: item.flex }"
      >
        <span>{{ item.label }}</span>
      </div>
    </div>
    <vue-seamless-scroll
      class="tableBody"
      :data="tableData"
      direction="top"
      :steep="0.3"
      roller
      :distance="20"
    >
      <div class="column" v-for="(column, columnIndex) in tableData" :key="columnIndex">
        <div
          class="row"
          v-for="(row, rowIndex) in head"
          :key="rowIndex"
          :style="{ width: row.flex }"
          @click="hangleClick(column)"
        >
          <template v-if="row.key === 'level'">
            <span :style="`color:${levelMap[column[row.key]].color};`">
              {{ levelMap[column[row.key]].name }}
            </span>
          </template>
          <template v-else-if="row.key === 'createTime'">
            {{ dayjs(column[row.key]).format('HH:mm:ss') }}
          </template>
          <template v-else-if="row.key === 'parkVo'">
            {{ column[row.key].address || '--' }}
          </template>
          <template v-else>
            <a-tooltip :title="column[row.key]">
              {{ column[row.key] }}
            </a-tooltip>
          </template>
        </div>
      </div>
    </vue-seamless-scroll>
  </div>
</template>

<script setup lang="ts">
  //实时告警
  import { computed } from 'vue';
  import { VueSeamlessScroll } from '@meruem117/vue-seamless-scroll';
  import dayjs from 'dayjs';
  import { useCabinetStore } from '@/store/modules/cabinet';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';
  const cabinetStore = useCabinetStore();

  // 表头
  const head = [
    { label: '告警信息', key: 'content', flex: '30%' },
    { label: '地点', key: 'parkVo', flex: '30%' },
    { label: '告警等级', key: 'level', flex: '20%' },
    { label: '时间', key: 'createTime', flex: '20%' },
  ];
  const levelMap = {
    1: {
      name: '紧急告警',
      color: 'rgba(255, 106, 106, 1)',
    },
    2: {
      name: '次要告警',
      color: 'rgba(232, 177, 27, 1)',
    },
    3: {
      name: '一般告警',
      color: 'rgba(22, 124, 230, 1)',
    },
  };
  const tableData = computed(() => cabinetStore.getCabinetRealTimeAlarmData) as any;
  // 点击事件
  const hangleClick = (item) => {
    TKEvenBus.getInstance().emit('focusRoomDeviceByDeviceId', item.parkId);
    TKEvenBus.getInstance().emit('handleHighlight', 0);
  };
</script>

<style lang="scss" scoped>
  .view {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .tableHead {
      display: flex;
      width: 100%;
      height: 32px;
      background-color: #004da3;
      box-shadow: 0 2px 4px rgb(0 0 0 / 20%);

      .tableHeadItem {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .tableBody {
      position: relative;
      width: 100%;
      height: calc(100% - 32px);
      overflow: hidden;

      .column {
        display: flex;
        position: relative;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
        height: 32px;
        margin-top: 5px;
        padding: 0 5px;
        border: 1px solid #1e5cce;
        cursor: pointer;

        .row {
          width: 100%;
          overflow: hidden;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        &:nth-child(odd) {
          background-color: rgba(30 92 206 / 20%);
        }

        &:nth-child(even) {
          background-color: rgba(30 92 206 / 50%);
        }
      }
    }
  }
</style>
