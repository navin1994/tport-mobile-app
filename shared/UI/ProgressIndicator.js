import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";

const ProgressIndicator = (props) => {
  return (
    <View style={{ ...styles.indicatorBackground, ...props.style }}>
      <ActivityIndicator size="large" color="black" />
      <Text style={{ ...styles.messageContainer, ...props.msgStyle }}>
        {props.msg}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorBackground: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    padding: 20,
    backgroundColor: "#fff",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 100,
  },
  messageContainer: {
    fontFamily: "open-sans-bold",
    color: "black",
    fontSize: 14,
  },
});
export default ProgressIndicator;
