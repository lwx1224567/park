import { defHttp } from '@/utils/http/axios';

/**
 * 获取列表
 * @param params
 * @returns
 */
export function list(params: any) {
  return defHttp.get({
    url: '/smartpark/alarmConfig/list',
    params,
  });
}

/**
 * 新增
 * @param data
 * @returns
 */
export function add(data: any) {
  return defHttp.post({
    url: '/smartpark/alarmConfig',
    data,
  });
}

/**
 * 更新
 * @param data
 * @returns
 */
export function update(data: any) {
  return defHttp.put({
    url: '/smartpark/alarmConfig',
    data,
  });
}

/**
 * 删除
 * @param id
 * @returns
 */
export function remove(id) {
  return defHttp.delete({
    url: `/smartpark/alarmConfig/${id}`,
  });
}

/**
 * 获取分类
 * @returns
 */
export function getCategory() {
  return defHttp.get({
    url: '/smartpark/category/list',
  });
}

/**
 * 分类获取设备
 * @returns
 */
export function getCategoryDevice(id) {
  return defHttp.get({
    url: `/smartpark/park/list?categoryId=${id}`,
  });
}

/**
 * 获取分类的状态KEY列表
 * @returns
 */
export function getCategoryStatusKey(id) {
  return defHttp.get({
    url: `/smartpark/parkStatusConfig/list?categoryId=${id}`,
  });
}
