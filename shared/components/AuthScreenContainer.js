import React from "react";
import { View, StyleSheet, Dimensions, ScrollView, Image } from "react-native";

import BackgroundImage from "../UI/BackgroundImage";
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
          <View style={{ ...styles.halfCircle }}>
            <Image
              source={require("../../assets/images/logo.jpg")}
              style={{ ...styles.image, ...props.imageStyle }}
            />
          </View>
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
  halfCircle: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    overflow: "hidden",
    borderTopEndRadius: 200 / 2,
    borderTopStartRadius: 200 / 2,
    height: 75,
    width: 150,
    marginTop: 40,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 12,
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: window.width * 0.9,
  },
  image: {
    resizeMode: "center",
    height: 80,
  },
});

export default AuthScreenContainer;
