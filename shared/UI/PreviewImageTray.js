import React from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import Colors from "../constants/Colors";

const PreviewImageTray = (props) => {
  const { images, onRemoveImg } = props;
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  return (
    <View style={styles.imageTray}>
      <FlatList
        style={styles.flatListStyle}
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        data={images}
        keyExtractor={(item) => item.id.toString()}
        renderItem={(itemData) => (
          <View style={styles.imgThumbnail}>
            <Image
              style={styles.image}
              source={{ uri: itemData.item.imgUri }}
            />
            <TouchableCmp
              useForeground
              onPress={onRemoveImg.bind(this, itemData.item.id)}
            >
              <View style={styles.rmBtn}>
                <AntDesign name="closecircle" size={18} color={Colors.danger} />
              </View>
            </TouchableCmp>
          </View>
        )}
      />
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
    flex: 1,
    borderWidth: 1,
    marginHorizontal: 4,
    borderRadius: 5,
    height: "95%",
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListStyle: { height: "95%", width: 80 },
  rmBtn: {
    position: "absolute",
    top: -5,
    right: -5,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    height: "100%",
    width: "100%",
  },
});

export default PreviewImageTray;
