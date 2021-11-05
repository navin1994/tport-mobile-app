import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

import Colors from "../constants/Colors";

const window = Dimensions.get("window");

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
  ScreenSwitchContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primaryDark,
    overflow: "hidden",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  leftTextCon: {
    width: "50%",
    height: 50,
    paddingLeft: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    paddingVertical: 8,
  },
  rightTextCon: {
    width: "50%",
    height: 50,
    paddingRight: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    paddingVertical: 8,
    backgroundColor: Colors.success,
  },
  focusedTab: {
    fontFamily: "open-sans",
    fontSize: 13,
    color: "#fff",
  },
  card: {
    alignSelf: "center",
    width: "95%",
  },
  formContainer: {
    alignSelf: "center",
    marginTop: 20,
    alignItems: "center",
    width: window.width * 0.9,
    backgroundColor: Colors.semiTransparentBlack,
    borderRadius: 8,
    paddingVertical: 20,
  },
  errorContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "80%",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  errorText: {
    fontFamily: "open-sans",
    color: Colors.danger,
    fontSize: 13,
  },
  separator: {
    width: "90%",
    height: 2,
    backgroundColor: Colors.danger,
    marginVertical: 10,
  },
  required: {
    color: "red",
  },

  vehicleNumber: {
    position: "absolute",
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: Colors.success,
    borderRadius: 20,
    opacity: 0.9,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 12,
  },
  vehNum: {
    fontFamily: "open-sans",
    fontSize: 14,
    color: "#fff",
  },
  msgBackGround: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.semiTransparentBlack,
    width: window.width,
  },
  msg: {
    color: "#FFF",
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
});

export default Styles;
