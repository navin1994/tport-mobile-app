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
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

import Colors from "../constants/Colors";
import TextButton from "./TextButton";
import RaisedButton from "./RaisedButton";
import PreviewImageTray from "../UI/PreviewImageTray";

const window = Dimensions.get("window");
const CAMERA = "CAMERA";
const IMAGE = "IMAGE";

const ImageDocPicker = (props) => {
  const {
    visible,
    closeModal,
    isMultiple,
    id,
    formNumber,
    inputchangeHandler,
    vehInputChangeHandler,
  } = props;
  const [showModal, setShowModal] = useState(visible);
  const scaleValue = useRef(new Animated.Value(0)).current;
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert(
            "Sorry, we need camera roll permissions to make image picker work!"
          );
        }
        const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraPerm.status !== "granted") {
          alert("Sorry, we need camera permissions to make image picker work!");
        }
      }
    })();
  }, []);

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

  const pickImage = async (pickerType) => {
    let result;
    if (pickerType === IMAGE) {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
      });
    }

    if (pickerType === CAMERA) {
      result = await ImagePicker.launchCameraAsync();
    }

    console.log(result);
    if (!result.cancelled) {
      if (formNumber === 1) {
        inputchangeHandler(id, result.uri, true);
      }
      if (formNumber === 2) {
        vehInputChangeHandler(id, result.uri, true);
      }
      closeModalWindow();
    } else {
      if (formNumber === 1) {
        inputchangeHandler(id, "", false);
      }
      if (formNumber === 2) {
        vehInputChangeHandler(id, "", false);
      }
    }
  };

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
                onPress={() => {
                  pickImage(CAMERA);
                }}
              />
              {isMultiple && <PreviewImageTray />}
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
                onPress={() => {
                  pickImage(IMAGE);
                }}
              />
              {isMultiple && <PreviewImageTray />}
            </View>
            {/* <View style={styles.saveBtn}>
              <RaisedButton title="Save" onPress={() => {}} />
            </View> */}
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
