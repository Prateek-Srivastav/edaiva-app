import "react-native-gesture-handler";
import AppLoading from "expo-app-loading";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { enableScreens } from "react-native-screens";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
// import * as Sentry from "sentry-expo";

import AuthNavigator from "./src/navigation/AuthNavigator";
import AppNavigator from "./src/navigation/AppNavigator";
import AuthContext from "./src/auth/context";
import authStorage from "./src/auth/storage";
import refreshAccessToken from "./src/utilities/refreshAccessToken";
import { navigationRef } from "./src/navigation/rootNavigation";
import toastConfig from "./src/utilities/toastConfig";

enableScreens();

// Sentry.init({
//   dsn: "https://5e7f7ff3fa464559967c04663df5ed02@o1168372.ingest.sentry.io/6260247",
//   enableInExpoDevelopment: true,
//   debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
// });

const fetchFonts = () => {
  return Font.loadAsync({
    "OpenSans-Medium": require("./src/assets/fonts/OpenSans-Medium.ttf"),
    "OpenSans-Regular": require("./src/assets/fonts/OpenSans-Regular.ttf"),
    "OpenSans-SemiBold": require("./src/assets/fonts/OpenSans-SemiBold.ttf"),
    "OpenSans-Bold": require("./src/assets/fonts/OpenSans-Bold.ttf"),
    "OpenSans-Italic": require("./src/assets/fonts/OpenSans-Italic.ttf"),
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
        onError={(err) => console.log(err)}
      />
    );
  }

  return (
    <AuthContext.Provider value={{ tokens, setTokens }}>
      <NavigationContainer ref={navigationRef}>
        {tokens ? (
          <>
            <AppNavigator />
            <StatusBar style="dark" />
          </>
        ) : (
          <>
            <AuthNavigator />
            <StatusBar style="dark" />
          </>
        )}
      </NavigationContainer>
      <Toast config={toastConfig} position="bottom" />
    </AuthContext.Provider>
  );
}
