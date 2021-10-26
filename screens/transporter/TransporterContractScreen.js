import React, { useLayoutEffect } from "react";
import { StyleSheet, Image } from "react-native";

import ContractsWithPagination from "../../shared/UI/ContractsWithPagination";
import DrawerHeaderLeft from "../../shared/components/DrawerHeaderLeft";
import ScreenNames from "../../shared/constants/ScreenNames";

const TransporterContractsScreen = (props) => {
  const { navigation } = props;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "MY TPORT",
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
    <ContractsWithPagination screenName={ScreenNames.TRANS_CONTRACTS_SCREEN} />
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: "center",
    height: 35,
    width: 40,
  },
});

export default TransporterContractsScreen;
