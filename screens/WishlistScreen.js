import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import dummyData from "../dummyData.js/data";
import Colors from "../constants/Colors";
import cache from "../utilities/cache";

const WishlistItemCard = (props) => (
  <TouchableOpacity
    onPress={props.onPress}
    activeOpacity={0.5}
    style={styles.wishlistItemContainer}
  >
    <View style={{ flex: 1 }}>
      <Text style={styles.heading}>{props.heading}</Text>
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
      <Text style={styles.text}>{props.companyName}</Text>
    </View>
  </TouchableOpacity>
);

function WishlistScreen({ navigation }) {
  const [wishlist, setWishlist] = useState();

  const wishlistStatus = async () => {
    const wl = await cache.get("wishlist");

    return setWishlist(wl);
  };
  wishlistStatus();
  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 10 }}
        data={wishlist}
        keyExtractor={(item, index) => item.id}
        renderItem={(itemData) => (
          <WishlistItemCard
            onPress={() =>
              navigation.navigate("JobDetail", {
                jobId: itemData.item.id,
                // isApplied: itemData.item.applied.length !== 0,
                // location,
              })
            }
            heading={itemData.item.title}
            companyName={itemData.item.company}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  heading: {
    fontFamily: "OpenSans-Regular",
    fontSize: 17,
  },
  text: {
    fontFamily: "OpenSans-Regular",
    color: "#202020",
    fontSize: 13,
  },
  wishlistItemContainer: {
    marginVertical: 7,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    elevation: 5,
  },
});

export default WishlistScreen;
