import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, StatusBar } from "react-native";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

import TportNavigator from "./navigation/TportNavigator";

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
        onError={console.warn}
      />
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar hidden={false} />
      <View style={styles.body}>
        <TportNavigator />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  body: { flex: 1 },
});
