import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  Alert,
  ScrollView,
  LogBox,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import ProgressIndicator from "../../shared/UI/ProgressIndicator";
import DrawerHeaderLeft from "../../shared/components/DrawerHeaderLeft";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import * as contractActions from "../../store/action/contract";
import ContractTile from "../../shared/UI/ContractTile";
import SearchBox from "../../shared/components/SearchBox";
import ScreenNames from "../../shared/constants/ScreenNames";

const window = Dimensions.get("window");

const RunningContractsScreen = (props) => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState();
  const [isSearch, setSearch] = useState(false);
  const { navigation } = props;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const data = useSelector((state) => state.contract);
  const [isLoading, setIsLoading] = useState({
    state: false,
    msg: "Loading...",
  });

  useEffect(() => {
    getLocations();
  }, []);

  useEffect(() => {
    if (isFocused) {
      getInitialData();
    }
  }, [isFocused]);

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const searchModeHandler = () => {
    setSearch(false);
    getInitialData();
  };

  const getInitialData = () => {
    if (isSearch) {
      return;
    }
    getContracts();
  };

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

  const getContracts = async () => {
    setSearch(false);
    setError(null);
    try {
      setIsLoading({ state: true, msg: "Getting Contracts..." });
      const result = await dispatch(contractActions.getAllotedContracts());
      setIsLoading({ state: false, msg: "" });
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  const searchContracts = async ({ inputValues }) => {
    setSearch(true);
    if (
      (inputValues.fromLocation.value === "" ||
        inputValues.fromLocation.value === undefined) &&
      (inputValues.toLocation.value === "" ||
        inputValues.toLocation.value === undefined) &&
      (inputValues.date === "" || inputValues.date === undefined)
    ) {
      Alert.alert("Error", "Please provide valid search inputs.", [
        { text: "Okay" },
      ]);
      return;
    }
    const fromLoc =
      inputValues.fromLocation.no + ", " + inputValues.fromLocation.txt;
    const toLoc = inputValues.toLocation.no + ", " + inputValues.toLocation.txt;
    const date = inputValues.date;
    setError(null);
    try {
      setIsLoading({ state: true, msg: "Searching Contracts..." });
      const result = await dispatch(
        contractActions.searchRunningContracts(fromLoc, toLoc, date)
      );
      setIsLoading({ state: false, msg: "" });
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "RUNNING TPORT",
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={styles.screen}
          pointerEvents={isLoading.state ? "none" : "auto"}
        >
          <View style={styles.searchContainer}>
            <SearchBox
              locations={locations}
              onChangeSearchMode={searchModeHandler}
              onSearchContracts={searchContracts}
            />
          </View>
          <View style={styles.listContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              data={data.contracts}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <ContractTile
                  item={item}
                  index={index}
                  screen={ScreenNames.USER_RUNNING_CONTRACTS_SCREEN}
                />
              )}
              bounces={true}
            />
          </View>
        </View>
      </ScrollView>
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
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
});

export default RunningContractsScreen;
