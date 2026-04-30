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
  // 周界安防场景菜单
  import { ref, onMounted, computed, onUnmounted } from 'vue';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';

  const handleClick = (index, item) => {
    basicMenu.value[index].active = !basicMenu.value[index].active;
    if (item.active) {
      TKEvenBus.getInstance().emit('showSecuritySystem');
    } else {
      TKEvenBus.getInstance().emit('hideSecuritySystem');
    }
  };
  //基础菜单
  const basicMenu = ref([
    {
      name: '电子围栏',
      icon: 'src/assets/icon/electronic-fence.png',
      active: true,
    },
  ]);

  onMounted(async () => {
    TKEvenBus.getInstance().emit('showSecuritySystem');
  });
  onUnmounted(() => {
    TKEvenBus.getInstance().emit('hideSecuritySystem');
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
