import React, { useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  CheckBox,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import HeaderLeft from "../../shared/components/HeaderLeft";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import TextField from "../../shared/components/TextField";
import RaisedButton from "../../shared/components/RaisedButton";
import Colors from "../../shared/constants/Colors";

const window = Dimensions.get("window");

const UserRegistrationScreen = (props) => {
  const [isSelected, setSelection] = useState(false);
  const { navigation } = props;
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "User Registration",
      headerLeft: () => (
        <HeaderLeft
          navigation={navigation}
          titleIcon={
            <Ionicons
              name={
                Platform.OS === "android"
                  ? "md-person-circle-outline"
                  : "ios-person-circle-outline"
              }
              size={32}
              color="white"
            />
          }
        />
      ),
    });
  }, [navigation]);

  return (
    <BackgroundImage>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.screen}>
          <View style={styles.container}>
            <View style={styles.msgContainer}>
              <Text style={styles.msg}>
                Please register to add shipment in TPORT
              </Text>
            </View>
            <TextField
              label={
                <Text>
                  User Id
                  <Text style={styles.required}>*</Text>
                </Text>
              }
              leadingIcon={
                <Ionicons name="person-outline" size={25} color="black" />
              }
            />
            <TextField
              label={
                <Text>
                  Password
                  <Text style={styles.required}>*</Text>
                </Text>
              }
              leadingIcon={
                <Ionicons
                  name="md-lock-closed-outline"
                  size={25}
                  color="black"
                />
              }
            />
            <TextField
              label={
                <Text>
                  Confirm Password
                  <Text style={styles.required}>*</Text>
                </Text>
              }
              leadingIcon={
                <Ionicons
                  name="md-lock-closed-outline"
                  size={25}
                  color="black"
                />
              }
            />
            <TextField
              label={
                <Text>
                  Name Of Contact/Owner
                  <Text style={styles.required}>*</Text>
                </Text>
              }
              leadingIcon={
                <Ionicons
                  name={
                    Platform.OS === "android"
                      ? "md-person-circle-outline"
                      : "ios-person-circle-outline"
                  }
                  size={25}
                  color="black"
                />
              }
            />
            <TextField
              label={
                <Text>
                  Mobile Number<Text style={styles.required}>*</Text>
                </Text>
              }
              leadingIcon={
                <Ionicons
                  name={
                    Platform.OS === "android"
                      ? "md-phone-portrait-outline"
                      : "ios-phone-portrait-outline"
                  }
                  size={25}
                  color="black"
                />
              }
            />
            <TextField
              label="E-Mail Address"
              leadingIcon={
                <Ionicons
                  name={
                    Platform.OS === "android"
                      ? "md-mail-outline"
                      : "ios-mail-outline"
                  }
                  size={25}
                  color="black"
                />
              }
            />
            <View style={styles.tandcContainer}>
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                <View style={styles.checkboxContainer}>
                  <CheckBox value={isSelected} onValueChange={setSelection} />
                </View>
                <Text style={styles.msg}>I Have Read And Agree To The</Text>
              </View>
              <TouchableCmp onPress={() => navigation.navigate("TAndCModal")}>
                <Text style={styles.clickbleText}>Terms Of Service.</Text>
              </TouchableCmp>
            </View>
            <RaisedButton style={styles.saveBtn} title="SAVE REGISTRATION" />
          </View>
        </View>
      </ScrollView>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: window.width,
  },
  msgContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6c757d",
    width: window.width * 0.9,
    height: 50,
  },
  msg: {
    fontFamily: "open-sans",
    color: "white",
  },
  saveBtn: {
    margin: 20,
    backgroundColor: Colors.success,
  },
  required: {
    color: "red",
  },
  tandcContainer: {
    marginVertical: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    width: window.width * 0.9,
    padding: 5,
    opacity: 0.7,
  },
  clickbleText: {
    fontFamily: "open-sans",
    color: "yellow",
  },
  checkboxContainer: {
    marginHorizontal: 10,
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: 20,
    width: 20,
  },
});

export default UserRegistrationScreen;
