import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";

import AppPicker from "../../components/AppPicker";
import CardInput from "../../components/CardInput";
import CustomButton from "../../components/CustomButton";
import {
  AppForm,
  AppFormCardInput,
  SubmitButton,
} from "../../components/forms";
import useApi from "../../hooks/useApi";
import candidateApi from "../../api/candidate";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().label("Title"),
  role: Yup.string().label("Role"),
  description: Yup.string().required().label("Description"),
  link: Yup.string().label("Link"),
});

const teamSizes = [
  { _id: 1, name: "1-3 People" },
  { _id: 2, name: "3-5 People" },
  { _id: 3, name: "5-10 People" },
  { _id: 4, name: "10-20 People" },
  { _id: 5, name: "20+ People" },
];

const durations = [
  { _id: 1, name: "Less than 1 month" },
  { _id: 2, name: "1-3 Months" },
  { _id: 3, name: "3-6 Months" },
  { _id: 4, name: "6-9 Months" },
  { _id: 5, name: "More than 1 year" },
];

function AddProjectsScreen({ data, index }) {
  const navigation = useNavigation();

  if (index >= 0) {
    var {
      description,
      role,
      duration: prevDuration,
      link,
      team_size,
      title,
    } = data.projects[index];
  }

  const [teamSize, setTeamSize] = useState(team_size ? team_size : null);
  const [duration, setDuration] = useState(prevDuration ? prevDuration : null);

  const { request: updateProfile } = useApi(candidateApi.updateProfile);

  const handleAddSubmit = (values) => {
    const val = {
      ...values,
      duration,
      team_size: teamSize,
    };

    let projects;

    if (data.projects) {
      projects = [...data.projects, val];
    } else if (!data.projects) {
      projects = [val];
    }

    updateProfile({ projects });
    navigation.goBack();
  };

  const handleEditSubmit = (values) => {
    const val = {
      ...values,
      duration,
      team_size: teamSize,
    };

    const projects = data.projects;
    projects.splice(index, 1, val);

    updateProfile({ projects });
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
          role: role ? role : "",
          description: description ? description : "",
          link: link ? link : "",
        }}
        onSubmit={index >= 0 ? handleEditSubmit : handleAddSubmit}
        validationSchema={validationSchema}
      >
        <AppFormCardInput
          name="title"
          defaultValue={title ? title : ""}
          label="Title"
          placeholder="xyz"
        />
        <AppFormCardInput
          name="role"
          defaultValue={role ? role : ""}
          label="Role"
          placeholder="xyz"
        />
        <AppPicker
          items={teamSizes}
          title={teamSize ? teamSize : "Select"}
          label="Team Size"
          onSelectItem={(item) => setTeamSize(item.name)}
        />
        <AppPicker
          items={durations}
          title={duration ? duration : "Select"}
          label="Duration"
          onSelectItem={(item) => setDuration(item.name)}
        />
        <AppFormCardInput
          name="link"
          defaultValue={link ? link : ""}
          label="Link"
          placeholder="xyz"
        />
        <AppFormCardInput
          name="description"
          defaultValue={description ? description : ""}
          label="Description"
          numberOfLines={6}
          multiline
          placeholder="Describe about your project here..."
        />
        <SubmitButton title={index >= 0 ? "Save" : "Add"} />
      </AppForm>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default AddProjectsScreen;
