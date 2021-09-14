import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";

import Card from "./Card";
import TextButton from "../components/TextButton";

const window = Dimensions.get("window");

const VehicleDetailsTile = (props) => {
  return (
    <View style={styles.vehContainer}>
      <Card style={styles.vehInfoContainer}>
        <View style={styles.vehInfoRow}>
          <Text style={styles.vehInfoHead}>Vehicle No :- </Text>
          <Text style={styles.vehInfoData}>{props.vehicleNo}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.vehInfoRow}>
          <Text style={styles.vehInfoHead}>Vehicle Type :- </Text>
          <Text style={styles.vehInfoData}>{props.vehType}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.vehInfoRow}>
          <Text style={styles.vehInfoHead}>Registration Date :- </Text>
          <Text style={styles.vehInfoData}>{props.regDate}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.vehInfoRow}>
          <Text style={styles.vehInfoHead}>Chesis No :- </Text>
          <Text style={styles.vehInfoData}>{props.chesisNo}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.vehInfoRow}>
          <Text style={styles.vehInfoHead}>Insurance No :- </Text>
          <Text style={styles.vehInfoData}>{props.insuranceNo}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.vehInfoRow}>
          <Text style={styles.vehInfoHead}>Insurance Expiry Date :- </Text>
          <Text style={styles.vehInfoData}>{props.insuranceExpDate}</Text>
        </View>
        <View style={styles.separator}></View>
        <TextButton
          title="Remove"
          onPress={() => {}}
          style={styles.textBtn}
          titleStyle={styles.titleStyle}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  vehContainer: { marginVertical: 10 },
  vehInfoContainer: {
    width: window.width * 0.9,
  },
  vehInfoRow: {
    flex: 1,
    flexDirection: "row",
  },
  vehInfoHead: {
    fontFamily: "open-sans-bold",
    fontSize: 14,
  },
  vehInfoData: { fontFamily: "open-sans", fontSize: 13 },
  separator: {
    height: 1,
    backgroundColor: "red",
    marginVertical: 3,
  },
  textBtn: {
    margin: null,
  },
  titleStyle: { margin: null },
});

export default VehicleDetailsTile;
