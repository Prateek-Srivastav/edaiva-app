import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Colors from "../../constants/Colors";
import Card from "../Card";
import Skeleton from "./Skeleton";

const width = Dimensions.get("window").width;

const ProfileScreenSkeleton = () => {
  return (
    <View style={styles.container}>
      <Skeleton
        width={100}
        height={100}
        style={{ marginBottom: 5, borderRadius: 4, marginTop: 0 }}
      />
      <Skeleton height={15} width={230} style={{ borderRadius: 8 }} />
      <Skeleton height={12} width={155} style={{ borderRadius: 8 }} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 30,
          marginBottom: 15,
        }}
      >
        <Card
          style={{
            flexDirection: "column",
            alignItems: "center",
            width: "45%",
            paddingHorizontal: 0,
            paddingVertical: 15,
          }}
        >
          <Skeleton
            height={28}
            width={15}
            style={{ borderRadius: 4, marginTop: 0 }}
          />
          <Skeleton
            height={15}
            width={width / 3.5}
            style={{ borderRadius: 4 }}
          />
        </Card>
        <Card
          style={{
            flexDirection: "column",
            alignItems: "center",
            width: "45%",
            paddingHorizontal: 0,
            paddingVertical: 14,
          }}
        >
          <Skeleton
            height={28}
            width={15}
            style={{ borderRadius: 4, marginTop: 0 }}
          />
          <Skeleton
            height={15}
            width={width / 3.5}
            style={{ borderRadius: 4 }}
          />
        </Card>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          // marginTop: 30,
          marginBottom: 15,
        }}
      >
        <Card
          style={{
            flexDirection: "column",
            alignItems: "center",
            width: "45%",
            paddingHorizontal: 0,
            paddingVertical: 14,
          }}
        >
          <Skeleton
            height={15}
            width={width / 3.5}
            style={{ borderRadius: 4, marginTop: 0 }}
          />
        </Card>
        <Card
          style={{
            flexDirection: "column",
            alignItems: "center",
            width: "45%",
            paddingHorizontal: 0,
            paddingVertical: 14,
          }}
        >
          <Skeleton
            height={15}
            width={width / 3.5}
            style={{ borderRadius: 4, marginTop: 0 }}
          />
        </Card>
      </View>
      <Card
        style={{
          flexDirection: "column",
          alignItems: "center",
          width: "98%",
          paddingHorizontal: 0,
          paddingVertical: 14,
        }}
      >
        <Skeleton
          height={15}
          width={160}
          style={{ borderRadius: 4, marginTop: 0 }}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    flex: 1,
    // paddingBottom: 15,
    // justifyContent: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
});

export default ProfileScreenSkeleton;
