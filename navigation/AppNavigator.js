import React, { useEffect, useState, useRef } from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";

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
import navigate from "./rootNavigation";

const Drawer = createDrawerNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function AppNavigator({ navigation }) {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [tokens, setTokens] = useState();

  const { data: campusProfileData, request: loadCampusProfile } = useApi(
    campusCandidateApi.getProfile
  );

  const restoreToken = async () => {
    const storedTokens = await authStorage.getToken();
    if (!storedTokens.refreshToken) return;
    setTokens(storedTokens);
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
    loadCampusProfile();

    restoreToken();
    if (tokens) {
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          // Linking.openURL(
          //   "https://143.110.241.27:6204/applications/6209ff95afab70a746bf4d76"
          // );
          // navigate("Applications");
          // console.log(response);
        });

      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, []);

  // Notifications.addPushTokenListener;

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
      console.log(token);
      sendPushToken({ expo_token: token });

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

  if (!campusProfileData) return <Loading />;
  else if (
    campusProfileData?.detail !== "Your are not a part of any institution !"
  ) {
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
      <Drawer.Screen name="WishlistStack" component={WishlistNavigator} />
      <Drawer.Screen name="CampusStack" component={CampusNavigator} />
      <Drawer.Screen name="CampusSelection" component={CampusSelectionScreen} />
    </Drawer.Navigator>
  );
}

export default AppNavigator;
