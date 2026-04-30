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
    <div v-if="tableData.length === 0" class="empty-info">暂无数据</div>
    <vue-seamless-scroll
       v-else
       class="tableBody"
       :data="tableData"
       direction="top"
       :steep="0.3"
       roller
       :distance="20"
     >
       <div class="tableBody2" v-for="(item, index) in tableData" :key="'item-' + index" @click="handlePortClick(item)" style="cursor: pointer;">
         <div
           v-for="(head, headIndex) in head"
           :key="'head-' + headIndex"
           class="tableBody2Item"
           :style="{ width: head.flex }"
         >
           <span v-if="head.key === 'type'" :class="getTypeClass(item.type)">
             {{ getTypeText(item.type) }}
           </span>
           <span v-else-if="head.key === 'isFront'" :class="getFrontClass(item.isFront)">
             {{ getFrontText(item.isFront) }}
           </span>
           <span v-else-if="head.key === 'linkType'" :class="getLinkClass(item.linkType)">
             {{ getLinkText(item.linkType) }}
           </span>
           <span v-else>
             {{ item[head.key] || '—' }}
           </span>
         </div>
       </div>
    </vue-seamless-scroll>
  </div>
</template>
<script setup lang="ts">
  import { VueSeamlessScroll } from '@meruem117/vue-seamless-scroll';
  import { getDevicePortDistribution } from '@/api/cockpit/cabinetManage';
  import { ref, onMounted, onUnmounted } from 'vue';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';
  
  // 定义emit事件
  const emit = defineEmits<{
    portClick: [portId: string, linkId: string];
  }>();
  
  // 定义端口数据类型
  interface PortData {
    id: number;
    modelName: string;
    portName: string;
    type: number;
    isFront: number;
    linkType: boolean;
    linkId: number | null;
    positionX: number | null;
    positionY: number | null;
    positionZ: number | null;
    rotationX: number | null;
    rotationY: number | null;
    rotationZ: number | null;
    scaleX: number | null;
    scaleY: number | null;
    scaleZ: number | null;
    baseOffsetX: number | null;
    baseOffsetY: number | null;
    baseOffsetZ: number | null;
    deptId: string | null;
    remark: string | null;
  }
  
  const tableData = ref<PortData[]>([]);
  const currentDeviceId = ref<string>('');

  // 事件总线实例
  const eventBus = TKEvenBus.getInstance();

  const head = ref([
  { title: '端口名', flex: '30%', key: 'portName' },
  { title: '类型', flex: '20%', key: 'type' },
  { title: '设备正反面', flex: '20%', key: 'isFront' },
  { title: '连接状态', flex: '30%', key: 'linkType' },
  ]);
   /**
    * @description: 获取数据
    */
   // 处理端口点击事件
   const handlePortClick = (port: PortData) => {
     const portId = port.id.toString();
     const linkId = port.linkId ? port.linkId.toString() : '1';
     emit('portClick', portId, linkId);
   };

   const getData = async (deviceId: string) => {
     if (!deviceId) return;
     try {
       const res = await getDevicePortDistribution(deviceId);
      tableData.value = Array.isArray(res?.parkPortVoList) ? res.parkPortVoList : [];
      // 加载完成后，若有数据则默认选中第一条并联动端口连接关系
      if (tableData.value.length > 0) {
        handlePortClick(tableData.value[0]);
      }
     } catch (error) {
       // console.error('获取端口分布数据失败:', error);
       tableData.value = [];
     }
   };

   // 处理设备切换事件
   const handleDeviceChanged = (eventData: any) => {
     if (eventData && eventData.deviceId) {
       currentDeviceId.value = eventData.deviceId;
      tableData.value = [];
      getData(eventData.deviceId);
     }
   };

   // 类型映射函数
   const getTypeText = (type: number) => {
     switch (type) {
       case 0: return '电源';
       case 1: return '网口';
       case 2: return '光口';
       default: return '—';
     }
   };

   const getTypeClass = (type: number) => {
     switch (type) {
       case 0: return 'type-power';
       case 1: return 'type-network';
       case 2: return 'type-fiber';
       default: return '';
     }
   };

   // 正反面映射函数
   const getFrontText = (isFront: number) => {
     switch (isFront) {
       case 0: return '反面';
       case 1: return '正面';
       default: return '—';
     }
   };

   const getFrontClass = (isFront: number) => {
     switch (isFront) {
       case 0: return 'front-back';
       case 1: return 'front-front';
       default: return '';
     }
   };

   // 连接状态映射函数
   const getLinkText = (linkType: boolean) => {
     return linkType ? '已连接' : '未连接';
   };

   const getLinkClass = (linkType: boolean) => {
     return linkType ? 'link-connected' : 'link-disconnected';
   };

   onMounted(() => {
     // 监听设备切换事件
     eventBus.on('deviceChanged', handleDeviceChanged);
   });

   onUnmounted(() => {
     // 取消事件监听
     eventBus.off('deviceChanged', handleDeviceChanged);
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
       }
     }

  .empty-info {
    position: relative;
    width: 100%;
    height: calc(100% - 32px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00b2ff;
    font-size: 0.95em;
  }
   }

   // 类型样式
   .type-power {
     color: #ff6b6b;
     font-weight: 500;
   }
   .type-network {
     color: #4ade80;
     font-weight: 500;
   }
   .type-fiber {
     color: #60a5fa;
     font-weight: 500;
   }

   // 正反面样式
   .front-back {
     color: #f59e0b;
     font-weight: 500;
   }
   .front-front {
     color: #10b981;
     font-weight: 500;
   }

   // 连接状态样式
   .link-connected {
     color: #10b981;
     font-weight: 500;
   }
   .link-disconnected {
     color: #ef4444;
     font-weight: 500;
   }
 </style>
