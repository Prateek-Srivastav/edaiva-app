import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { BuildingIcon, Pencil, Trash } from "../../assets/svg/icons";
import { formattedDate } from "../../utilities/date";
import Colors from "../../constants/Colors";
import useApi from "../../hooks/useApi";
import candidateApi from "../../api/candidate";

const SmallText = (props) => (
  <Text style={{ ...styles.smallText, ...props.style }}>{props.children}</Text>
);

const NormalText = (props) => (
  <Text style={styles.normalText}>{props.children}</Text>
);

function ExperienceDetails({ data, experience, index, viewing, isCampus }) {
  const navigation = useNavigation();
  const [deleted, setDeleted] = useState(false);

  const {
    error,
    loading,
    request: updateProfile,
  } = useApi(candidateApi.updateProfile);

  const deleteHandler = async () => {
    const experience = data.experience;
    experience.splice(index, 1);

    await updateProfile({ experience });
    if (!loading && !error) setDeleted(true);
  };

  return deleted ? null : (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <NormalText>{experience.role}</NormalText>
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
                  component: "exp",
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
      <View
        style={{
          flexDirection: "row",
          // justifyContent: "center",
          alignItems: "center",
          marginTop: 7,
        }}
      >
        <BuildingIcon />
        <SmallText style={{ marginLeft: 10 }}>{experience.company}</SmallText>
      </View>
      <View
        style={{
          flexDirection: "row",
          // justifyContent: "center",
          alignItems: "center",
          marginVertical: 7,
        }}
      >
        <MaterialIcons
          style={{ left: -2 }}
          name="access-time"
          size={17}
          color="#817E7E"
        />
        <SmallText>
          {formattedDate(experience.start_date)} -{" "}
          {experience.present ? "Present" : formattedDate(experience.end_date)}
        </SmallText>
      </View>
      <SmallText style={{ marginStart: 0 }}>
        {experience.responsibilities}
      </SmallText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginStart: 7,
  },

  smallText: {
    fontFamily: "OpenSans-Regular",
    fontSize: 15,
    color: Colors.grey,
    marginStart: 7,
  },
  normalText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 16,
    color: Colors.grey,
  },
});

export default ExperienceDetails;
