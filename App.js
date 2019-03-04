/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */
import React, { Component } from "react";
import { Provider } from "react-redux";
import { createStackNavigator, createAppContainer } from "react-navigation";
import mainPlayer from "./src/screens/mainPlayer";
import LandingPage from "./src/screens/LandingPage";
import PlayerStore from "./src/stores/Player";
import TrackStore from "./src/stores/Track";
import store from "./src/store/store";
import TrackPlayer from "react-native-track-player";
import Player from "./src/stores/Player";
import playlistData from "./src/data/playlist.json";
const AppNavigator = createStackNavigator(
  {
    Landing: {
      screen: LandingPage
    },
    mainPlayer: { screen: mainPlayer }
  },
  {
    initialRouteName: "Landing"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  componentDidMount() {
    PlayerStore.playType = 1;
    this._onTrackChanged = TrackPlayer.addEventListener(
      "playback-track-changed",
      async data => {
        if (PlayerStore.playType === 1) {
          if (data.nextTrack) {
            const track = await TrackPlayer.getTrack(data.nextTrack);
            TrackStore.title = track.title;
            TrackStore.artist = track.artist;
            TrackStore.artwork = track.artwork;
          }
        } else if (PlayerStore.playType === 2) {
          if (this.repeat) {
            if (data.nextTrack === this.trackToRepeat) return;
            console.warn(data.nextTrack);
            if (data.nextTrack === this.trackToRepeat) return;
            if (!data.track && data.nextTrack && this.trackToRepeat === null) {
              this.trackToRepeat = data.nextTrack;
            } else {
              TrackPlayer.pause();
              TrackPlayer.skip(this.trackToRepeat).then(() =>
                TrackPlayer.play()
              );
            }
            /* await TrackPlayer.pause();
            const length = playlistData.length;
            const rand = 1 + Math.floor(Math.random() * length);
            const track = await TrackPlayer.getTrack(playlistData[rand - 1].id);
            TrackStore.title = track.title;
            TrackStore.artist = track.artist;
            TrackStore.artwork = track.artwork;
            await TrackPlayer.skip(playlistData[rand - 1].id);
            await TrackPlayer.play();*/
          }
        }
      }
    );
    this._onStateChanged = TrackPlayer.addEventListener(
      "playback-state",
      data => {
        PlayerStore.playbackState = data.state;
      }
    );
  }
  componentWillUnmount() {
    this._onTrackChanged.remove();
    this._onStateChanged.remove();
  }
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
