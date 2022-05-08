import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  TouchableNativeFeedback,
  Dimensions,
  ScrollView,
  StatusBar,
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

import { Feather } from "@expo/vector-icons";

import AppText from "../AppText";
import applicationApi from "../../api/application";
import Colors from "../../constants/Colors";
import CustomButton from "../CustomButton";
import DatePicker from "../DatePicker";
import TimePicker from "../TimePicker";
import cache from "../../utilities/cache";
import campusApplicationApi from "../../api/campusApis/application";
import showToast from "../ShowToast";

const { width, height } = Dimensions.get("screen");

const SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 600,
};

const NormalText = ({ children }) => (
  <Text
    style={{
      color: Colors.black,
      fontFamily: "OpenSans-Regular",
      fontSize: 14.5,
      marginTop: 5,
      marginBottom: 10,
      marginLeft: 7,
    }}
  >
    {children}
  </Text>
);

function ApplicationModal(props) {
  const dimensions = useWindowDimensions();

  const [joiningDate, setJoiningDate] = useState();
  const [availabilityDate, setAvailabilityDate] = useState();
  const [availabilityDateTimeStamp, setAvailabilityDateTimeStamp] = useState();
  const [fromTime, setFromTime] = useState();
  const [fromError, setFromError] = useState();
  const [originalFromTime, setOriginalFromTime] = useState();
  const [toTime, setToTime] = useState();
  const [toError, setToError] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const top = useSharedValue(Dimensions.get("screen").height);

  const style = useAnimatedStyle(() => {
    return {
      top: top.value,
    };
  });

  function setIsPressed(val) {
    props.sendData(val);
  }

  const sendIsApplied = (val, applicationId) => {
    props.sendIsApplied(val, applicationId);
  };

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

  if (props.closeModal) {
    top.value = withSpring(dimensions.height + 70, SPRING_CONFIG);
    // setIsPressed(false);
  }

  const handleApply = async () => {
    const user = await cache.get("user");

    const application = {
      job: props.data._id,
      candidate: user.id,
      doj: joiningDate,
      availability: {
        date: availabilityDate,
        from: fromTime,
        to: toTime,
      },
    };
    if (!joiningDate && !props.isCampus)
      return Toast.show({
        type: "appError",
        text1: "Joining date is required!",
      });

    let response;
    if (props.isCampus)
      response = await campusApplicationApi.postCampusApplication(props.jobId);
    else response = await applicationApi.postApplication(application);

    setLoading(true);
    // // console.log(response);
    if (!response.ok) {
      setLoading(false);
      if (response.problem === "NETWORK_ERROR") {
        Toast.show({
          type: "appError",
          text1: "No internet connection!",
        });
        return setNetworkError(true);
      } else {
        Toast.show({
          type: "appError",
          text1: response.data.detail
            ? response.data.detail[0]?.msg
            : "Something went wrong",
        });
        return setError(true);
      }
    }
    setNetworkError(false);
    setError(false);
    setLoading(false);

    Toast.show({
      type: "appSuccess",
      text1: "Applied successfully!",
    });

    top.value = withSpring(dimensions.height + 70, SPRING_CONFIG);
    if (props.isCampus) sendIsApplied(true, response.data._id);
    else sendIsApplied(true, response.data._id.$oid);
    setIsPressed(false);
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
              padding: 20,
              paddingBottom: 50,
            }}
            style={styles.container}
          >
            <AppText>Applying for</AppText>
            <AppText style={styles.boldText}>{props.data.job_title}</AppText>
            <AppText style={styles.text}>Organization</AppText>
            <AppText style={styles.boldText}>{props.data.company.name}</AppText>

            {props.isCampus ? (
              <>
                <AppText style={styles.text}>Placement Criteria</AppText>
                {props.placementCriteria?.map((criteria, index) => (
                  <NormalText>
                    {index + 1}) {criteria}
                  </NormalText>
                ))}
                <AppText style={styles.text}>Your CGPA</AppText>

                <NormalText>{props.cgpa}</NormalText>
              </>
            ) : (
              <>
                <AppText style={styles.text}>
                  When you are ready to join:
                </AppText>
                <DatePicker
                  titleStyle={joiningDate ? styles.dateTimeText : ""}
                  // minDate={null}
                  onDateChange={(indFormat, usFormat, timestamp) => {
                    setJoiningDate(usFormat);
                  }}
                />
                <AppText style={styles.text}>Availability</AppText>
                <AppText style={{ color: "#A3A3A3", fontSize: 12.5 }}>
                  Specify date and time when you are available to take the call
                </AppText>
                <DatePicker
                  titleStyle={availabilityDate ? styles.dateTimeText : ""}
                  onDateChange={(date, timestamp, utc) => {
                    // console.log(dt);
                    setAvailabilityDateTimeStamp(utc);
                    setAvailabilityDate(timestamp);
                  }}
                />
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "48%", marginRight: 7, marginLeft: 3 }}>
                    <AppText style={styles.text}>From</AppText>
                    <TimePicker
                      minTime={new Date()}
                      onTimeChange={(time) => {
                        let d = availabilityDateTimeStamp?.toLocaleDateString();
                        d = new Date(d);
                        d = d.getTime();

                        let today = new Date().toLocaleDateString();
                        today = new Date(today);
                        today = today.getTime();

                        if (d === today && time < availabilityDateTimeStamp) {
                          setFromError(true);
                          return showToast({
                            type: "appError",
                            message: "Enter a valid time!",
                          });
                        }
                        let hrs = time.getHours();
                        let mins = time.getMinutes();
                        if (hrs <= 9) hrs = "0" + hrs;
                        if (mins < 10) mins = "0" + mins;
                        setOriginalFromTime(time);
                        setFromTime(hrs + ":" + mins);
                      }}
                      error={fromError}
                    />
                  </View>
                  <View style={{ width: "48%" }}>
                    <AppText style={styles.text}>To</AppText>
                    <TimePicker
                      minTime={fromTime ? fromTime : new Date()}
                      onTimeChange={(time) => {
                        if (time < originalFromTime) {
                          setToError(true);
                          return showToast({
                            type: "appError",
                            message: "Enter a valid time!",
                          });
                        }
                        let hrs = time.getHours();
                        let mins = time.getMinutes();

                        if (hrs <= 9) hrs = "0" + hrs;
                        if (mins < 10) mins = "0" + mins;

                        setToError(false);

                        setToTime(hrs + ":" + mins);
                      }}
                      error={toError}
                    />
                  </View>
                </View>
              </>
            )}
            <CustomButton
              title="Apply"
              onPress={() => {
                handleApply();
              }}
              disabled={fromError || toError}
            />
          </ScrollView>
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

export default ApplicationModal;
