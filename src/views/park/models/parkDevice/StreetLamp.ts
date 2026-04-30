import {TKBaseObject} from "@/utils/TKThree/TKBaseObject";
import * as THREE from 'three';
import {BaseParkDevice} from "@/views/park/models/parkDevice/BaseParkDevice";

/**
 * 路灯
 */
export class StreetLamp extends BaseParkDevice {
  constructor(config: any, model: THREE.Object3D) {
    super(config, model);
  }

  override start() {
    super.start();
  }

  override update(delta: number) {
    super.update(delta);
  }
}
