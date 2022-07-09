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
import HomeScreenSkeleton from "./src/components/skeletons/HomeScreenSkeleton";
import JobDetailScreenSkeleton from "./src/components/skeletons/JobDetailScreenSkeleton";
import ProfileScreenSkeleton from "./src/components/skeletons/ProfileScreenSkeleton";

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
  const [isAuthSkipped, setIsAuthSkipped] = useState();

  const { data: campusProfileData, request: loadCampusProfile } = useApi(
    campusCandidateApi.getProfile
  );

  const { data: profileData, request: loadProfile } = useApi(
    candidateApi.getProfile
  );

  useEffect(() => {
    if (profileData?.error === "Candidate Profile not found!!") {
      setIsProfileComplete(false);
    } else setIsProfileComplete(true);

    if (campusProfileData && campusProfileData[0]?.batch_id)
      setIsCampusStudent(true);
    else setIsCampusStudent(false);
  }, [profileData, campusProfileData]);

  const restoreToken = async () => {
    const storedTokens = await authStorage.getToken();
    if (!storedTokens.refreshToken) return;
    setTokens(storedTokens);
  };

  const restoreUser = async () => {
    const data = await cache.get("user");
    setFullName(data?.firstname + " " + data?.lastname);
    setEmail(data?.email);
  };

  const authSkippedFunc = async () => {
    const authSkipped = await cache.get("isAuthSkipped");
    if (authSkipped) {
      setIsCampusStudent(false);
      setIsProfileComplete(false);
    }
    setIsAuthSkipped(authSkipped);
  };

  const myStartup = async () => {
    await fetchFonts();
    await restoreToken();
    await restoreUser();
    await loadProfile();
    await authSkippedFunc();
    await loadCampusProfile();
    await refreshAccessToken();
  };

  const myFinish = () => {
    setIsReady(true);
  };

  if (!isReady || !campusProfileData || !profileData) {
    return (
      <AppLoading
        startAsync={myStartup}
        onFinish={myFinish}
        onError={(err) => console.warn("APPLOADING ERROR", err)}
      />
    );
  }

  return (
    <AuthContext.Provider
      value={{
        tokens,
        isAuthSkipped,
        fullName,
        email,
        isTabBarShown,
        isCampusStudent,
        isProfileComplete,
        setFullName,
        setEmail,
        setTokens,
        setIsAuthSkipped,
        setIsTabBarShown,
        setIsCampusStudent,
        setIsProfileComplete,
      }}
    >
      <NavigationContainer ref={navigationRef}>
        {tokens || isAuthSkipped ? (
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

  // return <ProfileScreenSkeleton />;
}
