import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Modal,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";

import Colors from "../constants/Colors";
import TextButton from "./TextButton";
import RaisedButton from "./RaisedButton";
import PreviewImageTray from "../UI/PreviewImageTray";

const window = Dimensions.get("window");

const ImageDocPicker = ({ visible, closeModal, isMultiple }) => {
  const [showModal, setShowModal] = useState(visible);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const [image, setImage] = useState(null);
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
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.optionContainer}>
              <TextButton
                style={styles.TextBtnStyle}
                title="Take A Picture"
                leadingIcon={
                  <Ionicons
                    name="camera-outline"
                    size={30}
                    color={Colors.primary}
                  />
                }
                onPress={() => {}}
              />
              <PreviewImageTray />
            </View>
            <View style={styles.optionContainer}>
              <TextButton
                style={styles.TextBtnStyle}
                title="Choose from Gallery"
                leadingIcon={
                  <Ionicons
                    name="image-outline"
                    size={30}
                    color={Colors.primary}
                  />
                }
                onPress={() => {}}
              />
              <PreviewImageTray />
            </View>
            <View style={styles.saveBtn}>
              <RaisedButton title="Save" onPress={() => {}} />
            </View>
          </ScrollView>
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
    maxHeight: window.height * 0.8,
    width: "80%",
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
  TextBtnStyle: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  saveBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    height: 50,
    width: 80,
  },
  optionContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  docsTray: {
    width: "100%",
  },
});

export default ImageDocPicker;
