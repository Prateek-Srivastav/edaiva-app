import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { Refresh } from "../assets/svg/icons";
import Colors from "../constants/Colors";

import AppText from "./AppText";
import CustomButton from "./CustomButton";

function NetworkError({ onPress }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.bg,
      }}
    >
      <View
        style={{
          padding: 40,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 3,
          marginBottom: 30,
        }}
      >
        <Image
          source={require("../assets/connectionLost.png")}
          style={{ width: 250, height: 250 }}
        />
      </View>
      <AppText style={{ fontSize: 30, fontFamily: "OpenSans-Medium" }}>
        Ouch...
      </AppText>
      <AppText style={{ fontSize: 20 }}>Connection lost</AppText>
      <View style={{ flexDirection: "row", padding: 20 }}>
        <CustomButton
          title="Refresh"
          onPress={onPress}
          style={{ height: 50 }}
        />
        <CustomButton
          icon={<Refresh />}
          onPress={onPress}
          style={{ height: 50, flex: 0.2, marginLeft: 10 }}
        />
      </View>
    </View>
  );
}

export default NetworkError;
