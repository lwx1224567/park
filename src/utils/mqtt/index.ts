import mqtt, { type MqttClient, type IClientOptions } from 'mqtt';

export interface MqttConfig {
  url: string;
  username?: string;
  password?: string;
  clientId?: string;
  options?: IClientOptions;
}

export class MqttService {
  private client: MqttClient | null = null;
  private config: MqttConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private messageHandlers: Map<string, Array<(topic: string, message: any) => void>> = new Map();

  constructor(config: MqttConfig) {
    this.config = {
      ...config,
      clientId: config.clientId || `mqtt_client_${Math.random().toString(16).slice(2, 10)}`,
    };
  }

  /**
   * 连接MQTT服务器
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const options: IClientOptions = {
          clientId: this.config.clientId,
          username: this.config.username,
          password: this.config.password,
          clean: true,
          reconnectPeriod: 5000,
          connectTimeout: 30000,
          ...this.config.options,
        };

        this.client = mqtt.connect(this.config.url, options);

        this.client.on('connect', () => {
          console.log('MQTT连接成功');
          this.reconnectAttempts = 0;
          resolve();
        });

        this.client.on('error', (error) => {
          console.error('MQTT连接错误:', error);
          reject(error);
        });

        this.client.on('reconnect', () => {
          this.reconnectAttempts++;
          console.log(`MQTT重连中... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('MQTT重连失败,已达到最大重连次数');
            this.disconnect();
          }
        });

        this.client.on('close', () => {
          console.log('MQTT连接已关闭');
        });

        this.client.on('message', (topic, message) => {
          this.handleMessage(topic, message);
        });
      } catch (error) {
        console.error('MQTT连接失败:', error);
        reject(error);
      }
    });
  }

  /**
   * 订阅主题
   */
  subscribe(topic: string | string[], callback?: (topic: string, message: any) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        reject(new Error('MQTT客户端未连接'));
        return;
      }

      const topics = Array.isArray(topic) ? topic : [topic];

      // 设置QoS为0
      this.client.subscribe(topics, { qos: 0 }, (error) => {
        if (error) {
          console.error('订阅主题失败:', error);
          reject(error);
        } else {
          // 注册回调函数
          if (callback) {
            topics.forEach((t) => {
              if (!this.messageHandlers.has(t)) {
                this.messageHandlers.set(t, []);
              }
              this.messageHandlers.get(t)!.push(callback);
            });
          }
          
          resolve();
        }
      });
    });
  }

  /**
   * 取消订阅主题
   */
  unsubscribe(topic: string | string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        reject(new Error('MQTT客户端未连接'));
        return;
      }

      const topics = Array.isArray(topic) ? topic : [topic];

      this.client.unsubscribe(topics, (error) => {
        if (error) {
          console.error('取消订阅失败:', error);
          reject(error);
        } else {
          console.log('取消订阅成功:', topics);
          
          // 移除回调函数
          topics.forEach((t) => {
            this.messageHandlers.delete(t);
          });
          
          resolve();
        }
      });
    });
  }

  /**
   * 发布消息
   */
  publish(topic: string, message: string | object, options?: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        reject(new Error('MQTT客户端未连接'));
        return;
      }

      const payload = typeof message === 'string' ? message : JSON.stringify(message);

      this.client.publish(topic, payload, options || {}, (error) => {
        if (error) {
          console.error('发布消息失败:', error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * 处理接收到的消息
   */
  private handleMessage(topic: string, message: Buffer) {
    try {
      const payload = message.toString();
      let parsedMessage: any;

      try {
        parsedMessage = JSON.parse(payload);
      } catch {
        parsedMessage = payload;
      }
      // 执行所有注册的回调函数
      const handlers = this.messageHandlers.get(topic);
      if (handlers) {
        handlers.forEach((handler) => {
          try {
            handler(topic, parsedMessage);
          } catch (error) {
            console.error('消息处理回调执行失败:', error);
          }
        });
      }
    } catch (error) {
      console.error('消息处理失败:', error);
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.messageHandlers.clear();
      console.log('MQTT已断开连接');
    }
  }

  /**
   * 检查连接状态
   */
  isConnected(): boolean {
    return this.client?.connected || false;
  }

  /**
   * 获取客户端实例
   */
  getClient(): MqttClient | null {
    return this.client;
  }
}

// 创建单例实例
let mqttInstance: MqttService | null = null;

/**
 * 获取MQTT实例
 */
export function getMqttInstance(config?: MqttConfig): MqttService {
  if (!mqttInstance && config) {
    mqttInstance = new MqttService(config);
  }
  
  if (!mqttInstance) {
    throw new Error('MQTT实例未初始化,请先提供配置');
  }
  
  return mqttInstance;
}

/**
 * 销毁MQTT实例
 */
export function destroyMqttInstance(): void {
  if (mqttInstance) {
    mqttInstance.disconnect();
    mqttInstance = null;
  }
}

export default MqttService;
