import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Colors from "../../constants/Colors";
import Skeleton from "./Skeleton";

const width = Dimensions.get("window").width - 45;

const JobDetailScreenSkeleton = () => {
  return (
    <View style={styles.container}>
      <View>
        <View
          style={{
            ...styles.card,
            width: width + 45,
            padding: 15,
            marginStart: 0,
          }}
        >
          <Skeleton height={25} width={175} style={{ borderRadius: 8 }} />
          <Skeleton height={15} width={300} style={{ borderRadius: 8 }} />
          <Skeleton height={15} width={140} style={{ borderRadius: 8 }} />
          <View
            style={{
              ...styles.card,
              justifyContent: "center",
              height: 40,
              marginTop: 20,
              padding: 15,
              width: 100,
              alignSelf: "center",
            }}
          >
            <Skeleton
              height={15}
              width={70}
              style={{ borderRadius: 8, marginTop: 0 }}
            />
          </View>
          <View
            style={{
              ...styles.card,
              height: 190,
              marginTop: 10,
              paddingHorizontal: 30,
              paddingVertical: 25,
              width: "100%",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Skeleton
                  height={10}
                  width={70}
                  style={{ borderRadius: 8, marginTop: 0 }}
                />
                <Skeleton
                  height={8}
                  width={130}
                  style={{ borderRadius: 8, marginLeft: 5, marginTop: 15 }}
                />
                <Skeleton
                  height={8}
                  width={130}
                  style={{ borderRadius: 8, marginLeft: 5 }}
                />
                <Skeleton
                  height={8}
                  width={130}
                  style={{ borderRadius: 8, marginLeft: 5 }}
                />
              </View>
              <View>
                <Skeleton
                  height={10}
                  width={100}
                  style={{ borderRadius: 8, marginTop: 0 }}
                />
                <Skeleton
                  height={8}
                  width={70}
                  style={{ borderRadius: 8, marginTop: 15, marginLeft: 7 }}
                />
              </View>
            </View>
            <Skeleton
              height={10}
              width={100}
              style={{ borderRadius: 8, marginTop: 20 }}
            />
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                marginTop: 5,
                flexWrap: "wrap",
              }}
            >
              <Skeleton
                height={8}
                width={70}
                style={{ borderRadius: 8, marginLeft: 5 }}
              />
              <Skeleton
                height={8}
                width={70}
                style={{ borderRadius: 8, marginLeft: 5 }}
              />
              <Skeleton
                height={8}
                width={70}
                style={{ borderRadius: 8, marginLeft: 5 }}
              />
              <Skeleton
                height={8}
                width={70}
                style={{ borderRadius: 8, marginLeft: 5 }}
              />
              <Skeleton
                height={8}
                width={70}
                style={{ borderRadius: 8, marginLeft: 5 }}
              />
              <Skeleton
                height={8}
                width={70}
                style={{ borderRadius: 8, marginLeft: 5 }}
              />
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 15 }}>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              marginVertical: 10,
              flexWrap: "wrap",
            }}
          >
            <Skeleton
              height={9}
              width={100}
              style={{ borderRadius: 8, marginLeft: 5 }}
            />
            <Skeleton
              height={9}
              width={90}
              style={{ borderRadius: 8, marginLeft: 5 }}
            />
            <Skeleton
              height={9}
              width={70}
              style={{ borderRadius: 8, marginLeft: 5 }}
            />
          </View>

          <Skeleton
            height={7}
            width={width}
            style={{ borderRadius: 8, marginLeft: 5 }}
          />
          <Skeleton
            height={7}
            width={width}
            style={{ borderRadius: 8, marginLeft: 5 }}
          />
          <Skeleton
            height={7}
            width={width}
            style={{ borderRadius: 8, marginLeft: 5 }}
          />
          <Skeleton
            height={7}
            width={width}
            style={{ borderRadius: 8, marginLeft: 5 }}
          />
          <Skeleton
            height={7}
            width={width}
            style={{ borderRadius: 8, marginLeft: 5 }}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Skeleton
          height={40}
          width={40}
          style={{
            borderRadius: 8,
            marginLeft: 5,
          }}
        />
        <Skeleton
          height={40}
          width={width - 40}
          style={{
            borderRadius: 8,
            marginLeft: 10,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    flex: 1,
    paddingBottom: 15,
    justifyContent: "space-between",
    // paddingHorizontal: 20,
  },
  card: {
    // justifyContent: "center",
    backgroundColor: "#fff",
    elevation: 5,
    borderRadius: 5,
  },
});

export default JobDetailScreenSkeleton;
