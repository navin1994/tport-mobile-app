import React, { useState, useCallback, useReducer, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { useDispatch } from "react-redux";

import {
  formReducer,
  FORM_INPUT_UPDATE,
  RESET_FORM,
} from "../../shared/Functions/FormReducer";
import * as fleetActions from "../../store/action/fleet";
import FleetForm from "../../shared/components/FleetForm";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import ProgressIndicator from "../../shared/UI/ProgressIndicator";
import { vehInitFormState } from "../../shared/constants/Variables";

const AddFleetScreen = (props) => {
  const [isFleetSubmit, setIsFleetSubmit] = useState(false);
  const [error, setError] = useState();
  const [reset, setReset] = useState(false);
  const [isLoading, setIsLoading] = useState({
    state: false,
    msg: "Loading...",
  });
  const [vehFormState, dispatchVehFormState] = useReducer(
    formReducer,
    vehInitFormState
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

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

  const onSubmitFleetForm = async () => {
    setIsFleetSubmit(true);
    if (!vehFormState.formIsValid) {
      Alert.alert("Wrong Input", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }

    setError(null);
    try {
      setIsLoading({ state: true, msg: "saving..." });
      const result = await dispatch(
        fleetActions.regNewFleet(vehFormState.inputValues)
      );
      setIsLoading({ state: false, msg: "" });
      if (result.Result === "OK") {
        dispatchVehFormState({
          type: RESET_FORM,
          initialFormState: vehInitFormState,
        });
        setReset(!reset);
        setIsFleetSubmit(false);
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading.state && <ProgressIndicator msg={isLoading.msg} />}

        <View
          style={styles.screen}
          pointerEvents={isLoading.state ? "none" : "auto"}
        >
          <View style={styles.container}>
            <FleetForm
              setError={setError}
              isFleetSubmit={isFleetSubmit}
              reset={reset}
              onSubmitFleetForm={onSubmitFleetForm}
              vehFormState={vehFormState}
              vehInputChangeHandler={vehInputChangeHandler}
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
  container: {
    flex: 1,
    marginTop: 10,
  },
});

export default AddFleetScreen;
