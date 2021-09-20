import React from "react";
import { View, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import Colors from "../constants/Colors";

const PreviewImageTray = (props) => {
  return (
    <View style={styles.imageTray}>
      <View style={styles.imgThumbnail}>
        <View style={styles.rmBtn}>
          <AntDesign name="closecircle" size={15} color={Colors.danger} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageTray: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 130,
    borderWidth: 1,
    padding: 5,
  },
  imgThumbnail: {
    borderWidth: 1,
    marginHorizontal: 4,
    borderRadius: 5,
    height: "95%",
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  rmBtn: {
    position: "absolute",
    top: -5,
    right: -5,
  },
});

export default PreviewImageTray;
