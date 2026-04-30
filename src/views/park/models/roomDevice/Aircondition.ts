import {TKBaseObject} from "@/utils/TKThree/TKBaseObject";
import gsap from "gsap";
import * as THREE from "three";
import {RoomDevice} from "./RoomDevice"

/**
 * 空调
 */
class Aircondition extends RoomDevice {

  constructor(config, model) {
    super(config, model);
  }

  override start() {
    super.start();
  }

  override update(delta: number) {
    super.update(delta);

  }

}

export {Aircondition}
