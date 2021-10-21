import React, { useLayoutEffect } from "react";
import { StyleSheet, Image } from "react-native";

import ContractHistory from "../../shared/UI/ContractHistory";
import DrawerHeaderLeft from "../../shared/components/DrawerHeaderLeft";
import ScreenNames from "../../shared/constants/ScreenNames";

const ContractHistoryScreen = (props) => {
  const { navigation } = props;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "TPORT HISTORY",
      headerLeft: () => (
        <DrawerHeaderLeft
          titleIcon={
            <Image
              source={require("../../assets/images/dashboard-logo.png")}
              style={styles.image}
            />
          }
        />
      ),
    });
  }, [navigation]);

  return (
    <ContractHistory screenName={ScreenNames.USER_CONTRACTS_HISTORY_SCREEN} />
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: "center",
    height: 35,
    width: 40,
  },
});

export default ContractHistoryScreen;
