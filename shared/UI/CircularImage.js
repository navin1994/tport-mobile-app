import React from "react";
import { StyleSheet, View, Image } from "react-native";

const CircularImage = (props) => {
  return (
    <View style={{ ...styles.container, ...props.style }}>
      <Image
        source={props.imageURL}
        style={{ ...styles.image, ...props.imageStyle }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    overflow: "hidden",
    borderRadius: 200 / 2,
  },
  image: {
    resizeMode: "center",
    height: 150,
    width: 150,
  },
});

export default CircularImage;
