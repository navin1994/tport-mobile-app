import React, { useLayoutEffect } from "react";
import { View, StyleSheet, ScrollView, Image, Dimensions } from "react-native";
import AnimatedMultistep from "react-native-animated-multistep";

import HeaderLeft from "../../shared/components/HeaderLeft";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import TransporterRegistrationForm from "../../shared/components/TransporterRegistrationForm";
import FleetRegistrationForm from "../../shared/components/FleetRegistrationForm";
import AddedFleetsList from "../../shared/components/AddedFleetsList";

const window = Dimensions.get("window");

const allSteps = [
  { name: "step 1", component: TransporterRegistrationForm },
  { name: "step 2", component: FleetRegistrationForm },
  { name: "step 3", component: AddedFleetsList },
];

const TransporterRegistrationScreen = (props) => {
  const { navigation } = props;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeft
          titleIcon={
            <Image
              source={require("../../assets/images/tempo.png")}
              style={styles.image}
            />
          }
        />
      ),
    });
  }, [navigation]);

  return (
    <BackgroundImage>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.screen}>
          <View style={styles.container}>
            <View style={{ flex: 1 }}>
              <AnimatedMultistep
                steps={allSteps}
                comeInOnNext="bounceInUp"
                OutOnNext="bounceOutDown"
                comeInOnBack="bounceInDown"
                OutOnBack="bounceOutUp"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: window.width,
  },
  image: {
    resizeMode: "center",
    height: 35,
    width: 40,
  },
});

export default TransporterRegistrationScreen;
