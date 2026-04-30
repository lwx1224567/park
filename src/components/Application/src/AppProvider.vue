<script lang="ts">
/*AppProvider.vue 是一个核心基础设施组件，负责：

注入全局 CSS 前缀和移动端检测标志

监听窗口尺寸变化自动更新移动端状态

作为应用根层级的依赖提供者*/
  import { defineComponent, toRefs, ref } from 'vue';
  import { createAppProviderContext } from './useAppContext';
  import { createBreakpointListen } from '@/hooks/event/useBreakpoint';

  const props = {
    /**
     * class style prefix
     */
    prefixCls: { type: String, default: 'heguoen' },
  };

  export default defineComponent({
    name: 'AppProvider',
    inheritAttrs: false,
    props,
    setup(props, { slots }) {
      const isMobile = ref(false);
      // Index screen breakpoint information changes
      createBreakpointListen(({ screenMap, sizeEnum, width }) => {
        const lgWidth = screenMap.get(sizeEnum.LG);
        if (lgWidth) {
          isMobile.value = width.value - 1 < lgWidth;
        }
      });

      const { prefixCls } = toRefs(props);

      // Inject variables into the global
      createAppProviderContext({ prefixCls, isMobile });
      return () => slots.default?.();
    },
  });
</script>
