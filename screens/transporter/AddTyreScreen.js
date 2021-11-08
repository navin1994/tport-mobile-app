import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  View,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../shared/constants/Colors";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import ProgressIndicator from "../../shared/UI/ProgressIndicator";
import TyreTile from "../../shared/UI/TyreTile";
import RaisedButton from "../../shared/components/RaisedButton";
import ScreenNames from "../../shared/constants/ScreenNames";
import TyreFormDialog from "../../shared/components/TyreFormDialog";
import * as fleetActions from "../../store/action/fleet";

const AddTyreScreen = (props) => {
  const { navigation, route } = props;
  const vehId = route.params;
  const [error, setError] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isClearForm, setClearForm] = useState(false);
  const [isLoading, setIsLoading] = useState({
    state: false,
    msg: "Loading...",
  });
  const dispatch = useDispatch();

  const tyres = useSelector((state) => state.fleets.tyres);

  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const removeTyre = (id) => {
    dispatch(fleetActions.removeTyre(id));
  };

  const addTyreDetails = ({ inputValues, inputValidities, formIsValid }) => {
    setIsSubmitted(true);
    if (!formIsValid) {
      Alert.alert("Error", "Please check error in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    dispatch(fleetActions.addTyre(inputValues));
    onCloseDialog();
  };

  const saveTyresData = async () => {
    const data = {
      vehid: vehId,
      sts: "T",
      tyres: tyres,
    };
    setError(null);
    try {
      setIsLoading({ state: true, msg: "saving data..." });
      const result = await dispatch(fleetActions.saveFleetInfo(data));
      setIsLoading({ state: false, msg: "" });
      if (result.Result === "OK") {
        dispatch(fleetActions.resetTyre());
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

  const onCloseDialog = useCallback(() => {
    setShowDialog(false);
    setClearForm(!isClearForm);
    setIsSubmitted(false);
  }, [setShowDialog]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableCmp
          useForeground
          onPress={() => {
            setShowDialog(true);
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
        <TyreFormDialog
          visible={showDialog}
          closeModal={onCloseDialog}
          isSubmitted={isSubmitted}
          saveTyre={addTyreDetails}
          isClearForm={isClearForm}
          screen={ScreenNames.TRANS_ADD_TYRE_SCREEN}
        />
        {tyres.length === 0 && (
          <View style={styles.btnContainer}>
            <RaisedButton
              title="Add New Tyre Details"
              onPress={() => {
                setShowDialog(true);
              }}
              style={{
                flex: null,
                height: 40,
                backgroundColor: Colors.success,
              }}
            />
          </View>
        )}
        {tyres.length > 0 && (
          <FlatList
            ListFooterComponent={
              <View style={styles.btnContainer}>
                <RaisedButton
                  title="SAVE DATA"
                  onPress={saveTyresData}
                  style={{
                    flex: null,
                    height: 40,
                    backgroundColor: Colors.success,
                  }}
                />
              </View>
            }
            nestedScrollEnabled
            data={tyres}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TyreTile
                tyre={item}
                onRemove={removeTyre}
                screen={ScreenNames.TRANS_ADD_TYRE_SCREEN}
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
  btnContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddTyreScreen;
