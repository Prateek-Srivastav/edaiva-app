import * as React from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../constants/Colors";

// interface Props {
//   onColor: string;
//   offColor: string;
//   label: string;
//   onToggle: () => void;
//   style: object;
//   isOn: boolean;
//   labelStyle: object;
// }

// interface DefaultProps {
//   onColor: string;
//   offColor: string;
//   label: string;
//   onToggle: () => void;
//   style: object;
//   isOn: boolean;
//   labelStyle: object;
// }

function Toggle({ onToggle, isOn, style, labelStyle, label }) {
  const animatedValue = new Animated.Value(0);

  // static defaultProps: DefaultProps = {
  //   onColor: "#4cd137",
  //   offColor: "#ecf0f1",
  //   label: "",
  //   onToggle: () => {},
  //   style: {},
  //   isOn: false,
  //   labelStyle: {},
  // };

  const onColor = Colors.primary;
  const offColor = "#ecf0f1";

  const moveToggle = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  // const { isOn, style, onToggle, labelStyle, label } = props;

  const color = isOn ? onColor : offColor;

  animatedValue.setValue(isOn ? 0 : 1);

  Animated.timing(animatedValue, {
    toValue: isOn ? 1 : 0,
    duration: 300,
    easing: Easing.linear,
    useNativeDriver: false,
  }).start();

  return (
    <View style={styles.container}>
      {!!label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <TouchableOpacity
        onPress={() => {
          typeof onToggle === "function" && onToggle();
        }}
      >
        <View
          style={[styles.toggleContainer, style, { backgroundColor: color }]}
        >
          <Animated.View
            style={[
              styles.toggleWheelStyle,
              {
                marginLeft: moveToggle,
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // borderWidth: 1,
    marginVertical: 7,
    width: "100%",
  },
  toggleContainer: {
    width: 35,
    height: 20,
    marginLeft: 3,
    borderRadius: 15,
    justifyContent: "center",
  },
  label: {
    marginRight: 2,
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    color: Colors.grey,
  },
  toggleWheelStyle: {
    width: 18,
    height: 18,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 1.5,
  },
});

export default Toggle;
