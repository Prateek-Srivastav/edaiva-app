import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TransitionPresets } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import JobDetailScreen from "../screens/JobDetailScreen";

import Colors from "../constants/Colors";
import WishlistScreen from "../screens/WishlistScreen";

const Stack = createNativeStackNavigator();

const leftHeader = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
      }}
    >
      {navigation.canGoBack() && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back-outline"
            size={25}
            color={Colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const WishlistNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerLeft: () => leftHeader(),
      // headerTitle: () => null,
      ...TransitionPresets.SlideFromRightIOS,
    }}
  >
    <Stack.Screen
      name="Wishlist"
      component={WishlistScreen}
      options={{
        headerTitleStyle: {
          fontFamily: "OpenSans-SemiBold",
          color: Colors.primary,
          fontSize: 20,
        },
      }}
    />
    <Stack.Screen
      name="JobDetail"
      component={JobDetailScreen}
      options={{
        headerShown: false,
        // headerRight: () => rightLoginHeader(),
        headerTitle: () => null,
      }}
    />
  </Stack.Navigator>
);

export default WishlistNavigator;
