import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Key } from "../../assets/svg/icons";

import AppText from "../../components/AppText";
import Colors from "../../constants/Colors";
import CustomButton from "../../components/CustomButton";
import Input from "../../components/Input";

function PasswordUpdatedScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View
        style={{
          // marginStart: 30,
          marginBottom: 20,
          // borderWidth: 1,
          height: 100,
          width: 100,
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.primary,
        }}
      >
        <FontAwesome5
          name="check"
          size={40}
          color="black"
          style={{ elevation: 10 }}
        />
      </View>
      <Text style={styles.boldText}>PASSWORD{"\n"}UPDATED</Text>
      <AppText style={{ color: Colors.black, marginTop: 10, marginBottom: 40 }}>
        You're good to go!
      </AppText>

      <CustomButton
        title="Login Now"
        style={{
          marginTop: 40,
          // backgroundColor: Colors.primary,
        }}
        onPress={() => navigation.navigate("Login")}
        // disabled={buttonDisabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: 15,
    paddingTop: 60,
    // justifyContent: "center",
  },
  boldText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 45,
    color: Colors.black,
  },
});

export default PasswordUpdatedScreen;
