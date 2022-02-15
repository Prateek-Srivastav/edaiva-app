import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Email, Phone } from "../../assets/svg/icons";

import AppText from "../../components/AppText";
import Colors from "../../constants/Colors";

function ResetMethodScreen({ route, navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.boldText}>MAKE{"\n"}SELECTION</Text>
      <AppText style={{ color: Colors.black, marginTop: 15, marginBottom: 40 }}>
        Select which contact detail should we use to reset your password?
      </AppText>
      <TouchableOpacity
        onPress={() => navigation.navigate("VerificationCode")}
        activeOpacity={0.4}
        style={styles.lightBox}
      >
        <Phone />
        <View style={{ marginStart: 25 }}>
          <AppText>via sms :</AppText>
          <Text style={styles.text}>+91 999 999 9999</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("VerificationCode")}
        activeOpacity={0.4}
        style={{ ...styles.lightBox, paddingStart: 15 }}
      >
        <Email />
        <View style={{ marginStart: 25 }}>
          <AppText>via mail :</AppText>
          <Text style={styles.text}>{route.params.email}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  boldText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 45,
    color: Colors.black,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: Colors.bg,
    // justifyContent: "center",
    paddingVertical: 50,
  },
  lightBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.cardBlue,
    marginVertical: 10,
    padding: 30,
  },
  text: {
    fontSize: 15,
    fontFamily: "OpenSans-Medium",
    color: Colors.black,
  },
});

export default ResetMethodScreen;
