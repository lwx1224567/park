<template>
  <div v-if="visible" class="lp-bg" >
    <img v-if="currentSrc" class="lp-logo" :src="currentSrc" alt="logo" aria-hidden="true" />

    <!-- 进度显示区域 -->
    <div class="lp-progress-container">
      <!-- 总体进度 -->
      <div class="lp-progress-item">
        <div class="lp-progress-label">模型加载进度</div>
        <a-progress
          :percent="Math.round(totalProgress)"
          :show-info="true"
          :stroke-width="18"
          :stroke-color="{
            '0%': '#108ee9',
            '100%': '#87d068',
          }"
        />
        <div class="lp-progress-text">
          {{ loadedCount }} / {{ totalCount }} 个模型
        </div>
      </div>

    </div>
  </div>

</template>

<script lang="ts" setup>
/**
 * 加载页面组件
 * 仅显示总体进度
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { TKEvenBus } from '@/utils/TKThree/TKEvenBus'

interface Props {
  visible?: boolean  // 是否显示加载页面
  /** 帧率（每秒帧数） */
  fps?: number
}
const props = withDefaults(defineProps<Props>(), { visible: true, fps: 12 })

// 背景图样式
const bgUrl = new URL('@/assets/components/Loading/bj.png', import.meta.url).href
const bgStyle = computed(() => ({
  backgroundImage: `url(${bgUrl})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
}))

// 载入序列帧动画（按文件名排序）
const frameModules = import.meta.glob('@/assets/components/Loading/sequence/*.{png,jpg,jpeg}', { eager: true, import: 'default' }) as Record<string, string>
const frameUrls = Object.entries(frameModules)
  .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
  .map(([, url]) => url)

// 预加载所有序列帧图片，避免切换时卡顿
const preloadImages = () => {
  frameUrls.forEach((url) => {
    const img = new Image()
    img.src = url
  })
}

// 序列帧动画相关状态：改为自动播放，与进度条解耦
const currentIndex = ref(0)            // 当前显示的帧索引
const currentSrc = computed(() => frameUrls[currentIndex.value] || '')
let timer: number | null = null        // 动画定时器

// 仅保留总体进度相关状态
const totalProgress = ref(0)           // 总体加载进度（0-100）
const loadedCount = ref(0)              // 已加载完成的模型数量
const totalCount = ref(0)               // 模型总数

/**
 * 处理总体加载进度事件
 */
const handleTotalModelLoadingProgress = (data: {
  totalProgress: number
  loadedCount: number
  totalCount: number
}) => {
  totalProgress.value = data.totalProgress
  loadedCount.value = data.loadedCount
  totalCount.value = data.totalCount
}

onMounted(() => {
  // 预加载序列帧，避免切换卡顿
  preloadImages()

  // 启动序列帧自动播放（与进度解耦）
  if (frameUrls.length > 0) {
    const interval = 1000 / props.fps
    timer = window.setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % frameUrls.length
    }, interval)
  }

  // 监听总体加载进度事件
  TKEvenBus.getInstance().on('totalModelLoadingProgress', handleTotalModelLoadingProgress)
})

onBeforeUnmount(() => {
  // 移除事件监听，防止内存泄漏
  TKEvenBus.getInstance().off('totalModelLoadingProgress', handleTotalModelLoadingProgress)
  // 清理动画定时器
  if (timer != null) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped>
.lp-bg {
  position: fixed;
  inset: 0;
  z-index: 99999;
  overflow: hidden;
  /* 高斯模糊背景效果 */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(20px);
  /* 半透明背景，让模糊效果更明显 */
  background-color: rgba(0, 0, 0, 0.42);

}

.lp-logo {
  position: absolute;
  top: 40%;
  left: 49%;
  transform: translate(-50%, -50%);
  max-width: 80vw;
  max-height: 80vh;
  object-fit: contain;
  /* 优化图片渲染性能 */
  will-change: contents;
  /* 使用 GPU 加速 */
  transform: translate(-50%, -50%) translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.lp-progress-container {
  position: absolute;
  bottom: 12vh;
  left: 50%;
  transform: translateX(-50%);
  width: 50vw;
  max-width: 90vw;
  z-index: 10;
}

.lp-progress-item {
  margin-bottom: 24px;
  /* background: rgba(0, 0, 0, 0.6); */
  padding: 16px 20px;
  border-radius: 8px;
  /* //backdrop-filter: blur(10px); */
}

.lp-progress-item:last-child {
  margin-bottom: 0;
}

.lp-progress-label {
  color: #fff;
  font-size: 20px;
  margin-bottom: 8px;
  font-weight: bold;
}

.lp-progress-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  margin-top: 8px;
  text-align: center;
}
</style>


