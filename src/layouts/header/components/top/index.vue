<template>
  <div class="pageTop wow fadeInDown">
    <img class="bg" src="@/assets/images/layouts/head-bg.png" alt="" />
    <div class="title">
      <span :title="name">{{ name }}</span>
    </div>
    <div class="left">
<!--      <img src="@/assets/logo.png" alt="" />-->
      <div class="weather">
        {{ weatherInfo.text }}
        <span>温度：{{ weatherInfo.temperature }}℃</span>
        <span>空气质量：{{ weatherInfo.aqi }}</span>
      </div>
    </div>

    <div class="right">
      <span>{{ currentDate }}</span>
      <span>{{ currentTime }}</span>
    </div>
    <ProjectConfig @register="register" />
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import dayjs from 'dayjs';
  import localeData from 'dayjs/plugin/localeData';
  import updateLocale from 'dayjs/plugin/updateLocale';
  import 'dayjs/locale/zh-cn';

  dayjs.locale('zh-cn');

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
        return { path: '/park', title: '园区驾驶舱' };
      },
    },
  });

  const currentTime = ref(dayjs().format('HH:mm:ss'));
  const currentDate = ref(dayjs().format('YYYY/MM/DD dddd'));
  const timer = ref<string | number | NodeJS.Timeout | undefined>(undefined);

  // Weather info grouped
  const weatherInfo = ref({ text: '晴', temperature: 28.5, aqi: '优' });

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
</script>

<style lang="scss" scoped>
  .pageTop {
    display: flex;
    position: relative;
    z-index: 101;
    flex-flow: row nowrap;
    flex-shrink: 0;
    align-items: flex-start;
    width: 100%;
    // height: 100px;
    // background: url('@/assets/images/layouts/head-bg.png') no-repeat center top;
    background-size: 100% auto;
    color: #fff;
    place-content: flex-start space-between;

    .bg {
      width: 100%;
      height: 100%;
    }

    .title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);

      span {
        display: inline-block;
        background: linear-gradient(180deg, #f2fcff 0%, #69cbf5 100%);
        background-clip: text;
        color: transparent;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size: 2.3vw;
        font-style: normal;
        font-weight: bold;
        // letter-spacing: 1vw;
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
      align-items: center;
      padding: 0.2vw 0.5vw 0;
    }

    .left {
      position: absolute;
      top: 0;
      left: 0;

      img {
        height: 1.7vw;
        margin-right: 3vw;
      }

      .weather {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        font-size: 1vw;
        gap: 2vw;
      }
    }

    .right {
      position: absolute;
      top: 0;
      right: 0;
      align-items: center;
      font-size: 1vw;
      font-weight: bold;
      gap: 2vw;

      .action {
        display: flex;
        gap: 1vw;
        align-items: center;

        .icon {
          font-size: 1.2vw;
          cursor: pointer;

          a {
            color: #fff;
          }
        }
      }
    }
  }
</style>
