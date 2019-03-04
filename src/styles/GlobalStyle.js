import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("screen");
export default (Styles = StyleSheet.create({
  flexOne: {
    flex: 1
  },
  resolution: {
    width,
    height
  },
  ImageView: {
    marginTop: 80,
    marginLeft: 20
  },
  transparentImage: {
    width: width - 40,
    height: 300
  }
}));
