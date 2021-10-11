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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import TextField from "./TextField";
import TextButton from "./TextButton";
import Colors from "../constants/Colors";

const window = Dimensions.get("window");

const InputConfirmDialog = (props) => {
  const {
    visible,
    closeModal,
    title,
    message,
    method,
    inputLabel,
    isSubmitted,
    confirmBtnText,
    errorText,
  } = props;
  const [cancelReason, setReason] = useState({ value: "", validity: false });
  const [showModal, setShowModal] = useState(visible);
  const scaleValue = useRef(new Animated.Value(0)).current;

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
    setTimeout(() => closeModal(), 200);
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setReason({ value: "", validity: false });
  };

  const inputChangeHandler = (id, value, validity) => {
    setReason({ value, validity });
  };

  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackground}>
        <Animated.View
          style={[styles.container, { transform: [{ scale: scaleValue }] }]}
        >
          <View style={styles.closeBtnCont}>
            <TouchableCmp onPress={closeModalWindow}>
              <Ionicons name="close" size={25} color={Colors.danger} />
            </TouchableCmp>
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.heading}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <TextField
              value={cancelReason.value}
              initiallyValid={cancelReason.validity}
              onInputChange={inputChangeHandler}
              label={inputLabel}
              style={{ width: "100%" }}
              required={true}
              isSubmitted={isSubmitted}
              errorText={errorText}
            />
            <View style={styles.actionsContainer}>
              <TextButton
                title={confirmBtnText}
                onPress={method.bind(this, cancelReason.value)}
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
    height: 280,
    width: "90%",
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
    padding: 5,
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

export default InputConfirmDialog;
