<template>
  <canvas ref="animation_canvas" class="animation_canvas" id="animation_canvas"></canvas>
</template>

<script>
export default {
  name: "sequence",
  data() {
    return {
      images: [],
      animationInterval: null
    }
  },
  props: {
    fileLength: {
      type: Number,
      default: 74
    },
    IntervalTime: {
      type: Number,
      default: 40
    },
  },
  async mounted() {
    await this.loadFirstImage();
    await this.loadAllImages();
    this.startAnimation();
  },
  methods: {
    async loadFirstImage() {
      const firstImage = await import(`./img/0.png`);
      this.drawImage(firstImage.default);
    },
    async loadAllImages() {
      for (let i = 0; i <= this.fileLength; i++) {
        const image = await import(`./img/${i}.png`);
        const img = new Image();
        img.src = image.default;
        await new Promise(resolve => {
          img.onload = resolve;
        });
        this.images.push(img);
      }
    },
    drawImage(src) {
      const canvas = this.$refs.animation_canvas;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = this.$refs.animation_canvas.offsetWidth;
        canvas.height = this.$refs.animation_canvas.offsetHeight;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = src;
    },
    startAnimation() {
      let imageNow = 0;
      const canvas = this.$refs.animation_canvas;
      const ctx = canvas.getContext("2d");
      
      this.animationInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.images[imageNow], 0, 0, canvas.width, canvas.height);
        imageNow = (imageNow + 1) % this.images.length;
      }, this.IntervalTime);
    }
  },
  beforeUnmount() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }
}
</script>

<style lang="scss" scoped>
.animation_canvas {
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
}
</style>
