import { TKBaseObject } from '@/utils/TKThree/TKBaseObject';
import { random, setModelOpacity } from '@/utils/TKThree/TKUtil';
import gsap from 'gsap';
import * as THREE from 'three';
import { createHeatmap } from '@/views/park/js/heatmap.js';
import { RoomDevice } from '../roomDevice/RoomDevice';
import { Cabinet } from '@/views/park/models/roomDevice/Cabinet';
import { TKClassFactory } from '@/utils/TKThree/TKClassFactory';
import { useRoomStore } from '@/store/modules/room';

export enum StoreyViewMode {
  Main = 'Main',
  Energy = 'Energy',
  Heatmap = 'Heatmap',
  RemainCapacity = 'RemainCapacity',
}

/**
 * 楼层
 */
class Storey extends TKBaseObject {
  /**
   * 热力图材质
   */
  heatmapMaterial: THREE.ShaderMaterial = null;
  /**
   * 热力图配置参数
   */
  heatmapOption: any = null;
  heatmapPlane: THREE.Mesh = null;
  /**
   * 当前视图
   */
  curStoreyMode: StoreyViewMode = StoreyViewMode.Main;

  /**
   * 机房内当前聚焦的机房设备
   */
  curFocusedDevice: RoomDevice = null;

  constructor(config: any, model:THREE.Object3D) {

    super(config, model);
  }

  override start() {
    this.initHeatmap();

    this.addEventListener('dblclick', this.handleDblClickEvent.bind(this));
    this.addEventListener('setStoreyView', this.setStoreyView.bind(this));
    this.addEventListener('storeySelected', this.storeySelected.bind(this));
    this.addEventListener('showStoreyDevice', this.showChildrenByClassName.bind(this));
    this.addEventListener('hideStoreyDevice', this.hideChildrenByClassName.bind(this));
  }

  override update(delta: number) {}

  /**
   * 楼层移动
   * @param type      上升或下降   up/down
   * @param duration  持续时间，单位秒
   * @param delay  延迟时间，单位秒
   */
  move(type = 'up', distatnce = 0, duration = 1, delay = 0) {
    const pos = this.scene.position;
    gsap.to(pos, {
      y: this.config.position.y + distatnce,
      duration: duration, // 持续时间
      delay: delay,
      ease: 'power1.inOut', // 速率
    });
  }

  /**
   * 恢复初始位置
   */
  reset() {
    const pos = this.scene.position;
    gsap.to(pos, {
      y: this.config.position.y,
      duration: 0.5, // 持续时间
      ease: 'power1.inOut', // 速率
    });
  }

  /**
   * 初始化热力图
   */
  initHeatmap() {
    /* 1画布尺寸与热力半径 */
    const width = this.size.x - 2;
    const height = this.size.z - 2;
    const radius = 2;

    /* 5️⃣ 热力图配置 */
    this.heatmapOption = {
      width,
      height,
      radius,
      colors: {
        0.1: '#2A85B8',
        0.2: '#16B0A9',
        0.3: '#29CF6F',
        0.4: '#5CE182',
        0.5: '#7DF675',
        0.6: '#FFF100',
        0.7: '#fab93f',
        0.8: '#fa873f',
        0.9: '#fa5b3f',
        1: '#D04343',
      },
      data: this.getHeatmapData(width, height),
    };

    /* 6️⃣ 生成 Canvas 并转 Three.js 材质 */
    const heatmapCanvas = createHeatmap(this.heatmapOption);
    const map = new THREE.CanvasTexture(heatmapCanvas);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;

    const geometry = new THREE.PlaneGeometry(width, height, 500, 500);
    this.heatmapMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        map: { value: map },
        uHeight: { value: 0 },
        uOpacity: { value: 2.0 },
      },
      vertexShader: `
      uniform sampler2D map;
      uniform float uHeight;
      varying vec2 v_texcoord;
      void main(void) {
        v_texcoord = uv;
        float h = texture2D(map, v_texcoord).a * uHeight;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, h, 1.0);
      }
    `,
      fragmentShader: `
      precision mediump float;
      uniform sampler2D map;
      uniform float uOpacity;
      varying vec2 v_texcoord;
      void main(void) {
        vec4 color = texture2D(map, v_texcoord);
        float a = color.a * uOpacity;
        gl_FragColor.rgb = color.rgb;
        gl_FragColor.a   = clamp(a, 0.0, 1.0);
      }
    `,
    });

    /* 7️⃣ 挂载到场景 */
    this.heatmapPlane = new THREE.Mesh(geometry, this.heatmapMaterial);
    this.heatmapPlane.rotateX(-Math.PI * 0.5);
    this.heatmapPlane.position.add(this.config.baseOffset);
    this.heatmapPlane.position.y += 0.1;
  }

  /**
   * 更新热力图数据
   * @param newData 新的热力图数据数组，每个元素包含 {x, y, value} 属性
   */
  updateHeatmapData(newData: Array<{ x: number; y: number; value: number }>) {
    // 检查热力图是否已初始化
    if (!this.heatmapOption || !this.heatmapPlane) {
      console.warn('热力图未初始化，请先调用 initHeatmap()');
      return;
    }

    // 使用新数据创建热力图配置
    this.heatmapOption.data = newData;
    // 生成新的热力图 Canvas
    const heatmapCanvas = createHeatmap(this.heatmapOption);

    // 更新材质贴图
    const mapUniform = this.heatmapMaterial.uniforms.map;

    // 如果已有贴图，先释放
    if (mapUniform.value) {
      mapUniform.value.dispose();
    }

    // 创建新贴图并更新 uniform
    mapUniform.value = new THREE.CanvasTexture(heatmapCanvas);
    mapUniform.value.wrapS = mapUniform.value.wrapT = THREE.RepeatWrapping;

    // 标记材质需要更新
    this.heatmapMaterial.uniformsNeedUpdate = true;
  }

  hideHeatmap() {
    this.scene.remove(this.heatmapPlane);
  }

  getHeatmapData(width: number, height: number): Array<{ x: number; y: number; value: number }> {
    const data: Array<{ x: number; y: number; value: number }> = [];
    this.getChildren().forEach((child: TKBaseObject) => {
      const pos = child.scene.position;
      const d = { x: pos.x + width / 2, y: pos.z + height / 2, value: random(0.1, 1) };
      data.push(d);
    });
    return data;
  }

  /**
   * 除参数的子节点外，隐藏楼层其他模型
   * @Param focusedObject 需要保留不隐藏的子节点
   */
  hideOtherChildren(focusedObject: RoomDevice) {
    this.children.forEach(
      (child) =>
        child !== focusedObject &&
        child.getParent() !== focusedObject &&
        (child as RoomDevice).hideModel(),
    );
  }

  /**
   * 根据类名隐藏子节点
   * @param event.eindex 楼层索引
   * @param event.className 类名
   */
  hideChildrenByClassName(event) {
    if (event.id === this.config.id) {
      if (event.className === 'all') {
        this.children.forEach((child) => (child as RoomDevice).hideModel());
      } else {
        this.children.forEach((child) => {
          if (TKClassFactory.instanceof(child, event.className)) {
            (child as RoomDevice).hideModel();
          }
        });
      }
    }
  }

  /**
   * 显示楼层所有模型
   */
  showChildren() {
    this.children.forEach((child) => (child as RoomDevice).showModel());
  }

  /**
   * 显示指定类名的子节点
   * @param event.eindex 楼层索引
   * @param event.className 类名
   */
  showChildrenByClassName(event) {
    if (event.id === this.config.id) {
      if (event.className === 'all') {
        this.showChildren();
      } else {
        this.children.forEach((child) => {
          if (TKClassFactory.instanceof(child, event.className)) {
            (child as RoomDevice).showModel();
          }
        });
      }
    }
  }

  /**
   * 显示剩余容量视图
   * @param event
   */
  showRemainCapacity(event) {
    this.getChildren().forEach(
      (child) => child instanceof Cabinet && (child as Cabinet).showRemainCapacity(),
    );
  }

  /**
   * 显示主视图
   * @param event
   */
  showMainView(event) {
    this.getChildren().forEach(
      (child) => child instanceof Cabinet && (child as Cabinet).showMainView(),
    );
  }

  /**
   * 显示能耗视图
   * @param event
   */
  showEnergy(event) {
    this.getChildren().forEach(
      (child) => child instanceof Cabinet && (child as Cabinet).showEnergy(),
    );
  }

  /**
   * 显示热力图
   */
  showHeatmap() {
    // TODO 更新热力图数据
    // this.updateHeatmapData();
    // 显示热力图
    this.scene.add(this.heatmapPlane);
    this.heatmapMaterial.uniforms.uHeight.value = 0;
    gsap.to(this.heatmapMaterial.uniforms.uHeight, {
      value: 1,
      duration: 1, // 持续时间
      ease: 'power1.inOut', // 速率
    });
  }

  /**
   * 设置楼层视图
   * @param event.id 楼层id
   * @param event.mode 视图类型
   */
  setStoreyView(event) {
    if (event?.id === this.config.id && event?.mode !== this.curStoreyMode) {
      if (this.curStoreyMode === StoreyViewMode.Heatmap) this.hideHeatmap();

      switch (event?.mode) {
        case StoreyViewMode.Main:
          this.showMainView(event);
          this.curStoreyMode = StoreyViewMode.Main;
          break;
        case StoreyViewMode.RemainCapacity:
          this.showRemainCapacity(event);
          this.curStoreyMode = StoreyViewMode.RemainCapacity;
          break;
        case StoreyViewMode.Energy:
          this.showEnergy(event);
          this.curStoreyMode = StoreyViewMode.Energy;
          break;
        case StoreyViewMode.Heatmap:
          this.showMainView(event);
          this.showHeatmap();
          this.curStoreyMode = StoreyViewMode.Heatmap;
          break;
        default:
          this.showMainView(event);
          this.curStoreyMode = StoreyViewMode.Main;
      }
    }
  }

  /**
   * 显示符合条件的字节的的标签
   * @param event.index     当前楼层
   * @param event.className 需要展示的类型物体标签
   */
  showChildrenSpriteLabel(event) {
    if (event?.index === this.config.index)
      this.getChildren().forEach(
        (child) => child.config.className === event?.className && child.showSprite(),
      );
  }

  /**
   * 隐藏符合条件的字节的的标签
   * @param event.index     当前楼层
   * @param event.className 需要隐藏的类型物体标签
   */
  hideChildrenSpriteLabel(event) {
    if (event?.index === this.config.index)
      this.getChildren().forEach(
        (child) => child.config.className === event?.className && child.hideSprite(),
      );
  }

  /**
   * 楼层被选中
   * @param event
   */
  async storeySelected(event) {
    if (event.id === this.config.id) {
      // 视角拉近到当前楼层
      const curPos = this.getWorldPosition();
      curPos.y += this.config.baseOffset.y;
      const targetPos = new THREE.Vector3(curPos.x, curPos.y + 18, curPos.z + 20);
      this.camera.setView(targetPos, curPos, 1, () => {
        event.callback && event.callback(); // 触发回调
      });
      if (!event.isHideCockpit) {
        const roomStore = useRoomStore();
        roomStore.initData(this.config.id); //初始化机房驾驶舱数据
        this.triggerEvent('toggleSceneMenu', { type: ['room'], data: this.config }); // 显示机房管理菜单
      }
    }
  }

  handleDblClickEvent(event) {
    // 判断当前是否是机柜设备聚焦状态, 如果是机柜设备聚焦状态，则取消聚焦
    this.hasRoomDeviceFocused() && this.cancelFocusedRoomDevice();
  }

  /**
   *  判断当前是否有机房设备处于聚焦状态
   */
  hasRoomDeviceFocused(device: RoomDevice) {
    return this.curFocusedDevice !== null && this.curFocusedDevice !== device;
  }

  /**
   * 设置机房当前被聚焦的设备
   * @param device
   */
  focusedRoomDevice(device: RoomDevice) {
    this.curFocusedDevice = device;
  }

  /**
   * 清除机房设备聚焦状态
   */
  cancelFocusedRoomDevice(cancelFocusStatus: boolean = true) {
    if (cancelFocusStatus) {
      this.curFocusedDevice && this.curFocusedDevice.cancelFocus();
    }
    this.curFocusedDevice = null;
  }
}

export { Storey };
