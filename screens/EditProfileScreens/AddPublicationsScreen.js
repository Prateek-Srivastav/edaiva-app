import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Yup from "yup";

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

const validationSchema = Yup.object().shape({
  title: Yup.string().required().label("Title"),
  link: Yup.string().url().label("Link"),
  description: Yup.string().required().label("Description"),
  publisher: Yup.string().required().label("Publisher"),
});

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

  const { request: updateProfile } = useApi(candidateApi.updateProfile);

  const handleAddSubmit = async (values) => {
    const val = {
      ...values,
      date,
    };

    let publications;
    if (data.publications) publications = [...data.publications, val];
    else if (!data.publications) publications = [val];

    await updateProfile({ publications });
    navigation.goBack();
  };

  const handleEditSubmit = async (values) => {
    const val = {
      ...values,
      date,
    };

    const publications = data.publications;
    publications.splice(index, 1, val);

    await updateProfile({ publications });
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
        validationSchema={validationSchema}
      >
        <AppFormCardInput
          name="title"
          defaultValue={title ? title : ""}
          label="Title"
          placeholder="Title"
        />
        <AppFormCardInput
          name="publisher"
          defaultValue={publisher ? publisher : ""}
          label="Publisher"
          title="Select"
          placeholder="Publisher"
        />
        <DatePicker
          label="Publication Date"
          initialDate={prevDate}
          minDate={null}
          onDateChange={(date, timestamp) => {
            setDate(timestamp);
          }}
          value={prevDate ? formattedNumericDate(prevDate).usFormat : null}
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
