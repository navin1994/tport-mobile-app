import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../shared/constants/Colors";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import ProgressIndicator from "../../shared/UI/ProgressIndicator";
import TyreTile from "../../shared/UI/TyreTile";
import * as fleetActions from "../../store/action/fleet";

const window = Dimensions.get("window");

const TyreDetailsScreen = (props) => {
  const { navigation, route } = props;
  const [error, setError] = useState();

  const fleet = useSelector((state) =>
    state.fleets.regFleets.find((x) => x.vehid === route.params)
  );
  const tyres = useSelector((state) =>
    state.fleets.services.filter((x) => x.sts === "T")
  );
  const [isLoading, setIsLoading] = useState({
    state: false,
    msg: "Loading...",
  });
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

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
    Alert.alert(
      "Alert!",
      "Do you really want to delete the fleet tyre details?",
      [
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
              const result = await dispatch(
                fleetActions.deleteFleetInfo(infoId)
              );
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
      ]
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: fleet.vtypnm,
      headerRight: () => (
        <TouchableCmp
          useForeground
          onPress={() => {
            // setShowDialog(true);
          }}
        >
          <Ionicons name="add-circle-outline" size={35} color="#FFF" />
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
        <View style={styles.vehicleNumber}>
          <Text style={styles.vehNum}>{fleet.vehno}</Text>
        </View>
        {tyres.length === 0 && (
          <View style={styles.msgBackGround}>
            <Text style={styles.msg}>Tyres Data is Not Available</Text>
          </View>
        )}
        {tyres.length > 0 && (
          <FlatList
            nestedScrollEnabled
            data={tyres}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TyreTile
                tyre={item}
                onDelete={deleteService}
                onEdit={() => {}}
              />
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
    position: "absolute",
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: Colors.success,
    borderRadius: 20,
    opacity: 0.9,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 12,
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

export default TyreDetailsScreen;
