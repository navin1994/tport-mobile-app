import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RatingStars = (props) => {
  const { rating, setRating, starSize } = props;
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  return (
    <View style={{ ...styles.ratingContainer, ...props.style }}>
      <TouchableCmp onPress={() => setRating(1)}>
        <Ionicons
          name={
            rating >= 1
              ? Platform.OS === "android"
                ? "md-star-sharp"
                : "ios-star-sharp"
              : Platform.OS === "android"
              ? "md-star-outline"
              : "ios-star-outline"
          }
          size={starSize}
          color={rating >= 1 ? "red" : "black"}
        />
      </TouchableCmp>
      <TouchableCmp onPress={() => setRating(2)}>
        <Ionicons
          name={
            rating >= 2
              ? Platform.OS === "android"
                ? "md-star-sharp"
                : "ios-star-sharp"
              : Platform.OS === "android"
              ? "md-star-outline"
              : "ios-star-outline"
          }
          size={starSize}
          color={rating >= 2 ? "red" : "black"}
        />
      </TouchableCmp>
      <TouchableCmp onPress={() => setRating(3)}>
        <Ionicons
          name={
            rating >= 3
              ? Platform.OS === "android"
                ? "md-star-sharp"
                : "ios-star-sharp"
              : Platform.OS === "android"
              ? "md-star-outline"
              : "ios-star-outline"
          }
          size={starSize}
          color={rating >= 3 ? "red" : "black"}
        />
      </TouchableCmp>
      <TouchableCmp onPress={() => setRating(4)}>
        <Ionicons
          name={
            rating >= 4
              ? Platform.OS === "android"
                ? "md-star-sharp"
                : "ios-star-sharp"
              : Platform.OS === "android"
              ? "md-star-outline"
              : "ios-star-outline"
          }
          size={starSize}
          color={rating >= 4 ? "red" : "black"}
        />
      </TouchableCmp>
      <TouchableCmp onPress={() => setRating(5)}>
        <Ionicons
          name={
            rating >= 5
              ? Platform.OS === "android"
                ? "md-star-sharp"
                : "ios-star-sharp"
              : Platform.OS === "android"
              ? "md-star-outline"
              : "ios-star-outline"
          }
          size={starSize}
          color={rating >= 5 ? "red" : "black"}
        />
      </TouchableCmp>
    </View>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    flex: 1,
    width: "100%",
    margin: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default RatingStars;
