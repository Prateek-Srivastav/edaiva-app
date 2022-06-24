import React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import Colors from "../../constants/Colors";
import Skeleton from "./Skeleton";

const JobCardSkeleton = ({ skeWidth }) => {
  return (
    <View
      style={{
        ...styles.card,
        height: 120,
        marginVertical: 8,
        padding: 15,
        width: "98%",
        alignSelf: "center",
      }}
    >
      <Skeleton
        height={15}
        width={58}
        style={{ borderRadius: 8, marginTop: 0 }}
      />
      <Skeleton height={15} width={150} style={{ borderRadius: 8 }} />
      <Skeleton height={12} width={skeWidth - 70} style={{ borderRadius: 8 }} />
      <Skeleton height={10} width={100} style={{ borderRadius: 8 }} />
    </View>
  );
};

const HomeScreenSkeleton = () => {
  const cardWidth = Dimensions.get("window").width;
  const skeWidth = cardWidth;

  return (
    <View style={styles.container}>
      <View
        style={{
          marginBottom: 10,
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: cardWidth - 30,
        }}
      >
        <Skeleton height={10} width={75} style={{ borderRadius: 8 }} />
        <Skeleton height={10} width={60} style={{ borderRadius: 8 }} />
      </View>
      <ScrollView style={{ width: cardWidth, paddingHorizontal: 15 }}>
        <JobCardSkeleton skeWidth={skeWidth} />
        <JobCardSkeleton skeWidth={skeWidth} />
        <JobCardSkeleton skeWidth={skeWidth} />
        <JobCardSkeleton skeWidth={skeWidth} />
        <JobCardSkeleton skeWidth={skeWidth} />
        <JobCardSkeleton skeWidth={skeWidth} />
        <JobCardSkeleton skeWidth={skeWidth} />
        <JobCardSkeleton skeWidth={skeWidth} />
        <JobCardSkeleton skeWidth={skeWidth} />
        <JobCardSkeleton skeWidth={skeWidth} />
        <JobCardSkeleton skeWidth={skeWidth} />
        <JobCardSkeleton skeWidth={skeWidth} />
        <JobCardSkeleton skeWidth={skeWidth} />
        <JobCardSkeleton skeWidth={skeWidth} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    justifyContent: "center",
    backgroundColor: "#fff",
    height: 35,
    elevation: 5,
    borderRadius: 5,
  },
});

export default HomeScreenSkeleton;
