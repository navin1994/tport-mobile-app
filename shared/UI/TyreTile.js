import React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";

import Card from "./Card";
import Styles from "../styles/styles";
import TextButton from "../components/TextButton";
import Colors from "../constants/Colors";
import ScreenNames from "../constants/ScreenNames";

const window = Dimensions.get("window");

const TyreTile = (props) => {
  const { tyre, onDelete, onEdit, onRemove, screen } = props;

  return (
    <View style={styles.servContainer}>
      <Card style={styles.servInfoContainer}>
        {screen === ScreenNames.TRANS_TYRE_DTL_SCREEN && (
          <View style={styles.servInfoRow}>
            <Text style={styles.servInfoHead}>ID:</Text>
            <Text style={styles.servInfoData}>{tyre.infoid}</Text>
          </View>
        )}
        <View style={styles.separator}></View>
        <View style={styles.servInfoRow}>
          <Text style={styles.servInfoHead}>Type:</Text>
          <Text style={styles.servInfoData}>{tyre.type}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.servInfoRow}>
          <Text style={styles.servInfoHead}>Tyre Make:</Text>
          <Text style={styles.servInfoData}>{tyre.tyre_make}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.servInfoRow}>
          <Text style={styles.servInfoHead}>Tyre No:</Text>
          <Text style={styles.servInfoData}>{tyre.tyre_no}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.servInfoRow}>
          <Text style={styles.servInfoHead}>Change Date:</Text>
          <Text style={styles.servInfoData}>{tyre.changed_date}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.servInfoRow}>
          <Text style={styles.servInfoHead}>KM Reading:</Text>
          <Text style={styles.servInfoData}>{tyre.km_reading}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.servInfoRow}>
          <Text style={styles.servInfoHead}>Remarks:</Text>
        </View>
        <View style={styles.servInfoRow}>
          <Text style={styles.servInfoData}>{tyre.remark}</Text>
        </View>
        <View style={styles.separator}></View>
        {ScreenNames.TRANS_TYRE_DTL_SCREEN === screen && (
          <View style={{ ...Styles.actionsContainer, marginVertical: 5 }}>
            <View style={Styles.btnContainer}>
              <TextButton
                style={styles.textBtn}
                titleStyle={{ ...styles.titleStyle, color: Colors.danger }}
                title="DELETE"
                onPress={onDelete.bind(this, tyre.infoid)}
              />
              <TextButton
                style={styles.textBtn}
                titleStyle={{ ...styles.titleStyle, color: Colors.info }}
                title="EDIT"
                onPress={onEdit}
              />
            </View>
          </View>
        )}
        {ScreenNames.TRANS_ADD_TYRE_SCREEN === screen && (
          <View style={{ ...Styles.actionsContainer, marginVertical: 5 }}>
            <View style={Styles.btnContainer}>
              <TextButton
                style={styles.textBtn}
                titleStyle={{ ...styles.titleStyle, color: Colors.danger }}
                title="REMOVE"
                onPress={onRemove.bind(this, tyre.id)}
              />
            </View>
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  servContainer: { marginVertical: 10, alignItems: "center" },
  servInfoContainer: {
    width: window.width * 0.95,
  },
  servInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  servInfoHead: {
    fontFamily: "open-sans",
    fontSize: 14,
    color: "grey",
  },
  servInfoData: { fontFamily: "open-sans", fontSize: 13, marginRight: 20 },
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

export default TyreTile;
