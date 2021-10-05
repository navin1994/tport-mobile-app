import { StyleSheet } from "react-native";

import Colors from "../constants/Colors";

const Styles = StyleSheet.create({
  label: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "open-sans-bold",
  },
  labelContainer: {
    position: "absolute",
    left: 0,
    top: -22,
    backgroundColor: Colors.transparent,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
});

export default Styles;
