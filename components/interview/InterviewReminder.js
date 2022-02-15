import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";

import Colors from "../../constants/Colors";
import formattedTime from "../../utilities/time";
import { useNavigation } from "@react-navigation/native";

function InterviewReminder({ interviewDetails }) {
  const navigation = useNavigation();
  const { city, state, country } = interviewDetails.job[0].job_location[0];

  const location = `${city}, ${state}, ${country}`;
  return (
    <TouchableOpacity
      style={styles.reminderContainer}
      onPress={() =>
        navigation.navigate("ApplicationStatus", {
          jobId: interviewDetails.application[0].job.$oid,
          location: location,
          applicationStatus: interviewDetails.application[0].status,
          applicationId: interviewDetails.application[0]._id.$oid,
        })
      }
    >
      <Image
        source={require("../../assets/bell.png")}
        resizeMode="contain"
        style={{ height: 30, width: 30 }}
      />
      <View style={{ flex: 1, marginHorizontal: 10 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "OpenSans-SemiBold",
            color: Colors.primary,
          }}
        >
          Interview Reminder
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontFamily: "OpenSans-Regular",
            color: "#6C6C6C",
          }}
        >
          You have an interview schedule today at{" "}
          {formattedTime(interviewDetails.scheduled_from)}
        </Text>
      </View>
      <AntDesign name="rightsquare" size={35} color={Colors.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E7F9FF",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 3,
    marginBottom: 10,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default InterviewReminder;
