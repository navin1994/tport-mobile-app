import React from "react";
import { ImageBackground, StyleSheet } from "react-native";

const BackgroundImage = (props) => {
  return (
    <ImageBackground
      source={require("../../assets/images/mobile-bg.jpg")}
      style={{ ...styles.backgroundImage, ...props.style }}
    >
      {props.children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: null,
    height: null,
    paddingBottom: 10,
  },
});

export default BackgroundImage;
