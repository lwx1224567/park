import { defHttp } from '@/utils/http/axios';

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return defHttp.get({ url: '/system/user/getInfo' }, { errorMessageMode: 'none' });
}

/**
 * @description: 获取用户列表
 */
export function getUserList() {
  return defHttp.get({ url: '/system/user/list' }, { ignoreCancelToken: true });
}
