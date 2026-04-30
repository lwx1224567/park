<template>
  <!-- 右侧侧抽屉 -->
  <div class="text-white abox" :style="aStyle">
    <div class="w-full h-full scroll-def">
      <div class="w-full h-full p-l-3 py-3 pr-12">
        <slot></slot>
      </div>
    </div>
    <div :class="{ togbtn: true, togbtn_active: !show }" @click="onClick"></div>
  </div>
</template>
<script setup name="modelLeft">
  import { ref, computed } from 'vue';

  const props = defineProps({
    width: {
      type: Number,
      default: 500,
    },
  });

  // 弹框控制
  const show = ref(true);
  const aStyle = computed(() => {
    const w = show.value ? props.width : 0;
    return {
      width: `${w}px`,
      '--borderRightWidth': show.value ? '1px' : 0,
    };
  });
  const onClick = () => {
    show.value = !show.value;
  };

  defineExpose({});
</script>

<style lang="less" scoped>
  // 滚动条样式
  .scroll-def {
    overflow-y: auto;

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-clip: padding-box;
      //滚动条的设置
      background-color: rgb(14 59 150 / 10%);
      cursor: pointer;
    }

    &:hover {
      &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background-clip: padding-box;
        //滚动条的设置
        background-color: rgb(14 59 150 / 50%);
      }
    }

    &::-webkit-scrollbar-track-piece {
      //滚动条凹槽的颜色，还可以设置边框属性
      background-color: transparent;
    }

    &::-webkit-scrollbar {
      //滚动条的宽度
      width: 6px;
      height: 6px;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: rgb(14 59 150 / 80%);
    }
  }

  .abox {
    position: absolute;
    z-index: 999;
    top: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    transform: translateY(0);
    transition: all 0.2s;

    &::after {
      content: ' ';
      position: absolute;
      z-index: -1;
      top: -60%;
      bottom: -60%;
      width: 100%;
      border-right: var(--borderRightWidth) solid rgb(36 101 197 / 100%);
      border-radius: 0 50% 50% 0;
      background: linear-gradient(
        to bottom,
        rgb(17 42 85 / 0%) 19.9%,
        rgb(17 42 85 / 10%) 25%,
        rgb(17 42 85 / 20%) 50%,
        rgb(17 42 85 / 10%) 75%,
        rgb(17 42 85 / 0%) 100%
      );
      background-color: rgb(17 42 85 / 30%);
    }
  }

  .togbtn {
    position: absolute;
    z-index: 10;
    top: 50%;
    right: 0;
    padding: 60px 7px;
    transform: translate(50%, -50%);
    transition: all 0.2s;
    border-radius: 10px;
    background: linear-gradient(
      to right,
      rgb(63 149 238 / 100%),
      rgb(19 102 184 / 100%),
      rgb(50 141 233 / 100%)
    );
    box-shadow: 0 0 10px rgb(114 144 233 / 50%);
    color: #fff;
    cursor: pointer;

    &.togbtn_active {
      transform: translate(70%, -50%);
    }

    &:hover {
      background: linear-gradient(
        to right,
        rgb(63 149 238 / 100%),
        rgb(19 102 184 / 100%),
        rgb(50 141 233 / 100%)
      );
      box-shadow: 0 0 10px rgb(114 144 233 / 70%);
    }
  }
</style>
