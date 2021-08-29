import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";

import Colors from "../constants/Colors";

const RaisedButton = (props) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <TouchableCmp onPress={props.onPress} useForeground>
      <View style={{ ...styles.touchable, ...props.style }}>
        {props.leadingIcon}
        <Text style={{ ...styles.title, ...props.titleStyle }}>
          {props.title}
        </Text>
        {props.trailingIcon}
      </View>
    </TouchableCmp>
  );
};

const styles = StyleSheet.create({
  touchable: {
    margin: 5,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryDark,
    padding: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  title: {
    margin: 5,
    fontFamily: "open-sans-bold",
    color: "white",
    fontSize: 14,
  },
});

export default RaisedButton;
