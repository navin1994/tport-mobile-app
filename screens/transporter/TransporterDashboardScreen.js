import React, { useEffect } from "react";
import { Text, View, StyleSheet, BackHandler, Alert } from "react-native";
import { useDispatch } from "react-redux";

import * as authActions from "../../store/action/auth";

const TransporterDashboardScreen = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.route.name !== "transpDashboard") {
      return;
    }
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to logout and go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => dispatch(authActions.logout()) },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  return (
    <View style={styles.screen}>
      <Text>The Transporter Dashboard Screen!</Text>
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

export default TransporterDashboardScreen;
