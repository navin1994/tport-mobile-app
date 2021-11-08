import React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";

import Card from "./Card";
import Styles from "../styles/styles";
import TextButton from "../components/TextButton";
import Colors from "../constants/Colors";
import ScreenNames from "../constants/ScreenNames";

const window = Dimensions.get("window");

const PrefTile = (props) => {
  const { pref, onDelete, onRemove, screen } = props;

  return (
    <View style={styles.prefContainer}>
      <Card style={styles.prefInfoContainer}>
        <View style={styles.prefInfoRow}>
          <Text style={styles.prefInfoHead}>Pref Locations:</Text>
        </View>
        <View style={styles.prefInfoRow}>
          <Text style={styles.prefInfoData}>{pref.locnm}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.prefInfoRow}>
          <Text style={styles.prefInfoHead}>Fleet Type:</Text>
          <Text style={styles.prefInfoData}>{pref.fleetType}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.prefInfoRow}>
          <Text style={styles.prefInfoHead}>Loading Amount:</Text>
          <Text style={styles.prefInfoData}>{pref.loadamt}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.prefInfoRow}>
          <Text style={styles.prefInfoHead}>Un-Loading Amount:</Text>
          <Text style={styles.prefInfoData}>{pref.unloadamt}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.prefInfoRow}>
          <Text style={styles.prefInfoHead}>Km/Ton Amount:</Text>
          <Text style={styles.prefInfoData}>{pref.rateamt}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.prefInfoRow}>
          <Text style={styles.prefInfoHead}>Extra Amount:</Text>
          <Text style={styles.prefInfoData}>{pref.extramt}</Text>
        </View>
        <View style={styles.separator}></View>
        {ScreenNames.TRANS_PREF_SCREEN === screen && (
          <View style={{ ...Styles.actionsContainer, marginVertical: 5 }}>
            <View style={Styles.btnContainer}>
              <TextButton
                style={styles.textBtn}
                titleStyle={{ ...styles.titleStyle, color: Colors.danger }}
                title="DELETE"
                onPress={onDelete.bind(this, pref.preffid)}
              />
            </View>
          </View>
        )}
        {ScreenNames.TRANS_ADD_PREF_SCREEN === screen && (
          <View style={{ ...Styles.actionsContainer, marginVertical: 5 }}>
            <View style={Styles.btnContainer}>
              <TextButton
                style={styles.textBtn}
                titleStyle={{ ...styles.titleStyle, color: Colors.danger }}
                title="REMOVE"
                onPress={onRemove}
              />
            </View>
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  prefContainer: { marginVertical: 10, alignItems: "center" },
  prefInfoContainer: {
    width: window.width * 0.95,
  },
  prefInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prefInfoHead: {
    fontFamily: "open-sans",
    fontSize: 14,
    color: "grey",
  },
  prefInfoData: { fontFamily: "open-sans", fontSize: 13, marginRight: 20 },
  separator: {
    height: 1,
    backgroundColor: "grey",
    marginVertical: 3,
  },

  textBtn: {
    margin: null,
  },
  titleStyle: { margin: null, color: Colors.danger },
});

export default PrefTile;
