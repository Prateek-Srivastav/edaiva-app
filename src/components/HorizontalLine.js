import React from "react";
import { View, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

function HorizontalLine({ width, marginTop, marginVertical }) {
  return <View style={{ ...styles.line, width, marginTop, marginVertical }} />;
}

const styles = StyleSheet.create({
  line: {
    width: "100%",
    height: 1.6,
    borderRadius: 10,
    backgroundColor: Colors.grey,
    elevation: 1,
    opacity: 0.1,
  },
});

export default HorizontalLine;
