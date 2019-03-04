import { observable } from "mobx";

class Track {
  @observable title = "";
  @observable artist = "";
  @observable artwork = "../resources/pure.m4a";
}

export default new Track();
