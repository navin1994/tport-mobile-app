import React, { useState, useEffect, useCallback } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import Moment from "moment";

import Colors from "../../shared/constants/Colors";
import RaisedButton from "../../shared/components/RaisedButton";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import Card from "../../shared/UI/Card";
import BidsModal from "../../shared/components/BidsModal";
import ProgressIndicator from "../../shared/UI/ProgressIndicator";
import InputConfirmDialog from "../../shared/components/InputConfirmDialog";
import RatingModal from "../../shared/components/RatingModal";
import * as biddingActions from "../../store/action/biding";
import * as contractActions from "../../store/action/contract";
import ScreenNames from "../../shared/constants/ScreenNames";
import RatingStars from "../../shared/UI/RatingStars";

const window = Dimensions.get("window");

const DetailedContractScreen = (props) => {
  const { navigation, route } = props;
  const contract = route.params.contract;
  const screen = route.params.screen;
  const [error, setError] = useState();
  const [message, setMessage] = useState();
  const [image, setImage] = useState({
    uri: contract.loadphoto !== null ? contract.loadphoto[0] : "",
  });
  const [showBids, setBids] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConfirm, setConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState({
    state: false,
    msg: "Loading...",
  });
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth);

  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const onCloseModal = useCallback(() => {
    setBids(false);
  }, [setBids]);

  const onCloseRatingModal = useCallback(() => {
    setShowRatingModal(false);
  }, [setShowRatingModal]);

  const onCloseCancelModal = useCallback(() => {
    setShowCancelModal(false);
    setIsSubmitted(false);
  }, [setShowCancelModal]);

  const getBiddings = async () => {
    setError(null);
    try {
      setIsLoading({ state: true, msg: "Getting Biddings..." });
      const result = await dispatch(
        biddingActions.getBiddings(contract.contractid)
      );
      if (result.Result === "OK") {
      }
      setIsLoading({ state: false, msg: "" });
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  const getBiddingHistory = async () => {
    setError(null);
    try {
      setIsLoading({ state: true, msg: "Getting Biddings..." });
      const result = await dispatch(
        biddingActions.getBiddingHistory(contract.contractid)
      );
      setIsLoading({ state: false, msg: "" });
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  const loadAccept = async (rating) => {
    if (rating === 0) {
      Alert.alert("Error", "Please provide ratings", [{ text: "Okay" }]);
      return;
    }

    const data = {
      contractid: contract.contractid,
      rateting: rating,
      toid: user.tid,
      sts: "C",
    };

    setError(null);
    try {
      setIsLoading({ state: true, msg: "Closing Contract..." });
      const result = await dispatch(contractActions.loadAccept(data));
      if (result.Result === "OK") {
        setShowRatingModal(false);
        navigation.goBack();
        Alert.alert("Success", result.Msg, [{ text: "Okay" }]);
      }
      setIsLoading({ state: false, msg: "" });
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

  const cancelContract = async (reasonTxt) => {
    setIsSubmitted(true);
    if (reasonTxt.toString().trim() === "" || reasonTxt === null) {
      return;
    }
    setError(null);
    try {
      setIsLoading({ state: true, msg: "Cancelling Contract..." });
      const result = await dispatch(
        contractActions.cancelContract(contract.contractid, reasonTxt)
      );
      if (result.Result === "OK") {
        setShowCancelModal(false);
        navigation.goBack();
        Alert.alert("Success", result.Msg, [{ text: "Okay" }]);
      }
      setIsLoading({ state: false, msg: "" });
    } catch (err) {
      setIsLoading({ state: false, msg: "" });
      setError(err.message);
    }
  };

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
          <RatingModal
            visible={showRatingModal}
            closeModal={onCloseRatingModal}
            message={message}
            onRating={loadAccept}
          />
          <BidsModal
            visible={showBids}
            closeModal={onCloseModal}
            isConfirm={isConfirm}
            setIsLoading={setIsLoading}
          />
          <InputConfirmDialog
            visible={showCancelModal}
            closeModal={onCloseCancelModal}
            title="Confirmation"
            message="Please enter the reason for contract cancellation."
            method={cancelContract}
            inputLabel="Cancellation Reason"
            isSubmitted={isSubmitted}
            confirmBtnText="Cancel Contract"
            errorText="Please enter valid cancellation reason."
          />
          {contract.loadphoto && (
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
                  data={contract.loadphoto}
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
          )}
          <View style={styles.contractDetailsContainer}>
            <Card style={styles.card}>
              <Text style={styles.mainHead}>CONTRACT DETAILS</Text>
              <View style={styles.cntDtls}>
                <Ionicons
                  style={{ marginRight: 5 }}
                  name={
                    Platform.OS === "android"
                      ? "md-checkmark-circle"
                      : "ios-checkmark-circle"
                  }
                  size={20}
                  color={Colors.danger}
                />
                <Text style={styles.heading}>From: </Text>
                <Text style={styles.text}>{contract.trnsfrm}</Text>
              </View>
              <View style={styles.cntDtls}>
                <Ionicons
                  style={{ marginRight: 5 }}
                  name={
                    Platform.OS === "android"
                      ? "md-checkmark-circle"
                      : "ios-checkmark-circle"
                  }
                  size={20}
                  color={Colors.danger}
                />
                <Text style={styles.heading}>To: </Text>
                <Text style={styles.text}>{contract.trnsto}</Text>
              </View>
              <View style={styles.cntDtls}>
                <Ionicons
                  style={{ marginRight: 5 }}
                  name={
                    Platform.OS === "android"
                      ? "md-checkmark-circle"
                      : "ios-checkmark-circle"
                  }
                  size={20}
                  color={Colors.danger}
                />
                {screen === ScreenNames.USER_CONTRACTS_SCREEN && (
                  <Text style={styles.heading}>Running Amount: </Text>
                )}
                {screen !== ScreenNames.USER_CONTRACTS_SCREEN && (
                  <Text style={styles.heading}>Bidding Amount: </Text>
                )}
                <Text style={styles.text}>
                  {contract.bidamt ? contract.bidamt : contract.totalprice}
                </Text>
              </View>
              <View style={styles.cntDtls}>
                <Ionicons
                  style={{ marginRight: 5 }}
                  name={
                    Platform.OS === "android"
                      ? "md-checkmark-circle"
                      : "ios-checkmark-circle"
                  }
                  size={20}
                  color={Colors.danger}
                />
                <Text style={styles.heading}>Pickup Date: </Text>
                <Text style={styles.text}>{contract.pickupdate}</Text>
              </View>
              <View style={styles.cntDtls}>
                <Ionicons
                  style={{ marginRight: 5 }}
                  name={
                    Platform.OS === "android"
                      ? "md-checkmark-circle"
                      : "ios-checkmark-circle"
                  }
                  size={20}
                  color={Colors.danger}
                />
                <Text style={styles.heading}>Expiry Date: </Text>
                <Text style={styles.text}>{contract.pickupdate}</Text>
              </View>
              <View style={styles.cntDtls}>
                <Ionicons
                  style={{ marginRight: 5 }}
                  name={
                    Platform.OS === "android"
                      ? "md-checkmark-circle"
                      : "ios-checkmark-circle"
                  }
                  size={20}
                  color={Colors.danger}
                />
                <Text style={styles.heading}>Distance: </Text>
                <Text style={styles.text}>{contract.distance + "Km"}</Text>
              </View>
              <View style={styles.cntDtls}>
                <Ionicons
                  style={{ marginRight: 5 }}
                  name={
                    Platform.OS === "android"
                      ? "md-checkmark-circle"
                      : "ios-checkmark-circle"
                  }
                  size={20}
                  color={Colors.danger}
                />
                <Text style={styles.heading}>Load: </Text>
                {screen === ScreenNames.USER_CONTRACTS_SCREEN && (
                  <Text style={styles.text}>
                    {contract.weight + " " + contract.weightype}
                  </Text>
                )}
                {screen !== ScreenNames.USER_CONTRACTS_SCREEN && (
                  <Text style={styles.text}>
                    {contract.loadWeight + " " + contract.weightype}
                  </Text>
                )}
              </View>
              <View style={styles.cntDtls}>
                <Ionicons
                  style={{ marginRight: 5 }}
                  name={
                    Platform.OS === "android"
                      ? "md-checkmark-circle"
                      : "ios-checkmark-circle"
                  }
                  size={20}
                  color={Colors.danger}
                />
                <Text style={styles.heading}>Load Type: </Text>
                <Text style={styles.text}>{contract.loadtype}</Text>
              </View>
              {contract.vehtyp && (
                <View style={styles.cntDtls}>
                  <Ionicons
                    style={{ marginRight: 5 }}
                    name={
                      Platform.OS === "android"
                        ? "md-checkmark-circle"
                        : "ios-checkmark-circle"
                    }
                    size={20}
                    color={Colors.danger}
                  />
                  <Text style={styles.heading}>Transport Type: </Text>
                  <Text style={styles.text}>{contract.vehtyp}</Text>
                </View>
              )}
              {contract.vehtyp && (
                <View style={styles.cntDtls}>
                  <Ionicons
                    style={{ marginRight: 5 }}
                    name={
                      Platform.OS === "android"
                        ? "md-checkmark-circle"
                        : "ios-checkmark-circle"
                    }
                    size={20}
                    color={Colors.danger}
                  />
                  <Text style={styles.heading}>Driver Name: </Text>
                  <Text style={styles.text}>{contract.drivername}</Text>
                </View>
              )}
              <View style={styles.cntDtls}>
                <Ionicons
                  style={{ marginRight: 5 }}
                  name={
                    Platform.OS === "android"
                      ? "md-checkmark-circle"
                      : "ios-checkmark-circle"
                  }
                  size={20}
                  color={Colors.danger}
                />
                <Text style={styles.heading}>Trip Status: </Text>
                <Text style={{ ...styles.text, color: Colors.success }}>
                  {contract.sts ? contract.sts : "Not Available"}
                </Text>
              </View>
              {contract.trpstartdte && (
                <View style={styles.cntDtls}>
                  <Ionicons
                    style={{ marginRight: 5 }}
                    name={
                      Platform.OS === "android"
                        ? "md-checkmark-circle"
                        : "ios-checkmark-circle"
                    }
                    size={20}
                    color={Colors.danger}
                  />
                  <Text style={styles.heading}>Trip Start Date: </Text>
                  <Text style={{ ...styles.text, color: Colors.success }}>
                    {Moment(contract.trpstartdte).format(
                      "MMM Do YY, h:mm:ss a"
                    )}
                  </Text>
                </View>
              )}
              {contract.trpenddte && (
                <View style={styles.cntDtls}>
                  <Ionicons
                    style={{ marginRight: 5 }}
                    name={
                      Platform.OS === "android"
                        ? "md-checkmark-circle"
                        : "ios-checkmark-circle"
                    }
                    size={20}
                    color={Colors.danger}
                  />
                  <Text style={styles.heading}>Trip End Date: </Text>
                  <Text style={{ ...styles.text, color: Colors.success }}>
                    {Moment(contract.trpenddte).format("MMM Do YY, h:mm:ss a")}
                  </Text>
                </View>
              )}
              {contract.rating !== 0 && user.usrtyp === "U" && (
                <View style={styles.cntDtls}>
                  <Ionicons
                    style={{ marginRight: 5 }}
                    name={
                      Platform.OS === "android"
                        ? "md-checkmark-circle"
                        : "ios-checkmark-circle"
                    }
                    size={20}
                    color={Colors.danger}
                  />
                  <Text style={styles.heading}>Transporter Ratings: </Text>
                  <RatingStars
                    rating={contract.rating}
                    setRating={() => {}}
                    starSize={20}
                    style={{ margin: 0 }}
                  />
                </View>
              )}

              {contract.canclreson !== null && contract.sts === "Trip Cancel" && (
                <View style={styles.cntDtls}>
                  <Ionicons
                    style={{ marginRight: 5 }}
                    name={
                      Platform.OS === "android"
                        ? "md-checkmark-circle"
                        : "ios-checkmark-circle"
                    }
                    size={20}
                    color={Colors.danger}
                  />
                  <Text style={styles.heading}>Cancelled on: </Text>
                  <Text
                    style={{
                      ...styles.text,
                      marginTop: 5,
                      color: Colors.primary,
                    }}
                  >
                    {"                    " + contract.canclreson}
                  </Text>
                </View>
              )}

              {screen !== ScreenNames.USER_CONTRACTS_HISTORY_SCREEN && (
                <View style={styles.actionsContainer}>
                  <Text style={styles.mainHead}>ACTIONS</Text>
                  {user.usrtyp === "U" && (
                    <View style={styles.btnContainer}>
                      {screen === ScreenNames.USER_CONTRACTS_SCREEN && (
                        <RaisedButton
                          title="CONFIRM"
                          onPress={async () => {
                            await getBiddings();
                            setBids(true);
                            setConfirm(true);
                          }}
                          style={{
                            flex: null,
                            height: 40,
                            backgroundColor: Colors.success,
                          }}
                        />
                      )}
                      {screen === ScreenNames.USER_CONTRACTS_SCREEN && (
                        <RaisedButton
                          title="CANCEL"
                          style={{ color: Colors.success }}
                          onPress={() => {
                            setShowCancelModal(true);
                          }}
                          style={{
                            flex: null,
                            height: 40,
                            backgroundColor: Colors.danger,
                          }}
                        />
                      )}
                      {contract.sts === "Trip End" && (
                        <RaisedButton
                          title="LOAD ACCEPT"
                          onPress={() => {
                            setMessage("Please Rate Transporter");
                            setShowRatingModal(true);
                          }}
                          style={{
                            flex: null,
                            height: 40,
                            backgroundColor: Colors.success,
                          }}
                        />
                      )}
                      <RaisedButton
                        title="VIEW BIDS"
                        style={{ color: Colors.success }}
                        onPress={async () => {
                          await getBiddingHistory();
                          setBids(true);
                          setConfirm(false);
                        }}
                        style={{
                          flex: null,
                          height: 40,
                          backgroundColor: Colors.info,
                        }}
                      />
                    </View>
                  )}
                </View>
              )}
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
  contractDetailsContainer: {
    flex: 1,
    marginVertical: 10,
    alignItems: "flex-start",
    paddingHorizontal: 10,
    width: window.width * 0.99,
  },
  card: {
    width: "100%",
  },
  actionsContainer: {
    flex: 1,
    marginVertical: 20,
    flexDirection: "column",
    alignItems: "center",
  },
  mainHead: {
    fontFamily: "open-sans-bold",
    alignSelf: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  heading: { fontFamily: "open-sans-bold" },
  text: { fontFamily: "open-sans" },
  cntDtls: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
    flexWrap: "wrap",
  },
  btnContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
  },
});

export default DetailedContractScreen;
