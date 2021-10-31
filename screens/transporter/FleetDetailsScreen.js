import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useReducer,
} from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  FlatList,
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import Moment from "moment";

import Colors from "../../shared/constants/Colors";
import ImageDocPicker from "../../shared/components/ImageDocPicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import RaisedButton from "../../shared/components/RaisedButton";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import Card from "../../shared/UI/Card";
import ProgressIndicator from "../../shared/UI/ProgressIndicator";
import Styles from "../../shared/styles/styles";
import * as fleetActions from "../../store/action/fleet";
import TextField from "../../shared/components/TextField";
import {
  FORM_INPUT_UPDATE,
  RESET_FORM,
  formReducer,
} from "../../shared/Functions/FormReducer";

const window = Dimensions.get("window");

const INSURANCE = "INSURANCE";
const PUC = "PUC";
const FIT = "FIT";
const initialFormState = {
  inputValues: {
    insNumber: "",
    insExpDte: "",
    insuranceDoc: "",
    pucExpDte: "",
    pucDoc: "",
    fitnessDoc: "",
    fitExpDte: "",
  },
  inputValidities: {
    insNumber: false,
    insExpDte: false,
    insuranceDoc: false,
    pucExpDte: false,
    pucDoc: false,
    fitnessDoc: false,
    fitExpDte: false,
  },
  formIsValid: false,
};

const FleetDetailsScreen = (props) => {
  const { navigation, route } = props;
  const fleet = useSelector((state) =>
    state.fleets.regFleets.find((x) => x.vehid === route.params)
  );
  const [error, setError] = useState();
  const [isInsEdit, setInsEdit] = useState(false);
  const [isPucEdit, setPucEdit] = useState(false);
  const [isFitEdit, setFitEdit] = useState(false);
  const [showDatePkr, setShowDatePkr] = useState(false);
  const [currentPicker, setCurrentPicker] = useState();
  const [showImagePicker, setImagePicker] = useState(false);
  const [isMultiSelection, setIsMultiSelection] = useState(false);
  const [currentDateField, setDateField] = useState("");
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [image, setImage] = useState({ uri: fleet.vehphoto[0] });
  const [formState, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState({
    state: false,
    msg: "Loading...",
  });

  const dispatch = useDispatch();
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
    if (!isFocused) {
      setIsSubmitted(false);
      dispatchVehFormState({
        type: RESET_FORM,
        initialFormState: vehInitFormState,
      });
    }
  }, [isFocused]);

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

  const updateFitness = () => {
    const formData = formState.inputValues;
    const validity = formState.inputValidities;
    setIsSubmitted(true);
    if (
      formData.fitExpDte === "" ||
      formData.fitnessDoc === "" ||
      validity.fitExpDte === false ||
      validity.fitnessDoc === false
    ) {
      Alert.alert(
        "Error",
        "Please provide valid Fitness Expiry Date and documents.",
        [{ text: "Okay" }]
      );
      return;
    }
    const data = {
      vid: fleet.vehid,
      vehpucexpdte: formData.fitExpDte,
      vehpucphoto: formData.fitnessDoc,
      sts: FIT,
    };
    finalMethod(data, "Updating Fitness details...");
  };

  const updatePuc = () => {
    const formData = formState.inputValues;
    const validity = formState.inputValidities;
    setIsSubmitted(true);
    if (
      formData.pucExpDte === "" ||
      formData.pucDoc === "" ||
      validity.pucExpDte === false ||
      validity.pucDoc === false
    ) {
      Alert.alert(
        "Error",
        "Please provide valid PUC expiry date and documents.",
        [{ text: "Okay" }]
      );
      return;
    }
    const data = {
      vid: fleet.vehid,
      vehpucexpdte: formData.pucExpDte,
      vehpucphoto: formData.pucDoc,
      sts: PUC,
    };
    finalMethod(data, "Updating PUC details...");
  };

  const updateInsurance = () => {
    const formData = formState.inputValues;
    const validity = formState.inputValidities;
    setIsSubmitted(true);
    if (
      formData.insNumber === "" ||
      formData.insExpDte === "" ||
      formData.insuranceDoc === "" ||
      validity.insNumber === false ||
      validity.insuranceDoc === false ||
      validity.insExpDte === false
    ) {
      Alert.alert(
        "Error",
        "Please provide valid insurance number and insurance expiry date.",
        [{ text: "Okay" }]
      );
      return;
    }
    const data = {
      vid: fleet.vehid,
      vehinsuno: formData.insNumber,
      vehinsexpdte: formData.insExpDte,
      vehinsurancedoc: formData.insuranceDoc,
      sts: INSURANCE,
    };
    finalMethod(data, "Updating Insurance...");
  };

  const finalMethod = async (data, msg) => {
    setError(null);
    try {
      setIsLoading({ state: true, msg: msg });
      const result = await dispatch(fleetActions.updateFleet(data));
      setIsLoading({ state: false, msg: "" });
      setIsSubmitted(false);
      switch (data.sts) {
        case INSURANCE:
          inputChangeHandler("insExpDte", "", false);
          inputChangeHandler("insNumber", "", false);
          inputChangeHandler("insuranceDoc", "", false);
          setInsEdit(false);
          break;
        case PUC:
          inputChangeHandler("pucExpDte", "", false);
          inputChangeHandler("pucDoc", "", false);
          setPucEdit(false);
          break;
        case FIT:
          inputChangeHandler(fitExpDte, "", false);
          inputChangeHandler(fitnessDoc, "", false);
          setFitEdit(false);
          break;
        default:
          dispatchFormState({
            type: RESET_FORM,
            initialFormState: initialFormState,
          });
      }
      const res = dispatch(fleetActions.getFleetsData());
      Alert.alert("Alert", result.Msg, [{ text: "Okay" }]);
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  const deleteFleet = () => {
    Alert.alert("Alert!", "Do you really want to delete the fleet?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "YES, DELETE",
        onPress: async () => {
          setError(null);
          try {
            setIsLoading({ state: true, msg: "Deleting Fleets..." });
            const result = await dispatch(
              fleetActions.deleteFleet(fleet.vehid)
            );
            setIsLoading({ state: false, msg: "" });
            if (result.Result === "OK") {
              navigation.goBack();
              Alert.alert("Success", result.Msg, [{ text: "Okay" }]);
            } else {
              Alert.alert("Error", result.Msg, [{ text: "Okay" }]);
            }
          } catch (err) {
            setIsLoading({ state: false, msg: "" });
            setError(err.message);
          }
        },
      },
    ]);
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePkr(false);
    setMinDate(null);
    setMaxDate(null);
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

  const openDatePicker = (data) => {
    setShowDatePkr(true);
    setDateField(data.currentField);
    setMinDate(data.minDate);
    setMaxDate(data.maxDate);
  };

  const onCloseModal = useCallback(() => {
    setImagePicker(false);
  }, [showImagePicker]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: fleet.vtypnm,
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
          {showDatePkr && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChangeDate}
              maximumDate={minDate}
              minimumDate={maxDate}
            />
          )}
          <ImageDocPicker
            inputchangeHandler={inputChangeHandler}
            visible={showImagePicker}
            isMultiple={isMultiSelection}
            id={currentPicker}
            closeModal={onCloseModal}
          />
          <View style={styles.imgContainer}>
            <View style={styles.mainImg}>
              <Image source={image} style={styles.img} />
            </View>
            <View style={styles.imageTray}>
              <FlatList
                style={styles.flatListStyle}
                bounces={true}
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled
                data={fleet.vehphoto}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(itemData) => (
                  <TouchableCmp
                    useForeground
                    onPress={() => {
                      setImage({ uri: itemData.item });
                    }}
                  >
                    <View style={styles.imgThumbnail}>
                      <Image
                        style={styles.image}
                        source={{ uri: itemData.item }}
                      />
                    </View>
                  </TouchableCmp>
                )}
              />
            </View>
          </View>
          <View style={styles.vehContainer}>
            <Card style={styles.vehInfoContainer}>
              <View style={styles.vehInfoRow}>
                <Text style={styles.vehInfoHead}>Vehicle Number:</Text>
                <Text style={styles.vehInfoData}>{fleet.vehno}</Text>
              </View>
              <View style={styles.separator}></View>
              <View style={styles.vehInfoRow}>
                <Text style={styles.vehInfoHead}>Register Date:</Text>
                <Text style={styles.vehInfoData}>{fleet.vehregdte}</Text>
              </View>
              <View style={styles.separator}></View>
              <View style={styles.vehInfoRow}>
                <Text style={styles.vehInfoHead}>Chesis Number:</Text>
                <Text style={styles.vehInfoData}>{fleet.vehchesino}</Text>
              </View>
              <View style={styles.separator}></View>
              {!isInsEdit && (
                <View style={styles.vehInfoRow}>
                  <Text style={styles.vehInfoHead}>Insurance No:</Text>
                  <View style={styles.editableSide}>
                    <Text style={{ ...styles.vehInfoData, marginRight: 5 }}>
                      {fleet.vehinsuno}
                    </Text>
                    <TouchableCmp onPress={() => {}}>
                      <MaterialCommunityIcons
                        name="download-circle-outline"
                        size={24}
                        color="black"
                        style={{ marginHorizontal: 10 }}
                      />
                    </TouchableCmp>
                    <TouchableCmp
                      onPress={() => {
                        setInsEdit(true);
                      }}
                    >
                      <FontAwesome
                        name="edit"
                        size={24}
                        color="black"
                        style={{ marginLeft: 10 }}
                      />
                    </TouchableCmp>
                  </View>
                </View>
              )}
              {isInsEdit && (
                <View style={styles.inpRow}>
                  <TextField
                    style={{ width: "103%", marginTop: 10 }}
                    value={formState.inputValues.insNumber}
                    isSubmitted={isSubmitted}
                    initiallyValid={formState.inputValidities.insNumber}
                    id="insNumber"
                    required
                    onInputChange={inputChangeHandler}
                    label="Insurance Number"
                  />
                  <TouchableCmp onPress={updateInsurance}>
                    <FontAwesome name="save" size={24} color="black" />
                  </TouchableCmp>
                  <TouchableCmp
                    onPress={() => {
                      setInsEdit(false);
                      inputChangeHandler("insNumber", "", false);
                      inputChangeHandler("insExpDte", "", false);
                      inputChangeHandler("insuranceDoc", "", false);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="cancel"
                      size={24}
                      color="black"
                    />
                  </TouchableCmp>
                </View>
              )}
              <View style={styles.separator}></View>
              {!isInsEdit && (
                <View style={styles.vehInfoRow}>
                  <Text style={styles.vehInfoHead}>
                    Insurance Validity Date:
                  </Text>
                  <Text style={styles.vehInfoData}>{fleet.vehinsexpdte}</Text>
                </View>
              )}
              {isInsEdit && (
                <View style={styles.inpRow}>
                  <TextField
                    value={formState.inputValues.insExpDte}
                    isSubmitted={isSubmitted}
                    initiallyValid={false}
                    id="insExpDte"
                    placeholder="YYYY-MM-DD"
                    onInputChange={inputChangeHandler}
                    readonly={true}
                    label="Insurance Expiry Date"
                    style={{ width: "100%", marginTop: 10 }}
                    trailingIcon={
                      <TouchableCmp
                        onPress={() => {
                          openDatePicker({
                            currentField: "insExpDte",
                            maxDate: new Date(),
                            get minDate() {
                              const nextDate = new Date();
                              nextDate.setDate(nextDate.getDate() + 730);
                              return nextDate;
                            },
                          });
                        }}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={25}
                          color="black"
                        />
                      </TouchableCmp>
                    }
                  />
                  <TouchableCmp
                    onPress={() => {
                      setCurrentPicker("insuranceDoc");
                      setIsMultiSelection(false);
                      setImagePicker(true);
                    }}
                  >
                    <FontAwesome
                      name="upload"
                      size={24}
                      color={
                        formState.inputValues.insuranceDoc === ""
                          ? Colors.primary
                          : Colors.success
                      }
                    />
                  </TouchableCmp>
                </View>
              )}
              <View style={styles.separator}></View>
              {!isPucEdit && (
                <View style={styles.vehInfoRow}>
                  <Text style={styles.vehInfoHead}>PUC Validity Date:</Text>
                  <View style={styles.editableSide}>
                    <Text style={{ ...styles.vehInfoData, marginRight: 5 }}>
                      {fleet.vehpucexpdte}
                    </Text>
                    <TouchableCmp onPress={() => {}}>
                      <MaterialCommunityIcons
                        name="download-circle-outline"
                        size={24}
                        color="black"
                        style={{ marginHorizontal: 10 }}
                      />
                    </TouchableCmp>
                    <TouchableCmp
                      onPress={() => {
                        setPucEdit(true);
                      }}
                    >
                      <FontAwesome
                        name="edit"
                        size={24}
                        color="black"
                        style={{ marginLeft: 10 }}
                      />
                    </TouchableCmp>
                  </View>
                </View>
              )}
              {isPucEdit && (
                <View style={styles.inpRow}>
                  <TextField
                    value={formState.inputValues.pucExpDte}
                    isSubmitted={isSubmitted}
                    initiallyValid={false}
                    id="pucExpDte"
                    placeholder="YYYY-MM-DD"
                    onInputChange={inputChangeHandler}
                    readonly={true}
                    label="PUC Expiry Date"
                    style={{ width: "100%", marginTop: 10 }}
                    trailingIcon={
                      <TouchableCmp
                        onPress={() => {
                          openDatePicker({
                            currentField: "pucExpDte",
                            maxDate: new Date(),
                          });
                        }}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={25}
                          color="black"
                        />
                      </TouchableCmp>
                    }
                  />
                  <TouchableCmp
                    onPress={() => {
                      setCurrentPicker("pucDoc");
                      setIsMultiSelection(false);
                      setImagePicker(true);
                    }}
                  >
                    <FontAwesome
                      name="upload"
                      size={24}
                      color={
                        formState.inputValues.pucDoc === ""
                          ? Colors.primary
                          : Colors.success
                      }
                    />
                  </TouchableCmp>
                  <TouchableCmp onPress={updatePuc}>
                    <FontAwesome name="save" size={24} color="black" />
                  </TouchableCmp>
                  <TouchableCmp
                    onPress={() => {
                      setPucEdit(false);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="cancel"
                      size={24}
                      color="black"
                    />
                  </TouchableCmp>
                </View>
              )}
              <View style={styles.separator}></View>
              {!isFitEdit && (
                <View style={styles.vehInfoRow}>
                  <Text style={styles.vehInfoHead}>Fitness Validity Date:</Text>
                  <View style={styles.editableSide}>
                    <Text style={{ ...styles.vehInfoData, marginRight: 5 }}>
                      {fleet.vehfitcetexpdte}
                    </Text>
                    <TouchableCmp onPress={() => {}}>
                      <MaterialCommunityIcons
                        name="download-circle-outline"
                        size={24}
                        color="black"
                        style={{ marginHorizontal: 10 }}
                      />
                    </TouchableCmp>
                    <TouchableCmp
                      onPress={() => {
                        setFitEdit(true);
                      }}
                    >
                      <FontAwesome
                        name="edit"
                        size={24}
                        color="black"
                        style={{ marginLeft: 10 }}
                      />
                    </TouchableCmp>
                  </View>
                </View>
              )}
              {isFitEdit && (
                <View style={styles.inpRow}>
                  <TextField
                    value={formState.inputValues.fitExpDte}
                    isSubmitted={isSubmitted}
                    initiallyValid={false}
                    id="fitExpDte"
                    placeholder="YYYY-MM-DD"
                    onInputChange={inputChangeHandler}
                    readonly={true}
                    label="Fitness Expiry Date"
                    style={{ width: "100%", marginTop: 10 }}
                    trailingIcon={
                      <TouchableCmp
                        onPress={() => {
                          openDatePicker({
                            currentField: "fitExpDte",
                            maxDate: new Date(),
                          });
                        }}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={25}
                          color="black"
                        />
                      </TouchableCmp>
                    }
                  />
                  <TouchableCmp
                    onPress={() => {
                      setCurrentPicker("fitnessDoc");
                      setIsMultiSelection(false);
                      setImagePicker(true);
                    }}
                  >
                    <FontAwesome
                      name="upload"
                      size={24}
                      color={
                        formState.inputValues.fitnessDoc === ""
                          ? Colors.primary
                          : Colors.success
                      }
                    />
                  </TouchableCmp>
                  <TouchableCmp onPress={updateFitness}>
                    <FontAwesome name="save" size={24} color="black" />
                  </TouchableCmp>
                  <TouchableCmp
                    onPress={() => {
                      setFitEdit(false);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="cancel"
                      size={24}
                      color="black"
                    />
                  </TouchableCmp>
                </View>
              )}
              <View style={styles.separator}></View>
              <View style={{ ...Styles.actionsContainer, marginVertical: 5 }}>
                <View style={Styles.btnContainer}>
                  <RaisedButton
                    style={styles.textBtn}
                    titleStyle={styles.titleStyle}
                    title="DELETE FLEET"
                    onPress={deleteFleet}
                  />
                </View>
              </View>
            </Card>
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
    justifyContent: "center",
  },
  imgContainer: { flex: 1, alignItems: "center" },
  mainImg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    overflow: "hidden",
  },
  img: {
    resizeMode: "stretch",
    height: window.width * 0.9,
    width: window.width * 0.95,
  },
  imageTray: {
    margin: 5,
    width: window.width * 0.95,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 110,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  imgThumbnail: {
    flex: 1,
    borderWidth: 1,
    marginHorizontal: 4,
    borderRadius: 5,
    height: "95%",
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListStyle: { height: "95%", width: 80 },
  image: {
    flex: 1,
    resizeMode: "cover",
    height: "100%",
    width: "100%",
  },
  vehContainer: { marginVertical: 10, alignItems: "center" },
  vehInfoContainer: {
    width: window.width * 0.95,
  },
  vehInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 40,
  },
  inpRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // minHeight: 40,
  },
  vehInfoHead: {
    fontFamily: "open-sans",
    fontSize: 14,
    color: "grey",
  },
  vehInfoData: { fontFamily: "open-sans", fontSize: 13, marginRight: 20 },
  separator: {
    height: 1,
    backgroundColor: "grey",
    marginVertical: 3,
  },
  textBtn: {
    flex: null,
    margin: null,
  },
  titleStyle: { margin: null },
  editableSide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default FleetDetailsScreen;
