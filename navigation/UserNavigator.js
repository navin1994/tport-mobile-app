import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Colors from "../shared/constants/Colors";
import UserDashboardScreen from "../screens/user/UserDashboardScreen";
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
      initialRouteName="userDashboard"
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
          name="userDashboard"
          component={UserDashboardScreen}
          options={{ title: "User Dashboard" }}
        />
        <Drawer.Screen
          name="userProfile"
          component={UserProfileScreen}
          options={{ title: "TPort Profile" }}
        />
        <Drawer.Screen
          name="userTport"
          component={UserTportScreen}
          options={{ title: "Register TPort" }}
        />
        <Drawer.Screen
          name="userContracts"
          component={UserContractsScreen}
          options={{ title: "Open TPort" }}
        />
        <Drawer.Screen
          name="runningContracts"
          component={RunningContractsScreen}
          options={{ title: "Running Contracts" }}
        />
        <Drawer.Screen
          name="contrctHistory"
          component={ContractHistoryScreen}
          options={{ title: "Contract History" }}
        />
        {/* <Drawer.Screen
          name="bidHistory"
          component={BidHistoryScreen}
          options={{ title: "Bid History" }}
        /> */}
      </Drawer.Group>
    </Drawer.Navigator>
  );
};

export default UserNavigator;
