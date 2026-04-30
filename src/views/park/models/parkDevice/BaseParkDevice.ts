import {TKBaseObject} from "@/utils/TKThree/TKBaseObject";
import * as THREE from 'three'


export class BaseParkDevice extends TKBaseObject {

  // 添加用于保存上一次相机位置和目标的变量
  lastCameraPosition: THREE.Vector3;
  lastCameraTarget: THREE.Vector3;
  // 添加用于跟踪当前是否处于聚焦状态的变量
  isFocused: boolean = false;

  constructor(config, model) {
    super(config, model);
  }

  override start() {
    let scale = 5;
    this.sprite.scale.set(scale, scale, scale);
    this.sprite.position.y =  this.size.y + 3;
    this.addEventListener('dblclick', this.handleDblClickEvent.bind(this))
  }

  override update(delta: number) {

  }

  handleDblClickEvent(event) {
    !this.isFocused && this.focus();
  }

  /**
   * 聚焦到模型正前方
   * @private
   */
  private focus() {
    this.isFocused = true;
    this.isHoverOutline = false;
    this.isClickOutline = false;
    // 记录上次相机位置及目标
    this.lastCameraPosition.copy(this.camera.position);
    this.lastCameraTarget.copy(this.control.target);

    // 获取模型的世界矩阵
    const worldMatrix = this.scene.matrixWorld;

    // 从世界矩阵中提取位置、旋转和缩放
    const worldQuaternion = new THREE.Quaternion().setFromRotationMatrix(worldMatrix);

    // 创建一个表示"前方"的单位向量（通常Z轴负方向是模型正面）
    const localForward = new THREE.Vector3(0, 0, 1);

    // 应用模型的世界旋转到前方向量
    const worldForward = localForward.applyQuaternion(worldQuaternion);

    // 计算合适距离（基于模型大小）
    const modelSize = Math.max(this.size.x, this.size.y, this.size.z);
    const distance = Math.max(modelSize * 2, 3); // 距离模型2倍大小的位置

    // 计算相机位置：模型中心沿着前方方向延伸一定距离
    const cameraPosition = new THREE.Vector3();
    const tarPos = this.getWorldPosition();
    tarPos.y += this.size.y / 2;

    cameraPosition.copy(tarPos).add(worldForward.multiplyScalar(distance));

    this.camera.setView(cameraPosition, tarPos);
  }

  /**
   * 取消聚焦到当前设备
   */
  cancelFocus() {
    this.isFocused = false;
    this.isHoverOutline = this.config.isHoverOutline;
    this.isClickOutline = this.config.isClickOutline;
    // (this.getParent() as Storey).showChildren();

    this.camera.setView(this.lastCameraPosition, this.lastCameraTarget);
  }
}
