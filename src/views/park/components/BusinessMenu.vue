<template>
  <div class="business-menu-container">
    <div class="menu-box">
      <div
        class="item"
        :class="{ active: item.active }"
        v-for="(item, index) in menuData"
        :key="index"
        @click="handleClick(index, item)"
      >
        <div class="menu-content">
          <div class="item-icon">
            <img :src="item.icon" alt="" />
          </div>
        </div>
        <div class="name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, onUnmounted } from 'vue';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';
  import { useLayoutsStore } from '@/store/modules/layouts';
  import { useBasicConfigStore } from '@/store/modules/basicConfig';
  import { debounce } from 'lodash';
  import { router } from '@/router';
  const layoutsStore = useLayoutsStore();
  const basicConfigStore = useBasicConfigStore();
  //获取园区上一次配置
  const parkPrevConfig = computed(() => layoutsStore.getParkConfigPrev) as any;

  const menuData = ref<any[]>([
    {
      name: '机房运维',
      icon: 'src/assets/icon/operations.png',
      active: false,
      key: 'operations',
      menuType: [],
    },
    {
      name: '周界安防',
      icon: 'src/assets/icon/security.png',
      active: false,
      key: 'security',
      menuType: ['security'],
    },
    {
      name: '访客系统',
      icon: 'src/assets/icon/visitor.png',
      active: false,
      key: 'visitor',
      menuType: [],
    },
    {
      name: '停车管理',
      icon: 'src/assets/icon/parking.png',
      active: false,
      key: 'parking',
      menuType: [],
    },
    {
      name: '园区设施',
      icon: 'src/assets/icon/park.png',
      active: false,
      key: 'park',
      menuType: ['facility'],
    },
  ]);
  //机房运维
  const control = (menu) => {
    if (menu.active) {
      TKEvenBus.getInstance().emit('storeyExpand'); //楼层展开
    } else {
      TKEvenBus.getInstance().emit('storeyCollapse', { oldCamera: true }); //楼层收起
      TKEvenBus.getInstance().emit('toggleCockpit', 'park'); //驾驶舱切换为园区
    }
  };
  //周界安防
  const security = (menu) => {
    console.log('周界安防')
    TKEvenBus.getInstance().emit('storeyCollapse', {
      oldCamera: false,
      callback: () => {
        TKEvenBus.getInstance().emit('securityServe', menu.active); ///周界安防
      },
    }); //楼层收起
  };
  //访客系统
  const visitor = (menu) => {
    router.push({ path: '/visitor' });
  };
  //园区设施
  const facility = (menu) => {
    TKEvenBus.getInstance().emit('storeyCollapse', {
      oldCamera: false,
      callback: () => {
        //设施相关操作
      },
    }); //楼层收起
  };
  //停车管理
  const parking = (menu) => {
    TKEvenBus.getInstance().emit('storeyCollapse', {
      oldCamera: false,
      callback: () => {
        //设施相关操作
        TKEvenBus.getInstance().emit('parkingManage', menu.active); ///周界安防
      },
    }); //楼层收起
  };
  /**
   * 菜单点击处理
   * @param index
   * @param item
   */
  const handleClick = debounce((index, item) => {
    cockpitUpdate(item);
    resetMenu(index); //重置菜单状态
    switch (item.name) {
      case '机房运维':
        control(item);
        break;
      case '周界安防':
        security(item);
        break;
      case '访客系统':
        visitor(item);
        break;
      case '园区设施':
        facility(item);
        break;
      case '停车管理':
        parking(item);
        break;
    }
  }, 300);
  //除了当前点击的，其余菜单状态重置
  const resetMenu = (e) => {
    menuData.value.forEach((item, index) => {
      if (index == e) {
        menuData.value[e].active = !menuData.value[e].active;
      } else {
        menuData.value[index].active = false;
      }
    });
  };
  //判断是否有菜单被点击
  const checkMenu = () => {
    let active = false;
    menuData.value.forEach((item) => {
      if (item.active) {
        active = true;
      }
    });
    return active;
  };
  //园区驾驶舱配置更新处理
  const cockpitUpdate = (menu) => {
    const config = computed(() => basicConfigStore.getSystemLayout[menu.key]) as any; //获取当前系统驾驶舱配置
    if (checkMenu() && !menu.active) {
      layoutsStore.setParkConfig(config.value); //设置全局驾驶舱配置
      TKEvenBus.getInstance().emit('toggleSceneMenu', { type: menu.menuType }); //显示场景菜单
    } else if (!menu.active) {
      layoutsStore.saveParkConfigPrev(); //存储当前全局驾驶舱配置
      layoutsStore.setParkConfig(config.value); //设置全局驾驶舱配置
      TKEvenBus.getInstance().emit('toggleSceneMenu', { type: menu.menuType }); //显示场景菜单
    } else {
      layoutsStore.setParkConfig(parkPrevConfig.value); //设置全局驾驶舱配置
      TKEvenBus.getInstance().emit('toggleSceneMenu', { type: [] });
    }
  };
  /**
   * 离开页面时保存全局驾驶舱配置
   */
  const handleBeforeUnload = (event) => {
    layoutsStore.setParkConfig(parkPrevConfig.value); //设置全局驾驶舱配置
  };

  //导航高亮
  const handleHighlight = (e) => {
    cockpitUpdate(menuData.value[e]);
    menuData.value.forEach((item, index) => {
      if (index !== e) {
        menuData.value[index].active = false;
      } else {
        menuData.value[index].active = true;
      }
    });
  };

  onMounted(async () => {
    TKEvenBus.getInstance().on('handleHighlight', handleHighlight);
    window.addEventListener('beforeunload', handleBeforeUnload);
  });
  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });
</script>

<style scoped lang="scss">
  .business-menu-container {
    position: relative;
    width: 100%;
    background: url('@/assets/images/business-menu-bg.png') no-repeat center bottom;
    background-size: 100% auto;
    user-select: none;

    .menu-box {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      width: 100%;
      padding: 0 3vw;
      gap: 4vw;

      .item {
        display: flex;
        position: relative;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-bottom: 1vh;
        transition: all 0.5s;
        cursor: pointer;
        gap: 1vh 0;

        .menu-content {
          display: flex;
          justify-content: center;
          width: 100%;
          padding-bottom: 1.5vw;
          background: url('@/assets/images/business-menu-item-bg.png') no-repeat center bottom;
          background-size: 100% auto;

          .item-icon {
            width: 100%;
            aspect-ratio: 1;
            padding: 10px;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }

        .name {
          color: #d8effc;
          font-size: 1.4vw;
          font-weight: bold;
        }

        &:hover {
          transform: translateY(-3px);

          .menu-content {
            background: url('@/assets/images/business-menu-item-bg-active.png') no-repeat center
              bottom;
            background-size: 100% auto;
          }
        }

        &.active {
          .menu-content {
            background: url('@/assets/images/business-menu-item-bg-active.png') no-repeat center
              bottom;
            background-size: 100% auto;
          }

          .name {
            text-shadow:
              0 0 1px #d8effc,
              0 0 2px #d8effc;
          }
        }
      }
    }
  }
</style>
