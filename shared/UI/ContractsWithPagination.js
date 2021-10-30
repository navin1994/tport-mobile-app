import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Alert,
  LogBox,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import ProgressIndicator from "./ProgressIndicator";
import BackgroundImage from "./BackgroundImage";
import * as contractActions from "../../store/action/contract";
import ContractTile from "./ContractTile";
import SearchBox from "../components/SearchBox";

const window = Dimensions.get("window");

const limit = 30;

const ContractsWithPagination = (props) => {
  const { screenName } = props;
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState();
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);
  const [offset, setOffset] = useState(0);
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
      setPage(1);
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
    setPage(1);
    getContracts(0);
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

  const fetchMore = () => {
    if (isSearch) {
      return;
    }
    const totalRecords = data.totalContracts;
    setPage(page + 1);
    setOffset(limit * (page + 1) - limit);
    if (offset < totalRecords && offset !== 0) {
      getContracts(offset);
    }
  };

  const getContracts = async (_offset) => {
    setSearch(false);
    setError(null);
    try {
      setIsLoading({ state: true, msg: "Getting Contracts..." });
      const result = await dispatch(
        contractActions.getContracts(limit, _offset)
      );
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
    const fromLoc = inputValues.fromLocation.id;
    const toLoc = inputValues.toLocation.id;
    const date = inputValues.date;
    setError(null);
    try {
      setIsLoading({ state: true, msg: "Searching Contracts..." });
      const result = await dispatch(
        contractActions.searchContracts(fromLoc, toLoc, date)
      );
      setIsLoading({ state: false, msg: "" });
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  return (
    <BackgroundImage>
      {isLoading.state && <ProgressIndicator msg={isLoading.msg} />}
      <View
        style={styles.screen}
        pointerEvents={isLoading.state ? "none" : "auto"}
      >
        <View style={styles.listContainer}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              <View style={styles.searchContainer}>
                <SearchBox
                  locations={locations}
                  onChangeSearchMode={searchModeHandler}
                  onSearchContracts={searchContracts}
                />
              </View>
            }
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            data={data.contracts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <ContractTile item={item} index={index} screen={screenName} />
            )}
            bounces={true}
            onEndReachedThreshold={0}
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

export default ContractsWithPagination;
