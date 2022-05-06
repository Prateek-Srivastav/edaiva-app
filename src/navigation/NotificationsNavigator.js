import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TransitionPresets } from "@react-navigation/stack";

import Colors from "../constants/Colors";
import NotificationsScreen from "../screens/NotificationsScreen";
import ApplicationStatusScreen from "../screens/ApplicationStatusScreen";
import ApplicationStatusIndicator from "../components/application/ApplicationStatusIndicator";

const Stack = createNativeStackNavigator();

const NotificationsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ApplicationStatus"
        component={ApplicationStatusScreen}
        options={({ route }) => ({
          title: "",
          headerTintColor: Colors.primary,
          headerShadowVisible: false,
          contentStyle: {
            borderTopColor: "#c7f0ff",
            borderTopWidth: 1.6,
          },
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
};

export default NotificationsNavigator;
