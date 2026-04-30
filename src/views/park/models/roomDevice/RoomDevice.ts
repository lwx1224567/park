import { TKBaseObject } from '@/utils/TKThree/TKBaseObject';
import * as THREE from 'three';
import { Storey } from '@/views/park/models/parkDevice/Storey';
import { Build } from '@/views/park/models/parkDevice/Build';
import { setModelOpacity } from '@/utils/TKThree/TKUtil';

/**
 * 机房内设备基类，所有机房内设备都继承自此类
 */
class RoomDevice extends TKBaseObject {
  // 添加用于保存上一次相机位置和目标的变量
  lastCameraPosition: THREE.Vector3;
  lastCameraTarget: THREE.Vector3;

  // 添加用于跟踪当前是否处于聚焦状态的变量
  isFocused: boolean = false;

  constructor(config, model) {
    super(config, model);
  }

  override start() {
    // 必须写在start方法中，构造函数中parent还未赋值
    this.scene.position.add(this.getParent().config.baseOffset);

    this.addEventListener('click', this.handleClickEvent.bind(this));
    this.addEventListener('dblclick', this.handleDblClickEvent.bind(this));
    this.addEventListener('focusRoomDeviceByDeviceId', this.focusByDeviceId.bind(this));
  }

  override update(delta: number) {}

  /**
   * 机房设备被单击
   * @param event
   */
  handleClickEvent(event) {
    this.triggerEvent('openDeviceModal', this.config); // 打开设备详情弹窗
  }

  /**
   * 机房设备被双击
   * @param event
   */
  handleDblClickEvent(event) {
    // 1、上报机房，触发机房设备双击事件了，看看是否之前是否已经聚焦过，如果有则这次事件是取消之前设备的聚焦，不执行这次双击事件
    const parent = this.getParent() as Storey;
    if (parent.hasRoomDeviceFocused(this)) {
      parent.cancelFocusedRoomDevice();
    } else {
      // 2、如果之前无设备聚焦，则正常执行该设备的双击事件
      if (!this.isFocused) {
        this.focus();
        this.triggerEvent('toggleLayers', false); // 隐藏楼层选择菜单
      }
    }
  }

  /**
   * 根据设备ID聚焦到当前设备
   */
  async focusByDeviceId(deviceId: string) {
    if (deviceId === this.config.id || this.getChildById(deviceId)?.config.id === deviceId) {
      const parent = this.getParent() as Storey;
      this.triggerEvent('storeyExpand', () => {
        parent.storeySelected({
          id: parent.config.id,
          callback: () => {
            this.focus();
            this.triggerEvent('toggleLayers', false); // 隐藏楼层选择菜单
            if (this.getChildById(deviceId)?.config.id === deviceId) {
              this.triggerEvent('pullOutDeviceById', deviceId); // 弹出设备
            }
          },
        }); //选中楼层
      }); // 展开楼层
    }
  }

  /**
   * 聚焦到当前设备
   */
  focus() {
    this.isFocused = true;
    const parent = this.getParent() as Storey;
    parent.focusedRoomDevice(this);
    this.isHoverOutline = false;
    this.isClickOutline = false;
    // 隐藏其他模型
    // if (isHide) {
    //   (this.getParent() as Storey).hideOtherChildren(this);
    // }
    // 视角聚焦与自身
    this.focusingObject();
  }

  /**
   * 取消聚焦到当前设备
   */
  cancelFocus() {
    this.isFocused = false;
    this.isHoverOutline = this.config.isHoverOutline;
    this.isClickOutline = this.config.isClickOutline;
    // (this.getParent() as Storey).showChildren();
    // 重置相机位置当前楼层视角
    const parent = this.getParent() as Storey; // 获取当前楼层
    const build = parent.getParent() as Build; // 获取当前建筑
    parent.storeySelected({
      id: parent.config.id,
      callback: () => {
        this.triggerEvent('toggleLayers', {
          status: true,
          layerId: parent.config.id,
          buildId: build.config.id,
        });
      },
    }); //选中楼层
  }

  /**
   * 聚焦到模型正前方
   * @private
   */
  private focusingObject() {
    // 记录上次相机位置及目标
    this.lastCameraPosition = this.camera.position.clone();
    this.lastCameraTarget = this.control.target.clone();

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
    const distance = Math.max(modelSize * 0.6, 3); // 距离模型2倍大小的位置

    // 计算相机位置：模型中心沿着前方方向延伸一定距离
    const cameraPosition = new THREE.Vector3();
    const tarPos = this.getWorldPosition();
    tarPos.y += this.size.y / 2;

    cameraPosition.copy(tarPos).add(worldForward.multiplyScalar(distance));

    this.camera.setView(cameraPosition, tarPos);
  }

  public hideModel() {
    this.isHoverOutline = false;
    this.isClickOutline = false;
    setModelOpacity(this.scene, true);
  }

  public showModel() {
    setModelOpacity(this.scene, false);
    this.isHoverOutline = this.config.isHoverOutline;
    this.isClickOutline = this.config.isClickOutline;
  }
}

export { RoomDevice };
