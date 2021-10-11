import React from "react";
import { View, StyleSheet, Text } from "react-native";

import Card from "./Card";
import TextButton from "../components/TextButton";
import Colors from "../constants/Colors";

const BidTile = (props) => {
  const { isConfirm, onConfirm } = props;
  return (
    <View style={styles.bidContainer}>
      <Card style={styles.vehInfoContainer}>
        <View style={styles.bidInfoContainer}>
          <Text style={styles.bidInfoHead}>Bidding Amount :- </Text>
          <Text style={styles.bidInfoData}>{props.bidingAmt}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.bidInfoContainer}>
          <Text style={styles.bidInfoHead}>Contractor Name :- </Text>
          <Text style={styles.bidInfoData}>{props.contractor}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.bidInfoContainer}>
          <Text style={styles.bidInfoHead}>Email :- </Text>
          <Text style={styles.bidInfoData}>{props.email}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.bidInfoContainer}>
          <Text style={styles.bidInfoHead}>Contact No :- </Text>
          <Text style={styles.bidInfoData}>{props.contactNo}</Text>
        </View>
        <View style={styles.separator}></View>
        {isConfirm && (
          <TextButton
            title="CONFIRM BIDDING"
            onPress={onConfirm}
            style={styles.textBtn}
            titleStyle={{ ...styles.titleStyle, color: Colors.success }}
          />
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  bidContainer: { marginVertical: 10 },
  vehInfoContainer: {
    width: "99%",
    alignSelf: "center",
  },
  bidInfoContainer: {
    flex: 1,
    flexDirection: "row",
  },
  bidInfoHead: {
    fontFamily: "open-sans-bold",
    fontSize: 14,
  },
  bidInfoData: { fontFamily: "open-sans", fontSize: 13 },
  separator: {
    height: 1,
    backgroundColor: "grey",
    marginVertical: 3,
  },
  textBtn: {
    margin: null,
  },
  titleStyle: { flex: null, margin: null, marginTop: 5 },
});
export default BidTile;
