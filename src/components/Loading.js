import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

import Colors from "../constants/Colors";

function Loading({ size, style }) {
  return (
    <View style={{ ...styles.loading, style }}>
      <ActivityIndicator size={size ? size : "large"} color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loading;
