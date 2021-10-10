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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

import ProgressIndicator from "../../shared/UI/ProgressIndicator";
import HeaderLeft from "../../shared/components/HeaderLeft";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import TextField from "../../shared/components/TextField";
import RaisedButton from "../../shared/components/RaisedButton";
import * as authActions from "../../store/action/auth";
import Colors from "../../shared/constants/Colors";
import TAndCContainer from "../../shared/UI/TAndCContainer";
import Styles from "../../shared/styles/styles";
import {
  userIdValidator,
  userIdValObj,
} from "../../shared/Functions/Validators";
import {
  FORM_INPUT_UPDATE,
  RESET_FORM,
  formReducer,
} from "../../shared/Functions/FormReducer";

const window = Dimensions.get("window");

const initialFormState = {
  inputValues: {
    userId: "",
    password: "",
    confirmPassword: "",
    ownerName: "",
    mobileNumber: "",
    emailAddress: "",
  },
  inputValidities: {
    userId: false,
    password: false,
    confirmPassword: false,
    ownerName: false,
    mobileNumber: false,
    emailAddress: true,
  },
  formIsValid: false,
};

const UserRegistrationScreen = (props) => {
  const [formState, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );
  const [isSubLoader, setIsSubLoader] = useState(false);
  const [error, setError] = useState();
  const [isChecked, setChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cnfPwdCheck, setCnfPwdCheck] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserIdValid, setIsUserIdValid] = useState(userIdValObj);
  const { navigation } = props;
  let Icon = Ionicons;
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const checkUserIdHandler = async () => {
    setError(null);
    try {
      setIsLoading(true);
      const result = await userIdValidator(
        formState.inputValues.userId,
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
    if (formvalues.password === formvalues.confirmPassword) {
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

  const formSubmitHandler = async () => {
    setIsSubmitted(true);
    if (!formState.formIsValid || !cnfPwdCheck || !isUserIdValid.avlFlag) {
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
        authActions.userRegistration({
          ...formState.inputValues,
          termsCondition: isChecked,
        })
      );
      if (resData.Result === "ERR") {
        setIsSubLoader(false);
        Alert.alert("Error", resData.Msg, [{ text: "Okay" }]);
        return;
      } else if (resData.Result === "OK") {
        setIsSubLoader(false);
        setChecked(false);
        setIsSubmitted(false);
        setIsUserIdValid(userIdValObj);
        dispatchFormState({
          type: RESET_FORM,
          initialFormState: initialFormState,
        });
        navigation.goBack();
        Alert.alert("Registered", resData.Msg, [{ text: "Okay" }]);
      }
    } catch (err) {
      setIsSubLoader(false);
      setError(err.message);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "User Registration",
      headerLeft: () => (
        <HeaderLeft
          titleIcon={
            <Icon
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
      {isSubLoader && <ProgressIndicator msg="Processing user registration" />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={styles.screen}
          pointerEvents={isSubLoader ? "none" : "auto"}
        >
          <View style={styles.container}>
            <View style={styles.msgContainer}>
              <Text style={styles.msg}>
                Please register to add shipment in TPORT
              </Text>
            </View>
            <View style={styles.formContainer}>
              <TextField
                labelStyle={Styles.label}
                labelContainerStyle={Styles.labelContainer}
                value={formState.inputValues.userId}
                onEndEditing={checkUserIdHandler}
                isSubmitted={isSubmitted}
                initiallyValid={false}
                id="userId"
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
                labelStyle={Styles.label}
                labelContainerStyle={Styles.labelContainer}
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
                labelStyle={Styles.label}
                labelContainerStyle={Styles.labelContainer}
                value={formState.inputValues.confirmPassword}
                onEndEditing={confirmPasswordHandler}
                isSubmitted={isSubmitted}
                initiallyValid={false}
                id="confirmPassword"
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
              <TextField
                labelStyle={Styles.label}
                labelContainerStyle={Styles.labelContainer}
                value={formState.inputValues.ownerName}
                isSubmitted={isSubmitted}
                initiallyValid={false}
                id="ownerName"
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
                labelStyle={Styles.label}
                labelContainerStyle={Styles.labelContainer}
                value={formState.inputValues.mobileNumber}
                mobileNumber
                isSubmitted={isSubmitted}
                initiallyValid={false}
                id="mobileNumber"
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
                labelStyle={Styles.label}
                labelContainerStyle={Styles.labelContainer}
                value={formState.inputValues.emailAddress}
                isSubmitted={isSubmitted}
                initiallyValid={true}
                id="emailAddress"
                email
                onInputChange={inputChangeHandler}
                errorText="Please enter valid email address."
                keyboardType="email-address"
                label="E-Mail Address"
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
            </View>
            <TAndCContainer
              navigation={navigation}
              value={isChecked}
              onValueChange={setChecked}
            />

            <RaisedButton
              onPress={formSubmitHandler}
              style={styles.saveBtn}
              title="SAVE REGISTRATION"
            />
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: window.width,
  },
  formContainer: {
    marginTop: 20,
    alignItems: "center",
    width: window.width * 0.9,
    backgroundColor: Colors.semiTransparentBlack,
    borderRadius: 8,
    paddingVertical: 20,
  },
  msgContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6c757d",
    width: window.width * 0.9,
    height: 50,
  },

  saveBtn: {
    margin: 20,
    backgroundColor: Colors.success,
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
  msg: {
    fontFamily: "open-sans",
    color: "white",
  },
});

export default UserRegistrationScreen;
