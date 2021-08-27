import Rect from "react";
import { Text, View, StyleSheet } from "react-native";

const UserTportScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Text>The User Tport Screen!</Text>
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

export default UserTportScreen;
