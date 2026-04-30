import { defHttp } from '@/utils/http/axios';

/**
 * @description: 获取data数据
 */
export function getTreeData() {
  return defHttp.get({ url: '/smartpark/park/exportData' });
}
/**
 * @description: 获取字段和属性
 */
export function queryListByParkId(parkId: number) {
  return defHttp.get({ url: '/smartpark/attribute/queryListByParkId/' + parkId });
}
/**
 * @description: 保存park
 */
export function savePark(park: any) {
  return defHttp.put(
    {
      url: '/smartpark/park',
      data: park,
    },
    { isTransformResponse: false },
  );
}
/**
 * @description: 保存特殊字段
 */
export function saveAttribute(field: any) {
  return defHttp.put(
    {
      url: '/smartpark/attribute',
      data: field,
    },
    { isTransformResponse: false },
  );
}
