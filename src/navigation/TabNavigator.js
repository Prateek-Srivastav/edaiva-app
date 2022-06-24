import React, { useEffect, useState, useContext } from "react";
import { Animated, Dimensions, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { io } from "socket.io-client";

import JobsNavigator from "./JobsNavigator";
import Colors from "../constants/Colors";
import ApplicationNavigator from "./ApplicationNavigator";
import {
  BagFilled,
  BagOutline,
  BellFilled,
  BellOutline,
  HomeFilled,
  HomeOutline,
} from "../assets/svg/icons";
import NotificationsNavigator from "./NotificationsNavigator";
import applicationApi from "../api/application";
import notificationApi from "../api/notifications";
import useApi from "../hooks/useApi";
import authStorage from "../auth/storage";
import AuthContext from "../auth/context";
import AuthNavigator from "./AuthNavigator";

const Tab = createBottomTabNavigator();

function MainNavigator({ route }) {
  const isFocused = useIsFocused();
  const [accessToken, setAccessToken] = useState();

  const { isTabBarShown, isAuthSkipped } = useContext(AuthContext);

  const {
    data,
    error,
    networkError,
    loading,
    request: loadApplications,
  } = useApi(applicationApi.getApplications);

  let applications;

  if (data) {
    applications = data;
  }
  const {
    res: notificationData,
    data: notificData,
    request: loadNotifications,
  } = useApi(notificationApi.getNotifications);

  if (data) {
    applications = data;
  }

  const notifications = notificData?.records?.filter(
    (notific) => notific.status !== "seen"
  );

  const getToken = async () => {
    const token = await authStorage.getToken();
    setAccessToken(token.accessToken);
    return accessToken;
  };

  getToken();

  const socket = io("https://godevgw.edaiva.com:8007/socket.io/", {
    query: { token: accessToken },
  });

  socket.on("connect", () => console.log("socket connection success!!"));

  socket.on("notification", (msg) => console.log(msg));

  useEffect(() => {
    loadApplications();
    loadNotifications("job");
  }, [isFocused]);

  const { width, height } = Dimensions.get("window");
  const [position] = useState(new Animated.ValueXY());

  const animStyles = {
    position: "absolute",
    marginHorizontal: (3 / 20) * width,
    borderRadius: 20,
    elevation: 35,
    bottom: 40,
    height: 6,
    width: 6,
    backgroundColor: Colors.black,
    transform: position.getTranslateTransform(),
  };

  const sliderWidth = width - (3 / 20) * width;

  const animate = (value) => {
    Animated.timing(position, {
      toValue: { x: value, y: 0 },
      duration: 160,
      useNativeDriver: true,
    }).start();
  };

  const getTabBarVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Jobs";

    if (
      routeName === "JobDetail" ||
      routeName === "ApplicationStatus" ||
      !isTabBarShown
    )
      return "none";

    return "flex";
  };

  return (
    <View style={{ width, flex: 1, backgroundColor: "white" }}>
      {/* {isTabBarVisible && <Animated.View style={animStyles} />} */}
      <Tab.Navigator
        initialRouteName="Jobs"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let icon;
            color = focused ? Colors.black : "black";
            size = focused ? 26 : 24;

            if (route.name === "Jobs")
              icon = focused ? <HomeFilled /> : <HomeOutline />;
            else if (route.name === "NotificationsStack")
              icon = focused ? <BellFilled /> : <BellOutline />;
            else if (route.name === "ApplicationNavigator") {
              icon = focused ? <BagFilled /> : <BagOutline />;
            }
            return icon;
          },
          headerTitleStyle: {
            fontFamily: "OpenSans-SemiBold",
            color: Colors.primary,
            fontSize: 20,
          },

          tabBarStyle: {
            backgroundColor: Colors.primary,
            borderTopColor: Colors.primary,
            alignSelf: "center",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            width: "70%",
            overflow: "hidden",
          },
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          lazy: false,
        })}
      >
        <Tab.Screen
          name="ApplicationNavigator"
          component={ApplicationNavigator}
          options={({ route }) => ({
            headerShown: false,
            headerTitleStyle: { color: Colors.primary },
            tabBarStyle: {
              display: getTabBarVisibility(route),
              backgroundColor: Colors.primary,
              borderTopColor: Colors.primary,
              alignSelf: "center",
              borderTopStartRadius: 4,
              borderTopEndRadius: 4,
              width: "70%",
              overflow: "hidden",
            },
          })}
          listeners={{
            tabPress: (e) => {
              // e.preventDefault();
              animate(sliderWidth / 6);
            },
          }}
        />
        {/* <Animated.View style={animStyles} /> */}
        <Tab.Screen
          name="Jobs"
          component={JobsNavigator}
          options={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              display: getTabBarVisibility(route),
              backgroundColor: Colors.primary,
              borderTopColor: Colors.primary,
              alignSelf: "center",
              borderTopStartRadius: 4,
              borderTopEndRadius: 4,
              width: "70%",
              overflow: "hidden",
            },
          })}
          listeners={{
            tabPress: (e) => {
              // e.preventDefault();

              animate(sliderWidth / 2);
            },
          }}
        />

        <Tab.Screen
          name="NotificationsStack"
          component={NotificationsNavigator}
          options={({ route }) => ({
            headerShown: false,
            tabBarBadge:
              notifications?.length === 0 ? null : notifications?.length,
            tabBarBadgeStyle: {
              backgroundColor: Colors.bg,
              color: Colors.black,
              fontFamily: "OpenSans-SemiBold",
              marginTop: 2,
              alignItems: "center",
              justifyContent: "center",
              height: 18,
              width: 18,
              borderRadius: 9,
            },
            // lazy: false,
          })}
          listeners={{
            tabPress: (e) => {
              // e.preventDefault();
              animate(width - width / 3);
            },
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

export default MainNavigator;
