import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Alert,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import BackgroundImage from "../../shared/UI/BackgroundImage";
import RaisedButton from "../../shared/components/RaisedButton";
import MultipleSelectSearchPicker from "../../shared/components/MultipleSelectSearchPicker";
import ScreenNames from "../../shared/constants/ScreenNames";
import Styles from "../../shared/styles/styles";
import Colors from "../../shared/constants/Colors";
import ProgressIndicator from "../../shared/UI/ProgressIndicator";
import PrefTile from "../../shared/UI/PrefTile";
import DropdownSelect from "../../shared/components/DropdownSelect";
import * as prefActions from "../../store/action/preferences";
import * as fleetActions from "../../store/action/fleet";
import * as contractActions from "../../store/action/contract";

const window = Dimensions.get("window");

const selArena = [
  {
    value: 0,
    text: "Select Your Transport Preferences",
  },
  {
    value: "AI",
    text: "All Over India",
  },
  {
    value: "SS",
    text: "Specific States",
  },
  {
    value: "SR",
    text: "Specific Route",
  },
];

// const initialFormState = {
//   inputValues: {
//     seleFleets: [],
//     seleFrmLocn: [],
//     seleToLocn: [],
//     isLoad: "",
//     loadamt: "",
//     isUnLoad: "",
//     unloadamt: "",
//     ratetyp: "",
//     rateamt: "",
//     extramt: "",
//   },
//   inputValidities: {
//     seleFleets: false,
//     seleFrmLocn: false,
//     seleToLocn: false,
//     isLoad: false,
//     loadamt: false,
//     isUnLoad: false,
//     unloadamt: false,
//     ratetyp: false,
//     rateamt: false,
//     extramt: false,
//   },
//   formIsValid: false,
// };

const AddPrefScreen = (props) => {
  const { navigation } = props;
  const [error, setError] = useState();
  const [locations, setLocations] = useState([]);
  const [reset, setReset] = useState(false);
  const [isLoading, setIsLoading] = useState({
    state: false,
    msg: "Loading...",
  });

  const dispatch = useDispatch();
  const preferences = useSelector((state) => state.pref.unsavedPref);
  const fleets = useSelector((state) => state.fleets.regFleets);
  const isFocused = useIsFocused();
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  useEffect(() => {
    if (isFocused) {
      getAllRegFleets();
    }
  }, [getAllRegFleets]);

  const getAllRegFleets = async () => {
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

  const getLocations = async (loctyp) => {
    setError(null);
    try {
      setIsLoading({ state: true, msg: "Getting Locations..." });
      const result = await dispatch(contractActions.getLocations(loctyp));
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

  const onSelectPreference = (selectedItem, index) => {
    if (selectedItem.value === "AI") {
      setLocations([{ value: "ALL India Anywhere", id: "0" }]);
    } else if (selectedItem.value === "SS") {
      getLocations("S");
    } else if (selectedItem.value === "SR") {
      getLocations("D");
    } else {
      setLocations([]);
    }
  };

  const inputChangeHandler = (identifier, value, isValid) => {
    console.log(
      "identifier: " +
        identifier +
        " | value: " +
        value +
        " | isValid: " +
        isValid
    );
  };

  const onRemove = (index) => {
    dispatch(prefActions.removePreference(index));
  };

  return (
    <BackgroundImage>
      {isLoading.state && <ProgressIndicator msg={isLoading.msg} />}
      <View
        style={styles.screen}
        pointerEvents={isLoading.state ? "none" : "auto"}
      >
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View style={{ marginTop: 10 }}>
              <View style={styles.selContainer}>
                <DropdownSelect
                  labelStyle={Styles.label}
                  labelContainerStyle={Styles.labelContainer}
                  label="Select Preference"
                  defaultButtonText={selArena[0].text}
                  defaultValue={selArena[0].value}
                  data={selArena}
                  reset={reset}
                  onSelect={onSelectPreference}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.text;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.text;
                  }}
                />
              </View>
              <View style={styles.formContainer}>
                <MultipleSelectSearchPicker
                  labelStyle={Styles.label}
                  labelContainerStyle={Styles.labelContainer}
                  label="Select Your Fleet"
                  itemList={fleets}
                  onInputChange={inputChangeHandler}
                  displayKey="vehno"
                  uniqueKey="vehid"
                  id="vehno"
                  isSubmitted={false}
                  reset={reset}
                  errorText="Please select valid fleets."
                  required={true}
                />
              </View>
            </View>
          }
          nestedScrollEnabled
          data={preferences}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <PrefTile
              pref={item}
              // onRemove={removePref(index)}
              screen={ScreenNames.TRANS_PREF_SCREEN}
              onRemove={onRemove(index)}
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
  formContainer: {
    marginTop: 20,
    alignItems: "center",
    width: window.width * 0.9,
    backgroundColor: Colors.semiTransparentBlack,
    borderRadius: 8,
    padding: 10,
  },
  selContainer: {
    width: window.width * 0.9,
    left: 15,
    alignSelf: "center",
  },
});

export default AddPrefScreen;
