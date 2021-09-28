import React from "react";
import { StyleSheet, View, Text, ActivityIndicator, Modal } from "react-native";

const ProgressIndicator = (props) => {
  return (
    <Modal transparent>
      <View style={styles.screen}>
        <View style={{ ...styles.indicatorBackground, ...props.style }}>
          <ActivityIndicator size="large" color="black" />
          <Text style={{ ...styles.messageContainer, ...props.msgStyle }}>
            {props.msg}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorBackground: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    alignSelf: "center",
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
