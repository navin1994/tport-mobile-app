import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Alert,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import BackgroundImage from "../../shared/UI/BackgroundImage";
import DrawerHeaderLeft from "../../shared/components/DrawerHeaderLeft";
import Styles from "../../shared/styles/styles";
import RaisedButton from "../../shared/components/RaisedButton";
import ScreenNames from "../../shared/constants/ScreenNames";
import Colors from "../../shared/constants/Colors";
import ProgressIndicator from "../../shared/UI/ProgressIndicator";
import PrefTile from "../../shared/UI/PrefTile";
import * as prefActions from "../../store/action/preferences";

const TportArenaScreen = (props) => {
  const { navigation } = props;
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState({
    state: false,
    msg: "Loading...",
  });
  const dispatch = useDispatch();
  const preferences = useSelector((state) => state.pref.preferences);

  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getPreferences();
    }
  }, [isFocused]);

  const getPreferences = async () => {
    setError(null);
    try {
      setIsLoading({ state: true, msg: "Getting Preferences..." });
      const result = await dispatch(prefActions.getTportPreferences());
      setIsLoading({ state: false, msg: "" });
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  const onDeletePref = (prefId) => {
    Alert.alert("Alert!", "Do you really want to delete the preference?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "YES, DELETE",
        onPress: async () => {
          setError(null);
          try {
            setIsLoading({ state: true, msg: "Deleting preference..." });
            const result = await dispatch(
              prefActions.deleteTportPreferences(prefId)
            );
            setIsLoading({ state: false, msg: "" });
            if (result.Result === "OK") {
              Alert.alert("Success", result.Msg, [{ text: "Okay" }]);
            } else {
              Alert.alert("Error", result.Msg, [{ text: "Okay" }]);
            }
            getPreferences();
          } catch (err) {
            setIsLoading({ state: false, msg: "" });
            setError(err.message);
          }
        },
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <DrawerHeaderLeft
          titleIcon={
            <Image
              source={require("../../assets/images/tempo.png")}
              style={styles.image}
            />
          }
        />
      ),
      headerRight: () => (
        <TouchableCmp
          useForeground
          onPress={() => {
            navigation.navigate("addPref");
          }}
        >
          <Ionicons
            name="add-circle-outline"
            size={35}
            color="#FFF"
            style={{ marginRight: 10 }}
          />
        </TouchableCmp>
      ),
    });
  }, [navigation]);

  return (
    <BackgroundImage>
      {isLoading.state && <ProgressIndicator msg={isLoading.msg} />}
      <View
        style={styles.screen}
        pointerEvents={isLoading.state ? "none" : "auto"}
      >
        {preferences.length !== 0 && (
          <View style={Styles.vehicleNumber}>
            <Text style={Styles.vehNum}>Saved Preferences</Text>
          </View>
        )}
        {preferences.length === 0 && (
          <View style={styles.btnContainer}>
            <RaisedButton
              title="Add New Preference"
              onPress={() => {
                navigation.navigate("addPref");
              }}
              style={{
                flex: null,
                height: 40,
                backgroundColor: Colors.success,
              }}
            />
          </View>
        )}
        <FlatList
          nestedScrollEnabled
          data={preferences}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <PrefTile
              pref={item}
              // onRemove={removePref(index)}
              screen={ScreenNames.TRANS_PREF_SCREEN}
              onDelete={onDeletePref}
            />
          )}
        />
      </View>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
  },
  btnContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    resizeMode: "center",
    height: 35,
    width: 40,
  },
});

export default TportArenaScreen;
