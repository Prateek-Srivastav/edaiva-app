import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const Label = ({ text, ...restProps }) => {
  return (
    <View style={styles.root} {...restProps}>
      {text === 17 ? (
        <Text style={styles.text}>16 +</Text>
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 5,
    backgroundColor: "#B9ECFF4D",
    borderRadius: 4,
    borderColor: "#0AB4F14D",
    borderWidth: 1,
  },
  text: {
    fontSize: 15,
    color: Colors.primary,
  },
});

export default memo(Label);
