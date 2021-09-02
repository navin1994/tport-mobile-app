import React, {
  useLayoutEffect,
  useState,
  useReducer,
  useCallback,
} from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  CheckBox,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import HeaderLeft from "../../shared/components/HeaderLeft";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import TextField from "../../shared/components/TextField";
import RaisedButton from "../../shared/components/RaisedButton";
import Colors from "../../shared/constants/Colors";

const window = Dimensions.get("window");

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
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
  }
  return state;
};

const UserRegistrationScreen = (props) => {
  const [formState, dispatchFormState] = useReducer(formReducer, {
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
  });

  const [isChecked, setChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cnfPwdCheck, setCnfPwdCheck] = useState(true);
  const [isUserIdValid, setIsUserIdValid] = useState({
    flag: true,
    errorMsg: "",
  });
  const { navigation } = props;
  let Icon = Ionicons;
  let TouchableCmp = TouchableOpacity;

  const confirmPasswordHandler = () => {
    const formControl = formState.inputValues;
    if (formControl.password === formControl.confirmPassword) {
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

  const formSubmitHandler = () => {
    setIsSubmitted(true);
    if (!formState.formIsValid || !cnfPwdCheck) {
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

    console.log("Form is submitted==> ", formState.inputValues);
  };

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "User Registration",
      headerLeft: () => (
        <HeaderLeft
          navigation={navigation}
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.screen}>
          <View style={styles.container}>
            <View style={styles.msgContainer}>
              <Text style={styles.msg}>
                Please register to add shipment in TPORT
              </Text>
            </View>
            <TextField
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
            {!isUserIdValid.flag && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{isUserIdValid.errorMsg}</Text>
              </View>
            )}
            <TextField
              onEndEditing={confirmPasswordHandler}
              isSubmitted={isSubmitted}
              password={formState.inputValues.confirmPassword}
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
              onEndEditing={confirmPasswordHandler}
              isSubmitted={isSubmitted}
              password={formState.inputValues.password}
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
            <View style={styles.tAndCContainer}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={styles.checkboxContainer}>
                  <CheckBox value={isChecked} onValueChange={setChecked} />
                </View>
                <Text style={styles.msg}>I Have Read And Agree To The</Text>
              </View>
              <TouchableCmp onPress={() => navigation.navigate("TAndCModal")}>
                <Text style={styles.clickableText}>Terms Of Service.</Text>
              </TouchableCmp>
            </View>
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
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: window.width,
  },
  msgContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6c757d",
    width: window.width * 0.9,
    height: 50,
  },
  msg: {
    fontFamily: "open-sans",
    color: "white",
  },
  saveBtn: {
    margin: 20,
    backgroundColor: Colors.success,
  },
  required: {
    color: "red",
  },
  tAndCContainer: {
    marginVertical: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    width: window.width * 0.9,
    padding: 5,
    opacity: 0.7,
  },
  clickableText: {
    fontFamily: "open-sans",
    color: "yellow",
  },
  checkboxContainer: {
    marginHorizontal: 10,
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 20,
    width: 20,
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

export default UserRegistrationScreen;
