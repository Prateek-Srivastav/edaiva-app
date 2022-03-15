import React, { useEffect, useState } from "react";
import { Animated, Dimensions, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import CampusJobsNavigator from "./CampusJobsNavigator";
// import NotificationsScreen from "./screens/NotificationsScreen";
// import ApplicationsScreen from "./screens/ApplicationsScreen";
import Colors from "../../constants/Colors";
import CampusApplicationNavigator from "./CampusApplicationNavigator";
import {
  BagFilled,
  BagOutline,
  BellFilled,
  BellOutline,
  HomeFilled,
  HomeOutline,
} from "../../assets/svg/icons";

import CampusNotificationsNavigator from "./CampusNotificationsNavigator";
import applicationApi from "../../api/application";
import useApi from "../../hooks/useApi";
import { useIsFocused } from "@react-navigation/native";
import campusCandidateApi from "../../api/campusApis/candidate";
import { navigationRef } from "../rootNavigation";
import CampusSelectionScreen from "../../screens/campusScreens/CampusSelectionScreen";
import campusApplicationApi from "../../api/campusApis/application";

const Tab = createBottomTabNavigator();

function CampusNavigator({ route, navigation }) {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  const isFocused = useIsFocused();

  const {
    data,
    error,
    networkError,
    loading,
    request: loadApplications,
  } = useApi(campusApplicationApi.getCampusApplications);

  // const { data: campusProfileData, request: loadCampusProfile } = useApi(
  //   campusCandidateApi.getProfile
  // );

  let applications;

  if (data) {
    applications = data;
  }

  useEffect(() => {
    loadApplications();
    // loadCampusProfile();
  }, [isFocused]);

  const notifications = applications?.filter(
    (application) =>
      application.status === "hired" ||
      application.status === "finalist" ||
      application.status === "interviewing"
  );

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
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";

    if (routeName === "JobDetail" || routeName === "CampusApplicationStatus")
      return "none";

    return "flex";
  };

  const getNotificationCount = (route) => {
    console.log(route);
  };

  return (
    <View style={{ width, flex: 1, backgroundColor: "white" }}>
      {/* {isTabBarVisible && <Animated.View style={animStyles} />} */}
      <Tab.Navigator
        initialRouteName="CampusJobs"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let icon;
            color = focused ? Colors.black : "black";
            size = focused ? 26 : 24;

            if (route.name === "CampusJobs")
              icon = focused ? <HomeFilled /> : <HomeOutline />;
            else if (route.name === "CampusNotificationsStack")
              icon = focused ? <BellFilled /> : <BellOutline />;
            else if (route.name === "CampusApplicationNavigator") {
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
            // position: "absolute",
            // elevation: 5,
          },
          // tabBarActiveTintColor: Colors.black,
          // tabBarInactiveTintColor: Colors.primary,
          tabBarShowLabel: false,
          lazy: false,
        })}
      >
        <Tab.Screen
          name="CampusApplicationNavigator"
          component={CampusApplicationNavigator}
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
          name="CampusJobs"
          component={CampusJobsNavigator}
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
          name="CampusNotificationsStack"
          component={CampusNotificationsNavigator}
          options={({ route }) => ({
            headerShown: false,
            tabBarBadge: notifications?.length,
            // tabBarBadge: notifications.length,
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

export default CampusNavigator;
