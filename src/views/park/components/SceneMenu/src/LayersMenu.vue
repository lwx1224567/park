<template>
  <div class="layers-bar" v-if="isLayers">
    <div
      class="layer"
      @click="handleClick(item, index)"
      :class="{ active: item.isActive }"
      v-for="(item, index) in layers"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';
  import { TKBaseObject } from '@/utils/TKThree/TKBaseObject';

  const isLayers = ref(false);
  const layers = ref<any[]>([]);

  const handleClick = (item: any, index) => {
    TKBaseObject.stopAllAlarms();
    layers.value.forEach((item) => {
      item.isActive = false;
    });
    item.isActive = true;
    TKEvenBus.getInstance().emit('storeySelected', item);
  };

  const toggleLayers = async ({ status, layerId, buildId }) => {
    if (status && buildId) {
      // 不调用API,使用空数据
      layers.value = [];
      isLayers.value = status;
    } else {
      isLayers.value = status;
    }
  };

  onMounted(async () => {
    TKEvenBus.getInstance().on('toggleLayers', toggleLayers);
  });
</script>

<style scoped lang="less">
  .layers-bar {
    position: absolute;
    top: 55%;
    right: 25%;
    width: 50px;
    height: auto;
    border: 1px solid rgb(82 153 211);
    background: rgb(82 153 211 / 40%);
    font-size: 18px;

    .layer {
      width: 100%;
      border: 2px solid transparent;
      color: #fff;
      font-weight: bold;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      user-select: none;

      &.active {
        border: 2px solid;
        background: linear-gradient(
          90deg,
          rgb(48 122 182 / 0%) 0%,
          #1d5a8c 31%,
          #5299d3 54%,
          #1d5a8c 76%,
          rgb(29 90 140 / 0%) 100%
        );
        border-image: linear-gradient(90deg, rgb(179 233 255 / 0%), #96dbff, rgb(124 207 255 / 0%))
          2 2;
      }
    }
  }
</style>
