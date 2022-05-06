import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";

import { BuildingIcon, Pencil, Trash } from "../../assets/svg/icons";
import { formattedDate } from "../../utilities/date";
import Colors from "../../constants/Colors";
import useApi from "../../hooks/useApi";
import candidateApi from "../../api/candidate";
import { NormalText } from "../textStyles";
import AppText from "../AppText";

function SkillDetails({ data, skill, index, viewing, isCampus }) {
  const navigation = useNavigation();
  const [deleted, setDeleted] = useState(false);

  const {
    error,
    loading,
    request: updateProfile,
  } = useApi(candidateApi.updateProfile);

  const deleteHandler = async () => {
    const skills = data.skills;
    skills.splice(index, 1);

    await updateProfile({ skills });
    setDeleted(true);
  };

  return deleted ? null : (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <NormalText>{skill.skill_name}</NormalText>
        {viewing && (
          <NormalText color={Colors.primary}>{skill.level}/10</NormalText>
        )}
        {!viewing && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "15%",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("EditProfileDetail", {
                  component: "skills",
                  data: data,
                  index: index,
                  isCampus,
                })
              }
            >
              <Pencil />
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteHandler}>
              <Trash />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* <Slider
        style={{ width: "100%", marginTop: 10 }}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.primary}
        thumbTintColor={Colors.primary}
        minimumValue={0}
        maximumValue={10}
        value={parseInt(skill.level)}
        disabled
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});

export default SkillDetails;
