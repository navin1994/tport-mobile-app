import React from "react";
import {
  Text,
  View,
  CheckBox,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Dimensions,
} from "react-native";

const window = Dimensions.get("window");

const TAndCContainer = (props) => {
  let TouchableCmp = TouchableOpacity;
  const { navigation } = props;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  return (
    <View style={{ ...styles.tAndCContainer, ...props.style }}>
      <View style={styles.subContainer}>
        <View style={styles.checkboxContainer}>
          <CheckBox value={props.value} onValueChange={props.onValueChange} />
        </View>
        <Text style={styles.msg}>I Have Read And Agree To The</Text>
      </View>
      <TouchableCmp onPress={() => navigation.navigate("TAndCModal")}>
        <Text style={styles.clickableText}>Terms Of Service.</Text>
      </TouchableCmp>
    </View>
  );
};

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  tAndCContainer: {
    marginVertical: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    width: window.width * 0.9,
    padding: 5,
    opacity: 0.7,
  },
  clickableText: {
    fontFamily: "open-sans",
    color: "yellow",
  },
  checkboxContainer: {
    marginHorizontal: 10,
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 20,
    width: 20,
  },
  msg: {
    fontFamily: "open-sans",
    color: "white",
  },
});

export default TAndCContainer;
