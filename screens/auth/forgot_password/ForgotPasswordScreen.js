import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import TextField from "../../../shared/components/TextField";
import AuthScreenContainer from "../../../shared/components/AuthScreenContainer";
import RaisedButton from "../../../shared/components/RaisedButton";
import TextButton from "../../../shared/components/TextButton";
import Colors from "../../../shared/constants/Colors";

const ForgotPasswordScreen = (props) => {
  const { navigation } = props;
  return (
    <AuthScreenContainer navigation={navigation}>
      <View style={styles.titleView}>
        <Text style={styles.title}>FORGOT PASSWORD</Text>
      </View>
      <TextField
        label="User Id"
        leadingIcon={<Ionicons name="person-outline" size={25} color="black" />}
      />
      <RaisedButton
        style={styles.getOtpBtn}
        title="GET OTP"
        onPress={() => {}}
      />
      <TextButton
        title="Back To Login"
        onPress={() => {
          navigation.goBack();
        }}
      />
    </AuthScreenContainer>
  );
};

const styles = StyleSheet.create({
  titleView: {
    margin: 10,
  },
  title: {
    color: "red",
    fontFamily: "open-sans-bold",
    fontSize: 20,
  },
  getOtpBtn: {
    marginVertical: 15,
    paddingVertical: 5,
    backgroundColor: Colors.danger,
  },
});

export default ForgotPasswordScreen;
