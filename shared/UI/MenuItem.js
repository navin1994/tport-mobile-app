import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback,
} from "react-native";

const window = Dimensions.get("window");

const MenuItem = (props) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <TouchableCmp style={{ flex: 1 }} onPress={props.onSelect}>
      <View style={{ ...styles.card, ...props.style }}>
        <View style={styles.container}>
          {props.icon}
          <Text style={styles.title}>{props.title}</Text>
        </View>
      </View>
    </TouchableCmp>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 12,
    borderRadius: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 15,
    width: window.width * 0.35,
    height: window.height * 0.15,
    margin: 15,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  title: {
    fontFamily: "open-sans-bold",
    textTransform: "uppercase",
    color: "#fff",
    fontSize: 10,
    alignSelf: "center",
  },
});

export default MenuItem;
