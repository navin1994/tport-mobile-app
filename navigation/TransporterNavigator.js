import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

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

const Drawer = createDrawerNavigator();

const TransporterNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="transpHome"
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
          name="transpHome"
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
          name="fleetDtls"
          component={FleetDetailsScreen}
          options={{ title: "Fleet Details" }}
        />
        <Drawer.Screen
          name="fleetSrvcs"
          component={FleetServicesScreen}
          options={{ title: "Fleet Services" }}
        />
        <Drawer.Screen
          name="tyreDtls"
          component={TyreDetailsScreen}
          options={{ title: "Tyre Details" }}
        />
        <Drawer.Screen
          name="tprtArena"
          component={TportArenaScreen}
          options={{ title: "TPort Arena" }}
        />
        <Drawer.Screen
          name="trnsptrContractor"
          component={TransporterContractScreen}
          options={{ title: "Transporter Contracts" }}
        />
        <Drawer.Screen
          name="trnsptrProfile"
          component={TransporterProfileScreen}
          options={{ title: "Transporter Profile" }}
        />
        <Drawer.Screen
          name="trnsptrFleet"
          component={TransporterFleetScreen}
          options={{ title: "Transporter Fleet" }}
        />
      </Drawer.Group>
    </Drawer.Navigator>
  );
};

export default TransporterNavigator;
