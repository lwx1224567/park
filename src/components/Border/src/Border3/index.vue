<!--Border3/index.vue 是一个装饰性容器组件，
专为大屏可视化项目设计，提供动态展开动画、标题栏和科技感边框背景。
使用时只需包裹需要展示的内容，并传入标题即可快速生成风格统一的模块。-->
<template>
  <div class="pageBody">
    <div class="pageBodyInner" ref="inner" v-if="show">
      <titleCom :name="name"></titleCom>
      <div class="itemMain">
        <div class="absolute inset-0 p-[5px]">
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="bg" ref="bg" v-if="!show"></div>
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick, computed } from 'vue';
  import gsap from 'gsap';
  import titleCom from './titleCom.vue';

  const props = defineProps({
    name: {
      type: String,
      default: '',
    },
    delay: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0.5,
    },
  });

  const show = ref(false);
  const showSequence = ref(false);
  const bg = ref(null);
  const inner = ref(null);
  const backgroundImage = ref(null);

  const backgroundStyle = computed(() => {
    return backgroundImage.value
      ? {
          background: `url(${backgroundImage.value}) no-repeat`,
          backgroundSize: '100% 100%',
        }
      : {};
  });

  const loadBackgroundImage = async () => {
    try {
      const image = await import('./assets/itembg.png');
      backgroundImage.value = image.default;
    } catch (error) {
      // console.error('Failed to load background image:', error);
    }
  };

  const animationComplete = () => {
    showSequence.value = false;
    gsap.to(inner.value, {
      opacity: 1,
      duration: 0,
      onComplete: loadBackgroundImage,
    });
  };

  onMounted(() => {
    gsap.to(bg.value, {
      height: '100%',
      delay: props.delay,
      duration: props.duration,
      ease: 'none',
      onComplete: () => {
        setTimeout(() => {
          show.value = true;
          showSequence.value = true;
        }, 100);
      },
    });
  });
</script>

<style lang="scss" scoped>
  .pageBody {
    display: flex;
    position: relative;
    z-index: 1;
    flex: 1;
    flex-flow: column nowrap;
    align-items: flex-start;
    place-content: flex-start flex-start;
    width: 100%;
    height: 100%;

    .pageBodyInner {
      display: flex;
      position: relative;
      z-index: 1;
      flex-direction: column;
      width: 100%;
      height: 100%;
      border: 1px solid rgba(#010b27, 0.7);
      background: linear-gradient(0deg, rgba(#05143f, 0.5), rgb(5 20 63 / 50%));

      .itemMain {
        display: flex;
        position: relative;
        z-index: 10;
        box-sizing: border-box;
        flex-flow: row nowrap;
        align-items: center;
        height: calc(100% - 30px);
        background: url('./assets/itembg.png') no-repeat;
        background-size: 100% 100%;
        place-content: flex-start center;
      }
    }

    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 0%;
      background: linear-gradient(to bottom, rgba(#062d6c, 0.3), rgba(#062d6c, 0.6));
    }
  }
</style>
