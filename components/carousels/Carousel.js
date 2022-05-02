import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";

import Colors from "../../constants/Colors";
import CarouselItem from "./CarouselItem";

const { width, height } = Dimensions.get("window");
let flatList;

function infiniteScroll(dataList) {
  const numberOfData = dataList.length;
  let scrollValue = 0,
    scrolled = 0;

  setInterval(function () {
    scrolled++;
    if (scrolled < numberOfData) scrollValue = scrollValue + width;
    else {
      scrollValue = 0;
      scrolled = 0;
    }
    if (!this.flatList) return;
    this.flatList.scrollToOffset({ animated: true, offset: scrollValue });
  }, 3000);
}

const Carousel = ({ data }) => {
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, width);
  const [dataList, setDataList] = useState(data);

  useEffect(() => {
    setDataList(data);
    infiniteScroll(dataList);
  });

  if (data && data.length) {
    return (
      <View style={{ height: width }}>
        <FlatList
          data={data}
          ref={(flatList) => {
            this.flatList = flatList;
          }}
          keyExtractor={(item, index) => "key" + index}
          horizontal
          pagingEnabled
          scrollEnabled
          snapToAlignment="center"
          scrollEventThrottle={16}
          decelerationRate={"fast"}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return <CarouselItem item={item} />;
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
        />

        <View style={styles.dotView}>
          {data.map((_, i) => {
            let opacity = position.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });
            let backgroundColor = position.interpolate({
              inputRange: [i - 2, i - 1, i, i + 1, i + 2],
              outputRange: [
                Colors.grey,
                Colors.grey,
                Colors.primary,
                Colors.grey,
                Colors.grey,
              ],
            });
            let width = position.interpolate({
              inputRange: [i - 2, i - 1, i, i + 1, i + 2],
              outputRange: [7, 7, 14, 7, 7],
            });
            return (
              <Animated.View
                key={i}
                style={{
                  opacity,
                  height: 7,
                  width,
                  backgroundColor,
                  margin: 5,
                  borderRadius: 5,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  }

  // console.log("Please provide Images");
  return null;
};

const styles = StyleSheet.create({
  dotView: { flexDirection: "row", justifyContent: "center" },
});

export default Carousel;
