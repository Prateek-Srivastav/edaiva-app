import React from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import Colors from "../constants/Colors";
const { width, height } = Dimensions.get("screen");

function CustomHeader({
  backDisabled,
  backScreen,
  isMenu,
  isShare,
  isLoginScreen,
  isRegisterScreen,
  navigation,
  onRightIconPress,
  children,
  goBack,
  screenName,
}) {
  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!backDisabled && backScreen && (
            <TouchableOpacity onPress={() => navigation.navigate(backScreen)}>
              <Ionicons
                name="arrow-back-outline"
                size={25}
                color={Colors.primary}
              />
            </TouchableOpacity>
          )}
          {!backDisabled && goBack && (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="arrow-back-outline"
                size={25}
                color={Colors.primary}
              />
            </TouchableOpacity>
          )}
          {(isLoginScreen || isRegisterScreen) && (
            <Image
              source={require("../assets/edaiva_logo_edit-03.png")}
              style={{
                height: 30,
                width: 140,
                top: 2,
              }}
            />
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
          {isLoginScreen && (
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text
                style={{
                  fontFamily: "OpenSans-Medium",
                  fontSize: 16,
                  color: Colors.primary,
                }}
              >
                Register
              </Text>
            </TouchableOpacity>
          )}
          {isRegisterScreen && (
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text
                style={{
                  fontFamily: "OpenSans-Medium",
                  fontSize: 16,
                  color: Colors.primary,
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: StatusBar.currentHeight,
    height: StatusBar.currentHeight + (height < 160 ? 40 : 50),
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
    elevation: 4,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  titleStyle: {
    fontFamily: "OpenSans-SemiBold",
    color: Colors.primary,
    fontSize: 20,
    marginLeft: 10,
  },
});

export default CustomHeader;
