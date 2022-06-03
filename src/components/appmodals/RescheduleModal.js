import React, { useState } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  useWindowDimensions,
  TouchableNativeFeedback,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  StatusBar,
  // Dimensions,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
// import { AppToast } from "./ToastConfig";

import { Feather, AntDesign } from "@expo/vector-icons";

import AppText from "../AppText";
import applicationApi from "../../api/application";
import CardInput from "../CardInput";
import Colors from "../../constants/Colors";
import CustomButton from "../CustomButton";
import DatePicker from "../DatePicker";
import TimePicker from "../TimePicker";
import cache from "../../utilities/cache";
import useApi from "../../hooks/useApi";
import { useNavigation } from "@react-navigation/native";
import { formattedDate, formattedNumericDate } from "../../utilities/date";
import interviewApi from "../../api/interview";

const { width, height } = Dimensions.get("screen");

const SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 600,
};

function RescheduleModal(props) {
  const dimensions = useWindowDimensions();
  const top = useSharedValue(Dimensions.get("screen").height);

  const [reason, setReason] = useState();
  const [inputs, setInputs] = useState([{ date: "", from: "", to: "" }]);

  const addHandler = () => {
    setInputs([...inputs, { date: "", from: "", to: "" }]);
  };

  const deleteHandler = (index) => {
    const _inputs = [...inputs];
    _inputs.splice(index, 1);
    setInputs(_inputs);
  };

  const inputHandler = (date, from, to, index) => {
    const _inputs = [...inputs];
    _inputs[index].date = date;
    _inputs[index].from = from;
    _inputs[index].to = to;
    setInputs(_inputs);
  };

  const style = useAnimatedStyle(() => {
    return {
      top: top.value,
    };
  });

  function setIsPressed(val) {
    props.sendData(val);
  }

  const gestureHandler = useAnimatedGestureHandler({
    onStart(_, context) {
      context.startTop = top.value;
    },
    onActive(event, context) {
      top.value = context.startTop + event.translationY;
    },
    onEnd(event) {
      if (event.translationY > 50)
        top.value = withSpring(dimensions.height + 70, SPRING_CONFIG);
      else {
        top.value = withSpring(0, SPRING_CONFIG);
      }
      runOnJS(setIsPressed)();
    },
  });

  if (props.isPressed) {
    top.value = withSpring(0, SPRING_CONFIG);
  }

  const {
    data,
    loading,
    error,
    networkError,
    request: reschedule,
  } = useApi(interviewApi.rescheduleInterview);

  const handleSubmit = async () => {
    const user = await cache.get("user");
    console.log(props);
    if (!reason)
      return Toast.show({
        type: "appError",
        text1: "Reason required",
      });
    const requestReschedule = {
      // job: props.jobId,
      // candidate: user.id,
      interview: props.interviewId,
      reason,
      time_slots: inputs,
    };
    console.log(requestReschedule);
    await reschedule(requestReschedule);
    if (error)
      return Toast.show({
        type: "appError",
        text1: "Something went wrong",
      });
    else if (loading)
      return Toast.show({
        type: "appWarning",
        text1: "Rescheduling...",
      });

    Toast.show({
      type: "appSuccess",
      text1: "Reschedule requested successfully!",
    });

    top.value = withSpring(dimensions.height + 70, SPRING_CONFIG);
    setIsPressed(true);
  };

  return (
    <PanGestureHandler
      activeOffsetX={[-10, 10]}
      onGestureEvent={gestureHandler}
    >
      <Animated.View style={[styles.modalContainer, style]}>
        <View style={styles.modalContentContainer}>
          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>Send Application</Text>
            <View style={styles.buttonContainer}>
              <TouchableNativeFeedback
                onPress={() => {
                  top.value = withSpring(dimensions.height + 50, SPRING_CONFIG);
                  setIsPressed();
                }}
              >
                <View style={styles.button}>
                  <Feather name="x" size={24} color={Colors.primary} />
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
          <View style={styles.line} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            style={styles.container}
          >
            <View style={{ marginBottom: 15 }}>
              <AppText style={styles.text}>Give reason to reschedule</AppText>
              <CardInput
                // style={{ marginBottom: 10 }}
                numberOfLines={6}
                multiline
                placeholder="Write here..."
                onChangeText={(text) => setReason(text)}
              />
            </View>
            <AppText style={styles.text}>
              Available Date and Time for the interview
            </AppText>
            {inputs.map((input, index) => {
              // console.log(input);
              return (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: inputs.length > 1 ? -20 : 0,
                    }}
                  >
                    <DatePicker
                      // titleStyle={availabilityDate ? styles.dateTimeText : ""}
                      // minDate={null}
                      onDateChange={(indFormat, usFormat, timestamp) => {
                        // setAvailabilityDate(usFormat);
                        inputHandler(timestamp, input.from, input.to, index);
                      }}
                      // value={input.date}
                      initialDate={input.date === "" ? null : input.date}
                      value={formattedDate(input.date)}
                    />
                    {inputs.length > 1 && (
                      <CustomButton
                        title="-"
                        style={{
                          width: "15%",
                          flex: 0,
                          alignSelf: "center",
                          marginTop: 20,
                          marginLeft: 10,
                          height: 40,
                        }}
                        onPress={() => deleteHandler(index)}
                      />
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginBottom: 30,
                      marginTop: -20,
                    }}
                  >
                    <View
                      style={{ width: "48%", marginRight: 7, marginLeft: 3 }}
                    >
                      <AppText style={styles.text}>From</AppText>
                      <TimePicker
                        onTimeChange={(time) => {
                          let hrs = time.getHours();
                          let mins = time.getMinutes();

                          if (hrs <= 9) hrs = "0" + hrs;
                          if (mins < 10) mins = "0" + mins;

                          inputHandler(
                            input.date,
                            hrs + ":" + mins,
                            input.to,
                            index
                          );
                        }}
                        value={input.from}
                      />
                    </View>
                    <View style={{ width: "48%" }}>
                      <AppText style={styles.text}>To</AppText>
                      <TimePicker
                        onTimeChange={(time) => {
                          let hrs = time.getHours();
                          let mins = time.getMinutes();

                          if (hrs <= 9) hrs = "0" + hrs;
                          if (mins < 10) mins = "0" + mins;

                          inputHandler(
                            input.date,
                            input.from,
                            hrs + ":" + mins,
                            index
                          );
                        }}
                        value={input.to}
                      />
                    </View>
                  </View>
                  {inputs.length > 1 && (
                    <View
                      style={[
                        styles.line,
                        {
                          width: "100%",
                          backgroundColor: Colors.grey,
                          opacity: 0.1,
                          marginTop: -20,
                          marginBottom: 20,
                          alignSelf: "center",
                        },
                      ]}
                    />
                  )}
                </>
              );
            })}
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
              bottom: Dimensions.get("window").height / 15,
            }}
          >
            <CustomButton
              title="+ Add another"
              titleStyle={{ color: Colors.primary }}
              style={{
                backgroundColor: "white",
                elevation: 3,
                marginRight: 10,
              }}
              onPress={() => {
                addHandler();
              }}
            />

            <CustomButton
              title="Submit"
              onPress={() => {
                handleSubmit();
                // sendFilters();
              }}
            />
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    overflow: "hidden",
    position: "absolute",
    right: -15,
  },

  headingContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headingText: {
    color: Colors.primary,
    fontSize: 19,
    fontFamily: "OpenSans-SemiBold",
  },
  line: {
    // height: 27,
    width: width,
    height: 1.6,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: "#0AB4F1",
    elevation: 1,
    marginBottom: 10,
    opacity: 0.1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentContainer: {
    backgroundColor: Colors.bg,
    top: StatusBar.currentHeight + 70,
    flex: 1,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    padding: 20,
    alignItems: "center",
  },
  boldText: {
    color: Colors.primary,
    fontSize: 17.5,
    fontFamily: "OpenSans-SemiBold",
    marginLeft: 5,
    // marginBottom: 10,
  },
  container: {
    flex: 1,
    width: "110%",
    paddingBottom: 90,
    marginBottom: 30,
  },
  dateTimeText: {
    color: Colors.primary,
    fontFamily: "OpenSans-SemiBold",
    fontSize: 15,
  },
  text: {
    marginTop: 25,
  },
});

export default RescheduleModal;
