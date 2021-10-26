import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
} from "react";
import {
  Text,
  View,
  Modal,
  StyleSheet,
  Animated,
  Platform,
  Dimensions,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import DropdownSelect from "./DropdownSelect";
import TextField from "./TextField";
import TextButton from "./TextButton";
import Colors from "../constants/Colors";
import {
  FORM_INPUT_UPDATE,
  RESET_FORM,
  formReducer,
} from "../Functions/FormReducer";

const window = Dimensions.get("window");

const initialFormState = {
  inputValues: {
    driverName: "",
    vehicle: "",
  },
  inputValidities: {
    driverName: "",
    vehicle: "",
  },
  formIsValid: false,
};

const CnfContractOrChangeDriverDialog = (props) => {
  const { visible, closeModal, method, vehTypes, isSubmitted, reset } = props;
  const [showModal, setShowModal] = useState(visible);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const [formState, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );

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
    dispatchFormState({
      type: RESET_FORM,
      initialFormState: initialFormState,
    });
  };

  const inputChangeHandler = useCallback(
    (identifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: identifier,
      });
    },
    [dispatchFormState]
  );

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
            <Text style={styles.heading}>CONTRACT CONFIRMATION</Text>
            <Text style={styles.message}>
              Please enter below details to confirm contract.
            </Text>

            <TextField
              value={formState.inputValues.driverName}
              isSubmitted={isSubmitted}
              style={{ width: "100%" }}
              initiallyValid={formState.inputValidities.driverName}
              onInputChange={inputChangeHandler}
              label="Driver Name"
              errorText="Please enter valid driver name."
              required
              id="driverName"
            />
            <DropdownSelect
              reset={reset}
              data={vehTypes}
              dropdownBtnStyle={{ width: "100%" }}
              defaultButtonText="Select Vehicle Type"
              onSelect={(selectedItem, index) => {
                inputChangeHandler("vehicle", selectedItem, true);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.text;
              }}
              rowTextForSelection={(item, index) => {
                return item.text;
              }}
            />
            {!formState.inputValidities.vehicle && isSubmitted && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Please select vehicle type</Text>
              </View>
            )}

            <View style={styles.actionsContainer}>
              <TextButton
                title="SUBMIT"
                onPress={() => method(formState)}
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
    height: 360,
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
  errorText: {
    fontFamily: "open-sans",
    color: Colors.danger,
    fontSize: 13,
  },
  errorContainer: {
    flex: 1,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  selContainer: {
    width: window.width * 0.85,
    left: 15,
    alignSelf: "center",
  },
});

export default CnfContractOrChangeDriverDialog;
