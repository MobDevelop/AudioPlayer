import React, { Component } from "react";
import { observer } from "mobx-react";
import TrackPlayer, { ProgressComponent } from "react-native-track-player";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast, { DURATION } from "react-native-easy-toast";

import Player from "../components/Player";
import playlistData from "../data/playlist.json";

import PlayerStore from "../stores/Player";

@observer
export default class LandingScreen extends Component {
  static navigationOptions = {
    title: "Playlist Example"
  };

  componentDidMount() {
    TrackPlayer.setupPlayer();
    TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SKIP
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE
      ]
    });
    this.initPlayBack();
  }

  initPlayBack = async () => {
    await TrackPlayer.reset();
    await TrackPlayer.add(playlistData);
    await TrackPlayer.play();
  };

  togglePlayback = async () => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack == null) {
    } else {
      if (PlayerStore.playbackState === TrackPlayer.STATE_PAUSED) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  };

  skipToNext = async () => {
    try {
      await TrackPlayer.pause();
      //await TrackPlayer.skipToNext();
    } catch (_) {
      this.refs.toast.show("This is the last!");
      await TrackPlayer.play();
    }
  };

  skipToPrevious = async () => {
    try {
      await TrackPlayer.pause();
      await TrackPlayer.skipToPrevious();
    } catch (_) {
      this.refs.toast.show("This is the first!");
      await TrackPlayer.play();
    }
  };

  randomPlay = async () => {
    try {
      if (PlayerStore.playType === 2) {
        PlayerStore.playType = 1;
      } else PlayerStore.playType = 2;
    } catch (_) {}
  };

  repeatPlay = async () => {
    try {
      if (PlayerStore.playType === 3) {
        PlayerStore.playType = 1;
      } else PlayerStore.playType = 3;
    } catch (_) {}
  };

  getStateName(state) {
    switch (state) {
      case TrackPlayer.STATE_NONE:
        return "None";
      case TrackPlayer.STATE_PLAYING:
        return "Playing";
      case TrackPlayer.STATE_PAUSED:
        return "Paused";
      case TrackPlayer.STATE_STOPPED:
        return "Stopped";
      case TrackPlayer.STATE_BUFFERING:
        return "Buffering";
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Player
          style={styles.player}
          onRandom={() => this.randomPlay()}
          onNext={() => this.skipToNext()}
          onPrevious={() => this.skipToPrevious()}
          onTogglePlayback={() => this.togglePlayback()}
          onRepeat={() => this.repeatPlay()}
        />
        <Text style={styles.state}>
          {this.getStateName(PlayerStore.playbackState)}
        </Text>
        <Toast position="bottom" positionValue={200} ref="toast" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  description: {
    width: "80%",
    marginTop: 20,
    textAlign: "center"
  },
  player: {
    marginTop: 40
  },
  state: {
    marginTop: 20
  }
});
