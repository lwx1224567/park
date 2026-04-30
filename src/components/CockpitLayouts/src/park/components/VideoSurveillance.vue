<template>
  <div class="video-container">
    <div class="video-display">
      <template v-if="currentVideoSource">
        <div class="video-wrapper">
          <video
            ref="videoRef"
            class="video"
            controls
            autoplay
            muted
            playsinline
            loop
          >
            <source :src="currentVideoSource.url" type="video/mp4" />
          </video>
        </div>
        <div class="video-info">
          <div class="camera-info">
            <select v-model="selectedCameraId" class="camera-select">
              <option v-for="camera in cameraList" :key="camera.id" :value="camera.id">
                {{ camera.name }}
              </option>
            </select>
            <span class="status-dot" :class="currentVideoSource.status"></span>
            <span class="status-text">{{ getStatusText(currentVideoSource.status) }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="placeholder">暂无视频源</div>
      </template>
    </div>

    <div class="controls">
      <button @click="toggleAutoPlay" class="control-btn">
        {{ isAutoPlaying ? '暂停轮播' : '开始轮播' }}
      </button>
    </div>

    <button @click="prevCamera" class="control-btn prev-btn">‹</button>
    <button @click="nextCamera" class="control-btn next-btn">›</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const cameraList = ref([
  { id: '1', name: '主入口监控', url: '', status: 'offline' },
  { id: '2', name: '停车场监控', url: '', status: 'offline' },
  { id: '3', name: '办公楼监控', url: '', status: 'offline' },
]);

const selectedCameraId = ref('1');
const isAutoPlaying = ref(false);
const autoPlayTimer = ref<number | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);

const currentVideoSource = computed(() =>
  cameraList.value.find(camera => camera.id === selectedCameraId.value)
);

const getStatusText = (status: string) => {
  const map = { online: '在线', offline: '离线', error: '故障' };
  return map[status as keyof typeof map] || '未知';
};

const navigateCamera = (direction: 'prev' | 'next') => {
  const currentIndex = cameraList.value.findIndex(c => c.id === selectedCameraId.value);
  const targetIndex = direction === 'next'
    ? (currentIndex + 1) % cameraList.value.length
    : currentIndex === 0 ? cameraList.value.length - 1 : currentIndex - 1;
  selectedCameraId.value = cameraList.value[targetIndex].id;
};

const toggleAutoPlay = () => {
  isAutoPlaying.value = !isAutoPlaying.value;
  isAutoPlaying.value ? startAutoPlay() : stopAutoPlay();
};

const startAutoPlay = () => {
  stopAutoPlay();
  autoPlayTimer.value = window.setInterval(() => navigateCamera('next'), 5000);
};

const stopAutoPlay = () => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value);
    autoPlayTimer.value = null;
  }
};

const nextCamera = () => navigateCamera('next');
const prevCamera = () => navigateCamera('prev');

onMounted(() => isAutoPlaying.value && startAutoPlay());
onUnmounted(stopAutoPlay);
</script>

<style scoped lang="less">
.video-container {
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.video-display {
  position: relative;
  flex: 1;
  width: 100%;
  background: #000;
}

.video-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  inset: 0;
  color: rgba(255, 255, 255, 0.7);
}

.video-info {
  position: absolute;
  z-index: 2;
  top: 10px;
  left: 10px;
  padding: 8px 12px;
  border: 1px solid rgba(98, 147, 212, 0.3);
  border-radius: 6px;
  background: rgba(22, 48, 82, 0.8);
  backdrop-filter: blur(8px);
}

.camera-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.camera-select {
  padding: 4px 8px;
  border: 1px solid rgba(98, 147, 212, 0.4);
  border-radius: 4px;
  background: rgba(20, 30, 50, 0.9);
  color: #fff;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    border-color: rgba(98, 147, 212, 0.6);
  }
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;

  &.online {
    background: #4caf50;
    box-shadow: 0 0 6px rgba(76, 175, 80, 0.6);
  }

  &.offline {
    background: #ff9800;
    box-shadow: 0 0 6px rgba(255, 152, 0, 0.6);
  }

  &.error {
    background: #f44336;
    box-shadow: 0 0 6px rgba(244, 67, 54, 0.6);
  }
}

.status-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
}

.controls {
  position: absolute;
  z-index: 10;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.control-btn {
  padding: 8px 16px;
  border: 1px solid rgba(98, 147, 212, 0.4);
  border-radius: 6px;
  background: rgba(22, 48, 82, 0.8);
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(22, 48, 82, 1);
  }

  &.prev-btn,
  &.next-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    padding: 8px 12px;
    font-size: 24px;
  }

  &.prev-btn {
    left: 10px;
  }

  &.next-btn {
    right: 10px;
  }
}
</style>
