import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";

import { Pencil, Trash } from "../../assets/svg/icons";
import { formattedDate } from "../../utilities/date";
import Colors from "../../constants/Colors";
import useApi from "../../hooks/useApi";
import candidateApi from "../../api/candidate";
import { SmallText, NormalText, MediumText } from "../textStyles";

function PatentDetails({ data, patent, index, viewing, isCampus }) {
  const navigation = useNavigation();
  const [deleted, setDeleted] = useState(false);

  const { request: updateProfile } = useApi(candidateApi.updateProfile);

  const deleteHandler = async () => {
    const patents = data.patents;
    patents.splice(index, 1);

    await updateProfile({ patents });
    setDeleted(true);
  };

  return deleted ? null : (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <NormalText>
          {patent.title} ({patent.status})
        </NormalText>
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
                  component: "patents",
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
        <MediumText>Patent Office:</MediumText> {patent.patent_office}
      </SmallText>
      <SmallText>
        <MediumText>Issue Date:</MediumText> {formattedDate(patent.issue_date)}
      </SmallText>
      <SmallText>
        <MediumText>Description:</MediumText> {patent.description}
      </SmallText>
      {patent.link && (
        <TouchableOpacity
          onPress={() => WebBrowser.openBrowserAsync(patent.link)}
          style={{
            flexDirection: "row",
            // justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SmallText style={{ color: Colors.primary }}>{patent.link}</SmallText>
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

export default PatentDetails;
