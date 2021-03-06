import React, { useState, useCallback, useEffect } from "react";
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
import { useDispatch } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import Moment from "moment";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import DropdownSelect from "./DropdownSelect";
import Colors from "../constants/Colors";
import TextField from "./TextField";
import RaisedButton from "./RaisedButton";
import ImageDocPicker from "./ImageDocPicker";
import Styles from "../styles/styles";
import * as fleetActions from "../../store/action/fleet";

const window = Dimensions.get("window");

const FleetForm = (props) => {
  const {
    setError,
    isFleetSubmit,
    reset,
    onSubmitFleetForm,
    vehFormState,
    vehInputChangeHandler,
  } = props;
  const dispatch = useDispatch();
  const [vehTypes, setVehTypes] = useState([]);
  const [currentPicker, setCurrentPicker] = useState();
  const [showImagePicker, setImagePicker] = useState(false);
  const [isMultiSelection, setIsMultiSelection] = useState(false);
  const [currentDateField, setDateField] = useState("");
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [showDatePkr, setShowDatePkr] = useState(false);
  const Icon = Ionicons;
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;

    useEffect(() => {
      getVehicleType();
    }, []);

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

    const onCloseModal = useCallback(() => {
      setImagePicker(false);
    }, [showImagePicker]);

    return (
      <View style={styles.FleetFormContainer}>
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
        <Text style={styles.fleetFrmTtl}>Add Fleet Details</Text>
        <DropdownSelect
          reset={reset}
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
          labelStyle={Styles.label}
          labelContainerStyle={Styles.labelContainer}
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
          labelStyle={Styles.label}
          labelContainerStyle={Styles.labelContainer}
          value={vehFormState.inputValues.vehregdte}
          isSubmitted={isFleetSubmit}
          initiallyValid={false}
          required
          id="vehregdte"
          placeholder="YYYY-MM-DD"
          onInputChange={vehInputChangeHandler}
          readonly={true}
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
          labelStyle={Styles.label}
          labelContainerStyle={Styles.labelContainer}
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
          labelStyle={Styles.label}
          labelContainerStyle={Styles.labelContainer}
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
          labelStyle={Styles.label}
          labelContainerStyle={Styles.labelContainer}
          value={vehFormState.inputValues.vehinsexpdte}
          isSubmitted={isFleetSubmit}
          initiallyValid={false}
          required
          placeholder="YYYY-MM-DD"
          id="vehinsexpdte"
          onInputChange={vehInputChangeHandler}
          readonly={true}
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
          labelStyle={Styles.label}
          labelContainerStyle={Styles.labelContainer}
          value={vehFormState.inputValues.vehfitcetexpdte}
          isSubmitted={isFleetSubmit}
          initiallyValid={false}
          required
          id="vehfitcetexpdte"
          placeholder="YYYY-MM-DD"
          onInputChange={vehInputChangeHandler}
          readonly={true}
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
          labelStyle={Styles.label}
          labelContainerStyle={Styles.labelContainer}
          value={vehFormState.inputValues.vehpucexpdte}
          isSubmitted={isFleetSubmit}
          initiallyValid={false}
          id="vehpucexpdte"
          placeholder="YYYY-MM-DD"
          onInputChange={vehInputChangeHandler}
          readonly={true}
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
    );
  }
};

const styles = StyleSheet.create({
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
});

export default FleetForm;
