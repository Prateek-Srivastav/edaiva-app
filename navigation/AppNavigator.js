import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import Colors from "../constants/Colors";
import ProfileNavigator from "./ProfileNavigator";
import TabNavigator from "./TabNavigator";
import WishlistScreen from "../screens/WishlistScreen";
import CustomDrawer from "../components/CustomDrawer";
import WishlistNavigator from "./WishlistNavigator";

const Drawer = createDrawerNavigator();

function AppNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Home" component={TabNavigator} />
      <Drawer.Screen name="ProfileStack" component={ProfileNavigator} />
      <Drawer.Screen name="WishlistStack" component={WishlistNavigator} />
    </Drawer.Navigator>
  );
}

export default AppNavigator;
