import { onUnmounted } from 'vue';
import { useUserStoreWithOut } from '@/store/modules/user';

interface SocketOptions {
  heartbeatInterval?: number;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

class Socket {
  url: string;
  ws: WebSocket | null = null;
  opts: SocketOptions;
  reconnectAttempts: number = 0;
  listeners: { [key: string]: Function[] } = {};
  heartbeatInterval: number | null = null;

  constructor(url: string, opts: SocketOptions = {}) {
    this.url = url;
    this.opts = {
      heartbeatInterval: 30000,
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
      ...opts,
    };

    this.init();
  }

  init() {
    const userStore = useUserStoreWithOut();
    const token = userStore.getToken;
    this.ws = new WebSocket(this.url, token);
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onerror = this.onError.bind(this);
    this.ws.onclose = this.onClose.bind(this);
  }

  onOpen(event: Event) {
    this.reconnectAttempts = 0;
    this.startHeartbeat();
    this.emit('open', event);
  }

  onMessage(event: MessageEvent) {
    this.emit('message', event.data);
  }

  onError(event: Event) {
    // console.log("连接已经断开");
    // console.error('WebSocket error:', event);
    this.emit('error', event);
  }

  onClose(event: CloseEvent) {
    this.stopHeartbeat();
    this.emit('close', event);
    if (this.reconnectAttempts < this.opts.maxReconnectAttempts!) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.init();
      }, this.opts.reconnectInterval);
    }
  }

  startHeartbeat() {
    if (!this.opts.heartbeatInterval) return;

    this.heartbeatInterval = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send('ping');
      }
    }, this.opts.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  send(data: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      // console.error('WebSocket is not open. Cannot send:', data);
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string) {
    if (this.listeners[event]) {
      delete this.listeners[event];
    }
  }

  emit(event: string, data: any) {
    this.listeners[event]?.forEach((callback) => callback(data));
  }

  close() {
    if (this.ws) {
      this.ws.close(); // 主动关闭 WebSocket 连接
      this.ws = null; // 清空 WebSocket 实例
      this.stopHeartbeat(); // 停止心跳
    }
  }
}

export function useSocket(url: string, opts?: SocketOptions) {
  const socket = new Socket(url, opts);

  onUnmounted(() => {
    // socket.off('open');
    // socket.off('message');
    // socket.off('error');
    // socket.off('close');
    // socket.close();
  });

  return {
    socket,
    send: socket.send.bind(socket),
    on: socket.on.bind(socket),
    off: socket.off.bind(socket),
    close: socket.close.bind(socket),
  };
}
