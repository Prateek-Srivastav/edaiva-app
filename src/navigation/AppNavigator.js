import React, { useEffect, useState, useRef, useContext } from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import * as Notifications from "expo-notifications";

import ProfileNavigator from "./ProfileNavigator";
import TabNavigator from "./TabNavigator";
import CustomDrawer from "../components/CustomDrawer";
import WishlistNavigator from "./WishlistNavigator";
import CampusNavigator from "./campusNavigation/CampusNavigator";
import useApi from "../hooks/useApi";
import expoNotificationsApi from "../api/expoNotifications";
import authStorage from "../auth/storage";
import campusCandidateApi from "../api/campusApis/candidate";
import Loading from "../components/Loading";
import CampusSelectionScreen from "../screens/campusScreens/CampusSelectionScreen";
import CreateProfileScreen from "../screens/CreateProfileScreen";
import navigation from "./rootNavigation";
import PreferenceScreen from "../screens/PreferenceScreen";
import AuthNavigator from "./AuthNavigator";
import AuthContext from "../auth/context";
import { Text, TouchableOpacity, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import VerificationCodeScreen from "../screens/VerificationCodeScreen";
import ForgotPasswordNavigator from "./ForgotPasswordNavigator";
import Colors from "../constants/Colors";

const Drawer = createDrawerNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function AppNavigator() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [tokens, setTokens] = useState();

  const isFocused = useIsFocused();

  const { isAuthSkipped, isCampusStudent, setIsCampusStudent } =
    useContext(AuthContext);

  const {
    data: campusProfileData,
    loading: campusProfileLoading,
    request: loadCampusProfile,
  } = useApi(campusCandidateApi.getProfile);

  const restoreToken = async () => {
    const storedTokens = await authStorage.getToken();
    if (!storedTokens.refreshToken) return;
    setTokens(storedTokens);
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // if (campusProfileData && campusProfileData[0]?.batch_id)
    //   setIsCampusStudent(true);
    // else setIsCampusStudent(false);

    restoreToken();
    if (tokens) {
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          navigation.navigate("NotificationsStack");
          // console.log(response);
          // console.log("response");
        });

      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, [isFocused, isAuthSkipped]);

  // Notifications.addPushTokenListener;

  useEffect(() => {
    if (!isAuthSkipped) loadCampusProfile();
  }, []);

  useEffect(() => {
    if (campusProfileData && campusProfileData[0]?.batch_id)
      setIsCampusStudent(true);
    console.log(campusProfileData);
  }, [campusProfileData]);

  const {
    data,
    error,
    networkError,
    loading,
    request: sendPushToken,
  } = useApi(expoNotificationsApi.sendPushToken);

  const registerForPushNotificationsAsync = async () => {
    try {
      let token;

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      // console.log(token);
      if (!isAuthSkipped) sendPushToken({ expo_token: token });

      // if (Platform.OS === "android") {
      //   Notifications.setNotificationChannelAsync("default", {
      //     name: "default",
      //     importance: Notifications.AndroidImportance.MAX,
      //     vibrationPattern: [0, 250, 250, 250],
      //     lightColor: "#FF231F7C",
      //   });
      // }

      return token;
    } catch (error) {
      console.log("Error getting a push token", error);
    }
  };

  console.log("IN APPNAVIGATOR");
  if ((!campusProfileData && !isAuthSkipped) || campusProfileLoading)
    return <Loading />;

  if (isCampusStudent && !isAuthSkipped) {
    return (
      <Drawer.Navigator
        screenOptions={{ headerShown: false }}
        drawerContent={(props) => <CustomDrawer {...props} />}
      >
        <Drawer.Screen name="CampusStack" component={CampusNavigator} />
        <Drawer.Screen name="ProfileStack" component={ProfileNavigator} />
        <Drawer.Screen name="WishlistStack" component={WishlistNavigator} />
        <Drawer.Screen name="Home" component={TabNavigator} />
        <Drawer.Screen name="CreateProfile" component={CreateProfileScreen} />
        <Drawer.Screen name="Preference" component={PreferenceScreen} />
      </Drawer.Navigator>
    );
  }
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Home" component={TabNavigator} />
      <Drawer.Screen name="CreateProfile" component={CreateProfileScreen} />
      <Drawer.Screen name="ProfileStack" component={ProfileNavigator} />
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="Register" component={RegisterScreen} />
      <Drawer.Screen
        name="CodeVerification"
        component={VerificationCodeScreen}
      />
      <Drawer.Screen
        name="ForgotPasswordStack"
        component={ForgotPasswordNavigator}
      />
      <Drawer.Screen name="WishlistStack" component={WishlistNavigator} />
      <Drawer.Screen name="CampusStack" component={CampusNavigator} />
      <Drawer.Screen name="CampusSelection" component={CampusSelectionScreen} />
      <Drawer.Screen name="Preference" component={PreferenceScreen} />
    </Drawer.Navigator>
  );
}

export default AppNavigator;
