import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Colors from "../shared/constants/Colors";
import UserDashboardScreen from "../screens/user/UserDashboardScreen";
import BidHistoryScreen from "../screens/user/BidHistoryScreen";
import ContractHistoryScreen from "../screens/user/ContractHistoryScreen";
import RunningContractsScreen from "../screens/user/RunningContractsScreen";
import UserContractsScreen from "../screens/user/UserContractsScreen";
import UserProfileScreen from "../screens/user/UserProfileScreen";
import UserTportScreen from "../screens/user/UserTportScreen";
import CustomDrawerContent from "../shared/components/CustomDrawerContent";

const Drawer = createDrawerNavigator();

const UserNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="userHome"
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
      <Drawer.Group>
        <Drawer.Screen
          name="userHome"
          component={UserDashboardScreen}
          options={{ title: "User Dashboard" }}
        />
        <Drawer.Screen
          name="bidHistory"
          component={BidHistoryScreen}
          options={{ title: "Bid History" }}
        />
        <Drawer.Screen
          name="contrctHistory"
          component={ContractHistoryScreen}
          options={{ title: "Contract History" }}
        />
        <Drawer.Screen
          name="runningContracts"
          component={RunningContractsScreen}
          options={{ title: "Running Contracts" }}
        />
        <Drawer.Screen
          name="userContracts"
          component={UserContractsScreen}
          options={{ title: "User Contracts" }}
        />
        <Drawer.Screen
          name="userProfile"
          component={UserProfileScreen}
          options={{ title: "User Profile" }}
        />
        <Drawer.Screen
          name="userTport"
          component={UserTportScreen}
          options={{ title: "User TPort" }}
        />
      </Drawer.Group>
    </Drawer.Navigator>
  );
};

export default UserNavigator;
