import React, { useEffect, useState, useReducer } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  LogBox,
  Keyboard,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import Colors from "../constants/Colors";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        isValid: action.isValid,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

const MultipleSelectSearchPicker = (props) => {
  const {
    itemList,
    onInputChange,
    displayKey,
    id,
    isSubmitted,
    reset,
    errorText,
    required,
    uniqueKey,
  } = props;
  const [inputState, dispatch] = useReducer(inputReducer, {
    isValid: props.initiallyValid,
    touched: false,
  });
  const [showList, setShowList] = useState(false);
  const [items, setItems] = useState(itemList);
  const [selectedItem, setSelection] = useState({
    text: "",
    value: [],
  });

  let TouchableCmp = TouchableOpacity;

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  useEffect(() => {
    setSelection({
      text: "",
      value: [],
    });
  }, [reset]);

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const textChangeHandler = (text) => {
    setSelection({ text: text, value: [...selectedItem.value] });
    setShowList(true);
    const filteredItems =
      text.length < 0
        ? []
        : itemList
            .filter((item) =>
              item[displayKey].toLowerCase().startsWith(text.toLowerCase())
            )
            .splice(0, 50);
    setItems(filteredItems);
  };

  const valueExists = (list) => {
    return list.length > 0;
  };

  const blurHandler = () => {
    dispatch({
      type: INPUT_CHANGE,
      isValid: !required ? true : valueExists(selectedItem.value),
    });
    onInputChange(
      id,
      selectedItem.value,
      !required ? true : valueExists(selectedItem.value)
    );
    setShowList(false);
  };

  const onSelectHandler = (item) => {
    let tempArr = [...selectedItem.value, item];
    if (
      selectedItem.value.filter((x) => x[uniqueKey] === item[uniqueKey])
        .length > 0
    ) {
      tempArr = selectedItem.value.filter(
        (x) => x[uniqueKey] !== item[uniqueKey]
      );
    }
    setSelection({
      text: "",
      value: tempArr,
    });
    Keyboard.dismiss();
    setShowList(false);
  };

  const selectedElements = () => {
    return selectedItem.value.map((ele) => {
      return (
        <View key={ele[uniqueKey]} style={styles.selectionTextContainer}>
          <Text style={styles.item}>{ele[displayKey] + " "}</Text>
          <TouchableCmp
            onPress={() => {
              const tempArr = selectedItem.value.filter(
                (x) => x[uniqueKey] !== ele[uniqueKey]
              );
              setSelection({
                text: "",
                value: tempArr,
              });
              dispatch({
                type: INPUT_CHANGE,
                isValid: !required ? true : valueExists(tempArr),
              });
              onInputChange(
                id,
                tempArr,
                !required ? true : valueExists(tempArr)
              );
            }}
            useForeground
          >
            <AntDesign name="closecircleo" size={15} color="black" />
          </TouchableCmp>
        </View>
      );
    });
  };

  return (
    <View style={{ ...styles.mainContainer, ...props.style }}>
      <View style={{ ...styles.inputContainer, ...props.inputContainerStyle }}>
        <View
          style={{ ...styles.labelContainer, ...props.labelContainerStyle }}
        >
          <Text style={{ ...styles.label, ...props.labelStyle }}>
            {props.label}
          </Text>
        </View>
        {props.leadingIcon}
        <TextInput
          {...props}
          onFocus={() => {
            setShowList(true);
            setSelection({
              text: "",
              value: [...selectedItem.value],
            });
            setItems(itemList);
          }}
          value={selectedItem.text}
          style={{ ...styles.input, ...props.fontSize }}
          onChangeText={textChangeHandler}
          onBlur={blurHandler}
        />
        {props.trailingIcon}
      </View>
      {!inputState.isValid && isSubmitted && errorText && (
        <Text style={styles.errorText}>{errorText}</Text>
      )}

      {selectedItem.value.length > 0 && (
        <View
          style={{
            ...styles.selectionContainer,
            ...props.selectionContainerStyle,
          }}
        >
          {selectedElements()}
        </View>
      )}

      {showList && (
        <View style={{ ...styles.listContainer, ...props.listContainerStyle }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            style={{ flexGrow: 0, maxHeight: 200, width: "100%" }}
            data={items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(itemData) => (
              <TouchableCmp
                onPress={() => {
                  onSelectHandler(itemData.item);
                }}
                useForeground
              >
                <View
                  style={{ ...styles.itemView, ...props.itemContainerStyle }}
                >
                  <Text style={{ ...styles.item, ...props.itemStyle }}>
                    {itemData.item[displayKey]}
                  </Text>
                  {selectedItem.value.filter(
                    (ele) => ele[uniqueKey] === itemData.item[uniqueKey]
                  ).length > 0 && (
                    <AntDesign
                      name="checkcircleo"
                      size={20}
                      color={Colors.success}
                    />
                  )}
                </View>
              </TouchableCmp>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 25,
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
    height: 40,
    paddingLeft: 5,
    paddingRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 6,
  },
  selectionTextContainer: {
    margin: 2,
    backgroundColor: "#ADD8E6",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 2,
    flexWrap: "wrap",
  },
  label: {
    color: "black",
    fontSize: 14,
    fontFamily: "open-sans",
  },
  labelContainer: {
    position: "absolute",
    left: 20,
    top: -12,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  listContainer: {
    width: "100%",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#fff",
    flexWrap: "wrap",
    maxWidth: "100%",
  },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    flexGrow: 0,
    width: "100%",
    padding: 5,
    backgroundColor: "#FFF",
    borderWidth: 1,
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 10,
    borderRadius: 5,
  },
  itemView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  item: {
    fontFamily: "open-sans",
    alignSelf: "flex-start",
    color: "black",
    fontSize: 15,
  },
  errorText: { fontFamily: "open-sans", color: Colors.danger, fontSize: 13 },
});

export default MultipleSelectSearchPicker;
