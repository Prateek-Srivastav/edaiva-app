import React from "react";
import { View, StyleSheet, Text } from "react-native";

import Colors from "../constants/Colors";

function AppText(props) {
  return (
    <Text {...props} style={{ ...styles.defaultText, ...props.style }}>
      {props.children}
    </Text>
  );
}

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    color: Colors.grey,
  },
});

export default AppText;
