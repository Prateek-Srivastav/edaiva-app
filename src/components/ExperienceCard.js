import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableNativeFeedback,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

import { Feather } from "@expo/vector-icons";

import Colors from "../constants/Colors";
import AppText from "./AppText";

function ExperienceCard(props) {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.5}
      style={{ ...styles.container, ...props.style }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <AppText style={styles.heading}>{props.heading}</AppText>
        <TouchableNativeFeedback
          style={{
            padding: 5,
            borderRadius: 15,
            overflow: "hidden",
            backgroundColor: "white",
            borderWidth: 1,
            height: 30,
            width: 30,
          }}
        >
          <View
            style={{
              padding: 5,
              borderRadius: 15,
              overflow: "hidden",
              backgroundColor: "white",
              borderWidth: 1,
              height: 30,
              width: 30,
            }}
          >
            <Feather name="edit-3" size={16} color={Colors.primary} />
          </View>
        </TouchableNativeFeedback>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 7,
          paddingStart: 3,
        }}
      >
        <FontAwesome
          name="building"
          size={15}
          color="#8C8C8C"
          style={{
            marginLeft: -1.6,
            marginRight: 5,
          }}
        />
        <AppText style={styles.text}>{props.companyName}</AppText>
      </View>
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <MaterialIcons name="access-time" size={17} color="#817E7E" />
        <AppText style={styles.text}>{props.location}</AppText>
      </View>
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <AppText style={{ textAlign: "justify" }}>
          {props.responsibility}
        </AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    padding: 15,
    // width: "100%",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    elevation: 5,
  },

  heading: {
    fontFamily: "OpenSans-Regular",
    fontSize: 17,
    marginRight: 15,
  },
  lightBackground: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CBF1FF4D",
    padding: 4,
    paddingHorizontal: 7,
    borderRadius: 3,
  },
  line: {
    height: 27,
    width: 1.2,
    borderRadius: 10,
    marginHorizontal: 13,
    backgroundColor: "#D4D4D4",
  },
  text: {
    fontSize: 13,
    marginRight: 15,
  },
});

export default ExperienceCard;
