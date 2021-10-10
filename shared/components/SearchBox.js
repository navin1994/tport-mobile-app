import React, { useState, useCallback, useReducer, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Moment from "moment";

import Card from "../UI/Card";
import Colors from "../constants/Colors";
import SearchableDropdown from "./SearchableDropdown";
import TextField from "./TextField";
import RaisedButton from "./RaisedButton";
import {
  FORM_INPUT_UPDATE,
  RESET_FORM,
  formReducer,
} from "../Functions/FormReducer";

const window = Dimensions.get("window");

const initialFormState = {
  inputValues: {
    fromLocation: "",
    toLocation: "",
    date: "",
  },
  inputValidities: {
    fromLocation: false,
    toLocation: false,
    date: false,
  },
  formIsValid: false,
};

const SearchBox = (props) => {
  const { locations, onChangeSearchMode, onSearchContracts } = props;
  const [reset, setReset] = useState(false);
  const [isShowSearch, toggleSearch] = useState(false);
  const [showDatePkr, setShowDatePkr] = useState(false);
  const [currentDateField, setDateField] = useState("");
  const [formState, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  useEffect(() => {
    resetControls();
  }, [isShowSearch]);

  const inputChangeHandler = useCallback(
    (identifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: identifier,
      });
    },
    [dispatchFormState]
  );

  const resetControls = () => {
    onChangeSearchMode();
    setReset(!reset);
    dispatchFormState({
      type: RESET_FORM,
      initialFormState: initialFormState,
    });
  };

  const openDatePicker = (data) => {
    setShowDatePkr(true);
    setDateField(data.currentField);
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePkr(false);
    if (event.type === "dismissed") {
      setDateField("");
      return;
    }
    inputChangeHandler(
      currentDateField,
      Moment(selectedDate).format("YYYY-MM-DD"),
      true
    );
    setDateField("");
  };

  return (
    <View style={styles.mainContainer}>
      {!isShowSearch && (
        <RaisedButton
          title="Search Contracts"
          leadingIcon={
            <Ionicons
              name={
                Platform.OS === "android"
                  ? "md-search-outline"
                  : "ios-search-outline"
              }
              size={20}
              color="#fff"
            />
          }
          onPress={() => {
            toggleSearch(true);
          }}
          style={styles.findBtn}
        />
      )}
      {isShowSearch && (
        <Card style={{ ...styles.container, ...props.style }}>
          {showDatePkr && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChangeDate}
            />
          )}
          <SearchableDropdown
            required={true}
            itemList={locations}
            displayKey="value"
            onInputChange={inputChangeHandler}
            id="fromLocation"
            initiallyValid={formState.inputValidities.fromLocation}
            reset={reset}
            label="From Location"
            leadingIcon={
              <Ionicons
                name={
                  Platform.OS === "android"
                    ? "md-search-outline"
                    : "ios-search-outline"
                }
                size={24}
                color="black"
              />
            }
          />
          <SearchableDropdown
            required={true}
            itemList={locations}
            displayKey="value"
            onInputChange={inputChangeHandler}
            id="toLocation"
            initiallyValid={formState.inputValidities.toLocation}
            reset={reset}
            label="To Location"
            leadingIcon={
              <Ionicons
                name={
                  Platform.OS === "android"
                    ? "md-search-outline"
                    : "ios-search-outline"
                }
                size={24}
                color="black"
              />
            }
          />
          <TextField
            value={formState.inputValues.date}
            initiallyValid={formState.inputValidities.date}
            id="date"
            placeholder="YYYY-MM-DD"
            onInputChange={inputChangeHandler}
            readonly={true}
            label="Transport Date"
            style={{ width: "80%" }}
            required={true}
            trailingIcon={
              <TouchableCmp
                onPress={() => {
                  openDatePicker({
                    currentField: "date",
                    maxDate: new Date(),
                  });
                }}
              >
                <Ionicons name="calendar-outline" size={25} color="black" />
              </TouchableCmp>
            }
          />
          <View style={styles.actions}>
            <RaisedButton
              title="SEARCH"
              leadingIcon={
                <Ionicons
                  name={
                    Platform.OS === "android"
                      ? "md-search-outline"
                      : "ios-search-outline"
                  }
                  size={20}
                  color="#fff"
                />
              }
              onPress={() => {
                onSearchContracts(formState);
              }}
              style={styles.schBtn}
            />
            <RaisedButton
              title="CLEAR"
              leadingIcon={
                <MaterialIcons name="clear" size={20} color="#fff" />
              }
              onPress={resetControls}
              style={styles.clsBtn}
            />
            <RaisedButton
              title="HIDE"
              leadingIcon={
                <Ionicons name="eye-off-outline" size={20} color="#fff" />
              }
              onPress={() => {
                toggleSearch(false);
              }}
              style={styles.hidBtn}
            />
          </View>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: window.width * 0.9,
  },
  actions: {
    marginTop: 5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  schBtn: {
    backgroundColor: Colors.success,
    height: 40,
  },
  clsBtn: { backgroundColor: Colors.danger, height: 40 },
  hidBtn: { backgroundColor: Colors.info, height: 40 },
  findBtn: {
    flex: null,
    backgroundColor: Colors.info,
    height: 40,
  },
});

export default SearchBox;
