import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { BuildingIcon, Pencil, Trash } from "../../assets/svg/icons";
import { formattedDate } from "../../utilities/date";
import Colors from "../../constants/Colors";
import useApi from "../../hooks/useApi";
import candidateApi from "../../api/candidate";
import { SmallText, NormalText, MediumText } from "../textStyles";

function AcademicDetails({ data, academic, index, viewing, isCampus }) {
  const navigation = useNavigation();
  const [deleted, setDeleted] = useState(false);

  const {
    error,
    loading,
    request: updateProfile,
  } = useApi(candidateApi.updateProfile);

  const deleteHandler = async () => {
    const academic = data.qualification;
    academic.splice(index, 1);

    await updateProfile({ qualification: academic });
    if (!loading && !error) setDeleted(true);
  };

  return deleted ? null : (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <NormalText>{academic.degree}</NormalText>
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
                  component: "acad",
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
      {academic.specialization !== "" && (
        <View
          style={{
            flexDirection: "row",
            // justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SmallText>
            With specialization in{" "}
            <MediumText>{academic.specialization}</MediumText>
          </SmallText>
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <SmallText>
          {academic.institute} From {formattedDate(academic.start_date)} to{" "}
          {academic.pursuing ? "Present" : formattedDate(academic.end_date)}
        </SmallText>
      </View>

      <SmallText style={{ marginStart: 0 }}>
        {"  "}
        <MediumText>Grade:</MediumText> {academic.grade}
      </SmallText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});

export default AcademicDetails;
