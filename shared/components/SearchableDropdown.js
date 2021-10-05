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
} from "react-native";

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

const SearchableDropdown = (props) => {
  const {
    itemList,
    onInputChange,
    displayKey,
    id,
    isSubmitted,
    reset,
    errorText,
  } = props;
  const [inputState, dispatch] = useReducer(inputReducer, {
    isValid: props.initiallyValid,
    touched: false,
  });
  const [showList, setShowList] = useState(false);
  const [items, setItems] = useState(itemList);
  const [selectedItem, setSelection] = useState({
    text: "",
    value: {},
  });

  let TouchableCmp = TouchableOpacity;

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  useEffect(() => {
    setSelection({
      text: "",
      value: {},
    });
  }, [reset]);

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const textChangeHandler = (text) => {
    setSelection({ text: text, value: {} });
    setShowList(true);
    const filteredItems =
      text.length < 1
        ? []
        : itemList
            .filter((item) =>
              item[displayKey].toLowerCase().startsWith(text.toLowerCase())
            )
            .splice(0, 10);
    setItems(filteredItems);
  };

  const valueExists = () => {
    return itemList.some(function (el) {
      return el[displayKey] === selectedItem.text;
    });
  };

  const blurHandler = () => {
    setShowList(false);
    dispatch({ type: INPUT_CHANGE, isValid: valueExists() });
    onInputChange(id, selectedItem.value, valueExists());
  };

  const onSelectHandler = (item) => {
    setShowList(false);
    setSelection({ text: item[displayKey], value: item });
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
      {showList && items.length > 0 && (
        <View style={{ ...styles.listContainer, ...props.listContainerStyle }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ flexGrow: 0 }}
            nestedScrollEnabled
            data={items}
            keyExtractor={(item, index) => index}
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  inputContainer: {
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
    maxHeight: 200,
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
  itemView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
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

export default SearchableDropdown;
