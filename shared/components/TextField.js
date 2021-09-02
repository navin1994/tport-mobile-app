import React, { useReducer, useEffect } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

import Colors from "../constants/Colors";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

const TextField = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: "",
    isValid: props.initiallyValid,
    touched: false,
  });

  const { onInputChange, id, isSubmitted, errorText } = props;

  // useEffect(() => {
  //   if (inputState.touched) {
  //     onInputChange(id, inputState.value, inputState.isValid);
  //   }
  // }, [inputState, onInputChange, id]);

  const textChangeHandler = (text) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (
      props.email &&
      text.trim().length !== 0 &&
      !emailRegex.test(text.toLowerCase())
    ) {
      isValid = false;
    }
    if (props.secureTextEntry && text !== props.password) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };

  // const lostFocusHandler = () => {
  //   dispatch({ type: INPUT_BLUR });
  // };

  return (
    <View>
      <View style={{ ...styles.inputContainer, ...props.style }}>
        <View
          style={{ ...styles.LabelContainer, ...props.labelContainerStyle }}
        >
          <Text style={{ ...styles.label, ...props.labelStyle }}>
            {props.label}
          </Text>
        </View>
        {props.leadingIcon}
        <TextInput
          {...props}
          style={{ ...styles.input, ...props.fontSize }}
          value={inputState.value}
          onChangeText={textChangeHandler}
          onBlur={() => onInputChange(id, inputState.value, inputState.isValid)}
        />
        {props.trailingIcon}
      </View>
      {!inputState.isValid && isSubmitted && (
        <Text style={styles.errorText}>{errorText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
    height: 40,
    width: "80%",
    paddingLeft: 5,
    paddingRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 6,
  },
  label: {
    color: "black",
    fontSize: 14,
    fontFamily: "open-sans",
  },
  LabelContainer: {
    position: "absolute",
    left: 20,
    top: -12,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  errorText: { fontFamily: "open-sans", color: Colors.danger, fontSize: 13 },
});

export default TextField;