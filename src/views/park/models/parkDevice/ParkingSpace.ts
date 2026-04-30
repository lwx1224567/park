import {TKBaseObject} from "@/utils/TKThree/TKBaseObject";
import * as THREE from 'three'
import {BaseParkDevice} from "@/views/park/models/parkDevice/BaseParkDevice";
import {delta} from "diagram-js/lib/util/PositionUtil";
import {CarFenceShader} from "@/views/park/shaders/CarFenceShader";
import {TKClassFactory} from "@/utils/TKThree/TKClassFactory";

/**
 * 停车位
 */
export class ParkingSpace extends BaseParkDevice {
  /**
   * 停车位状态
   * @private
   */
  private status: ParkingSpaceStatusEnum = ParkingSpaceStatusEnum.FREE;
  /**
   * 汽车模型
   * @private
   */
  private car: THREE.Object3D | null = null;

  /**
   * 汽车围栏模型，用于显示汽车状态
   * @private
   */
  private fence: THREE.Object3D | null = null;
  private fenceMaterial: THREE.ShaderMaterial | null = null;

  constructor(config: any, model: THREE.Object3D) {
    super(config, model);
  }

  override start() {
    super.start();
    this.initFence();
  }

  override update(delta: number) {
    super.update(delta);
  }

  /**
   * 获取停车位状态
   */
  getStatus(): ParkingSpaceStatusEnum {
    return this.status;
  }

  /**
   * 设置停车位状态
   */
  setStatus(value: ParkingSpaceStatusEnum) {
    // 状态改变时，执行相应的操作
    if (this.status !== value) {
      switch (value) {
        case ParkingSpaceStatusEnum.OCCUPIED:
          this.showCar();
          break;
        case ParkingSpaceStatusEnum.FREE:
          this.hideCar();
          break;
        case ParkingSpaceStatusEnum.UNDER_REPAIR:
          if (this.status === ParkingSpaceStatusEnum.OCCUPIED) {
            this.hideCar();
          }
          break;
      }
      this.status = value;
      this.setFenceColor(value);
    }
  }

  /**
   * 初始化 汽车
   */
  initCar() {
    this.car = TKClassFactory.getModelByName('Car');
    this.car.rotation.y = -Math.PI / 2;
    const box = new THREE.Box3().setFromObject(this.car);
    const size = new THREE.Vector3();
    box.getSize(size);
    this.car.position.y += size.y / 2;
  }

  /**
   * 显示 汽车
   */
  showCar() {
    if (!this.car) {
      this.initCar();
    }
    this.scene.add(this.car);
  }

  /**
   * 隐藏 汽车
   */
  hideCar() {
    this.car && this.scene.remove(this.car);
  }

  initFence() {
    const geometry = new THREE.BoxGeometry(this.size.x - 0.4, this.size.z, this.size.z - 0.4);
    this.fenceMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      vertexShader: CarFenceShader.vertexShader,
      fragmentShader: CarFenceShader.fragmentShader,
      depthTest: false,
      uniforms: {
        uColor: {value: new THREE.Color(colors[this.status]),},
        uHeight: {value: this.size.z,},
      },
    });
    this.fence = new THREE.Mesh(geometry, this.fenceMaterial);
    this.fence.position.y += this.size.z / 2;
  }

  /**
   * 根据停车位状态设置围栏颜色
   * @param parkingSpaceStatusStatus
   */
  setFenceColor(parkingSpaceStatusStatus: ParkingSpaceStatusEnum) {
    this.fence && this.fenceMaterial.uniforms.uColor.value.set(colors[parkingSpaceStatusStatus]);
  }

  showFence() {
    this.fence && this.scene.add(this.fence);
  }
  hideFence() {
    this.fence && this.scene.remove(this.fence);
  }
}

/**
 * 枚举，停车位状态
 */
export enum ParkingSpaceStatusEnum {
  /**
   * 空闲
   */
  FREE = 0,
  /**
   * 已占用
   */
  OCCUPIED = 1,
  /**
   * 维护中
   */
  UNDER_REPAIR = 2,
}

/**
 * 表示各状态的颜色数组，枚举的值等于数组索引
 */
const colors = [
  0x30FF00,   // 绿色 空闲
  0xFF0000,   // 红色 占用
  0xFFF500,   // 黄色 维修
];
