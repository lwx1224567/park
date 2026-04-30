<template>
  <div class="device-model-page">
    <!-- 3D 模型背景层 -->
    <DeviceModel3D class="device-model-bg" />

    <!-- 场景控制按钮 -->
    <div class="scene-controls">
      <div
        class="control-item"
        :class="{ active: basicMenu[0].active }"
        @click="handleClick(0, basicMenu[0])"
      >
        <a-tooltip placement="right" :title="basicMenu[0].name">
          <div class="icon"><img :src="basicMenu[0].icon" alt="" /></div>
        </a-tooltip>
      </div>
      <div
        class="control-item"
        :class="{ active: basicMenu[1].active }"
        @click="handleClick(1, basicMenu[1])"
      >
        <a-tooltip placement="right" :title="basicMenu[1].name">
          <div class="icon"><img :src="basicMenu[1].icon" alt="" /></div>
        </a-tooltip>
      </div>
    </div>

    <!-- 左侧卡片列：基本信息、设备状态、控制面板 -->
    <div class="main left-0">
      <Border3 name="基本信息" :delay="0">
        <LeftTop />
      </Border3>
      <Border3 name="设备状态" :delay="0.5">
        <LeftCenter />
      </Border3>
      <Border3 name="控制面板" :delay="1">
        <LeftBottom />
      </Border3>
    </div>

    <!-- 中间卡片列：两个占位卡片 + 数据分析卡片 -->
    <div class="main middle-0">
      <!-- 占位卡片 1：与左侧第一个卡片高度对齐 -->
      <Border3 class="empty-card" :delay="0">
      </Border3>
      <!-- 占位卡片 2：与左侧第二个卡片高度对齐 -->
      <Border3 class="empty-card" :delay="0.5">
      </Border3>
      <!-- 数据分析卡片：占满剩余空间，与左右两侧底部对齐 -->
      <Border3 name="数据分析" :delay="1" >
        <MiddleBottom />
      </Border3>
    </div>

    <!-- 右侧卡片列：根据设备类型展示不同卡片 -->
    <div class="main right-0">
      <!-- 服务器：板卡信息 -->
      <Border3 v-if="isServer" name="板卡信息" :delay="0" class="server-top-card">
        <RightTop />
      </Border3>
      <!-- 交换机：接口信息 -->
      <Border3 v-else name="接口信息" :delay="0">
        <RightTop />
      </Border3>
      <!-- 交换机：告警统计 -->
      <Border3 v-if="!isServer" name="告警统计" :delay="0.5">
        <RightCenter />
      </Border3>
      <!-- 操作日志（两种设备都显示） -->
      <Border3 name="操作日志" :delay="1" class="operation-log-card">
        <RightBottom />
      </Border3>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { provide, ref } from 'vue';
  import { Border3 } from '@/components/Border';
  import {
    DeviceModel3D,
    LeftBottom,
    LeftCenter,
    LeftTop,
    RightBottom,
    RightCenter,
    RightTop,
    MiddleBottom,
  } from './components';
  import { useDeviceDetail } from './hooks/useDeviceDetail';
  import { deviceModelContextKey } from './types/index';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';

  const basicMenu = ref([
    {
      name: '全局视角',
      icon: 'src/assets/icon/global-perspective.png',
      active: false,
    },
    {
      name: '场景漫游',
      icon: 'src/assets/icon/scene-roaming.png',
      active: false,
    },
  ]);

  const globalView = async (active) => {
    if (active && basicMenu.value[1].active) {
      basicMenu.value[1].active = false;
      TKEvenBus.getInstance().emit('panoramaRoam', {
        status: false,
        callback: () => {
          TKEvenBus.getInstance().emit('globalView', { status: active });
        },
      });
    } else {
      TKEvenBus.getInstance().emit('globalView', { status: active });
    }
  };

  const sceneRoam = async (active) => {
    if (active && basicMenu.value[0].active) {
      basicMenu.value[0].active = false;
      TKEvenBus.getInstance().emit('globalView', {
        status: false,
        callback: () => {
          TKEvenBus.getInstance().emit('panoramaRoam', { status: active });
        },
      });
    } else {
      TKEvenBus.getInstance().emit('panoramaRoam', { status: active });
    }
  };

  const handleClick = (index, item) => {
    basicMenu.value[index].active = !basicMenu.value[index].active;
    switch (item.name) {
      case '全局视角':
        globalView(item.active);
        break;
      case '场景漫游':
        sceneRoam(item.active);
        break;
    }
  };

  // 获取设备详情上下文
  const { context, isServer } = useDeviceDetail();

  // 提供上下文给子组件
  provide(deviceModelContextKey, context);
</script>

<style scoped>
  /* 页面容器：全屏布局 */
  .device-model-page {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    /* 背景图片 */
    background: url('@/assets/images/layouts/layout-bg.png') no-repeat center;
    background-size: 100% 100%;
  }

  /* 场景控制按钮容器 */
  .scene-controls {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 15px;
    z-index: 20;
  }

  /* 单个控制按钮 */
  .control-item {
    width: 50px;
    height: 50px;
    transition: all 0.3s;
    border: 1px solid #03a3ff;
    background: radial-gradient(circle, #043870 0%, #174474 50%, #6196c4 100%);
    cursor: pointer;

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;

      img {
        width: 80%;
        height: auto;
      }
    }

    &:hover {
      transform: translateY(-2px);
      background: radial-gradient(circle, #006cff 0%, #006cff 50%, #6196c4 100%);
    }

    &.active {
      background: radial-gradient(circle, #006cff 0%, #006cff 50%, #6196c4 100%);
    }
  }

  /* 3D 模型背景 */
  .device-model-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  /* 卡片列容器的基础样式 */
  .main {
    /* 弹性布局：纵向排列 */
    display: flex;
    /* 绝对定位：用于精确控制三列位置 */
    position: absolute;
    z-index: 10;
    /* 从顶部 70px 开始（导航栏高度）到底部 */
    top: 70px;
    bottom: 4px;
    /* 纵向排列：卡片从上到下堆叠 */
    flex-direction: column;
    /* 卡片宽度：占屏幕宽度的 22% */
    width: 22%;
    /* 卡片间距：8px */
    gap: 8px;
  }

  /* 左侧卡片列定位 */
  .left-0 {
    left: 16px;
  }

  /* 右侧卡片列定位 */
  .right-0 {
    right: 16px;
  }

  /* 中间卡片列定位 */
  .middle-0 {
    /* 左边界：距离左边 24%（避开左侧 22% + 间距） */
    left: 24%;
    /* 右边界：距离右边 24%（避开右侧 22% + 间距） */
    right: 24%;
    /* 宽度自动撑满中间区域 */
    width: auto;
    /* 顶部对齐：与左右两侧相同 */
    top: 70px;
    /* 底部对齐：与左右两侧相同 */
    bottom: 4px;
    /* 禁用指针事件：让占位卡片穿透事件到背景的 3D 模型 */
    pointer-events: none;
  }

  /* 占位卡片样式 */
  .empty-card {
    /* 完全透明：隐藏占位卡片但保留占位空间 */
    opacity: 0;
    /* 禁用指针事件：占位卡片不拦截鼠标事件 */
    pointer-events: none;
  }

  /* 中间卡片列中最后一个卡片（数据分析）的样式 */
  .middle-0 > :last-child {
    /* 启用指针事件：确保数据分析卡片捕获鼠标事件，防止传递给3D模型 */
    pointer-events: auto;
  }

  /* 确保数据分析卡片内的所有元素也能捕获鼠标事件 */
  .middle-0 > :last-child * {
    pointer-events: auto;
  }

  /* 响应式设计：平板及以上设备 */
  @media (max-width: 1280px) {
    .main {
      /* 卡片宽度调整为 28%（屏幕较小时增加卡片宽度） */
      width: 28%;
    }
  }

  /* 服务器页面的板卡信息卡片样式 */
  .server-top-card {
    flex: 2;
  }

  /* 操作日志卡片样式 */
  .operation-log-card {
    flex: 1;
    min-height: 200px;
  }
</style>
