import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ApplicationsScreen from "../screens/ApplicationsScreen";
import ApplicationStatusScreen from "../screens/ApplicationStatusScreen";
import Colors from "../constants/Colors";
import ApplicationStatusIndicator from "../components/application/ApplicationStatusIndicator";

const Stack = createNativeStackNavigator();

function ApplicationNavigator() {
  // console.log(route);
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "OpenSans-SemiBold",
          color: Colors.primary,
          fontSize: 20,
        },
        headerTintColor: Colors.primary,
      }}
    >
      <Stack.Screen name="Applications" component={ApplicationsScreen} />
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
}

export default ApplicationNavigator;
