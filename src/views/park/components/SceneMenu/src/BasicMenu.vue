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
  import { ref } from 'vue';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';

  // 全局视角
  const globalView = async (active) => {
    if (active && basicMenu.value[1].active) {
      basicMenu.value[1].active = false;
      TKEvenBus.getInstance().emit('panoramaRoam', {
        status: false,
        callback: () => {
          TKEvenBus.getInstance().emit('globalView', { status: active });
        },
      }); //关闭场景漫游后再开启全局视角
    } else {
      TKEvenBus.getInstance().emit('globalView', { status: active });
    }
  };
  // 场景漫游
  const sceneRoam = async (active) => {
    if (active && basicMenu.value[0].active) {
      basicMenu.value[0].active = false;
      TKEvenBus.getInstance().emit('globalView', {
        status: false,
        callback: () => {
          TKEvenBus.getInstance().emit('panoramaRoam', { status: active });
        },
      }); //关闭全局视角后再开启场景漫游
    } else {
      TKEvenBus.getInstance().emit('panoramaRoam', { status: active });
    }
  };
  //菜单点击
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
  //基础菜单
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
