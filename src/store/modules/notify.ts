import { defineStore } from 'pinia';
import { store } from '@/store';
import { useGlobSetting } from '@/hooks/setting';
import { isUrl, isJSON } from '@/utils/is';
import { getToken } from '@/utils/auth';
import { useWebSocket, useEventSource } from '@vueuse/core';
import { useMessage } from '@/hooks/web/useMessage';
import { parse } from 'lossless-json';
import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';
import { watch } from 'vue';

const { createMessage } = useMessage();

const { success, warning } = createMessage;

export const useNotifyStore = defineStore('notify', {
  state: () => ({
    socketClose: () => {}, //保存 WebSocket关闭实例
    inspectionStatus: {},
  }),
  getters: {
    getInspectionStatus(state) {
      return state.inspectionStatus;
    },
  },
  actions: {
    /**
     * 初始化WebSocket
     */
    initWebSocket() {
      const { apiUrl, clientId } = useGlobSetting();
      let apiUrlStr = String(apiUrl);
      /**
       * 这里可能有两种情况 兼容dev模式的proxy或者prod模式但是没有用全路径比如http://xxx/xxx
       * 1. apiUrl为https://xxx.com/xxx
       * 2. apiUrl为/xxx
       * 转换后为http链接形式
       */
      if (!isUrl(apiUrl)) {
        // 协议+域名
        apiUrlStr = `${window.location.protocol}//${window.location.host}${apiUrl}`;
      }
      // 这里是http链接形式
      let websocketAddr = `${apiUrlStr}/resource/websocket?clientid=${clientId}&Authorization=Bearer ${getToken()}`;

      // http/https处理
      if (window.location.protocol.includes('https')) {
        websocketAddr = websocketAddr.replace('https://', 'wss://');
      } else {
        websocketAddr = websocketAddr.replace('http://', 'ws://');
      }

      const { close } = useWebSocket(websocketAddr, {
        // protocols: [`${getToken()}`] as any,
        autoReconnect: {
          // 重连最大次数
          retries: 10,
          // 重连间隔
          delay: 1000,
          onFailed() {
            console.log('websocket重连失败.');
          },
        },
        heartbeat: {
          message: JSON.stringify({ type: 'ping' }),
          // 发送心跳的间隔
          interval: 10000,
          // 接收到心跳response的超时时间
          pongTimeout: 2000,
        },
        onConnected() {
          console.log('websocket已经连接');
        },
        onDisconnected() {
          console.log('websocket已经断开');
        },
        onMessage: (_, message) => {
          if (isJSON(message.data)) {
            const data = parse(message.data) as any;
            console.log(data);
            if (data.type === 'inspection') {
              // 巡检状态
              this.inspectionStatus = data.data.parkVo;
            }
            if (data.type === 'inspectionEnd') {
              //巡检结束
              TKEvenBus.getInstance().emit('hideInspectionDetail');
            }
          }
        },
      });
      this.socketClose = close;
    },
    /**关闭WebSocket连接 */
    closeWebSocket() {
      this.socketClose();
    },
    /**
     * 监听sse
     */
    listenWithSSE() {
      const { apiUrl, clientId } = useGlobSetting();
      const sseAddr = `${apiUrl}/resource/sse?clientid=${clientId}&Authorization=Bearer ${getToken()}`;
      const { data } = useEventSource(sseAddr, [], {
        autoReconnect: {
          retries: 3,
          delay: 1000,
          onFailed() {
            console.log('sse重连失败.');
          },
        },
      });
      watch(data, (message) => {
        if (!message) return;
        if (isJSON(message)) {
          const data = JSON.parse(message);
          if (data.type === 'inspection') {
            // 巡检状态
            this.inspectionStatus = data.data;
          }
          if (data.type === 'inspectionEnd') {
            //巡检结束
            TKEvenBus.getInstance().emit('hideInspectionDetail');
          }
        }
      });
    },
  },
  persist: false,
});

export function useNotifyStoreWithOut() {
  return useNotifyStore(store);
}
