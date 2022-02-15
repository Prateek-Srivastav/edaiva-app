import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import * as Yup from "yup";

import AppFormCardInput from "../../components/forms/AppFormCardInput";
import { AppForm, ErrorMessage, SubmitButton } from "../../components/forms";
import candidateApi from "../../api/candidate";
import DatePicker from "../../components/DatePicker";
import AppPicker from "../../components/AppPicker";
import AppText from "../../components/AppText";
import CardInput from "../../components/CardInput";
import Colors from "../../constants/Colors";
import CustomButton from "../../components/CustomButton";
import { formattedDate, formattedNumericDate } from "../../utilities/date";
import useApi from "../../hooks/useApi";
import { useNavigation } from "@react-navigation/native";

const validationSchema = Yup.object().shape({
  company: Yup.string().required().label("Company"),
  role: Yup.string().required().label("Role"),
  responsibilities: Yup.string().required().label("Responsibilities"),
});

const jobTypes = [
  { name: "Full Time", _id: 1 },
  { name: "Part Time", _id: 2 },
  { name: "Internship", _id: 3 },
  { name: "Contract", _id: 4 },
];

function AddExperienceScreen({ data, index }) {
  const [startDateError, setStartDateError] = useState(false);
  const [jobTypeError, setJobTypeError] = useState(false);

  const navigation = useNavigation();

  if (index >= 0) {
    var {
      company,
      role,
      responsibilities,
      job_type,
      start_date,
      end_date,
      present: present_data,
    } = data.experience[index];
  }
  const [jobType, setJobType] = useState(job_type ? job_type : null);
  const [present, setPresent] = useState(present_data ? present_data : false);
  const [startDate, setStartDate] = useState(
    start_date ? formattedDate(start_date) : null
  );
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
      job_type: jobType,
      present,
      end_date: present ? "" : endDate,
      start_date: startDate,
    };

    if (!jobType) return setJobTypeError(true);
    else if (!startDate) return setStartDateError(true);

    let experience;

    if (data.experience) {
      experience = [...data.experience, val];
    } else if (!data.experience) {
      experience = [val];
    }

    await updateProfile({ experience });
    if (error) return;
    navigation.goBack();
  };

  const handleEditSubmit = (values) => {
    const val = {
      ...values,
      job_type: jobType,
      present,
      end_date: present ? "" : endDate,
      start_date: startDate,
    };

    if (!jobType) return setJobTypeError(true);
    else if (!startDate) return setStartDateError(true);

    // const experience = [...data.experience.splice(index, 1, val)];
    const experience = data.experience;
    experience.splice(index, 1, val);
    updateProfile({ experience });
    navigation.goBack();
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 15 }}
      style={styles.container}
    >
      <AppForm
        initialValues={{
          company: company ? company : "",
          role: role ? role : "",
          responsibilities: responsibilities ? responsibilities : "",
        }}
        onSubmit={index >= 0 ? handleEditSubmit : handleAddSubmit}
        validationSchema={validationSchema}
      >
        <AppFormCardInput
          defaultValue={company ? company : ""}
          name="company"
          label="Company"
        />
        <AppPicker
          // defaultValue={designation !== "" ? designation : ""}
          items={jobTypes}
          title={jobType ? jobType : ""}
          label="Job Type"
          onSelectItem={(item) => setJobType(item.name)}
        />
        <ErrorMessage error="Job Type is required" visible={jobTypeError} />

        <AppFormCardInput
          defaultValue={role ? role : ""}
          name="role"
          label="Role"
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <DatePicker
            initialDate={startDate}
            style={{ width: "49%", marginRight: 7 }}
            label="From"
            minDate={null}
            onDateChange={(date, timestamp) => {
              setStartDate(timestamp);
            }}
            value={startDate ? formattedNumericDate(startDate) : null}
          />

          <DatePicker
            initialDate={endDate}
            style={{ width: "49%" }}
            label="To"
            minDate={null}
            onDateChange={(date, timestamp) => {
              setEndDate(timestamp);
            }}
            disabled={present}
            value={endDate ? formattedNumericDate(endDate) : null}
          />
        </View>
        <ErrorMessage error="Start date is required" visible={startDateError} />
        <TouchableOpacity
          activeOpacity={0.4}
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          onPress={() => setPresent(!present)}
        >
          <View
            style={{
              borderWidth: 1,
              borderRadius: 3,
              borderColor: Colors.primary,
              height: 15,
              width: 15,
              marginRight: 5,
              backgroundColor: present ? Colors.primary : "transparent",
            }}
          />
          <AppText>Present</AppText>
        </TouchableOpacity>
        <AppFormCardInput
          defaultValue={responsibilities ? responsibilities : ""}
          label="Responsibility"
          name="responsibilities"
          // style={{ marginTop: 10 }}
          numberOfLines={6}
          multiline
          placeholder="Your day to day responsibilities..."
        />
        <SubmitButton title={index >= 0 ? "Save" : "Add"} />
      </AppForm>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: Colors.bg,
  },
});

export default AddExperienceScreen;
