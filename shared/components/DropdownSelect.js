import React from "react";
import { View, StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { FontAwesome } from "@expo/vector-icons";

const DropdownSelect = (props) => {
  return (
    <View style={{ ...styles.container, ...props.style }}>
      <SelectDropdown
        {...props}
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
});

export default DropdownSelect;
