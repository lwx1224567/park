<!--这段代码实现了一个带有逐字动画的标题栏组件（titleCom），
用于 Border3 边框组件的顶部，
显示标题文字并伴随序列帧动画和图标，增强视觉动效。-->
<template>
  <div class="titleBodyCom">
    <sequence></sequence>
    <div class="icon">
      <img src="./assets/icon_right.png" alt="">
    </div>
    <div class="itemTitle">
      <span
          class="text"
          v-for="(char, index) in titleArray"
          :key="index"
          :style="{ '--delay': `${index * 0.1}s` }"
      >
        {{ char }}
      </span>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import sequence from "./sequence/index.vue";
const props = defineProps({
  name: {
    type: String,
    default: ''
  }
})

const titleArray = computed(() => props.name.split(''))
</script>

<style lang="scss" scoped>

.titleBodyCom {
  display: flex;
  position: relative;
  z-index: 1;
  flex-flow: row nowrap;
  place-content: flex-start flex-start;
  align-items: center;
  width: 100%;
  height: 30px;
  border-bottom: 0;

  .icon {
    display: flex;
    flex-flow: row nowrap;
    place-content: flex-start center;
    align-items: center;
    width: 30px;
    height: 30px;

    img {
      width: 15px;
    }
  }

  .itemTitle {
    display: flex;
    flex-flow: row nowrap;
    place-content: flex-start center;
    align-items: center;
    margin-right: 10px;
    margin-left: 0;

    .text {
      transform: translateY(1em);
      animation: appear 0.5s forwards;
      animation-delay: var(--delay);
      opacity: 0;
      background: linear-gradient(180deg, #FFF 0%, #88B8FF 100%);
      background-clip: text;
      font-size: 16px;
      font-style: normal;
      font-weight: bold;
      text-align: left;
      text-transform: none;
      -webkit-text-fill-color: transparent;
    }
  }
}

@keyframes appear {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>

