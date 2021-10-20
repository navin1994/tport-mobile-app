import React from "react";
import { ImageBackground, StyleSheet, Dimensions } from "react-native";

import ContactUs from "../components/ContactUs";

const { width, height } = Dimensions.get("window");

const BackgroundImage = (props) => {
  return (
    <ImageBackground
      source={require("../../assets/images/mobile-bg.jpg")}
      style={{ ...styles.backgroundImage, ...props.style }}
    >
      {props.children}
      <ContactUs style={styles.contactUs} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  contactUs: {
    bottom: height - height + 70,
    right: width - width + 70,
  },
});

export default BackgroundImage;
