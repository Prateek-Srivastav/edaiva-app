import React from "react";
import { View, Image, Share, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TransitionPresets } from "@react-navigation/stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import HomeScreen from "../../screens/HomeScreen";
import JobDetailScreen from "../../screens/JobDetailScreen";

import Colors from "../../constants/Colors";
import { jobClient } from "../../api/client";
import ApplicationStatusIndicator from "../../components/application/ApplicationStatusIndicator";
import ApplicationStatusScreen from "../../screens/ApplicationStatusScreen";
import CampusJobsScreen from "../../screens/campusScreens/CampusJobsScreen";

const Stack = createNativeStackNavigator();

const rightShareHeader = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const jobId = navigation.getState().routes[1].state.routes[1].params.jobId;

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `${jobClient.getBaseURL()}/jobs/${jobId}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <TouchableOpacity style={{ marginRight: 5 }} onPress={onShare}>
      <AntDesign name="sharealt" size={23} color={Colors.primary} />
    </TouchableOpacity>
  );
};

const CampusJobsNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      ...TransitionPresets.SlideFromRightIOS,
    }}
  >
    <Stack.Screen
      name="CampusHome"
      component={CampusJobsScreen}
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
      options={{
        headerRight: () => rightShareHeader(),
      }}
    />
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

export default CampusJobsNavigator;
