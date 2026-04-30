<template>
  <div class="park3d">
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { TKThree } from '@/views/park/TKThree';
  import parkData from '../data.json';

  onMounted(async () => {
    const app = new TKThree(document.getElementById('container'));
    // 直接使用本地数据,不调用接口
    await app.init(parkData);
  });
</script>

<style scoped lang="less">
  .park3d {
    position: relative;
    width: 100%;
    height: 100%;

    #container {
      width: 100%;
      height: 100%;
    }
  }
</style>
<style lang="less">
  .sprite-tag {
    position: absolute;
    z-index: 1; /* 控制显示层级 */
    width: 9vw;
    height: 3vh;
    background: url('../assets/model_tag.gif') no-repeat center;
    background-size: 100% auto;
    color: whitesmoke;
    font-size: 1.1em;
    line-height: 3vh;
    text-indent: 3vw;
    pointer-events: none;
  }

  .hidden {
    display: none;
  }
</style>
