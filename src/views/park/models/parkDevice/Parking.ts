import {TKBaseObject} from "@/utils/TKThree/TKBaseObject";
import * as THREE from 'three'
import {ParkingSpace} from "@/views/park/models/parkDevice/ParkingSpace";

/**
 * 停车场
 */
export class Parking extends TKBaseObject {
  // 添加用于保存上一次相机位置和目标的变量
  lastCameraPosition: THREE.Vector3;
  lastCameraTarget: THREE.Vector3;

  constructor(config: any, model: THREE.Object3D) {
    super(config, model);
  }

  override start() {
    //   初始化所有停车位的车
    this.getChildren().forEach(child => {
      if (child instanceof ParkingSpace) {
        const randomNum = Math.floor(Math.random() * 2); // 生成 0, 1, 或 2
        (child as ParkingSpace).setStatus(randomNum)
      }
    })

    this.addEventListener('parkingManage', (event) => {
      if (event) {
        this.lastCameraPosition = this.camera.position.clone();
        this.lastCameraTarget = this.camera.control.target.clone();
        this.camera.setView(
          new THREE.Vector3(5.262, 87.324, 54.616),
          new THREE.Vector3(66.970, 2.428, 54.519),
        );
        this.showParkingSpaceFence()
      } else {
        this.hideParingingSpaceFence();
        this.camera.setView(this.lastCameraPosition, this.lastCameraTarget);
      }
    })
  }

  override update(delta: number) {

  }

  /**
   * 显示所有停车位的状态
   */
  showParkingSpaceFence() {
    this.getChildren().forEach(child => {
      if (child instanceof ParkingSpace) {
        child.showFence();
      }
    })
  }

  /**
   * 隐藏所有停车位的状态
   */
  hideParingingSpaceFence() {
    this.getChildren().forEach(child => {
      if (child instanceof ParkingSpace) {
        child.hideFence();
      }
    })
  }
}
