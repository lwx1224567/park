import { defHttp } from '@/utils/http/axios';

/**
 * Cabinet cockpit APIs
 */

/**
 * @description: 机柜综合信息
 */
export function getCabinetComprehensiveInformation(cabinetId: string) {
  return defHttp.get({ url: `/smartpark/cabinet/comprehensiveInformation/${cabinetId}` });
}

/**
 * @description: 机柜设备列表
 */
export function getCabinetDeviceList(cabinetId: string) {
  return defHttp.get({ url: `/smartpark/cabinet/deviceList/${cabinetId}` });
}

/**
 * @description: 机柜告警预览
 */
export function getCabinetAlarmPreview(cabinetId: string) {
  return defHttp.get({ url: `/smartpark/cabinet/alarmPreview/${cabinetId}` });
}
/**
 * @description: 实时告警
 */
export function getCabinetRealTimeAlarm(cabinetId: string) {
  return defHttp.get({ url: `/smartpark/cabinet/alarmEventFlow/${cabinetId}` });
}

/**
 * @description: 设备端口分布
 */
export function getDevicePortDistribution(deviceId: string) {
  return defHttp.get({ url: `/smartpark/device/portDistribution/${deviceId}` });
}

export function getDeviceComprehensiveInformation(deviceId: string) {
  return defHttp.get({ url: `/smartpark/device/comprehensiveInformation/${deviceId}` });
}

export function getDevicePortDetails(id: string, linkId: string, parkId: string) {
  return defHttp.get({ url: `/smartpark/device/portDetails?id=${id}&linkId=${linkId}&parkId=${parkId}` });
}


export function getContinuousPath(linkId: string, parkPortId: string, parkId: string) {
  return defHttp.get({ url: `/smartpark/portLink/getContinuousPath?linkId=${linkId}&parkPortId=${parkPortId}&parkId=${parkId}` });
}

