import React, {
  useLayoutEffect,
  useState,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  Alert,
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import ProgressIndicator from "../../shared/UI/ProgressIndicator";
import BackgroundImage from "../../shared/UI/BackgroundImage";
import ImageDocPicker from "../../shared/components/ImageDocPicker";
import TextField from "../../shared/components/TextField";
import RaisedButton from "../../shared/components/RaisedButton";

const TransporterProfileScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Text>The Transporter Profile Screen!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TransporterProfileScreen;
