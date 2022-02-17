import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Pencil, Trash } from "../../assets/svg/icons";
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

function CertificationDetails({ data, certification, index, viewing }) {
  const navigation = useNavigation();
  const [deleted, setDeleted] = useState(false);

  const { request: updateProfile } = useApi(candidateApi.updateProfile);

  const deleteHandler = () => {
    const certifications = data.certifications;
    certifications.splice(index, 1);

    updateProfile({ certifications });
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
      <SmallText>Issued By: {certification.issued_by}</SmallText>
      <SmallText>
        Issued on: {formattedDate(certification.issue_date)}
      </SmallText>

      <View
        style={{
          flexDirection: "row",
          // justifyContent: "center",
          alignItems: "center",
          marginTop: 7,
          marginBottom: 12,
        }}
      >
        <SmallText>Certificate ID: {certification.certificate_id}</SmallText>
      </View>

      {certification.link !== "" && (
        <View
          style={{
            flexDirection: "row",
            // justifyContent: "center",
            alignItems: "center",
            marginTop: 7,
          }}
        >
          <SmallText style={{ color: Colors.primary }}>
            {certification.link}
          </SmallText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },

  smallText: {
    fontFamily: "OpenSans-Regular",
    fontSize: 15,
    color: Colors.grey,
    marginStart: 7,
  },
  normalText: {
    fontFamily: "OpenSans-Medium",
    fontSize: 16,
    color: Colors.grey,
  },
});

export default CertificationDetails;
