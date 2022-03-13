import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";

import CardInput from "../../components/CardInput";
import candidateApi from "../../api/candidate";
import Colors from "../../constants/Colors";
import AppText from "../../components/AppText";
import CustomButton from "../../components/CustomButton";
import {
  AppForm,
  AppFormCardInput,
  SubmitButton,
} from "../../components/forms";
import useApi from "../../hooks/useApi";

function AddSkillsScreen({ data, index }) {
  const navigation = useNavigation();
  if (index >= 0) {
    var { skill_name, level: prevLevel } = data.skills[index];
  }

  const [level, setLevel] = useState(prevLevel ? prevLevel : 0);

  const {
    error,
    loading,
    request: updateProfile,
  } = useApi(candidateApi.updateProfile);

  const handleAddSubmit = async (values) => {
    const val = {
      ...values,
      level,
    };

    const skills = [...data.skills, val];

    await updateProfile({ skills });
    navigation.goBack();
  };

  const handleEditSubmit = async (values) => {
    const val = {
      ...values,
      level,
    };

    const skills = data.skills;
    skills.splice(index, 1, val);

    await updateProfile({ skills });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <AppForm
        initialValues={{ skill_name: skill_name ? skill_name : "" }}
        onSubmit={index >= 0 ? handleEditSubmit : handleAddSubmit}
      >
        <AppFormCardInput
          name="skill_name"
          label="Skill"
          placeholder="xyz"
          defaultValue={skill_name ? skill_name : ""}
        />
        <AppText style={{ marginTop: 15 }}>
          How would you rate yourself in “That skill”.
        </AppText>
        <View style={{ paddingBottom: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <AppText
              style={{
                textAlign: "right",
                fontFamily: "OpenSans-Bold",
                color: Colors.primary,
                fontSize: 16,
                marginBottom: 4,
              }}
            >
              {level}
            </AppText>
            <AppText style={{ fontSize: 16 }}> /10</AppText>
          </View>
          <Slider
            style={{ width: "100%", marginTop: 10 }}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={Colors.primary}
            thumbTintColor={Colors.primary}
            minimumValue={0}
            maximumValue={10}
            value={parseInt(level)}
            onValueChange={(value) => setLevel(parseInt(value))}
          />
        </View>
        <SubmitButton title={index >= 0 ? "Save" : "Add"} />
      </AppForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 15,
  },
});

export default AddSkillsScreen;
