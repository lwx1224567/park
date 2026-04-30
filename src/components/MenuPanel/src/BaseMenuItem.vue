<template>
  <div class="menu-item" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <router-link :to="menu.path" custom v-slot="{ isActive, navigate }">
      <MenuButton :active="isActive" @click="navigate">{{ menu.title }}</MenuButton>
    </router-link>
    <div class="dropdown-menu" v-if="menu.children?.length > 0">
      <TransitionGroup
        tag="ul"
        class="menu-list"
        name="list"
        :css="false"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
      >
        <li class="item" v-for="(item, index) in menuChildrenData" :key="index">
          <router-link :to="item.path" v-slot="{ isActive }">
            <MenuButton :active="isActive">{{ item.title }}</MenuButton>
          </router-link>
        </li>
      </TransitionGroup>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import gsap from 'gsap';
  import { MenuButton } from '@/components/Button';

  const props = defineProps({
    menu: {
      // 菜单
      type: Object,
      required: true,
      default: () => {},
    },
  });

  const isShow = ref(false);
  const menuChildrenData = computed(() => (!!isShow.value ? props.menu.children : []));

  /**
   * @description: 改变
   * @param {*} value
   * @return {*}
   */
  const onBeforeEnter = (el) => {
    el.style.opacity = 0;
    el.style.transform = `translate(-10px, 0px)`;
  };

  /**
   * @description: 进入
   * @param {*}
   * @return {*}
   */
  const onEnter = (el, done) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.15,
      delay: el.dataset.index * 0.05,
      onComplete: done,
    });
  };

  /**
   * @description: 离开
   * @param {*}
   * @return {*}
   */
  const onLeave = (el, done) => {
    gsap.to(el, {
      opacity: 0,
      x: -10,
      duration: 0.2,
      onComplete: done,
    });
  };

  // 鼠标移入
  const onMouseEnter = () => {
    isShow.value = true;
  };
  // 鼠标移出
  const onMouseLeave = () => {
    isShow.value = false;
  };
</script>

<style lang="scss" scoped>
  .menu-item {
    position: relative;

    .dropdown-menu {
      display: block;
      position: absolute;
      z-index: 99999;
      left: 50%;
      box-sizing: border-box;
      min-width: calc(100% + 10px);
      padding: 5px 0 0;
      transform: translateX(-50%);

      .menu-list {
        display: flex;
        flex-direction: column;
        min-width: 100%;
        margin: 0;
        padding: 5px;
        border-radius: 6px;
        gap: 10px;

        .item {
          width: 100%;
          transition: all 0.1s ease;
        }
      }
    }
  }
</style>
