import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Modal,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import Colors from "../constants/Colors";
import TextButton from "./TextButton";

const window = Dimensions.get("window");

const RatingModal = (props) => {
  const { visible, closeModal, message, onRating } = props;
  const [showModal, setShowModal] = useState(visible);
  const [rating, setRating] = useState(0);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    setShowModal(visible);
  }, [visible]);

  const closeModalWindow = () => {
    setRating(0);
    setTimeout(() => closeModal(), 200);
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackground}>
        <Animated.View
          style={[styles.container, { transform: [{ scale: scaleValue }] }]}
        >
          <View style={styles.closeBtnCont}>
            <TouchableCmp onPress={() => {}}>
              <Ionicons name="close" size={25} color={Colors.danger} />
            </TouchableCmp>
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.heading}>RATTING</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.ratingContainer}>
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
                  size={40}
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
                  size={40}
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
                  size={40}
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
                  size={40}
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
                  size={40}
                  color={rating >= 5 ? "red" : "black"}
                />
              </TouchableCmp>
            </View>
            <View style={styles.actionsContainer}>
              <TextButton
                title="SUBMIT RATING"
                onPress={onRating.bind(this, rating)}
                style={styles.textBtn}
                titleStyle={{ ...styles.titleStyle, color: Colors.success }}
              />
              <TextButton
                title="CLOSE DIALOG"
                onPress={closeModalWindow}
                style={styles.textBtn}
                titleStyle={{ ...styles.titleStyle, color: Colors.danger }}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: 240,
    width: 350,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 20,
  },
  closeBtnCont: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  contentBox: {
    flex: 1,
    alignItems: "center",
  },
  heading: {
    alignSelf: "center",
    fontFamily: "open-sans-bold",
    fontSize: 16,
    color: "black",
  },
  message: {
    marginTop: 20,
    fontFamily: "open-sans",
    color: "black",
  },
  ratingContainer: {
    flex: 1,
    width: "100%",
    margin: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  actionsContainer: {
    flex: 1,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textBtn: {
    margin: null,
    flex: null,
    marginHorizontal: 5,
    width: 145,
  },
  titleStyle: {
    flex: null,
    margin: null,
    marginTop: 5,
    textTransform: "uppercase",
  },
});

export default RatingModal;
