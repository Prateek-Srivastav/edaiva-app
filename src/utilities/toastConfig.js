import { View, StyleSheet } from "react-native";
import { EvilIcons, Feather, Ionicons } from "@expo/vector-icons";

import AppText from "../components/AppText";
import Colors from "../constants/Colors";

export default toastConfig = {
  appInfo: ({ text1 }) => (
    <View style={{ ...styles.toastContainer, backgroundColor: "#28B1E6" }}>
      <Feather name="info" size={24} color={Colors.black} />
      <View style={{ marginStart: 15 }}>
        <AppText style={styles.toastTitle}>Info</AppText>
        <AppText style={styles.toastDetail}>{text1}</AppText>
      </View>
    </View>
  ),
  appSuccess: ({ text1 }) => (
    <View style={{ ...styles.toastContainer, backgroundColor: "#89FFA2" }}>
      <EvilIcons name="check" size={28} color={Colors.black} />
      <View style={{ marginStart: 15 }}>
        <AppText style={styles.toastTitle}>Success</AppText>
        <AppText style={styles.toastDetail}>{text1}</AppText>
      </View>
    </View>
  ),
  appWarning: ({ text1 }) => (
    <View style={{ ...styles.toastContainer, backgroundColor: "#FBF89C" }}>
      <Ionicons name="ios-warning-outline" size={24} color={Colors.black} />
      <View style={{ marginStart: 15 }}>
        <AppText style={styles.toastTitle}>Warning</AppText>
        <AppText style={styles.toastDetail}>{text1}</AppText>
      </View>
    </View>
  ),
  appError: ({ text1 }) => (
    <View style={{ ...styles.toastContainer, backgroundColor: "#FF8080" }}>
      <Feather name="x-circle" size={24} color={Colors.black} />
      <View style={{ marginStart: 15 }}>
        <AppText style={styles.toastTitle}>Error</AppText>
        <AppText style={styles.toastDetail}>{text1}</AppText>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: "row",
    height: 60,
    width: "90%",

    marginBottom: 20,
    borderRadius: 3,
    alignItems: "center",
    paddingHorizontal: 20,
    elevation: 5,
  },
  toastDetail: {
    color: Colors.black,
    fontFamily: "OpenSans-Medium",
  },
  toastTitle: {
    color: Colors.black,
    fontFamily: "OpenSans-SemiBold",
    fontSize: 16,
  },
});
