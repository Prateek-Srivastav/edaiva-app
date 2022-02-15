import React from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import Colors from "../constants/Colors";

function CustomHeader({
  backDisabled,
  backScreen,
  isMenu,
  isShare,
  navigation,
  onRightIconPress,
  children,
  screenName,
}) {
  return (
    <>
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          {!backDisabled && (
            <TouchableOpacity onPress={() => navigation.navigate(backScreen)}>
              <Ionicons
                name="arrow-back-outline"
                size={25}
                color={Colors.primary}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.titleStyle}>{screenName}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors.bg,
          }}
          onPress={onRightIconPress}
        >
          {children}
          {isMenu ? (
            <TouchableOpacity onPress={onRightIconPress}>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color={Colors.primary}
              />
            </TouchableOpacity>
          ) : null}
          {isShare && (
            <TouchableOpacity onPress={onRightIconPress}>
              <AntDesign name="sharealt" size={23} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.line} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: StatusBar.currentHeight,
    height: 50,
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    width: "100%",
    height: 1.6,
    borderRadius: 10,
    backgroundColor: "#0AB4F1",
    elevation: 1,
    opacity: 0.15,
  },
  titleStyle: {
    fontFamily: "OpenSans-SemiBold",
    color: Colors.primary,
    fontSize: 20,
    marginLeft: 10,
  },
});

export default CustomHeader;
