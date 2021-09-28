import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  FlatList,
  View,
  StyleSheet,
  Alert,
  Dimensions,
  LogBox,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import TAndCContainer from "../UI/TAndCContainer";
import ProgressIndicator from "../UI/ProgressIndicator";
import Colors from "../constants/Colors";
import RaisedButton from "./RaisedButton";
import VehicleDetailsTile from "../UI/VehicleDetailsTile";
import * as fleetActions from "../../store/action/fleet";
import * as transporterActions from "../../store/action/transporter";
import * as authActions from "../../store/action/auth";

const window = Dimensions.get("window");

const AddedFleetsList = (props) => {
  const navigation = useNavigation();
  const [isSubLoader, setIsSubLoader] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [error, setError] = useState(null);
  const formState = useSelector((state) => state.transp);
  const dispatch = useDispatch();

  const addedFleets = useSelector((state) => {
    const transformedItems = [];
    for (const key in state.fleets.fleets) {
      transformedItems.push({
        vtypid: state.fleets.fleets[key].vtypid,
        vehphoto: state.fleets.fleets[key].vehphoto,
        vehregfle: state.fleets.fleets[key].vehregfle,
        vehinsurancedoc: state.fleets.fleets[key].vehinsurancedoc,
        vehfitcetexpdte: state.fleets.fleets[key].vehfitcetexpdte,
        vehfitcetphoto: state.fleets.fleets[key].vehfitcetphoto,
        vehpucexpdte: state.fleets.fleets[key].vehpucexpdte,
        vehpucphoto: state.fleets.fleets[key].vehpucphoto,
        vehno: state.fleets.fleets[key].vehno,
        vtypnm: state.fleets.fleets[key].vtypnm,
        vehregdte: state.fleets.fleets[key].vehregdte,
        vehchesino: state.fleets.fleets[key].vehchesino,
        vehinsuno: state.fleets.fleets[key].vehinsuno,
        vehinsexpdte: state.fleets.fleets[key].vehinsexpdte,
      });
    }

    return transformedItems;
  });

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const inputChangeHandler = useCallback(
    (identifier, inputValue, inputValidity) => {
      dispatch(
        transporterActions.formInputUpdate(
          identifier,
          inputValue,
          inputValidity
        )
      );
    },
    [dispatch]
  );

  const onRemoveFleet = (vehNumber) => {
    return Alert.alert(
      "Are your sure?",
      `Are you sure you want to remove this fleet of vehicle number ${vehNumber} ?`,
      [
        {
          text: "Yes",
          onPress: () => {
            dispatch(fleetActions.removeFleet(vehNumber));
            formState.inputValues.vehclst =
              formState.inputValues.vehclst.filter(
                (item) => item.vehno != vehNumber
              );
            inputChangeHandler(
              "vehclst",
              [
                ...formState.inputValues.vehclst.filter(
                  (item) => item.vehno != vehNumber
                ),
              ],
              formState.inputValues.vehclst.length > 1 ? true : false
            );
          },
        },
        { text: "No" },
      ]
    );
  };

  const onSubmitRegistrationForm = async () => {
    if (formState.inputValues.vehclst.length < 1) {
      Alert.alert("Error", "Please add at least add 1 vehicle details.", [
        { text: "Okay" },
      ]);
      return;
    }
    if (!isChecked) {
      Alert.alert("Error", "Please accept the terms and conditions.", [
        { text: "Okay" },
      ]);
      return;
    }

    setError(null);
    setIsSubLoader(true);
    try {
      const resData = await dispatch(
        authActions.transporterRegistration(formState.inputValues)
      );
      dispatch(fleetActions.resetFleet());
      dispatch(transporterActions.resetForm());
      setIsSubLoader(false);
      setChecked(false);
      navigation.goBack();
      Alert.alert("Registration", resData.Msg, [{ text: "Okay" }]);
      setIsSubLoader(false);
    } catch (err) {
      setIsSubLoader(false);
      setError(err.message);
    }
  };

  return (
    <View
      style={styles.container}
      pointerEvents={isSubLoader ? "none" : "auto"}
    >
      {isSubLoader && <ProgressIndicator msg="Registering Transporter" />}
      {formState.inputValues.vehclst.length === 0 &&
        addedFleets.length === 0 && (
          <Text style={{ ...styles.errorText, fontSize: 16, color: "yellow" }}>
            Please add fleet Details
          </Text>
        )}
      {formState.inputValues.vehclst.length !== 0 && addedFleets.length !== 0 && (
        <View style={styles.vehListContainer}>
          <FlatList
            nestedScrollEnabled
            data={addedFleets}
            keyExtractor={(item) => item.vehno}
            renderItem={(itemData) => (
              <VehicleDetailsTile
                vehicleNo={itemData.item.vehno}
                vehType={itemData.item.vtypnm}
                regDate={itemData.item.vehregdte}
                chesisNo={itemData.item.vehchesino}
                insuranceNo={itemData.item.vehinsuno}
                insuranceExpDate={itemData.item.vehinsexpdte}
                onRemove={() => onRemoveFleet(itemData.item.vehno)}
              />
            )}
          />
        </View>
      )}
      <View>
        <TAndCContainer
          navigation={navigation}
          value={isChecked}
          onValueChange={setChecked}
        />
        <RaisedButton
          title="SUBMIT"
          style={styles.submitBtn}
          onPress={onSubmitRegistrationForm}
        />

        <RaisedButton
          title="Prev"
          style={styles.navBtn}
          onPress={() => {
            const { back } = props;
            back();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: window.height - 60,
    width: window.width,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "black",
  },
  vehListContainer: {
    marginVertical: 10,
    minHeight: window.height * 0.3,
    maxHeight: window.height * 0.6,
    // width: window.width * 0.95,
    borderWidth: 1,
    paddingHorizontal: 2,
    borderRadius: 8,
  },
  submitBtn: {
    flex: null,
    width: 240,
    backgroundColor: Colors.danger,
    alignSelf: "center",
  },
  errorText: {
    fontFamily: "open-sans",
    color: Colors.danger,
    fontSize: 13,
  },
  navBtn: {
    flex: null,
    backgroundColor: Colors.success,
    width: 150,
    alignSelf: "center",
  },
});

export default AddedFleetsList;
