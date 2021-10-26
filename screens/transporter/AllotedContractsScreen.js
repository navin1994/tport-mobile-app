import React, { useLayoutEffect } from "react";
import { StyleSheet, Image } from "react-native";

import DrawerHeaderLeft from "../../shared/components/DrawerHeaderLeft";
import ScreenNames from "../../shared/constants/ScreenNames";
import AllotedContracts from "../../shared/UI/AllotedContracts";

const AllotedContractsScreen = (props) => {
  const { navigation } = props;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Alloted TPorts",
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
    <AllotedContracts screenName={ScreenNames.TRANS_ALLOTED_CONTRACTS_SCREEN} />
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: "center",
    height: 35,
    width: 40,
  },
});

export default AllotedContractsScreen;
