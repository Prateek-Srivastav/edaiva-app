import React from "react";
import { View, StyleSheet } from "react-native";

import AppText from "../AppText";
import Colors from "../../constants/Colors";

function ViewAbout({ data }) {
  return (
    <View style={styles.container}>
      <AppText style={{ color: Colors.black }}>{data}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
});

export default ViewAbout;
