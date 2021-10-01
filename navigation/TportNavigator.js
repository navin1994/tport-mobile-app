import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";

import Colors from "../shared/constants/Colors";
import TAndCModalScreen from "../screens/modals/TAndCModalScreen";
import LoginScreen from "../screens/auth/login/LoginScreen";
import ForgotPasswordScreen from "../screens/auth/forgot_password/ForgotPasswordScreen";
import TransporterRegistrationScreen from "../screens/transporter/TransporterRegistrationScreen";
import UserRegistrationScreen from "../screens/user/UserRegistrationScreen";
import UserNavigator from "./UserNavigator";
import TransporterNavigator from "./TransporterNavigator";

const Stack = createNativeStackNavigator();

const TportNavigation = () => {
  const loginInfo = useSelector((state) => {
    const temp = { isLoggedIn: false, userType: "" };
    if (state.auth.usrtyp !== "") {
      temp.userType = state.auth.usrtyp;
      temp.isLoggedIn = true;
    }
    return temp;
  });

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
          {!loginInfo.isLoggedIn ? (
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  headerShown: false,
                  // animationTypeForReplace: state.isSignout ? "pop" : "push",
                }}
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
            </>
          ) : (
            <>
              {loginInfo.userType === "T" && (
                <Stack.Screen
                  name="TransporterNavigator"
                  component={TransporterNavigator}
                  options={{ headerShown: false }}
                />
              )}
              {loginInfo.userType === "U" && (
                <Stack.Screen
                  name="UserNavigator"
                  component={UserNavigator}
                  options={{ headerShown: false }}
                />
              )}
            </>
          )}
        </Stack.Group>
        <Stack.Group>
          {!loginInfo.isLoggedIn && (
            <Stack.Screen
              name="TAndCModal"
              component={TAndCModalScreen}
              options={{ title: "T-Port(Transport Freight)" }}
            />
          )}
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default TportNavigation;
