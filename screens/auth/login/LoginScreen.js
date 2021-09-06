import React, { useReducer, useState, useCallback, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import AuthScreenContainer from "../../../shared/components/AuthScreenContainer";
import ProgressIndicator from "../../../shared/UI/ProgressIndicator";
import TextField from "../../../shared/components/TextField";
import RaisedButton from "../../../shared/components/RaisedButton";
import TextButton from "../../../shared/components/TextButton";
import Colors from "../../../shared/constants/Colors";
import * as authActions from "../../../store/action/auth";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const initialFormState = {
  inputValues: {
    userId: "",
    password: "",
  },
  inputValidities: {
    userId: false,
    password: false,
  },
  formIsValid: false,
};

const formReducer = (state, action) => {
  switch (action.type) {
    case FORM_INPUT_UPDATE:
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value,
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid,
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }
      return {
        inputValues: updatedValues,
        inputValidities: updatedValidities,
        formIsValid: updatedFormIsValid,
      };

    case RESET_FORM:
      return initialFormState;

    default:
      return state;
  }
};

const LoginScreen = (props) => {
  let Icon = Ionicons;
  let TouchableCmp = TouchableOpacity;
  const { navigation } = props;
  const [isSubLoader, setIsSubLoader] = useState(false);
  const [isSecureText, setIsSecureText] = useState(true);
  const [error, setError] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formState, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );
  const userType = useSelector((state) => state.auth.usrtyp);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

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
    if (!formState.formIsValid) {
      Alert.alert("Wrong Input", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null);
    setIsSubLoader(true);
    try {
      const formData = formState.inputValues;
      const result = await dispatch(authActions.login(formData));
      setIsSubLoader(false);
      result.Record.usrtyp === "T"
        ? navigation.navigate("transpHome")
        : navigation.navigate("userHome");
    } catch (err) {
      setError(err.message);
      setIsSubLoader(false);
    }
  };

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <AuthScreenContainer
      navigation={navigation}
      preventBackground={isSubLoader}
    >
      {isSubLoader && <ProgressIndicator msg="Logging in..." />}
      <View style={styles.titleView}>
        <Text style={styles.title}>LOGIN</Text>
      </View>
      <TextField
        isSubmitted={isSubmitted}
        initiallyValid={false}
        id="userId"
        required
        onInputChange={inputChangeHandler}
        errorText="Please enter valid user id."
        label="User Id"
        leadingIcon={<Icon name="person-outline" size={25} color="black" />}
      />
      <TextField
        isSubmitted={isSubmitted}
        initiallyValid={false}
        id="password"
        required
        onInputChange={inputChangeHandler}
        errorText="Please enter valid password."
        secureTextEntry={isSecureText}
        label="Password"
        leadingIcon={
          <Icon name="md-lock-closed-outline" size={25} color="black" />
        }
        trailingIcon={
          <TouchableCmp onPress={() => setIsSecureText(!isSecureText)}>
            <View>
              {isSecureText && (
                <Icon name="md-eye-off-outline" size={25} color="black" />
              )}
              {!isSecureText && (
                <Icon name="md-eye-outline" size={25} color="black" />
              )}
            </View>
          </TouchableCmp>
        }
      />
      <RaisedButton
        style={styles.loginButton}
        title="LOGIN"
        onPress={formSubmitHandler}
      />
      <TextButton
        title="Forgot Login Password"
        onPress={() => {
          navigation.navigate("ForgotPwd");
        }}
      />
      <RaisedButton
        style={styles.transpRegBtn}
        title="Transporter Registration"
        onPress={() => {
          navigation.navigate("TrnspReg");
        }}
      />
      <RaisedButton
        style={styles.userRegBtn}
        title="User Registration"
        onPress={() => {
          navigation.navigate("UserReg");
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
  loginButton: {
    marginVertical: 15,
    width: "80%",
  },
  transpRegBtn: {
    backgroundColor: Colors.danger,
    width: "80%",
  },
  userRegBtn: {
    backgroundColor: Colors.primary,
    width: "80%",
  },
});

export default LoginScreen;
