import React from "react";
import { Text, View, StyleSheet } from "react-native";

const ContractHistoryScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Text>The Customer Contracts History Screen!</Text>
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

export default ContractHistoryScreen;
