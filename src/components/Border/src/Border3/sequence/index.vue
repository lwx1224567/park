<!--这是一个序列帧动画背景组件，适合需要动态、循环动画作为装饰边框或背景的场景。
使用时需提供连续的 PNG 序列，组件会自动循环播放。-->
<template>
  <canvas ref="animationCanvas" class="animation_canvas" id="animation_canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

// Props
const props = defineProps({
  // 文件数量
  fileLength: {
    type: Number,
    default: 70
  },
  // 动画间隔
  IntervalTime: {
    type: Number,
    default: 50
  }
});

// Refs
const animationCanvas = ref(null);

// Methods
const loadImages2 = async (sources) => {
  for (let i = 1; i <= 105; i++) {
    const image = await import(`./bg/${i}.png`);
    sources.push(image.default);
  }
};

const loadImages = (sources, callback) => {
  let loadedImages = 0;
  const numImages = sources.length;
  const images = [];

  for (let i = 0; i < numImages; i++) {
    images[i] = new Image();
    images[i].onload = () => {
      if (++loadedImages >= numImages) {
        callback(images);
      }
    };
    images[i].src = sources[i];
  }
};

const playImages = (images, ctx, width, height, intervalTime) => {
  let imageNow = 0;
  setInterval(() => {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(images[imageNow], 0, 0, width, height);
    imageNow = (imageNow + 1) % images.length;
  }, intervalTime);
};

// Lifecycle hook
onMounted(async () => {
  await nextTick();
  const canvas = animationCanvas.value;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      // console.error('Failed to get canvas context');
      return;
    }
    const sources = [];

    // 先加载第一张图片并展示
    const firstImage = await import(`./bg/0.png`);
    sources.push(firstImage.default);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const firstImgElement = new Image();
    firstImgElement.src = sources[0];
    firstImgElement.onload = () => {
      ctx.drawImage(firstImgElement, 0, 0, width, height);
    };

    // 加载剩余的图片
    await loadImages2(sources);

    // 执行图片预加载，加载完成后执行动画
    loadImages(sources, (images) => {
      playImages(images, ctx, width, height, props.IntervalTime);
    });
  }
});
</script>

<style scoped>
.animation_canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
