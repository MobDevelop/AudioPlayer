import { observable } from "mobx";

class Player {
  @observable playbackState;
  @observable playType; //1: Loop; 2: Shuffle; 3: Repeat;
}

export default new Player();
