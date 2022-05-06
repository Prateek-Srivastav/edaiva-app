import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TransitionPresets } from "@react-navigation/stack";

import Colors from "../../constants/Colors";
import ApplicationStatusIndicator from "../../components/application/ApplicationStatusIndicator";
import CampusNotificationsScreen from "../../screens/campusScreens/CampusNotificationsScreen";
import CampusApplicationStatusScreen from "../../screens/campusScreens/CampusApplicationStatusScreen";

const Stack = createNativeStackNavigator();

const CampusNotificationsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen
        name="Notifications"
        component={CampusNotificationsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CampusApplicationStatus"
        component={CampusApplicationStatusScreen}
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

export default CampusNotificationsNavigator;
