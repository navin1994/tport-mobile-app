import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import DrawerHeaderLeft from "../../shared/components/DrawerHeaderLeft";
import ProgressIndicator from "../../shared/UI/ProgressIndicator";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import VehicleTile from "../../shared/UI/VehicleTile";
import * as fleetActions from "../../store/action/fleet";

const window = Dimensions.get("window");

const TransporterFleetScreen = (props) => {
  const { navigation } = props;
  const fleets = useSelector((state) => state.fleets.regFleets);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState({
    state: false,
    msg: "Loading...",
  });
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getFleets();
    }
  }, [isFocused]);

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const getFleets = async () => {
    setError(null);
    try {
      setIsLoading({ state: true, msg: "Getting Fleets..." });
      const result = await dispatch(fleetActions.getFleetsData());
      setIsLoading({ state: false, msg: "" });
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Registered Fleets",
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
    });
  }, [navigation]);

  return (
    <BackgroundImage>
      {isLoading.state && <ProgressIndicator msg={isLoading.msg} />}
      <View
        style={styles.screen}
        pointerEvents={isLoading.state ? "none" : "auto"}
      >
        <View style={styles.listContainer}>
          <FlatList
            nestedScrollEnabled
            data={fleets}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <VehicleTile fleet={item} />}
          />
        </View>
      </View>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
  },
  listContainer: {
    width: window.width * 0.95,
  },
  image: {
    resizeMode: "center",
    height: 35,
    width: 40,
  },
});

export default TransporterFleetScreen;
