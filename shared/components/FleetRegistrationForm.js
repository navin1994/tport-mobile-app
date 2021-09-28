import React, { useState, useCallback, useReducer, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import Moment from "moment";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import {
  formReducer,
  FORM_INPUT_UPDATE,
  RESET_FORM,
} from "../Functions/FormReducer";
import DropdownSelect from "./DropdownSelect";
import Colors from "../constants/Colors";
import TextField from "./TextField";
import RaisedButton from "./RaisedButton";
import ImageDocPicker from "./ImageDocPicker";
import * as transporterActions from "../../store/action/transporter";
import * as fleetActions from "../../store/action/fleet";

const window = Dimensions.get("window");

const vehInitFormState = {
  inputValues: {
    vtypid: "",
    vtypnm: "",
    vehno: "",
    vehregdte: "",
    vehinsexpdte: "",
    vehinsuno: "",
    vehchesino: "",
    vehphoto: [],
    vehregfle: "",
    vehinsurancedoc: "",
    vehfitcetexpdte: "",
    vehfitcetphoto: "",
    vehpucexpdte: "",
    vehpucphoto: "",
  },
  inputValidities: {
    vtypid: false,
    vtypnm: false,
    vehno: false,
    vehregdte: false,
    vehinsexpdte: false,
    vehinsuno: false,
    vehchesino: false,
    vehphoto: false,
    vehregfle: false,
    vehinsurancedoc: false,
    vehfitcetexpdte: false,
    vehfitcetphoto: false,
    vehpucexpdte: true,
    vehpucphoto: true,
  },
  formIsValid: false,
};

const FleetRegistrationForm = (props) => {
  const [isFleetSubmit, setIsFleetSubmit] = useState(false);
  const [vehTypes, setVehTypes] = useState([]);
  const [currentPicker, setCurrentPicker] = useState();
  const [showImagePicker, setImagePicker] = useState(false);
  const [isMultiSelection, setIsMultiSelection] = useState(false);
  const [currentDateField, setDateField] = useState("");
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [error, setError] = useState();
  const [showDatePkr, setShowDatePkr] = useState(false);
  const [vehFormState, dispatchVehFormState] = useReducer(
    formReducer,
    vehInitFormState
  );
  const formState = useSelector((state) => state.transp);
  const dispatch = useDispatch();
  const Icon = Ionicons;
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  useEffect(() => {
    getVehicleType();
  }, []);

  const inputChangeHandler = useCallback(
    (identifier, inputValue, inputValidity) => {
      dispatch(
        transporterActions.formInputUpdate(
          identifier,
          inputValue,
          inputValidity
        )
      );
    },
    [dispatch]
  );

  const getVehicleType = async () => {
    setError(null);
    try {
      const resData = await dispatch(fleetActions.getVehicleTypes());
      if (resData.Result === "ERR") {
        Alert.alert("Error", resData.Msg, [{ text: "Okay" }]);
        return;
      } else if (resData.Result === "OK") {
        setVehTypes(resData.Records);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const vehInputChangeHandler = useCallback(
    (identifier, inputValue, inputValidity) => {
      if (
        identifier === "vehpucexpdte" &&
        (vehInitFormState.inputValues.vehpucphoto === "" ||
          vehInitFormState.inputValues.vehpucphoto == null)
      ) {
        dispatchVehFormState({
          type: FORM_INPUT_UPDATE,
          value: "",
          isValid: false,
          input: "vehpucphoto",
        });
      }
      dispatchVehFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: identifier,
      });
    },
    [dispatchVehFormState]
  );

  const onChangeDate = (event, selectedDate) => {
    setShowDatePkr(false);
    setMinDate(null);
    setMaxDate(null);
    if (event.type === "dismissed") {
      setDateField("");
      return;
    }
    vehInputChangeHandler(
      currentDateField,
      Moment(selectedDate).format("YYYY-MM-DD"),
      true
    );
    setDateField("");
  };

  const openDatePicker = (data) => {
    setShowDatePkr(true);
    setDateField(data.currentField);
    setMinDate(data.minDate);
    setMaxDate(data.maxDate);
  };

  const onSubmitFleetForm = () => {
    setIsFleetSubmit(true);
    if (!vehFormState.formIsValid) {
      Alert.alert("Wrong Input", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    dispatch(fleetActions.addFleet(vehFormState.inputValues));
    dispatchVehFormState({
      type: RESET_FORM,
      initialFormState: vehInitFormState,
    });
    inputChangeHandler(
      "vehclst",
      [...formState.inputValues.vehclst, vehFormState.inputValues],
      true
    );
    setIsFleetSubmit(false);
  };

  const onBack = () => {
    const { back } = props;
    back();
  };

  const onNext = () => {
    const { next } = props;
    next();
  };

  const onCloseModal = useCallback(() => {
    setImagePicker(false);
  }, [showImagePicker]);

  return (
    <View style={styles.container}>
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
      <ImageDocPicker
        inputchangeHandler={vehInputChangeHandler}
        visible={showImagePicker}
        isMultiple={isMultiSelection}
        id={currentPicker}
        closeModal={onCloseModal}
      />
      <View style={styles.FleetFormContainer}>
        <Text style={styles.fleetFrmTtl}>Add Fleet Details</Text>
        <DropdownSelect
          data={vehTypes}
          defaultButtonText="Select Vehicle Type*"
          onSelect={(selectedItem, index) => {
            vehInputChangeHandler("vtypid", selectedItem.id, true);
            vehInputChangeHandler("vtypnm", selectedItem.text, true);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem.text;
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item.text;
          }}
        />
        {!vehFormState.inputValidities.vtypnm && isFleetSubmit && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Please select vehicle type</Text>
          </View>
        )}
        <TextField
          value={vehFormState.inputValues.vehno}
          isSubmitted={isFleetSubmit}
          initiallyValid={false}
          required
          id="vehno"
          onInputChange={vehInputChangeHandler}
          errorText="Please enter valid vehicle number."
          label={
            <Text>
              Vehicle Number<Text style={styles.required}>*</Text>
            </Text>
          }
          style={{ width: "90%" }}
        />
        <RaisedButton
          style={{
            ...styles.fileUploadBtn,
            backgroundColor:
              vehFormState.inputValues.vehphoto.length === 0
                ? Colors.primary
                : Colors.success,
          }}
          title="Vehicle Photos"
          onPress={() => {
            setCurrentPicker("vehphoto");
            setIsMultiSelection(true);
            setImagePicker(true);
          }}
        />
        {!vehFormState.inputValidities.vehphoto && isFleetSubmit && (
          <Text style={styles.errorText}>Please upload vehicle photos</Text>
        )}
        <TextField
          value={vehFormState.inputValues.vehregdte}
          isSubmitted={isFleetSubmit}
          initiallyValid={false}
          required
          id="vehregdte"
          placeholder="YYYY-MM-DD"
          onInputChange={vehInputChangeHandler}
          editable={false}
          label={
            <Text>
              Registration Date<Text style={styles.required}>*</Text>
            </Text>
          }
          style={{ width: "90%" }}
          trailingIcon={
            <TouchableCmp
              onPress={() => {
                openDatePicker({
                  currentField: "vehregdte",
                  minDate: new Date(),
                });
              }}
            >
              <Icon name="calendar-outline" size={25} color="black" />
            </TouchableCmp>
          }
        />
        {!vehFormState.inputValidities.vehregdte && isFleetSubmit && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Please enter valid registration date.
            </Text>
          </View>
        )}

        <RaisedButton
          style={{
            ...styles.fileUploadBtn,
            backgroundColor:
              vehFormState.inputValues.vehregfle === ""
                ? Colors.primary
                : Colors.success,
          }}
          title="Registration Doc"
          onPress={() => {
            setCurrentPicker("vehregfle");
            setIsMultiSelection(false);
            setImagePicker(true);
          }}
        />
        {!vehFormState.inputValidities.vehregfle && isFleetSubmit && (
          <Text style={styles.errorText}>
            Please upload vehicle registration documents
          </Text>
        )}
        <TextField
          value={vehFormState.inputValues.vehchesino}
          isSubmitted={isFleetSubmit}
          initiallyValid={false}
          required
          id="vehchesino"
          onInputChange={vehInputChangeHandler}
          errorText="Please enter valid chesis number."
          label={
            <Text>
              Chesis Number<Text style={styles.required}>*</Text>
            </Text>
          }
          style={{ width: "90%" }}
        />
        <TextField
          value={vehFormState.inputValues.vehinsuno}
          isSubmitted={isFleetSubmit}
          initiallyValid={false}
          required
          id="vehinsuno"
          onInputChange={vehInputChangeHandler}
          errorText="Please enter valid insurance number."
          label={
            <Text>
              Insurance Number<Text style={styles.required}>*</Text>
            </Text>
          }
          style={{ width: "90%" }}
        />
        <TextField
          value={vehFormState.inputValues.vehinsexpdte}
          isSubmitted={isFleetSubmit}
          initiallyValid={false}
          required
          placeholder="YYYY-MM-DD"
          id="vehinsexpdte"
          onInputChange={vehInputChangeHandler}
          editable={false}
          label={
            <Text>
              Insurance Expiry Date
              <Text style={styles.required}>*</Text>
            </Text>
          }
          style={{ width: "90%" }}
          trailingIcon={
            <TouchableCmp
              onPress={() => {
                openDatePicker({
                  currentField: "vehinsexpdte",
                  maxDate: new Date(),
                  get minDate() {
                    const nextDate = new Date();
                    nextDate.setDate(nextDate.getDate() + 730);
                    return nextDate;
                  },
                });
              }}
            >
              <Icon name="calendar-outline" size={25} color="black" />
            </TouchableCmp>
          }
        />
        {!vehFormState.inputValidities.vehinsexpdte && isFleetSubmit && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Please enter valid insurance expiry date.
            </Text>
          </View>
        )}
        <RaisedButton
          style={{
            ...styles.fileUploadBtn,
            backgroundColor:
              vehFormState.inputValues.vehinsurancedoc === ""
                ? Colors.primary
                : Colors.success,
          }}
          title="Insurance Doc"
          onPress={() => {
            setCurrentPicker("vehinsurancedoc");
            setIsMultiSelection(false);
            setImagePicker(true);
          }}
        />
        {!vehFormState.inputValidities.vehinsurancedoc && isFleetSubmit && (
          <Text style={styles.errorText}>
            Please upload vehicle insurance documents
          </Text>
        )}
        <TextField
          value={vehFormState.inputValues.vehfitcetexpdte}
          isSubmitted={isFleetSubmit}
          initiallyValid={false}
          required
          id="vehfitcetexpdte"
          placeholder="YYYY-MM-DD"
          onInputChange={vehInputChangeHandler}
          editable={false}
          label={
            <Text>
              Fitness Certificate Expiry Date
              <Text style={styles.required}>*</Text>
            </Text>
          }
          style={{ width: "90%" }}
          trailingIcon={
            <TouchableCmp
              onPress={() => {
                openDatePicker({
                  currentField: "vehfitcetexpdte",
                  maxDate: new Date(),
                });
              }}
            >
              <Icon name="calendar-outline" size={25} color="black" />
            </TouchableCmp>
          }
        />
        {!vehFormState.inputValidities.vehfitcetexpdte && isFleetSubmit && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Please enter valid fitness certificate date.
            </Text>
          </View>
        )}
        <RaisedButton
          style={{
            ...styles.fileUploadBtn,
            backgroundColor:
              vehFormState.inputValues.vehfitcetphoto === ""
                ? Colors.primary
                : Colors.success,
          }}
          title="Fitness Doc"
          onPress={() => {
            setCurrentPicker("vehfitcetphoto");
            setIsMultiSelection(false);
            setImagePicker(true);
          }}
        />
        {!vehFormState.inputValidities.vehfitcetphoto && isFleetSubmit && (
          <Text style={styles.errorText}>
            Please upload vehicle fitness documents
          </Text>
        )}
        <TextField
          value={vehFormState.inputValues.vehpucexpdte}
          isSubmitted={isFleetSubmit}
          initiallyValid={false}
          id="vehpucexpdte"
          placeholder="YYYY-MM-DD"
          onInputChange={vehInputChangeHandler}
          editable={false}
          label="PUC Expiry Date"
          style={{ width: "90%" }}
          trailingIcon={
            <TouchableCmp
              onPress={() => {
                openDatePicker({
                  currentField: "vehpucexpdte",
                  maxDate: new Date(),
                });
              }}
            >
              <Icon name="calendar-outline" size={25} color="black" />
            </TouchableCmp>
          }
        />
        {!vehFormState.inputValidities.vehpucexpdte && isFleetSubmit && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Please enter valid PUC expiry date.
            </Text>
          </View>
        )}
        <RaisedButton
          style={{
            ...styles.fileUploadBtn,
            backgroundColor:
              vehFormState.inputValues.vehpucphoto === ""
                ? Colors.primary
                : Colors.success,
          }}
          title="PUC Doc"
          onPress={() => {
            setCurrentPicker("vehpucphoto");
            setIsMultiSelection(false);
            setImagePicker(true);
          }}
        />
        {!vehFormState.inputValidities.vehpucphoto && isFleetSubmit && (
          <Text style={styles.errorText}>
            Please upload vehicle PUC documents
          </Text>
        )}
        <RaisedButton
          style={styles.addFleetBtn}
          title="Add Fleet"
          onPress={onSubmitFleetForm}
          leadingIcon={
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={25}
              color="#fff"
            />
          }
        />
      </View>

      <View style={styles.navConainer}>
        <RaisedButton title="Prev" style={styles.navBtn} onPress={onBack} />
        <RaisedButton title="Next" style={styles.navBtn} onPress={onNext} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  FleetFormContainer: {
    alignItems: "center",
    width: window.width * 0.9,
    backgroundColor: Colors.semiTransparentBlack,
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 8,
    padding: 10,
  },
  fleetFrmTtl: {
    color: "#fff",
    fontFamily: "open-sans-bold",
    textAlign: "center",
    fontSize: 20,
  },
  addFleetBtn: {
    paddingVertical: 5,
    marginVertical: 10,
    width: "40%",
    marginBottom: 0,
    backgroundColor: "#343A40",
  },
  required: {
    color: "red",
  },
  errorText: {
    fontFamily: "open-sans",
    color: Colors.danger,
    fontSize: 13,
  },
  errorContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "80%",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  fileUploadBtn: {
    paddingVertical: 5,
    marginVertical: 10,
    width: "60%",
  },
  navConainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  navBtn: {
    backgroundColor: Colors.success,
    width: 150,
  },
});

export default FleetRegistrationForm;
