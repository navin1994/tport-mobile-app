import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Colors from "../../shared/constants/Colors";
import ProgressIndicator from "../../shared/UI/ProgressIndicator";
import DrawerHeaderLeft from "../../shared/components/DrawerHeaderLeft";
import RaisedButton from "../../shared/components/RaisedButton";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import SearchableDropdown from "../../shared/components/SearchableDropdown";
import * as contractActions from "../../store/action/contract";
import ContractTile from "../../shared/UI/ContractTile";

const window = Dimensions.get("window");

const limit = 30;

const UserContractsScreen = (props) => {
  const [locations, setLocations] = useState([]);
  const [reset, setReset] = useState(false);
  const [error, setError] = useState();
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(limit * page - limit);
  const { navigation } = props;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const data = useSelector((state) => state.contract);
  const [isLoading, setIsLoading] = useState({
    state: false,
    msg: "Loading...",
  });

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  useEffect(() => {
    // getLocations();
  }, []);

  useEffect(() => {
    if (isFocused) {
      setPage(1);
      setOffset(limit * page - limit);
      getContracts();
    }
  }, [isFocused]);

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const getLocations = async () => {
    setError(null);
    try {
      setIsLoading({ state: true, msg: "Getting Locations..." });
      const result = await dispatch(contractActions.getLocations("SD"));
      if (result.Result === "OK") {
        setLocations(result.Records);
      } else {
        setError(resData.Msg);
      }
      setIsLoading({ state: false, msg: "" });
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  const fetchMore = () => {
    const totalRecords = data.totalContracts;
    const totalPages =
      parseInt(totalRecords / limit) +
      parseInt(totalRecords % limit !== 0 ? 1 : 0);
    setPage(page + 1);
    if (page > totalPages) {
      return;
    }
    getContracts();
  };

  const getContracts = async () => {
    setError(null);
    try {
      setIsLoading({ state: true, msg: "Getting Contracts..." });
      const result = await dispatch(
        contractActions.getContracts(limit, offset)
      );
      setIsLoading({ state: false, msg: "" });
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "MY TPORT",
      headerLeft: () => (
        <DrawerHeaderLeft
          titleIcon={
            <Image
              source={require("../../assets/images/dashboard-logo.png")}
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
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            data={data.contracts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <ContractTile item={item} index={index} />
            )}
            bounces={true}
            onEndReachedThreshold={0.9}
            onEndReached={fetchMore}
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
  image: {
    resizeMode: "center",
    height: 35,
    width: 40,
  },
  listContainer: {
    width: window.width * 0.95,
  },
});

export default UserContractsScreen;
