import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { Refresh } from "../assets/svg/icons";
import Colors from "../constants/Colors";

import AppText from "./AppText";
import CustomButton from "./CustomButton";

function NoData({ onPress, text, size, canNotRefresh, buttonTitle }) {
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
          // padding: 40,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 3,
          marginBottom: 30,
        }}
      >
        <Image
          source={require("../assets/noData.png")}
          style={{
            width: size ? size : 180,
            height: size ? size : 180,
            margin: 40,
            borderWidth: 1,
          }}
          resizeMode="contain"
        />
      </View>

      <AppText
        style={{ fontSize: 18, marginHorizontal: 10, textAlign: "center" }}
      >
        {text}
      </AppText>
      {!canNotRefresh && (
        <View style={{ flexDirection: "row", padding: 20, width: 300 }}>
          <CustomButton
            title={buttonTitle ? buttonTitle : "Refresh"}
            onPress={onPress}
            style={{ height: 50 }}
          />
          {!buttonTitle && (
            <CustomButton
              icon={<Refresh />}
              onPress={onPress}
              style={{ height: 50, flex: 0.2, marginLeft: 10 }}
            />
          )}
        </View>
      )}
    </View>
  );
}

export default NoData;
