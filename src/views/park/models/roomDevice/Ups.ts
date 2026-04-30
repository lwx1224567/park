import {RoomDevice} from "@/views/park/models/roomDevice/RoomDevice";

class Ups extends RoomDevice {
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

export {Ups}
