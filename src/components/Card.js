import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import AppText from "./AppText";

function Card(props) {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.8}
      disabled={props.touchable ? false : true}
      style={{ ...styles.container, ...props.style }}
    >
      {props.children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    // alignItems: "center",
    elevation: 3,
    backgroundColor: "white",
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 5,
    // width: "100%",
  },
});

export default Card;
