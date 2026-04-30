<template>
  <div class="pageTop wow fadeInDown" :style="`position: ${position};`">
    <sequence :fileLength="74" :IntervalTime="50" />
    <div class="title">
      <span :title="name">{{ name }}</span>
    </div>
    <div class="left">
      <img src="@/assets/logo.png" alt="" />
    </div>
    <div class="right">
      <router-link :to="mate.path">
        <a-button type="primary">{{ mate.title }}</a-button>
      </router-link>
      <span>{{ currentDate }}</span>
      <span>{{ currentTime }}</span>
      <div @click="openDrawer(true)"><SettingOutlined /></div>
      <!-- 【1: 触发点】点击这个按钮，就会调用 handleCreateLineClick 方法 -->
      <div @click="handleCreateLineClick"><QqOutlined /></div>
      <logout />
      <ProjectConfig @register="register" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useDrawer } from '@/components/Drawer';
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import dayjs from 'dayjs';
  import localeData from 'dayjs/plugin/localeData';
  import updateLocale from 'dayjs/plugin/updateLocale';
  import 'dayjs/locale/zh-cn';
  import sequence from './sequence/index.vue';
  import logout from '../logout/index.vue';
  import MenuSettings from './MenuSettings.vue';
  import { SettingOutlined,QqOutlined } from '@ant-design/icons-vue';
  import ProjectConfig from '../../ProjectConfig.vue';
  // 【2: 导入事件总线】导入TKEvenBus，用于模块间通信
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';

  dayjs.locale('zh-cn');
  const [register, { openDrawer }] = useDrawer();

  const props = defineProps({
    name: {
      type: String,
      required: true,
      default: () => '',
    },
    mate: {
      type: Object,
      required: true,
      default: () => {
        return { path: '/admin/index', title: '管理中台' };
      },
    },
    position: {
      type: String,
      required: true,
      default: () => 'fixed',
    },
  });

  const currentTime = ref(dayjs().format('HH:mm:ss'));
  const currentDate = ref(dayjs().format('YYYY/MM/DD dddd'));
  const timer = ref<string | number | NodeJS.Timeout | undefined>(undefined);

  function updateTime() {
    currentTime.value = dayjs().format('HH:mm:ss');
    currentDate.value = dayjs().format('YYYY/MM/DD dddd');
  }

  onMounted(() => {
    updateTime();
    timer.value = setInterval(updateTime, 1000);
  });

  onBeforeUnmount(() => {
    clearInterval(timer.value);
  });

  dayjs.extend(localeData);
  dayjs.extend(updateLocale);

  dayjs.updateLocale('zh-cn', {
    weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  });



  /**
   * @method handleCreateLineClick
   * @description 【2 定义指令和数据】当按钮被点击时，此方法被调用
   */
  async function handleCreateLineClick() {
    // 获取事件总线的单例
    const eventBus = TKEvenBus.getInstance();
    // lineCounter++;
    // // 定义这条线的唯一ID，用于后续的管理（如删除）
    // const lineId = `test-line-${lineCounter}`;
    // 定义线的关键路径点 (世界坐标)
    const points: [number, number, number][] = [
      [0, 0, 0],
      [20, 20, 0],
      [40, 0, 0],
      [60, 20, 0],
      [80, 0, 0]
    ];
    const points2: [number, number, number][] = [
      [80, 0, 0],
      [0, 40, 0],
      [0, 50, 0],
      [0, 50, 30],
      [0, 60, 70],
      [80, 60, 70],
    ];
    const points3: [number, number, number][] = [
      [80, 60, 70],
      [80, 70, 70],
      [80, 90, 70],
      [80, 100, 70],
      [80, 60, 40],
    ];
    // 辅助：等待指定 id 的线绘制完成
    const waitLineDone = (id: string | number) =>
      new Promise<void>((resolve) => {
        eventBus.once('tk-line-create-done', (doneId: string | number) => {
          if (doneId === id) resolve();
        });
      });

    // 辅助：发出创建并等待完成
    const createLineAndWait = async (
      id: string | number,
      pts: [number, number, number][],
      color: number | string,
      width: number,
    ) => {
      eventBus.emit('tk-line-create', id, pts, color, width);
      await waitLineDone(id);
    };

    // 顺序：1 -> 2 -> 3
    await createLineAndWait(1, points, '#ff0000', 0.002);
    // await createLineAndWait(2, points2, '#00eae4', 0.002);
    // await createLineAndWait(3, points3, '#fadd00', 0.002);
  }
</script>

<style lang="scss" scoped>
  .pageTop {
    display: flex;
    z-index: 101;
    flex-flow: row nowrap;
    flex-shrink: 0;
    align-items: flex-start;
    width: 100%;
    height: 100px;
    color: #fff;
    place-content: flex-start space-between;

    .title {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);

      span {
        display: inline-block;
        background: linear-gradient(180deg, #f2fcff 0%, #69cbf5 100%);
        background-clip: text;
        color: transparent;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size: 36px;
        font-style: normal;
        font-weight: 400;
        font-weight: bold;
        letter-spacing: 3px;
        text-shadow: 0 0 5px rgb(255 255 255 / 30%);
        text-transform: none;
        white-space: nowrap;
        -webkit-text-fill-color: transparent;

        &::before {
          content: attr(title);
          position: absolute;
          z-index: -1;
          top: 0;
          left: 0;
          color: transparent;
          text-shadow: 0 4px 6px rgb(0 0 0 / 51%);
        }
      }
    }

    .left,
    .right {
      display: flex;
      padding: 25px 15px 0;
    }

    .left {
      img {
        height: 47px;
      }
    }

    .right {
      display: flex;
      z-index: 102;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
      gap: 15px;
    }
  }
</style>
