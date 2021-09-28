import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  FontAwesome,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import SwitchTab from "../UI/SwitchTab";
import { userIdValidator, userIdValObj } from "../Functions/Validators";
import TextField from "./TextField";
import RaisedButton from "./RaisedButton";
import Colors from "../constants/Colors";
import ImageDocPicker from "./ImageDocPicker";
import * as transporterActions from "../../store/action/transporter";

const window = Dimensions.get("window");

const TransporterRegistrationForm = (props) => {
  const [formType, setFormType] = useState(1);
  const [currentPicker, setCurrentPicker] = useState();
  const [showImagePicker, setImagePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [cnfPwdCheck, setCnfPwdCheck] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUserIdValid, setIsUserIdValid] = useState(userIdValObj);
  const Icon = Ionicons;
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.transp);

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

  const formTypeHandler = (formNumber) => {
    const formData = formState.inputValues;
    setFormType(formNumber);
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
    if (formNumber === 2) {
      if (formData.companyregdoc === "" || formData.companyregdoc == null) {
        inputChangeHandler("companyregdoc", formData.companyregdoc, false);
      }
      if (formData.companypandoc === "" || formData.companypandoc == null) {
        inputChangeHandler("companypandoc", formData.companypandoc, false);
      }
      if (formData.companygstdoc === "" || formData.companygstdoc == null) {
        inputChangeHandler("companygstdoc", formData.companygstdoc, false);
      }
    }
  };

  const onNext = () => {
    const { next } = props;
    setIsSubmitted(true);
    formTypeHandler(formType);
    if (!formState.formIsValid || !cnfPwdCheck) {
      Alert.alert("Wrong Input", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    if (!isUserIdValid.avlFlag) {
      Alert.alert(
        "Wrong Input",
        "Please check that user id is available or not.",
        [{ text: "Okay" }]
      );
      return;
    }
    setIsSubmitted(false);
    next();
  };

  const onCloseModal = useCallback(() => {
    setImagePicker(false);
  }, [showImagePicker]);

  return (
    <View style={{ ...styles.container, ...props.style }}>
      <SwitchTab onFormChange={formTypeHandler} formType={formType} />
      <ImageDocPicker
        inputchangeHandler={inputChangeHandler}
        visible={showImagePicker}
        isMultiple={false}
        id={currentPicker}
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
        initiallyValid={formState.inputValidities.companyname}
        id="companyname"
        required
        onInputChange={inputChangeHandler}
        label={
          <Text>
            Company Name
            <Text style={styles.required}>*</Text>
          </Text>
        }
        leadingIcon={<FontAwesome name="building-o" size={25} color="black" />}
      />

      {!formState.inputValidities.companyname && isSubmitted && formType === 2 && (
        <View
          style={{
            ...styles.errorContainer,
            display: formType === 1 ? "none" : "flex",
          }}
        >
          <Text style={styles.errorText}>Please enter valid company name.</Text>
        </View>
      )}
      <TextField
        formType={formType}
        style={{ display: formType === 1 ? "none" : "flex" }}
        value={formState.inputValues.companyregno}
        isSubmitted={isSubmitted}
        initiallyValid={formState.inputValidities.companyregno}
        id="companyregno"
        required
        onInputChange={inputChangeHandler}
        label={
          <Text>
            Registration Number
            <Text style={styles.required}>*</Text>
          </Text>
        }
        leadingIcon={
          <MaterialIcons name="app-registration" size={25} color="black" />
        }
      />
      {!formState.inputValidities.companyregno &&
        isSubmitted &&
        formType === 2 && (
          <View
            style={{
              ...styles.errorContainer,
              display: formType === 1 ? "none" : "flex",
            }}
          >
            <Text style={styles.errorText}>
              Please enter valid registration number.
            </Text>
          </View>
        )}
      <RaisedButton
        style={{
          ...styles.fileUploadBtn,
          display: formType === 1 ? "none" : "flex",
          backgroundColor:
            formState.inputValues.companyregdoc === ""
              ? Colors.primary
              : Colors.success,
        }}
        title="Registration Doc"
        onPress={() => {
          setCurrentPicker("companyregdoc");
          setImagePicker(true);
        }}
      />
      {!formState.inputValidities.companyregdoc &&
        isSubmitted &&
        formType === 2 && (
          <Text style={styles.errorText}>
            Please upload registration document
          </Text>
        )}
      <TextField
        formType={formType}
        style={{ display: formType === 1 ? "none" : "flex" }}
        value={formState.inputValues.comapnypanno}
        isSubmitted={isSubmitted}
        initiallyValid={formState.inputValidities.comapnypanno}
        id="comapnypanno"
        required
        onInputChange={inputChangeHandler}
        label={
          <Text>
            Company PAN
            <Text style={styles.required}>*</Text>
          </Text>
        }
        leadingIcon={<FontAwesome name="vcard-o" size={25} color="black" />}
      />
      {!formState.inputValidities.comapnypanno &&
        isSubmitted &&
        formType === 2 && (
          <View
            style={{
              ...styles.errorContainer,
              display: formType === 1 ? "none" : "flex",
            }}
          >
            <Text style={styles.errorText}>
              Please enter valid company PAN.
            </Text>
          </View>
        )}
      <RaisedButton
        style={{
          ...styles.fileUploadBtn,
          display: formType === 1 ? "none" : "flex",
          backgroundColor:
            formState.inputValues.companypandoc === ""
              ? Colors.primary
              : Colors.success,
        }}
        title="PAN Doc"
        onPress={() => {
          setCurrentPicker("companypandoc");
          setImagePicker(true);
        }}
      />
      {!formState.inputValidities.companypandoc &&
        isSubmitted &&
        formType === 2 && (
          <Text style={styles.errorText}>
            Please upload company PAN document
          </Text>
        )}
      <TextField
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
            <Text style={styles.required}>*</Text>
          </Text>
        }
        leadingIcon={<FontAwesome name="vcard-o" size={25} color="black" />}
      />
      {!formState.inputValidities.companyaddress &&
        isSubmitted &&
        formType === 2 && (
          <View
            style={{
              ...styles.errorContainer,
              display: formType === 1 ? "none" : "flex",
            }}
          >
            <Text style={styles.errorText}>
              Please enter valid registered address.
            </Text>
          </View>
        )}
      <TextField
        formType={formType}
        style={{ display: formType === 1 ? "none" : "flex" }}
        value={formState.inputValues.companygstno}
        isSubmitted={isSubmitted}
        initiallyValid={formState.inputValidities.companygstno}
        id="companygstno"
        required
        onInputChange={inputChangeHandler}
        label={
          <Text>
            Company GSTIN Number
            <Text style={styles.required}>*</Text>
          </Text>
        }
        leadingIcon={
          <MaterialCommunityIcons name="numeric" size={25} color="black" />
        }
      />
      {!formState.inputValidities.companygstno &&
        isSubmitted &&
        formType === 2 && (
          <View
            style={{
              ...styles.errorContainer,
              display: formType === 1 ? "none" : "flex",
            }}
          >
            <Text style={styles.errorText}>
              Please enter valid GSTIN number.
            </Text>
          </View>
        )}
      <RaisedButton
        style={{
          ...styles.fileUploadBtn,
          display: formType === 1 ? "none" : "flex",
          backgroundColor:
            formState.inputValues.companygstdoc === ""
              ? Colors.primary
              : Colors.success,
        }}
        title="Upload GSTIN"
        onPress={() => {
          setCurrentPicker("companygstdoc");
          setImagePicker(true);
        }}
      />
      {!formState.inputValidities.companygstdoc &&
        isSubmitted &&
        formType === 2 && (
          <Text style={styles.errorText}>
            Please upload company GSTIN document
          </Text>
        )}
      <TextField
        formType={formType}
        style={{ display: formType === 1 ? "none" : "flex" }}
        value={formState.inputValues.evgstnid}
        isSubmitted={isSubmitted}
        initiallyValid={formState.inputValidities.evgstnid}
        id="evgstnid"
        onInputChange={inputChangeHandler}
        label="E-Way GSTIN Number"
        leadingIcon={
          <MaterialCommunityIcons name="numeric" size={25} color="black" />
        }
      />
      {!formState.inputValidities.evgstnid && isSubmitted && formType === 2 && (
        <View
          style={{
            ...styles.errorContainer,
            display: formType === 1 ? "none" : "flex",
          }}
        >
          <Text style={styles.errorText}>
            Please enter valid e-way GSTIN number.
          </Text>
        </View>
      )}
      <View style={styles.separator}></View>
      <TextField
        formType={formType}
        value={formState.inputValues.loginid}
        onEndEditing={checkUserIdHandler}
        isSubmitted={isSubmitted}
        initiallyValid={formState.inputValidities.loginid}
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
        leadingIcon={<Icon name="person-outline" size={25} color="black" />}
      />
      {isLoading && (
        <View style={styles.errorContainer}>
          <Text style={styles.checkUId}>Checking user id availability...</Text>
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
        formType={formType}
        value={formState.inputValues.cnfpassword}
        onEndEditing={confirmPasswordHandler}
        isSubmitted={isSubmitted}
        initiallyValid={formState.inputValidities.cnfpassword}
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
          <Text style={styles.errorText}>Confirm password does not match!</Text>
        </View>
      )}
      <View style={styles.separator}></View>
      <TextField
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
        initiallyValid={formState.inputValidities.ownremail}
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
              Platform.OS === "android" ? "md-mail-outline" : "ios-mail-outline"
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
        initiallyValid={formState.inputValidities.ownrpincd}
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
          <MaterialCommunityIcons name="numeric" size={25} color="black" />
        }
      />
      <TextField
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
            Address Details<Text style={styles.required}>*</Text>
          </Text>
        }
        leadingIcon={
          <Icon
            name={
              Platform.OS === "android" ? "md-home-outline" : "ios-home-outline"
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
        initiallyValid={formState.inputValidities.ownridno}
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
        style={{
          ...styles.fileUploadBtn,
          backgroundColor:
            formState.inputValues.ownradhardoc === ""
              ? Colors.primary
              : Colors.success,
        }}
        title="Upload ID Proof"
        onPress={() => {
          setCurrentPicker("ownradhardoc");
          setImagePicker(true);
        }}
      />
      {!formState.inputValidities.ownradhardoc && isSubmitted && (
        <Text style={styles.errorText}>Please upload aadhar document</Text>
      )}
      <TextField
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
            PAN Number<Text style={styles.required}>*</Text>
          </Text>
        }
        leadingIcon={
          <FontAwesome name="address-card-o" size={25} color="black" />
        }
      />
      <RaisedButton
        style={{
          ...styles.fileUploadBtn,
          backgroundColor:
            formState.inputValues.ownrpandoc === ""
              ? Colors.primary
              : Colors.success,
        }}
        title="PAN Doc"
        onPress={() => {
          setCurrentPicker("ownrpandoc");
          setImagePicker(true);
        }}
      />
      {!formState.inputValidities.ownrpandoc && isSubmitted && (
        <Text style={styles.errorText}>Please upload PAN document</Text>
      )}
      <View style={styles.separator}></View>
      <RaisedButton title="Next" style={styles.nextBtn} onPress={onNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: window.width,
    alignItems: "center",
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
  checkUId: {
    fontFamily: "open-sans-bold",
    color: "black",
    fontSize: 14,
  },
  nextBtn: {
    backgroundColor: Colors.success,
    width: 150,
  },
});

export default TransporterRegistrationForm;
