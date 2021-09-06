import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Colors from "../shared/constants/Colors";
import TAndCModalScreen from "../screens/modals/TAndCModalScreen";
import LoginScreen from "../screens/auth/login/LoginScreen";
import ForgotPasswordScreen from "../screens/auth/forgot_password/ForgotPasswordScreen";
import TransporterRegistrationScreen from "../screens/transporter/TransporterRegistrationScreen";
import UserRegistrationScreen from "../screens/user/UserRegistrationScreen";
import UserDashboardScreen from "../screens/user/UserDashboardScreen";
import TransporterDashboardScreen from "../screens/transporter/TransporterDashboardScreen";

const Stack = createNativeStackNavigator();

const TportNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.titleBackground,
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontFamily: "open-sans-bold",
          },
          headerTitleAlign: "center",
        }}
      >
        <Stack.Group>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPwd"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TrnspReg"
            component={TransporterRegistrationScreen}
            options={{ title: "Transporter Registration" }}
          />
          <Stack.Screen name="UserReg" component={UserRegistrationScreen} />
          <Stack.Screen
            name="transpHome"
            component={TransporterDashboardScreen}
            options={{ title: "Transporter Dashboard" }}
          />
          <Stack.Screen
            name="userHome"
            component={UserDashboardScreen}
            options={{ title: "User Dashboard" }}
          />
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen
            name="TAndCModal"
            component={TAndCModalScreen}
            options={{ title: "T-Port(Transport Freight)" }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default TportNavigation;
