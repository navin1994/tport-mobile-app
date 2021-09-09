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
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useDispatch } from "react-redux";

import SwitchTab from "../../shared/UI/SwitchTab";
import Colors from "../../shared/constants/Colors";
import HeaderLeft from "../../shared/components/HeaderLeft";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import TextField from "../../shared/components/TextField";
import RaisedButton from "../../shared/components/RaisedButton";
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
  const dispatch = useDispatch();
  const [formType, setFormType] = useState(1);
  const [formState, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isSubLoader, setIsSubLoader] = useState(false);
  const [error, setError] = useState();
  const [isChecked, setChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cnfPwdCheck, setCnfPwdCheck] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserIdValid, setIsUserIdValid] = useState(userIdValObj);
  const { navigation } = props;

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const formTypeHandler = (formNumber) => {
    setFormType(formNumber);
  };

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

            <View
              style={{
                ...styles.separator,
                display: formType === 1 ? "none" : "flex",
              }}
            ></View>
            <TextField
              style={{ display: formType === 1 ? "none" : "flex" }}
              // value={formState.inputValues.userId}
              isSubmitted={isSubmitted}
              initiallyValid={false}
              // id="userId"
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
              style={{ display: formType === 1 ? "none" : "flex" }}
              // value={formState.inputValues.userId}
              isSubmitted={isSubmitted}
              initiallyValid={false}
              // id="userId"
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
              onPress={() => {}}
            />
            <TextField
              style={{ display: formType === 1 ? "none" : "flex" }}
              // value={formState.inputValues.userId}
              isSubmitted={isSubmitted}
              initiallyValid={false}
              // id="userId"
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
              onPress={() => {}}
            />
            <TextField
              style={{ display: formType === 1 ? "none" : "flex" }}
              // value={formState.inputValues.userId}
              isSubmitted={isSubmitted}
              initiallyValid={false}
              // id="userId"
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
              style={{ display: formType === 1 ? "none" : "flex" }}
              // value={formState.inputValues.userId}
              isSubmitted={isSubmitted}
              initiallyValid={false}
              // id="userId"
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
              onPress={() => {}}
            />
            <TextField
              style={{ display: formType === 1 ? "none" : "flex" }}
              // value={formState.inputValues.userId}
              isSubmitted={isSubmitted}
              initiallyValid={false}
              // id="userId"
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
            <View style={styles.separator}></View>
            <TextField
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
              value={formState.inputValues.emailAddress}
              isSubmitted={isSubmitted}
              initiallyValid={true}
              id="emailAddress"
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
              // value={formState.inputValues.emailAddress}
              isSubmitted={isSubmitted}
              initiallyValid={false}
              required
              // id="emailAddress"
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
              // value={formState.inputValues.emailAddress}
              isSubmitted={isSubmitted}
              initiallyValid={false}
              required
              // id="emailAddress"
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
              // value={formState.inputValues.emailAddress}
              isSubmitted={isSubmitted}
              initiallyValid={false}
              required
              // id="emailAddress"
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
              onPress={() => {}}
            />
            <TextField
              // value={formState.inputValues.emailAddress}
              isSubmitted={isSubmitted}
              initiallyValid={false}
              required
              // id="emailAddress"
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
              onPress={() => {}}
            />
            <View style={styles.separator}></View>
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
});

export default TransporterRegistrationScreen;
