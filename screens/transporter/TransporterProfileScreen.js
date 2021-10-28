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
  TouchableOpacity,
  TouchableNativeFeedback,
  Alert,
  Image,
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import ProgressIndicator from "../../shared/UI/ProgressIndicator";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import TextField from "../../shared/components/TextField";
import RaisedButton from "../../shared/components/RaisedButton";
import * as authActions from "../../store/action/auth";
import * as transporterActions from "../../store/action/transporter";
import Colors from "../../shared/constants/Colors";
import Styles from "../../shared/styles/styles";
import DrawerHeaderLeft from "../../shared/components/DrawerHeaderLeft";
import SwitchTab from "../../shared/UI/SwitchTab";
import Card from "../../shared/UI/Card";
import {
  FORM_INPUT_UPDATE,
  RESET_FORM,
  formReducer,
} from "../../shared/Functions/FormReducer";

const window = Dimensions.get("window");

const initialFormState = {
  inputValues: {
    password: "",
    confirmPassword: "",
  },
  inputValidities: {
    password: false,
    confirmPassword: false,
  },
  formIsValid: false,
};

const TransporterProfileScreen = (props) => {
  const formState = useSelector((state) => state.transp);
  const userData = useSelector((state) => state.auth);
  const isFocused = useIsFocused();
  const { navigation } = props;
  const [formType, setFormType] = useState(formState.inputValues.seq);
  const [error, setError] = useState();
  const [cnfPwdCheck, setCnfPwdCheck] = useState(true);
  const [isProfile, setProfile] = useState(true);
  const [isEdit, setEdit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({
    state: false,
    msg: "Loading...",
  });
  const [passForm, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );

  const Icon = Ionicons;

  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  useEffect(() => {
    if (!isFocused) {
      setEdit(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  useEffect(() => {
    if (isFocused) {
      getTransporterProfile();
    }
  }, [isEdit]);

  useEffect(() => {
    getTransporterProfile();
  }, []);
  useEffect(() => {
    setFormType(formState.inputValues.seq);
  }, [formState.inputValues.seq]);

  const getTransporterProfile = async () => {
    setError(null);
    setIsLoading({ state: true, msg: "Getting Profile Data..." });
    try {
      const result = await dispatch(transporterActions.getTransporterProfile());
      setIsLoading({ state: false, msg: "" });
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  const updateTransporterProfile = async () => {
    setIsSubmitted(true);
    const formData = formState.inputValues;
    if (!formState.formIsValid) {
      Alert.alert("An Error Occurred", "Please check error in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null);
    setIsLoading({ state: true, msg: "Updating Profile Data..." });
    try {
      const result = await dispatch(
        transporterActions.updateTransporterProfile(formData)
      );
      setEdit(false);
      setIsLoading({ state: false, msg: "" });
      Alert.alert("Updated", result.Msg, [{ text: "Okay" }]);
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  const passInputChangeHandler = useCallback(
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

  const confirmPasswordHandler = () => {
    const formvalues = passForm.inputValues;
    if (formvalues.password === formvalues.confirmPassword) {
      setCnfPwdCheck(true);
      return;
    }
    setCnfPwdCheck(false);
  };

  const changePassword = async () => {
    setIsSubmitted(true);
    if (!passForm.formIsValid || !cnfPwdCheck) {
      Alert.alert("Wrong Input", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null);
    setIsLoading({ state: true, msg: "Processing..." });
    try {
      const result = await dispatch(
        authActions.updatePassword(passForm.inputValues.password)
      );
      setIsLoading({ state: false, msg: "" });
      dispatchFormState({
        type: RESET_FORM,
        initialFormState: initialFormState,
      });
      setCnfPwdCheck(true);
      Alert.alert("Updated", result.Msg, [{ text: "Okay" }]);
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  const formTypeHandler = (formNumber) => {
    const formData = formState.inputValues;
    inputChangeHandler("seq", formNumber, true);
    setFormType(formNumber);
    if (formNumber === 1) {
      inputChangeHandler("companyname", formData.companyname, true);
      inputChangeHandler("company_regno", formData.company_regno, true);
      inputChangeHandler("company_pan", formData.company_pan, true);
      inputChangeHandler("companyaddress", formData.companyaddress, true);
      inputChangeHandler("company_gstn", formData.company_gstn, true);
      inputChangeHandler("evgstnid", formData.evgstnid, true);
    }
  };

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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "TPort Profile",
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
          <View style={Styles.ScreenSwitchContainer}>
            <TouchableCmp
              onPress={() => {
                setEdit(false);
                setIsSubmitted(false);
                setProfile(true);
              }}
            >
              <View
                style={{
                  ...Styles.leftTextCon,
                  backgroundColor: isProfile === true ? "white" : "black",
                }}
              >
                <Text
                  style={{
                    ...Styles.focusedTab,
                    color: isProfile === true ? "black" : "white",
                  }}
                >
                  Update Profile
                </Text>
              </View>
            </TouchableCmp>
            <TouchableCmp
              onPress={() => {
                setEdit(false);
                setIsSubmitted(false);
                setProfile(false);
                dispatchFormState({
                  type: RESET_FORM,
                  initialFormState: initialFormState,
                });
                setCnfPwdCheck(true);
              }}
            >
              <View
                style={{
                  ...Styles.rightTextCon,
                  backgroundColor: isProfile === false ? "white" : "black",
                }}
              >
                <Text
                  style={{
                    ...Styles.focusedTab,
                    color: isProfile === true ? "white" : "black",
                  }}
                >
                  Change Password
                </Text>
              </View>
            </TouchableCmp>
          </View>
          {isProfile && (
            <View style={styles.screen}>
              <SwitchTab
                readonly={!isEdit}
                onFormChange={formTypeHandler}
                formType={formType}
                leftText="Individual"
                rightText="Transport Company"
                style={{
                  backgroundColor: Colors.transparent,
                  shadowOpacity: null,
                  shadowOffset: { width: 0, height: 0 },
                  shadowRadius: null,
                  elevation: null,
                }}
              />
              {!isEdit && (
                <Card style={Styles.card}>
                  <Text style={Styles.mainHead}>TRANSPORTER DETAILS</Text>
                  {formType === 2 && (
                    <View>
                      <View style={Styles.cntDtls}>
                        <Text style={Styles.heading}>Company Name: </Text>
                        <Text style={Styles.text}>
                          {formState.inputValues.companyname}
                        </Text>
                      </View>
                      <View style={Styles.cntDtls}>
                        <Text style={Styles.heading}>
                          Registration Number:{" "}
                        </Text>
                        <Text style={Styles.text}>
                          {formState.inputValues.company_regno}
                        </Text>
                      </View>
                      <View style={Styles.cntDtls}>
                        <Text style={Styles.heading}>Company PAN: </Text>
                        <Text style={Styles.text}>
                          {formState.inputValues.company_pan}
                        </Text>
                      </View>
                      <View style={Styles.cntDtls}>
                        <Text style={Styles.heading}>Registered Address: </Text>
                        <Text style={Styles.text}>
                          {formState.inputValues.companyaddress}
                        </Text>
                      </View>
                      <View style={Styles.cntDtls}>
                        <Text style={Styles.heading}>GSTIN Number: </Text>
                        <Text style={Styles.text}>
                          {formState.inputValues.company_gstn}
                        </Text>
                      </View>
                      <View style={Styles.cntDtls}>
                        <Text style={Styles.heading}>E-Way GSTIN Number: </Text>
                        <Text style={Styles.text}>
                          {formState.inputValues.evgstnid}
                        </Text>
                      </View>
                    </View>
                  )}
                  <View style={Styles.cntDtls}>
                    <Text style={Styles.heading}>Name Of Owner: </Text>
                    <Text style={Styles.text}>
                      {formState.inputValues.ownrnme}
                    </Text>
                  </View>
                  <View style={Styles.cntDtls}>
                    <Text style={Styles.heading}>Mobile Number: </Text>
                    <Text style={Styles.text}>
                      {formState.inputValues.ownrmobile}
                    </Text>
                  </View>
                  <View style={Styles.cntDtls}>
                    <Text style={Styles.heading}>Email Address: </Text>
                    <Text style={Styles.text}>
                      {formState.inputValues.ownremail}
                    </Text>
                  </View>
                  <View style={Styles.cntDtls}>
                    <Text style={Styles.heading}>Area Pin Code: </Text>
                    <Text style={Styles.text}>
                      {formState.inputValues.ownrpincd}
                    </Text>
                  </View>
                  <View style={Styles.cntDtls}>
                    <Text style={Styles.heading}>Address Details: </Text>
                    <Text style={Styles.text}>
                      {formState.inputValues.ownraddr}
                    </Text>
                  </View>
                  <View style={Styles.cntDtls}>
                    <Text style={Styles.heading}>ID Proof/Aadhar: </Text>
                    <Text style={Styles.text}>
                      {formState.inputValues.ownridno}
                    </Text>
                  </View>
                  <View style={Styles.cntDtls}>
                    <Text style={Styles.heading}>PAN Number: </Text>
                    <Text style={Styles.text}>
                      {formState.inputValues.ownrpanno}
                    </Text>
                  </View>
                  <View style={Styles.actionsContainer}>
                    <View style={Styles.btnContainer}>
                      <RaisedButton
                        title="EDIT PROFILE"
                        onPress={() => {
                          setEdit(true);
                        }}
                        style={{
                          flex: null,
                          height: 40,
                          backgroundColor: Colors.danger,
                        }}
                      />
                    </View>
                  </View>
                </Card>
              )}
              {isEdit && (
                <View style={Styles.formContainer}>
                  <TextField
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    formType={formType}
                    style={{ display: formType === 1 ? "none" : "flex" }}
                    value={formState.inputValues.companyname}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.companyname}
                    id="companyname"
                    required
                    onInputChange={inputChangeHandler}
                    label={
                      <Text>
                        Company Name
                        <Text style={Styles.required}>*</Text>
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
                          ...Styles.errorContainer,
                          display: formType === 1 ? "none" : "flex",
                        }}
                      >
                        <Text style={Styles.errorText}>
                          Please enter valid company name.
                        </Text>
                      </View>
                    )}
                  <TextField
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    formType={formType}
                    style={{ display: formType === 1 ? "none" : "flex" }}
                    value={formState.inputValues.company_regno}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.company_regno}
                    id="company_regno"
                    required
                    onInputChange={inputChangeHandler}
                    label={
                      <Text>
                        Registration Number
                        <Text style={Styles.required}>*</Text>
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
                  {!formState.inputValidities.company_regno &&
                    isSubmitted &&
                    formType === 2 && (
                      <View
                        style={{
                          ...Styles.errorContainer,
                          display: formType === 1 ? "none" : "flex",
                        }}
                      >
                        <Text style={Styles.errorText}>
                          Please enter valid company registration number.
                        </Text>
                      </View>
                    )}
                  <TextField
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    formType={formType}
                    style={{ display: formType === 1 ? "none" : "flex" }}
                    value={formState.inputValues.company_pan}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.company_pan}
                    id="company_pan"
                    required
                    onInputChange={inputChangeHandler}
                    label={
                      <Text>
                        Company PAN
                        <Text style={Styles.required}>*</Text>
                      </Text>
                    }
                    leadingIcon={
                      <FontAwesome
                        name="address-card-o"
                        size={25}
                        color="black"
                      />
                    }
                  />
                  {!formState.inputValidities.company_pan &&
                    isSubmitted &&
                    formType === 2 && (
                      <View
                        style={{
                          ...Styles.errorContainer,
                          display: formType === 1 ? "none" : "flex",
                        }}
                      >
                        <Text style={Styles.errorText}>
                          Please enter valid company PAN number.
                        </Text>
                      </View>
                    )}
                  <TextField
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    formType={formType}
                    style={{ display: formType === 1 ? "none" : "flex" }}
                    value={formState.inputValues.companyaddress}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.companyaddress}
                    id="companyaddress"
                    required
                    onInputChange={inputChangeHandler}
                    label={
                      <Text>
                        Registered Address
                        <Text style={Styles.required}>*</Text>
                      </Text>
                    }
                    leadingIcon={
                      <FontAwesome
                        name="address-card-o"
                        size={25}
                        color="black"
                      />
                    }
                  />
                  {!formState.inputValidities.companyaddress &&
                    isSubmitted &&
                    formType === 2 && (
                      <View
                        style={{
                          ...Styles.errorContainer,
                          display: formType === 1 ? "none" : "flex",
                        }}
                      >
                        <Text style={Styles.errorText}>
                          Please enter valid company registered address.
                        </Text>
                      </View>
                    )}
                  <TextField
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    formType={formType}
                    style={{ display: formType === 1 ? "none" : "flex" }}
                    value={formState.inputValues.company_gstn}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.company_gstn}
                    id="company_gstn"
                    required
                    onInputChange={inputChangeHandler}
                    label={
                      <Text>
                        GSTIN Number
                        <Text style={Styles.required}>*</Text>
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
                  {!formState.inputValidities.company_gstn &&
                    isSubmitted &&
                    formType === 2 && (
                      <View
                        style={{
                          ...Styles.errorContainer,
                          display: formType === 1 ? "none" : "flex",
                        }}
                      >
                        <Text style={Styles.errorText}>
                          Please enter valid company GSTIN number.
                        </Text>
                      </View>
                    )}
                  <TextField
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    formType={formType}
                    style={{ display: formType === 1 ? "none" : "flex" }}
                    value={formState.inputValues.evgstnid}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.evgstnid}
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
                          ...Styles.errorContainer,
                          display: formType === 1 ? "none" : "flex",
                        }}
                      >
                        <Text style={Styles.errorText}>
                          Please enter valid e-way GSTIN number.
                        </Text>
                      </View>
                    )}
                  <TextField
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    formType={formType}
                    value={formState.inputValues.ownrnme}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.ownrnme}
                    id="ownrnme"
                    required
                    onInputChange={inputChangeHandler}
                    errorText="Please enter valid owner / contact name."
                    label={
                      <Text>
                        Name Of Owner
                        <Text style={Styles.required}>*</Text>
                      </Text>
                    }
                    leadingIcon={
                      <Ionicons
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
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    formType={formType}
                    value={formState.inputValues.ownrmobile}
                    mobileNumber
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.ownrmobile}
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
                        Mobile Number<Text style={Styles.required}>*</Text>
                      </Text>
                    }
                    leadingIcon={
                      <Ionicons
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
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    formType={formType}
                    value={formState.inputValues.ownremail}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.ownremail}
                    id="ownremail"
                    email
                    onInputChange={inputChangeHandler}
                    errorText="Please enter valid email address."
                    keyboardType="email-address"
                    label="E-Mail Address"
                    leadingIcon={
                      <Ionicons
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
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    formType={formType}
                    value={formState.inputValues.ownrpincd}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.ownrpincd}
                    required
                    id="ownrpincd"
                    onInputChange={inputChangeHandler}
                    errorText="Please enter valid area pin code."
                    maxLength={6}
                    keyboardType="numeric"
                    label={
                      <Text>
                        Area Pin Code<Text style={Styles.required}>*</Text>
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
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    formType={formType}
                    value={formState.inputValues.ownraddr}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.ownraddr}
                    required
                    id="ownraddr"
                    onInputChange={inputChangeHandler}
                    errorText="Please enter valid address details."
                    label={
                      <Text>
                        Address Details<Text style={Styles.required}>*</Text>
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
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    formType={formType}
                    value={formState.inputValues.ownridno}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.ownridno}
                    required
                    id="ownridno"
                    onInputChange={inputChangeHandler}
                    errorText="Please enter valid id proof/ Aadhar."
                    label={
                      <Text>
                        Id Proof/Aadhar<Text style={Styles.required}>*</Text>
                      </Text>
                    }
                    leadingIcon={
                      <FontAwesome
                        name="address-card-o"
                        size={25}
                        color="black"
                      />
                    }
                  />
                  <TextField
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    formType={formType}
                    value={formState.inputValues.ownrpanno}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.ownrpanno}
                    required
                    id="ownrpanno"
                    onInputChange={inputChangeHandler}
                    errorText="Please enter valid PAN number."
                    label={
                      <Text>
                        PAN Number<Text style={Styles.required}>*</Text>
                      </Text>
                    }
                    leadingIcon={
                      <FontAwesome
                        name="address-card-o"
                        size={25}
                        color="black"
                      />
                    }
                  />
                  <View style={Styles.actionsContainer}>
                    <View style={Styles.btnContainer}>
                      <RaisedButton
                        title="UPDATE"
                        onPress={updateTransporterProfile}
                        style={{
                          flex: null,
                          height: 40,
                          backgroundColor: Colors.success,
                        }}
                      />
                      <RaisedButton
                        title="CANCEL"
                        onPress={() => {
                          setEdit(false);
                        }}
                        style={{
                          flex: null,
                          height: 40,
                          backgroundColor: Colors.danger,
                        }}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}
          {!isProfile && (
            <View style={styles.screen}>
              <Card style={{ ...Styles.card, marginTop: 40 }}>
                <View style={styles.passFormContainer}>
                  <TextField
                    readonly={true}
                    value={userData.loginid}
                    label={
                      <Text>
                        User Id
                        <Text style={Styles.required}>*</Text>
                      </Text>
                    }
                    leadingIcon={
                      <Ionicons name="person-outline" size={25} color="black" />
                    }
                  />
                  <TextField
                    value={passForm.inputValues.password}
                    onEndEditing={confirmPasswordHandler}
                    isSubmitted={isSubmitted}
                    initiallyValid={false}
                    id="password"
                    required
                    onInputChange={passInputChangeHandler}
                    errorText="Please enter valid password."
                    secureTextEntry={true}
                    label={
                      <Text>
                        Password
                        <Text style={Styles.required}>*</Text>
                      </Text>
                    }
                    leadingIcon={
                      <Ionicons
                        name="md-lock-closed-outline"
                        size={25}
                        color="black"
                      />
                    }
                  />
                  <TextField
                    value={passForm.inputValues.confirmPassword}
                    onEndEditing={confirmPasswordHandler}
                    isSubmitted={isSubmitted}
                    initiallyValid={false}
                    id="confirmPassword"
                    required
                    onInputChange={passInputChangeHandler}
                    errorText="Please enter valid confirm password."
                    secureTextEntry={true}
                    label={
                      <Text>
                        Confirm Password
                        <Text style={Styles.required}>*</Text>
                      </Text>
                    }
                    leadingIcon={
                      <Ionicons
                        name="md-lock-closed-outline"
                        size={25}
                        color="black"
                      />
                    }
                  />
                  {!cnfPwdCheck && (
                    <View style={Styles.errorContainer}>
                      <Text style={Styles.errorText}>
                        Confirm password does not match!
                      </Text>
                    </View>
                  )}
                  <View style={Styles.actionsContainer}>
                    <View style={Styles.btnContainer}>
                      <RaisedButton
                        title="CHANGE PASSWORD"
                        onPress={changePassword}
                        style={{
                          flex: null,
                          height: 40,
                          backgroundColor: Colors.danger,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </Card>
            </View>
          )}
        </View>
      </ScrollView>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: window.width,
    flexDirection: "column",
  },
  image: {
    resizeMode: "center",
    height: 35,
    width: 40,
  },
  passFormContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TransporterProfileScreen;
