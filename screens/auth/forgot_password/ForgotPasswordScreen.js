import React, { useState, useReducer, useCallback, useEffect } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import TextField from "../../../shared/components/TextField";
import AuthScreenContainer from "../../../shared/components/AuthScreenContainer";
import RaisedButton from "../../../shared/components/RaisedButton";
import TextButton from "../../../shared/components/TextButton";
import Colors from "../../../shared/constants/Colors";
import ProgressIndicator from "../../../shared/UI/ProgressIndicator";
import * as authActions from "../../../store/action/auth";
import {
  FORM_INPUT_UPDATE,
  formReducer,
  RESET_FORM,
} from "../../../shared/Functions/FormReducer";

const initialFormState = {
  inputValues: {
    userid: "",
    otp: "",
    password: "",
    confirmPassword: "",
  },
  inputValidities: {
    userid: false,
    otp: false,
    password: false,
    confirmPassword: false,
  },
  formIsValid: false,
};

const ForgotPasswordScreen = (props) => {
  const { navigation } = props;
  const [readonly, setReadOnly] = useState(false);
  const [error, setError] = useState();
  const [cnfPwdCheck, setCnfPwdCheck] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState({
    state: false,
    msg: "Loading...",
  });
  const [formState, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const Icon = Ionicons;

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  useEffect(() => {
    if (!isFocused) {
      dispatchFormState({
        type: RESET_FORM,
        initialFormState: initialFormState,
      });
      setReadOnly(false);
      setIsSubmitted(false);
    }
  }, [isFocused]);

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

  const getOtp = async () => {
    const data = formState.inputValues;
    if (data.userid === "") {
      Alert.alert("An Error Occurred", "Please enter user id.", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null);
    setIsLoading({ state: true, msg: "Sending OTP..." });
    try {
      const result = await dispatch(authActions.getOtpForgotPass(data.userid));
      setIsLoading({ state: false, msg: "" });
      if (result.Result === "OK") {
        setReadOnly(true);
        Alert.alert("Message", "OTP sent on your registered mobile number.", [
          { text: "Okay" },
        ]);
      }
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  const updatePassword = async () => {
    const formData = formState.inputValues;
    if (!formState.formIsValid && !cnfPwdCheck) {
      Alert.alert("An Error Occurred", "Please check errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    const data = {
      userid: formData.userid,
      password: formData.password,
      otp: formData.otp,
    };
    setError(null);
    setIsLoading({ state: true, msg: "Updating..." });
    try {
      const result = await dispatch(authActions.forgotPasswordUpdate(data));
      setIsLoading({ state: false, msg: "" });
      setReadOnly(true);
      navigation.goBack();
      Alert.alert("Success", result.Msg, [{ text: "Okay" }]);
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  return (
    <AuthScreenContainer navigation={navigation}>
      {isLoading.state && <ProgressIndicator msg={isLoading.msg} />}
      <View style={styles.titleView}>
        <Text style={styles.title}>FORGOT PASSWORD</Text>
      </View>
      <TextField
        value={formState.inputValues.userid}
        isSubmitted={readonly}
        readonly={readonly}
        initiallyValid={formState.inputValidities.userid}
        id="userid"
        required
        onInputChange={inputChangeHandler}
        errorText="Please enter valid user id."
        label={
          <Text>
            User Id
            <Text style={styles.required}>*</Text>
          </Text>
        }
        leadingIcon={<Icon name="person-outline" size={25} color="black" />}
      />
      {readonly && (
        <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
          <TextField
            value={formState.inputValues.otp}
            mobileNumber
            isSubmitted={isSubmitted}
            initiallyValid={formState.inputValidities.otp}
            id="otp"
            min={99999}
            max={1000000}
            required
            onInputChange={inputChangeHandler}
            errorText="Please enter valid otp."
            maxLength={6}
            keyboardType="numeric"
            label={
              <Text>
                Enter 6 digit OTP<Text style={styles.required}>*</Text>
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
            value={formState.inputValues.password}
            onEndEditing={confirmPasswordHandler}
            isSubmitted={isSubmitted}
            initiallyValid={formState.inputValidities.password}
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
            value={formState.inputValues.confirmPassword}
            onEndEditing={confirmPasswordHandler}
            isSubmitted={isSubmitted}
            initiallyValid={formState.inputValidities.confirmPassword}
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
        </View>
      )}
      {!readonly && (
        <RaisedButton
          style={styles.getOtpBtn}
          title="GET OTP"
          onPress={getOtp}
        />
      )}
      {readonly && (
        <RaisedButton
          style={styles.getOtpBtn}
          title="SUBMIT"
          onPress={updatePassword}
        />
      )}
      <TextButton
        title="Back To Login"
        onPress={() => {
          navigation.goBack();
        }}
      />
    </AuthScreenContainer>
  );
};

const styles = StyleSheet.create({
  titleView: {
    margin: 10,
  },
  title: {
    color: "red",
    fontFamily: "open-sans-bold",
    fontSize: 20,
  },
  getOtpBtn: {
    marginVertical: 15,
    paddingVertical: 5,
    backgroundColor: Colors.danger,
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
});

export default ForgotPasswordScreen;
