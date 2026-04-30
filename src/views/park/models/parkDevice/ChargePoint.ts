import {TKBaseObject} from "@/utils/TKThree/TKBaseObject";
import * as THREE from 'three'
import {BaseParkDevice} from "@/views/park/models/parkDevice/BaseParkDevice";

/**
 * 充电桩
 */
export class ChargePoint extends BaseParkDevice {

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
