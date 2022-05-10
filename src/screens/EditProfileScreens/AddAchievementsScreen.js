import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import {
  AppForm,
  AppFormCardInput,
  ErrorMessage,
  SubmitButton,
} from "../../components/forms";
import candidateApi from "../../api/candidate";
import DatePicker from "../../components/DatePicker";
import { formattedDate, formattedNumericDate } from "../../utilities/date";
import useApi from "../../hooks/useApi";

function AddAchievementsScreen({ data, index }) {
  const navigation = useNavigation();

  if (index >= 0) {
    var { date: prevDate, description, title } = data.achievements[index];
  }

  const [date, setDate] = useState(prevDate ? formattedDate(prevDate) : null);
  const [dateError, setDateError] = useState(false);

  const { request: updateProfile } = useApi(candidateApi.updateProfile);

  const handleAddSubmit = async (values) => {
    const val = {
      ...values,
      date,
    };

    let achievements;

    if (data.achievements) {
      achievements = [...data.achievements, val];
    } else if (!data.achievements) {
      achievements = [val];
    }

    await updateProfile({ achievements });
    navigation.goBack();
  };

  const handleEditSubmit = async (values) => {
    const val = {
      ...values,
      date,
    };

    const achievements = data.achievements;
    achievements.splice(index, 1, val);

    await updateProfile({ achievements });
    navigation.goBack();
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 15 }}
      style={styles.container}
    >
      <AppForm
        initialValues={{
          title: title ? title : "",
          description: description ? description : "",
        }}
        onSubmit={index >= 0 ? handleEditSubmit : handleAddSubmit}
      >
        <AppFormCardInput
          name="title"
          defaultValue={title ? title : ""}
          label="Title"
          placeholder="Title"
        />
        <DatePicker
          label="Date of achievement"
          initialDate={prevDate}
          minDate={null}
          maxDate={new Date()}
          onDateChange={(date, timestamp) => {
            setDate(timestamp);
          }}
          value={prevDate ? formattedNumericDate(prevDate).usFormat : null}
        />
        <ErrorMessage
          error="Date of achievement is required"
          visible={dateError}
        />
        <AppFormCardInput
          name="description"
          defaultValue={description ? description : ""}
          label="Description"
          numberOfLines={6}
          multiline
          placeholder="Describe your achievement."
        />
        <SubmitButton title={index >= 0 ? "Save" : "Add"} />
      </AppForm>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default AddAchievementsScreen;
