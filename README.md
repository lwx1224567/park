# 智慧园区管理平台

这是一个基于 Vue 3 + TypeScript + Vite 的智慧园区管理平台框架项目。

## 项目特点

- ✅ 无需登录,直接访问
- ✅ 只保留园区驾驶舱页面
- ✅ 保留完整的驾驶舱组件系统
- ✅ 保留底部业务菜单组件
- ✅ 保留头部标题组件
- ✅ 适合学生团队学习和开发

## 技术栈

- Vue 3.4
- TypeScript 5.5
- Vite 5.4
- Ant Design Vue 4.2
- Three.js (3D场景)
- Cesium (地图引擎)
- Pinia (状态管理)
- Vue Router 4

## 项目结构

```
src/
├── components/            # 组件库
│   ├── CockpitLayouts/   # 驾驶舱布局组件 ⭐
│   ├── MenuPanel/        # 底部菜单组件 ⭐
│   └── ...
├── layouts/              # 布局组件
│   └── header/          # 头部组件 ⭐
├── views/               # 页面视图
│   └── park/           # 智慧园区驾驶舱 ⭐
└── router/             # 路由配置
```

## 核心组件

### 1. 驾驶舱组件 (CockpitLayouts)

位置: `src/components/CockpitLayouts/`

包含三种驾驶舱布局:

- BasicLayouts - 基础驾驶舱
- RoomLayouts - 机房驾驶舱
- CabinetLayouts - 机柜驾驶舱

### 2. 底部业务菜单 (BusinessMenu)

位置: `src/views/park/components/BusinessMenu.vue`

提供5个业务菜单:

- 机房运维
- 周界安防
- 访客系统
- 停车管理
- 园区设施

### 3. 头部组件 (Header)

位置: `src/layouts/header/`

显示标题、日期时间、天气信息

### 4. 智慧园区驾驶舱 (Park)

位置: `src/views/park/`

完整的3D园区可视化驾驶舱

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问: `http://localhost:5173/#/park`

### 构建生产版本

```bash
pnpm build
```

## 开发指南

### 页面路由

项目只有一个主要路由:

- `/park` - 智慧园区驾驶舱

### 使用驾驶舱组件

```vue
<template>
  <div>
    <BasicLayouts v-if="cockpitType === 'park'" />
    <RoomLayouts v-if="cockpitType === 'room'" />
    <CabinetLayouts v-if="cockpitType === 'cabinet'" />
  </div>
</template>

<script setup>
  import { BasicLayouts, RoomLayouts, CabinetLayouts } from '@/components/CockpitLayouts';
  import { ref } from 'vue';

  const cockpitType = ref('park');
</script>
```

## 注意事项

- 本项目已移除登录验证,所有页面可直接访问
- 保留了完整的组件库和框架结构
- 适合用于学习和二次开发

## 许可证

MIT License

```
设备精模3
├─ .browserslistrc
├─ .commitlintrc.cjs
├─ .editorconfig
├─ .env
├─ .env.development
├─ .env.production
├─ .env.test
├─ .eslintignore
├─ .eslintrc.cjs
├─ .npmrc
├─ .prettierignore
├─ .prettierrc.cjs
├─ .stylelintignore
├─ .stylelintrc.cjs
├─ CLEANUP.md
├─ index.html
├─ internal
│  ├─ eslint-config
│  │  ├─ .eslintignore
│  │  ├─ .eslintrc.cjs
│  │  ├─ .turbo
│  │  ├─ build.config.ts
│  │  ├─ package.json
│  │  ├─ src
│  │  │  ├─ index.ts
│  │  │  └─ strict.ts
│  │  └─ tsconfig.json
│  ├─ stylelint-config
│  │  ├─ .eslintignore
│  │  ├─ .eslintrc.cjs
│  │  ├─ .turbo
│  │  ├─ build.config.ts
│  │  ├─ package.json
│  │  ├─ src
│  │  │  └─ index.ts
│  │  └─ tsconfig.json
│  ├─ ts-config
│  │  ├─ base.json
│  │  ├─ node-server.json
│  │  ├─ node.json
│  │  ├─ package.json
│  │  └─ vue-app.json
│  └─ vite-config
│     ├─ .eslintignore
│     ├─ .eslintrc.cjs
│     ├─ .turbo
│     ├─ build.config.ts
│     ├─ package.json
│     ├─ src
│     │  ├─ config
│     │  │  ├─ application.ts
│     │  │  ├─ common.ts
│     │  │  └─ package.ts
│     │  ├─ index.ts
│     │  ├─ plugins
│     │  │  ├─ appConfig.ts
│     │  │  ├─ compress.ts
│     │  │  ├─ html.ts
│     │  │  ├─ index.ts
│     │  │  ├─ svgSprite.ts
│     │  │  └─ visualizer.ts
│     │  ├─ types
│     │  │  └─ index.d.ts
│     │  └─ utils
│     │     ├─ env.ts
│     │     ├─ hash.ts
│     │     └─ modifyVars.ts
│     └─ tsconfig.json
├─ LICENSE
├─ package.json
├─ packages
│  ├─ hooks
│  │  ├─ .eslintrc.cjs
│  │  ├─ build.config.ts
│  │  ├─ package.json
│  │  ├─ src
│  │  │  ├─ index.ts
│  │  │  ├─ onMountedOrActivated.ts
│  │  │  ├─ useAttrs.ts
│  │  │  ├─ useRefs.ts
│  │  │  ├─ useRequest
│  │  │  │  ├─ Fetch.ts
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ plugins
│  │  │  │  │  ├─ useAutoRunPlugin.ts
│  │  │  │  │  ├─ useCachePlugin.ts
│  │  │  │  │  ├─ useDebouncePlugin.ts
│  │  │  │  │  ├─ useLoadingDelayPlugin.ts
│  │  │  │  │  ├─ usePollingPlugin.ts
│  │  │  │  │  ├─ useRefreshOnWindowFocusPlugin.ts
│  │  │  │  │  ├─ useRetryPlugin.ts
│  │  │  │  │  └─ useThrottlePlugin.ts
│  │  │  │  ├─ types.ts
│  │  │  │  ├─ useRequestImplement.ts
│  │  │  │  └─ utils
│  │  │  │     ├─ cache.ts
│  │  │  │     ├─ cachePromise.ts
│  │  │  │     ├─ cacheSubscribe.ts
│  │  │  │     ├─ isBrowser.ts
│  │  │  │     ├─ isDocumentVisible.ts
│  │  │  │     ├─ isFunction.ts
│  │  │  │     ├─ isOnline.ts
│  │  │  │     ├─ limit.ts
│  │  │  │     ├─ subscribeFocus.ts
│  │  │  │     └─ subscribeReVisible.ts
│  │  │  ├─ useScrollTo.ts
│  │  │  └─ useWindowSizeFn.ts
│  │  └─ tsconfig.json
│  └─ types
│     ├─ .eslintrc.cjs
│     ├─ build.config.ts
│     ├─ package.json
│     ├─ src
│     │  ├─ index.ts
│     │  └─ utils.ts
│     └─ tsconfig.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ README.md
├─ src
│  ├─ api
│  │  ├─ admin
│  │  │  ├─ adminManage.ts
│  │  │  ├─ alarmManage.ts
│  │  │  ├─ assetManage.ts
│  │  │  ├─ inspectionManage.ts
│  │  │  ├─ parkManage.ts
│  │  │  └─ parkPortManage.ts
│  │  ├─ cockpit
│  │  │  ├─ cabinetManage.ts
│  │  │  ├─ parkManage.ts
│  │  │  └─ roomManage.ts
│  │  ├─ home
│  │  │  ├─ capacityManage.ts
│  │  │  └─ homeManage.ts
│  │  ├─ README.md
│  │  ├─ system
│  │  │  ├─ AlarmManage.ts
│  │  │  ├─ loginManage.ts
│  │  │  └─ userManage.ts
│  │  └─ visitor
│  ├─ App.vue
│  ├─ assets
│  │  ├─ components
│  │  │  ├─ ComponentEffect
│  │  │  │  ├─ 停车位信息.png
│  │  │  │  ├─ 动态事件.png
│  │  │  │  ├─ 告警排行TOP5.png
│  │  │  │  ├─ 告警统计.png
│  │  │  │  ├─ 基本信息.png
│  │  │  │  ├─ 天然气-能耗分析.png
│  │  │  │  ├─ 安防状态.png
│  │  │  │  ├─ 用水-能耗分析.png
│  │  │  │  ├─ 用电-能耗分析.png
│  │  │  │  ├─ 维保统计.png
│  │  │  │  ├─ 视频画面.png
│  │  │  │  └─ 访客记录.png
│  │  │  ├─ DeviceInfo
│  │  │  │  ├─ green.png
│  │  │  │  ├─ red.png
│  │  │  │  └─ yellow.png
│  │  │  ├─ Loading
│  │  │  │  └─ sequence
│  │  │  │     ├─ 1.png
│  │  │  │     ├─ 10.png
│  │  │  │     ├─ 11.png
│  │  │  │     ├─ 12.png
│  │  │  │     ├─ 13.png
│  │  │  │     ├─ 14.png
│  │  │  │     ├─ 15.png
│  │  │  │     ├─ 16.png
│  │  │  │     ├─ 17.png
│  │  │  │     ├─ 18.png
│  │  │  │     ├─ 19.png
│  │  │  │     ├─ 2.png
│  │  │  │     ├─ 20.png
│  │  │  │     ├─ 21.png
│  │  │  │     ├─ 22.png
│  │  │  │     ├─ 23.png
│  │  │  │     ├─ 24.png
│  │  │  │     ├─ 25.png
│  │  │  │     ├─ 26.png
│  │  │  │     ├─ 27.png
│  │  │  │     ├─ 28.png
│  │  │  │     ├─ 29.png
│  │  │  │     ├─ 3.png
│  │  │  │     ├─ 30.png
│  │  │  │     ├─ 31.png
│  │  │  │     ├─ 32.png
│  │  │  │     ├─ 33.png
│  │  │  │     ├─ 34.png
│  │  │  │     ├─ 35.png
│  │  │  │     ├─ 36.png
│  │  │  │     ├─ 37.png
│  │  │  │     ├─ 38.png
│  │  │  │     ├─ 39.png
│  │  │  │     ├─ 4.png
│  │  │  │     ├─ 40.png
│  │  │  │     ├─ 41.png
│  │  │  │     ├─ 42.png
│  │  │  │     ├─ 43.png
│  │  │  │     ├─ 44.png
│  │  │  │     ├─ 45.png
│  │  │  │     ├─ 46.png
│  │  │  │     ├─ 47.png
│  │  │  │     ├─ 48.png
│  │  │  │     ├─ 49.png
│  │  │  │     ├─ 5.png
│  │  │  │     ├─ 50.png
│  │  │  │     ├─ 51.png
│  │  │  │     ├─ 52.png
│  │  │  │     ├─ 53.png
│  │  │  │     ├─ 54.png
│  │  │  │     ├─ 55.png
│  │  │  │     ├─ 56.png
│  │  │  │     ├─ 57.png
│  │  │  │     ├─ 58.png
│  │  │  │     ├─ 59.png
│  │  │  │     ├─ 6.png
│  │  │  │     ├─ 60.png
│  │  │  │     ├─ 61.png
│  │  │  │     ├─ 62.png
│  │  │  │     ├─ 63.png
│  │  │  │     ├─ 64.png
│  │  │  │     ├─ 65.png
│  │  │  │     ├─ 66.png
│  │  │  │     ├─ 67.png
│  │  │  │     ├─ 68.png
│  │  │  │     ├─ 69.png
│  │  │  │     ├─ 7.png
│  │  │  │     ├─ 70.png
│  │  │  │     ├─ 71.png
│  │  │  │     ├─ 72.png
│  │  │  │     ├─ 8.png
│  │  │  │     └─ 9.png
│  │  │  └─ SecurityStatus
│  │  │     ├─ SecurityStatus-electronicFence.png
│  │  │     ├─ SecurityStatus-monitoringStatus.png
│  │  │     ├─ SecurityStatus-NumberInvasions.png
│  │  │     └─ SecurityStatus-runtimeDuration.png
│  │  ├─ fonts
│  │  │  ├─ digircu_.ttf
│  │  │  ├─ digirc__.ttf
│  │  │  ├─ digireu_.ttf
│  │  │  ├─ digire__.ttf
│  │  │  ├─ digirtu_.ttf
│  │  │  ├─ digirt__.ttf
│  │  │  ├─ digiru__.ttf
│  │  │  ├─ digir___.ttf
│  │  │  ├─ digistrip.ttf
│  │  │  ├─ digistrip_b.ttf
│  │  │  ├─ digistrip_i.ttf
│  │  │  ├─ digital2.ttf
│  │  │  ├─ digitaldream.ttf
│  │  │  ├─ digitaldreamfat.ttf
│  │  │  ├─ digitaldreamfatnarrow.ttf
│  │  │  ├─ digitaldreamfatskew.ttf
│  │  │  ├─ digitaldreamfatskewnarrow.ttf
│  │  │  ├─ digitaldreamnarrow.ttf
│  │  │  ├─ digitaldreamskew.ttf
│  │  │  └─ digitaldreamskewnarrow.ttf
│  │  ├─ icon
│  │  │  ├─ electronic-fence.png
│  │  │  ├─ EnergyConsumptionView.png
│  │  │  ├─ fire.png
│  │  │  ├─ flooding.png
│  │  │  ├─ floor-management.png
│  │  │  ├─ gas.png
│  │  │  ├─ global-perspective.png
│  │  │  ├─ humidity.png
│  │  │  ├─ idleview.png
│  │  │  ├─ operations.png
│  │  │  ├─ park-logo.png
│  │  │  ├─ park.png
│  │  │  ├─ parking.png
│  │  │  ├─ patrol.png
│  │  │  ├─ scene-roaming.png
│  │  │  ├─ security.png
│  │  │  ├─ smoke-detector.png
│  │  │  ├─ temperature.png
│  │  │  ├─ title-bg-icon.png
│  │  │  └─ visitor.png
│  │  ├─ images
│  │  │  ├─ 404_images
│  │  │  │  ├─ 404.png
│  │  │  │  └─ 404_cloud.png
│  │  │  ├─ business-menu-bg.png
│  │  │  ├─ business-menu-item-bg-active.png
│  │  │  ├─ business-menu-item-bg.png
│  │  │  ├─ huanbg.png
│  │  │  └─ layouts
│  │  │     ├─ arrow-bg.png
│  │  │     ├─ ball-bg.png
│  │  │     ├─ border-bg.png
│  │  │     ├─ border10-bg-t.png
│  │  │     ├─ border5-bg-b.png
│  │  │     ├─ border5-bg-t.png
│  │  │     ├─ border5-bg.png
│  │  │     ├─ border6-bg-b.png
│  │  │     ├─ border6-bg-r.png
│  │  │     ├─ border6-bg-t.png
│  │  │     ├─ border7-bg-b.png
│  │  │     ├─ border7-bg-t.png
│  │  │     ├─ border8-bg-tl.png
│  │  │     ├─ border8-bg-tr.png
│  │  │     ├─ border9-bg-bl.png
│  │  │     ├─ border9-bg-br.png
│  │  │     ├─ border9-bg-tl.png
│  │  │     ├─ bottom-line-bg.png
│  │  │     ├─ button-bg.png
│  │  │     ├─ button3-bg.png
│  │  │     ├─ button4-bg-danger.png
│  │  │     ├─ button4-bg.png
│  │  │     ├─ card-bg.png
│  │  │     ├─ empty-data.png
│  │  │     ├─ footer-bg.png
│  │  │     ├─ footerbg.png
│  │  │     ├─ group-item-bg-active.png
│  │  │     ├─ group-item-bg.png
│  │  │     ├─ halo-bg.png
│  │  │     ├─ halo-bg1.png
│  │  │     ├─ halo-gif.gif
│  │  │     ├─ halo.png
│  │  │     ├─ head-bg.png
│  │  │     ├─ header-bg.png
│  │  │     ├─ home-bg.jpg
│  │  │     ├─ icon-arrow.png
│  │  │     ├─ icon-dot-blue.png
│  │  │     ├─ icon-dot-green.png
│  │  │     ├─ icon-event-bg.png
│  │  │     ├─ icon-event-del.png
│  │  │     ├─ icon-nav-eye.png
│  │  │     ├─ icon-nav-fz.png
│  │  │     ├─ icon-nav-yk.png
│  │  │     ├─ icon-nav-yq.png
│  │  │     ├─ iconbg1@2x.png
│  │  │     ├─ iconbg2@2x.png
│  │  │     ├─ iconbg3@2x.png
│  │  │     ├─ iconbg4@2x.png
│  │  │     ├─ layout-1.png
│  │  │     ├─ layout-2.png
│  │  │     ├─ layout-3.png
│  │  │     ├─ layout-4.png
│  │  │     ├─ layout-5.png
│  │  │     ├─ layout-bg-1.png
│  │  │     ├─ layout-bg.png
│  │  │     ├─ loading-bg.png
│  │  │     ├─ loading.gif
│  │  │     ├─ login-bg.png
│  │  │     ├─ map-bg.png
│  │  │     ├─ map-img.png
│  │  │     ├─ menu-bg-active.png
│  │  │     ├─ menu-bg.png
│  │  │     ├─ modal-bg.png
│  │  │     ├─ modal-title-bg.png
│  │  │     ├─ nav-bg.png
│  │  │     ├─ nav-lb.png
│  │  │     ├─ nav-lt.png
│  │  │     ├─ nav-rb.png
│  │  │     ├─ nav-rt.png
│  │  │     ├─ room-image.png
│  │  │     ├─ scene-time-box.png
│  │  │     ├─ tab-bg-active.png
│  │  │     ├─ tab-bg.png
│  │  │     ├─ title-base-bh.png
│  │  │     ├─ title-bg.png
│  │  │     ├─ title-item-bg.png
│  │  │     ├─ unity-loading.gif
│  │  │     └─ view-wrapper-bg.png
│  │  ├─ logo.png
│  │  └─ texture
│  │     ├─ arrow.png
│  │     ├─ flyLine.png
│  │     ├─ flyLine2.png
│  │     ├─ gaoguang1.png
│  │     ├─ gaoguang2.png
│  │     ├─ grid.png
│  │     ├─ gridBlack.png
│  │     ├─ guangquan01.png
│  │     ├─ guangquan02.png
│  │     ├─ huiguang.png
│  │     ├─ label-arrow.png
│  │     ├─ pathLine2.png
│  │     ├─ pathLine4.png
│  │     ├─ point1.png
│  │     ├─ quan.png
│  │     ├─ rotationBorder1.png
│  │     ├─ rotationBorder2.png
│  │     ├─ rotationBorder3.png
│  │     ├─ side.png
│  │     ├─ side2.png
│  │     ├─ top_surface_normal_map2.jpg
│  │     └─ 光柱.png
│  ├─ components
│  │  ├─ Application
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ AppDarkModeToggle.vue
│  │  │     ├─ AppLocalePicker.vue
│  │  │     ├─ AppLogo.vue
│  │  │     ├─ AppProvider.vue
│  │  │     ├─ search
│  │  │     │  ├─ AppSearch.vue
│  │  │     │  ├─ AppSearchFooter.vue
│  │  │     │  ├─ AppSearchKeyItem.vue
│  │  │     │  ├─ AppSearchModal.vue
│  │  │     │  └─ useMenuSearch.ts
│  │  │     └─ useAppContext.ts
│  │  ├─ Basic
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ BasicArrow.vue
│  │  │     ├─ BasicHelp.vue
│  │  │     └─ BasicTitle.vue
│  │  ├─ Border
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ Border1.vue
│  │  │     ├─ Border10.vue
│  │  │     ├─ Border11.vue
│  │  │     ├─ Border2.vue
│  │  │     ├─ Border3
│  │  │     │  ├─ assets
│  │  │     │  │  ├─ icon_right.png
│  │  │     │  │  ├─ itembg.png
│  │  │     │  │  └─ titlebg.png
│  │  │     │  ├─ index.vue
│  │  │     │  ├─ sequence
│  │  │     │  │  ├─ bg
│  │  │     │  │  │  ├─ 0.png
│  │  │     │  │  │  ├─ 1.png
│  │  │     │  │  │  ├─ 10.png
│  │  │     │  │  │  ├─ 100.png
│  │  │     │  │  │  ├─ 101.png
│  │  │     │  │  │  ├─ 102.png
│  │  │     │  │  │  ├─ 103.png
│  │  │     │  │  │  ├─ 104.png
│  │  │     │  │  │  ├─ 105.png
│  │  │     │  │  │  ├─ 106.png
│  │  │     │  │  │  ├─ 11.png
│  │  │     │  │  │  ├─ 12.png
│  │  │     │  │  │  ├─ 13.png
│  │  │     │  │  │  ├─ 14.png
│  │  │     │  │  │  ├─ 15.png
│  │  │     │  │  │  ├─ 16.png
│  │  │     │  │  │  ├─ 17.png
│  │  │     │  │  │  ├─ 18.png
│  │  │     │  │  │  ├─ 19.png
│  │  │     │  │  │  ├─ 2.png
│  │  │     │  │  │  ├─ 20.png
│  │  │     │  │  │  ├─ 21.png
│  │  │     │  │  │  ├─ 22.png
│  │  │     │  │  │  ├─ 23.png
│  │  │     │  │  │  ├─ 24.png
│  │  │     │  │  │  ├─ 25.png
│  │  │     │  │  │  ├─ 26.png
│  │  │     │  │  │  ├─ 27.png
│  │  │     │  │  │  ├─ 28.png
│  │  │     │  │  │  ├─ 29.png
│  │  │     │  │  │  ├─ 3.png
│  │  │     │  │  │  ├─ 30.png
│  │  │     │  │  │  ├─ 31.png
│  │  │     │  │  │  ├─ 32.png
│  │  │     │  │  │  ├─ 33.png
│  │  │     │  │  │  ├─ 34.png
│  │  │     │  │  │  ├─ 35.png
│  │  │     │  │  │  ├─ 36.png
│  │  │     │  │  │  ├─ 37.png
│  │  │     │  │  │  ├─ 38.png
│  │  │     │  │  │  ├─ 39.png
│  │  │     │  │  │  ├─ 4.png
│  │  │     │  │  │  ├─ 40.png
│  │  │     │  │  │  ├─ 41.png
│  │  │     │  │  │  ├─ 42.png
│  │  │     │  │  │  ├─ 43.png
│  │  │     │  │  │  ├─ 44.png
│  │  │     │  │  │  ├─ 45.png
│  │  │     │  │  │  ├─ 46.png
│  │  │     │  │  │  ├─ 47.png
│  │  │     │  │  │  ├─ 48.png
│  │  │     │  │  │  ├─ 49.png
│  │  │     │  │  │  ├─ 5.png
│  │  │     │  │  │  ├─ 50.png
│  │  │     │  │  │  ├─ 51.png
│  │  │     │  │  │  ├─ 52.png
│  │  │     │  │  │  ├─ 53.png
│  │  │     │  │  │  ├─ 54.png
│  │  │     │  │  │  ├─ 55.png
│  │  │     │  │  │  ├─ 56.png
│  │  │     │  │  │  ├─ 57.png
│  │  │     │  │  │  ├─ 58.png
│  │  │     │  │  │  ├─ 59.png
│  │  │     │  │  │  ├─ 6.png
│  │  │     │  │  │  ├─ 60.png
│  │  │     │  │  │  ├─ 61.png
│  │  │     │  │  │  ├─ 62.png
│  │  │     │  │  │  ├─ 63.png
│  │  │     │  │  │  ├─ 64.png
│  │  │     │  │  │  ├─ 65.png
│  │  │     │  │  │  ├─ 66.png
│  │  │     │  │  │  ├─ 67.png
│  │  │     │  │  │  ├─ 68.png
│  │  │     │  │  │  ├─ 69.png
│  │  │     │  │  │  ├─ 7.png
│  │  │     │  │  │  ├─ 70.png
│  │  │     │  │  │  ├─ 71.png
│  │  │     │  │  │  ├─ 72.png
│  │  │     │  │  │  ├─ 73.png
│  │  │     │  │  │  ├─ 74.png
│  │  │     │  │  │  ├─ 75.png
│  │  │     │  │  │  ├─ 76.png
│  │  │     │  │  │  ├─ 77.png
│  │  │     │  │  │  ├─ 78.png
│  │  │     │  │  │  ├─ 79.png
│  │  │     │  │  │  ├─ 8.png
│  │  │     │  │  │  ├─ 80.png
│  │  │     │  │  │  ├─ 81.png
│  │  │     │  │  │  ├─ 82.png
│  │  │     │  │  │  ├─ 83.png
│  │  │     │  │  │  ├─ 84.png
│  │  │     │  │  │  ├─ 85.png
│  │  │     │  │  │  ├─ 86.png
│  │  │     │  │  │  ├─ 87.png
│  │  │     │  │  │  ├─ 88.png
│  │  │     │  │  │  ├─ 89.png
│  │  │     │  │  │  ├─ 9.png
│  │  │     │  │  │  ├─ 90.png
│  │  │     │  │  │  ├─ 91.png
│  │  │     │  │  │  ├─ 92.png
│  │  │     │  │  │  ├─ 93.png
│  │  │     │  │  │  ├─ 94.png
│  │  │     │  │  │  ├─ 95.png
│  │  │     │  │  │  ├─ 96.png
│  │  │     │  │  │  ├─ 97.png
│  │  │     │  │  │  ├─ 98.png
│  │  │     │  │  │  └─ 99.png
│  │  │     │  │  └─ index.vue
│  │  │     │  └─ titleCom.vue
│  │  │     ├─ Border4.vue
│  │  │     ├─ Border5.vue
│  │  │     ├─ Border6.vue
│  │  │     ├─ Border7.vue
│  │  │     ├─ Border8.vue
│  │  │     └─ Border9.vue
│  │  ├─ Button
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ BasicButton.vue
│  │  │     ├─ BgButton.vue
│  │  │     ├─ Button1.vue
│  │  │     ├─ Button2.vue
│  │  │     ├─ Button3.vue
│  │  │     ├─ Button4.vue
│  │  │     ├─ MenuButton.vue
│  │  │     ├─ PopConfirmButton.vue
│  │  │     ├─ props.ts
│  │  │     └─ StatusButton.vue
│  │  ├─ CockpitLayouts
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ BasicLayouts.vue
│  │  │     ├─ cabinet
│  │  │     │  ├─ components
│  │  │     │  │  ├─ AlarmStatistics.vue
│  │  │     │  │  ├─ BasicInfo.vue
│  │  │     │  │  ├─ DeviceList.vue
│  │  │     │  │  ├─ EventOverview.vue
│  │  │     │  │  ├─ RealTimeAlerts.vue
│  │  │     │  │  └─ VideoSurveillance.vue
│  │  │     │  └─ index.vue
│  │  │     ├─ CabinetLayouts.vue
│  │  │     ├─ device
│  │  │     │  ├─ components
│  │  │     │  │  └─ DeviceInfo.vue
│  │  │     │  └─ index.vue
│  │  │     ├─ park
│  │  │     │  ├─ components
│  │  │     │  │  ├─ AlarmRankingTop5.vue
│  │  │     │  │  ├─ AlarmStatistics.vue
│  │  │     │  │  ├─ BasicInfo.vue
│  │  │     │  │  ├─ DynamicEvents.vue
│  │  │     │  │  ├─ EnergyElectricity.vue
│  │  │     │  │  ├─ EnergyGas.vue
│  │  │     │  │  ├─ EnergyWater.vue
│  │  │     │  │  ├─ MaintenanceStatistics.vue
│  │  │     │  │  ├─ ParkingSpaceInfo.vue
│  │  │     │  │  ├─ SecurityStatus.vue
│  │  │     │  │  ├─ VideoSurveillance.vue
│  │  │     │  │  └─ VisitorSystem.vue
│  │  │     │  └─ index.vue
│  │  │     ├─ room
│  │  │     │  ├─ components
│  │  │     │  │  ├─ AlarmStatistics.vue
│  │  │     │  │  ├─ chart.js
│  │  │     │  │  ├─ ComprehensiveInfo.vue
│  │  │     │  │  ├─ DataAnalysis.vue
│  │  │     │  │  ├─ DeviceList.vue
│  │  │     │  │  ├─ DistributionDetails.vue
│  │  │     │  │  ├─ EnvironmentalMonitoring.vue
│  │  │     │  │  ├─ EventOverview.vue
│  │  │     │  │  ├─ RealTimeAlerts.vue
│  │  │     │  │  ├─ RoomOperations.vue
│  │  │     │  │  └─ VideoSurveillance.vue
│  │  │     │  └─ index.vue
│  │  │     └─ RoomLayouts.vue
│  │  ├─ Container
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ collapse
│  │  │     │  ├─ CollapseContainer.vue
│  │  │     │  └─ CollapseHeader.vue
│  │  │     ├─ ScrollContainer.vue
│  │  │     └─ typing.ts
│  │  ├─ CountDown
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ CountButton.vue
│  │  │     ├─ CountdownInput.vue
│  │  │     └─ useCountdown.ts
│  │  ├─ Cropper
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ Cropper.vue
│  │  │     ├─ CropperAvatar.vue
│  │  │     ├─ CropperModal.vue
│  │  │     └─ typing.ts
│  │  ├─ Description
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ Description.vue
│  │  │     ├─ typing.ts
│  │  │     └─ useDescription.ts
│  │  ├─ Drawer
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ BasicDrawer.vue
│  │  │     ├─ components
│  │  │     │  ├─ DrawerFooter.vue
│  │  │     │  └─ DrawerHeader.vue
│  │  │     ├─ props.ts
│  │  │     ├─ typing.ts
│  │  │     └─ useDrawer.ts
│  │  ├─ Dropdown
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ Dropdown.vue
│  │  │     └─ typing.ts
│  │  ├─ Earth-3D
│  │  │  └─ index.vue
│  │  ├─ Form
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ BasicForm.vue
│  │  │     ├─ componentMap.ts
│  │  │     ├─ components
│  │  │     │  ├─ ApiCascader.vue
│  │  │     │  ├─ ApiRadioGroup.vue
│  │  │     │  ├─ ApiSelect.vue
│  │  │     │  ├─ ApiTransfer.vue
│  │  │     │  ├─ ApiTree.vue
│  │  │     │  ├─ ApiTreeSelect.vue
│  │  │     │  ├─ FormAction.vue
│  │  │     │  ├─ FormItem.vue
│  │  │     │  └─ RadioButtonGroup.vue
│  │  │     ├─ helper.ts
│  │  │     ├─ hooks
│  │  │     │  ├─ useAdvanced.ts
│  │  │     │  ├─ useAutoFocus.ts
│  │  │     │  ├─ useComponentRegister.ts
│  │  │     │  ├─ useForm.ts
│  │  │     │  ├─ useFormContext.ts
│  │  │     │  ├─ useFormEvents.ts
│  │  │     │  ├─ useFormValues.ts
│  │  │     │  └─ useLabelWidth.ts
│  │  │     ├─ props.ts
│  │  │     └─ types
│  │  │        ├─ form.ts
│  │  │        ├─ formItem.ts
│  │  │        ├─ hooks.ts
│  │  │        └─ index.ts
│  │  ├─ gsapNum
│  │  │  ├─ dot.vue
│  │  │  └─ index.vue
│  │  ├─ Icon
│  │  │  ├─ data
│  │  │  │  └─ icons.data.ts
│  │  │  ├─ Icon.vue
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ IconPicker.vue
│  │  │     └─ SvgIcon.vue
│  │  ├─ MenuPanel
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ BaseMenuItem.vue
│  │  │     ├─ BasicMenu.vue
│  │  │     └─ MenuItem.vue
│  │  ├─ Modal
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ BasicModal.vue
│  │  │     ├─ components
│  │  │     │  ├─ Modal.tsx
│  │  │     │  ├─ ModalClose.vue
│  │  │     │  ├─ ModalFooter.vue
│  │  │     │  ├─ ModalHeader.vue
│  │  │     │  └─ ModalWrapper.vue
│  │  │     ├─ hooks
│  │  │     │  ├─ useModal.ts
│  │  │     │  ├─ useModalContext.ts
│  │  │     │  ├─ useModalDrag.ts
│  │  │     │  └─ useModalFullScreen.ts
│  │  │     ├─ index.less
│  │  │     ├─ props.ts
│  │  │     └─ typing.ts
│  │  ├─ Navigation
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     └─ nav1
│  │  │        ├─ bg1
│  │  │        │  ├─ img
│  │  │        │  │  ├─ 0.png
│  │  │        │  │  ├─ 1.png
│  │  │        │  │  ├─ 10.png
│  │  │        │  │  ├─ 11.png
│  │  │        │  │  ├─ 12.png
│  │  │        │  │  ├─ 13.png
│  │  │        │  │  ├─ 14.png
│  │  │        │  │  ├─ 15.png
│  │  │        │  │  ├─ 16.png
│  │  │        │  │  ├─ 17.png
│  │  │        │  │  ├─ 18.png
│  │  │        │  │  ├─ 19.png
│  │  │        │  │  ├─ 2.png
│  │  │        │  │  ├─ 20.png
│  │  │        │  │  ├─ 21.png
│  │  │        │  │  ├─ 22.png
│  │  │        │  │  ├─ 23.png
│  │  │        │  │  ├─ 24.png
│  │  │        │  │  ├─ 25.png
│  │  │        │  │  ├─ 26.png
│  │  │        │  │  ├─ 27.png
│  │  │        │  │  ├─ 28.png
│  │  │        │  │  ├─ 29.png
│  │  │        │  │  ├─ 3.png
│  │  │        │  │  ├─ 30.png
│  │  │        │  │  ├─ 31.png
│  │  │        │  │  ├─ 32.png
│  │  │        │  │  ├─ 33.png
│  │  │        │  │  ├─ 34.png
│  │  │        │  │  ├─ 35.png
│  │  │        │  │  ├─ 36.png
│  │  │        │  │  ├─ 37.png
│  │  │        │  │  ├─ 38.png
│  │  │        │  │  ├─ 39.png
│  │  │        │  │  ├─ 4.png
│  │  │        │  │  ├─ 40.png
│  │  │        │  │  ├─ 41.png
│  │  │        │  │  ├─ 42.png
│  │  │        │  │  ├─ 43.png
│  │  │        │  │  ├─ 44.png
│  │  │        │  │  ├─ 45.png
│  │  │        │  │  ├─ 46.png
│  │  │        │  │  ├─ 47.png
│  │  │        │  │  ├─ 48.png
│  │  │        │  │  ├─ 49.png
│  │  │        │  │  ├─ 5.png
│  │  │        │  │  ├─ 50.png
│  │  │        │  │  ├─ 51.png
│  │  │        │  │  ├─ 52.png
│  │  │        │  │  ├─ 53.png
│  │  │        │  │  ├─ 54.png
│  │  │        │  │  ├─ 55.png
│  │  │        │  │  ├─ 56.png
│  │  │        │  │  ├─ 57.png
│  │  │        │  │  ├─ 58.png
│  │  │        │  │  ├─ 59.png
│  │  │        │  │  ├─ 6.png
│  │  │        │  │  ├─ 60.png
│  │  │        │  │  ├─ 61.png
│  │  │        │  │  ├─ 62.png
│  │  │        │  │  ├─ 63.png
│  │  │        │  │  ├─ 64.png
│  │  │        │  │  ├─ 65.png
│  │  │        │  │  ├─ 66.png
│  │  │        │  │  ├─ 67.png
│  │  │        │  │  ├─ 68.png
│  │  │        │  │  ├─ 69.png
│  │  │        │  │  ├─ 7.png
│  │  │        │  │  ├─ 70.png
│  │  │        │  │  ├─ 71.png
│  │  │        │  │  ├─ 72.png
│  │  │        │  │  ├─ 73.png
│  │  │        │  │  ├─ 74.png
│  │  │        │  │  ├─ 8.png
│  │  │        │  │  └─ 9.png
│  │  │        │  └─ index.vue
│  │  │        └─ index.vue
│  │  ├─ Page
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ BaseWrapper.vue
│  │  │     ├─ Page1Wrapper.vue
│  │  │     ├─ Page2Wrapper.vue
│  │  │     ├─ PageWrapper.vue
│  │  │     └─ VisitorWrapper.vue
│  │  ├─ Popup
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ LeftPopup.vue
│  │  │     └─ RightPopup.vue
│  │  ├─ registerGlobComp.ts
│  │  ├─ Scrollbar
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ bar.ts
│  │  │     ├─ Scrollbar.vue
│  │  │     ├─ types.d.ts
│  │  │     └─ util.ts
│  │  ├─ SimpleTable
│  │  │  └─ src
│  │  ├─ StrengthMeter
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     └─ StrengthMeter.vue
│  │  ├─ Table
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ BasicTable.vue
│  │  │     ├─ componentMap.ts
│  │  │     ├─ components
│  │  │     │  ├─ editable
│  │  │     │  │  ├─ CellComponent.ts
│  │  │     │  │  ├─ EditableCell.vue
│  │  │     │  │  ├─ helper.ts
│  │  │     │  │  └─ index.ts
│  │  │     │  ├─ EditTableHeaderIcon.vue
│  │  │     │  ├─ HeaderCell.vue
│  │  │     │  ├─ settings
│  │  │     │  │  ├─ ColumnSetting.vue
│  │  │     │  │  ├─ FullScreenSetting.vue
│  │  │     │  │  ├─ index.vue
│  │  │     │  │  ├─ RedoSetting.vue
│  │  │     │  │  └─ SizeSetting.vue
│  │  │     │  ├─ TableAction.vue
│  │  │     │  ├─ TableFooter.vue
│  │  │     │  ├─ TableHeader.vue
│  │  │     │  ├─ TableImg.vue
│  │  │     │  ├─ TableSelectionBar.vue
│  │  │     │  └─ TableTitle.vue
│  │  │     ├─ const.ts
│  │  │     ├─ helper.ts
│  │  │     ├─ hooks
│  │  │     │  ├─ useColumns.ts
│  │  │     │  ├─ useCustomRow.ts
│  │  │     │  ├─ useDataSource.ts
│  │  │     │  ├─ useLoading.ts
│  │  │     │  ├─ usePagination.ts
│  │  │     │  ├─ useRowSelection.ts
│  │  │     │  ├─ useScrollTo.ts
│  │  │     │  ├─ useTable.ts
│  │  │     │  ├─ useTableContext.ts
│  │  │     │  ├─ useTableExpand.ts
│  │  │     │  ├─ useTableFooter.ts
│  │  │     │  ├─ useTableForm.ts
│  │  │     │  ├─ useTableHeader.ts
│  │  │     │  ├─ useTableScroll.ts
│  │  │     │  └─ useTableStyle.ts
│  │  │     ├─ props.ts
│  │  │     └─ types
│  │  │        ├─ column.ts
│  │  │        ├─ componentType.ts
│  │  │        ├─ pagination.ts
│  │  │        ├─ table.ts
│  │  │        └─ tableAction.ts
│  │  ├─ Tabs
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     └─ TabsNav.vue
│  │  ├─ Transition
│  │  │  ├─ index.ts
│  │  │  └─ src
│  │  │     ├─ CollapseTransition.vue
│  │  │     ├─ CreateTransition.tsx
│  │  │     └─ ExpandTransition.ts
│  │  └─ Upload
│  │     ├─ index.ts
│  │     └─ src
│  │        ├─ BasicUpload.vue
│  │        ├─ components
│  │        │  ├─ data.tsx
│  │        │  ├─ FileList.vue
│  │        │  ├─ FileUpload.vue
│  │        │  ├─ ImageUpload.vue
│  │        │  ├─ ThumbUrl.vue
│  │        │  ├─ UploadModal.vue
│  │        │  └─ UploadPreviewModal.vue
│  │        ├─ helper.ts
│  │        ├─ hooks
│  │        │  └─ useUpload.ts
│  │        ├─ props.ts
│  │        └─ types
│  │           └─ typing.ts
│  ├─ design
│  │  ├─ ant
│  │  │  ├─ btn.less
│  │  │  ├─ index.less
│  │  │  ├─ input.less
│  │  │  ├─ pagination.less
│  │  │  ├─ popconfirm.less
│  │  │  └─ table.less
│  │  ├─ color.less
│  │  ├─ config.less
│  │  ├─ entry.css
│  │  ├─ index.less
│  │  ├─ public.less
│  │  ├─ theme.less
│  │  ├─ transition
│  │  │  ├─ base.less
│  │  │  ├─ fade.less
│  │  │  ├─ index.less
│  │  │  ├─ scale.less
│  │  │  ├─ scroll.less
│  │  │  ├─ slide.less
│  │  │  └─ zoom.less
│  │  └─ var
│  │     ├─ breakpoint.less
│  │     ├─ easing.less
│  │     └─ index.less
│  ├─ directives
│  │  └─ clickOutside.ts
│  ├─ enums
│  │  ├─ breakpointEnum.ts
│  │  ├─ cacheEnum.ts
│  │  ├─ httpEnum.ts
│  │  ├─ pageEnum.ts
│  │  └─ roleEnum.ts
│  ├─ hooks
│  │  ├─ component
│  │  │  ├─ useFormItem.ts
│  │  │  └─ usePageContext.ts
│  │  ├─ core
│  │  │  └─ useContext.ts
│  │  ├─ event
│  │  │  ├─ useBreakpoint.ts
│  │  │  ├─ useEventListener.ts
│  │  │  └─ useScroll.ts
│  │  ├─ setting
│  │  │  └─ index.ts
│  │  ├─ useMqtt.ts
│  │  └─ web
│  │     ├─ useDesign.js
│  │     ├─ useMessage.tsx
│  │     ├─ usePagination.ts
│  │     └─ useSortable.ts
│  ├─ layouts
│  │  ├─ content
│  │  │  ├─ index.vue
│  │  │  └─ useContentViewHeight.ts
│  │  ├─ header
│  │  │  ├─ components
│  │  │  │  ├─ logout
│  │  │  │  │  └─ index.vue
│  │  │  │  └─ top
│  │  │  │     ├─ assets
│  │  │  │     │  └─ theme
│  │  │  │     │     └─ blue
│  │  │  │     │        ├─ icon_weather.png
│  │  │  │     │        └─ topbg.png
│  │  │  │     ├─ index copy.vue
│  │  │  │     ├─ index.vue
│  │  │  │     └─ sequence
│  │  │  │        ├─ index.vue
│  │  │  │        └─ topbg
│  │  │  │           ├─ 0.png
│  │  │  │           ├─ 1.png
│  │  │  │           ├─ 10.png
│  │  │  │           ├─ 11.png
│  │  │  │           ├─ 12.png
│  │  │  │           ├─ 13.png
│  │  │  │           ├─ 14.png
│  │  │  │           ├─ 15.png
│  │  │  │           ├─ 16.png
│  │  │  │           ├─ 17.png
│  │  │  │           ├─ 18.png
│  │  │  │           ├─ 19.png
│  │  │  │           ├─ 2.png
│  │  │  │           ├─ 20.png
│  │  │  │           ├─ 21.png
│  │  │  │           ├─ 22.png
│  │  │  │           ├─ 23.png
│  │  │  │           ├─ 24.png
│  │  │  │           ├─ 25.png
│  │  │  │           ├─ 26.png
│  │  │  │           ├─ 27.png
│  │  │  │           ├─ 28.png
│  │  │  │           ├─ 29.png
│  │  │  │           ├─ 3.png
│  │  │  │           ├─ 30.png
│  │  │  │           ├─ 31.png
│  │  │  │           ├─ 32.png
│  │  │  │           ├─ 33.png
│  │  │  │           ├─ 34.png
│  │  │  │           ├─ 35.png
│  │  │  │           ├─ 36.png
│  │  │  │           ├─ 37.png
│  │  │  │           ├─ 38.png
│  │  │  │           ├─ 39.png
│  │  │  │           ├─ 4.png
│  │  │  │           ├─ 40.png
│  │  │  │           ├─ 41.png
│  │  │  │           ├─ 42.png
│  │  │  │           ├─ 43.png
│  │  │  │           ├─ 44.png
│  │  │  │           ├─ 45.png
│  │  │  │           ├─ 46.png
│  │  │  │           ├─ 47.png
│  │  │  │           ├─ 48.png
│  │  │  │           ├─ 49.png
│  │  │  │           ├─ 5.png
│  │  │  │           ├─ 50.png
│  │  │  │           ├─ 51.png
│  │  │  │           ├─ 52.png
│  │  │  │           ├─ 53.png
│  │  │  │           ├─ 54.png
│  │  │  │           ├─ 55.png
│  │  │  │           ├─ 56.png
│  │  │  │           ├─ 57.png
│  │  │  │           ├─ 58.png
│  │  │  │           ├─ 59.png
│  │  │  │           ├─ 6.png
│  │  │  │           ├─ 60.png
│  │  │  │           ├─ 61.png
│  │  │  │           ├─ 62.png
│  │  │  │           ├─ 63.png
│  │  │  │           ├─ 64.png
│  │  │  │           ├─ 65.png
│  │  │  │           ├─ 66.png
│  │  │  │           ├─ 67.png
│  │  │  │           ├─ 68.png
│  │  │  │           ├─ 69.png
│  │  │  │           ├─ 7.png
│  │  │  │           ├─ 70.png
│  │  │  │           ├─ 71.png
│  │  │  │           ├─ 72.png
│  │  │  │           ├─ 73.png
│  │  │  │           ├─ 74.png
│  │  │  │           ├─ 8.png
│  │  │  │           └─ 9.png
│  │  │  ├─ index.vue
│  │  │  └─ ProjectConfig.vue
│  │  ├─ index.vue
│  │  └─ menu
│  │     └─ visitor.vue
│  ├─ main.ts
│  ├─ mini3d
│  │  ├─ components
│  │  │  ├─ FlyLine.js
│  │  │  ├─ Grid.js
│  │  │  ├─ index.js
│  │  │  ├─ Label3d.js
│  │  │  ├─ Particles.js
│  │  │  ├─ PathLine.js
│  │  │  ├─ Plane.js
│  │  │  └─ ToastLoading.js
│  │  ├─ core
│  │  │  ├─ Camera.js
│  │  │  ├─ index.js
│  │  │  └─ Renderer.js
│  │  ├─ index.js
│  │  ├─ plugins
│  │  │  ├─ debug
│  │  │  │  └─ index.js
│  │  │  └─ index.js
│  │  ├─ shader
│  │  │  ├─ DiffuseShader.js
│  │  │  ├─ GradientShader.js
│  │  │  └─ index.js
│  │  └─ utils
│  │     ├─ CreateHistory.js
│  │     ├─ EventEmitter.js
│  │     ├─ GC.js
│  │     ├─ index.js
│  │     ├─ Resource.js
│  │     ├─ Sizes.js
│  │     ├─ Time.js
│  │     └─ utils.js
│  ├─ router
│  │  ├─ constant.ts
│  │  ├─ guard
│  │  │  ├─ index.ts
│  │  │  └─ permissionGuard.ts
│  │  ├─ helper
│  │  │  ├─ duplicateRoutes.ts
│  │  │  ├─ menuHelper.ts
│  │  │  └─ routeHelper.ts
│  │  ├─ index.ts
│  │  ├─ routes
│  │  │  ├─ basic.ts
│  │  │  ├─ index.ts
│  │  │  ├─ mainOut.ts
│  │  │  └─ modules
│  │  │     ├─ antiDrone
│  │  │     ├─ index.ts
│  │  │     └─ visitor
│  │  └─ types.ts
│  ├─ settings
│  │  ├─ componentSetting.ts
│  │  └─ encryptionSetting.ts
│  ├─ store
│  │  ├─ index.ts
│  │  ├─ modules
│  │  │  ├─ basicConfig.ts
│  │  │  ├─ cabinet.ts
│  │  │  ├─ layouts.ts
│  │  │  ├─ menu.ts
│  │  │  ├─ notify.ts
│  │  │  ├─ park.ts
│  │  │  ├─ permission.ts
│  │  │  ├─ room.ts
│  │  │  ├─ tableSetting.ts
│  │  │  └─ user.ts
│  │  └─ plugin
│  │     └─ persist.ts
│  ├─ utils
│  │  ├─ auth
│  │  │  └─ index.ts
│  │  ├─ bem.ts
│  │  ├─ cache
│  │  │  ├─ index.ts
│  │  │  ├─ memory.ts
│  │  │  ├─ persistent.ts
│  │  │  └─ storageCache.ts
│  │  ├─ cipher.ts
│  │  ├─ color.ts
│  │  ├─ copyTextToClipboard.ts
│  │  ├─ dateUtil.ts
│  │  ├─ domUtils.ts
│  │  ├─ encryption
│  │  │  ├─ crypto.ts
│  │  │  └─ jsencrypt.ts
│  │  ├─ env.ts
│  │  ├─ event
│  │  │  └─ index.ts
│  │  ├─ factory
│  │  │  └─ createAsyncComponent.tsx
│  │  ├─ file
│  │  │  ├─ base64Conver.ts
│  │  │  └─ download.ts
│  │  ├─ helper
│  │  │  ├─ treeHelper.ts
│  │  │  └─ tsxHelper.ts
│  │  ├─ http
│  │  │  └─ axios
│  │  │     ├─ Axios.ts
│  │  │     ├─ axiosCancel.ts
│  │  │     ├─ axiosRetry.ts
│  │  │     ├─ axiosTransform.ts
│  │  │     ├─ checkStatus.ts
│  │  │     ├─ helper.ts
│  │  │     └─ index.ts
│  │  ├─ index.ts
│  │  ├─ is.ts
│  │  ├─ lib
│  │  │  └─ echarts.ts
│  │  ├─ log.ts
│  │  ├─ mitt.ts
│  │  ├─ mqtt
│  │  │  └─ index.ts
│  │  ├─ props.ts
│  │  ├─ propTypes.ts
│  │  ├─ TKThree
│  │  │  ├─ TKAlarmManager.ts
│  │  │  ├─ TKBaseObject.ts
│  │  │  ├─ TKCamera.ts
│  │  │  ├─ TKClassFactory.ts
│  │  │  ├─ TKColorFlickerManager.ts
│  │  │  ├─ TKEvenBus.ts
│  │  │  ├─ TKLineManager.ts
│  │  │  ├─ TKModelLoader.ts
│  │  │  ├─ TKSprite
│  │  │  │  └─ TKBaseSprite.ts
│  │  │  └─ TKUtil.ts
│  │  ├─ types.ts
│  │  ├─ useSocket.ts
│  │  └─ uuid.ts
│  └─ views
│     ├─ admin
│     │  ├─ alarm
│     │  │  ├─ components
│     │  │  │  └─ AlarmModal.vue
│     │  │  └─ index.vue
│     │  ├─ asset
│     │  │  ├─ components
│     │  │  │  └─ AssetModal.vue
│     │  │  └─ index.vue
│     │  ├─ config
│     │  │  └─ index.vue
│     │  ├─ DevicePortLinkManagement.vue
│     │  ├─ DevicePortManagement.vue
│     │  └─ inspection
│     │     ├─ components
│     │     │  ├─ DeviceModal.vue
│     │     │  └─ InspectionModal.vue
│     │     ├─ device.vue
│     │     └─ index.vue
│     ├─ deviceModel
│     │  ├─ components
│     │  │  ├─ DeviceModel3D.vue
│     │  │  ├─ index.ts
│     │  │  ├─ LeftBottom.vue
│     │  │  ├─ LeftCenter.vue
│     │  │  ├─ LeftTop.vue
│     │  │  ├─ MiddleBottom.vue
│     │  │  ├─ RightBottom.vue
│     │  │  ├─ RightCenter.vue
│     │  │  └─ RightTop.vue
│     │  ├─ hooks
│     │  │  └─ useDeviceDetail.ts
│     │  ├─ index.vue
│     │  └─ types
│     │     └─ index.ts
│     ├─ park
│     │  ├─ assets
│     │  │  └─ model_tag.gif
│     │  ├─ cockpit
│     │  │  ├─ cabinetCockpit
│     │  │  │  ├─ components
│     │  │  │  │  ├─ index.ts
│     │  │  │  │  ├─ LeftBottom.vue
│     │  │  │  │  ├─ LeftCenter.vue
│     │  │  │  │  ├─ LeftTop.vue
│     │  │  │  │  ├─ RightBottom.vue
│     │  │  │  │  ├─ RightCenter.vue
│     │  │  │  │  └─ RightTop.vue
│     │  │  │  └─ index.vue
│     │  │  ├─ parkCockpit
│     │  │  │  ├─ components
│     │  │  │  │  ├─ index.ts
│     │  │  │  │  ├─ LeftBottom.vue
│     │  │  │  │  ├─ LeftCenter.vue
│     │  │  │  │  ├─ LeftTop.vue
│     │  │  │  │  ├─ RightBottom.vue
│     │  │  │  │  ├─ RightCenter.vue
│     │  │  │  │  └─ RightTop.vue
│     │  │  │  └─ index.vue
│     │  │  └─ roomCockpit
│     │  │     ├─ components
│     │  │     │  ├─ index.ts
│     │  │     │  ├─ LeftBottom.vue
│     │  │     │  ├─ LeftCenter.vue
│     │  │     │  ├─ LeftTop.vue
│     │  │     │  ├─ RightBottom.vue
│     │  │     │  ├─ RightCenter.vue
│     │  │     │  └─ RightTop.vue
│     │  │     └─ index.vue
│     │  ├─ components
│     │  │  ├─ BusinessMenu.vue
│     │  │  ├─ CameraModal.vue
│     │  │  ├─ DeviceModal.vue
│     │  │  ├─ inspectionModal.vue
│     │  │  ├─ InspectionProgress.vue
│     │  │  ├─ LeftTopChart.vue
│     │  │  ├─ LoadingPage.vue
│     │  │  ├─ Park.vue
│     │  │  └─ SceneMenu
│     │  │     ├─ SceneMenu.vue
│     │  │     └─ src
│     │  │        ├─ BasicMenu.vue
│     │  │        ├─ FacilityMenu.vue
│     │  │        ├─ LayersMenu.vue
│     │  │        ├─ RoomMenu.vue
│     │  │        └─ SecurityMenu.vue
│     │  ├─ data.json
│     │  ├─ index.vue
│     │  ├─ js
│     │  │  └─ heatmap.js
│     │  ├─ labels.ts
│     │  ├─ models
│     │  │  ├─ cabinetDevice
│     │  │  │  ├─ BaseDevice.ts
│     │  │  │  ├─ Switch_1U.ts
│     │  │  │  ├─ Switch_2U.ts
│     │  │  │  └─ Switch_3U.ts
│     │  │  ├─ Park.ts
│     │  │  ├─ parkDevice
│     │  │  │  ├─ AncillaryFacilities.ts
│     │  │  │  ├─ Back.ts
│     │  │  │  ├─ BaseParkDevice.ts
│     │  │  │  ├─ Build.ts
│     │  │  │  ├─ ChargePoint.ts
│     │  │  │  ├─ GeoFence.ts
│     │  │  │  ├─ InspectionFence.ts
│     │  │  │  ├─ OutdoorCamera.ts
│     │  │  │  ├─ Parking.ts
│     │  │  │  ├─ ParkingSpace.ts
│     │  │  │  ├─ SecuritySystem.ts
│     │  │  │  ├─ Storey.ts
│     │  │  │  ├─ StreetLamp.ts
│     │  │  │  └─ StreetLampSystem.ts
│     │  │  ├─ roomDevice
│     │  │  │  ├─ Aircondition.ts
│     │  │  │  ├─ Cabinet.ts
│     │  │  │  ├─ IndoorCamera.ts
│     │  │  │  ├─ RoomDevice.ts
│     │  │  │  ├─ Ups.ts
│     │  │  │  └─ Workbenches.ts
│     │  │  └─ SkyBox.ts
│     │  ├─ shaders
│     │  │  ├─ CameraConeShader.ts
│     │  │  ├─ CarFenceShader.ts
│     │  │  ├─ GeoFenceShader.ts
│     │  │  └─ RadarShader.ts
│     │  └─ TKThree.ts
│     └─ sys
│        ├─ error
│        │  └─ index.vue
│        ├─ iframe
│        │  ├─ FrameBlank.vue
│        │  └─ index.vue
│        ├─ login
│        │  ├─ index.vue
│        │  └─ useLogin.ts
│        └─ redirect
│           └─ index.vue
├─ tsconfig.json
├─ turbo.json
├─ types
│  ├─ axios.d.ts
│  ├─ bpmn
│  │  ├─ editor
│  │  │  └─ global.d.ts
│  │  ├─ index.d.ts
│  │  ├─ moddle.d.ts
│  │  └─ panel.d.ts
│  ├─ config.d.ts
│  ├─ directives.d.ts
│  ├─ global.d.ts
│  ├─ index.d.ts
│  ├─ module.d.ts
│  ├─ store.d.ts
│  ├─ utils.d.ts
│  └─ vue-router.d.ts
├─ uno.config.ts
├─ vite.config.ts
├─ vite.config.ts.timestamp-1760595692698-53bd1cabf136e.mjs
└─ vite.config.ts.timestamp-1767782727089-998e98f87b707.mjs

```