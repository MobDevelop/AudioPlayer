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
    this._onTrackChanged = TrackPlayer.addEventListener(
      "playback-track-changed",
      async data => {
        if (data.nextTrack) {
          const track = await TrackPlayer.getTrack(data.nextTrack);
          TrackStore.title = track.title;
          TrackStore.artist = track.artist;
          TrackStore.artwork = track.artwork;
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
