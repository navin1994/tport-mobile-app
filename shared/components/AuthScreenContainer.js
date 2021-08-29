import React, { useLayoutEffect } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";

import BackgroundImage from "../UI/BackgroundImage";
import CircularImage from "../UI/CircularImage";
import Card from "../UI/Card";

const window = Dimensions.get("window");

const AuthScreenContainer = (props) => {
  const { navigation } = props;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <BackgroundImage>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.screen}>
          <CircularImage
            style={{ ...styles.logo, ...props.logoStyle }}
            imageURL={require("../../assets/images/logo.jpg")}
          />
          <Card style={{ ...styles.container, ...props.style }}>
            {props.children}
          </Card>
        </View>
      </ScrollView>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "column",
    // justifyContent: "center",
    alignItems: "center",
  },
  logo: { marginTop: 40, margin: 30 },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: window.width * 0.9,
  },
});

export default AuthScreenContainer;
