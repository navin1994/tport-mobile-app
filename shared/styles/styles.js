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
  mainHead: {
    fontFamily: "open-sans-bold",
    alignSelf: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  heading: { fontFamily: "open-sans-bold" },
  text: { fontFamily: "open-sans" },
  cntDtls: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    flexWrap: "wrap",
  },
  actionsContainer: {
    flex: 1,
    marginVertical: 20,
    flexDirection: "column",
    alignItems: "center",
  },
  btnContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
  },
});

export default Styles;
