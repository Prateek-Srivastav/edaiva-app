import React, { useEffect, useState, useRef } from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import * as Notifications from "expo-notifications";

import ProfileNavigator from "./ProfileNavigator";
import TabNavigator from "./TabNavigator";
import CustomDrawer from "../components/CustomDrawer";
import WishlistNavigator from "./WishlistNavigator";
import CampusNavigator from "./campusNavigation/CampusNavigator";
import navigation from "./rootNavigation";
import useApi from "../hooks/useApi";
import expoNotificationsApi from "../api/expoNotifications";

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

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        navigation.navigate("ProfileStack");
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  Notifications.addPushTokenListener;

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
      console.log(token, "aaaaaaaa");
      sendPushToken({ expo_token: token });

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      return token;
    } catch (error) {
      console.log("Error getting a push token", error);
    }
  };

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Home" component={TabNavigator} />
      <Drawer.Screen name="ProfileStack" component={ProfileNavigator} />
      <Drawer.Screen name="WishlistStack" component={WishlistNavigator} />
      <Drawer.Screen name="CampusStack" component={CampusNavigator} />
    </Drawer.Navigator>
  );
}

export default AppNavigator;
