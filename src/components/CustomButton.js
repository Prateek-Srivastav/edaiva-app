import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

import Colors from "../constants/Colors";

function CustomButton(props) {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.7}
      style={{
        ...styles.button,
        ...props.style,
        backgroundColor: props.disabled ? "#ccc" : Colors.primary,
      }}
    >
      {props.icon}
      <Text style={{ ...styles.titleStyle, ...props.titleStyle }}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
    borderRadius: 4,
    alignSelf: "center",

    flexDirection: "row",
  },
  titleStyle: {
    fontFamily: "OpenSans-Medium",
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
});

export default CustomButton;
