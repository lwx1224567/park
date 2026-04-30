import { defHttp } from '@/utils/http/axios';

/**
 * 获取列表
 * @param params
 * @returns
 */
export function list(params: any) {
  return defHttp.get({
    url: '/smartpark/inspection/list',
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
    url: '/smartpark/inspection',
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
    url: '/smartpark/inspection',
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
    url: `/smartpark/inspection/${id}`,
  });
}

/**
 * 关联设备
 * @param params
 * @returns
 */
export function device(params: any) {
  return defHttp.get({
    url: '/smartpark/inspectionDevice/list',
    params,
  });
}

/**
 * 新增关联设备
 * @param params
 * @returns
 */
export function addDevice(data: any) {
  return defHttp.post({
    url: '/smartpark/inspectionDevice',
    data,
  });
}
/**
 * 删除关联设备
 * @param id
 * @returns
 */
export function removeDevice(id) {
  return defHttp.delete({
    url: `/smartpark/inspectionDevice/${id}`,
  });
}

/**
 * 获取设备
 * @param params
 * @returns
 */
export function getDevice() {
  return defHttp.get({
    url: '/smartpark/park/list',
  });
}


