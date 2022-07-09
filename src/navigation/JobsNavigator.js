import React from "react";
import { View, Image, Share, TouchableOpacity } from "react-native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { CardStyleInterpolators } from "@react-navigation/stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import JobDetailScreen from "../screens/JobDetailScreen";

import Colors from "../constants/Colors";
import { jobClient } from "../api/client";
import ApplicationStatusIndicator from "../components/application/ApplicationStatusIndicator";
import ApplicationStatusScreen from "../screens/ApplicationStatusScreen";
import CreateProfileScreen from "../screens/CreateProfileScreen";

const Stack = createNativeStackNavigator();

const JobsNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      // animation: "slide_from_right",
      // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}
  >
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerShadowVisible: false,
        headerShown: false,
        // headerStyle: { backgroundColor: "#FDFDFD" },
        // headerRight: () => rightLoginHeader(),
      }}
    />
    <Stack.Screen
      name="JobDetail"
      component={JobDetailScreen}
      options={
        {
          // headerRight: () => rightShareHeader(),
        }
      }
    />
    <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
    <Stack.Screen
      name="ApplicationStatus"
      component={ApplicationStatusScreen}
      options={({ route }) => ({
        title: "",
        headerRight: () => {
          return (
            <ApplicationStatusIndicator
              applicationStatus={route.params.applicationStatus}
            />
          );
        },
      })}
    />
  </Stack.Navigator>
);

export default JobsNavigator;
