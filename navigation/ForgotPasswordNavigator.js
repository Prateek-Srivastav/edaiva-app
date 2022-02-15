import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TransitionPresets } from "@react-navigation/stack";

import MainScreen from "../screens/ForgotPasswordScreens/MainScreen.js";
import ResetMethodScreen from "../screens/ForgotPasswordScreens/ResetMethodScreen";
import VerificationCodeScreen from "../screens/VerificationCodeScreen";
import NewPasswordScreen from "../screens/ForgotPasswordScreens/NewPasswordScreen";
import PasswordUpdatedScreen from "../screens/ForgotPasswordScreens/PasswordUpdatedScreen";

const Stack = createNativeStackNavigator();

function ForgotPasswordNavigator(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        // headerLeft: () => leftHeader(),
        headerTitle: () => null,
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ForgotPassword"
        component={MainScreen}
        options={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#FDFDFD" },
          // headerRight: () => rightLoginHeader(),
        }}
      />
      <Stack.Screen
        name="PasswordResetMethod"
        component={ResetMethodScreen}
        options={
          {
            // headerRight: () => rightLoginHeader(),
          }
        }
      />
      <Stack.Screen
        name="VerificationCode"
        component={VerificationCodeScreen}
        options={
          {
            // headerRight: () => rightRegisterHeader(),
          }
        }
      />
      <Stack.Screen
        name="NewPassword"
        component={NewPasswordScreen}
        options={
          {
            // headerRight: () => rightRegisterHeader(),
          }
        }
      />
      <Stack.Screen
        name="PasswordUpdated"
        component={PasswordUpdatedScreen}
        options={
          {
            // headerRight: () => rightRegisterHeader(),
          }
        }
      />
    </Stack.Navigator>
  );
}

export default ForgotPasswordNavigator;
