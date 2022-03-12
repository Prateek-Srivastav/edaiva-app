import React from "react";
import { View, StyleSheet } from "react-native";

import AppText from "../AppText";
import Colors from "../../constants/Colors";

function ViewAbout({ description }) {
  let color;
  if (!description || description === "") color = Colors.grey;
  else color = Colors.black;

  return (
    <View style={styles.container}>
      <AppText style={{ color }}>
        {!description || description === ""
          ? "Tell something about you..."
          : description}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginStart: 5,
  },
});

export default ViewAbout;
