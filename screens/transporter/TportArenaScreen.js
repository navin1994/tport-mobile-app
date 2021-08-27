import Rect from "react";
import { Text, View, StyleSheet } from "react-native";

const TportArenaScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Text>The Tport Arena Screen!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TportArenaScreen;
