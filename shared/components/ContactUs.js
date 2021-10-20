import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback,
  Image,
  Platform,
  Linking,
} from "react-native";

const ContactUs = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current;

  const dialCall = () => {
    let phoneNumber = "";

    if (Platform.OS === "android") {
      phoneNumber = "tel:919373797978";
    } else {
      phoneNumber = "telprompt:919373797978";
    }

    Linking.openURL(phoneNumber);
  };

  const openWhatsApp = () => {
    let url = "whatsapp://send?phone=919373797978";
    Linking.openURL(url).catch(() => {
      alert("Make sure WhatsApp installed on your device");
    });
  };

  const openMail = () => {
    Linking.openURL("mailto:info@sparshtech.com").catch(() => {
      alert("Error while opening e-mail");
    });
  };

  const getOutputRange = (style) => {
    switch (style) {
      case "mailStyle":
        return [0, -140];

      case "whatsAppStyle":
        return [0, -80];

      case "call":
        return [0, -200];
    }
  };

  const getStyle = (style) => {
    const newStyle = {
      transform: [
        { scale: scaleValue },
        {
          translateY: scaleValue.interpolate({
            inputRange: [0, 1],
            outputRange: getOutputRange(style),
          }),
        },
      ],
    };
    return newStyle;
  };

  const rotation = {
    transform: [
      {
        rotate: scaleValue.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "45deg"],
        }),
      },
    ],
  };

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(scaleValue, {
      toValue,
      friction: 5,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };

  return (
    <View style={[styles.container, props.style]}>
      <TouchableWithoutFeedback onPress={dialCall}>
        <Animated.View
          style={[
            styles.button,
            styles.secondary,
            styles.callBgColor,
            getStyle("call"),
          ]}
        >
          <Image
            source={require("../../assets/images/call.png")}
            style={[styles.image, props.imageStyle]}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={openMail}>
        <Animated.View
          style={[
            styles.button,
            styles.secondary,
            styles.mailBgColor,
            getStyle("mailStyle"),
          ]}
        >
          <Image
            source={require("../../assets/images/apple-mail.png")}
            style={[styles.image, props.imageStyle]}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={openWhatsApp}>
        <Animated.View
          style={[
            styles.button,
            styles.secondary,
            styles.wpBgColor,
            getStyle("whatsAppStyle"),
          ]}
        >
          <Image
            source={require("../../assets/images/whatsapp.png")}
            style={[styles.image, props.imageStyle]}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={toggleMenu}>
        <Animated.View style={[styles.button, styles.menu, rotation]}>
          <Image
            source={require("../../assets/images/chat.png")}
            style={[styles.image, props.imageStyle]}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  image: {
    resizeMode: "cover",
    height: 40,
    width: 40,
  },
  button: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowOffset: { height: 10 },
  },
  menu: { backgroundColor: "#38ECC5" },
  secondary: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
  },
  wpBgColor: {
    backgroundColor: "#39B939",
  },
  mailBgColor: {
    backgroundColor: "#5398E7",
  },
  callBgColor: {
    backgroundColor: "#1565C0",
  },
});
export default ContactUs;
