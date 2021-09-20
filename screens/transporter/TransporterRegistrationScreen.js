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
    ownrnme: "", //
    ownrmobile: "", //
    ownremail: "", //
    ownraddr: "", //
    ownrpincd: "", //
    ownrpandoc: "",
    ownridno: "", //
    ownrpanno: "", //
    ownradhardoc: "",
    loginid: "", //
    password: "", //
    cnfpassword: "", //
    companyname: "", //
    companyregno: "", //
    comapnypanno: "", //
    compincode: "", // not in UI
    companyaddress: "", //
    companygstno: "", //
    companyregdoc: "",
    companypandoc: "", //
    companygstdoc: "",
    evgstnid: "", //
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
    vehphoto: "",
    vehregfle: "",
    vehinsurancedoc: "",
    vehfitcetexpdte: "",
    vehfitcetphoto: "",
    vehpucexpdte: "",
    vehpucphoto: [],
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
  const [dateValue, setDateValue] = useState(new Date());
  const [currentDateField, setDateField] = useState("");
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [showDatePkr, setShowDatePkr] = useState(false);
  const dispatch = useDispatch();
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
        veh_no: state.fleets.fleets[key].vehno,
        veh_type: state.fleets.fleets[key].vtypnm,
        reg_date: state.fleets.fleets[key].vehregdte,
        chesis_no: state.fleets.fleets[key].vehchesino,
        insurance_no: state.fleets.fleets[key].vehinsuno,
        insurance_exp_date: state.fleets.fleets[key].vehinsexpdte,
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
    setFormType(formNumber);
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
    // console.log("selectedDate=> ", Moment(selectedDate).format("YYYY-MM-DD"));
  };

  const openDatePicker = (data) => {
    setShowDatePkr(true);
    setDateField(data.currentField);
    setMinDate(data.minDate);
    setMaxDate(data.maxDate);
  };

  const onSubmitRegistrationForm = () => {
    setIsSubmitted(true);
  };
  const onSubmitFleetForm = () => {
    dispatch(fleetActions.addFleet(vehFormState.inputValues));
    dispatchVehFormState({
      type: RESET_FORM,
      initialFormState: vehInitFormState,
    });
    setIsFleetSubmit(true);
  };

  return (
    <BackgroundImage>
      {isSubLoader && <ProgressIndicator msg="Registering Transporter" />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View
          style={styles.screen}
          pointerEvents={isSubLoader ? "none" : "auto"}
        >
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
              visible={showImagePicker}
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
              errorText="Please enter valid company name."
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
            <TextField
              formType={formType}
              style={{ display: formType === 1 ? "none" : "flex" }}
              value={formState.inputValues.companyregno}
              isSubmitted={isSubmitted}
              initiallyValid={false}
              id="companyregno"
              required
              onInputChange={inputChangeHandler}
              errorText="Please enter valid registration number."
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
            <RaisedButton
              style={{
                ...styles.fileUploadBtn,
                display: formType === 1 ? "none" : "flex",
              }}
              title="Registration Doc"
              onPress={() => {
                setImagePicker(true);
              }}
            />
            <TextField
              formType={formType}
              style={{ display: formType === 1 ? "none" : "flex" }}
              value={formState.inputValues.companypandoc}
              isSubmitted={isSubmitted}
              initiallyValid={false}
              id="companypandoc"
              required
              onInputChange={inputChangeHandler}
              errorText="Please enter valid company PAN."
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
            <RaisedButton
              style={{
                ...styles.fileUploadBtn,
                display: formType === 1 ? "none" : "flex",
              }}
              title="PAN Doc"
              onPress={() => {
                setImagePicker(true);
              }}
            />
            <TextField
              formType={formType}
              style={{ display: formType === 1 ? "none" : "flex" }}
              value={formState.inputValues.companyaddress}
              isSubmitted={isSubmitted}
              initiallyValid={false}
              id="companyaddress"
              required
              onInputChange={inputChangeHandler}
              errorText="Please enter valid registered address."
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
            <TextField
              formType={formType}
              style={{ display: formType === 1 ? "none" : "flex" }}
              value={formState.inputValues.companygstno}
              isSubmitted={isSubmitted}
              initiallyValid={false}
              id="companygstno"
              required
              onInputChange={inputChangeHandler}
              errorText="Please enter valid GSTIN number."
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
            <RaisedButton
              style={{
                ...styles.fileUploadBtn,
                display: formType === 1 ? "none" : "flex",
              }}
              title="Upload GSTIN"
              onPress={() => {
                setImagePicker(true);
              }}
            />
            <TextField
              formType={formType}
              style={{ display: formType === 1 ? "none" : "flex" }}
              value={formState.inputValues.evgstnid}
              isSubmitted={isSubmitted}
              initiallyValid={false}
              id="evgstnid"
              required
              onInputChange={inputChangeHandler}
              errorText="Please enter valid e-way GSTIN number."
              label="E-Way GSTIN Number"
              leadingIcon={
                <MaterialCommunityIcons
                  name="numeric"
                  size={25}
                  color="black"
                />
              }
            />
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
              style={styles.fileUploadBtn}
              title="Upload ID Proof"
              onPress={() => {
                setImagePicker(true);
              }}
            />
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
              style={styles.fileUploadBtn}
              title="PAN Doc"
              onPress={() => {
                setImagePicker(true);
              }}
            />
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
                {!vehFormState.inputValidities.vtypnm && (
                  <Text style={styles.errorText}>
                    Please select vehicle type
                  </Text>
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
                  style={styles.fileUploadBtn}
                  title="Vehicle Photos"
                  onPress={() => {
                    setImagePicker(true);
                  }}
                />
                <TextField
                  value={vehFormState.inputValues.vehregdte}
                  isSubmitted={isFleetSubmit}
                  initiallyValid={false}
                  required
                  id="vehregdte"
                  placeholder="YYYY-MM-DD"
                  onInputChange={vehInputChangeHandler}
                  editable={false}
                  errorText="Please enter valid registration date."
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

                <RaisedButton
                  style={styles.fileUploadBtn}
                  title="Registration Doc"
                  onPress={() => {
                    setImagePicker(true);
                  }}
                />
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
                  errorText="Please enter valid insurance expiry date."
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
                <RaisedButton
                  style={styles.fileUploadBtn}
                  title="Insurance Doc"
                  onPress={() => {
                    setImagePicker(true);
                  }}
                />
                <TextField
                  value={vehFormState.inputValues.vehfitcetexpdte}
                  isSubmitted={isFleetSubmit}
                  initiallyValid={false}
                  required
                  id="vehfitcetexpdte"
                  placeholder="YYYY-MM-DD"
                  onInputChange={vehInputChangeHandler}
                  editable={false}
                  errorText="Please enter valid fitness certificate date."
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
                <RaisedButton
                  style={styles.fileUploadBtn}
                  title="Fitness Doc"
                  onPress={() => {
                    setImagePicker(true);
                  }}
                />
                <TextField
                  value={vehFormState.inputValues.vehpucexpdte}
                  isSubmitted={isFleetSubmit}
                  initiallyValid={false}
                  id="vehpucexpdte"
                  placeholder="YYYY-MM-DD"
                  onInputChange={vehInputChangeHandler}
                  editable={false}
                  errorText="Please enter valid PUC expiry date."
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
                <RaisedButton
                  style={styles.fileUploadBtn}
                  title="PUC Doc"
                  onPress={() => {
                    setImagePicker(true);
                  }}
                />
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
            <View style={styles.vehListContainer}>
              <FlatList
                nestedScrollEnabled
                data={addedFleets}
                keyExtractor={(item) => item.veh_no}
                renderItem={(itemData) => (
                  <VehicleDetailsTile
                    vehicleNo={itemData.item.veh_no}
                    vehType={itemData.item.veh_type}
                    regDate={itemData.item.reg_date}
                    chesisNo={itemData.item.chesis_no}
                    insuranceNo={itemData.item.insurance_no}
                    insuranceExpDate={itemData.item.insurance_exp_date}
                    onRemove={() => {
                      return Alert.alert(
                        "Are your sure?",
                        `Are you sure you want to remove this fleet of vehicle number ${itemData.item.veh_no} ?`,
                        [
                          {
                            text: "Yes",
                            onPress: () => {
                              dispatch(
                                fleetActions.removeFleet(itemData.item.veh_no)
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

      {isSubLoader && <ProgressIndicator msg="Processing user registration" />}
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
