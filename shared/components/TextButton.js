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

const TextButton = (props) => {
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
    backgroundColor: Colors.transparent,
    overflow: "hidden",
  },
  title: {
    margin: 5,
    fontFamily: "open-sans",
    color: Colors.primary,
    fontSize: 14,
  },
});

export default TextButton;
