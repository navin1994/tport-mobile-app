import React, { useEffect } from "react";
import { Text, View, StyleSheet, BackHandler, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import * as authActions from "../../store/action/auth";

const TransporterDashboardScreen = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    const backAction = () => {
      if (isFocused) {
        Alert.alert(
          "Hold on!",
          "Are you sure you want to logout and go back?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel",
            },
            { text: "YES", onPress: () => dispatch(authActions.logout()) },
          ]
        );
        return true;
      } else {
        navigation.goBack();
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isFocused]);

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
