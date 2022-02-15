import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

import Colors from "../constants/Colors";

function PickerItem({ label, onPress, selected }) {
  return (
    <TouchableOpacity
      activeOpacity={0.4}
      onPress={onPress}
      style={styles.container}
    >
      <Text style={styles.text}>{label}</Text>
      <View
        style={{
          ...styles.dotContainer,
          borderColor: selected === label ? Colors.primary : "#ccc",
        }}
      >
        <View
          style={{
            ...styles.dot,
            backgroundColor: selected === label ? Colors.primary : "white",
          }}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dot: {
    justifyContent: "center",
    alignItems: "center",
    height: 12,
    width: 12,
    overflow: "hidden",
    borderRadius: 6,
    borderColor: "#ccc",
    backgroundColor: "#ccc",
  },
  dotContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 9,
    height: 18,
    width: 18,
  },
  text: {
    fontFamily: "OpenSans-Regular",
    fontSize: 17,
    color: Colors.black,
  },
});

export default PickerItem;
