import { defHttp } from '@/utils/http/axios';

/**
 * @description: 告警排行TOP5统计
 */
export function getAlarmLevel() {
  return defHttp.get({ url: '/global/alarmLevel' });
}

/**
 * @description: 告警级别分布统计
 */
export function getAlarmClassifyTop5() {
  return defHttp.get({ url: '/global/AlarmClassifyTop5' });
}
