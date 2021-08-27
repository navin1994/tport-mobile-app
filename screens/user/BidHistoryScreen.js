import React from "react";
import { Text, View, StyleSheet } from "react-native";

const BidHistoryScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Text>The Bid History Screen!</Text>
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

export default BidHistoryScreen;
