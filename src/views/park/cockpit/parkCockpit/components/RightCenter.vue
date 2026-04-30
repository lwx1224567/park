<template>
  <div class="video-container">
    <!-- 摄像头选择下拉框 -->
    <div class="camera-selector">
      <selected 
        v-model:active="selectedCameraId" 
        :list="dropdownList" 
        placeholder="选择摄像头"
        @update:active="handleCameraChange"
      />
    </div>
    
    <!-- 视频显示区域 -->
    <div class="video-display">
      <template v-if="currentVideoSource">
        <div class="video-wrapper" :class="{ 'transitioning': isVideoTransitioning }">
          <video 
            :key="videoKey"
            ref="videoRef"
            class="video" 
            controls 
            autoplay 
            muted 
            playsinline 
            loop
            @error="handleVideoError"
            @loadstart="handleVideoLoadStart"
          >
            <source :src="currentVideoSource.url" type="video/mp4" />
          </video>
        </div>
        <div v-if="videoError" class="video-error">
          视频加载失败
        </div>
        <div class="video-info">
          <div class="camera-name">{{ currentVideoSource.name }}</div>
          <div class="camera-status">
            <span class="status-dot" :class="getStatusClass(currentVideoSource.status, videoError)"></span>
            {{ getStatusText(currentVideoSource.status, videoError) }}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="placeholder">暂无视频源</div>
      </template>
    </div>
    
    <!-- 轮播控制按钮 -->
    <div class="controls">
      <button @click="toggleAutoPlay" class="control-btn">
        {{ isAutoPlaying ? '暂停轮播' : '开始轮播' }}
      </button>
      <button @click="nextCamera" class="control-btn">下一个</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import selected from '@/views/home/components/selected/selected.vue';

  // 接收父组件传递的园区ID
  const props = defineProps<{
    parkId: string;
  }>();

  // 摄像头数据（统一数据结构）
  const cameraList = ref([
    {
      id: '1',
      name: '主入口监控',
      url: 'http://192.168.2.2:1234/chfs/shared/surveillanceVideo/1.mp4?v=1',
      status: 'online' // online, offline, error
    },
    {
      id: '2', 
      name: '停车场监控',
      url: 'https://www.w3school.com.cn/i/movie.mp4',
      status: 'online'
    },
    {
      id: '3',
      name: '办公楼监控', 
      url: 'http://192.168.2.2:1234/chfs/shared/surveillanceVideo/1.mp4',
      status: 'offline'
    },
    {
      id: '4',
      name: '园区中心监控',
      url: '',
      status: 'error'
    }
  ]);

  // 当前选中的摄像头ID
  const selectedCameraId = ref('1');
  
  // 当前视频源
  const currentVideoSource = computed(() => {
    return cameraList.value.find(camera => camera.id === selectedCameraId.value);
  });

  // 下拉框数据格式转换
  const dropdownList = computed(() => {
    return cameraList.value.map(camera => ({
      value: camera.id,
      name: camera.name
    }));
  });

  // 视频错误状态
  const videoError = ref(false);
  
  // 轮播相关状态
  const isAutoPlaying = ref(true);
  const autoPlayTimer = ref<number | null>(null);
  
  // 视频元素引用
  const videoRef = ref<HTMLVideoElement | null>(null);
  
  // 视频切换动画状态
  const isVideoTransitioning = ref(false);
  const videoKey = ref(0); // 用于强制重新渲染视频元素

  // 处理摄像头切换
  const handleCameraChange = (cameraId: string) => {
    if (cameraId === selectedCameraId.value) return;
    
    // 开始切换动画
    isVideoTransitioning.value = true;
    
    // 延迟切换视频源，让淡出动画完成
    setTimeout(() => {
      selectedCameraId.value = cameraId;
      videoError.value = false;
      videoKey.value++; // 强制重新渲染视频元素
      
      // 结束切换动画
      setTimeout(() => {
        isVideoTransitioning.value = false;
      }, 100);
    }, 300);
  };

  // 处理视频加载错误
  const handleVideoError = () => {
    // console.warn(`视频加载失败:`, currentVideoSource.value?.url);
    videoError.value = true;
  };

  // 处理视频开始加载
  const handleVideoLoadStart = () => {
    videoError.value = false;
  };

  // 下一个摄像头
  const nextCamera = () => {
    const currentIndex = cameraList.value.findIndex(camera => camera.id === selectedCameraId.value);
    const nextIndex = (currentIndex + 1) % cameraList.value.length;
    const nextCameraId = cameraList.value[nextIndex].id;
    handleCameraChange(nextCameraId);
  };

  // 切换自动轮播
  const toggleAutoPlay = () => {
    isAutoPlaying.value = !isAutoPlaying.value;
    if (isAutoPlaying.value) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  };

  // 开始自动轮播
  const startAutoPlay = () => {
    stopAutoPlay(); // 先清除之前的定时器
    autoPlayTimer.value = window.setInterval(() => {
      nextCamera();
    }, 5000); // 5秒轮播
  };

  // 停止自动轮播
  const stopAutoPlay = () => {
    if (autoPlayTimer.value) {
      clearInterval(autoPlayTimer.value);
      autoPlayTimer.value = null;
    }
  };

  // 组件挂载时开始自动轮播
  onMounted(() => {
    if (isAutoPlaying.value) {
      startAutoPlay();
    }
  });

  // 获取状态样式类
  const getStatusClass = (status: string, hasError: boolean) => {
    if (hasError) return 'error';
    switch (status) {
      case 'online': return 'online';
      case 'offline': return 'offline';
      case 'error': return 'error';
      default: return 'offline';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string, hasError: boolean) => {
    if (hasError) return '离线';
    switch (status) {
      case 'online': return '在线';
      case 'offline': return '离线';
      case 'error': return '故障';
      default: return '未知';
    }
  };

  // 组件卸载时清理定时器
  onUnmounted(() => {
    stopAutoPlay();
  });
</script>

<style scoped lang="less">


  // 响应式设计
  @media (max-width: 768px) {
    .video-container {
      font-size: 0.875rem; // 在小屏幕上稍微缩小
    }
    
    .camera-selector {
      width: 8em; // 缩小下拉框宽度
    }
    
    .video-info {
      min-width: 6em; // 缩小信息框宽度
    }
    
    .control-btn {
      min-width: 3em; // 缩小最小宽度
      padding: 0.375em 0.75em; // 缩小按钮内边距
      font-size: 0.6875em; // 缩小字体
    }
  }

  @media (max-width: 480px) {
    .video-container {
      font-size: 0.75rem; // 在更小屏幕上进一步缩小
    }
    
    .camera-selector {
      width: 7em;
    }
    
    .video-info {
      min-width: 5em;
    }
    
    .controls {
      flex-direction: column; // 垂直排列按钮
      gap: 0.25em;
    }
    
    .control-btn {
      width: 100%;
      min-width: auto;
    }
  }

  .video-container {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-size: 1rem; // 基础字体大小，用于em计算
  }

  .camera-selector {
    position: absolute;
    z-index: 10;
    top: 0.625em; // 10px
    right: 0.625em; // 10px
    width: 9.375em; // 150px - 稍微增加宽度
    
    // 自定义下拉框样式
    :deep(.changeSkins) {
      height: 2.25em; // 36px
      
      .changeSkin {
        height: 2.25em; // 36px
        transition: all 0.3s ease;
        border: 0.0625em solid rgb(98 147 212 / 40%); // 1px
        border-radius: 0.5em; // 8px
        background: linear-gradient(135deg, rgb(22 48 82 / 90%), rgb(22 48 82 / 70%));
        box-shadow: 0 0.25em 0.75em rgb(0 0 0 / 30%); // 0 4px 12px
        backdrop-filter: blur(0.625em); // 10px
        
        &:hover {
          transform: translateY(-0.0625em); // -1px
          border-color: rgb(98 147 212 / 60%);
          background: linear-gradient(135deg, rgb(22 48 82 / 100%), rgb(22 48 82 / 80%));
          box-shadow: 0 0.375em 1em rgb(0 0 0 / 40%); // 0 6px 16px
        }
        
        span {
          margin-left: 0.75em; // 12px
          color: #fff;
          font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
          font-size: 0.8125em; // 13px
          font-weight: 500;
          text-shadow: 0 0.0625em 0.125em rgb(0 0 0 / 30%); // 0 1px 2px
        }
        
        img {
          width: 0.75em; // 12px
          height: 0.5em; // 8px
          margin-right: 0.75em; // 12px
          transition: transform 0.3s ease;
          filter: brightness(0) invert(1);
        }
      }
      
      .dropdown-menu {
        top: 2.25em; // 36px
        overflow: hidden;
        border: 0.0625em solid rgb(22 48 82 / 30%); // 1px
        border-radius: 0.5em; // 8px
        background: rgb(20 30 50 / 95%);
        box-shadow: 0 0.5em 1.5em rgb(0 0 0 / 40%); // 0 8px 24px
        backdrop-filter: blur(0.9375em); // 15px
        
        &.show {
          max-height: 12.5em; // 200px
          opacity: 1;
        }
        
        .dropdown-menu-scroll {
          max-height: 12.5em; // 200px
          
          &::-webkit-scrollbar {
            width: 0.375em; // 6px
          }
          
          &::-webkit-scrollbar-track {
            border-radius: 0.1875em; // 3px
            background: rgb(255 255 255 / 10%);
          }
          
          &::-webkit-scrollbar-thumb {
            border-radius: 0.1875em; // 3px
            background: linear-gradient(135deg, rgb(98 147 212 / 60%), rgb(98 147 212 / 40%));
            
            &:hover {
              background: linear-gradient(135deg, rgb(98 147 212 / 80%), rgb(98 147 212 / 60%));
            }
          }
        }
        
        .dropdownMenuItem {
          display: flex;
          position: relative;
          align-items: center;
          justify-content: flex-start;
          height: 2.25em; // 36px
          padding: 0 1em; // 16px
          transition: all 0.2s ease;
          border-bottom: 0.0625em solid rgb(255 255 255 / 8%); // 1px
          color: rgb(255 255 255 / 90%);
          font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
          font-size: 0.8125em; // 13px
          font-weight: 400;
          
          &:last-child {
            border-bottom: none;
          }
          
          &:hover {
            padding-left: 1.25em; // 20px
            background: linear-gradient(90deg, rgb(98 147 212 / 20%), transparent);
            color: #fff;
          }
          
          &.highlight {
            background: linear-gradient(90deg, rgb(98 147 212 / 30%), transparent);
            color: #fff;
            font-weight: 500;
            
            &::before {
              content: '';
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              width: 0.1875em; // 3px
              background: linear-gradient(180deg, #6293d4, #4a7bc8);
            }
          }
        }
      }
    }
  }

  .video-display {
    position: relative;
    flex: 1;
    width: 100%;
    overflow: hidden;
    border: 1px solid #6293d400;
    background: #000;
  }

  .video-wrapper {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transition: opacity 0.3s ease-in-out;
    
    &.transitioning {
      opacity: 0;
    }
  }

  .video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.3s ease-in-out;
  }

  .placeholder {
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    color: rgb(255 255 255 / 70%);
    font-size: 0.875em; // 14px
    inset: 0;
  }

  .video-error {
    display: flex;
    position: absolute;
    z-index: 1;
    align-items: center;
    justify-content: center;
    background: rgb(0 0 0 / 80%);
    color: #ff6b6b;
    font-size: 0.75em; // 12px
    inset: 0;
  }

  .video-info {
    position: absolute;
    z-index: 2;
    top: 0.3em; // 10px
    left: 0.3em; // 10px
    min-width: 8em; // 最小宽度，与下拉框保持协调
    padding: 0.5em 0.75em; // 8px 12px
    border: 0.0625em solid rgb(98 147 212 / 30%);
    border-radius: 0.375em; // 6px - 与按钮保持一致
    background: linear-gradient(135deg, rgb(22 48 82 / 80%), rgb(22 48 82 / 60%));
    box-shadow: 0 0.125em 0.5em rgb(0 0 0 / 30%);
    backdrop-filter: blur(0.5em);
  }

  .camera-name {
    max-width: 7em; // 限制最大宽度
    margin-bottom: 0.25em; // 4px
    overflow: hidden;
    color: #fff;
    font-size: 0.875em; // 14px
    font-weight: 600;
    text-overflow: ellipsis;
    text-shadow: 0 0.0625em 0.125em rgb(0 0 0 / 30%);
    white-space: nowrap;
  }

  .camera-status {
    display: flex;
    align-items: center;
    color: rgb(255 255 255 / 90%);
    font-size: 0.75em; // 12px
    font-weight: 400;
  }

  .status-dot {
    width: 0.375em; // 6px
    height: 0.375em; // 6px
    margin-right: 0.375em; // 6px
    transition: background-color 0.3s ease;
    border-radius: 50%;
    
    &.online {
      background: #4caf50;
      box-shadow: 0 0 0.375em rgb(76 175 80 / 60%); // 0 0 6px
    }
    
    &.offline {
      background: #ff9800;
      box-shadow: 0 0 0.375em rgb(255 152 0 / 60%); // 0 0 6px
    }
    
    &.error {
      background: #f44336;
      box-shadow: 0 0 0.375em rgb(244 67 54 / 60%); // 0 0 6px
    }
  }

  .controls {
    display: flex;
    position: absolute;
    z-index: 10;
    bottom: 0.625em; // 10px
    left: 0.625em; // 10px
    flex-wrap: wrap; // 允许换行
    max-width: calc(100% - 1.25em); // 限制最大宽度
    gap: 0.5em; // 8px
  }

  .control-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 4em; // 最小宽度
    min-height: 2em; // 最小高度
    padding: 0.5em 1em; // 8px 16px - 增加按钮大小
    transition: all 0.3s ease;
    border: 0.0625em solid rgb(98 147 212 / 40%); // 1px
    border-radius: 0.375em; // 6px - 更圆润
    background: linear-gradient(135deg, rgb(22 48 82 / 80%), rgb(22 48 82 / 60%));
    box-shadow: 0 0.125em 0.5em rgb(0 0 0 / 30%);
    color: #fff;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    font-size: 0.75em; // 12px
    font-weight: 500;
    cursor: pointer;
    backdrop-filter: blur(0.5em);

    &:hover {
      transform: translateY(-0.125em); // -2px
      border-color: rgb(98 147 212 / 60%);
      background: linear-gradient(135deg, rgb(22 48 82 / 100%), rgb(22 48 82 / 80%));
      box-shadow: 0 0.25em 0.75em rgb(0 0 0 / 40%);
    }

    &:active {
      transform: translateY(0.0625em); // 1px
      box-shadow: 0 0.0625em 0.25em rgb(0 0 0 / 30%);
    }
  }
</style>


