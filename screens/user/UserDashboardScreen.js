import React, { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  BackHandler,
  Alert,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  Ionicons,
  SimpleLineIcons,
  Entypo,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

import BackgroundImage from "../../shared/UI/BackgroundImage";
import Colors from "../../shared/constants/Colors";
import MenuItem from "../../shared/UI/MenuItem";
import * as authActions from "../../store/action/auth";

const UserDashboardScreen = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const userData = useSelector((state) => state.auth);
  const menuList = [
    {
      bgColor: Colors.infoDark,
      iconName: <SimpleLineIcons name="note" size={40} color="#fff" />,
      title: "Register TPort",
      onClick: () => {
        navigation.navigate("UserNavigator", {
          screen: "userTport",
        });
      },
    },
    {
      bgColor: Colors.primaryDark,
      iconName: <Ionicons name="person-circle" size={50} color="#fff" />,
      title: "TPort Profile",
      onClick: () => {
        navigation.navigate("UserNavigator", {
          screen: "userProfile",
        });
      },
    },
    {
      bgColor: Colors.success,
      iconName: <Entypo name="location" size={40} color="#fff" />,
      title: "Open TPort",
      onClick: () => {
        navigation.navigate("UserNavigator", {
          screen: "userContracts",
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
      title: "Running Contracts",
      onClick: () => {
        navigation.navigate("UserNavigator", {
          screen: "runningContracts",
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
        navigation.navigate("UserNavigator", {
          screen: "contrctHistory",
        });
      },
    },
  ];

  useEffect(() => {
    if (userData.docflag === "N") {
      Alert.alert(
        "Alert!",
        "User profile is not completed. Please complete the user profile, upload required documents only then you are allowed to proceed further.",
        [
          {
            text: "Okay",
            onPress: () => {
              navigation.navigate("UserNavigator", {
                screen: "userProfile",
              });
            },
          },
        ]
      );
    }
  }, []);

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

  return (
    <BackgroundImage>
      <View style={styles.screen}>
        <View style={styles.container}>
          <View style={styles.gridContainer}>
            <FlatList
              numColumns={2}
              nestedScrollEnabled
              ListHeaderComponent={
                <View style={styles.welcomeContainer}>
                  <Text style={styles.initText}>WELCOME TO T-PORT</Text>
                  <Text style={styles.initText}>{userData.usrnme}</Text>
                </View>
              }
              data={menuList}
              keyExtractor={(item, index) => index}
              renderItem={(itemData) => (
                <MenuItem
                  style={{ backgroundColor: itemData.item.bgColor }}
                  icon={itemData.item.iconName}
                  title={itemData.item.title}
                  onSelect={itemData.item.onClick}
                />
              )}
            />
          </View>
        </View>
      </View>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: window.width,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  initText: {
    fontFamily: "open-sans",
    textTransform: "uppercase",
    color: "#fff",
    fontSize: 16,
  },
  gridContainer: {
    margin: 10,
  },
});

export default UserDashboardScreen;
