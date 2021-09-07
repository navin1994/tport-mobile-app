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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import SwitchTab from "../../shared/UI/SwitchTab";
import Colors from "../../shared/constants/Colors";
import HeaderLeft from "../../shared/components/HeaderLeft";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import TextField from "../../shared/components/TextField";
import {
  formReducer,
  FORM_INPUT_UPDATE,
} from "../../shared/Functions/FormReducer";

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

const TransporterRegistrationScreen = (props) => {
  const Icon = Ionicons;
  const [formType, setFormType] = useState(1);
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
  const [isUserIdAvailable, setUserIdAvailable] = useState(false);
  const [isUserIdValid, setIsUserIdValid] = useState({
    flag: true,
    errorMsg: "",
  });
  const { navigation } = props;

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const formTypeHandler = (formNumber) => {
    setFormType(formNumber);
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
            <TextField
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
});

export default TransporterRegistrationScreen;
