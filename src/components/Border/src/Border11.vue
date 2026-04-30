<template>
  <div class="border-wrapper" :class="{ collapsed: isCollapsed }">
    <div class="title">
      <span class="text">{{ title }}</span>
      <div class="tool">
        <slot name="tool"></slot>
      </div>
    </div>
    <div class="border-content" v-show="!isCollapsed">
      <div class="content">
        <slot></slot>
      </div>
    </div>

    <!-- 收起展开按钮 -->
    <div
      class="toggle-btn"
      :class="{
        'toggle-left': position === 'left',
        'toggle-right': position === 'right',
      }"
      @click="toggleCollapse"
    >
      <div class="toggle-icon">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          :class="{ rotated: isCollapsed }"
        >
          <path
            d="M4 2L8 6L4 10"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const props = defineProps({
    title: { type: String, default: () => '标题' },
    showTitle: { type: Boolean, default: true },
    showHeader: { type: Boolean, default: true },
    position: {
      type: String,
      default: 'left',
      validator: (value: string) => ['left', 'right'].includes(value),
    },
    defaultCollapsed: { type: Boolean, default: false },
  });

  const emit = defineEmits(['toggle']);

  const isCollapsed = ref(props.defaultCollapsed);

  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value;
    emit('toggle', isCollapsed.value);
  };
</script>

<style lang="less" scoped>
  .border-wrapper {
    display: flex;
    position: relative;
    flex-direction: column;
    height: 100%;
    transition: all 0.3s;
    background: rgb(0 54 121 / 50%);
    box-shadow:
      inset 0 6px 12px rgb(255 255 255 / 5%),
      inset 0 -6px 12px rgb(255 255 255 / 5%),
      inset 0 0 30px rgb(255 255 255 / 5%);

    &.collapsed {
      width: 0;
      min-width: 0;
      overflow: visible; /* 让按钮可以显示在外面 */
      .toggle-btn.toggle-left {
        right: -13px;
        clip-path: polygon(0 0, 100% 15%, 100% 85%, 0 100%); // 向内突出（左侧）
      }

      .toggle-btn.toggle-right {
        left: -13px;
        clip-path: polygon(0 15%, 100% 0, 100% 100%, 0 85%); // 向内突出（右侧）
      }

      .title {
        display: none;
      }
    }

    .title {
      display: flex;
      position: relative;
      z-index: 1;
      padding: 5px 10px;
      background: url('@/assets/images/layouts/border5-bg-t.png') no-repeat;
      background-position: left -80px top;
      background-size: auto 100%;

      .text {
        overflow: hidden;
        color: #d8effc;
        font-size: 18px;
        font-weight: bold;
        text-overflow: ellipsis;
        white-space: nowrap;
        user-select: none;
      }

      .tool {
        position: absolute;
        top: 6px;
        right: 10px;
      }
    }

    &::before {
      content: '';
      position: absolute;
      z-index: 0;
      background: url('@/assets/images/layouts/border8-bg-tl.png') no-repeat;
      background-position: left bottom;
      inset: 0;
    }

    &::after {
      content: '';
      position: absolute;
      z-index: 0;
      background: url('@/assets/images/layouts/border8-bg-tr.png') no-repeat;
      background-position: right bottom;
      inset: 0;
    }

    .border-content {
      position: relative;
      flex: auto;

      .content {
        position: absolute;
        z-index: 1;
        padding: 10px;
        overflow-y: auto;
        inset: 0;
      }
    }

    .toggle-btn {
      display: flex;
      position: absolute;
      z-index: 11;
      top: 50%;
      align-items: center;
      justify-content: center;
      width: 13px;
      height: 70px;
      transform: translateY(-50%);
      transition: all 0.3s ease;
      border: 1px solid #0af;
      background: linear-gradient(135deg, #06c, #049);
      box-shadow:
        0 2px 8px rgb(0 170 255 / 30%),
        inset 0 1px 2px rgb(255 255 255 / 20%);
      color: #fff;
      cursor: pointer;

      &:hover {
        background: linear-gradient(135deg, #07d, #05a);
        box-shadow:
          0 4px 12px rgb(0 170 255 / 50%),
          inset 0 1px 2px rgb(255 255 255 / 30%);
      }

      &.toggle-left {
        right: 0; // 展开时在框内
        clip-path: polygon(0 15%, 100% 0, 100% 100%, 0 85%);

        .toggle-icon svg {
          transform: rotate(180deg); // 展开时指向左边

          &.rotated {
            transform: rotate(0deg); // 收起时指向右边
          }
        }
      }

      &.toggle-right {
        left: 0; // 展开时在框内
        clip-path: polygon(0 0, 100% 15%, 100% 85%, 0 100%);

        .toggle-icon svg {
          transform: rotate(0deg); // 展开时指向右边

          &.rotated {
            transform: rotate(180deg); // 收起时指向左边
          }
        }
      }

      .toggle-icon {
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          transition: transform 0.3s ease;
        }
      }
    }
  }
</style>
