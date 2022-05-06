import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../constants/Colors";

function LeftHeader(props) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {props.navigation.canGoBack() && (
        <TouchableOpacity onPress={() => props.navigation.navigate("Home")}>
          <Ionicons
            name="arrow-back-outline"
            size={25}
            color={Colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default LeftHeader;
