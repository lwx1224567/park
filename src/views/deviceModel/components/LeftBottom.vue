<template>
  <!-- 整个控制卡片容器，采用垂直弹性布局 -->
  <div class="control-card">
    <!-- ==================== 工作模式区块 ==================== -->
    <!-- 使用特殊类 mode-control-block 实现标签与第一行选项基线对齐 -->
    <div class="control-block mode-control-block">
      <!-- 区块标签：工作模式 -->
      <div class="block-label">工作模式：</div>
      <!-- 单选按钮组容器，纵向排列两行 -->
      <div class="mode-radio-group">
        <!-- 第一行：性能模式 + 节能模式 -->
        <div class="mode-row">
          <label class="mode-item">
            <!-- radio 绑定 controlState.workMode，值为 'lowPower' -->
            <input
              type="radio"
              :value="'lowPower'"
              v-model="controlState.workMode"
              @change="handleModeChange"
            />
            <span class="mode-text">性能模式</span>
          </label>
          <label class="mode-item">
            <input
              type="radio"
              :value="'normal'"
              v-model="controlState.workMode"
              @change="handleModeChange"
            />
            <span class="mode-text">节能模式</span>
          </label>
        </div>
        <!-- 第二行：高性能模式（单独一行，便于视觉分组） -->
        <div class="mode-row">
          <label class="mode-item">
            <input
              type="radio"
              :value="'highPerformance'"
              v-model="controlState.workMode"
              @change="handleModeChange"
            />
            <span class="mode-text">高性能模式</span>
          </label>
        </div>
      </div>
    </div>

    <!-- ==================== 电源开关区块 ==================== -->
    <!-- 使用 switch-block 类实现水平布局（标签与开关在同一行） -->
    <div class="control-block switch-block">
      <div class="block-label">电源开关：</div>
      <!-- 开关外层包装，用于定位与事件 -->
      <div class="toggle-switch-wrapper">
        <!-- 自定义开关元素，根据 powerOn 状态动态添加 active 类 -->
        <div
          :class="['toggle-switch', { active: controlState.powerOn }]"
          @click="handlePowerChange"
        >
          <!-- 圆形滑块 -->
          <div class="toggle-circle"></div>
        </div>
      </div>
    </div>

    <!-- ==================== 设备自检区块 ==================== -->
    <!-- 使用 health-check-block 类实现水平布局（标签、进度条、文字在同一行） -->
    <div class="control-block health-check-block">
      <div class="block-label">设备自检：</div>
      <!-- 进度条区域：采用网格布局，左侧进度条，右侧百分比文本 -->
      <div class="progress-wrap">
        <div class="progress-bar-container">
          <!-- 进度填充宽度动态绑定 healthPercent，并带有流光动画 -->
          <div class="progress-fill" :style="{ width: healthPercent }"></div>
        </div>
        <span class="progress-text">{{ healthText }}</span>
      </div>
    </div>

    <!-- 状态列表（原有设计已删除，保留空注释说明） -->
    <!-- 注：原状态列表功能已移除，后续可扩展 -->
  </div>
</template>

<script setup lang="ts">
  // ==================== 导入依赖 ====================
  import { computed, inject, reactive } from 'vue';
  import type { DeviceControlState, DeviceWorkMode } from '../types';
  import { deviceModelContextKey } from '../types';

  // ==================== 本地模拟数据（当没有注入上下文时使用） ====================
  const mockControlState: DeviceControlState = {
    workMode: 'normal', // 默认正常模式
    powerOn: true, // 默认开机
    healthScore: 96, // 默认健康度96%
  };

  // 尝试从父组件注入设备控制上下文（用于真实数据同步）
  const deviceContext = inject(deviceModelContextKey, null);
  // 回退状态：如果没有注入上下文，则使用本地响应式状态
  const fallbackState = reactive<DeviceControlState>({ ...mockControlState });
  // 最终使用的控制状态（优先使用上下文中的状态，否则使用本地回退状态）
  const controlState = deviceContext?.controlState ?? fallbackState;

  // ==================== 辅助映射表 ====================
  // 工作模式对应的中文显示文本（注意：代码中实际未使用该映射，但保留用于可能的扩展）
  const modeTextMap: Record<DeviceWorkMode, string> = {
    lowPower: '低电源模式',
    normal: '正常模式',
    highPerformance: '高性能模式',
  };

  // 不同工作模式对应的模拟健康分数（用于本地回退模式下，切换模式时更新健康分）
  const modeHealthMap: Record<DeviceWorkMode, number> = {
    lowPower: 88,
    normal: 96,
    highPerformance: 100,
  };

  // ==================== 计算属性 ====================
  // 当前模式对应的文本（目前未在模板中使用，保留以备后续显示）
  const modeText = computed(() => modeTextMap[controlState.workMode]);

  // 健康百分比字符串（用于进度条宽度）
  const healthPercent = computed(() => {
    // 如果设备断电，进度条宽度为0%
    if (!controlState.powerOn) return '0%';
    // 否则返回健康分数 + '%'
    return `${controlState.healthScore}%`;
  });

  // 健康文本（显示在进度条右侧）
  const healthText = computed(() =>
    controlState.powerOn ? `${controlState.healthScore}%` : '未执行',
  );

  // ==================== 事件处理函数 ====================
  /**
   * 工作模式切换时的处理
   * 如果有注入上下文，则调用上下文方法同步模式；
   * 否则（本地回退模式）在开机状态下根据新模式更新健康分数。
   */
  const handleModeChange = () => {
    if (deviceContext) {
      // 真实设备环境：通过上下文更新工作模式
      deviceContext.updateWorkMode(controlState.workMode);
      return;
    }

    // 本地模拟环境：如果电源开启，则根据新模式改变健康分数
    if (controlState.powerOn) {
      controlState.healthScore = modeHealthMap[controlState.workMode];
    }
  };

  /**
   * 电源开关点击处理
   * 切换 powerOn 状态，并通过上下文或本地逻辑同步健康分数。
   */
  const handlePowerChange = () => {
    const newPowerState = !controlState.powerOn;

    if (deviceContext) {
      // 真实设备环境：调用上下文方法更新电源状态
      deviceContext.updatePower(newPowerState);
      return;
    }

    // 本地模拟环境：直接修改状态
    controlState.powerOn = newPowerState;
    // 如果开机则根据当前工作模式设置健康分数，否则置0
    controlState.healthScore = newPowerState ? modeHealthMap[controlState.workMode] : 0;
  };
</script>

<style scoped>
  /* ==================== 整体卡片容器 ==================== */
  .control-card {
    display: flex; /* 弹性布局 */
    flex-direction: column; /* 垂直排列各区块 */
    gap: 16px; /* 区块之间间距16px */
    height: 100%; /* 填满父容器高度 */
    padding: 14px 12px 10px; /* 内边距：上14px 左右12px 下10px */
    box-sizing: border-box; /* 使padding不影响总宽高 */
  }

  /* ==================== 公共区块样式 ==================== */
  .control-block {
    display: flex;
    flex-direction: column; /* 默认垂直排列（标签在上，内容在下） */
    gap: 10px; /* 标签与内容间距 */
  }

  /* 电源开关区块：覆盖为水平排列（标签与开关同行） */
  .switch-block {
    flex-direction: row; /* 改为水平方向 */
    align-items: center; /* 垂直居中对齐 */
    justify-content: flex-start; /* 靠左排列 */
    gap: 8px; /* 标签与开关间距8px（更紧凑） */
  }

  /* 所有区块的标签公用样式 */
  .block-label {
    color: #a9ddff; /* 淡蓝色文字 */
    font-size: 14px;
    font-weight: 600; /* 半粗体 */
  }

  /* ==================== 工作模式区块特殊样式 ==================== */
  /* 使标签与第一行选项基线对齐，而非垂直居顶 */
  .mode-control-block {
    flex-direction: row; /* 水平排列标签与选项组 */
    align-items: baseline; /* 基线对齐：标签文字底部与第一行选项文字底部对齐 */
    gap: 12px;
  }

  /* 保证标签在水平布局中不收缩 */
  .mode-control-block .block-label {
    flex-shrink: 0; /* 禁止缩小，保持固定宽度 */
    /* 原有 line-height 注释移除，基线对齐更自然 */
  }

  /* 单选按钮组容器：垂直排列两行 */
  .mode-radio-group {
    display: flex;
    flex-direction: column;
    gap: 8px; /* 两行之间间距8px */
  }

  /* 每一行选项容器 */
  .mode-row {
    display: flex;
    gap: 8px; /* 同行两个选项间距8px */
  }

  /* 单个选项（包含radio和文字） */
  .mode-item {
    display: flex;
    align-items: center; /* 垂直居中radio与文字 */
    gap: 6px;
    cursor: pointer;
    user-select: none; /* 避免双击选中文字 */
  }

  /* radio按钮样式 */
  .mode-item input[type='radio'] {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #1fe0ff; /* 主题青色 */
  }

  /* 模式文字 */
  .mode-text {
    font-size: 13px;
    color: #def6ff;
    font-weight: 500;
  }

  /* ==================== 电源开关自定义滑块样式 ==================== */
  /* 开关外层包装（便于扩展） */
  .toggle-switch-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* 自定义开关主体 */
  .toggle-switch {
    width: 44px;
    height: 24px;
    border-radius: 12px; /* 圆角胶囊形状 */
    background: rgba(77, 111, 143, 0.5); /* 半透明暗色背景（关闭状态） */
    cursor: pointer;
    position: relative; /* 为内部滑块提供定位基准 */
    transition: all 0.3s ease;
    border: 1px solid rgba(76, 166, 255, 0.2);
  }

  /* 开启状态样式：渐变背景 + 发光边框 */
  .toggle-switch.active {
    background: linear-gradient(90deg, #00c6ff 0%, #00d98f 100%);
    border-color: rgba(0, 198, 255, 0.5);
    box-shadow: 0 0 20px rgba(0, 198, 255, 0.4);
  }

  /* 圆形滑块 */
  .toggle-circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.95);
    position: absolute;
    top: 2px; /* 垂直居中（24px高 - 20px圆 = 4px /2 =2px） */
    left: 2px; /* 关闭状态左侧位置 */
    transition: left 0.3s ease;
  }

  /* 开启状态滑块移动到右侧 */
  .toggle-switch.active .toggle-circle {
    left: 22px; /* 44px - 20px - 2px = 22px */
  }

  /* ==================== 设备自检区块特殊样式 ==================== */
  /* 使标签、进度条、数字在同一行水平排列 */
  .health-check-block {
    flex-direction: row; /* 改为水平方向 */
    align-items: center; /* 垂直居中对齐 */
    gap: 8px; /* 标签与进度条间距 */
  }

  .health-check-block .block-label {
    flex-shrink: 0; /* 禁止缩小，保持固定宽度 */
  }

  /* 调整进度条包装器 */
  .health-check-block .progress-wrap {
    display: grid;
    grid-template-columns: 160px auto; /* 进度条宽度固定为80px，文字自动宽度 */
    gap: 6px; /* 减小进度条与数字间距 */
    align-items: center;
    flex: 0 0 auto; /* 不伸缩 */
  }

  /* ==================== 进度条样式 ==================== */
  .progress-wrap {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto; /* 左侧进度条自适应，右侧文本自动宽度 */
    gap: 10px;
    align-items: center;
  }

  /* 进度条外框 */
  .progress-bar-container {
    width: 100%;
    height: 10px;
    background: rgba(10, 40, 80, 0.8); /* 深色半透明背景 */
    border-radius: 4px;
    overflow: hidden; /* 裁剪超出圆角部分 */
    border: 1px solid rgba(31, 224, 255, 0.2);
  }

  /* 进度填充条 */
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00d98f 0%, #1fe0ff 100%);
    border-radius: 3px;
    box-shadow: 0 0 15px rgba(0, 201, 143, 0.6);
    transition: width 0.3s ease; /* 宽度变化动画 */
    position: relative; /* 为流光伪元素提供定位 */
  }

  /* 流光扫光效果 */
  .progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: shimmer 2s infinite; /* 无限循环扫光动画 */
  }

  /* 扫光动画关键帧 */
  @keyframes shimmer {
    0% {
      transform: translateX(-100%); /* 从左边完全隐藏开始 */
    }
    100% {
      transform: translateX(100%); /* 移动到右侧完全隐藏 */
    }
  }

  /* 进度条右侧百分比文字 */
  .progress-text {
    min-width: 42px; /* 保证最少宽度，避免跳动 */
    color: #75ffbf;
    font-size: 13px;
    font-weight: 700;
    text-align: right;
  }
</style>
