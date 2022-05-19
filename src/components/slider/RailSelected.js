import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import Colors from "../../constants/Colors";

const RailSelected = () => {
  return <View style={styles.root} />;
};

export default memo(RailSelected);

const styles = StyleSheet.create({
  root: {
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
});
