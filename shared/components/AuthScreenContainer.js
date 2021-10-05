import React from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";

import BackgroundImage from "../UI/BackgroundImage";
import CircularImage from "../UI/CircularImage";
import Card from "../UI/Card";

const window = Dimensions.get("window");

const AuthScreenContainer = (props) => {
  const { preventBackground } = props;

  return (
    <BackgroundImage>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={styles.screen}
          pointerEvents={preventBackground ? "none" : "auto"}
        >
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
