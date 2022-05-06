import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Pencil, Trash } from "../../assets/svg/icons";
import { formattedDate } from "../../utilities/date";
import useApi from "../../hooks/useApi";
import candidateApi from "../../api/candidate";
import { SmallText, NormalText, MediumText } from "../textStyles";

function AchievementDetails({ data, achievement, index, viewing, isCampus }) {
  const navigation = useNavigation();
  const [deleted, setDeleted] = useState(false);

  const {
    error,
    loading,
    networkError,
    request: updateProfile,
  } = useApi(candidateApi.updateProfile);

  const deleteHandler = async () => {
    const achievements = data.achievements;
    achievements.splice(index, 1);

    await updateProfile({ achievements });

    if (!loading && !error && !networkError) setDeleted(true);
  };

  return deleted ? null : (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <NormalText>{achievement.title}</NormalText>
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
                  component: "achievements",
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
      <SmallText>
        <MediumText>Date:</MediumText> {formattedDate(achievement.date)}
      </SmallText>
      <SmallText>
        <MediumText>Description: </MediumText>
        {achievement.description}
      </SmallText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});

export default AchievementDetails;
