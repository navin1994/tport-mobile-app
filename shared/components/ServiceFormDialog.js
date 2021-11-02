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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Moment from "moment";

import TextField from "./TextField";
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
    sts: "S",
    vehid: "",
    service_date: "",
    km_run: "",
    remark: "",
  },
  inputValidities: {
    sts: true,
    vehid: true,
    service_date: false,
    km_run: false,
    remark: true,
  },
  formIsValid: false,
};
const ServiceFormDialog = (props) => {
  const { visible, closeModal, isSubmitted, saveService } = props;
  const [showModal, setShowModal] = useState(visible);
  const [showDatePkr, setShowDatePkr] = useState(false);
  const [currentDateField, setDateField] = useState("");
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
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    setShowModal(visible);
  }, [visible]);

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
    dispatchFormState({
      type: RESET_FORM,
      initialFormState: initialFormState,
    });
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
              <Text style={styles.heading}>Add Service Details</Text>
            </View>
          </View>
          <View style={styles.contentBox}>
            <TextField
              value={formState.inputValues.km_run}
              isSubmitted={isSubmitted}
              initiallyValid={formState.inputValidities.km_run}
              id="km_run"
              required
              onInputChange={inputChangeHandler}
              errorText="Please enter valid KM run."
              keyboardType="numeric"
              label={
                <Text>
                  KM Run<Text style={styles.required}>*</Text>
                </Text>
              }
            />
            <TextField
              value={formState.inputValues.service_date}
              isSubmitted={isSubmitted}
              initiallyValid={formState.inputValidities.service_date}
              required
              id="service_date"
              placeholder="YYYY-MM-DD"
              onInputChange={inputChangeHandler}
              readonly={true}
              label={
                <Text>
                  Service Date<Text style={styles.required}>*</Text>
                </Text>
              }
              trailingIcon={
                <TouchableCmp
                  onPress={() => {
                    openDatePicker({
                      currentField: "service_date",
                      minDate: new Date(),
                    });
                  }}
                >
                  <Ionicons name="calendar-outline" size={25} color="black" />
                </TouchableCmp>
              }
            />
            {!formState.inputValidities.service_date && isSubmitted && (
              <View style={Styles.errorContainer}>
                <Text style={Styles.errorText}>
                  Please enter valid service date.
                </Text>
              </View>
            )}
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
          <View style={Styles.actionsContainer}>
            <View style={Styles.btnContainer}>
              <RaisedButton
                title="SAVE SERVICE"
                onPress={saveService.bind(this, formState)}
                style={{
                  flex: null,
                  height: 40,
                  backgroundColor: Colors.success,
                }}
              />
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
});

export default ServiceFormDialog;
