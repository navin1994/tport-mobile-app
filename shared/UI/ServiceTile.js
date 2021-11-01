import React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Card from "./Card";
import Styles from "../styles/styles";
import TextButton from "../components/TextButton";
import Colors from "../constants/Colors";

const window = Dimensions.get("window");

const ServiceTile = (props) => {
  const navigation = useNavigation();
  const { service, onDelete } = props;
  return (
    <View style={styles.servContainer}>
      <Card style={styles.servInfoContainer}>
        <View style={styles.servInfoRow}>
          <Text style={styles.servInfoHead}>Service Date:</Text>
          <Text style={styles.servInfoData}>{service.changed_date}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.servInfoRow}>
          <Text style={styles.servInfoHead}>KM Run:</Text>
          <Text style={styles.servInfoData}>{service.km_reading}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.servInfoRow}>
          <Text style={styles.servInfoHead}>Remarks:</Text>
        </View>
        <View style={styles.servInfoRow}>
          <Text style={styles.servInfoData}>{service.remark}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={{ ...Styles.actionsContainer, marginVertical: 5 }}>
          <View style={Styles.btnContainer}>
            <TextButton
              style={styles.textBtn}
              titleStyle={styles.titleStyle}
              title="DELETE"
              onPress={onDelete.bind(this, service.infoid)}
            />
          </View>
        </View>
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

export default ServiceTile;
