import { onMounted, onUnmounted, ref } from 'vue';
import { getMqttInstance, destroyMqttInstance, type MqttConfig } from '@/utils/mqtt';

export function useMqtt(config: MqttConfig) {
  const isConnected = ref(false);
  const error = ref<Error | null>(null);
  const mqttClient = getMqttInstance(config);

  /**
   * 连接MQTT
   */
  const connect = async () => {
    try {
      await mqttClient.connect();
      isConnected.value = true;
      error.value = null;
    } catch (err) {
      error.value = err as Error;
      isConnected.value = false;
      console.error('MQTT连接失败:', err);
    }
  };

  /**
   * 订阅主题
   */
  const subscribe = async (
    topic: string | string[],
    callback?: (topic: string, message: any) => void,
  ) => {
    try {
      await mqttClient.subscribe(topic, callback);
    } catch (err) {
      console.error('订阅主题失败:', err);
      throw err;
    }
  };

  /**
   * 取消订阅
   */
  const unsubscribe = async (topic: string | string[]) => {
    try {
      await mqttClient.unsubscribe(topic);
    } catch (err) {
      console.error('取消订阅失败:', err);
      throw err;
    }
  };

  /**
   * 发布消息
   */
  const publish = async (topic: string, message: string | object, options?: any) => {
    try {
      await mqttClient.publish(topic, message, options);
    } catch (err) {
      console.error('发布消息失败:', err);
      throw err;
    }
  };

  /**
   * 断开连接
   */
  const disconnect = () => {
    mqttClient.disconnect();
    isConnected.value = false;
  };

  // 组件挂载时自动连接
  onMounted(() => {
    connect();
  });

  // 组件卸载时断开连接
  onUnmounted(() => {
    disconnect();
  });

  return {
    isConnected,
    error,
    connect,
    subscribe,
    unsubscribe,
    publish,
    disconnect,
    mqttClient,
  };
}
