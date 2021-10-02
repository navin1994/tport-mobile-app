import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native";

import Colors from "../constants/Colors";

export const SwitchTab = (props) => {
  const [formType, setFormType] = useState();
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  const { onFormChange } = props;
  const tabChangeHandler = (tabNumber) => {
    setFormType(tabNumber);
    onFormChange(tabNumber);
  };

  useEffect(() => {
    setFormType(props.formType);
  }, [props.formType]);

  return (
    <View style={styles.switchContainer}>
      <TouchableCmp onPress={() => tabChangeHandler(1)}>
        <View
          style={{
            ...styles.leftTextCon,
            backgroundColor: formType === 1 ? Colors.success : "grey",
          }}
        >
          <Text style={styles.ownershipText}>Individual</Text>
        </View>
      </TouchableCmp>
      <TouchableCmp onPress={() => tabChangeHandler(2)}>
        <View
          style={{
            ...styles.rightTextCon,
            backgroundColor: formType === 2 ? Colors.success : "grey",
          }}
        >
          <Text style={styles.ownershipText}>Transport Company</Text>
        </View>
      </TouchableCmp>
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    marginVertical: 10,
    overflow: "hidden",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  leftTextCon: {
    width: 180,
    paddingLeft: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    paddingVertical: 8,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  rightTextCon: {
    width: 180,
    paddingRight: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    paddingVertical: 8,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: Colors.success,
  },
  ownershipText: {
    fontFamily: "open-sans",
    fontSize: 13,
    color: "#fff",
  },
});

export default SwitchTab;
