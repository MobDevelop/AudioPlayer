/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry } from "react-native";
import App from "./App";
import TrackPlayer from "react-native-track-player";
import { name as appName } from "./app.json";
import PlayerStore, { playbackStates } from "./src/stores/Player";
import TrackStore from "./src/stores/Track";

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => require("./service"));
