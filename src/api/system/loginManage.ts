import { defHttp } from '@/utils/http/axios';
import { useGlobSetting } from '@/hooks/setting';
const globSetting = useGlobSetting();

/**
 * @description: 用户登录
 */
export function loginApi(data: any) {
  const params = {
    ...data,
    clientId: globSetting.clientId,
    grantType: 'password',
    tenantId: "000000",
    rememberMe: true,
  };
  return defHttp.post({
    url: '/auth/login',
    data: params,
  });
}

/**
 * 用户登出
 * @returns
 */
export function doLogout() {
  return defHttp.post<void>({ url: '/auth/logout' });
}
