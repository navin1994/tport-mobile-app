import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Modal,
  StyleSheet,
  Animated,
  FlatList,
  Dimensions,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  Alert,
  LogBox,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as biddingActions from "../../store/action/biding";

import Colors from "../constants/Colors";
import BidTile from "../UI/BidTile";

const window = Dimensions.get("window");

const BidsModal = (props) => {
  const { visible, closeModal, isConfirm, setIsLoading } = props;
  const [error, setError] = useState();
  const [showModal, setShowModal] = useState(visible);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const biddings = useSelector((state) => state.biding.biddings);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    setShowModal(visible);
  }, [visible]);

  const closeModalWindow = () => {
    setTimeout(() => closeModal(), 200);
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const onConfirmBidding = async (contract) => {
    setError(null);
    try {
      setIsLoading({ state: true, msg: "Processing confirmation..." });
      const result = await dispatch(biddingActions.confirmBiding(contract));
      if (result.Result === "OK") {
        closeModalWindow();
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
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackground}>
        <Animated.View
          style={[styles.container, { transform: [{ scale: scaleValue }] }]}
        >
          <View style={styles.closeBtnCont}>
            <TouchableCmp onPress={closeModalWindow}>
              <Ionicons name="close" size={25} color={Colors.danger} />
            </TouchableCmp>
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.heading}>BIDDING LIST</Text>
            <View style={styles.bidListContainer}>
              {biddings.length === 0 && (
                <Text style={styles.msg}>Biddings not available.</Text>
              )}
              {biddings.length !== 0 && (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  nestedScrollEnabled
                  data={biddings}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <BidTile
                      onPress={() => {}}
                      bidingAmt={item.bidamt}
                      contractor={item.contactnme}
                      email={item.email}
                      contactNo={item.contactno}
                      isConfirm={isConfirm}
                      onConfirm={() => {
                        onConfirmBidding(item);
                      }}
                    />
                  )}
                />
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: window.height * 0.7,
    width: "90%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 20,
  },
  closeBtnCont: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  contentBox: {
    flex: 1,
    alignItems: "center",
  },
  heading: {
    alignSelf: "center",
    fontFamily: "open-sans-bold",
    fontSize: 16,
    color: "black",
  },
  bidListContainer: {
    height: "97%",
    width: "100%",
  },
  msg: {
    margin: 20,
    fontFamily: "open-sans",
    color: "red",
    alignSelf: "center",
  },
});

export default BidsModal;
