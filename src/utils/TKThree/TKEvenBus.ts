
// 事件总线类
class TKEvenBus {
  private events: Map<string, Function[]> = new Map();
  private static instance: TKEvenBus;
  private constructor() {
  }

  public static getInstance() {
    if (!TKEvenBus.instance) {
      TKEvenBus.instance = new TKEvenBus();
    }
    return TKEvenBus.instance;
  }

  // 订阅事件
  on(event: string, callback: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)?.push(callback);
  }

  // 取消订阅事件
  off(event: string, callback: Function) {
    if (this.events.has(event)) {
      const callbacks = this.events.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  // 触发事件
  emit(event: string, ...args: any[]) {
    if (this.events.has(event)) {
      const callbacks = this.events.get(event);
      if (callbacks) {
        callbacks.forEach(callback => {
          callback(...args);
        });
      }
    }
  }

  // 一次性订阅事件
  once(event: string, callback: Function) {
    const onceWrapper = (...args: any[]) => {
      callback(...args);
      this.off(event, onceWrapper);
    };
    this.on(event, onceWrapper);
  }
}

export {TKEvenBus};
