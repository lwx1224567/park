<template>
  <BasicDrawer @register="register" v-bind="$attrs" title="驾驶舱视图配置" width="50%">
    <!-- 页面选择和保存按钮 -->
    <div class="config-row">
      <div class="page-selection">
        <a-radio-group v-model:value="selectedPage" button-style="solid">
          <a-radio-button v-for="page in pageOptions" :key="page.value" :value="page.value">
            {{ page.label }}
          </a-radio-button>
        </a-radio-group>
      </div>
      <div class="save-button">
        <Button1 type="primary" @click="handleSave" text="恢复默认" />
        <Button1 type="primary" @click="handleSave" text="保存修改" />
      </div>
    </div>
    <!-- 左右布局选择 -->
    <div class="layout-sections">
      <!-- 左侧布局 -->
      <div class="layout-section">
        <div class="section-header">
          <div
            v-for="layout in layoutOptions"
            :key="layout.value"
            class="layout-option"
            :class="{ active: leftLayout === layout.value }"
            @click="selectLayout(layout.value, true)"
          >
            <div class="layout-preview">
              <img :src="layout.preview" :alt="layout.label" />
            </div>
            <div class="layout-label">{{ layout.label }}</div>
          </div>
        </div>
        <div class="components-container">
          <div v-for="(box, index) in leftComponents" :key="`left-${index}`" class="info-box">
            <a-select
              v-model:value="box.selectedComponent"
              style="width: 100%"
              size="default"
              :placeholder="false"
            >
              <a-select-option value="" disabled> 请选择组件 </a-select-option>
              <a-select-option
                v-for="component in currentComponentOptions"
                :key="component.value"
                :value="component.value"
              >
                {{ component.label }}
              </a-select-option>
            </a-select>
            <div class="image-container">
              <img
                v-if="getComponentInfo(box.selectedComponent).image"
                :src="getComponentInfo(box.selectedComponent).image"
                :alt="getComponentInfo(box.selectedComponent).label"
                class="component-image"
              />
              <div v-else class="placeholder-image">
                <span class="placeholder-text">请选择组件</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧布局 -->
      <div class="layout-section">
        <div class="section-header">
          <div
            v-for="layout in layoutOptions"
            :key="layout.value"
            class="layout-option"
            :class="{ active: rightLayout === layout.value }"
            @click="selectLayout(layout.value, false)"
          >
            <div class="layout-preview">
              <img :src="layout.preview" :alt="layout.label" />
            </div>
            <div class="layout-label">{{ layout.label }}</div>
          </div>
        </div>
        <div class="components-container">
          <div v-for="(box, index) in rightComponents" :key="`right-${index}`" class="info-box">
            <a-select
              v-model:value="box.selectedComponent"
              style="width: 100%"
              size="default"
              :placeholder="false"
            >
              <a-select-option value="" disabled> 请选择组件 </a-select-option>
              <a-select-option
                v-for="component in currentComponentOptions"
                :key="component.value"
                :value="component.value"
              >
                {{ component.label }}
              </a-select-option>
            </a-select>
            <div class="image-container">
              <img
                v-if="getComponentInfo(box.selectedComponent).image"
                :src="getComponentInfo(box.selectedComponent).image"
                :alt="getComponentInfo(box.selectedComponent).label"
                class="component-image"
              />
              <div v-else class="placeholder-image">
                <span class="placeholder-text">请选择组件</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted, nextTick, computed } from 'vue';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import {
    useLayoutsStoreWithOut,
    pageOptions,
    layoutOptions,
    componentOptions,
  } from '@/store/modules/layouts';
  import Button1 from '@/components/Button/src/Button1.vue';

  const [register, { closeDrawer }] = useDrawerInner();

  // 响应式数据
  const selectedPage = ref('park');
  const leftLayout = ref('1');
  const rightLayout = ref('1');
  const leftComponents = ref<Array<{ selectedComponent: string; column: string }>>([]);
  const rightComponents = ref<Array<{ selectedComponent: string; column: string }>>([]);
  const saving = ref(false);
  const layoutsStore = useLayoutsStoreWithOut();
  const isHydrating = ref(false);
  // 临时缓存：按布局值缓存左右侧已选组件，便于来回切换时回显
  const leftCache = ref<Record<string, Array<{ selectedComponent: string; column: string }>>>({});
  const rightCache = ref<Record<string, Array<{ selectedComponent: string; column: string }>>>({});
  const getCacheKey = (page: string, layout: string) => `${page}__${layout}`;

  // 根据页面类型获取组件选项
  const currentComponentOptions = computed(() => {
    return layoutsStore.getComponentOptionsByPage(selectedPage.value);
  });

  // 获取布局配置
  const getLayoutConfig = (layout: string) => {
    return layoutsStore.getLayoutConfigByValue(layout);
  };

  // 初始化组件
  const initializeComponents = (components: any, layout: string) => {
    const config = getLayoutConfig(layout);
    components.value = config.columns.map((col) => ({
      selectedComponent: '',
      column: col || '1/2',
    }));
  };

  // 保存当前布局选择到缓存
  const saveCurrentToCache = (isLeft: boolean) => {
    const page = selectedPage.value;
    if (isLeft) {
      leftCache.value[getCacheKey(page, leftLayout.value)] = leftComponents.value.map((c) => ({ ...c }));
    } else {
      rightCache.value[getCacheKey(page, rightLayout.value)] = rightComponents.value.map((c) => ({ ...c }));
    }
  };

  // 从缓存恢复组件；若无缓存则按布局初始化
  const restoreFromCacheOrInit = (isLeft: boolean, layoutValue: string) => {
    const cache = isLeft ? leftCache.value : rightCache.value;
    const target = isLeft ? leftComponents : rightComponents;
    const cached = cache[getCacheKey(selectedPage.value, layoutValue)];
    if (cached && Array.isArray(cached) && cached.length > 0) {
      target.value = cached.map((c) => ({ ...c }));
    } else {
      initializeComponents(target, layoutValue);
    }
  };

  // 选择布局
  const selectLayout = (layoutValue: string, isLeft: boolean) => {
    // 切换前将当前布局的选择写入缓存
    saveCurrentToCache(isLeft);
    if (isLeft) {
      leftLayout.value = layoutValue;
      restoreFromCacheOrInit(true, layoutValue);
    } else {
      rightLayout.value = layoutValue;
      restoreFromCacheOrInit(false, layoutValue);
    }
  };

  // 获取组件信息
  const getComponentInfo = (componentValue: string) => {
    return layoutsStore.getComponentInfoByValue(componentValue, selectedPage.value);
  };

  // 处理保存
  const handleSave = async () => {
    saving.value = true;

    try {
      const leftConfig = getLayoutConfig(leftLayout.value);
      const rightConfig = getLayoutConfig(rightLayout.value);

      const saveData = {
        page: selectedPage.value,
        left: {
          layout: leftLayout.value,
          row: leftConfig.row,
          columns: leftConfig.columns,
          components: leftComponents.value.map((box, index) => ({
            position: index + 1,
            column: box.column,
            component: box.selectedComponent,
            componentLabel: getComponentInfo(box.selectedComponent).label,
          })),
        },
        right: {
          layout: rightLayout.value,
          row: rightConfig.row,
          columns: rightConfig.columns,
          components: rightComponents.value.map((box, index) => ({
            position: index + 1,
            column: box.column,
            component: box.selectedComponent,
            componentLabel: getComponentInfo(box.selectedComponent).label,
          })),
        },
        timestamp: new Date().toISOString(),
      };

      // 根据页面类型保存到对应的 Store
      const payload = {
        page: selectedPage.value,
        left: saveData.left,
        right: saveData.right,
        timestamp: saveData.timestamp,
      };

      const storeMethods = {
        park: () => layoutsStore.setParkConfig(payload),
        room: () => layoutsStore.setRoomConfig(payload),
        cabinet: () => layoutsStore.setCabinetConfig(payload),
      };

      storeMethods[selectedPage.value as keyof typeof storeMethods]?.();

      await new Promise((resolve) => setTimeout(resolve, 1000));
      layoutsStore.saveParkConfigPrev(); //存储当前全局驾驶舱配置
      closeDrawer();
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      saving.value = false;
    }
  };

  // 从 Store 获取配置
  const getConfigByPage = () => {
    const configs = {
      park: layoutsStore.getParkConfig,
      room: layoutsStore.getRoomConfig,
      cabinet: layoutsStore.getCabinetConfig,
    };
    return configs[selectedPage.value as keyof typeof configs];
  };

  // 回显配置
  const hydrateFromConfig = async () => {
    const cfg: any = getConfigByPage();
    if (!cfg || (!cfg.left && !cfg.right)) return;

    isHydrating.value = true;

    // 左侧配置回显
    if (cfg.left) {
      if (cfg.left.layout) leftLayout.value = String(cfg.left.layout);
      if (Array.isArray(cfg.left.components) && cfg.left.components.length > 0) {
        leftComponents.value = cfg.left.components.map((c: any) => ({
          selectedComponent: c.component || '',
          column: c.column || '1/2',
        }));
        // 种下初始缓存，便于来回切换后回显
        leftCache.value[getCacheKey(selectedPage.value, leftLayout.value)] = leftComponents.value.map((c) => ({ ...c }));
      } else {
        initializeComponents(leftComponents, leftLayout.value);
      }
    }

    // 右侧配置回显
    if (cfg.right) {
      if (cfg.right.layout) rightLayout.value = String(cfg.right.layout);
      if (Array.isArray(cfg.right.components) && cfg.right.components.length > 0) {
        rightComponents.value = cfg.right.components.map((c: any) => ({
          selectedComponent: c.component || '',
          column: c.column || '1/2',
        }));
        // 种下初始缓存
        rightCache.value[getCacheKey(selectedPage.value, rightLayout.value)] = rightComponents.value.map((c) => ({ ...c }));
      } else {
        initializeComponents(rightComponents, rightLayout.value);
      }
    }

    await nextTick();
    isHydrating.value = false;
  };

  // 监听布局变化
  watch(leftLayout, () => {
    if (isHydrating.value) return;
    // 直接根据缓存恢复（或初始化）
    restoreFromCacheOrInit(true, leftLayout.value);
  });

  watch(rightLayout, () => {
    if (isHydrating.value) return;
    restoreFromCacheOrInit(false, rightLayout.value);
  });

  // 监听页面切换
  watch(selectedPage, hydrateFromConfig, { immediate: true });

  // 监听 store 配置变化
  watch(
    () => ({
      park: layoutsStore.getParkConfig,
      room: layoutsStore.getRoomConfig,
      cabinet: layoutsStore.getCabinetConfig,
    }),
    hydrateFromConfig,
    { deep: true },
  );

  // 初始化
  onMounted(() => {
    hydrateFromConfig();
  });
</script>

<style scoped lang="less">
  .config-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;

    .page-selection {
      display: flex;
      align-items: center;
    }

    .save-button {
      display: flex;
      gap: 10px;
    }
  }

  .layout-sections {
    display: flex;
    width: 100%;
    gap: 15px;

    .layout-section {
      flex: 1;
      border: 1px solid #3fa3e8;
      border-radius: 8px;
      background: rgb(15 30 50 / 80%);

      .section-header {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        width: 100%;
        padding: 10px;
        border-bottom: 1px solid #3fa3e8;
        background: linear-gradient(135deg, rgb(85 164 228 / 20%) 0%, rgb(85 164 228 / 5%) 100%);
        gap: 10px;

        .layout-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5px;
          transition: all 0.3s ease;
          border: 1px solid rgb(85 164 228 / 30%);
          border-radius: 8px;
          background: rgb(255 255 255 / 5%);
          cursor: pointer;
          gap: 5px;

          &:hover {
            transform: translateY(-2px);
            border-color: #55a4e4;
            background: rgb(85 164 228 / 20%);
            box-shadow: 0 4px 12px rgb(85 164 228 / 30%);
          }

          &.active {
            border-color: #55a4e4;
            background: linear-gradient(
              135deg,
              rgb(85 164 228 / 40%) 0%,
              rgb(85 164 228 / 20%) 100%
            );
            box-shadow:
              0 4px 16px rgb(85 164 228 / 40%),
              0 0 20px rgb(85 164 228 / 20%);
          }

          .layout-preview {
            height: 36px;

            img {
              width: auto;
              height: 100%;
              filter: brightness(1.2);
            }
          }

          .layout-label {
            color: #fff;
            font-size: 12px;
            font-weight: 500;
          }
        }
      }

      .components-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 10px;
        gap: 10px;

        .info-box {
          display: flex;
          flex-direction: column;
          padding: 10px;
          border: 1px solid rgb(85 164 228 / 20%);
          border-radius: 6px;
          background: rgb(25 40 60 / 60%);
          gap: 10px;

          .image-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 120px;
            border: 1px dashed rgb(85 164 228 / 30%);
            border-radius: 6px;
            background: rgb(15 30 50 / 50%);

            img {
              width: auto;
              height: 100%;
              object-fit: cover;
              object-position: center;
            }

            .placeholder-image {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 120px;
              border-radius: 4px;
              background: rgb(85 164 228 / 10%);

              .placeholder-text {
                color: rgb(255 255 255 / 40%);
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
</style>
