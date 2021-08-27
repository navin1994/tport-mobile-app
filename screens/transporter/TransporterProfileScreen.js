import React from "react";
import { Text, View, StyleSheet } from "react-native";

const TransporterProfileScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Text>The Transporter Profile Screen!</Text>
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

export default TransporterProfileScreen;
