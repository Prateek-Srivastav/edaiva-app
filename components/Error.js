import React from "react";
import { View, Image } from "react-native";

import AppText from "./AppText";
import CustomButton from "./CustomButton";

function Error({ onPress }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
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
          source={require("../assets/noData.png")}
          style={{ width: 250, height: 250 }}
        />
      </View>
      <AppText>Couldn't load data</AppText>
      <CustomButton
        title="Retry"
        onPress={onPress}
        style={{ height: 20, flex: 0.15, width: "80%" }}
      />
    </View>
  );
}

export default Error;
