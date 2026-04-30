import * as THREE from "three";
import {TKBaseObject} from "@/utils/TKThree/TKBaseObject";
import {ModelLoader, ModelType} from "@/utils/TKThree/TKUtil";

/**
 * 园区/阵地
 */
class SkyBox extends TKBaseObject {

  constructor(config, model) {
    super(config, model);
  }

  override start() {


    // ModelLoader(this.config, '/models/TKH2.glb', ModelType.GLB, (model) => {
    //   console.log(model)
    //   this.scene.add(model)
    // })
  }

  override update(delta: number) {
    // console.log(delta)
  }
}

export {SkyBox}
