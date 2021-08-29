import React, { useLayoutEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AuthScreenContainer from "../../../shared/components/AuthScreenContainer";
import TextField from "../../../shared/components/TextField";
import RaisedButton from "../../../shared/components/RaisedButton";
import TextButton from "../../../shared/components/TextButton";
import Colors from "../../../shared/constants/Colors";

const LoginScreen = (props) => {
  const { navigation } = props;

  return (
    <AuthScreenContainer navigation={navigation}>
      <View style={styles.titleView}>
        <Text style={styles.title}>LOGIN</Text>
      </View>
      <TextField
        label="User Id"
        leadingIcon={<Ionicons name="person-outline" size={25} color="black" />}
      />
      <TextField
        label="Password"
        leadingIcon={
          <Ionicons name="md-lock-closed-outline" size={25} color="black" />
        }
        trailingIcon={
          <Ionicons name="md-eye-off-outline" size={25} color="black" />
        }
      />
      <RaisedButton
        style={styles.loginButton}
        title="LOGIN"
        onPress={() => {}}
      />
      <TextButton
        title="Forgot Login Pasword"
        onPress={() => {
          navigation.navigate("ForgotPwd");
        }}
      />
      <RaisedButton
        style={styles.transpRegBtn}
        title="Transporter Registration"
        onPress={() => {
          navigation.navigate("TrnspReg");
        }}
      />
      <RaisedButton
        style={styles.userRegBtn}
        title="User Registration"
        onPress={() => {
          navigation.navigate("UserReg");
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
  loginButton: {
    marginVertical: 15,
    width: "80%",
  },
  transpRegBtn: {
    backgroundColor: Colors.danger,
    width: "80%",
  },
  userRegBtn: {
    backgroundColor: Colors.primary,
    width: "80%",
  },
});

export default LoginScreen;
