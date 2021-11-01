import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useReducer,
} from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Colors from "../../shared/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import ProgressIndicator from "../../shared/UI/ProgressIndicator";
import * as fleetActions from "../../store/action/fleet";
import ServiceTile from "../../shared/UI/ServiceTile";

const window = Dimensions.get("window");

const FleetServicesScreen = (props) => {
  const { navigation, route } = props;
  const [error, setError] = useState();
  const fleet = useSelector((state) =>
    state.fleets.regFleets.find((x) => x.vehid === route.params)
  );
  const services = useSelector((state) =>
    state.fleets.services.filter((x) => x.sts === "S")
  );
  const [isLoading, setIsLoading] = useState({
    state: false,
    msg: "Loading...",
  });
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getFleetInfo();
    }
  }, [isFocused]);

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const getFleetInfo = async () => {
    setError(null);
    try {
      setIsLoading({ state: true, msg: "Getting Fleets info..." });
      const result = await dispatch(fleetActions.vehicleServices(fleet.vehid));
      setIsLoading({ state: false, msg: "" });
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  const deleteService = async (infoId) => {
    Alert.alert("Alert!", "Do you really want to delete the fleet service?", [
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
            setIsLoading({ state: true, msg: "Deleting Fleets info..." });
            const result = await dispatch(fleetActions.deleteFleetInfo(infoId));
            setIsLoading({ state: false, msg: "" });
            if (result.Result === "OK") {
              Alert.alert("Success", result.Msg, [{ text: "Okay" }]);
            } else {
              Alert.alert("Error", result.Msg, [{ text: "Okay" }]);
            }
            getFleetInfo();
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
      title: fleet.vtypnm,
    });
  }, [navigation]);

  return (
    <BackgroundImage>
      {isLoading.state && <ProgressIndicator msg={isLoading.msg} />}
      <View
        style={styles.screen}
        pointerEvents={isLoading.state ? "none" : "auto"}
      >
        <View style={styles.vehicleNumber}>
          <Text style={styles.vehNum}>{fleet.vehno}</Text>
        </View>
        {services.length === 0 && (
          <View style={styles.msgBackGround}>
            <Text style={styles.msg}>Service Data Not Available</Text>
          </View>
        )}
        {services.length > 0 && (
          <FlatList
            nestedScrollEnabled
            data={services}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <ServiceTile service={item} onDelete={deleteService} />
            )}
          />
        )}
      </View>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
  },
  vehicleNumber: {
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: Colors.success,
    borderRadius: 20,
    opacity: 0.9,
  },
  vehNum: {
    fontFamily: "open-sans",
    fontSize: 14,
    color: "#fff",
  },
  msgBackGround: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.semiTransparentBlack,
    width: window.width,
  },
  msg: {
    color: "#FFF",
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
});

export default FleetServicesScreen;
