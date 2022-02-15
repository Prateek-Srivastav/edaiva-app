import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { enableScreens } from "react-native-screens";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import AuthNavigator from "./navigation/AuthNavigator";

import HomeScreen from "./screens/HomeScreen";
import JobsNavigator from "./navigation/JobsNavigator";
import ProfileScreen from "./screens/ProfileScreen";
import ProfileNavigator from "./navigation/ProfileNavigator";
import TabNavigator from "./navigation/TabNavigator";
import AppNavigator from "./navigation/AppNavigator";
import ApplicationStatusScreen from "./screens/ApplicationStatusScreen";
import toastConfig from "./utilities/toastConfig";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import AuthContext from "./auth/context";
import authStorage from "./auth/storage";
import refreshAccessToken from "./utilities/refreshAccessToken";
import logger from "./utilities/logger";

logger.start();

enableScreens();

const fetchFonts = () => {
  return Font.loadAsync({
    "OpenSans-Medium": require("./assets/fonts/OpenSans-Medium.ttf"),
    "OpenSans-Regular": require("./assets/fonts/OpenSans-Regular.ttf"),
    "OpenSans-SemiBold": require("./assets/fonts/OpenSans-SemiBold.ttf"),
    "OpenSans-Bold": require("./assets/fonts/OpenSans-Bold.ttf"),
    "OpenSans-Italic": require("./assets/fonts/OpenSans-Italic.ttf"),
  });
};

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [tokens, setTokens] = useState();

  const restoreToken = async () => {
    const storedTokens = await authStorage.getToken();

    if (!storedTokens.refreshToken) return;
    setTokens(storedTokens);
  };

  if (!isReady) {
    return (
      <AppLoading
        startAsync={async () => {
          await fetchFonts();
          restoreToken();
          await refreshAccessToken();
        }}
        onFinish={() => setIsReady(true)}
        onError={(err) => logger.log(err)}
      />
    );
  }

  return (
    <AuthContext.Provider value={{ tokens, setTokens }}>
      <NavigationContainer>
        {tokens ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
      <Toast config={toastConfig} position="bottom" />
    </AuthContext.Provider>
  );
}
