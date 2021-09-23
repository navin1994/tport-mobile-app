import React, {
  useState,
  useLayoutEffect,
  useCallback,
  useReducer,
  useEffect,
} from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
  FlatList,
  LogBox,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import Moment from "moment";

import DropdownSelect from "../../shared/components/DropdownSelect";
import SwitchTab from "../../shared/UI/SwitchTab";
import Colors from "../../shared/constants/Colors";
import HeaderLeft from "../../shared/components/HeaderLeft";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import TextField from "../../shared/components/TextField";
import RaisedButton from "../../shared/components/RaisedButton";
import VehicleDetailsTile from "../../shared/UI/VehicleDetailsTile";
import TAndCContainer from "../../shared/UI/TAndCContainer";
import ImageDocPicker from "../../shared/components/ImageDocPicker";
import * as authActions from "../../store/action/auth";
import * as fleetActions from "../../store/action/fleet";
import ProgressIndicator from "../../shared/UI/ProgressIndicator";

import {
  formReducer,
  FORM_INPUT_UPDATE,
  RESET_FORM,
} from "../../shared/Functions/FormReducer";
import {
  userIdValidator,
  userIdValObj,
} from "../../shared/Functions/Validators";

const window = Dimensions.get("window");

const initialFormState = {
  inputValues: {
    seq: 1,
    ownrnme: "",
    ownrmobile: "",
    ownremail: "",
    ownraddr: "",
    ownrpincd: "",
    ownrpandoc: "",
    ownridno: "",
    ownrpanno: "",
    ownradhardoc: "",
    loginid: "",
    password: "",
    cnfpassword: "",
    companyname: "",
    companyregno: "",
    comapnypanno: "",
    compincode: "", // not in UI
    companyaddress: "",
    companygstno: "",
    companyregdoc: "",
    companypandoc: "",
    companygstdoc: "",
    evgstnid: "",
    vehclst: [],
  },
  inputValidities: {
    seq: true,
    ownrnme: false,
    ownrmobile: false,
    ownremail: false,
    ownraddr: false,
    ownrpincd: false,
    ownrpandoc: false,
    ownridno: false,
    ownrpanno: false,
    ownradhardoc: false,
    loginid: false,
    password: false,
    cnfpassword: false,
    companyname: true,
    companyregno: true,
    comapnypanno: true,
    compincode: true, // not in UI
    companyaddress: true,
    companygstno: true,
    companyregdoc: true,
    companypandoc: true,
    companygstdoc: true,
    evgstnid: true,
    vehclst: false,
  },
  formIsValid: false,
};

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

const TransporterRegistrationScreen = (props) => {
  const [showImagePicker, setImagePicker] = useState(false);
  const [isMultiSelection, setIsMultiSelection] = useState(false);
  const [dateValue, setDateValue] = useState(new Date());
  const [currentDateField, setDateField] = useState("");
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [showDatePkr, setShowDatePkr] = useState(false);
  const [formType, setFormType] = useState(1);
  const [isSubLoader, setIsSubLoader] = useState(false);
  const [error, setError] = useState();
  const [isChecked, setChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFleetSubmit, setIsFleetSubmit] = useState(false);
  const [cnfPwdCheck, setCnfPwdCheck] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserIdValid, setIsUserIdValid] = useState(userIdValObj);
  const [vehTypes, setVehTypes] = useState([]);
  const [currentPicker, setCurrentPicker] = useState();
  const [formNo, setFormNo] = useState(1);
  const dispatch = useDispatch();
  let TouchableCmp = TouchableOpacity;
  const Icon = Ionicons;
  const { navigation } = props;
  const [formState, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );
  const [vehFormState, dispatchVehFormState] = useReducer(
    formReducer,
    vehInitFormState
  );
  const addedFleets = useSelector((state) => {
    const transformedItems = [];
    for (const key in state.fleets.fleets) {
      transformedItems.push({
        vtypid: state.fleets.fleets[key].vtypid,
        vehphoto: state.fleets.fleets[key].vehphoto,
        vehregfle: state.fleets.fleets[key].vehregfle,
        vehinsurancedoc: state.fleets.fleets[key].vehinsurancedoc,
        vehfitcetexpdte: state.fleets.fleets[key].vehfitcetexpdte,
        vehfitcetphoto: state.fleets.fleets[key].vehfitcetphoto,
        vehpucexpdte: state.fleets.fleets[key].vehpucexpdte,
        vehpucphoto: state.fleets.fleets[key].vehpucphoto,
        vehno: state.fleets.fleets[key].vehno,
        vtypnm: state.fleets.fleets[key].vtypnm,
        vehregdte: state.fleets.fleets[key].vehregdte,
        vehchesino: state.fleets.fleets[key].vehchesino,
        vehinsuno: state.fleets.fleets[key].vehinsuno,
        vehinsexpdte: state.fleets.fleets[key].vehinsexpdte,
      });
    }
    return transformedItems;
  });

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const getVehicleType = async () => {
    setError(null);
    try {
      const resData = await dispatch(authActions.getVehicleTypes());
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

  useEffect(() => {
    getVehicleType();
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const onCloseModal = useCallback(() => {
    setImagePicker(false);
  }, [showImagePicker]);

  const formTypeHandler = (formNumber) => {
    const formData = formState.inputValues;
    setFormType(formNumber);
    if (formNumber === 1) {
      inputChangeHandler("companyname", formData.companyname, true);
      inputChangeHandler("companyregno", formData.companyregno, true);
      inputChangeHandler("comapnypanno", formData.comapnypanno, true);
      inputChangeHandler("companyaddress", formData.companyaddress, true);
      inputChangeHandler("companygstno", formData.companygstno, true);
      inputChangeHandler("companyregdoc", formData.companyregdoc, true);
      inputChangeHandler("companypandoc", formData.companypandoc, true);
      inputChangeHandler("companygstdoc", formData.companygstdoc, true);
      inputChangeHandler("evgstnid", formData.evgstnid, true);
    }
    if (formNumber === 2) {
      if (formData.companyregdoc === "" || formData.companyregdoc == null) {
        inputChangeHandler("companyregdoc", formData.companyregdoc, false);
      }
      if (formData.companypandoc === "" || formData.companypandoc == null) {
        inputChangeHandler("companypandoc", formData.companypandoc, false);
      }
      if (formData.companygstdoc === "" || formData.companygstdoc == null) {
        inputChangeHandler("companygstdoc", formData.companygstdoc, false);
      }
    }
  };

  const checkUserIdHandler = async () => {
    setError(null);
    try {
      setIsLoading(true);
      const result = await userIdValidator(
        formState.inputValues.loginid,
        dispatch
      );
      setIsLoading(false);
      setIsUserIdValid(result);
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  const confirmPasswordHandler = () => {
    const formvalues = formState.inputValues;
    if (formvalues.password === formvalues.cnfpassword) {
      setCnfPwdCheck(true);
      return;
    }
    setCnfPwdCheck(false);
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeft
          navigation={navigation}
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

  const onSubmitRegistrationForm = async () => {
    formTypeHandler(formType);
    setIsSubmitted(true);

    if (!formState.formIsValid || !isUserIdValid.avlFlag || !cnfPwdCheck) {
      Alert.alert("Wrong Input", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    if (!isChecked) {
      Alert.alert("Error", "Please accept the terms and conditions.", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null);
    setIsSubLoader(true);
    try {
      const resData = await dispatch(
        authActions.transporterRegistration(formState.inputValues)
      );
      dispatch(fleetActions.resetFleet());
      setIsSubLoader(false);
      setChecked(false);
      setIsSubmitted(false);
      setIsUserIdValid(userIdValObj);
      dispatchFormState({
        type: RESET_FORM,
        initialFormState: initialFormState,
      });
      // navigation.goBack();
      Alert.alert("Registration", resData.Msg, [{ text: "Okay" }]);
      setIsSubLoader(false);
      setIsSubmitted(false);
    } catch (err) {
      setIsSubLoader(false);
      setError(err.message);
    }
  };

  const onSubmitFleetForm = () => {
    setIsFleetSubmit(true);
    if (!vehFormState.formIsValid) {
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

  return (
    <BackgroundImage>
      {isSubLoader && <ProgressIndicator msg="Registering Transporter" />}
      <View pointerEvents={isSubLoader ? "none" : "auto"}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.screen}>
            <View style={styles.container}>
              <SwitchTab onFormChange={formTypeHandler} formType={formType} />
              {showDatePkr && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dateValue}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeDate}
                  maximumDate={minDate}
                  minimumDate={maxDate}
                />
              )}
              <ImageDocPicker
                formNumber={formNo}
                inputchangeHandler={inputChangeHandler}
                vehInputChangeHandler={vehInputChangeHandler}
                visible={showImagePicker}
                isMultiple={isMultiSelection}
                id={currentPicker}
                closeModal={onCloseModal}
              />
              <View
                style={{
                  ...styles.separator,
                  display: formType === 1 ? "none" : "flex",
                }}
              ></View>
              <TextField
                formType={formType}
                style={{ display: formType === 1 ? "none" : "flex" }}
                value={formState.inputValues.companyname}
                isSubmitted={isSubmitted}
                initiallyValid={false}
                id="companyname"
                required
                onInputChange={inputChangeHandler}
                label={
                  <Text>
                    Company Name
                    <Text style={styles.required}>*</Text>
                  </Text>
                }
                leadingIcon={
                  <FontAwesome name="building-o" size={25} color="black" />
                }
              />
              {!formState.inputValidities.companyname &&
                isSubmitted &&
                formType === 2 && (
                  <View
                    style={{
                      ...styles.errorContainer,
                      display: formType === 1 ? "none" : "flex",
                    }}
                  >
                    <Text style={styles.errorText}>
                      Please enter valid company name.
                    </Text>
                  </View>
                )}
              <TextField
                formType={formType}
                style={{ display: formType === 1 ? "none" : "flex" }}
                value={formState.inputValues.companyregno}
                isSubmitted={isSubmitted}
                initiallyValid={false}
                id="companyregno"
                required
                onInputChange={inputChangeHandler}
                label={
                  <Text>
                    Registration Number
                    <Text style={styles.required}>*</Text>
                  </Text>
                }
                leadingIcon={
                  <MaterialIcons
                    name="app-registration"
                    size={25}
                    color="black"
                  />
                }
              />
              {!formState.inputValidities.companyregno &&
                isSubmitted &&
                formType === 2 && (
                  <View
                    style={{
                      ...styles.errorContainer,
                      display: formType === 1 ? "none" : "flex",
                    }}
                  >
                    <Text style={styles.errorText}>
                      Please enter valid registration number.
                    </Text>
                  </View>
                )}
              <RaisedButton
                style={{
                  ...styles.fileUploadBtn,
                  display: formType === 1 ? "none" : "flex",
                  backgroundColor:
                    formState.inputValues.companyregdoc === ""
                      ? Colors.primary
                      : Colors.success,
                }}
                title="Registration Doc"
                onPress={() => {
                  setFormNo(1);
                  setCurrentPicker("companyregdoc");
                  setIsMultiSelection(false);
                  setImagePicker(true);
                }}
              />
              {!formState.inputValidities.companyregdoc &&
                isSubmitted &&
                formType === 2 && (
                  <Text style={styles.errorText}>
                    Please upload registration document
                  </Text>
                )}
              <TextField
                formType={formType}
                style={{ display: formType === 1 ? "none" : "flex" }}
                value={formState.inputValues.comapnypanno}
                isSubmitted={isSubmitted}
                initiallyValid={false}
                id="comapnypanno"
                required
                onInputChange={inputChangeHandler}
                label={
                  <Text>
                    Company PAN
                    <Text style={styles.required}>*</Text>
                  </Text>
                }
                leadingIcon={
                  <FontAwesome name="vcard-o" size={25} color="black" />
                }
              />
              {!formState.inputValidities.comapnypanno &&
                isSubmitted &&
                formType === 2 && (
                  <View
                    style={{
                      ...styles.errorContainer,
                      display: formType === 1 ? "none" : "flex",
                    }}
                  >
                    <Text style={styles.errorText}>
                      Please enter valid company PAN.
                    </Text>
                  </View>
                )}
              <RaisedButton
                style={{
                  ...styles.fileUploadBtn,
                  display: formType === 1 ? "none" : "flex",
                  backgroundColor:
                    formState.inputValues.companypandoc === ""
                      ? Colors.primary
                      : Colors.success,
                }}
                title="PAN Doc"
                onPress={() => {
                  setFormNo(1);
                  setCurrentPicker("companypandoc");
                  setIsMultiSelection(false);
                  setImagePicker(true);
                }}
              />
              {!formState.inputValidities.companypandoc &&
                isSubmitted &&
                formType === 2 && (
                  <Text style={styles.errorText}>
                    Please upload company PAN document
                  </Text>
                )}
              <TextField
                formType={formType}
                style={{ display: formType === 1 ? "none" : "flex" }}
                value={formState.inputValues.companyaddress}
                isSubmitted={isSubmitted}
                initiallyValid={false}
                id="companyaddress"
                required
                onInputChange={inputChangeHandler}
                label={
                  <Text>
                    Registered Address
                    <Text style={styles.required}>*</Text>
                  </Text>
                }
                leadingIcon={
                  <FontAwesome name="vcard-o" size={25} color="black" />
                }
              />
              {!formState.inputValidities.companyaddress &&
                isSubmitted &&
                formType === 2 && (
                  <View
                    style={{
                      ...styles.errorContainer,
                      display: formType === 1 ? "none" : "flex",
                    }}
                  >
                    <Text style={styles.errorText}>
                      Please enter valid registered address.
                    </Text>
                  </View>
                )}
              <TextField
                formType={formType}
                style={{ display: formType === 1 ? "none" : "flex" }}
                value={formState.inputValues.companygstno}
                isSubmitted={isSubmitted}
                initiallyValid={false}
                id="companygstno"
                required
                onInputChange={inputChangeHandler}
                label={
                  <Text>
                    Company GSTIN Number
                    <Text style={styles.required}>*</Text>
                  </Text>
                }
                leadingIcon={
                  <MaterialCommunityIcons
                    name="numeric"
                    size={25}
                    color="black"
                  />
                }
              />
              {!formState.inputValidities.companygstno &&
                isSubmitted &&
                formType === 2 && (
                  <View
                    style={{
                      ...styles.errorContainer,
                      display: formType === 1 ? "none" : "flex",
                    }}
                  >
                    <Text style={styles.errorText}>
                      Please enter valid GSTIN number.
                    </Text>
                  </View>
                )}
              <RaisedButton
                style={{
                  ...styles.fileUploadBtn,
                  display: formType === 1 ? "none" : "flex",
                  backgroundColor:
                    formState.inputValues.companygstdoc === ""
                      ? Colors.primary
                      : Colors.success,
                }}
                title="Upload GSTIN"
                onPress={() => {
                  setFormNo(1);
                  setCurrentPicker("companygstdoc");
                  setIsMultiSelection(false);
                  setImagePicker(true);
                }}
              />
              {!formState.inputValidities.companygstdoc &&
                isSubmitted &&
                formType === 2 && (
                  <Text style={styles.errorText}>
                    Please upload company GSTIN document
                  </Text>
                )}
              <TextField
                formType={formType}
                style={{ display: formType === 1 ? "none" : "flex" }}
                value={formState.inputValues.evgstnid}
                isSubmitted={isSubmitted}
                initiallyValid={false}
                id="evgstnid"
                onInputChange={inputChangeHandler}
                label="E-Way GSTIN Number"
                leadingIcon={
                  <MaterialCommunityIcons
                    name="numeric"
                    size={25}
                    color="black"
                  />
                }
              />
              {!formState.inputValidities.evgstnid &&
                isSubmitted &&
                formType === 2 && (
                  <View
                    style={{
                      ...styles.errorContainer,
                      display: formType === 1 ? "none" : "flex",
                    }}
                  >
                    <Text style={styles.errorText}>
                      Please enter valid e-way GSTIN number.
                    </Text>
                  </View>
                )}
              <View style={styles.separator}></View>
              <TextField
                formType={formType}
                value={formState.inputValues.loginid}
                onEndEditing={checkUserIdHandler}
                isSubmitted={isSubmitted}
                initiallyValid={false}
                id="loginid"
                required
                onInputChange={inputChangeHandler}
                errorText="Please enter valid user id."
                label={
                  <Text>
                    User Id
                    <Text style={styles.required}>*</Text>
                  </Text>
                }
                leadingIcon={
                  <Icon name="person-outline" size={25} color="black" />
                }
              />
              {isLoading && (
                <View style={styles.errorContainer}>
                  <Text style={styles.checkUId}>
                    Checking user id availability...
                  </Text>
                  <ActivityIndicator size="small" color="black" />
                </View>
              )}
              {!isUserIdValid.flag && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{isUserIdValid.errorMsg}</Text>
                </View>
              )}
              {isUserIdValid.avlFlag && (
                <View style={styles.errorContainer}>
                  <Text
                    style={
                      (styles.errorText,
                      { color: Colors.success, fontFamily: "open-sans-bold" })
                    }
                  >
                    User Id is available
                  </Text>
                </View>
              )}
              <TextField
                formType={formType}
                value={formState.inputValues.password}
                onEndEditing={confirmPasswordHandler}
                isSubmitted={isSubmitted}
                initiallyValid={false}
                id="password"
                required
                onInputChange={inputChangeHandler}
                errorText="Please enter valid password."
                secureTextEntry={true}
                label={
                  <Text>
                    Password
                    <Text style={styles.required}>*</Text>
                  </Text>
                }
                leadingIcon={
                  <Icon name="md-lock-closed-outline" size={25} color="black" />
                }
              />
              <TextField
                formType={formType}
                value={formState.inputValues.cnfpassword}
                onEndEditing={confirmPasswordHandler}
                isSubmitted={isSubmitted}
                initiallyValid={false}
                id="cnfpassword"
                required
                onInputChange={inputChangeHandler}
                errorText="Please enter valid confirm password."
                secureTextEntry={true}
                label={
                  <Text>
                    Confirm Password
                    <Text style={styles.required}>*</Text>
                  </Text>
                }
                leadingIcon={
                  <Icon name="md-lock-closed-outline" size={25} color="black" />
                }
              />
              {!cnfPwdCheck && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    Confirm password does not match!
                  </Text>
                </View>
              )}
              <View style={styles.separator}></View>
              <TextField
                formType={formType}
                value={formState.inputValues.ownrnme}
                isSubmitted={isSubmitted}
                initiallyValid={false}
                id="ownrnme"
                required
                onInputChange={inputChangeHandler}
                errorText="Please enter valid owner / contact name."
                label={
                  <Text>
                    Name Of Contact/Owner
                    <Text style={styles.required}>*</Text>
                  </Text>
                }
                leadingIcon={
                  <Icon
                    name={
                      Platform.OS === "android"
                        ? "md-person-circle-outline"
                        : "ios-person-circle-outline"
                    }
                    size={25}
                    color="black"
                  />
                }
              />
              <TextField
                formType={formType}
                value={formState.inputValues.ownrmobile}
                mobileNumber
                isSubmitted={isSubmitted}
                initiallyValid={false}
                id="ownrmobile"
                min={999999999}
                max={10000000000}
                required
                onInputChange={inputChangeHandler}
                errorText="Please enter valid mobile number."
                maxLength={10}
                keyboardType="numeric"
                label={
                  <Text>
                    Mobile Number<Text style={styles.required}>*</Text>
                  </Text>
                }
                leadingIcon={
                  <Icon
                    name={
                      Platform.OS === "android"
                        ? "md-phone-portrait-outline"
                        : "ios-phone-portrait-outline"
                    }
                    size={25}
                    color="black"
                  />
                }
              />
              <TextField
                formType={formType}
                value={formState.inputValues.ownremail}
                isSubmitted={isSubmitted}
                initiallyValid={true}
                id="ownremail"
                required
                email
                onInputChange={inputChangeHandler}
                errorText="Please enter valid email address."
                keyboardType="email-address"
                label={
                  <Text>
                    E-Mail Address<Text style={styles.required}>*</Text>
                  </Text>
                }
                leadingIcon={
                  <Icon
                    name={
                      Platform.OS === "android"
                        ? "md-mail-outline"
                        : "ios-mail-outline"
                    }
                    size={25}
                    color="black"
                  />
                }
              />
              <TextField
                formType={formType}
                value={formState.inputValues.ownrpincd}
                isSubmitted={isSubmitted}
                initiallyValid={false}
                required
                id="ownrpincd"
                onInputChange={inputChangeHandler}
                errorText="Please enter valid area pin code."
                maxLength={6}
                keyboardType="numeric"
                label={
                  <Text>
                    Area Pin Code<Text style={styles.required}>*</Text>
                  </Text>
                }
                leadingIcon={
                  <MaterialCommunityIcons
                    name="numeric"
                    size={25}
                    color="black"
                  />
                }
              />
              <TextField
                formType={formType}
                value={formState.inputValues.ownraddr}
                isSubmitted={isSubmitted}
                initiallyValid={false}
                required
                id="ownraddr"
                onInputChange={inputChangeHandler}
                errorText="Please enter valid address details."
                label={
                  <Text>
                    Address Details<Text style={styles.required}>*</Text>
                  </Text>
                }
                leadingIcon={
                  <Icon
                    name={
                      Platform.OS === "android"
                        ? "md-home-outline"
                        : "ios-home-outline"
                    }
                    size={25}
                    color="black"
                  />
                }
              />
              <TextField
                formType={formType}
                value={formState.inputValues.ownridno}
                isSubmitted={isSubmitted}
                initiallyValid={false}
                required
                id="ownridno"
                onInputChange={inputChangeHandler}
                errorText="Please enter valid id proof/ Aadhar."
                label={
                  <Text>
                    Id Proof/Aadhar<Text style={styles.required}>*</Text>
                  </Text>
                }
                leadingIcon={
                  <FontAwesome name="address-card-o" size={25} color="black" />
                }
              />
              <RaisedButton
                style={{
                  ...styles.fileUploadBtn,
                  backgroundColor:
                    formState.inputValues.ownradhardoc === ""
                      ? Colors.primary
                      : Colors.success,
                }}
                title="Upload ID Proof"
                onPress={() => {
                  setFormNo(1);
                  setCurrentPicker("ownradhardoc");
                  setIsMultiSelection(false);
                  setImagePicker(true);
                }}
              />
              {!formState.inputValidities.ownradhardoc && isSubmitted && (
                <Text style={styles.errorText}>
                  Please upload aadhar document
                </Text>
              )}
              <TextField
                formType={formType}
                value={formState.inputValues.ownrpanno}
                isSubmitted={isSubmitted}
                initiallyValid={false}
                required
                id="ownrpanno"
                onInputChange={inputChangeHandler}
                errorText="Please enter valid PAN number."
                label={
                  <Text>
                    PAN Number<Text style={styles.required}>*</Text>
                  </Text>
                }
                leadingIcon={
                  <FontAwesome name="address-card-o" size={25} color="black" />
                }
              />
              <RaisedButton
                style={{
                  ...styles.fileUploadBtn,
                  backgroundColor:
                    formState.inputValues.ownrpandoc === ""
                      ? Colors.primary
                      : Colors.success,
                }}
                title="PAN Doc"
                onPress={() => {
                  setFormNo(1);
                  setCurrentPicker("ownrpandoc");
                  setIsMultiSelection(false);
                  setImagePicker(true);
                }}
              />
              {!formState.inputValidities.ownrpandoc && isSubmitted && (
                <Text style={styles.errorText}>Please upload PAN document</Text>
              )}
              <View style={styles.separator}></View>
              <View>
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
                      <Text style={styles.errorText}>
                        Please select vehicle type
                      </Text>
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
                      setFormNo(2);
                      setCurrentPicker("vehphoto");
                      setIsMultiSelection(true);
                      setImagePicker(true);
                    }}
                  />
                  {!vehFormState.inputValidities.vehphoto && isFleetSubmit && (
                    <Text style={styles.errorText}>
                      Please upload vehicle photos
                    </Text>
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
                      setFormNo(2);
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
                      setFormNo(2);
                      setCurrentPicker("vehinsurancedoc");
                      setIsMultiSelection(false);
                      setImagePicker(true);
                    }}
                  />
                  {!vehFormState.inputValidities.vehinsurancedoc &&
                    isFleetSubmit && (
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
                  {!vehFormState.inputValidities.vehfitcetexpdte &&
                    isFleetSubmit && (
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
                      setFormNo(2);
                      setCurrentPicker("vehfitcetphoto");
                      setIsMultiSelection(false);
                      setImagePicker(true);
                    }}
                  />
                  {!vehFormState.inputValidities.vehfitcetphoto &&
                    isFleetSubmit && (
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
                      setFormNo(2);
                      setCurrentPicker("vehpucphoto");
                      setIsMultiSelection(false);
                      setImagePicker(true);
                    }}
                  />
                  {!vehFormState.inputValidities.vehpucphoto &&
                    isFleetSubmit && (
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
              </View>
              {addedFleets.length === 0 && !vehInitFormState.formIsValid && (
                <Text
                  style={{ ...styles.errorText, fontSize: 16, color: "yellow" }}
                >
                  Please add fleet Details
                </Text>
              )}
              {addedFleets.length > 0 && (
                <View style={styles.vehListContainer}>
                  <FlatList
                    nestedScrollEnabled
                    data={addedFleets}
                    keyExtractor={(item) => item.vehno}
                    renderItem={(itemData) => (
                      <VehicleDetailsTile
                        vehicleNo={itemData.item.vehno}
                        vehType={itemData.item.vtypnm}
                        regDate={itemData.item.vehregdte}
                        chesisNo={itemData.item.vehchesino}
                        insuranceNo={itemData.item.vehinsuno}
                        insuranceExpDate={itemData.item.vehinsexpdte}
                        onRemove={() => {
                          return Alert.alert(
                            "Are your sure?",
                            `Are you sure you want to remove this fleet of vehicle number ${itemData.item.veh_no} ?`,
                            [
                              {
                                text: "Yes",
                                onPress: () => {
                                  dispatch(
                                    fleetActions.removeFleet(
                                      itemData.item.vehno
                                    )
                                  );
                                  inputChangeHandler(
                                    "vehclst",
                                    [
                                      ...formState.inputValues.vehclst.filter(
                                        (item) =>
                                          item.vehno != itemData.item.vehno
                                      ),
                                    ],
                                    formState.inputValues.vehclst.length > 1
                                      ? true
                                      : false
                                  );
                                },
                              },
                              { text: "No" },
                            ]
                          );
                        }}
                      />
                    )}
                  />
                </View>
              )}
              <TAndCContainer
                navigation={navigation}
                value={isChecked}
                onValueChange={setChecked}
              />
              <RaisedButton
                title="SUBMIT"
                style={styles.submitBtn}
                onPress={onSubmitRegistrationForm}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: window.width,
  },
  image: {
    resizeMode: "center",
    height: 35,
    width: 40,
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
  checkUId: {
    fontFamily: "open-sans-bold",
    color: "black",
    fontSize: 14,
  },
  fileUploadBtn: {
    paddingVertical: 5,
    marginVertical: 10,
    width: "60%",
  },
  separator: {
    width: "90%",
    height: 2,
    backgroundColor: Colors.danger,
    marginVertical: 10,
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
  vehListContainer: {
    marginVertical: 10,
    minHeight: window.height * 0.3,
    maxHeight: window.height * 0.6,
    borderWidth: 1,
    paddingHorizontal: 2,
    borderRadius: 8,
  },
  submitBtn: {
    margin: 40,
    backgroundColor: Colors.danger,
  },
});

export default TransporterRegistrationScreen;
