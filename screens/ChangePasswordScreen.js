import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Key } from "../assets/svg/icons";

import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import AppText from "../components/AppText";
import Colors from "../constants/Colors";
import * as Yup from "yup";
import PasswordUpdatedAlert from "./PasswordUpdatedAlert";
import CustomHeader from "../components/CustomHeader";
import userApi from "../api/user";
import useApi from "../hooks/useApi";
import Toast from "react-native-toast-message";

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required().min(5).label("Old Password"),
  newPassword: Yup.string()
    .required()
    .matches(
      /^[A-Z](?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/,
      "Password must contain an uppercase letter, an lowercase letter, a number, and a special character."
    )
    .label("New Password"),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("newPassword")], "Password must be same.")
    .label("Confirm Password"),
});

function ChangePasswordScreen({ navigation }) {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (val) => {
    setLoading(true);
    const result = await userApi.changePassword(val);
    if (!result.ok) {
      setLoading(false);
      console.log(result);

      return Toast.show({
        type: "appError",
        text1: result.data.detail,
      });
    }
    setLoading(false);

    console.log(data);

    setVisible(true);
    setTimeout(() => setVisible(false), 2000);
  };

  return (
    <>
      <CustomHeader navigation={navigation} backScreen="Profile" />
      <ScrollView
        contentContainerStyle={{ paddingTop: 50 }}
        style={styles.container}
      >
        <View style={{ marginStart: 30, marginBottom: 20 }}>
          <Key />
        </View>
        <Text style={styles.boldText}>CHANGE{"\n"}PASSWORD</Text>
        <AppText
          style={{ color: Colors.black, marginTop: 15, marginBottom: 40 }}
        >
          Set a New Passsword.
        </AppText>
        <AppForm
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <AppFormField
            placeholder="Old Password"
            name="oldPassword"
            icon={isPasswordShown ? "ios-eye-off" : "ios-eye"}
            keyboardType="default"
            secureTextEntry={!isPasswordShown}
            autoCapitalize="none"
            onIconPress={() => setIsPasswordShown(!isPasswordShown)}
          />
          <AppFormField
            placeholder="New Password"
            name="newPassword"
            icon={isPasswordShown ? "ios-eye-off" : "ios-eye"}
            keyboardType="default"
            secureTextEntry={!isPasswordShown}
            autoCapitalize="none"
            onIconPress={() => setIsPasswordShown(!isPasswordShown)}
          />
          <AppFormField
            placeholder="Confirm Password"
            name="confirmPassword"
            icon={isPasswordShown ? "ios-eye-off" : "ios-eye"}
            keyboardType="default"
            secureTextEntry={!isPasswordShown}
            autoCapitalize="none"
            onIconPress={() => setIsPasswordShown(!isPasswordShown)}
          />

          <SubmitButton
            disabled={loading}
            title={loading ? "Loading..." : "Change Password"}
          />
        </AppForm>
      </ScrollView>
      <PasswordUpdatedAlert visible={visible} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: 15,
  },
  boldText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 45,
    color: Colors.black,
  },
});

export default ChangePasswordScreen;
