import * as THREE from 'three';
import {TKEvenBus} from './TKEvenBus';
import {TKBaseObject} from './TKBaseObject';
import {RoomDevice} from '@/views/park/models/roomDevice/RoomDevice';

/**
 * 设备轮廓高亮管理器
 * 用于根据实时告警数据控制设备轮廓长亮
 */
export class TKAlarmManager {
  private static instance: TKAlarmManager;
  private highlightedDevices: Map<string, TKBaseObject> = new Map();

  private constructor() {
    this.initEventListeners();
  }

  public static getInstance(): TKAlarmManager {
    if (!TKAlarmManager.instance) {
      TKAlarmManager.instance = new TKAlarmManager();
    }
    return TKAlarmManager.instance;
  }


  /**
   * 初始化事件监听
   */
  private initEventListeners(): void {
    // 监听实时告警数据更新
    TKEvenBus.getInstance().on('alarmDataUpdated', this.handleAlarmDataUpdate.bind(this));
    // 监听设备聚焦事件
    TKEvenBus.getInstance().on('handleDblClickEvent', this.handleFocusDevice.bind(this));

  }

  /**
   * 处理实时告警数据更新
   * @param alarmData 告警数据
   */
  private handleAlarmDataUpdate(alarmData: any[]): void {

    console.log('处理告警数据:', alarmData);

    // 获取当前需要高亮的设备ID列表
    const newHighlightedDevices = new Set<string>();

    if (alarmData && Array.isArray(alarmData)) {
      alarmData.forEach(alarm => {
        const deviceId = alarm.parkId || alarm.cabinetId || alarm.roomId;
        if (deviceId) {
          newHighlightedDevices.add(deviceId);
        }
      });
      // console.log("newHighlightedDevices")
    }


    // 添加新的高亮设备
    newHighlightedDevices.forEach(deviceId => {
      if (!this.highlightedDevices.has(deviceId)) {
        // console.log(`添加设备高亮: ${deviceId}`);
        // 通过事件总线查找设备
        TKEvenBus.getInstance().emit('findDevice', {
          deviceId,
          callback: (device: TKBaseObject) => {
            // console.log(device);
            if (device) {
              console.log("修改告警标签");
              console.log(device);

              device.setAlarm(true);
              device.alarm()
            } else {
              console.warn(`Device with ID ${deviceId} not found`);
            }
          }
        });
      }
    });


  }


  /**
   * 处理设备聚焦事件
   * @param deviceId
   */
  handleFocusDevice(deviceId) {
    // 通过事件总线查找设备
    TKEvenBus.getInstance().emit('findDevice', {
      deviceId,
      callback: (device: RoomDevice) => {
        if (device) {
          device.focus();
        } else {
          console.warn(`Device with ID ${deviceId} not found`);
        }
      }
    });
  }

  /**
   * 清除所有高亮
   */
  public clearAllHighlights(): void {
    this.highlightedDevices.clear();
  }

  /**
   * 销毁管理器
   */
  public destroy(): void {
    this.clearAllHighlights();
    this.highlightedDevices.clear();

    // 移除事件监听
    TKEvenBus.getInstance().off('alarmDataUpdated', this.handleAlarmDataUpdate.bind(this));
    TKEvenBus.getInstance().off('handleDblClickEvent', this.handleFocusDevice.bind(this));

  }

}
