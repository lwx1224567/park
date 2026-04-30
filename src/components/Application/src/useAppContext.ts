/*useAppContext.ts 是一个轻量级的上下文管理模块，
封装了 provide/inject 逻辑，
让 AppProvider 提供的全局配置（prefixCls 和 isMobile）可以在任何子组件中方便地获取。
它本身不直接使用，而是作为基础设施被 AppProvider.vue 和各个子组件调用。*/
import { InjectionKey, Ref } from 'vue';
import { createContext, useContext } from '@/hooks/core/useContext';

export interface AppProviderContextProps {
  prefixCls: Ref<string>;
  isMobile: Ref<boolean>;
}

const key: InjectionKey<AppProviderContextProps> = Symbol();

export function createAppProviderContext(context: AppProviderContextProps) {
  return createContext<AppProviderContextProps>(context, key);
}

export function useAppProviderContext() {
  return useContext<AppProviderContextProps>(key);
}
