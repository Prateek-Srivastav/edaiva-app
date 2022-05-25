import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";

import Colors from "../constants/Colors";
import { BuildingIcon, Location } from "../assets/svg/icons";

function JobCard(props) {
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
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <View style={styles.lightBackground}>
          <Text style={{ ...styles.text, color: Colors.primary }}>
            {props.jobType}
          </Text>
        </View>
        {props.isApplied.length !== 0 && <View style={styles.line} />}
        {props.isApplied.length !== 0 && (
          <View style={styles.lightBackground}>
            <Octicons
              name="check"
              size={15}
              color={Colors.primary}
              style={{ marginRight: 5 }}
            />
            <Text style={{ ...styles.text, color: Colors.primary }}>
              Applied
            </Text>
          </View>
        )}
        {props.postedDate !== "" && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <MaterialCommunityIcons
              name={"timer-sand"}
              size={13}
              color="#888"
            />
            <Text
              style={{
                fontFamily: "OpenSans-Regular",
                color: "#888",
                fontSize: 11.5,
                marginStart: 2,
              }}
            >
              {props.postedDate > 0 ? props.postedDate + " days" : "Expired"}
            </Text>
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.heading}>{props.heading}</Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 7,
        }}
      >
        <BuildingIcon />
        <Text style={{ ...styles.text, marginStart: 3 }}>
          {props.companyName}
        </Text>
      </View>
      {props.location && (
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Location />
          <Text style={{ ...styles.text, marginStart: 3 }}>
            {props.location}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    padding: 15,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    elevation: 5,
  },

  heading: {
    fontFamily: "OpenSans-Regular",
    fontSize: 17,
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
    fontFamily: "OpenSans-Regular",
    color: "#202020",
    fontSize: 13,
  },
});

export default JobCard;
