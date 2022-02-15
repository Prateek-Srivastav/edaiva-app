import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import Colors from "../constants/Colors";

import AppText from "./AppText";

function CardInput(props) {
  return (
    <View
      style={{
        ...styles.container,
        ...props.style,
      }}
    >
      {props.label && (
        <AppText
          style={{
            alignSelf: "flex-start",
            marginVertical: 5,
            ...props.labelStyle,
          }}
        >
          {props.label}
        </AppText>
      )}
      <View style={{ ...props.inputStyle, ...styles.inputContainer }}>
        <TextInput
          {...props}
          returnKeyType="done"
          style={{
            ...styles.input,
            textAlignVertical: props.multiline ? "top" : null,
            marginTop: props.multiline ? 6 : 0,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
    color: Colors.black,
    fontFamily: "OpenSans-Regular",
  },
  inputContainer: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#FFFFFF",
    elevation: 3,
    // marginHorizontal: 10,
    borderRadius: 3,
    // width: "100%",
  },
});

export default CardInput;
