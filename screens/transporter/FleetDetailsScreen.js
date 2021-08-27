import React from "react";
import { Text, View, StyleSheet } from "react-native";

const FleetDetailsScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Text>The Fleet Details Screen!</Text>
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

export default FleetDetailsScreen;
