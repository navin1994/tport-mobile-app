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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";

import Colors from "../constants/Colors";
import TextButton from "./TextButton";
import RaisedButton from "./RaisedButton";
import PreviewImageTray from "../UI/PreviewImageTray";

const window = Dimensions.get("window");
const CAMERA = "CAMERA";
const IMAGE = "IMAGE";
const DOCUMENT = "DOCUMENT";

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
  const [imageList, updateImageList] = useState([]);
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

  const getFileInfo = async (fileUri) => {
    let fileInfo = await FileSystem.getInfoAsync(fileUri);
    return fileInfo;
  };

  const fileCompressor = async (fileInfo) => {
    if (fileInfo.size <= 1000000) {
      const fileComp = await ImageManipulator.manipulateAsync(
        fileInfo.uri,
        [],
        { base64: true }
      );
      const extension = fileComp.uri.substring(
        fileComp.uri.lastIndexOf(".") + 1
      );
      const prepend = "data:image/" + extension + ";base64,";
      fileComp.base64 = prepend + fileComp.base64;
      return fileComp;
    }

    const fileComp = await ImageManipulator.manipulateAsync(fileInfo.uri, [], {
      compress: 0.1,
    });
    const modifiedFile = await getFileInfo(fileComp.uri);
    return await fileCompressor(modifiedFile);
  };

  const picker = async (pickerType) => {
    let result;
    let compressedFile = "";
    if (pickerType === IMAGE) {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
    }

    if (pickerType === CAMERA) {
      result = await ImagePicker.launchCameraAsync();
    }

    if (pickerType === DOCUMENT) {
      result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        // multiple: true, // Works in web only
        // copyToCacheDirectory: true,
        copyToCacheDirectory: true,
      });
    }

    if (result.type === "success") {
      if (result.size > 1000000) {
        Alert.alert("Error", "Upload PDF file size should be less than 1 MB.", [
          { text: "Okay" },
        ]);
        return;
      }
      console.log(result);
      compressedFile = await FileSystem.readAsStringAsync(result.uri, {
        encoding: FileSystem.EncodingTypes.Base64,
      });
    }

    if (result.cancelled === false) {
      const fileData = await getFileInfo(result.uri);
      compressedFile = await fileCompressor(fileData);
      if (isMultiple) {
        updateImageList([
          ...imageList,
          {
            id: Math.random(),
            imgUri: compressedFile.uri,
            base64: compressedFile.base64,
          },
        ]);
        return;
      }
    }
    updateControls(compressedFile.base64);
  };

  const closeModalWindow = () => {
    setTimeout(() => closeModal(), 200);
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    updateImageList([]);
  };

  const onSaveImages = async () => {
    let conBase64Data = [];
    if (imageList.length !== 0) {
      conBase64Data = await Promise.all(
        imageList.map((img) => {
          return img.base64;
        })
      );
    }
    if (conBase64Data !== []) {
      updateControls(conBase64Data);
    } else {
      updateControls([]);
    }
    closeModalWindow();
  };

  const updateControls = (fileData) => {
    if (fileData !== "" && fileData.length !== 0) {
      if (formNumber === 1) {
        inputchangeHandler(id, fileData, true);
      }
      if (formNumber === 2) {
        vehInputChangeHandler(id, fileData, true);
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
  const onRemoveImage = (imgId) => {
    const updatedImageList = imageList.filter((item) => item.id !== imgId);
    updateImageList(updatedImageList);
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
                  picker(CAMERA);
                }}
              />
            </View>
            <View style={styles.optionContainer}>
              <TextButton
                style={styles.TextBtnStyle}
                title="Choose from Image Gallery"
                leadingIcon={
                  <Ionicons
                    name="image-outline"
                    size={30}
                    color={Colors.primary}
                  />
                }
                onPress={() => {
                  picker(IMAGE);
                }}
              />
            </View>
            {/* <View style={styles.optionContainer}>
              <TextButton
                style={styles.TextBtnStyle}
                title="Choose document"
                leadingIcon={
                  <Ionicons
                    name="document-text-outline"
                    size={30}
                    color={Colors.primary}
                  />
                }
                onPress={() => {
                  picker(DOCUMENT);
                }}
              />
            </View> */}
            <View
              style={{
                display: isMultiple && imageList.length != 0 ? "flex" : "none",
              }}
            >
              <PreviewImageTray
                images={imageList}
                onRemoveImg={onRemoveImage}
              />
            </View>

            <View
              style={{
                ...styles.saveBtn,
                display: isMultiple ? "flex" : "none",
              }}
            >
              <RaisedButton title="Save" onPress={onSaveImages} />
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
