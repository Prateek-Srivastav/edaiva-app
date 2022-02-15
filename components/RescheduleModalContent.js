import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Platform,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";

import Colors from "../constants/Colors";

import AppText from "./AppText";
import AppPicker from "./AppPicker";
import CardInput from "./CardInput";

function RescheduleModalContent(props) {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [selectedAvailabilityDate, setSelectedAvailabilityDate] = useState();
  const [selectedFromTime, setSelectedFromTime] = useState();
  const [selectedToTime, setSelectedToTime] = useState();
  const [origin, setOrigin] = useState("");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    setShow(Platform.OS === "ios");
    setDate(currentDate);

    if (origin === "joiningDate") {
      let date = currentDate.getDate();
      let month = currentDate.getMonth() + 1;

      if (date <= 9) date = "0" + date;
      if (month < 10) month = "0" + month;

      setSelectedJoiningDate(
        date + "/" + month + "/" + currentDate.getFullYear()
      );
    } else if (origin === "availabilityDate") {
      let date = currentDate.getDate();
      let month = currentDate.getMonth() + 1;

      if (date <= 9) date = "0" + date;
      if (month < 10) month = "0" + month;

      setSelectedAvailabilityDate(
        date + "/" + month + "/" + currentDate.getFullYear()
      );
    } else if (origin === "fromTime") {
      let hrs = currentDate.getHours();
      let mins = currentDate.getMinutes();

      let ampm = hrs >= 12 ? "PM" : "AM";
      hrs = hrs % 12;
      hrs = hrs ? hrs : 12;

      if (hrs <= 9) hrs = "0" + hrs;
      if (mins < 10) mins = "0" + mins;

      setSelectedFromTime(hrs + ":" + mins + ` ${ampm}`);
    } else if (origin === "toTime") {
      let hrs = currentDate.getHours();
      let mins = currentDate.getMinutes();

      let ampm = hrs >= 12 ? "PM" : "AM";
      hrs = hrs % 12;
      hrs = hrs ? hrs : 12;

      if (hrs <= 9) hrs = "0" + hrs;
      if (mins < 10) mins = "0" + mins;

      setSelectedToTime(hrs + ":" + mins + ` ${ampm}`);
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const RescheduleTiming = () => {
    return (
      <>
        <View style={{ marginBottom: 15 }}>
          <AppText style={styles.text}>Give reason to reschedule</AppText>
          <CardInput
            // style={{ marginBottom: 10 }}
            numberOfLines={6}
            multiline
            placeholder="Write here..."
          />
        </View>
        <AppText style={styles.text}>
          Available Date and Time for the interview
        </AppText>
        <AppPicker
          titleStyle={selectedAvailabilityDate ? styles.dateTimeText : ""}
          onPress={() => {
            setOrigin("availabilityDate");
            showDatepicker();
          }}
          icon={<MaterialIcons name="date-range" size={17} color="#817E7E" />}
          // style={{ width: "100%" }}
          title={selectedAvailabilityDate ? selectedAvailabilityDate : "Date"}
        />
        <View style={{ flexDirection: "row", marginBottom: 30 }}>
          <View style={{ width: "49%", marginRight: 7 }}>
            <AppText style={styles.text}>From</AppText>
            <AppPicker
              titleStyle={selectedFromTime ? styles.dateTimeText : ""}
              onPress={() => {
                setOrigin("fromTime");
                showTimepicker();
              }}
              icon={
                <MaterialIcons name="access-time" size={17} color="#817E7E" />
              }
              // style={{ marginHorizontal: 0 }}
              title={selectedFromTime ? selectedFromTime : "--:-- --"}
            />
          </View>
          <View style={{ width: "49%" }}>
            <AppText style={styles.text}>To</AppText>
            <AppPicker
              titleStyle={selectedToTime ? styles.dateTimeText : ""}
              onPress={() => {
                setOrigin("toTime");
                showTimepicker();
              }}
              icon={
                <MaterialIcons name="access-time" size={17} color="#817E7E" />
              }
              // style={{ marginHorizontal: 0 }}
              title={selectedToTime ? selectedToTime : "--:-- --"}
            />
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <RescheduleTiming />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          minimumDate={new Date()}
          value={date}
          mode={mode}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 20,

    paddingBottom: 20,
    // marginBottom: 30,
  },
  dateTimeText: {
    color: Colors.primary,
    fontFamily: "OpenSans-SemiBold",
    fontSize: 15,
  },
  text: {
    marginBottom: 5,
  },
});

export default RescheduleModalContent;
