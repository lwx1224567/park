import * as THREE from 'three';
import { TKBaseObject } from '@/utils/TKThree/TKBaseObject';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import gsap from 'gsap';
import { Storey } from '@/views/park/models/parkDevice/Storey';
import { createCSS2DLabel } from '@/utils/TKThree/TKUtil';
import { F } from 'node_modules/vite/dist/node/types.d-aGj9QkWt';

/**
 * 园区/阵地
 */
class Build extends TKBaseObject {
  private lastCameraPosition: THREE.Vector3 = new THREE.Vector3();
  private lastCameraTarget: THREE.Vector3 = new THREE.Vector3();

  private buildInfo: Array<{ name: string; position: THREE.Vector3 }> = [
    { name: '研发大厦', position: new THREE.Vector3(12.878, 80, -11.626) },
    { name: '保安亭', position: new THREE.Vector3(-68.731, 20, 202.895) },
    { name: '库房', position: new THREE.Vector3(-103.309, 30, 168.999) },
    { name: '服务中心', position: new THREE.Vector3(139.477, 30, 181.333) },
    { name: '行政中心', position: new THREE.Vector3(139.477, 30, 29.335) },
    { name: '智造工场', position: new THREE.Vector3(-103.94, 30, 37.894) },
  ];
  private labelGroup: THREE.Group = new THREE.Group();

  private isExpand: boolean = false; // 记录楼层是否展开状态

  constructor(config, model) {
    super(config, model);
    this.scene.add(this.labelGroup);
  }

  override start() {
    this.initBuildLabel();
    this.addEventListener('storeyExpand', this.expand.bind(this));
    this.addEventListener('storeyCollapse', this.collapse.bind(this));
  }

  override update(delta: number) {
    // console.log(delta)
  }

  initBuildLabel() {
    this.buildInfo.forEach((item) => {
      const label = createCSS2DLabel(item.name);
      label.position.copy(item.position);
      label.name = item.name;
      this.labelGroup.add(label);
    });
  }

  /**
   * 拆分楼层展示
   */
  expand(callback) {
    if (!this.isExpand) {
      this.isExpand = true;
      this.hideLabels();
      // 展开楼层
      const children = this.getChildren();
      // 从第二层开始展开，0是底座，1是1层
      for (let i = 2; i <= children.length - 1; i++) {
        const storey = children[i];
        (storey as Storey).move('up', (i - 1) * 20, 1, 0);
      }
      this.triggerEvent('toggleLayers', { status: true, buildId: this.config.id }); //显示楼层选择按钮
      const box = new THREE.Box3().setFromObject(this.scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      // 记录镜头位置
      this.lastCameraPosition.copy(this.camera.position);
      this.lastCameraTarget.copy(this.control.target);
      // 移动镜头
      const tl = gsap.timeline();
      tl.to(this.camera.position, {
        x: center.x,
        y: center.y + size.y + 25,
        z: center.z + size.z * 3,
        duration: 1, // 持续时间
        onComplete: () => {
          callback && callback();
        },
      });
      tl.to(
        this.control.target,
        {
          x: center.x,
          y: center.y + size.y / 2,
          z: center.z,
          duration: 1, // 持续时间
          onUpdate: () => {
            this.camera.lookAt(this.control.target);
          },
        },
        '<',
      );
    } else {
      callback && callback();
    }
  }

  /**
   * 楼层收缩
   * @param oldCamera   回到原来视角
   * @param callback      回调函数
   */

  collapse(params) {
    if (this.isExpand) {
      this.isExpand = false;
      // 1 恢复层级
      const children = this.getChildren();
      for (let i = 0; i < children.length; i++) {
        const storey = children[i];
        storey.reset();
      }
      this.triggerEvent('toggleLayers', { status: false }); //隐藏楼层选择按钮
      this.triggerEvent('closeCabinetDoorAll'); //关闭所有机柜门
      if (params?.oldCamera) {
        this.camera.setView(this.lastCameraPosition, this.lastCameraTarget, 1, () => {
          params?.callback && params?.callback();
          // 恢复主楼的标签位置
          // const label = this.scene.getObjectByName('研发大厦');
          // label && (label.position.y = this.buildInfo[0].position.y);
          this.showLabels();
        });
      } else {
        params?.callback && params?.callback();
        //延时1秒再显示标签
        setTimeout(() => {
          this.showLabels();
        }, 1000);
      }
    }else{
      params?.callback && params?.callback();
    }
  }

  showLabels() {
    this.labelGroup.children.forEach((label: CSS2DObject) => {
      label.element.classList.remove('hidden');
    });
  }

  hideLabels() {
    this.labelGroup.children.forEach((label: CSS2DObject) => {
      label.element.classList.add('hidden');
    });
  }
}

export { Build };
