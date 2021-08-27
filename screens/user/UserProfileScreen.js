import React from "react";
import { Text, View, StyleSheet } from "react-native";

const UserProfileScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Text>The User Profile Screen!</Text>
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

export default UserProfileScreen;
