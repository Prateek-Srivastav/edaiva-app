import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";

import { Pencil, Trash } from "../../assets/svg/icons";
import Colors from "../../constants/Colors";
import useApi from "../../hooks/useApi";
import candidateApi from "../../api/candidate";
import { SmallText, NormalText, MediumText } from "../textStyles";

function ProjectDetails({ data, project, index, viewing, isCampus }) {
  const navigation = useNavigation();
  const [deleted, setDeleted] = useState(false);

  const { request: updateProfile } = useApi(candidateApi.updateProfile);

  const deleteHandler = async () => {
    const projects = data.projects;
    projects.splice(index, 1);

    await updateProfile({ projects });
    setDeleted(true);
  };

  return deleted ? null : (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <NormalText>{project.title}</NormalText>
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
                  component: "projs",
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
      <View>
        <SmallText>
          <MediumText>Duration:</MediumText> {project.duration}
        </SmallText>
        <SmallText>
          <MediumText>Team Size:</MediumText> {project.team_size}
        </SmallText>

        {/* <SmallText>{project.duration}</SmallText>
        <SmallText>{project.team_size}</SmallText> */}
      </View>
      <View
        style={{
          flexDirection: "row",
          // justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SmallText>
          <MediumText>Role:</MediumText> {project.role}
        </SmallText>
        {/* <SmallText>Worked as {project.role}</SmallText> */}
      </View>

      <SmallText>
        <MediumText>Description:</MediumText> {project.description}
      </SmallText>
      {/* <SmallText style={{}}>{project.description}</SmallText> */}
      {project.link !== "" && (
        <TouchableOpacity
          onPress={() => WebBrowser.openBrowserAsync(project.link)}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <SmallText style={{ color: Colors.primary }}>
            {project.link}
          </SmallText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});

export default ProjectDetails;
