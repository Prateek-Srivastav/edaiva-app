import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TransitionPresets } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import EditProfileDetailScreen from "../screens/EditProfileScreens/EditProfileDetailScreen";
import Colors from "../constants/Colors";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreens/EditProfileScreen";
import ViewProfileScreen from "../screens/ViewProfileScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import CampusEditProfileScreen from "../screens/campusScreens/CampusEditProfileScreen";
import InterviewsListingScreen from "../screens/InterviewsListingScreen";
import ApplicationStatusScreen from "../screens/ApplicationStatusScreen";
import ApplicationStatusIndicator from "../components/application/ApplicationStatusIndicator";
import ApplicationsScreen from "../screens/ApplicationsScreen";

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      // animation: "slide_from_right",
      // ...TransitionPresets.SlideFromRightIOS,
    }}
  >
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen
      name="Applications"
      component={ApplicationsScreen}
      options={{
        title: "Applications",
        headerShown: true,
        headerTitleStyle: {
          fontFamily: "OpenSans-SemiBold",
          color: Colors.primary,
          fontSize: 20,
        },

        headerTintColor: Colors.primary,
      }}
    />
    <Stack.Screen
      name="ViewProfile"
      component={ViewProfileScreen}
      options={{
        headerTitle: () => (
          <Text
            style={{
              fontFamily: "OpenSans-SemiBold",
              color: Colors.primary,
              fontSize: 20,
            }}
          >
            View Profile
          </Text>
        ),
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        headerTitle: () => (
          <Text
            style={{
              fontFamily: "OpenSans-SemiBold",
              color: Colors.primary,
              fontSize: 20,
            }}
          >
            Edit Profile
          </Text>
        ),
      }}
    />
    <Stack.Screen
      name="CampusEditProfile"
      component={CampusEditProfileScreen}
      options={{
        headerTitle: () => (
          <Text
            style={{
              fontFamily: "OpenSans-SemiBold",
              color: Colors.primary,
              fontSize: 20,
            }}
          >
            Edit Profile
          </Text>
        ),
      }}
    />
    <Stack.Screen
      name="EditProfileDetail"
      component={EditProfileDetailScreen}
      options={{
        headerTitle: () => (
          <Text
            style={{
              fontFamily: "OpenSans-SemiBold",
              color: Colors.primary,
              fontSize: 20,
            }}
          >
            Edit Profile Details
          </Text>
        ),
      }}
    />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <Stack.Screen
      name="InterviewsListing"
      component={InterviewsListingScreen}
    />
    <Stack.Screen
      name="ApplicationStatus"
      component={ApplicationStatusScreen}
      options={({ route }) => ({
        title: "",
        headerShown: true,
        headerTitleStyle: {
          fontFamily: "OpenSans-SemiBold",
          color: Colors.primary,
          fontSize: 20,
        },
        headerTintColor: Colors.primary,
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

export default ProfileNavigator;
