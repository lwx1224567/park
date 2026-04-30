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
