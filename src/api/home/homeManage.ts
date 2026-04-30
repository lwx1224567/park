import { defHttp } from '@/utils/http/axios';

/**
 * Home page (map) APIs
 */

// 全局综合统计
export function getGlobalStatistics() {
  return defHttp.get({ url: '/smartpark/global/statistics' });
}

// 全局-动态事件滚动窗口
export function getGlobalAlarmEventFlow() {
  return defHttp.get({ url: '/smartpark/global/alarmEventFlow' });
}

// 全局-能效管理
export function getGlobalEnergyAndEfficiency() {
  return defHttp.get({ url: '/smartpark/global/energyAndEfficiency' });
}


