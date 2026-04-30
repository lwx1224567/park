import { defHttp } from '@/utils/http/axios';

/**
 * @description: 综合信息
 */
export function getComprehensiveInformation(id) {
  return defHttp.get({ url: `/smartpark/room/comprehensiveInformation/${id}` });
}

/**
 * @description: 告警与事件总览
 */
export function getAlarmPreview(id) {
  return defHttp.get({ url: `/smartpark/room/alarmPreview/${id}` });
}

/**
 * @description: 实时告警滚动窗口
 */
export function getAlarmEventFlow(id) {
  return defHttp.get({ url: `/smartpark/room/alarmEventFlow/${id}` });
}

/**
 * @description: 用电分布
 */
export function getPowerDistribution(id) {
  return defHttp.get({ url: `/smartpark/room/powerDistribution/${id}` });
}

/**
 * @description: 数据分析
 */
export function getDataAnalysis(id) {
  return defHttp.get({ url: `/smartpark/room/dataAnalysis/${id}` });
}

/**
 * @description: 环境监测
 */
export function getEnvironmentMonitoring(id) {
  return defHttp.get({ url: `/smartpark/room/environmentalMonitoring/${id}` });
}

/**
 * @description: 机房运维
 */
export function getRoomOperation(id) {
  return defHttp.get({ url: `/smartpark/room/roomMaintenance/${id}` });
}

/**
 * @description: 获取机房设备列表
 */
export function getDeviceList(roomId: string) {
  return defHttp.get({ url: `/smartpark/room/deviceList/${roomId}` });
}


