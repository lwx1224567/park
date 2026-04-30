import { TKBaseObject } from '@/utils/TKThree/TKBaseObject';
import * as THREE from 'three';
import { Cabinet, LayerView } from '@/views/park/models/roomDevice/Cabinet';
import gsap from 'gsap';
import { useCabinetStore } from '@/store/modules/cabinet';

/**
 * 机柜内设备的基类，所有机柜内的设备均需要继承此类
 */
class BaseDevice extends TKBaseObject {
  /**
   * three 中 1U 的高度
   * @private
   */
  private U_HEIGHT: number = 0.049;
  // 用于存储主视图、剩余空间视图、能耗视图
  private layerMain: THREE.Group = new THREE.Group();
  private layerRemainCapacity: THREE.Group = new THREE.Group();
  // 能耗层占位，避免外部引用报错
  private layerEnergy: THREE.Group = new THREE.Group();
  private currentLayer: LayerView = LayerView.Main;
  /**
   * 设备是否弹出
   * @private
   */
  private isPullOut: boolean = false;
  /**
   * 记录初始 Z，用于精确收回/弹出，避免累计误差
   */
  private baseZ: number = 0;

  constructor(config, model) {
    super(config, model);
    // 设置设备基础位置
    const { uNum } = config;
    this.scene.position.y += (uNum - 1) * this.U_HEIGHT;

    if(!model)
    console.log(config)
    this.layerMain.name = 'Main';
    this.layerRemainCapacity.name = 'RemainCapacity';
    this.layerEnergy.name = 'Energy';
    this.scene.remove(model);
    this.layerMain.add(model);
    this.scene.add(this.layerMain);
  }

  override start() {
    // 必须写在start方法中，构造函数中parent还未赋值
    this.scene.position.add(this.getParent().config.baseOffset);
    this.baseZ = this.scene.position.z;
    this.initRemainCapacity();

    this.addEventListener('click', this.handleClickEvent.bind(this));
    this.addEventListener('dblclick', this.handleDblClickEvent.bind(this));
    this.addEventListener('pullOutDeviceById', this.pullOutById.bind(this));
  }

  override update(delta: number) {}

  handleClickEvent(event) {
    this.triggerEvent('openDeviceModal', this.config); // 打开设备详情弹窗
  }

  handleDblClickEvent(event) {
    // 双击切换：未弹出则弹出，已弹出则收回
    if (this.currentLayer === LayerView.Main) {
      if (!this.isPullOut) {
        this.pullOut();
      } else {
        this.pushBack();
      }
    }
  }

  /**
   * 初始化剩余空间视图
   */
  initRemainCapacity() {
    // 创建一个和设备同样大小的长方体替换设备
    const remainCapacity = new THREE.Mesh(
      new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z),
      new THREE.MeshStandardMaterial({
        color: '#7dfba2',
      }),
    );
    remainCapacity.position.y += this.size.y / 2;
    this.layerRemainCapacity.add(remainCapacity);

    const geometry = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z),
    );
    const material = new THREE.LineBasicMaterial({
      color: '#0f491c',
      linewidth: 50,
      linecap: 'round',
      linejoin: 'round',
    });
    const line = new THREE.LineSegments(geometry, material);
    line.position.y += this.size.y / 2;
    this.layerRemainCapacity.add(line);
  }

  showRemainCapacity() {
    if (this.currentLayer !== LayerView.RemainCapacity) {
      this.scene.remove(this.layerMain);
      this.scene.remove(this.layerEnergy);
      this.scene.add(this.layerRemainCapacity);
      this.currentLayer = LayerView.RemainCapacity;
      // 切换视图后禁止绘制包围线
      this.isHoverOutline = false;
      this.isClickOutline = false;
    }
  }

  showMainView() {
    if (this.currentLayer !== LayerView.Main) {
      this.scene.remove(this.layerRemainCapacity);
      this.scene.remove(this.layerEnergy);
      this.scene.add(this.layerMain);
      this.currentLayer = LayerView.Main;
      this.isHoverOutline = this.config.isHoverOutline;
      this.isClickOutline = this.config.isClickOutline;
    }
  }

  /**
   * 根据设备ID弹出设备
   */
  async pullOutById(deviceId: string) {
    if (deviceId === this.config.id) this.pullOut();
  }

  /**
   * 设备弹出
   */
  pullOut() {
    // 执行设备弹出
    this.isPullOut = true;
    const cabinetStore = useCabinetStore();
    cabinetStore.initDeviceIdData(this.config.id); //初始化机柜驾驶舱数据
    (this.getParent() as Cabinet)?.setPulloutDevice(this);
    gsap.to(this.scene.position, {
      z: this.baseZ + this.getSize().z / 2,
      duration: 0.5,
      onComplete: () => {
        // this.triggerEvent('deviceChanged', {deviceId: this.config.id})
      },
    });
  }

  /**
   * 收回设备
   */
  pushBack() {
    // 执行设备收起
    this.isPullOut = false;
    (this.getParent() as Cabinet)?.cancelPulloutDevice();
    gsap.to(this.scene.position, {
      z: this.baseZ,
      duration: 0.5,
    });
  }
}

export { BaseDevice };
