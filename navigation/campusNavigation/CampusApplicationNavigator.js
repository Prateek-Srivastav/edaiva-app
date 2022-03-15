import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Colors from "../../constants/Colors";
import ApplicationStatusIndicator from "../../components/application/ApplicationStatusIndicator";
import CampusApplicationsScreen from "../../screens/campusScreens/CampusApplicationsScreen";
import CampusApplicationStatusScreen from "../../screens/campusScreens/CampusApplicationStatusScreen";
import CampusSelectionScreen from "../../screens/campusScreens/CampusSelectionScreen";

const Stack = createNativeStackNavigator();

function CampusApplicationNavigator() {
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
      <Stack.Screen
        name="CampusApplications"
        component={CampusApplicationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="CampusSelection" component={CampusSelectionScreen} />
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
}

export default CampusApplicationNavigator;
