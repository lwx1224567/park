<template>
  <div class="menu-wrapper">
    <div
      class="item"
      :class="{ active: item.active }"
      v-for="(item, index) in basicMenu"
      @click="handleClick(index, item)"
    >
      <a-tooltip placement="left" :title="item.name">
        <div class="icom"><img :src="item.icon" alt="" /></div>
      </a-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';
  const isMenu = ref(false); // 菜单显示隐藏
  const props = defineProps({
    curLayer: {
      type: Object,
      required: true,
      default: () => {},
    },
  });
  //监听
  watch(
    () => props.curLayer,
    (newCurLayer, oldCurLayer) => {
      //重置菜单状态
      basicMenu.value.forEach((item) => {
        item.active = false;
      });
      //原来楼层切换为普通视图
      TKEvenBus.getInstance().emit('setStoreyView', {
        id: oldCurLayer['id'],
        mode: 'Main',
      });
    },
  );

  //点击菜单
  const handleClick = (index, item) => {
    resetMenu(index);
    if (item.active) {
      TKEvenBus.getInstance().emit('setStoreyView', {
        id: props.curLayer['id'],
        mode: item.value,
      });
    } else {
      TKEvenBus.getInstance().emit('setStoreyView', {
        id: props.curLayer['id'],
        mode: 'Main',
      });
    }
  };
  //基础菜单
  const basicMenu = ref([
    {
      name: '热力视图',
      icon: 'src/assets/icon/fire.png',
      active: false,
      value: 'Heatmap',
    },
    {
      name: '空闲视图',
      icon: 'src/assets/icon/idleview.png',
      active: false,
      value: 'RemainCapacity',
    },
    {
      name: '能耗视图',
      icon: 'src/assets/icon/EnergyConsumptionView.png',
      active: false,
      value: 'Energy',
    },
  ]);
  //除了当前点击的，其余菜单状态重置
  const resetMenu = (e) => {
    basicMenu.value.forEach((item, index) => {
      if (index !== e) {
        basicMenu.value[index].active = false;
      }
    });
    basicMenu.value[e].active = !basicMenu.value[e].active;
  };

  onMounted(async () => {});
  onUnmounted(() => {
    //组件销毁时，还原机房为主视图
    TKEvenBus.getInstance().emit('setStoreyView', {
      id: props.curLayer['id'],
      mode: 'Main',
    });
  });
</script>

<style scoped lang="less">
  .menu-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    gap: 15px;

    .item {
      width: 100%;
      height: 50px;
      transition: all 0.3s;
      border: 1px solid #03a3ff;
      background: radial-gradient(circle, #043870 0%, #174474 50%, #6196c4 100%);
      cursor: pointer;

      .icom {
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
  }
</style>
