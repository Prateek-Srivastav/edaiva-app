import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";

function ApplicationStatusIndicator({ applicationStatus }) {
  let bgColor;
  let primaryColor;
  let text;

  if (applicationStatus === "interviewing") {
    bgColor = "rgba(233, 126, 0, 0.15)";
    primaryColor = "#E97E00";
    text = "Interviewing";
  } else if (
    applicationStatus === "applied" ||
    applicationStatus === "not-interested"
  ) {
    bgColor = "#CBF1FF4D";
    primaryColor = Colors.primary;
    text = "Applied";
  } else if (applicationStatus === "hired") {
    bgColor = "#BEFFA74D";
    primaryColor = "#2D811F";
    text = "Hired";
  } else if (applicationStatus === "rejected") {
    bgColor = "rgba(241, 18, 18, 0.15)";
    primaryColor = "#F11212";
    text = "Rejected";
  } else if (applicationStatus === "finalist") {
    bgColor = "#BEFFA74D";
    primaryColor = "#2D811F";
    text = "Finalist";
  } else if (applicationStatus === "in review") {
    bgColor = "#FDFF9870";
    primaryColor = "#AEB11C";
    text = "In Review";
  } else if (applicationStatus === "shortlisted") {
    bgColor = "#CBF1FF4D";
    primaryColor = Colors.primary;
    text = "Shortlisted";
  }

  if (!applicationStatus) return null;

  return (
    <View
      style={{
        ...styles.lightBackground,
        backgroundColor: bgColor,
        borderColor: primaryColor,
      }}
    >
      {applicationStatus === "rejected" ? (
        <Entypo name="cross" size={22} color={primaryColor} />
      ) : (
        <MaterialCommunityIcons
          name="lightning-bolt"
          size={18}
          color={primaryColor}
        />
      )}

      <Text style={{ ...styles.text, color: primaryColor }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lightBackground: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // width: 80,
    padding: 5,
    paddingRight: 8,
    borderRadius: 3,
    borderWidth: 0.8,
  },

  text: {
    fontFamily: "OpenSans-Medium",
    color: "#202020",
    fontSize: 14.5,
  },
});

export default ApplicationStatusIndicator;
