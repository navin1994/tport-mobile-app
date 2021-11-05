import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useReducer,
} from "react";
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
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import ScreenNames from "../constants/ScreenNames";
import Moment from "moment";

import TextField from "./TextField";
import DropdownSelect from "./DropdownSelect";
import RaisedButton from "./RaisedButton";
import Colors from "../constants/Colors";
import Styles from "../styles/styles";
import {
  formReducer,
  FORM_INPUT_UPDATE,
  RESET_FORM,
} from "../Functions/FormReducer";

const window = Dimensions.get("window");

const initialFormState = {
  inputValues: {
    infoid: "",
    type: "Front",
    tyre_make: "",
    tyre_no: "",
    changed_date: "",
    km_reading: "",
    remark: "",
  },
  inputValidities: {
    infoid: true,
    type: true,
    tyre_make: false,
    tyre_no: false,
    changed_date: false,
    km_reading: false,
    remark: true,
  },
  formIsValid: false,
};

const tyreType = ["Front", "Rear"];

const TyreFormDialog = (props) => {
  const {
    visible,
    closeModal,
    isSubmitted,
    saveTyre,
    updateTyre,
    isClearForm,
    isEdit,
    formData,
    screen,
  } = props;
  const [showModal, setShowModal] = useState(visible);
  const [showDatePkr, setShowDatePkr] = useState(false);
  const [currentDateField, setDateField] = useState("");
  const [reset, setReset] = useState(false);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
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
    if (isEdit) {
      inputChangeHandler("infoid", formData.infoid, true);
      inputChangeHandler("type", formData.type, true);
      inputChangeHandler("tyre_make", formData.tyre_make, true);
      inputChangeHandler("tyre_no", formData.tyre_no.toString(), true);
      inputChangeHandler("changed_date", formData.changed_date, true);
      inputChangeHandler("km_reading", formData.km_reading.toString(), true);
      inputChangeHandler("remark", formData.remark, true);
    }
  }, [isEdit]);

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

  useEffect(() => {
    clearForm();
  }, [isClearForm]);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePkr(false);
    setMinDate(null);
    setMaxDate(null);
    if (event.type === "dismissed") {
      setDateField("");
      return;
    }
    inputChangeHandler(
      currentDateField,
      Moment(selectedDate).format("YYYY-MM-DD"),
      true
    );
    setDateField("");
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

  const openDatePicker = (data) => {
    setShowDatePkr(true);
    setDateField(data.currentField);
    setMinDate(data.minDate);
    setMaxDate(data.maxDate);
  };

  const closeModalWindow = () => {
    setTimeout(() => closeModal(), 200);
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    clearForm();
  };

  const clearForm = () => {
    dispatchFormState({
      type: RESET_FORM,
      initialFormState: initialFormState,
    });
    setReset(!reset);
  };

  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackground}>
        {showDatePkr && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeDate}
            maximumDate={minDate}
            minimumDate={maxDate}
          />
        )}
        <Animated.View
          style={[styles.container, { transform: [{ scale: scaleValue }] }]}
        >
          <View style={styles.titleContainer}>
            <View style={styles.titlePos}>
              <Text style={styles.heading}>Add Tyre Details</Text>
            </View>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.contentBox}>
              <View style={styles.selContainer}>
                <DropdownSelect
                  labelContainerStyle={{ elevation: 1 }}
                  label={
                    <Text>
                      Select Type<Text style={styles.required}>*</Text>
                    </Text>
                  }
                  defaultButtonText={formState.inputValues.type}
                  defaultValue={formState.inputValues.type}
                  data={tyreType}
                  reset={reset}
                  onSelect={(selectedItem, index) => {
                    inputChangeHandler("type", selectedItem, true);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                />
              </View>
              {!formState.inputValidities.type && isSubmitted && (
                <View style={Styles.errorContainer}>
                  <Text style={Styles.errorText}>Please select tyre type</Text>
                </View>
              )}
              <TextField
                value={formState.inputValues.tyre_make}
                isSubmitted={isSubmitted}
                initiallyValid={formState.inputValidities.tyre_make}
                onInputChange={inputChangeHandler}
                errorText="Please enter valid tyre make."
                required
                id="tyre_make"
                label={
                  <Text>
                    Tyre make<Text style={styles.required}>*</Text>
                  </Text>
                }
              />
              <TextField
                value={formState.inputValues.tyre_no}
                isSubmitted={isSubmitted}
                initiallyValid={formState.inputValidities.tyre_no}
                id="tyre_no"
                required
                onInputChange={inputChangeHandler}
                errorText="Please enter valid tyre number."
                keyboardType="numeric"
                label={
                  <Text>
                    Tyre Number <Text style={styles.required}>*</Text>
                  </Text>
                }
              />
              <TextField
                value={formState.inputValues.changed_date}
                isSubmitted={isSubmitted}
                initiallyValid={formState.inputValidities.changed_date}
                required
                id="changed_date"
                placeholder="YYYY-MM-DD"
                onInputChange={inputChangeHandler}
                readonly={true}
                label={
                  <Text>
                    Tyre Change Date<Text style={styles.required}>*</Text>
                  </Text>
                }
                trailingIcon={
                  <TouchableCmp
                    onPress={() => {
                      openDatePicker({
                        currentField: "changed_date",
                        minDate: new Date(),
                      });
                    }}
                  >
                    <Ionicons name="calendar-outline" size={25} color="black" />
                  </TouchableCmp>
                }
              />
              {!formState.inputValidities.changed_date && isSubmitted && (
                <View style={Styles.errorContainer}>
                  <Text style={Styles.errorText}>
                    Please enter valid service date.
                  </Text>
                </View>
              )}
              <TextField
                value={formState.inputValues.km_reading}
                isSubmitted={isSubmitted}
                initiallyValid={formState.inputValidities.km_reading}
                id="km_reading"
                required
                onInputChange={inputChangeHandler}
                errorText="Please enter valid KM reading."
                keyboardType="numeric"
                label={
                  <Text>
                    KM Reading <Text style={styles.required}>*</Text>
                  </Text>
                }
              />
              <TextField
                style={{ height: 100 }}
                value={formState.inputValues.remark}
                isSubmitted={isSubmitted}
                multiline
                numberOfLines={4}
                initiallyValid={formState.inputValidities.remark}
                id="remark"
                onInputChange={inputChangeHandler}
                label="Remarks"
              />
            </View>
          </ScrollView>
          <View style={Styles.actionsContainer}>
            <View style={Styles.btnContainer}>
              {ScreenNames.TRANS_ADD_TYRE_SCREEN === screen && (
                <RaisedButton
                  title="SAVE DETAIL"
                  onPress={() => {
                    saveTyre(formState);
                  }}
                  style={{
                    flex: null,
                    height: 40,
                    backgroundColor: Colors.success,
                  }}
                />
              )}
              {ScreenNames.TRANS_TYRE_DTL_SCREEN === screen && (
                <RaisedButton
                  title="UPDATE TYRE"
                  onPress={() => {
                    updateTyre(formState, formData.vehid);
                  }}
                  style={{
                    flex: null,
                    height: 40,
                    backgroundColor: Colors.success,
                  }}
                />
              )}
              <RaisedButton
                title="CLOSE DIALOG"
                onPress={closeModalWindow}
                style={{
                  flex: null,
                  height: 40,
                  backgroundColor: Colors.danger,
                }}
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
    width: "90%",
    backgroundColor: "#FFF",
    paddingBottom: 40,
    borderRadius: 10,
    elevation: 20,
    overflow: "hidden",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  contentBox: {
    alignItems: "center",
    padding: 5,
  },
  titlePos: {
    paddingVertical: 5,
    paddingHorizontal: 50,
    backgroundColor: "grey",
  },
  heading: {
    alignSelf: "center",
    fontFamily: "open-sans-bold",
    fontSize: 16,
    color: "#FFF",
  },
  required: {
    color: "red",
  },
  selContainer: {
    width: "90%",
    left: 15,
    alignSelf: "center",
  },
});

export default TyreFormDialog;
