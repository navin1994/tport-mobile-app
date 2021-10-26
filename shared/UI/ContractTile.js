import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Moment from "moment";

import Colors from "../constants/Colors";
import ScreenNames from "../constants/ScreenNames";

const ContractTile = (props) => {
  const { item, index, screen } = props;
  const navigation = useNavigation();
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: (index + 1) % 2 == 0 ? Colors.info : Colors.warning,
      }}
    >
      <TouchableCmp
        onPress={() =>
          navigation.navigate("contractDtls", {
            contract: item,
            screen,
          })
        }
        useForeground
      >
        <View style={styles.innerContainer}>
          <View style={styles.rnAmtRow}>
            <View style={styles.rnAmtContainer}>
              {(screen === ScreenNames.TRANS_CONTRACTS_SCREEN ||
                screen === ScreenNames.USER_CONTRACTS_SCREEN) && (
                <Text style={styles.runningAmtHead}>Running Amount:</Text>
              )}
              {screen !== ScreenNames.TRANS_CONTRACTS_SCREEN &&
                screen !== ScreenNames.USER_CONTRACTS_SCREEN && (
                  <Text style={styles.runningAmtHead}>Bidding Amount:</Text>
                )}
              <Text style={styles.runningAmt}>
                {item.bidamt ? item.bidamt : item.totalprice}
              </Text>
            </View>
          </View>
          {screen === ScreenNames.TRANS_CONTRACTS_SCREEN && item.amount !== 0 && (
            <View style={{ flexDirection: "row", width: "100%" }}>
              <Text style={styles.lastBidding}>
                {"Your last bidding amount is " +
                  item.amount +
                  " on " +
                  Moment(item?.updton).format("MMM Do YYYY, h:mm:ss a")}
              </Text>
            </View>
          )}
          <Text style={styles.headTxt}>
            From: <Text style={styles.valueTxt}>{item.trnsfrm}</Text>
          </Text>
          <Text style={styles.headTxt}>
            To:{"       "}
            <Text style={styles.valueTxt}>{item.trnsto}</Text>
          </Text>
          <View style={styles.distLoadContainer}>
            <Text style={styles.headTxt}>
              Distance:{" "}
              <Text style={styles.valueTxt}>{item.distance + "Km"}</Text>
            </Text>
            <Text style={styles.headTxt}>
              Load:{" "}
              {(screen === ScreenNames.USER_CONTRACTS_SCREEN ||
                screen === ScreenNames.TRANS_CONTRACTS_SCREEN) && (
                <Text style={styles.valueTxt}>
                  {item.weight + " " + item.weightype}
                </Text>
              )}
              {screen !== ScreenNames.USER_CONTRACTS_SCREEN &&
                screen !== ScreenNames.TRANS_CONTRACTS_SCREEN && (
                  <Text style={styles.valueTxt}>
                    {item.loadWeight + " " + item.weightype}
                  </Text>
                )}
            </Text>
          </View>
          <View style={styles.datesContainer}>
            <View style={styles.dates}>
              <Text style={styles.headTxt}>Pickup Date</Text>
              <Text style={styles.valueTxt}>{item.pickupdate}</Text>
            </View>
            <View style={styles.dates}>
              <Text style={styles.headTxt}>Expiry Date</Text>
              <Text style={styles.valueTxt}>{item.pickupdate}</Text>
            </View>
          </View>
        </View>
      </TouchableCmp>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    overflow: "hidden",
    marginTop: 10,
    borderRadius: 22,
    paddingRight: 10,
    paddingBottom: 5,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 27,
    elevation: 5,
  },
  innerContainer: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
    overflow: "hidden",
    borderRadius: 22,
    paddingLeft: 10,
    paddingBottom: 5,
  },
  distLoadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 10,
  },
  datesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingRight: 10,
  },
  dates: {
    flexDirection: "column",
    alignItems: "center",
  },
  rnAmtRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    height: 25,
  },
  rnAmtContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "black",
    borderBottomLeftRadius: 22,
    paddingHorizontal: 7,
  },
  runningAmt: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
    color: Colors.danger,
  },
  runningAmtHead: {
    fontFamily: "open-sans",
    fontSize: 15,
    color: "#fff",
    marginHorizontal: 10,
  },
  headTxt: {
    fontFamily: "open-sans-bold",
    fontSize: 15,
    color: "grey",
  },
  valueTxt: {
    fontFamily: "open-sans-bold",
    fontSize: 14,
    color: "black",
  },
  lastBidding: {
    fontFamily: "open-sans",
    fontSize: 12,
    color: Colors.success,
  },
});

export default ContractTile;
