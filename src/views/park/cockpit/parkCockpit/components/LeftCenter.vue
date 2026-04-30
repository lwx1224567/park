<template>
  <div class="tableCom green">
    <div class="tableHead">
      <div class="tableHeads">
        <div
          class="tableHeadItem"
          v-for="(item, index) in head"
          :key="index"
          :style="{ width: item.flex }"
        >
          <span class="title">
            {{ item.title }}
          </span>
        </div>
      </div>
    </div>
    <vue-seamless-scroll
      class="tableBody"
      :data="list"
      direction="top"
      :steep="0.3"
      roller
      :distance="20"
    >
      <div class="tableBody2" v-for="(item, index) in tableData" :key="'item-' + index">
        <div
          v-for="(head, headIndex) in head"
          :key="'head-' + headIndex"
          class="tableBody2Item"
          :style="{ width: head.flex }"
        >
          <template v-if="head.key === 'operation'">
            <button class="view-btn" @click.stop="handleView(item)">查看</button>
          </template>
          <template v-else-if="head.key === 'createTime'">
            {{ formatTime(item[head.key]) }}
          </template>
          <template v-else-if="head.key === 'status'">
            <span :class="getStatusClass(item[head.key])">{{ formatStatus(item[head.key]) }}</span>
          </template>
          <template v-else-if="head.key === 'level'">
            <span :class="getLevelClass(item[head.key])">{{ formatLevel(item[head.key]) }}</span>
          </template>
          <template v-else>
            {{ item[head.key] }}
          </template>
        </div>
      </div>
    </vue-seamless-scroll>
  </div>
</template>
<script setup lang="ts">
  import { VueSeamlessScroll } from '@meruem117/vue-seamless-scroll';
  import { getParkAlarmEventFlow } from '@/api/cockpit/parkManage';
  import { ref, onMounted, computed } from 'vue';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';
  const tableData = ref([]);
  const list = computed(() => tableData.value);
  const bus = TKEvenBus.getInstance();
  const emit = defineEmits<{ (e: 'view', row: any): void }>();
  // 接收父组件传递的园区ID
  const props = defineProps<{
    parkId: string;
  }>();

  const head = ref([
    { title: '报警信息', flex: '30%', key: 'content' },
    { title: '级别', flex: '15%', key: 'level' },
    { title: '时间', flex: '15%', key: 'createTime' },
    { title: '状态', flex: '30%', key: 'status' },
    // { title: '操作', flex: '20%', key: 'operation' },
  ]);
  /**
   * @description: 获取数据  getParkAlarmEventFlow
   */
  const getData = async () => {
    try {
      const res = await getParkAlarmEventFlow(props.parkId);
      tableData.value = res;
      // console.log('获取告警数据'+JSON.stringify(res));
      const alarmDataForHighlight = [];

      for (const item of tableData.value) {
        // console.log('=====');
        // console.log(item);
        if (item.status == 1) {
          if (
            item.parkVo.categoryVo &&
            (item.parkVo.categoryVo.nameEn === 'Switch_1U' ||
              item.parkVo.categoryVo.nameEn === 'Switch_2U' ||
              item.parkVo.categoryVo.nameEn === 'Switch_3U')
          ) {
            alarmDataForHighlight.push({ deviceId: item.parkVo.parentId });
            // console.log('alarmDataForHighlight', alarmDataForHighlight);
          }
          alarmDataForHighlight.push({ deviceId: item.parkVo.id });
        }
      }
      // 发送告警数据更新事件，触发设备高亮
      // 只处理正在告警的设备（status === 1）
      // const alarmDataForHighlight = res?.filter(alarm => alarm.status === 1).map(alarm => ({
      //   deviceId: alarm.parkVo?.id || alarm.parkId,
      // })) || [];

      // 发送告警数据更新事件
      bus.emit('alarmDataUpdated', alarmDataForHighlight);
      // console.log('机房实时告警数据已发送:', alarmDataForHighlight);
    } catch (error) {
      // console.error('获取实时告警数据失败:', error);
    }
  };
  const handleView = (item: any) => {
    // console.log('查看详情:', item.parkVo);
    //展开楼层
    // TKEvenBus.getInstance().emit('storeyExpand');
    // 通过事件总线发送聚焦设备事件
    // 根据设备类型和设备ID来聚焦到对应的3D模型
    if (item.parkVo && item.parkVo.id) {
      // 判断是否为机柜设备
      if (item.parkVo.categoryVo && item.parkVo.categoryVo.nameEn.startsWith('Switch')) {
        bus.emit('handleDblClickEvent', {
          deviceId: item.parkVo.parentId,
        });
        // console.log("当前为机柜内设备:"+item.parkVo.parentId);
      } else {
        // 发送聚焦事件，让3D场景聚焦到对应设备
        bus.emit('handleDblClickEvent', {
          deviceId: item.parkVo.id,
        });
        // console.log("当前为机柜:"+item.parkVo.id);
      }
    }
    //测试切换到监控设备视角
    // bus.emit('handleDblClickEvent', {
    //   deviceId: "1972546236808400900"
    // });
    //测试入侵
    // 任意处：开始入侵
    // 发送告警数据更新事件
    // bus.emit('alarmDataUpdated', [{ device: "1972546236808400900" }]);
  };

  // 仅保留时间到 HH:mm:ss
  const formatTime = (value: any) => {
    if (!value) return '—';
    try {
      const str = String(value);
      if (str.includes('T')) {
        const d = new Date(str);
        if (!isNaN(d.getTime())) {
          const h = String(d.getHours()).padStart(2, '0');
          const m = String(d.getMinutes()).padStart(2, '0');
          const s = String(d.getSeconds()).padStart(2, '0');
          return `${h}:${m}:${s}`;
        }
      }
      const parts = str.split(' ');
      if (parts.length > 1) return parts[1].slice(0, 8);
      if (/^\d{2}:\d{2}:\d{2}/.test(str)) return str.slice(0, 8);
      const d2 = new Date(str);
      if (!isNaN(d2.getTime())) {
        const h = String(d2.getHours()).padStart(2, '0');
        const m = String(d2.getMinutes()).padStart(2, '0');
        const s = String(d2.getSeconds()).padStart(2, '0');
        return `${h}:${m}:${s}`;
      }
    } catch (_) {}
    return '—';
  };

  // 状态：1 正在告警，0 结束告警
  const formatStatus = (value: any) => {
    const num = Number(value);
    if (num === 1) return '正在告警';
    if (num === 0) return '结束告警';
    return '—';
  };
  const getStatusClass = (value: any) => {
    const num = Number(value);
    return num === 1 ? 'status-active' : num === 0 ? 'status-ended' : '';
  };

  // 级别：1 紧急告警Critical 2 次要告警Minor 3 一般告警
  const formatLevel = (value: any) => {
    const num = Number(value);
    if (num === 1) return '紧急';
    if (num === 2) return '次要';
    if (num === 3) return '一般';
    return String(value ?? '—');
  };
  const getLevelClass = (value: any) => {
    const num = Number(value);
    if (num === 1) return 'level-critical';
    if (num === 2) return 'level-minor';
    if (num === 3) return 'level-normal';
    return '';
  };

  onMounted(() => {
    getData();
  });
</script>

<style scoped lang="scss">
  .tableCom {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .tableHead {
      display: flex;
      position: relative;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 34px;
      background: rgb(0 164 234 / 18%);

      .tableHeads {
        display: flex;
        position: relative;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 32px;

        .tableHeadItem {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: center;
          color: #00b2ff;
          font-size: 14px;
          font-weight: bold;

          .title {
            position: relative;
            color: #00b2ff;
            font-size: 14px;
            font-weight: bold;
            text-align: left;
          }
        }
      }
    }

    .tableBody {
      position: relative;
      width: 100%;
      height: calc(100% - 32px);
      overflow: hidden;

      .tableBody2 {
        display: flex;
        position: relative;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 32px;
        padding-left: 0;
        border-bottom: 2px solid rgb(0 194 255 / 20%);

        .tableBody2Item {
          display: flex;
          position: relative;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          overflow: hidden;
          font-size: 14px;
          font-weight: 400;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .view-btn {
          padding: 2px 8px;
          color: #00b2ff;
          background: transparent;
          border: 1px solid rgba(0, 178, 255, 0.6);
          border-radius: 3px;
          cursor: pointer;
        }
        .view-btn:hover {
          background: rgba(0, 178, 255, 0.1);
        }
      }
    }
  }

  /* 颜色区分样式 */
  .status-active {
    color: #ff6b6b;
  }
  .status-ended {
    color: #35c88a;
  }

  .level-critical {
    color: #ff4d4f;
    font-weight: 600;
  }
  .level-minor {
    color: #faad14;
  }
  .level-normal {
    color: #1890ff;
  }
</style>
