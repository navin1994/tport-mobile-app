import React, { useState, useCallback, useReducer, useEffect } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  formReducer,
  FORM_INPUT_UPDATE,
  RESET_FORM,
} from "../Functions/FormReducer";
import Colors from "../constants/Colors";
import RaisedButton from "./RaisedButton";
import * as transporterActions from "../../store/action/transporter";
import * as fleetActions from "../../store/action/fleet";
import FleetForm from "./FleetForm";

const window = Dimensions.get("window");

const vehInitFormState = {
  inputValues: {
    vtypid: "",
    vtypnm: "",
    vehno: "",
    vehregdte: "",
    vehinsexpdte: "",
    vehinsuno: "",
    vehchesino: "",
    vehphoto: [],
    vehregfle: "",
    vehinsurancedoc: "",
    vehfitcetexpdte: "",
    vehfitcetphoto: "",
    vehpucexpdte: "",
    vehpucphoto: "",
  },
  inputValidities: {
    vtypid: false,
    vtypnm: false,
    vehno: false,
    vehregdte: false,
    vehinsexpdte: false,
    vehinsuno: false,
    vehchesino: false,
    vehphoto: false,
    vehregfle: false,
    vehinsurancedoc: false,
    vehfitcetexpdte: false,
    vehfitcetphoto: false,
    vehpucexpdte: true,
    vehpucphoto: true,
  },
  formIsValid: false,
};

const FleetRegistrationForm = (props) => {
  const [isFleetSubmit, setIsFleetSubmit] = useState(false);
  const [error, setError] = useState();
  const [reset, setReset] = useState(false);
  const [vehFormState, dispatchVehFormState] = useReducer(
    formReducer,
    vehInitFormState
  );
  const formState = useSelector((state) => state.transp);
  const dispatch = useDispatch();

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

  const vehInputChangeHandler = useCallback(
    (identifier, inputValue, inputValidity) => {
      if (
        identifier === "vehpucexpdte" &&
        (vehInitFormState.inputValues.vehpucphoto === "" ||
          vehInitFormState.inputValues.vehpucphoto == null)
      ) {
        dispatchVehFormState({
          type: FORM_INPUT_UPDATE,
          value: "",
          isValid: false,
          input: "vehpucphoto",
        });
      }
      dispatchVehFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: identifier,
      });
    },
    [dispatchVehFormState]
  );

  const onSubmitFleetForm = () => {
    setIsFleetSubmit(true);
    if (!vehFormState.formIsValid) {
      Alert.alert("Wrong Input", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    dispatch(fleetActions.addFleet(vehFormState.inputValues));
    dispatchVehFormState({
      type: RESET_FORM,
      initialFormState: vehInitFormState,
    });
    setReset(!reset);
    inputChangeHandler(
      "vehclst",
      [...formState.inputValues.vehclst, vehFormState.inputValues],
      true
    );
    setIsFleetSubmit(false);
  };

  const onBack = () => {
    const { back } = props;
    back();
  };

  const onNext = () => {
    const { next } = props;
    next();
  };

  return (
    <View style={styles.container}>
      <FleetForm
        setError={setError}
        isFleetSubmit={isFleetSubmit}
        reset={reset}
        onSubmitFleetForm={onSubmitFleetForm}
        vehFormState={vehFormState}
        vehInputChangeHandler={vehInputChangeHandler}
      />
      <View style={styles.navConainer}>
        <RaisedButton title="Prev" style={styles.navBtn} onPress={onBack} />
        <RaisedButton title="Next" style={styles.navBtn} onPress={onNext} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  navConainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  navBtn: {
    backgroundColor: Colors.success,
    width: 150,
  },
});

export default FleetRegistrationForm;
