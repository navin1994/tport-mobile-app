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
import ImageDocPicker from "../../shared/components/ImageDocPicker";
import TextField from "../../shared/components/TextField";
import RaisedButton from "../../shared/components/RaisedButton";
import * as authActions from "../../store/action/auth";
import * as userActions from "../../store/action/user";
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

const UserProfileScreen = (props) => {
  const formState = useSelector((state) => state.user);
  const userData = useSelector((state) => state.auth);
  const isFocused = useIsFocused();
  const { navigation } = props;
  const [formType, setFormType] = useState(formState.inputValues.seq);
  const [error, setError] = useState();
  const [cnfPwdCheck, setCnfPwdCheck] = useState(true);
  const [showImagePicker, setImagePicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState();
  const [isProfile, setProfile] = useState(true);
  const [isEdit, setEdit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState({
    state: false,
    msg: "Loading...",
  });
  const [passForm, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );
  const dispatch = useDispatch();

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
      getUserProfile();
    }
  }, [isEdit]);

  useEffect(() => {
    getUserProfile();
  }, []);
  useEffect(() => {
    setFormType(formState.inputValues.seq);
  }, [formState.inputValues.seq]);

  const getUserProfile = async () => {
    setError(null);
    setIsLoading({ state: true, msg: "Getting Profile Data..." });
    try {
      const result = await dispatch(userActions.getUserProfile());
      setIsLoading({ state: false, msg: "" });
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  const updateUserProfile = async () => {
    setIsSubmitted(true);
    const formData = formState.inputValues;
    if (
      userData.usrnme !== formData.owner_name &&
      formData.owner_idno_doc === ""
    ) {
      Alert.alert(
        "An Error Occurred",
        "Error exists in the form or you missed uploading the updated document.",
        [{ text: "Okay" }]
      );
      return;
    }
    if (!formState.formIsValid) {
      Alert.alert("An Error Occurred", "Please check error in the form.", [
        { text: "Okay" },
      ]);
    }
    setError(null);
    setIsLoading({ state: true, msg: "Updating Profile Data..." });
    try {
      const result = await dispatch(userActions.updateUserProfile(formData));
      setEdit(false);
      setIsLoading({ state: false, msg: "" });
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
      inputChangeHandler("company_name", formData.company_name, true);
      inputChangeHandler("company_regno_doc", formData.company_regno_doc, true);
      inputChangeHandler("comapnypanno", formData.comapnypanno, true);
      inputChangeHandler(
        "company_reg_address",
        formData.company_reg_address,
        true
      );
      inputChangeHandler("company_gstn", formData.company_gstn, true);
      inputChangeHandler("company_gstn_doc", formData.company_gstn_doc, true);
    }
    if (formNumber === 2) {
      if (
        formData.company_regno_doc === "" ||
        formData.company_regno_doc == null
      ) {
        inputChangeHandler(
          "company_regno_doc",
          formData.company_regno_doc,
          false
        );
      }
      if (
        formData.company_gstn_doc === "" ||
        formData.company_gstn_doc == null
      ) {
        inputChangeHandler(
          "company_gstn_doc",
          formData.company_gstn_doc,
          false
        );
      }
    }
  };

  const inputChangeHandler = useCallback(
    (identifier, inputValue, inputValidity) => {
      if (
        identifier === "company_gstn" &&
        (formState.inputValues.company_gstn_doc === "" ||
          formState.inputValues.company_gstn_doc == null)
      ) {
        dispatch(userActions.formInputUpdate("company_gstn_doc", "", false));
      }
      dispatch(
        userActions.formInputUpdate(identifier, inputValue, inputValidity)
      );
    },
    [dispatch]
  );

  const onCloseModal = useCallback(() => {
    setImagePicker(false);
  }, [showImagePicker]);

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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "TPort Profile",
      headerLeft: () => (
        <DrawerHeaderLeft
          titleIcon={
            <Ionicons
              name={
                Platform.OS === "android"
                  ? "md-person-circle-outline"
                  : "ios-person-circle-outline"
              }
              size={32}
              color="white"
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
          <ImageDocPicker
            inputchangeHandler={inputChangeHandler}
            visible={showImagePicker}
            isMultiple={false}
            id={currentPicker}
            closeModal={onCloseModal}
          />
          <View style={styles.ScreenSwitchContainer}>
            <TouchableCmp
              onPress={() => {
                setEdit(false);
                setIsSubmitted(false);
                setProfile(true);
              }}
            >
              <View
                style={{
                  ...styles.leftTextCon,
                  backgroundColor: isProfile === true ? "white" : "black",
                }}
              >
                <Text
                  style={{
                    ...styles.focusedTab,
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
                  ...styles.rightTextCon,
                  backgroundColor: isProfile === false ? "white" : "black",
                }}
              >
                <Text
                  style={{
                    ...styles.focusedTab,
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
                rightText="Firm"
                style={{
                  backgroundColor: Colors.transparent,
                  shadowOpacity: null,
                  shadowOffset: { width: 0, height: 0 },
                  shadowRadius: null,
                  elevation: null,
                }}
              />
              {!isEdit && (
                <Card style={styles.card}>
                  <Text style={Styles.mainHead}>USER DETAILS</Text>
                  {userData.docflag === "N" && (
                    <View
                      style={{
                        ...styles.errorContainer,
                        display: formType === 1 ? "none" : "flex",
                      }}
                    >
                      <Text style={styles.errorText}>
                        Please upload the User ID Proof document to proceed
                        further.
                      </Text>
                    </View>
                  )}
                  {formType === 2 && (
                    <View>
                      <View style={Styles.cntDtls}>
                        <Text style={Styles.heading}>Company Name: </Text>
                        <Text style={Styles.text}>
                          {formState.inputValues.company_name}
                        </Text>
                      </View>
                      <View style={Styles.cntDtls}>
                        <Text style={Styles.heading}>Registered Address: </Text>
                        <Text style={Styles.text}>
                          {formState.inputValues.company_reg_address}
                        </Text>
                      </View>
                      <View style={Styles.cntDtls}>
                        <Text style={Styles.heading}>GST Number: </Text>
                        <Text style={Styles.text}>
                          {formState.inputValues.company_gstn}
                        </Text>
                      </View>
                    </View>
                  )}
                  <View style={Styles.cntDtls}>
                    <Text style={Styles.heading}>Name Of Owner: </Text>
                    <Text style={Styles.text}>
                      {formState.inputValues.owner_name}
                    </Text>
                  </View>
                  <View style={Styles.cntDtls}>
                    <Text style={Styles.heading}>Mobile Number: </Text>
                    <Text style={Styles.text}>
                      {formState.inputValues.owner_mobile}
                    </Text>
                  </View>
                  <View style={Styles.cntDtls}>
                    <Text style={Styles.heading}>Email Address: </Text>
                    <Text style={Styles.text}>
                      {formState.inputValues.owner_email}
                    </Text>
                  </View>
                  <View style={Styles.cntDtls}>
                    <Text style={Styles.heading}>Address Details: </Text>
                    <Text style={Styles.text}>
                      {formState.inputValues.owner_address}
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
                <View style={styles.formContainer}>
                  <TextField
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    formType={formType}
                    style={{ display: formType === 1 ? "none" : "flex" }}
                    value={formState.inputValues.company_name}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.company_name}
                    id="company_name"
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
                  {!formState.inputValidities.company_name &&
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
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    formType={formType}
                    style={{ display: formType === 1 ? "none" : "flex" }}
                    value={formState.inputValues.company_reg_address}
                    isSubmitted={isSubmitted}
                    initiallyValid={
                      formState.inputValidities.company_reg_address
                    }
                    id="company_reg_address"
                    required
                    onInputChange={inputChangeHandler}
                    label={
                      <Text>
                        Registered Address
                        <Text style={styles.required}>*</Text>
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
                  {!formState.inputValidities.company_reg_address &&
                    isSubmitted &&
                    formType === 2 && (
                      <View
                        style={{
                          ...styles.errorContainer,
                          display: formType === 1 ? "none" : "flex",
                        }}
                      >
                        <Text style={styles.errorText}>
                          Please enter valid company registered address.
                        </Text>
                      </View>
                    )}
                  <RaisedButton
                    style={{
                      ...styles.fileUploadBtn,
                      display: formType === 1 ? "none" : "flex",
                      backgroundColor:
                        formState.inputValues.company_regno_doc === ""
                          ? Colors.primary
                          : Colors.success,
                    }}
                    title="Registration Doc"
                    onPress={() => {
                      setCurrentPicker("company_regno_doc");
                      setImagePicker(true);
                    }}
                  />
                  {!formState.inputValidities.company_regno_doc &&
                    isSubmitted &&
                    formType === 2 && (
                      <Text style={styles.errorText}>
                        Please upload company registration document.
                      </Text>
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
                    onInputChange={inputChangeHandler}
                    label="GST Number"
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
                          ...styles.errorContainer,
                          display: formType === 1 ? "none" : "flex",
                        }}
                      >
                        <Text style={styles.errorText}>
                          Please enter valid company GST number.
                        </Text>
                      </View>
                    )}
                  <RaisedButton
                    style={{
                      ...styles.fileUploadBtn,
                      display: formType === 1 ? "none" : "flex",
                      backgroundColor:
                        formState.inputValues.company_gstn_doc === ""
                          ? Colors.primary
                          : Colors.success,
                    }}
                    title="Upload GST"
                    onPress={() => {
                      setCurrentPicker("company_gstn_doc");
                      setImagePicker(true);
                    }}
                  />
                  {!formState.inputValidities.company_gstn_doc &&
                    isSubmitted &&
                    formType === 2 && (
                      <Text style={styles.errorText}>
                        Please upload valid GST certificate.
                      </Text>
                    )}
                  <View
                    style={{
                      ...styles.separator,
                      display: formType === 1 ? "none" : "flex",
                    }}
                  ></View>
                  <TextField
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    formType={formType}
                    value={formState.inputValues.owner_name}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.owner_name}
                    id="owner_name"
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
                  <RaisedButton
                    style={{
                      ...styles.fileUploadBtn,
                      display: formType === 1 ? "none" : "flex",
                      backgroundColor:
                        formState.inputValues.owner_idno_doc === ""
                          ? Colors.primary
                          : Colors.success,
                    }}
                    title="Upload ID Proof"
                    onPress={() => {
                      setCurrentPicker("owner_idno_doc");
                      setImagePicker(true);
                    }}
                  />
                  {!formState.inputValidities.owner_idno_doc &&
                    isSubmitted &&
                    formType === 2 && (
                      <Text style={styles.errorText}>
                        Please upload valid id proof.
                      </Text>
                    )}
                  <TextField
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    formType={formType}
                    value={formState.inputValues.owner_mobile}
                    mobileNumber
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.owner_mobile}
                    id="owner_mobile"
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
                    value={formState.inputValues.owner_email}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.owner_email}
                    id="owner_email"
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
                    value={formState.inputValues.owner_address}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.owner_address}
                    required
                    id="owner_address"
                    onInputChange={inputChangeHandler}
                    errorText="Please enter valid address details."
                    label={
                      <Text>
                        Address Details<Text style={styles.required}>*</Text>
                      </Text>
                    }
                    leadingIcon={
                      <Ionicons
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
                  <View style={Styles.actionsContainer}>
                    <View style={Styles.btnContainer}>
                      <RaisedButton
                        title="UPDATE"
                        onPress={updateUserProfile}
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
              <Card style={{ ...styles.card, marginTop: 40 }}>
                <View style={styles.passFormContainer}>
                  <TextField
                    readonly={true}
                    value={userData.loginid}
                    label={
                      <Text>
                        User Id
                        <Text style={styles.required}>*</Text>
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
                        <Text style={styles.required}>*</Text>
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
                        <Text style={styles.required}>*</Text>
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
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>
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
    alignItems: "center",
  },
  ScreenSwitchContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primaryDark,
    overflow: "hidden",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  leftTextCon: {
    width: "50%",
    height: 50,
    paddingLeft: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    paddingVertical: 8,
  },
  rightTextCon: {
    width: "50%",
    height: 50,
    paddingRight: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    paddingVertical: 8,
    backgroundColor: Colors.success,
  },
  focusedTab: {
    fontFamily: "open-sans",
    fontSize: 13,
    color: "#fff",
  },
  screen: {
    flex: 1,
    width: window.width,
    flexDirection: "column",
  },
  card: {
    alignSelf: "center",
    width: "95%",
  },
  formContainer: {
    alignSelf: "center",
    marginTop: 20,
    alignItems: "center",
    width: window.width * 0.9,
    backgroundColor: Colors.semiTransparentBlack,
    borderRadius: 8,
    paddingVertical: 20,
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
  errorText: {
    fontFamily: "open-sans",
    color: Colors.danger,
    fontSize: 13,
  },
  fileUploadBtn: {
    paddingVertical: 5,
    marginVertical: 10,
    width: 200,
  },
  separator: {
    width: "90%",
    height: 2,
    backgroundColor: Colors.danger,
    marginVertical: 10,
  },
  required: {
    color: "red",
  },
  passFormContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default UserProfileScreen;
