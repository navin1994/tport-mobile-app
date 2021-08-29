import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const window = Dimensions.get("window");

const HeaderLeft = (props) => {
  const { navigation } = props;
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <View style={styles.headerLeft}>
      <TouchableCmp
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Ionicons
          name={
            Platform.OS === "android"
              ? "arrow-back-outline"
              : "ios-chevron-back-outline"
          }
          size={25}
          color="white"
        />
      </TouchableCmp>

      {props.titleIcon}
    </View>
  );
};

const styles = StyleSheet.create({
  headerLeft: {
    width: window.width * 0.2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default HeaderLeft;
