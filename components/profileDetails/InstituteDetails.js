import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";

import { Share } from "../../assets/svg/icons";
import Colors from "../../constants/Colors";

const SmallText = (props) => (
  <Text style={{ ...styles.smallText, ...props.style }}>{props.children}</Text>
);

const NormalText = (props) => (
  <Text style={styles.normalText}>{props.children}</Text>
);

const MediumText = (props) => (
  <Text style={styles.mediumText}>{props.children}</Text>
);

function InstituteDetails({ instituteDetails }) {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <NormalText>INSTITUTE</NormalText>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => WebBrowser.openBrowserAsync(instituteDetails.website)}
        >
          <Share color={Colors.primary} width={15} height={15} />
          <NormalText style={{ marginBottom: 0 }}>
            {"  "}View website
          </NormalText>
        </TouchableOpacity>
      </View>
      <View style={{ marginStart: 7 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <MediumText>{instituteDetails.institute_name}</MediumText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SmallText>
                <SmallText style={{ fontFamily: "OpenSans-Medium" }}>
                  Established on:{"  "}
                </SmallText>
                {instituteDetails.established_on}
              </SmallText>
            </View>
          </View>

          <Image
            source={{ uri: instituteDetails.logo }}
            style={{
              height: 45,
              width: 45,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 7,
          }}
        >
          <SmallText>
            <SmallText style={{ fontFamily: "OpenSans-SemiBold" }}>
              About:{"  "}
            </SmallText>
            {instituteDetails.about}
          </SmallText>
          {/* <SmallText>{instituteDetails.about}</SmallText> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },

  smallText: {
    fontFamily: "OpenSans-Regular",
    fontSize: 15,
    color: Colors.grey,
  },
  normalText: {
    fontFamily: "OpenSans-Medium",
    fontSize: 15.5,
    color: Colors.primary,
  },
  mediumText: {
    fontFamily: "OpenSans-Bold",
    fontSize: 16,
    color: Colors.grey,
  },
});

export default InstituteDetails;
