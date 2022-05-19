import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const THUMB_RADIUS = 9;

const Thumb = () => {
  return <View style={styles.root} />;
};

const styles = StyleSheet.create({
  root: {
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,
    // borderWidth: 2,
    // borderColor: "#B9ECFF4D",
    backgroundColor: Colors.primary,
  },
});

export default memo(Thumb);
