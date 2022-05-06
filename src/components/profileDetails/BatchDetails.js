import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { BuildingIcon, Pencil, Trash } from "../../assets/svg/icons";
import { formattedDate } from "../../utilities/date";
import Colors from "../../constants/Colors";
import useApi from "../../hooks/useApi";
import campusCandidateApi from "../../api/campusApis/candidate";
import Loading from "../Loading";
import CardInput from "../CardInput";

const SmallText = (props) => (
  <Text style={{ ...styles.smallText, ...props.style }}>{props.children}</Text>
);

const NormalText = (props) => (
  <Text style={{ ...styles.normalText, ...props.style }}>{props.children}</Text>
);

function BatchDetails({ data, batchDetails, viewing }) {
  const [registrationNum, setRegistrationNum] = useState();
  const [registrationNumFocused, setRegistrationNumFocused] = useState();

  const {
    error,
    loading,
    request: updateRegistrationNum,
  } = useApi(campusCandidateApi.updateProfile);

  const handleRegistrationNumSubmit = () => {
    updateRegistrationNum({ registration_no: registrationNum });
    setRegistrationNumFocused(false);
  };

  return (
    <View style={styles.container}>
      <NormalText style={{ color: Colors.primary, marginBottom: 10 }}>
        BATCH
      </NormalText>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <NormalText>
          {"  "}
          {batchDetails.name} ({batchDetails.start_year} -{" "}
          {batchDetails.end_year})
        </NormalText>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {!registrationNumFocused ? (
          loading ? (
            <Loading />
          ) : (
            <View style={{ flexDirection: "row" }}>
              <NormalText>
                {"  "}Registration No.:{"  "}
              </NormalText>
              <SmallText>
                {registrationNum && !error
                  ? registrationNum
                  : data[0].registration_no}
              </SmallText>
              {!viewing && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "15%",
                    marginStart: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      setRegistrationNumFocused(!registrationNumFocused)
                    }
                  >
                    <Pencil />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <NormalText>
              {"  "}Registration No.:{"  "}
            </NormalText>
            <CardInput
              style={{
                // width: "20%",
                flex: 1,
                height: 30,
                marginBottom: 0,
              }}
              numberOfLines={1}
              defaultValue={
                registrationNum && !error
                  ? registrationNum
                  : data[0].registration_no
              }
              value={registrationNum}
              onBlur={handleRegistrationNumSubmit}
              onChangeText={(text) => setRegistrationNum(text)}
              onSubmitEditing={handleRegistrationNumSubmit}
            />
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
        <NormalText>
          {"  "}Established on:{"  "}
        </NormalText>
        <SmallText>{formattedDate(batchDetails.createdAt)}</SmallText>
      </View>
      <View
        style={{
          flexDirection: "row",
          // justifyContent: "center",
          alignItems: "center",
          marginTop: 7,
        }}
      >
        <NormalText>
          {"  "}Description:{"  "}
        </NormalText>
        <SmallText>{batchDetails.description}</SmallText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },

  smallText: {
    fontFamily: "OpenSans-Regular",
    fontSize: 15,
    color: Colors.grey,
    // marginStart: 7,
  },
  normalText: {
    fontFamily: "OpenSans-Medium",
    fontSize: 15.5,
    color: Colors.grey,
  },
});

export default BatchDetails;
