import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TransitionPresets } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import Colors from "../constants/Colors";
import ForgotPasswordNavigator from "./ForgotPasswordNavigator";
import VerificationCodeScreen from "../screens/VerificationCodeScreen";

const Stack = createNativeStackNavigator();

const leftHeader = () => {
  const navigation = useNavigation();
  let isBackShown = true;
  if (
    navigation.getRootState() === undefined ||
    navigation.getRootState().routes.length === 1
  )
    isBackShown = false;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isBackShown && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back-outline"
            size={25}
            color={Colors.primary}
          />
        </TouchableOpacity>
      )}
      <Image
        source={require("../assets/edaiva_logo_edit-03.png")}
        style={{
          height: 30,
          width: 140,
          top: 2,
        }}
      />
    </View>
  );
};

const rightLoginHeader = () => {
  const navigation = useNavigation();

  return (
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
  );
};

const rightRegisterHeader = () => {
  const navigation = useNavigation();

  return (
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
  );
};

const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerLeft: () => leftHeader(),
      headerTitle: () => null,
      ...TransitionPresets.SlideFromRightIOS,
    }}
  >
    <Stack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "#FDFDFD" },
        headerRight: () => rightLoginHeader(),
      }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        headerRight: () => rightLoginHeader(),
      }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{
        headerRight: () => rightRegisterHeader(),
      }}
    />
    <Stack.Screen name="CodeVerification" component={VerificationCodeScreen} />
    <Stack.Screen
      name="ForgotPasswordStack"
      component={ForgotPasswordNavigator}
      options={
        {
          // headerRight: () => rightRegisterHeader(),
        }
      }
    />
  </Stack.Navigator>
);

export default AuthNavigator;
