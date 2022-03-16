import React from "react";
import { View, StyleSheet, Text } from "react-native";
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
    <View style={styles.container}>
      {facebook !== "" && (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              marginTop: 10,
            }}
          >
            <NormalText>Facebook: </NormalText>
            <AppText
              onPress={() => WebBrowser.openBrowserAsync(facebook)}
              style={{ color: Colors.primary }}
            >
              {facebook}
            </AppText>
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
              marginTop: 10,
            }}
          >
            <NormalText>Github: </NormalText>
            <AppText
              onPress={() => WebBrowser.openBrowserAsync(github)}
              style={{ color: Colors.primary }}
            >
              {github}
            </AppText>
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
              marginTop: 10,
            }}
          >
            <NormalText>LinkedIn: </NormalText>
            <AppText
              onPress={() => WebBrowser.openBrowserAsync(linkedin)}
              style={{ color: Colors.primary }}
            >
              {linkedin}
            </AppText>
          </View>
          <View style={styles.line} />
        </>
      )}
      {instagram !== "" && (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              marginTop: 10,
            }}
          >
            <NormalText>Instagram: </NormalText>
            <AppText
              onPress={() => WebBrowser.openBrowserAsync(instagram)}
              style={{ color: Colors.primary }}
            >
              {instagram}
            </AppText>
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
              marginTop: 10,
            }}
          >
            <NormalText>Twitter: </NormalText>
            <AppText
              onPress={() => WebBrowser.openBrowserAsync(twitter)}
              style={{ color: Colors.primary }}
            >
              {twitter}
            </AppText>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    // height: 27,
    // alignSelf: "center",
    width: "95%",
    height: 1.6,
    borderRadius: 10,
    // marginHorizontal: 5,
    alignSelf: "center",
    backgroundColor: Colors.grey,
    elevation: 1,
    marginTop: 10,
    marginBottom: 10,
    opacity: 0.1,
  },
  normalText: {
    fontFamily: "OpenSans-Medium",
    fontSize: 16,
    // marginTop: 10,
    color: Colors.grey,
  },
});

export default SocialLinkDetails;
