import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Key } from "../../assets/svg/icons";

import AppText from "../../components/AppText";
import Colors from "../../constants/Colors";
import CustomButton from "../../components/CustomButton";
import Input from "../../components/Input";

function NewPasswordScreen({ navigation }) {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [buttonDisabled, setbuttonDisabled] = useState(true);
  const [password, setPassword] = useState();

  const inputPswrdHandler = useCallback((inputValue, inputValidity) => {
    setbuttonDisabled(!inputValidity);
    setPassword(inputValue);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: 50 }}
      style={styles.container}
    >
      <View style={{ marginStart: 30, marginBottom: 20 }}>
        <Key />
      </View>
      <Text style={styles.boldText}>NEW{"\n"}CREDENTIALS</Text>
      <AppText style={{ color: Colors.black, marginTop: 15, marginBottom: 40 }}>
        Set a New Passsword.
      </AppText>
      <Input
        id="newPassword"
        placeholder="New Password"
        icon={isPasswordShown ? "ios-eye-off" : "ios-eye"}
        onIconPress={() => setIsPasswordShown(!isPasswordShown)}
        keyboardType="default"
        secureTextEntry={!isPasswordShown}
        required
        minLength={5}
        autoCapitalize="none"
        errorText="Please enter a valid password."
        onInputChange={inputPswrdHandler}
      />
      <Input
        id="confirmPassword"
        placeholder="Confirm Password"
        icon={isPasswordShown ? "ios-eye-off" : "ios-eye"}
        onIconPress={() => setIsPasswordShown(!isPasswordShown)}
        keyboardType="default"
        secureTextEntry={!isPasswordShown}
        required
        minLength={5}
        autoCapitalize="none"
        errorText="Please enter a valid password."
        onInputChange={inputPswrdHandler}
      />
      <CustomButton
        title="Next"
        style={{
          marginTop: 15,
          backgroundColor: buttonDisabled ? "#ccc" : Colors.primary,
        }}
        onPress={() => navigation.navigate("PasswordUpdated")}
        disabled={buttonDisabled}
      />
    </ScrollView>
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

export default NewPasswordScreen;
