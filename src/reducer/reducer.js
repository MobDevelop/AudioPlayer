const initialState = {
  saving: 0, //0: init 1: saving 2: fail 3: timeout 4: success,
  currentAudio: {
    id: 1,
    title: "",
    artist: "",
    artistId: "",
    url: "",
    album: "",
    albumImage: "",
    albumId: "",
    date: "",
    duration: 0
  }
};

export function ShootingScore(state = initialState, action) {
  switch (action.type) {
    case "SAVING_SCORE":
      return { ...state, saving: 1 };
    default:
      return state;
  }
}
