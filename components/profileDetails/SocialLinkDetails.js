import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";

import AppText from "../AppText";
import Colors from "../../constants/Colors";

const NormalText = (props) => (
  <Text style={styles.normalText}>{props.children}</Text>
);

function SocialLinkDetails({ sociallinks }) {
  if (!sociallinks) return null;
  let { facebook, github, instagram, linkedin, twitter } = sociallinks;

  return (
    <View style={{ marginTop: 10 }}>
      {facebook !== "" && (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <NormalText>Facebook: </NormalText>
            <TouchableOpacity
              onPress={() => WebBrowser.openBrowserAsync(facebook)}
            >
              <AppText style={{ color: Colors.primary }}>{facebook}</AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.line} />
        </>
      )}
      {github !== "" && (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <NormalText>Github: </NormalText>
            <TouchableOpacity
              onPress={() => WebBrowser.openBrowserAsync(github)}
            >
              <AppText style={{ color: Colors.primary }}>{github}</AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.line} />
        </>
      )}
      {linkedin !== "" && (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <NormalText>LinkedIn: </NormalText>
            <TouchableOpacity
              onPress={() => WebBrowser.openBrowserAsync(linkedin)}
            >
              <AppText style={{ color: Colors.primary }}>{linkedin}</AppText>
            </TouchableOpacity>
          </View>
          {instagram !== "" && twitter !== "" && <View style={styles.line} />}
        </>
      )}
      {instagram !== "" && (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <NormalText>Instagram: </NormalText>
            <TouchableOpacity
              onPress={() => WebBrowser.openBrowserAsync(instagram)}
            >
              <AppText style={{ color: Colors.primary }}>{instagram}</AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.line} />
        </>
      )}
      {twitter !== "" && (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <NormalText>Twitter: </NormalText>
            <TouchableOpacity
              onPress={() => WebBrowser.openBrowserAsync(twitter)}
            >
              <AppText style={{ color: Colors.primary }}>{twitter}</AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.line} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    width: "95%",
    height: 1.6,
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: Colors.grey,
    elevation: 1,
    marginVertical: 10,
    opacity: 0.1,
  },
  normalText: {
    fontFamily: "OpenSans-Medium",
    fontSize: 16,
    color: Colors.grey,
    marginStart: 7,
  },
});

export default SocialLinkDetails;
