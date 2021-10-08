import React, {
  useLayoutEffect,
  useState,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  Platform,
  Alert,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  CheckBox,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import Moment from "moment";

import Colors from "../../shared/constants/Colors";
import Styles from "../../shared/styles/styles";
import TextField from "../../shared/components/TextField";
import ProgressIndicator from "../../shared/UI/ProgressIndicator";
import DrawerHeaderLeft from "../../shared/components/DrawerHeaderLeft";
import RaisedButton from "../../shared/components/RaisedButton";
import SearchableDropdown from "../../shared/components/SearchableDropdown";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import DropdownSelect from "../../shared/components/DropdownSelect";
import ImageDocPicker from "../../shared/components/ImageDocPicker";
import * as fleetActions from "../../store/action/fleet";
import * as contractActions from "../../store/action/contract";
import {
  FORM_INPUT_UPDATE,
  RESET_FORM,
  formReducer,
} from "../../shared/Functions/FormReducer";

const window = Dimensions.get("window");

const initialFormState = {
  inputValues: {
    seleFrmLocn: "",
    seleToLocn: "",
    vehtype: "",
    loadWeight: "",
    weightype: "Ton",
    date: "",
    flexdate: false,
    distance: "",
    totalprice: "",
    loadtype: "",
    loadImage: "",
  },
  inputValidities: {
    seleFrmLocn: false,
    seleToLocn: false,
    vehtype: false,
    loadWeight: false,
    weightype: true,
    date: false,
    flexdate: true,
    distance: false,
    totalprice: false,
    loadtype: false,
    loadImage: false,
  },
  formIsValid: false,
};

const weightType = ["Ton", "KG"];

const UserTportScreen = (props) => {
  const [error, setError] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [vehTypes, setVehTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showDatePkr, setShowDatePkr] = useState(false);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [currentDateField, setDateField] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [currentPicker, setCurrentPicker] = useState();
  const [showImagePicker, setImagePicker] = useState(false);
  const [isMultiSelection, setIsMultiSelection] = useState(false);
  const [reset, setReset] = useState(false);
  const [isEstimated, setEstimated] = useState(false);
  const { navigation } = props;
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth);
  const [formState, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );
  const [isLoading, setIsLoading] = useState({
    state: false,
    msg: "Loading...",
  });
  const Icon = Ionicons;
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  useEffect(() => {
    getVehicleType();
    getLocations();
  }, []);

  useEffect(() => {
    inputChangeHandler("flexdate", isChecked, true);
  }, [isChecked]);

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const getLocations = async () => {
    setError(null);
    try {
      setIsLoading({ state: true, msg: "Getting Locations..." });
      const result = await dispatch(contractActions.getLocations("SD"));
      if (result.Result === "OK") {
        setLocations(result.Records);
      } else {
        setError(resData.Msg);
      }
      setIsLoading({ state: false, msg: "" });
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

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

  const inputChangeHandler = useCallback(
    (identifier, inputValue, inputValidity) => {
      setEstimated(false);
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

  const onCloseModal = useCallback(() => {
    setImagePicker(false);
  }, [showImagePicker]);

  const getEstimate = async () => {
    setIsSubmitted(true);
    const formData = formState.inputValues;
    const formValidity = formState.inputValidities;
    if (
      !formValidity.seleFrmLocn ||
      !formValidity.seleToLocn ||
      !formValidity.vehtype ||
      !formValidity.loadWeight ||
      !formValidity.date
    ) {
      Alert.alert("Wrong Input", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }

    const data = {
      fromLocn: formData.seleFrmLocn.id,
      toLocn: formData.seleToLocn.id,
      vehtype: formData.vehtype.id,
      loadWeight: formData.loadWeight,
      date: formData.date,
    };
    setError(null);
    setIsLoading({ state: true, msg: "Getting Estimate..." });
    try {
      const result = await dispatch(contractActions.getEstimate(data));
      if (result.Result === "OK") {
        inputChangeHandler("distance", result.distance, true);
        inputChangeHandler("totalprice", result.price, true);
        setEstimated(true);
        Alert.alert("Estimate", result.Msg, [{ text: "Okay" }]);
      } else {
        setError(result.Msg);
      }
      setIsLoading({ state: false, msg: "" });
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  const resetForm = () => {
    setEstimated(false);
    setIsSubmitted(false);
    setReset(!reset);
    setChecked(false);
    dispatchFormState({
      type: RESET_FORM,
      initialFormState: initialFormState,
    });
  };

  const addTPortContract = async () => {
    const formData = formState.inputValues;
    if (userData.docflag === "N") {
      Alert.alert("Error", "Please complete the user profile first.", [
        { text: "Okay" },
      ]);
      return;
    }
    if (!formState.formIsValid) {
      Alert.alert("Error", "Please get the estimate before saving contract.", [
        { text: "Okay" },
      ]);
      return;
    }
    if (!isEstimated) {
      Alert.alert(
        "Error",
        "Please get estimate if you have made any changes in form.",
        [{ text: "Okay" }]
      );
      return;
    }

    const data = {
      usrid: userData.tid,
      fromLocn: formData.seleFrmLocn.id,
      trnsfrm: formData.seleFrmLocn.no + ", " + formData.seleFrmLocn.txt,
      toLocn: formData.seleToLocn.id,
      trnsto: formData.seleToLocn.no + ", " + formData.seleToLocn.txt,
      loadWeight: formData.loadWeight,
      distance: formData.distance,
      date: formData.date,
      weightype: formData.weightype,
      contactnme: userData.usrnme,
      totalprice: formData.totalprice,
      loadtype: formData.loadtype,
      loadphoto: formData.loadImage,
      flexdate: formData.flexdate,
      vehtyp: formData.vehtype.text,
    };

    setError(null);
    setIsLoading({ state: true, msg: "Saving Contract..." });
    try {
      const result = await dispatch(contractActions.saveTPortContract(data));
      if (result.Result === "OK") {
        resetForm();
        Alert.alert("Contract", result.Msg, [{ text: "Okay" }]);
      } else {
        setError(result.Msg);
      }
      setIsLoading({ state: false, msg: "" });
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "TPORT CONTRACT",
      headerLeft: () => (
        <DrawerHeaderLeft
          titleIcon={
            <Image
              source={require("../../assets/images/tempo.png")}
              style={styles.image}
            />
          }
        />
      ),
    });
  }, [navigation]);

  return (
    <BackgroundImage>
      {isLoading.state && <ProgressIndicator msg={isLoading.msg} />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={styles.screen}
          pointerEvents={isLoading.state ? "none" : "auto"}
        >
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
              inputchangeHandler={inputChangeHandler}
              visible={showImagePicker}
              isMultiple={isMultiSelection}
              id={currentPicker}
              closeModal={onCloseModal}
            />
            <View style={styles.formContainer}>
              <Text style={styles.fleetFrmTtl}>Add TPort New Contract</Text>
              <SearchableDropdown
                labelStyle={Styles.label}
                labelContainerStyle={Styles.labelContainer}
                errorText="Please enter valid pickup location."
                itemList={locations}
                displayKey="value"
                onInputChange={inputChangeHandler}
                id="seleFrmLocn"
                initiallyValid={formState.inputValidities.seleFrmLocn}
                isSubmitted={isSubmitted}
                reset={reset}
                label={
                  <Text>
                    Pick Location<Text style={styles.required}>*</Text>
                  </Text>
                }
              />
              <SearchableDropdown
                labelStyle={Styles.label}
                labelContainerStyle={Styles.labelContainer}
                errorText="Please enter valid drop location."
                itemList={locations}
                displayKey="value"
                onInputChange={inputChangeHandler}
                id="seleToLocn"
                initiallyValid={formState.inputValidities.seleToLocn}
                isSubmitted={isSubmitted}
                reset={reset}
                label={
                  <Text>
                    Drop Location<Text style={styles.required}>*</Text>
                  </Text>
                }
              />
              <TextField
                labelStyle={Styles.label}
                labelContainerStyle={Styles.labelContainer}
                value={formState.inputValues.loadWeight}
                isSubmitted={isSubmitted}
                initiallyValid={formState.inputValidities.loadWeight}
                onInputChange={inputChangeHandler}
                errorText="Please enter valid weight."
                keyboardType="numeric"
                required
                id="loadWeight"
                label={
                  <Text>
                    Load Weight<Text style={styles.required}>*</Text>
                  </Text>
                }
              />
              <View style={styles.selContainer}>
                <DropdownSelect
                  labelStyle={Styles.label}
                  labelContainerStyle={Styles.labelContainer}
                  label="Select Unit"
                  defaultButtonText="Ton"
                  defaultValue={weightType[0]}
                  data={weightType}
                  reset={reset}
                  onSelect={(selectedItem, index) => {
                    inputChangeHandler("weightype", selectedItem, true);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                />
              </View>
              <View style={styles.selContainer}>
                <DropdownSelect
                  labelStyle={Styles.label}
                  labelContainerStyle={Styles.labelContainer}
                  reset={reset}
                  label={
                    <Text>
                      Vehicle Type<Text style={styles.required}>*</Text>
                    </Text>
                  }
                  data={vehTypes}
                  defaultButtonText="Select Vehicle Type*"
                  onSelect={(selectedItem, index) => {
                    inputChangeHandler("vehtype", selectedItem, true);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.text;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.text;
                  }}
                />
              </View>
              {!formState.inputValidities.vehtype && isSubmitted && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    Please select vehicle type
                  </Text>
                </View>
              )}
              <TextField
                labelStyle={Styles.label}
                labelContainerStyle={Styles.labelContainer}
                value={formState.inputValues.date}
                isSubmitted={isSubmitted}
                initiallyValid={formState.inputValidities.date}
                required
                id="date"
                placeholder="YYYY-MM-DD"
                onInputChange={inputChangeHandler}
                readonly={true}
                label={
                  <Text>
                    Transport Date<Text style={styles.required}>*</Text>
                  </Text>
                }
                style={{ width: "80%" }}
                trailingIcon={
                  <TouchableCmp
                    onPress={() => {
                      openDatePicker({
                        currentField: "date",
                        maxDate: new Date(),
                      });
                    }}
                  >
                    <Icon name="calendar-outline" size={25} color="black" />
                  </TouchableCmp>
                }
              />
              {!formState.inputValidities.date && isSubmitted && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    Please enter valid transport date.
                  </Text>
                </View>
              )}
              <View style={styles.checkboxSupContainer}>
                <View style={styles.checkboxContainer}>
                  <CheckBox value={isChecked} onValueChange={setChecked} />
                </View>
                <Text style={styles.msg}>Flexible Dates?</Text>
              </View>
              <TextField
                labelStyle={Styles.label}
                labelContainerStyle={Styles.labelContainer}
                value={formState.inputValues.loadtype}
                isSubmitted={isSubmitted}
                initiallyValid={formState.inputValidities.loadtype}
                onInputChange={inputChangeHandler}
                errorText="Please enter valid load type."
                required
                id="loadtype"
                label={
                  <Text>
                    Load Type<Text style={styles.required}>*</Text>
                  </Text>
                }
              />
              <RaisedButton
                style={{
                  ...styles.fileUploadBtn,
                  backgroundColor:
                    formState.inputValues.loadImage === ""
                      ? Colors.primary
                      : Colors.success,
                }}
                title="Upload Load Images"
                required={true}
                onPress={() => {
                  setCurrentPicker("loadImage");
                  setIsMultiSelection(true);
                  setImagePicker(true);
                }}
              />
              {!formState.inputValidities.loadImage && isSubmitted && (
                <Text style={styles.errorText}>Please upload load images.</Text>
              )}
              <View style={styles.estBtnContainer}>
                <RaisedButton
                  style={styles.getEstBtn}
                  title="Get Estimate"
                  onPress={getEstimate}
                />
                <RaisedButton
                  style={styles.rstEstBtn}
                  title="Reset"
                  onPress={resetForm}
                />
              </View>
            </View>
            <View style={styles.container}>
              <View style={styles.formContainer}>
                <Text style={styles.fleetFrmTtl}>
                  Your Searched Estimates are
                </Text>
                <View style={styles.estValueContainer}>
                  <Text style={styles.heading}>Distance :</Text>
                  <Text style={styles.value}>
                    {formState.inputValues.distance !== "" &&
                    formState.inputValues.distance !== null
                      ? formState.inputValues.distance + " Km"
                      : "Calculated Distance"}
                  </Text>
                </View>
                <View style={styles.estValueContainer}>
                  <Text style={styles.heading}>Approx Price is :</Text>
                  <Text style={styles.value}>
                    {formState.inputValues.totalprice !== "" &&
                    formState.inputValues.totalprice !== null
                      ? formState.inputValues.totalprice + " Rs"
                      : "Calculated Price"}
                  </Text>
                </View>
                <View style={styles.finalBtn}>
                  <RaisedButton
                    style={styles.getEstBtn}
                    title="ADD TPORT CONTRACT to GET QUOTES"
                    onPress={addTPortContract}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: 10,
  },
  formContainer: {
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
    fontSize: 16,
  },
  image: {
    resizeMode: "center",
    height: 35,
    width: 40,
  },
  selContainer: {
    width: window.width * 0.75,
    left: 15,
    alignSelf: "center",
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
  checkboxSupContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: 10,
  },
  checkboxContainer: {
    marginHorizontal: 10,
    alignSelf: "flex-start",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 20,
    width: 20,
  },

  fileUploadBtn: {
    paddingVertical: 5,
    marginVertical: 10,
    width: "60%",
  },
  msg: {
    fontFamily: "open-sans",
    color: "white",
  },
  estBtnContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
  },
  getEstBtn: {
    backgroundColor: Colors.success,
  },
  rstEstBtn: {
    backgroundColor: Colors.warning,
  },
  estValueContainer: {
    flex: 1,
    width: window.width * 0.9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 5,
  },
  heading: {
    fontSize: 16,
    fontFamily: "open-sans",
    color: "#fff",
  },
  value: {
    fontSize: 16,
    fontFamily: "open-sans",
    color: Colors.warning,
  },
  finalBtn: {
    flex: 1,
    marginVertical: 20,
  },
});

export default UserTportScreen;
