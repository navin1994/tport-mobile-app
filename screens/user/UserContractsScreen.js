import Rect from "react";
import { Text, View, StyleSheet } from "react-native";

const UserContractsScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Text>The User Contracts Screen!</Text>
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

export default UserContractsScreen;
