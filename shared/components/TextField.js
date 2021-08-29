import React from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

const TextField = (props) => {
  return (
    <View style={{ ...styles.inputContainer, ...props.style }}>
      <View style={{ ...styles.LabelContainer, ...props.labelContainerStyle }}>
        <Text style={{ ...styles.label, ...props.labelStyle }}>
          {props.label}
        </Text>
      </View>
      {props.leadingIcon}
      <TextInput {...props} style={{ ...styles.input, ...props.fontSize }} />
      {props.trailingIcon}
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
    // borderColor: 'red',
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
});

export default TextField;
