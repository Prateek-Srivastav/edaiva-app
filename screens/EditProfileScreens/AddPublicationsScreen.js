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

function AddPublicationsScreen({ data, index }) {
  const navigation = useNavigation();

  if (index >= 0) {
    var {
      date: prevDate,
      description,
      title,
      link,
      publisher,
    } = data.publications[index];
  }

  const [date, setDate] = useState(prevDate ? formattedDate(prevDate) : null);
  const [dateError, setDateError] = useState(false);

  const { request: updateProfile } = useApi(candidateApi.updateProfile);

  const handleAddSubmit = (values) => {
    const val = {
      ...values,
      date,
    };

    let publications;
    if (data.publications) publications = [...data.publications, val];
    else if (!data.publications) publications = [val];

    updateProfile({ publications });
    navigation.goBack();
  };

  const handleEditSubmit = (values) => {
    const val = {
      ...values,
      date,
    };

    const publications = data.publications;
    publications.splice(index, 1, val);

    updateProfile({ publications });
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
          link: link ? link : "",
          description: description ? description : "",
          publisher: publisher ? publisher : "",
        }}
        onSubmit={index >= 0 ? handleEditSubmit : handleAddSubmit}
      >
        <AppFormCardInput
          name="title"
          defaultValue={title ? title : ""}
          label="Title"
          placeholder="xyz"
        />
        <AppFormCardInput
          name="publisher"
          defaultValue={publisher ? publisher : ""}
          label="Publisher"
          title="Select"
        />
        <DatePicker
          label="Publication Date"
          initialDate={prevDate}
          minDate={null}
          onDateChange={(date, timestamp) => {
            setDate(timestamp);
          }}
          value={prevDate ? formattedNumericDate(prevDate) : null}
        />
        <AppFormCardInput
          name="link"
          defaultValue={link ? link : ""}
          label="Publication URL"
          placeholder="Paste link here"
        />
        <AppFormCardInput
          name="description"
          defaultValue={description ? description : ""}
          label="Description"
          numberOfLines={6}
          multiline
          placeholder="Describe your project here..."
        />
        <SubmitButton title={index >= 0 ? "Save" : "Add"} />
      </AppForm>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default AddPublicationsScreen;
