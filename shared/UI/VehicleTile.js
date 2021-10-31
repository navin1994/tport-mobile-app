import React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Card from "./Card";
import Styles from "../styles/styles";
import TextButton from "../components/TextButton";

const window = Dimensions.get("window");

const VehicleTile = (props) => {
  const navigation = useNavigation();
  const { fleet } = props;
  return (
    <View style={styles.vehContainer}>
      <Card style={styles.vehInfoContainer}>
        <Text style={styles.fleetNameContainer}>{fleet.vtypnm}</Text>
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
        <View style={styles.vehInfoRow}>
          <Text style={styles.vehInfoHead}>Insurance No:</Text>
          <Text style={styles.vehInfoData}>{fleet.vehinsuno}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.vehInfoRow}>
          <Text style={styles.vehInfoHead}>Insurance Expiry Date:</Text>
          <Text style={styles.vehInfoData}>{fleet.vehinsexpdte}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.vehInfoRow}>
          <Text style={styles.vehInfoHead}>Status:</Text>
          <Text style={styles.vehInfoData}>
            {fleet.sts !== null ? "Active" : "Non-Active"}
          </Text>
        </View>
        <View style={styles.separator}></View>
        <View style={{ ...Styles.actionsContainer, marginVertical: 5 }}>
          <View style={Styles.btnContainer}>
            <TextButton
              style={styles.textBtn}
              titleStyle={styles.titleStyle}
              title="Fleet Details"
              onPress={() => {
                navigation.navigate("fleetDtls", fleet.vehid);
              }}
            />
            <TextButton
              style={styles.textBtn}
              titleStyle={styles.titleStyle}
              title="Service Details"
              onPress={() => {
                navigation.navigate("TransporterNavigator", {
                  screen: "transFleetsRoute",
                  params: {
                    screen: "fleetSrvcs",
                    params: fleet.vehid,
                  },
                });
              }}
            />
            <TextButton
              style={styles.textBtn}
              titleStyle={styles.titleStyle}
              title="Tyre Details"
              onPress={() => {
                navigation.navigate("TransporterNavigator", {
                  screen: "transFleetsRoute",
                  params: {
                    screen: "tyreDtls",
                    params: fleet.vehid,
                  },
                });
              }}
            />
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  vehContainer: { marginVertical: 10, alignItems: "center" },
  vehInfoContainer: {
    width: window.width * 0.95,
  },
  vehInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    margin: null,
  },
  titleStyle: { margin: null },
  fleetNameContainer: {
    alignSelf: "center",
    color: "red",
    fontFamily: "open-sans-bold",
    fontSize: 15,
    marginBottom: 10,
  },
});

export default VehicleTile;
