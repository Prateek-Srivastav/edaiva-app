import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";

import { BuildingIcon, Pencil, Trash } from "../../assets/svg/icons";
import { formattedDate } from "../../utilities/date";
import Colors from "../../constants/Colors";
import useApi from "../../hooks/useApi";
import candidateApi from "../../api/candidate";
import { SmallText, NormalText, MediumText } from "../textStyles";

function PublicationDetails({ data, publication, index, viewing, isCampus }) {
  const navigation = useNavigation();
  const [deleted, setDeleted] = useState(false);

  const { request: updateProfile } = useApi(candidateApi.updateProfile);

  const deleteHandler = async () => {
    const publications = data.publications;
    publications.splice(index, 1);

    await updateProfile({ publications });
    setDeleted(true);
  };

  return deleted ? null : (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <NormalText>{publication.title}</NormalText>
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
                  component: "pubs",
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
        <MediumText>Publisher:</MediumText> {publication.publisher}
      </SmallText>
      <SmallText>
        <MediumText>Date:</MediumText> {formattedDate(publication.date)}
      </SmallText>
      <SmallText>
        <MediumText>Description:</MediumText> {publication.description}
      </SmallText>
      {publication.link ? (
        <TouchableOpacity
          onPress={() => WebBrowser.openBrowserAsync(publication.link)}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <SmallText style={{ color: Colors.primary }}>
            {publication.link}
          </SmallText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});

export default PublicationDetails;
