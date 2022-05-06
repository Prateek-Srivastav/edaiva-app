import React, { useState } from "react";
import { StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";

import AppPicker from "./AppPicker";
import Colors from "../constants/Colors";

function DatePicker({
  disabled,
  onDateChange,
  minDate,
  label,
  value,
  titleStyle,
  initialDate,
  style,
  maxDate,
  dobLimit,
}) {
  const [show, setShow] = useState(false);
  const [initDate, setInitDate] = useState(
    initialDate ? new Date(initialDate) : new Date()
  );
  const [selectedDate, setSelectedDate] = useState("Date");

  const onChange = (event, date) => {
    let day = date?.getDate();
    let month = date?.getMonth() + 1;

    if (day <= 9) day = "0" + day;
    if (month < 10) month = "0" + month;

    const indFormat = day + "/" + month + "/" + date?.getFullYear();
    const usFormat = date?.getFullYear() + "-" + month + "-" + day;

    const diff = Date.now() - date?.getTime();
    const age = new Date(diff);
    const isValid = Math.abs(age.getUTCFullYear() - 1970) >= 18;

    if (!isValid && dobLimit) {
      setShow(false);
      onDateChange(indFormat, usFormat, date);

      return setSelectedDate("Date");
    }

    setShow(false);
    setSelectedDate(usFormat);
    setInitDate(date);
    onDateChange(indFormat, usFormat, date);
  };

  return (
    <>
      <AppPicker
        style={style}
        disabled={disabled}
        titleStyle={titleStyle}
        label={label}
        dateTimePicker
        // titleStyle={selectedDate ? styles.dateTimeText : ""}
        onPress={() => {
          if (!disabled) setShow(true);
        }}
        icon={<MaterialIcons name="date-range" size={17} color="#817E7E" />}
        title={!initialDate ? selectedDate : value}
      />
      {show && (
        <DateTimePicker
          testID="timePicker"
          minimumDate={minDate !== undefined ? minDate : new Date()}
          maximumDate={maxDate}
          value={initDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            if (event.type === "set") onChange(event, date);
            else {
              setShow(false);
              return;
            }
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  dateTimeText: {
    color: Colors.primary,
    fontFamily: "OpenSans-SemiBold",
    fontSize: 15,
  },
});

export default DatePicker;
