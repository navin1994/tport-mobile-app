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
import { useNavigation } from "@react-navigation/native";

const window = Dimensions.get("window");

const DrawerHeaderLeft = (props) => {
  const navigation = useNavigation();
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <View style={styles.headerLeft}>
      <TouchableCmp
        onPress={() => {
          navigation.toggleDrawer();
        }}
      >
        <Ionicons
          name={Platform.OS === "android" ? "md-menu-sharp" : "ios-menu-sharp"}
          size={24}
          color="white"
        />
      </TouchableCmp>

      {props.titleIcon}
    </View>
  );
};

const styles = StyleSheet.create({
  headerLeft: {
    width: window.width * 0.3,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export default DrawerHeaderLeft;
