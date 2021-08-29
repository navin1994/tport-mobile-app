import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/login/LoginScreen";
import ForgotPasswordScreen from "../screens/auth/forgot_password/ForgotPasswordScreen";
import TransporterRegistrationScreen from "../screens/transporter/TransporterRegistrationScreen";
import UserRegistrationScreen from "../screens/user/UserRegistrationScreen";
import Colors from "../shared/constants/Colors";

const Stack = createNativeStackNavigator();

const TportNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.titleBackgroundColor,
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontFamily: "open-sans-bold",
          },
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPwd" component={ForgotPasswordScreen} />
        <Stack.Screen
          name="TrnspReg"
          component={TransporterRegistrationScreen}
        />
        <Stack.Screen name="UserReg" component={UserRegistrationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default TportNavigation;
