<template>
  <div class="view">
    <div class="title-conter">
      <div class="item-box">
        <div class="item">
          <div class="border-box">
            <div class="item-title">设备名称：</div>
            <div class="item-content">{{ deviceInfo.deviceName || '--' }}</div>
          </div>
        </div>
      </div>
      <div class="item-box">
        <div class="item">
          <div class="border-box">
            <div class="item-title">设备类型：</div>
            <div class="item-content">{{ deviceInfo.deviceType || '--' }}</div>
          </div>
        </div>
      </div>
      <div class="item-box">
        <div class="item">
          <div class="border-box">
            <div class="item-title">设备尺寸：</div>
            <div class="item-content">{{ deviceInfo.specification || '--' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="legend-box">
      <div class="legend">
        <div class="legend-item">
          <div class="legend-color bg-[#00ff42]"></div>
          <span>空闲</span>
        </div>
        <div class="legend-item">
          <div class="legend-color bg-[#f2f507]"></div>
          <span>使用</span>
        </div>
        <div class="legend-item">
          <div class="legend-color bg-[#ff0036]"></div>
          <span>异常</span>
        </div>
      </div>
    </div>

    <!-- 板卡和端口容器 -->
    <div class="boards-container">
      <div
        class="board-section item-box"
        v-for="(board, index) in deviceInfo.boardPark"
        :key="index"
      >
        <div class="board-title">{{ board.parkVo.name }}</div>
        <div class="port-grid" v-if="board.parkPortVoList && board.parkPortVoList.length > 0">
          <div
            class="port-item"
            v-for="(port, pIndex) in board.parkPortVoList"
            :key="pIndex"
            :class="`port-${getPortStatus(port)}`"
            @click="handlePortClick(port)"
          >
            <a-popover>
              <template #content>
                <div class="popover-box">
                  <div class="popup-header">
                    <div class="popup-name">{{ port.portName || '--' }}</div>
                    <div class="popup-status" :class="`popup-${getPortStatus(port)}`">{{
                      getStatusText(getPortStatus(port))
                    }}</div>
                  </div>
                  <div class="popup-item">
                    <span class="popup-label">连接端口：</span>
                    <span class="popup-value">{{ getConnectionPortName(port) }}</span>
                  </div>
                  <div class="popup-item">
                    <span class="popup-label">上传速度：</span>
                    <span class="popup-value">{{ formatSpeed(port.portTx) }}</span>
                  </div>
                  <div class="popup-item">
                    <span class="popup-label">下载速度：</span>
                    <span class="popup-value">{{ formatSpeed(port.portRx) }}</span>
                  </div>
                </div>
              </template>
              <img class="icon-img" :src="getStatusImg(getPortStatus(port))" alt="" />
              <div class="port-label">{{ port.portName }}</div>
            </a-popover>
          </div>
        </div>
        <div v-else class="no-ports-message">-- 该模块无端口 --</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  //园区基础信息
  import { computed } from 'vue';
  import { useCabinetStore } from '@/store/modules/cabinet';
  import greenImg from '@/assets/components/DeviceInfo/green.png';
  import yellowImg from '@/assets/components/DeviceInfo/yellow.png';
  import redImg from '@/assets/components/DeviceInfo/red.png';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';
  import { getContinuousPath } from '@/api/cockpit/cabinetManage';

  const cabinetStore = useCabinetStore();
  const deviceInfo = computed(() => cabinetStore.getDeviceInfoData) as any;

  /**
   * 端口点击事件
   * @param port 端口信息
   */
  const handlePortClick = async (port: any) => {
    if (!port.parkId || !port.endParkVo || !port.startParkVo) return;
    const response = await getContinuousPath(port.linkId, port.id, port.parkId);
    const data = (response?.data?.data ?? response?.data ?? response ?? {}) as any;
    console.log('response:', data.endCabinetVo?.id);
    TKEvenBus.getInstance().emit('devicePortConnect', data);
  };

  interface ApiPort {
    id: number;
    portName: string;
    linkType: boolean | null;
    endParkPortVo?: { portName?: string | null } | null;
    portTx?: number | null;
    portRx?: number | null;
  }

  // 获取状态图片
  const getStatusImg = (status: string) => {
    const imgMap: Record<string, string> = {
      idle: greenImg,
      using: yellowImg,
      abnormal: redImg,
    };
    return imgMap[status] || greenImg;
  };

  // 根据后端数据计算状态
  const getPortStatus = (port: ApiPort | null | undefined): 'idle' | 'using' | 'abnormal' => {
    if (!port) return 'abnormal';
    if (port.linkType === true) return 'using';
    if (port.linkType === false) return 'idle';
    // 为 null 或 undefined 视为异常
    return 'abnormal';
  };

  // 获取连接端口名
  const getConnectionPortName = (port: any) => {
    return port?.endParkPortVo?.portName || '--';
  };

  // 速度格式化 (KB/S)
  const formatSpeed = (val: number | null | undefined) => {
    if (val === null || val === undefined) return '--';
    return `${val}KB/S`;
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      idle: '空闲',
      using: '使用中',
      abnormal: '异常',
    };
    return texts[status] || '空闲';
  };
</script>
<style lang="less" scoped>
  .view {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .title-conter {
      display: flex;
      flex-direction: column;
      padding: 10px 5px;
      gap: 15px;

      .item-box {
        display: flex;
        width: 100%;

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
            align-items: flex-end;
            width: 100%;
            height: 100%;
            padding: 0 0 8px;
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
      }
    }

    // 图例容器
    .legend-box {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 14px 10px;

      .legend {
        display: flex;
        gap: 16px;

        .legend-item {
          display: flex;
          align-items: center;
          color: #d8effc;
          font-size: 14px;
          gap: 6px;

          .legend-color {
            width: 16px;
            height: 16px;
            border-radius: 2px;
          }
        }
      }
    }

    // 板卡和端口容器
    .boards-container {
      flex: auto;
      padding: 10px;
      overflow: hidden auto;
      display: flex;
      flex-direction: column;
      gap: 20px; // 板卡之间的间距
    }

    .board-section {
      display: flex;
      flex-direction: column;
      gap: 10px; // 标题和网格的间距
    }

    .board-title {
      color: #d8effc;
      font-size: 16px;
      font-weight: bold;
      padding-bottom: 8px;
      border-bottom: 1px solid #30b4ff;
    }

    .port-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      width: 100%;
      gap: 15px;

      .port-item {
        transition: all 0.3s;
        cursor: pointer;

        .icon-img {
          width: 100%;
        }

        .port-label {
          margin-top: 5px;
          overflow: hidden;
          color: #d8effc;
          font-size: 14px;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        &:hover {
          transform: translateY(-2px);
          filter: brightness(1.2);
        }
      }
    }

    .no-ports-message {
      color: rgba(255, 255, 255, 0.5);
      font-size: 14px;
      text-align: center;
      padding: 20px;
    }
  }

  .popover-box {
    display: flex;
    flex-direction: column;
    width: 150px;
    gap: 10px;
    user-select: none;

    .popup-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 5px;
      border-bottom: 1px solid #30b4ff;

      .popup-name {
        overflow: hidden;
        color: #d8effc;
        font-size: 16px;
        font-weight: bold;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .popup-status {
        color: #00ff42;
        font-size: 16px;
        font-weight: bold;
        white-space: nowrap;

        &.popup-idle {
          color: #00ff42;
        }

        &.popup-using {
          color: #f2f507;
        }

        &.popup-abnormal {
          color: #ff0036;
        }
      }
    }

    .popup-item {
      display: flex;

      .popup-value {
        flex: auto;
        color: #d8effc;
        text-align: right;
      }
    }
  }
</style>
