import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { FontAwesome } from "@expo/vector-icons";

const DropdownSelect = (props) => {
  const { reset } = props;
  const dropdownRef = useRef({});
  useEffect(() => {
    dropdownRef.current.reset();
  }, [reset]);
  return (
    <View style={{ ...styles.container, ...props.style }}>
      {props.label && (
        <View
          style={{ ...styles.labelContainer, ...props.labelContainerStyle }}
        >
          <Text style={{ ...styles.label, ...props.labelStyle }}>
            {props.label}
          </Text>
        </View>
      )}
      <SelectDropdown
        {...props}
        ref={dropdownRef}
        buttonStyle={{ ...styles.dropdownBtnStyle, ...props.dropdownBtnStyle }}
        dropdownStyle={{
          ...styles.dropdownDropdownStyle,
          ...props.dropdownDropdownStyle,
        }}
        rowStyle={{ ...styles.dropdownRowStyle, ...props.dropdownRowStyle }}
        rowTextStyle={{
          ...styles.dropdownRowTxtStyle,
          ...props.dropdownRowTxtStyle,
        }}
        dropdownIconPosition={"right"}
        renderDropdownIcon={() => {
          return <FontAwesome name="chevron-down" color={"#444"} size={15} />;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownBtnStyle: {
    width: "90%",
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  dropdownDropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdownRowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdownRowTxtStyle: {
    color: "#444",
    textAlign: "left",
    fontFamily: "open-sans",
  },
  label: {
    color: "black",
    fontSize: 14,
    fontFamily: "open-sans",
  },
  labelContainer: {
    position: "absolute",
    left: 20,
    top: -12,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    borderRadius: 5,
  },
});

export default DropdownSelect;
