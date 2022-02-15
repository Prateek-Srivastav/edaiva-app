import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import AppText from "../components/AppText";
import Colors from "../constants/Colors";
import CustomAlert from "../components/CustomAlert";

function PasswordUpdatedAlert({ visible }) {
  return (
    <CustomAlert visible={visible}>
      <View
        style={{
          height: 80,
          width: 80,
          borderRadius: 40,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.primary,
          alignSelf: "center",
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
      <AppText
        style={{ color: Colors.black, marginTop: 10, textAlign: "center" }}
      >
        You're good to go!
      </AppText>
    </CustomAlert>
  );
}

const styles = StyleSheet.create({
  boldText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 40,
    color: Colors.black,
    textAlign: "center",
    marginTop: 20,
  },
});

export default PasswordUpdatedAlert;
