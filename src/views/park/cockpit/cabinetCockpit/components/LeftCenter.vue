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
    <!-- 空状态 -->
    <div v-if="tableData.length === 0" class="empty-state">
      暂无数据
    </div>
    
    <div v-else class="tableBody">
      <div 
        v-for="(item, index) in tableData" 
        :key="'item-' + index"
        class="tableBody2" 
        :class="{ 'selected': selectedDeviceId === item.id }"
        @click="handleDeviceClick(item)"
      >
        <div
          v-for="(headItem, headIndex) in head"
          :key="'head-' + headIndex"
          class="tableBody2Item"
          :style="{ width: headItem.flex }"
        >
          {{ item[headItem.key] || '—' }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { getCabinetDeviceList } from '@/api/cockpit/cabinetManage';
  import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';

  // 接收父组件传递的机柜ID
  const props = defineProps<{
    cabinetId: string;
  }>();

  const tableData = ref<any[]>([]);
  const selectedDeviceId = ref<string>('');

  const head = ref([
    { title: '设备名称', flex: '50%', key: 'name' },
    { title: '占位数', flex: '25%', key: 'uSize' },
    { title: '所在U位', flex: '25%', key: 'uNum' },
  ]);

  // 为兼容部分模板或外层组件的依赖，补充 list 计算属性
  const list = computed(() => tableData.value);

  // 事件总线实例
  const eventBus = TKEvenBus.getInstance();

  /**
   * @description: 获取数据
   */
  const getData = async () => {
    try {
      // console.log('获取设备列表数据，机柜ID:', props.cabinetId);
      const json = await getCabinetDeviceList(props.cabinetId);
      // console.log('设备列表API响应:', json);
      // 兼容两种返回：{code,msg,data} 或 直接对象
      const data = (json && json.data !== undefined) ? json.data : (json || {});
      const res = Array.isArray(data?.children) ? data.children : [];
      // console.log('解析后的设备数据:', res);
      // console.log('设备数据长度:', res.length);
      
      // 验证数据结构
      // if (res.length > 0) {
      //   console.log('第一个设备数据:', res[0]);
      //   console.log('设备数据字段:', Object.keys(res[0]));
      // }
      
      // 数据去重，根据id去重
      const uniqueData = res.filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      );
      
      tableData.value = uniqueData;
      
      // 默认选择第一个设备
      // if (uniqueData.length > 0 && !selectedDeviceId.value) {
      //   selectedDeviceId.value = uniqueData[0].id;
      //   // 触发设备切换事件
      //   eventBus.emit('deviceChanged', {
      //     deviceId: uniqueData[0].id,
      //     deviceName: uniqueData[0].name,
      //     deviceData: uniqueData[0]
      //   });
      // }
      
      // console.log('tableData.value 设置后:', tableData.value);
      // console.log('list computed 值:', list.value);
    } catch (err) {
      // console.error('获取设备列表数据失败:', err);
      tableData.value = [];
    }
  };

  // 处理设备点击事件
  const handleDeviceClick = (device: any) => {

    if (device && device.id) {
      selectedDeviceId.value = device.id;
      // 触发设备切换事件
      eventBus.emit('deviceChanged', {
        deviceId: device.id,
        deviceName: device.name,
        deviceData: device
      });

    }
  };

  onMounted(() => {
    getData();
    // 订阅外部设备切换（来自三维模型或其他组件）
    eventBus.on('deviceChanged', handleExternalDeviceChanged);
  });

  onUnmounted(() => {
    // 取消订阅，避免内存泄漏
    eventBus.off('deviceChanged', handleExternalDeviceChanged);
  });

  // 监听机柜ID变化：重置选中并重新获取列表（加载完后默认联动第一个）
  watch(
    () => props.cabinetId,
    () => {
      selectedDeviceId.value = '';
      tableData.value = [];
      getData();
    }
  );

  // 外部设备切换处理：仅更新高亮，不重复触发事件，避免循环
  const handleExternalDeviceChanged = (payload: any) => {
    const incomingId = payload?.deviceId;
    if (!incomingId) return;
    // 若列表内存在该设备，则高亮；否则忽略（可能属于其他机柜）
    const exists = tableData.value.some(item => item?.id === incomingId);
    if (exists) {
      selectedDeviceId.value = incomingId;
    }
  };
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

    .empty-state {
      position: relative;
      width: 100%;
      height: calc(100% - 32px);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00b2ff;
      font-size: 14px;
    }

    .tableBody {
      position: relative;
      width: 100%;
      height: calc(100% - 32px);
      overflow-y: auto;
      overflow-x: hidden;
      
      // 自定义滚动条样式
      &::-webkit-scrollbar {
        width: 4px;
      }
      
      &::-webkit-scrollbar-track {
        background: rgba(0, 194, 255, 0.1);
        border-radius: 2px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: rgba(0, 194, 255, 0.3);
        border-radius: 2px;
        
        &:hover {
          background: rgba(0, 194, 255, 0.5);
        }
      }

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
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(0, 194, 255, 0.1);
        }

        &.selected {
          background: linear-gradient(90deg, rgba(0, 194, 255, 0.2), rgba(0, 194, 255, 0.1));
          border-left: 3px solid #00b2ff;
        }

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
      }
    }
  }
</style>
