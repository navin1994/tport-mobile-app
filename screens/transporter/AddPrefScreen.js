import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Alert,
  ScrollView,
  Text,
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
import TextField from "../../shared/components/TextField";
import * as prefActions from "../../store/action/preferences";
import * as fleetActions from "../../store/action/fleet";
import * as contractActions from "../../store/action/contract";
import {
  formReducer,
  FORM_INPUT_UPDATE,
  RESET_FORM,
} from "../../shared/Functions/FormReducer";

const window = Dimensions.get("window");

const selArena = [
  {
    value: 0,
    text: "Select Your Transport Preference",
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

const loadUnLoad = [
  {
    value: "NA",
    text: "NO Facility",
  },
  {
    value: "LB",
    text: "On Quote",
  },
  {
    value: "FP",
    text: "Fixed Price",
  },
];

const kmAmt = [
  {
    value: "FP",
    text: "Fixed Rate",
  },
  {
    value: "LB",
    text: "On Quote",
  },
];

const initialFormState = {
  inputValues: {
    seleFleets: [],
    seleFrmLocn: [],
    isLoad: "NA",
    loadamt: "0",
    isUnLoad: "NA",
    unloadamt: "0",
    ratetyp: "FP",
    rateamt: "0",
    extramt: "0",
  },
  inputValidities: {
    seleFleets: false,
    seleFrmLocn: false,
    isLoad: true,
    loadamt: true,
    isUnLoad: true,
    unloadamt: true,
    ratetyp: true,
    rateamt: true,
    extramt: true,
  },
  formIsValid: false,
};

const AddPrefScreen = (props) => {
  const { navigation } = props;
  const [error, setError] = useState();
  const [locations, setLocations] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reset, setReset] = useState(false);
  const [locLabel, setLocLabel] = useState("Select Preference");
  const [arena, setArena] = useState(0);
  const [isLoading, setIsLoading] = useState({
    state: false,
    msg: "Loading...",
  });
  const [formState, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );

  const dispatch = useDispatch();
  const preferences = useSelector((state) => state.pref.unsavedPref);
  const fleets = useSelector((state) => state.fleets.regFleets);
  const isFocused = useIsFocused();

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
    setArena(selectedItem.value);
    if (selectedItem.value === "AI") {
      setLocLabel("Select Preference");
      setLocations([{ value: "ALL India Anywhere", id: "0" }]);
    } else if (selectedItem.value === "SS") {
      getLocations("S");
      setLocLabel("Anywhere in state");
    } else if (selectedItem.value === "SR") {
      setLocLabel("Within Cities");
      getLocations("D");
    } else {
      setLocLabel("Select Preference");
      setLocations([]);
    }
  };

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

  const removePref = (id) => {
    dispatch(prefActions.removePreference(id));
  };

  const validateData = (data) => {
    if (data.isLoad === "FP" && (data.loadamt === "" || data.loadamt < 1)) {
      Alert.alert("Wrong Input", "Please check entered loading amount.", [
        { text: "Okay" },
      ]);
      return true;
    }
    if (
      data.isUnLoad === "FP" &&
      (data.unloadamt === "" || data.unloadamt < 1)
    ) {
      Alert.alert("Wrong Input", "Please check entered unloading amount.", [
        { text: "Okay" },
      ]);
      return true;
    }
    if (data.rateamt === "" || data.rateamt < 1) {
      Alert.alert("Wrong Input", "Please check entered rate amount.", [
        { text: "Okay" },
      ]);
      return true;
    }

    return false;
  };

  const addPreference = () => {
    setIsSubmitted(true);
    if (!formState.formIsValid) {
      Alert.alert("Wrong Input", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    if (validateData(formState.inputValues)) {
      return;
    }
    makeTPortPref();
  };

  const makeTPortPref = () => {
    const formFillData = formState.inputValues;
    const fleetsArray = formState.inputValues.seleFleets;
    fleetsArray.forEach((fleet) => {
      formFillData.seleFleets = fleet;
      addTPortPref(formFillData);
    });
  };

  const addTPortPref = (PreferenceData) => {
    const prefData = {
      fleetids: [],
      Fleets: "",
      locnm: "",
      locid: [],
      charges: "",
      fleetType: "",
      isLoad: "",
      loadamt: 0,
      isUnLoad: "",
      unloadamt: 0,
      ratetyp: "",
      rateamt: 0,
      extramt: 0,
    };
    prefData.Fleets += PreferenceData.seleFleets.vehno + "\n";
    prefData.fleetType = PreferenceData.seleFleets.vtypnm + "\n";
    prefData.fleetids = [PreferenceData.seleFleets.vehid];
    PreferenceData.seleFrmLocn.forEach((loc) => {
      prefData.locnm += loc.value + ", ";
    });
    prefData.locid = PreferenceData.seleFrmLocn.map((locn) => locn.id);
    prefData.isLoad = PreferenceData.isLoad;
    if (prefData.isLoad === "NA") {
      prefData.charges += "Loading - NA";
    } else if (prefData.isLoad === "LB") {
      prefData.charges += "Loading - On Quote";
    } else if (prefData.isLoad === "FP") {
      prefData.charges += "Loading - " + PreferenceData.loadamt;
    }
    prefData.charges += "\n";
    prefData.loadamt = PreferenceData.loadamt;
    prefData.isUnLoad = PreferenceData.isUnLoad;
    if (prefData.isUnLoad === "NA") {
      prefData.charges += "UnLoading - NA";
    } else if (prefData.isUnLoad === "LB") {
      prefData.charges += "UnLoading - On Quote";
    } else if (prefData.isUnLoad === "FP") {
      prefData.charges += "UnLoading - " + PreferenceData.unloadamt;
    }
    prefData.charges += "\n";
    prefData.unloadamt = PreferenceData.unloadamt;
    prefData.ratetyp = PreferenceData.ratetyp;
    prefData.rateamt = PreferenceData.rateamt;
    prefData.extramt = PreferenceData.extramt;
    if (prefData.extramt > 0) {
      prefData.charges += "Extra - " + prefData.extramt;
    }
    dispatch(prefActions.addPreference(prefData));
    resetData();
  };

  const resetData = () => {
    dispatchFormState({
      type: RESET_FORM,
      initialFormState: initialFormState,
    });
    setReset(!reset);
    setIsSubmitted(false);
    setArena(0);
  };

  const savePreferenceData = () => {
    Alert.alert(
      "Alert!",
      "Please check the preference details carefully before saving.",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "SAVE PREFERENCE",
          onPress: saveTPortLocationPref,
        },
      ]
    );
  };

  const saveTPortLocationPref = async () => {
    if (preferences.length === 0) {
      Alert.alert("Error", "Please add preferences.", [{ text: "Okay" }]);
      return;
    }
    setError(null);
    try {
      setIsLoading({ state: true, msg: "Saving Preferences..." });
      const result = await dispatch(
        prefActions.saveTransporterLocanPref(preferences)
      );
      setIsLoading({ state: false, msg: "" });
      if (result.Result === "OK") {
        resetData();
        navigation.goBack();
        Alert.alert("Success", result.Msg, [{ text: "Okay" }]);
      } else {
        Alert.alert("Error", result.Msg, [{ text: "Okay" }]);
      }
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
            {arena !== 0 && (
              <View style={styles.formContainer}>
                <MultipleSelectSearchPicker
                  labelStyle={Styles.label}
                  labelContainerStyle={Styles.labelContainer}
                  label="Select Your Fleet"
                  itemList={fleets}
                  onInputChange={inputChangeHandler}
                  displayKey="vehno"
                  uniqueKey="vehid"
                  id="seleFleets"
                  isSubmitted={isSubmitted}
                  reset={reset}
                  errorText="Please select valid fleets."
                  required={true}
                />
                <MultipleSelectSearchPicker
                  labelStyle={Styles.label}
                  labelContainerStyle={Styles.labelContainer}
                  label={locLabel}
                  itemList={locations}
                  onInputChange={inputChangeHandler}
                  displayKey="value"
                  uniqueKey="id"
                  id="seleFrmLocn"
                  isSubmitted={isSubmitted}
                  reset={reset}
                  errorText="Please select valid location."
                  required={true}
                />
                <View style={styles.selContainer}>
                  <DropdownSelect
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    label="Loading Amount"
                    defaultButtonText={loadUnLoad[0].text}
                    defaultValue={loadUnLoad[0].value}
                    data={loadUnLoad}
                    reset={reset}
                    onSelect={(selectedItem, index) => {
                      inputChangeHandler("isLoad", selectedItem.value, true);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem.text;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item.text;
                    }}
                  />
                </View>
                {formState.inputValues.isLoad === "FP" && (
                  <TextField
                    style={{ width: window.width * 0.81 }}
                    value={formState.inputValues.loadamt}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.loadamt}
                    id="loadamt"
                    onInputChange={inputChangeHandler}
                    keyboardType="numeric"
                  />
                )}
                <View style={styles.selContainer}>
                  <DropdownSelect
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    label="Un-Loading Amount"
                    defaultButtonText={loadUnLoad[0].text}
                    defaultValue={loadUnLoad[0].value}
                    data={loadUnLoad}
                    reset={reset}
                    onSelect={(selectedItem, index) => {
                      inputChangeHandler("isUnLoad", selectedItem.value, true);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem.text;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item.text;
                    }}
                  />
                </View>
                {formState.inputValues.isUnLoad === "FP" && (
                  <TextField
                    style={{ width: window.width * 0.81 }}
                    value={formState.inputValues.unloadamt}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.unloadamt}
                    id="unloadamt"
                    onInputChange={inputChangeHandler}
                    keyboardType="numeric"
                  />
                )}
                <View style={styles.selContainer}>
                  <DropdownSelect
                    labelStyle={Styles.label}
                    labelContainerStyle={Styles.labelContainer}
                    label="Per Km/Ton Amount"
                    defaultButtonText={kmAmt[0].text}
                    defaultValue={kmAmt[0].value}
                    data={kmAmt}
                    reset={reset}
                    onSelect={(selectedItem, index) => {
                      inputChangeHandler("ratetyp", selectedItem.value, true);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem.text;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item.text;
                    }}
                  />
                </View>
                <TextField
                  style={{ width: window.width * 0.81 }}
                  value={formState.inputValues.rateamt}
                  isSubmitted={isSubmitted}
                  initiallyValid={formState.inputValidities.rateamt}
                  id="rateamt"
                  required
                  onInputChange={inputChangeHandler}
                  keyboardType="numeric"
                  errorText="Please enter valid rate amount"
                />
                <TextField
                  labelStyle={Styles.label}
                  labelContainerStyle={Styles.labelContainer}
                  style={{ width: window.width * 0.81 }}
                  value={formState.inputValues.extramt}
                  isSubmitted={isSubmitted}
                  initiallyValid={formState.inputValidities.extramt}
                  id="extramt"
                  onInputChange={inputChangeHandler}
                  keyboardType="numeric"
                  label="Other Amount"
                />
                <View style={Styles.actionsContainer}>
                  <View style={Styles.btnContainer}>
                    <RaisedButton
                      title="Add TPort Preference"
                      onPress={addPreference}
                      style={{
                        flex: null,
                        height: 40,
                        backgroundColor: "#343A40",
                      }}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          {preferences.length > 0 && (
            <View style={styles.listContainer}>
              <Text style={styles.headingText}>*Unsaved Preferences</Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                data={preferences}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <PrefTile
                    pref={item}
                    onRemove={() => removePref(item.prefId)}
                    screen={ScreenNames.TRANS_ADD_PREF_SCREEN}
                  />
                )}
              />
            </View>
          )}
          {preferences.length > 0 && (
            <View style={{ ...Styles.actionsContainer, marginVertical: 5 }}>
              <View style={Styles.btnContainer}>
                <RaisedButton
                  style={{ ...styles.textBtn, backgroundColor: Colors.success }}
                  titleStyle={styles.titleStyle}
                  title="Save Preference"
                  onPress={savePreferenceData}
                />
              </View>
            </View>
          )}
        </ScrollView>
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
  listContainer: {
    width: "100%",
    height: window.height * 0.8,
    flexDirection: "column",
    alignItems: "center",
  },
  headingText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
    color: "#FFF",
  },
  textBtn: {
    flex: null,
    margin: null,
  },
  titleStyle: { margin: null },
});

export default AddPrefScreen;
