import PropTypes from "prop-types";
import { observer } from "mobx-react";
import React, { Component } from "react";
import TrackPlayer, { ProgressComponent } from "react-native-track-player";
import Icon from "react-native-vector-icons/dist/FontAwesome";

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Slider
} from "react-native";

import TrackStore from "../stores/Track";
import PlayerStore from "../stores/Player";

class ProgressBar extends ProgressComponent {
  render() {
    return (
      <View style={styles.progress}>
        <View style={{ flex: this.getProgress(), backgroundColor: "red" }} />
        <View
          style={{ flex: 1 - this.getProgress(), backgroundColor: "grey" }}
        />
      </View>
    );
  }
}

class MyPlayerBar extends TrackPlayer.ProgressComponent {
  formatTime(seconds) {
    return seconds > 3600
      ? [
          parseInt(seconds / 60 / 60),
          parseInt((seconds / 60) % 60),
          parseInt(seconds % 60)
        ]
          .join(":")
          .replace(/\b(\d)\b/g, "0$1")
      : [parseInt((seconds / 60) % 60), parseInt(seconds % 60)]
          .join(":")
          .replace(/\b(\d)\b/g, "0$1");
  }
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 15,
          alignItems: "center"
        }}
      >
        <Text style={styles.leftSliderText}>
          {this.state.isSeeking
            ? this.formatTime(this.seek)
            : this.formatTime(this.state.position)}
        </Text>
        <Slider
          minimumValue={0}
          maximumValue={this.state.duration}
          style={styles.slider}
          thumbTintColor="white"
          minimumTrackTintColor="#f06595"
          maximumTrackTintColor="rgba(150,200,155,.8)"
          step={1}
          onValueChange={val => {
            //TrackPlayer.pause();
            this.seek = val;
            this.setState({ isSeeking: true });
          }}
          onSlidingComplete={val => {
            this.setState({ isSeeking: false }, () => {
              TrackPlayer.seekTo(this.seek);
              this.position = this.seek;
              //TrackPlayer.play();
            });
          }}
          value={this.state.isSeeking ? this.seek : this.state.position}
        />
        <Text>{this.formatTime(this.state.duration)}</Text>
      </View>
    );
  }
}

function ControlButton({ color, title, onPress }) {
  return (
    <TouchableOpacity style={styles.controlButtonContainer} onPress={onPress}>
      <Icon
        style={styles.controlButtonText}
        name={title}
        size={30}
        color={color}
      />
    </TouchableOpacity>
  );
}

ControlButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
};

@observer
export default class Player extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    onRandom: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onTogglePlayback: PropTypes.func.isRequired
  };

  static defaultProps = {
    style: {}
  };

  render() {
    const {
      style,
      onNext,
      onPrevious,
      onTogglePlayback,
      onRandom,
      onRepeat
    } = this.props;
    var middleButtonText = "play";
    var randomColor = "#000";
    var repeatColor = "#000";
    var defaultColor = "#000";
    if (
      PlayerStore.playbackState === TrackPlayer.STATE_PLAYING ||
      PlayerStore.playbackState === TrackPlayer.STATE_BUFFERING
    ) {
      middleButtonText = "pause";
    }
    if (PlayerStore.playType === 2) {
      randomColor = "#AAA";
      repeatColor = defaultColor;
    } else if (PlayerStore.playType === 3) {
      repeatColor = "#AAA";
      randomColor = defaultColor;
    } else {
      randomColor = defaultColor;
      repeatColor = defaultColor;
    }

    return (
      <View style={[styles.card, style]}>
        <Image style={styles.cover} source={{ uri: TrackStore.artwork }} />
        <MyPlayerBar />
        <Text style={styles.title}>{TrackStore.title}</Text>
        <Text style={styles.artist}>{TrackStore.artist}</Text>
        <View style={styles.controls}>
          <ControlButton
            color={randomColor}
            title={"random"}
            onPress={onRandom}
          />
          <ControlButton
            color={defaultColor}
            title={"backward"}
            onPress={onPrevious}
          />
          <ControlButton
            color={defaultColor}
            title={middleButtonText}
            onPress={onTogglePlayback}
          />
          <ControlButton
            color={defaultColor}
            title={"forward"}
            onPress={onNext}
          />
          <ControlButton
            color={repeatColor}
            title={"refresh"}
            onPress={onRepeat}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: "80%",
    elevation: 1,
    borderRadius: 4,
    shadowRadius: 2,
    shadowOpacity: 0.1,
    alignItems: "center",
    shadowColor: "black",
    backgroundColor: "white",
    shadowOffset: { width: 0, height: 1 }
  },
  cover: {
    width: 140,
    height: 140,
    marginTop: 20,
    backgroundColor: "grey"
  },
  progress: {
    height: 1,
    width: "90%",
    marginTop: 10,
    flexDirection: "row"
  },
  slider: {
    height: 2,
    width: "80%",
    marginTop: 10,
    flexDirection: "row"
  },
  leftSliderText: {
    color: "black",
    backgroundColor: "transparent",
    width: 40,
    textAlign: "center"
  },
  title: {
    marginTop: 10
  },
  artist: {
    fontWeight: "bold"
  },
  controls: {
    marginVertical: 20,
    flexDirection: "row"
  },
  controlButtonContainer: {
    flex: 1
  },
  controlButtonText: {
    fontSize: 18,
    textAlign: "center"
  }
});
