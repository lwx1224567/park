import {TKBaseObject} from '@/utils/TKThree/TKBaseObject';
import * as THREE from 'three';
import {CameraConeShader} from '../../shaders/CameraConeShader';
import {RoomDevice} from "./RoomDevice";

/**
 * 摄像头
 */
class IndoorCamera extends RoomDevice {

  constructor(config, model) {
    super(config, model);
  }


  override start() {
    super.start();
    this.addEventListener('click', (event) => {
      this.triggerEvent('openCameraModal', true);// 打开摄像头监控弹窗
    });

  }

  override update(delta: number) {
    super.update(delta);
  }

}

export {IndoorCamera};
