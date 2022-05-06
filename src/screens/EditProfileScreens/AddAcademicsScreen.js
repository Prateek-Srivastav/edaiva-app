import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import AppPicker from "../../components/AppPicker";
import AppText from "../../components/AppText";
import Colors from "../../constants/Colors";
import {
  AppForm,
  AppFormCardInput,
  ErrorMessage,
  SubmitButton,
} from "../../components/forms";
import DatePicker from "../../components/DatePicker";
import useApi from "../../hooks/useApi";
import candidateApi from "../../api/candidate";
import { formattedDate, formattedNumericDate } from "../../utilities/date";

const validationSchema = Yup.object().shape({
  institute: Yup.string().required().label("Institute"),
  specialization: Yup.string().label("Specialization"),
  grade: Yup.string().required().label("Grade"),
});

const degrees = [
  { _id: 1, name: "Graduate" },
  { _id: 2, name: "Post Graduate" },
];

function AddAcademicsScreen({ data, index }) {
  const navigation = useNavigation();

  if (index >= 0) {
    var {
      institute,
      grade,
      specialization,
      degree: degree_data,
      start_date,
      end_date,
      pursuing: pursuing_data,
    } = data.qualification[index];
  }

  const [degree, setDegree] = useState(degree_data ? degree_data : null);
  const [degreeError, setDegreeError] = useState(false);
  const [pursuing, setPursuing] = useState(
    pursuing_data ? pursuing_data : false
  );
  const [startDate, setStartDate] = useState(
    start_date ? formattedDate(start_date) : null
  );
  const [startDateError, setStartDateError] = useState(false);
  const [endDate, setEndDate] = useState(
    end_date ? formattedDate(end_date) : null
  );

  const {
    error,
    loading,
    request: updateProfile,
  } = useApi(candidateApi.updateProfile);

  const handleAddSubmit = async (values) => {
    const val = {
      ...values,
      degree,
      pursuing,
      end_date: pursuing ? "" : endDate,
      start_date: startDate,
    };

    if (!degree) return setDegreeError(true);
    else if (!startDate) return setStartDateError(true);

    let qualification;

    if (data.qualification) {
      qualification = [...data.qualification, val];
    } else if (!data.qualification) {
      qualification = [val];
    }

    await updateProfile({ qualification });
    navigation.goBack();
  };

  const handleEditSubmit = async (values) => {
    const val = {
      ...values,
      degree,
      pursuing,
      end_date: pursuing ? "" : endDate,
      start_date: startDate,
    };

    if (!degree) return setDegreeError(true);
    else if (!startDate) return setStartDateError(true);

    const qualification = data.qualification;
    qualification.splice(index, 1, val);

    await updateProfile({ qualification });
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppForm
        initialValues={{
          institute: institute ? institute : "",
          specialization: specialization ? specialization : "",
          grade: grade ? grade : "",
        }}
        validationSchema={validationSchema}
        onSubmit={index >= 0 ? handleEditSubmit : handleAddSubmit}
      >
        <AppFormCardInput
          name="institute"
          defaultValue={institute ? institute : ""}
          label="Institute/College/University"
          placeholder="Institute"
        />
        <AppPicker
          label="Degree"
          title={degree ? degree : "Select"}
          items={degrees}
          onSelectItem={(item) => {
            setDegree(item.name);
            setDegreeError(false);
          }}
          selectedItem={degree}
        />
        <ErrorMessage error="Degree is required" visible={degreeError} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <AppFormCardInput
            name="specialization"
            defaultValue={specialization ? specialization : ""}
            label="Specialization"
            placeholder="If any"
            style={{ width: "49%", marginRight: 5 }}
          />
          <AppFormCardInput
            name="grade"
            defaultValue={grade ? grade : ""}
            label="Grade"
            placeholder="Percentage/CGPA"
            style={{ width: "49%" }}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <DatePicker
            initialDate={startDate}
            style={{ width: "49%", marginRight: 7 }}
            label="From"
            minDate={null}
            onDateChange={(date, timestamp) => {
              setStartDate(timestamp);
              setStartDateError(false);
            }}
            value={startDate ? formattedNumericDate(startDate).usFormat : null}
          />

          <DatePicker
            initialDate={endDate}
            style={{ width: "49%" }}
            label="To"
            minDate={null}
            onDateChange={(date, timestamp) => {
              setEndDate(timestamp);
            }}
            disabled={pursuing}
            value={endDate ? formattedNumericDate(endDate).usFormat : null}
          />
        </View>
        <ErrorMessage error="Start date is required" visible={startDateError} />
        <TouchableOpacity
          activeOpacity={0.4}
          style={styles.box}
          onPress={() => setPursuing(!pursuing)}
        >
          {pursuing ? (
            <View
              style={{
                height: 16,
                width: 16,
                marginRight: 5,
              }}
            >
              <Ionicons name="checkbox" size={17} color={Colors.primary} />
            </View>
          ) : (
            <View
              style={{
                borderWidth: 1,
                borderRadius: 3,
                borderColor: Colors.primary,
                height: 15,
                width: 15,
                marginRight: 5,
                backgroundColor: "transparent",
              }}
            />
          )}
          <AppText>Pursuing</AppText>
        </TouchableOpacity>

        <SubmitButton title={index >= 0 ? "Save" : "Add"} />
      </AppForm>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: 5,
  },
  container: {
    // flex: 1,
    padding: 15,
  },
});

export default AddAcademicsScreen;
