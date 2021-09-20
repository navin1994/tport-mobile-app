import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, StatusBar } from "react-native";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import ReduxThunk from "redux-thunk";

import TportNavigator from "./navigation/TportNavigator";
import authReducer from "./store/reducer/auth";
import fleetReducer from "./store/reducer/fleet";

const rootReducer = combineReducers({
  auth: authReducer,
  fleets: fleetReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

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
    <Provider store={store}>
      <SafeAreaView style={styles.screen}>
        <StatusBar hidden={false} />
        <View style={styles.body}>
          <TportNavigator />
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  body: { flex: 1 },
});
