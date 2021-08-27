import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import LoginScreen from "../screens/auth/login/LoginScreen";
import Colors from "../shared/constants/Colors";

// const defaultNavOptions = {
//   headerStyle: {
//     backgroundColor: Platform.OS === "android" ? Colors.primary : "",
//   },
//   headerTitleStyle: {
//     // fontFamily: "open-sans-bold",
//   },
//   headerBackTitleStyle: {
//     // fontFamily: "open-sans",
//   },
//   headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
// };

const TportNavigator = createStackNavigator(
  {
    Login: LoginScreen,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Colors.titleBackgroundColor,
      },
      headerTintColor: "white",
    },
  }
);

export default createAppContainer(TportNavigator);
