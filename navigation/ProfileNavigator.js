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

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      // ...TransitionPresets.SlideFromRightIOS,
    }}
  >
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen
      name="ViewProfile"
      component={ViewProfileScreen}
      options={{
        //   headerShadowVisible: false,
        // headerShown: false,
        // headerStyle: { backgroundColor: "#FDFDFD" },
        // headerRight: () => rightshareHeader(),
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
        // headerRight: () => rightshareHeader(),
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
        // headerRight: () => rightshareHeader(),
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
  </Stack.Navigator>
);

export default ProfileNavigator;
