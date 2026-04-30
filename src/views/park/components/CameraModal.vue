<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="监控画面"
    :showCancelBtn="false"
    :showOkBtn="false"
    :mask="false"
    width="800px"
  >
    <div class="flex w-full justify-between">
      <div class="w-full h-[310px]">
        <video class="w-full h-full" controls autoplay muted playsinline loop>
          <source :src="sources" type="video/mp4" />
        </video>
      </div>
      <!-- <div class="w-[30%] flex flex-col gap-[10px]">
        <div class="h-[150px] color-black">
          <video class="w-full h-full">
            <source src="https://www.w3school.com.cn/i/movie.mp4" type="video/mp4" />
          </video>
        </div>
        <div class="h-[150px] color-black">
          <video class="w-full h-full">
            <source src="https://www.w3school.com.cn/i/movie.mp4" type="video/mp4" />
          </video>
        </div>
      </div> -->
    </div>
    <div class="flex w-full gap-2 pt-5">
      <div class="control-container w-auto aspect-ratio-1/1 grid gap-2">
        <div
          class="button color-[#fff]"
          v-for="(item, index) in dirs"
          :key="index"
          :class="[{ active: item.templateKey == active }, item.cls]"
        >
          <Icon :size="22" :icon="item.icon" />
        </div>
      </div>
      <div class="flex-auto flex flex-col justify-center gap-1">
        <div class="w-full flex gap-1">
          <div class="w-[100px] flex justify-end items-center">镜头速度：</div>
          <div class="flex-1"><a-slider v-model:value="status.speed" /></div>
        </div>
        <div class="w-full flex gap-1">
          <div class="w-[100px] flex justify-end items-center">摄像头焦距：</div>
          <div class="flex-1"><a-slider v-model:value="status.focaLength" /></div>
        </div>
        <div class="w-full flex gap-1">
          <div class="w-[100px] flex justify-end items-center">摄像头画面：</div>
          <div class="flex-1">
            <a-radio-group v-model:value="status.scene" name="radioGroup">
              <a-radio value="1">可见光</a-radio>
              <a-radio value="2">夜视画面</a-radio>
              <a-radio value="3">红外画面</a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive, onUnmounted } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import Icon from '@/components/Icon/Icon.vue';
  const [register, { closeModal }] = useModalInner();
  const sources = 'http://192.168.2.2:1234/chfs/shared/threejs%E6%95%99%E7%A8%8B/%E9%83%AD/10-%E3%80%90Threejs%E6%95%99%E7%A8%8B%E3%80%918.%E6%B8%B2%E6%9F%93%E5%99%A8%E5%92%8C%E5%89%8D%E7%AB%AFUI%E4%BA%A4%E4%BA%92%E7%95%8C%E9%9D%A2/81-1.three.js%20Canvas%E7%94%BB%E5%B8%83%E5%B8%83%E5%B1%80.mp4?v=1';
  const status = reactive({
    speed: 10,
    focaLength: 20,
    scene: 1,
  });
  const active = ref('');
  const dirs = [
    {
      key: 'center',
      cls: 'center',
      text: '中',
      icon: 'ic:baseline-center-focus-weak',
      templateKey: 'panTiltStop',
    },
    {
      key: 'up',
      cls: 'top',
      text: '上',
      icon: 'ic:twotone-arrow-circle-up',
      templateKey: 'panTiltUp',
    },
    {
      key: 'right',
      cls: 'right',
      text: '右',
      icon: 'ic:twotone-arrow-circle-right',
      templateKey: 'panTiltRight',
    },
    {
      key: 'down',
      cls: 'bottom',
      text: '下',
      icon: 'ic:twotone-arrow-circle-down',
      templateKey: 'panTiltDown',
    },
    {
      key: 'left',
      cls: 'left',
      text: '左',
      icon: 'ic:twotone-arrow-circle-left',
      templateKey: 'panTiltLeft',
    },
  ];
  //键盘映射
  const keyMap = {
    ArrowUp: 'panTiltUp',
    ArrowRight: 'panTiltRight',
    ArrowDown: 'panTiltDown',
    ArrowLeft: 'panTiltLeft',
    ' ': 'panTiltStop',
  };
  /**
   * 键盘按下事件处理函数
   * @param {KeyboardEvent} event - 键盘按下事件对象
   */
  const onKeyDown = (event) => {
    const dir = keyMap[event.key];
    if (!dir) return;
    active.value = dir;
    //提交命令
    
  };
  /**
   * 键盘抬起事件处理函数
   * @param {KeyboardEvent} event - 键盘抬起事件对象
   */
  const onKeyUp = (event) => {
    const dir = keyMap[event.key];
    if (!dir) return;
    active.value = '';
  };

  onMounted(() => {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  });
  onUnmounted(() => {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  });
</script>

<style scoped lang="less">
  .control-container {
    grid-template-areas:
      '. top .'
      'left center right'
      '. bottom .';
    grid-template-columns: repeat(3, 1fr);

    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: 1px solid #fff;
      border-radius: 5px;
      background: rgb(10 108 171);
      box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
      cursor: pointer;

      &:hover,
      &.active {
        background: rgb(10 108 171 / 80%);
      }

      &.top {
        grid-area: top;
      }

      &.left {
        grid-area: left;
      }

      &.center {
        grid-area: center;
      }

      &.right {
        grid-area: right;
      }

      &.bottom {
        grid-area: bottom;
      }
    }
  }
</style>
