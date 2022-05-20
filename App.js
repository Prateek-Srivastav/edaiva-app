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
import candidateApi from "./src/api/candidate";
import campusCandidateApi from "./src/api/campusApis/candidate";
import useApi from "./src/hooks/useApi";
import cache from "./src/utilities/cache";

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
  const [fullName, setFullName] = useState();
  const [email, setEmail] = useState();
  const [isCampusStudent, setIsCampusStudent] = useState();
  const [isProfileComplete, setIsProfileComplete] = useState();
  const [isTabBarShown, setIsTabBarShown] = useState(true);

  const { data: campusProfileData, request: loadCampusProfile } = useApi(
    campusCandidateApi.getProfile
  );

  const { data: profileData, request: loadProfile } = useApi(
    candidateApi.getProfile
  );

  useEffect(() => {
    if (profileData?.error === "Candidate Profile not found!!") {
      console.log(profileData);
      setIsProfileComplete(false);
    } else setIsProfileComplete(true);

    if (
      campusProfileData?.detail === "Your are not a part of any institution !"
    )
      setIsCampusStudent(false);
    else setIsCampusStudent(true);
  }, [profileData, campusProfileData]);

  const restoreToken = async () => {
    const storedTokens = await authStorage.getToken();
    if (!storedTokens.refreshToken) return;
    setTokens(storedTokens);
  };

  const restoreUser = async () => {
    const data = await cache.get("user");
    // const { firstname, lastname, email } = data;
    // const { isProfileComplete } = userDetails();
    // console.log(details, "abcdefgh");

    // console.log(data);
    setFullName(data?.firstname + " " + data?.lastname);
    setEmail(data?.email);
  };

  if (!isReady) {
    return (
      <AppLoading
        startAsync={async () => {
          await fetchFonts();
          restoreToken();
          restoreUser();
          loadProfile();
          loadCampusProfile();
          await refreshAccessToken();
          // await userDetails()
        }}
        onFinish={() => setIsReady(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  return (
    <AuthContext.Provider
      value={{
        tokens,
        fullName,
        email,
        isTabBarShown,
        isCampusStudent,
        isProfileComplete,
        setFullName,
        setEmail,
        setTokens,
        setIsTabBarShown,
        setIsCampusStudent,
        setIsProfileComplete,
      }}
    >
      <NavigationContainer ref={navigationRef}>
        {tokens ? (
          <AppNavigator />
        ) : (
          <>
            <AuthNavigator />
          </>
        )}
      </NavigationContainer>
      <Toast config={toastConfig} position="bottom" />
      <StatusBar style="dark" />
    </AuthContext.Provider>
  );
}
