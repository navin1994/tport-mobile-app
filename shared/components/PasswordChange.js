import React, { useState, useReducer } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import Card from "../UI/Card";
import Styles from "../styles/styles";
import TextField from "./TextField";

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

const PasswordChange = (props) => {
  const { changePassword, isSubmitted } = props;
  const userData = useSelector((state) => state.auth);
  const [cnfPwdCheck, setCnfPwdCheck] = useState(true);
  const [passForm, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );

  const confirmPasswordHandler = () => {
    const formvalues = passForm.inputValues;
    if (formvalues.password === formvalues.confirmPassword) {
      setCnfPwdCheck(true);
      return;
    }
    setCnfPwdCheck(false);
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

  return (
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
            <Ionicons name="md-lock-closed-outline" size={25} color="black" />
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
            <Ionicons name="md-lock-closed-outline" size={25} color="black" />
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
              onPress={() => {
                changePassword();
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
    </Card>
  );
};

const styles = StyleSheet.create({
  passFormContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PasswordChange;
