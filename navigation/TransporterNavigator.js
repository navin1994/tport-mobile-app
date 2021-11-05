import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Colors from "../shared/constants/Colors";
import TransporterDashboardScreen from "../screens/transporter/TransporterDashboardScreen";
import AllotedContractsScreen from "../screens/transporter/AllotedContractsScreen";
import ContractHistoryScreen from "../screens/transporter/ContractHistoryScreen";
import FleetDetailsScreen from "../screens/transporter/FleetDetailsScreen";
import FleetServicesScreen from "../screens/transporter/FleetServicesScreen";
import TyreDetailsScreen from "../screens/transporter/TyreDetailsScreen";
import TportArenaScreen from "../screens/transporter/TportArenaScreen";
import TransporterContractScreen from "../screens/transporter/TransporterContractScreen";
import TransporterProfileScreen from "../screens/transporter/TransporterProfileScreen";
import TransporterFleetScreen from "../screens/transporter/TransporterFleetScreen";
import CustomDrawerContent from "../shared/components/CustomDrawerContent";
import AddFleetScreen from "../screens/transporter/AddFleetScreen";
import AddTyreScreen from "../screens/transporter/AddTyreScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const FleetsNavigator = () => {
  return (
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
          name="trnsptrFleet"
          component={TransporterFleetScreen}
          options={{ title: "Transporter Fleet" }}
        />
        <Stack.Screen
          name="fleetDtls"
          component={FleetDetailsScreen}
          options={{ title: "Fleet Details" }}
        />
        <Stack.Screen
          name="fleetSrvcs"
          component={FleetServicesScreen}
          options={{ title: "Fleet Services" }}
        />
        <Stack.Screen
          name="tyreDtls"
          component={TyreDetailsScreen}
          options={{ title: "Tyre Details" }}
        />
        <Stack.Screen
          name="addFleet"
          component={AddFleetScreen}
          options={{ title: "Add New Fleet" }}
        />
        <Stack.Screen
          name="addTyre"
          component={AddTyreScreen}
          options={{ title: "Add Tyre Details" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const TransporterNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="transpDashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.titleBackground,
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontFamily: "open-sans-bold",
          fontSize: 16,
        },
        headerTitleAlign: "center",
      }}
    >
      <Drawer.Group>
        <Drawer.Screen
          name="transpDashboard"
          component={TransporterDashboardScreen}
          options={{ title: "Transporter Dashboard" }}
        />
        <Drawer.Screen
          name="allotedContracts"
          component={AllotedContractsScreen}
          options={{ title: "Alloted Contracts" }}
        />
        <Drawer.Screen
          name="contractsHistory"
          component={ContractHistoryScreen}
          options={{ title: "Contracts History" }}
        />
        <Drawer.Screen
          name="tprtArena"
          component={TportArenaScreen}
          options={{ title: "TPort Arena" }}
        />
        <Drawer.Screen
          name="trnsptrContracts"
          component={TransporterContractScreen}
          options={{ title: "Transporter Contracts" }}
        />
        <Drawer.Screen
          name="trnsptrProfile"
          component={TransporterProfileScreen}
          options={{ title: "Transporter Profile" }}
        />
        <Drawer.Screen
          name="transFleetsRoute"
          component={FleetsNavigator}
          options={{ headerShown: false, title: "Your Fleets" }}
        />
      </Drawer.Group>
    </Drawer.Navigator>
  );
};

export default TransporterNavigator;
