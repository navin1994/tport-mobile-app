import React, { useLayoutEffect, useState, useReducer } from "react";
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
      formIsValid: action.updatedFormIsValid,
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

  const [isSelected, setSelection] = useState(false);
  const { navigation } = props;
  let Icon = Ionicons;
  let TouchableCmp = TouchableOpacity;

  const inputChangeHandler = (identifier, text) => {
    let isValid = false;
    if (text.trim().length > 0) {
      isValid = true;
    }
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: text,
      isValid: isValid,
      input: identifier,
    });
  };

  const formSubmitHandler = () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong Input", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    if (!isSelected) {
      Alert.alert("Error", "Please accept the terms and conditions.", [
        { text: "Okay" },
      ]);
      return;
    }

    console.log("Form is submitted");
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
              value={formState.inputValues.userId}
              onChangeText={inputChangeHandler.bind(this, "userId")}
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
            {!formState.inputValidities.userId && (
              <Text>Please enter valid user id.</Text>
            )}
            <TextField
              secureTextEntry={true}
              value={formState.inputValues.password}
              onChangeText={inputChangeHandler.bind(this, "password")}
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
              secureTextEntry={true}
              value={formState.inputValues.confirmPassword}
              onChangeText={inputChangeHandler.bind(this, "confirmPassword")}
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
            <TextField
              value={formState.inputValues.ownerName}
              onChangeText={inputChangeHandler.bind(this, "ownerName")}
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
              maxLength={10}
              keyboardType="phone-pad"
              value={formState.inputValues.mobileNumber}
              onChangeText={inputChangeHandler.bind(this, "mobileNumber")}
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
              keyboardType="email-address"
              value={formState.inputValues.emailAddress}
              onChangeText={inputChangeHandler.bind(this, "emailAddress")}
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
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                <View style={styles.checkboxContainer}>
                  <CheckBox value={isSelected} onValueChange={setSelection} />
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
    backgroundColor: "white",
    height: 20,
    width: 20,
  },
});

export default UserRegistrationScreen;
