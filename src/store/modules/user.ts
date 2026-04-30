import type { UserInfo } from '#/store';
import { PageEnum } from '@/enums/pageEnum';
import { RoleEnum } from '@/enums/roleEnum';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { router } from '@/router';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { usePermissionStore } from '@/store/modules/permission';
import { useNotifyStore } from '@/store/modules/notify';
import { useMessage } from '@/hooks/web/useMessage';
import { loginApi, doLogout } from '@/api/system/loginManage';
import { getUserInfo } from '@/api/system/userManage';
import { h } from 'vue';

const { createConfirm } = useMessage();

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY);
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(state): RoleEnum[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : '';
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(account: any, goHome = true) {
      // //角色控制登录映射
      try {
        const data = await loginApi(account);
        const { access_token } = data;
        // const access_token = 'fakeToken';
        // 存储token
        this.setToken(access_token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean) {
      if (!this.getToken) return null;
      // 获取用户信息
      const userInfo = await this.getUserInfoAction();
      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        // 动态路由加载（首次）
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          [...routes, PAGE_NOT_FOUND_ROUTE].forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          // 记录动态路由加载完成
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const notifyStore = useNotifyStore();
      notifyStore.listenWithSSE(); //初始化WebSocket连接
      const userInfo = await getUserInfo();
      // const userInfo = {
      //   user: {
      //     userId: 1,
      //     tenantId: '000000',
      //     deptId: 103,
      //     userName: 'admin',
      //     nickName: '疯狂的狮子Li',
      //     userType: 'sys_user',
      //     email: 'crazyLionLi@163.com',
      //     phonenumber: '15888888888',
      //     sex: '1',
      //     avatar: null,
      //     status: '0',
      //     loginIp: '192.168.2.168',
      //     loginDate: '2025-09-15 10:47:08',
      //     remark: '管理员',
      //     createTime: '2025-09-03 11:18:43',
      //     deptName: '研发部门',
      //     roles: [
      //       {
      //         roleId: 1,
      //         roleName: '超级管理员',
      //         roleKey: 'superadmin',
      //         roleSort: 1,
      //         dataScope: '1',
      //         menuCheckStrictly: null,
      //         deptCheckStrictly: null,
      //         status: '0',
      //         remark: null,
      //         createTime: null,
      //         flag: false,
      //         superAdmin: true,
      //       },
      //     ],
      //     roleIds: null,
      //     postIds: null,
      //     roleId: null,
      //   },
      //   permissions: ['*:*:*'],
      //   roles: ['superadmin'],
      // };

      const transUserInfo = transformRespUser(userInfo);
      this.setUserInfo(transUserInfo);
      return transUserInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      const permissionStore = usePermissionStore();
      if (this.getToken) {
        try {
          // await doLogout();
          // const notifyStore = useNotifyStore();
          // notifyStore.closeWebSocket();
        } catch {
          // console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      permissionStore.setDynamicAddedRoute(false);
      if (goLogin) {
        // 直接回登陆页
        router.replace(PageEnum.BASE_LOGIN);
      } else {
        // 回登陆页带上当前路由地址
        router.replace({
          path: PageEnum.BASE_LOGIN,
          query: {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          },
        });
      }
    },

    /**
     * @description: 注销前确认
     */
    confirmLoginOut() {
      createConfirm({
        iconType: 'warning',
        title: () => h('span', '温馨提醒'),
        content: () => h('span', '是否确定退出系统？'),
        onOk: async () => {
          // 主动登出，不带redirect地址
          await this.logout(true);
        },
      });
    },
  },
});

//需要在设置之外使用
export function useUserStoreWithOut() {
  return useUserStore(store);
}

/**
 * 转换为适配框架的UserInfo 暂时不打算直接替换
 * @param resp api返回
 * @returns
 */
function transformRespUser(resp) {
  // 展开后得到UserInfo
  const { userId, userName, nickName, avatar = '' } = resp.user;
  return {
    permissions: resp.permissions,
    roles: resp.roles,
    userId,
    userName,
    nickName,
    avatar,
  };
}
