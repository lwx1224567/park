import * as THREE from 'three';
import { TKBaseObject } from '@/utils/TKThree/TKBaseObject';
import {colorMaterial, getHeight, surroundLine} from '@/utils/TKThree/TKUtil';
import {ImageLoader} from "@/utils/TKThree/TKModelLoader";
import {position} from "html2canvas/dist/types/css/property-descriptors/position";

/**
 * 园区/阵地
 */
class Park extends TKBaseObject {
  // 添加用于保存上一次相机位置和目标的变量
  lastCameraPosition: THREE.Vector3;
  lastCameraTarget: THREE.Vector3;
  constructor(config, model) {
    super(config, model);
    this.scene.traverse(child => {
      if (child.isMesh) {
        child.renderOrder = -2
      }
    })
  }

  override start() {
    this.initTree();
    this.addEventListener('globalView', this.globalView.bind(this));
    this.addEventListener('panoramaRoam', this.panoramaRoam.bind(this));
    this.addEventListener('securityServe', this.security.bind(this));
  }

  override update(delta: number) {
    // console.log(delta)
  }

  /**
   * 周界安防视角处理
   * @param event
   */
  security(event) {
    if (event) {
      // 记录上次相机位置及目标
      this.lastCameraPosition = this.camera.position.clone();
      this.lastCameraTarget = this.control.target.clone();
      this.camera.setView({ x: 0, y: 150, z: 230 }, { x: 0, y: 0, z: 0 });
    } else {
      this.camera.setView(this.lastCameraPosition, this.lastCameraTarget);
    }
  }

  /**
   * 全局视角
   * @param event
   */
  globalView(event) {
    if (event.status) {
      // 记录上次相机位置及目标
      this.lastCameraPosition = this.camera.position.clone();
      this.lastCameraTarget = this.control.target.clone();
      this.camera.setView({ x: 0, y: 230, z: 150 }, { x: 0, y: 0, z: 0 });
    } else {
      this.camera.setView(this.lastCameraPosition, this.lastCameraTarget, 1, event.callback);
    }
  }

  /**
   * 全景漫游
   * @param event
   */
  panoramaRoam(event) {
    if (event.status) {
      // 记录上次相机位置及目标
      this.lastCameraPosition = this.camera.position.clone();
      this.lastCameraTarget = this.control.target.clone();
      const center = new THREE.Vector3(0, 0, 0);
      const radius = 220;
      const height = 120;
      const lookAtTarget = new THREE.Vector3(0, 0, 0);
      this.camera.roam(center, radius, height, lookAtTarget, 20, 1);
    } else {
      this.camera.stopRoam();
      this.camera.setView(this.lastCameraPosition, this.lastCameraTarget, 1, event.callback);
    }
  }


  /**
   * 绘制园区内的树木
   *
   */
  initTree() {

    if (this.config.treePositions) {
      ImageLoader('tree.png', (image: THREE.Texture) => {
        image.colorSpace = THREE.SRGBColorSpace;  // 设置颜色空间

        const spriteMaterial = new THREE.SpriteMaterial({
          map: image,  // 使用加载的纹理
          transparent: true,
          blendMode: THREE.NormalBlending,
          depthWrite: false,
        });
        this.config.treePositions.forEach((position) => {
          // 创建精灵对象
          const tree = new THREE.Sprite(spriteMaterial);
          tree.scale.set(10, 10, 10);
          tree.position.set(parseFloat(position.x), parseFloat(position.y), parseFloat(position.z));
          tree.position.y += getHeight(tree) / 2;
          this.scene.add(tree);

        });
      })
    }
  }
}

export { Park };
