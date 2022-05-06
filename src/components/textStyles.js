import React from "react";
import { StyleSheet, Text } from "react-native";

import Colors from "../constants/Colors";

export const SmallText = (props) => (
  <Text style={{ ...styles.smallText, ...props.style }}>{props.children}</Text>
);

export const NormalText = ({ children, color }) => (
  <Text style={{ ...styles.normalText, color: color ? color : Colors.grey }}>
    {children}
  </Text>
);

export const MediumText = (props) => (
  <Text style={styles.mediumText}>{props.children}</Text>
);

const styles = StyleSheet.create({
  smallText: {
    fontFamily: "OpenSans-Regular",
    fontSize: 15,
    color: Colors.grey,
    marginStart: 7,
    marginTop: 5,
  },
  mediumText: {
    fontFamily: "OpenSans-Medium",
    fontSize: 15,
    color: Colors.grey,
    marginStart: 7,
    marginTop: 5,
  },
  normalText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 16,
    marginStart: 7,
  },
});
