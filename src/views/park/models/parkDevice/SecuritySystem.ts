import * as THREE from 'three';
import {TKBaseObject} from '@/utils/TKThree/TKBaseObject';
import {GeoFence} from "@/views/park/models/parkDevice/GeoFence";
import {OutdoorCamera} from "@/views/park/models/parkDevice/OutdoorCamera";

/**
 * 安防系统
 */
class SecuritySystem extends TKBaseObject {
  constructor(config: any, model: THREE.Object3D) {

    super(config, model);
  }

  override start() {

    this.addEventListener('showSecuritySystem', this.handleShowSecuritySystemEvent.bind(this));
    this.addEventListener('hideSecuritySystem', this.handleHideSecuritySystemEvent.bind(this));
  }

  override update(delta: number) {
  }

  /**
   * 显示安防系统
   */
  handleShowSecuritySystemEvent() {
    this.getChildren().forEach((child: TKBaseObject) => {
      if (child instanceof GeoFence) {
        child.showGeoFence();
      } else if (child instanceof OutdoorCamera) {
        child.showCone();
      }
      child.showSprite();
    });
  }

  /**
   * 隐藏安防系统
   */
  handleHideSecuritySystemEvent() {
    this.getChildren().forEach(child => {
      if (child instanceof GeoFence) {
        child.hideGeoFence();
      } else if (child instanceof OutdoorCamera) {
        child.hideCone();
      }
      child.hideSprite();
    });
  }
}

export {SecuritySystem};
