import React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const CarouselItem = ({ item }) => {
  return <Image resizeMode="center" style={styles.image} source={item.img} />;
};

const styles = StyleSheet.create({
  image: {
    width: width,
    height: width,
  },
});

export default CarouselItem;
