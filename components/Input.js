import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
// import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../constants/Colors";

const Input = React.forwardRef((props, ref) => {
  return (
    <View style={styles.formControl}>
      {props.label && <Text style={styles.label}>{props.label}</Text>}
      <View style={{ ...styles.input, ...props.style }}>
        <TextInput {...props} style={styles.textInput} ref={ref} />
        {props.icon && (
          <TouchableOpacity>
            <Ionicons
              name={props.icon}
              size={22}
              color={Colors.primary}
              style={styles.icon}
              onPress={props.onIconPress}
            />
          </TouchableOpacity>
        )}
      </View>
      {/* {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )} */}
    </View>
  );
});

const styles = StyleSheet.create({
  formControl: {
    width: "100%",
    marginTop: 10,
    // paddingHorizontal: 5,
    marginVertical: 13,
  },
  label: {
    fontFamily: "OpenSans-Regular",
    marginVertical: 5,
    color: "#817E7E",
    fontSize: 15,
  },
  icon: {
    marginStart: 5,
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    // marginVertical: 10,
    // width: "100%",
    borderColor: Colors.primary,
    borderWidth: 1.4,
    borderRadius: 4,
    height: 40,
    paddingHorizontal: 10,
    // width: 200,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    color: "red",
  },
  textInput: {
    flex: 1,
    color: Colors.primary,
    fontFamily: "OpenSans-Regular",
    fontSize: 15,
  },
});

export default Input;
