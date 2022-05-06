import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";

import { Pencil, Trash } from "../../assets/svg/icons";
import { formattedDate } from "../../utilities/date";
import Colors from "../../constants/Colors";
import useApi from "../../hooks/useApi";
import candidateApi from "../../api/candidate";
import { SmallText, NormalText, MediumText } from "../textStyles";

function CertificationDetails({
  data,
  certification,
  index,
  viewing,
  isCampus,
}) {
  const navigation = useNavigation();
  const [deleted, setDeleted] = useState(false);

  const { request: updateProfile } = useApi(candidateApi.updateProfile);

  const deleteHandler = async () => {
    const certifications = data.certifications;
    certifications.splice(index, 1);

    await updateProfile({ certifications });
    setDeleted(true);
  };

  return deleted ? null : (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <NormalText>{certification.title}</NormalText>
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
                  component: "certs",
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
        <MediumText>Issued By:</MediumText> {certification.issued_by}
      </SmallText>
      <SmallText>
        <MediumText>Issued on:</MediumText>{" "}
        {formattedDate(certification.issue_date)}
      </SmallText>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <SmallText>
          <MediumText>Certificate ID:</MediumText>{" "}
          {certification.certificate_id}
        </SmallText>
      </View>

      {certification.link !== "" && (
        <TouchableOpacity
          onPress={() => WebBrowser.openBrowserAsync(certification.link)}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <SmallText style={{ color: Colors.primary }}>
            {certification.link}
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

export default CertificationDetails;
