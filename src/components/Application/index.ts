/*index.ts 作为模块的门面文件，规范了 Application 组件目录的对外接口。它让使用者可以：

导入预置的 AppProvider 组件（支持全局/局部注册）

导入 useAppProviderContext 钩子以访问上下文数据*/
import { withInstall } from '@/utils';

import appProvider from './src/AppProvider.vue';

export { useAppProviderContext } from './src/useAppContext';

export const AppProvider = withInstall(appProvider);
