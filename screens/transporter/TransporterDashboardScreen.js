import React, { useEffect } from "react";
import { BackHandler, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import {
  Ionicons,
  SimpleLineIcons,
  Entypo,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

import Colors from "../../shared/constants/Colors";
import Dashboard from "../../shared/UI/Dashboard";
import * as authActions from "../../store/action/auth";

const TransporterDashboardScreen = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const userData = useSelector((state) => state.auth);

  const menuList = [
    {
      bgColor: Colors.info,
      iconName: (
        <MaterialCommunityIcons
          name="truck-fast-outline"
          size={50}
          color="#fff"
        />
      ),
      title: "Your Fleets",
      onClick: () => {
        navigation.navigate("TransporterNavigator", {
          screen: "trnsptrFleet",
        });
      },
    },
    {
      bgColor: Colors.primaryDark,
      iconName: <Ionicons name="person-circle" size={50} color="#fff" />,
      title: "TPort Profile",
      onClick: () => {
        navigation.navigate("TransporterNavigator", {
          screen: "trnsptrProfile",
        });
      },
    },
    {
      bgColor: Colors.infoDark,
      iconName: <SimpleLineIcons name="note" size={40} color="#fff" />,
      title: "Contracts",
      onClick: () => {
        navigation.navigate("TransporterNavigator", {
          screen: "trnsptrContracts",
        });
      },
    },
    {
      bgColor: Colors.warning,
      iconName: (
        <MaterialCommunityIcons
          name="truck-fast-outline"
          size={50}
          color="#fff"
        />
      ),
      title: "Alloted Contracts",
      onClick: () => {
        navigation.navigate("TransporterNavigator", {
          screen: "allotedContracts",
        });
      },
    },
    {
      bgColor: Colors.success,
      iconName: <Entypo name="location" size={40} color="#fff" />,
      title: "My TPort",
      onClick: () => {
        navigation.navigate("TransporterNavigator", {
          screen: "tprtArena",
        });
      },
    },
    {
      bgColor: "red",
      iconName: (
        <MaterialCommunityIcons
          name="email-alert-outline"
          size={50}
          color="#fff"
        />
      ),
      title: "Alerts",
      onClick: () => {},
    },
    {
      bgColor: Colors.accent,
      iconName: <FontAwesome5 name="history" size={40} color="#fff" />,
      title: "History",
      onClick: () => {
        navigation.navigate("TransporterNavigator", {
          screen: "contractsHistory",
        });
      },
    },
  ];

  useEffect(() => {
    const backAction = () => {
      if (isFocused) {
        Alert.alert(
          "Hold on!",
          "Are you sure you want to logout and go back?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel",
            },
            { text: "YES", onPress: () => dispatch(authActions.logout()) },
          ]
        );
        return true;
      } else {
        navigation.goBack();
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isFocused]);

  return <Dashboard userData={userData} menuList={menuList} />;
};

export default TransporterDashboardScreen;
