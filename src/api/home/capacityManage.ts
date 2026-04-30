import { defHttp } from '@/utils/http/axios';

/**
 * @description: 容量分布和资源分布
 */
export function getCapacityAndResourceDistribution() {
  return defHttp.get({ url: '/smartpark/global/capacityAndResourceDistribution' });
}

/**
 * @description: 全局告警预览
 */
export function getGlobalAlarmPreview() {
  return defHttp.get({ url: '/smartpark/global/alarmPreview' });
}
