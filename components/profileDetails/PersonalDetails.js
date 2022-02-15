import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";

import AppText from "../AppText";
import Colors from "../../constants/Colors";
import { Pencil } from "../../assets/svg/icons";

const SmallText = (props) => (
  <Text style={styles.smallText}>{props.children}</Text>
);

const DetailHeading = ({ label, onPress, viewing }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      // borderWidth: 1,
      width: "100%",
      marginVertical: 6,
    }}
  >
    <SmallText>{label}</SmallText>

    {!viewing && (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.button}>
            <Pencil />
          </View>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

function PersonalDetails({ data, onPress, viewing }) {
  const {
    email,
    mobile,
    dob,
    address1,
    address2,
    city,
    state,
    country,
    pincode,
  } = data;

  const address = `${address1 !== "" ? address1 + ", " : ""}${
    address2 !== "" ? address2 + ", " : ""
  }${city !== "" ? city + ", " : ""}${state !== "" ? state + ", " : ""}${
    country !== "" ? country + ", " : ""
  }${pincode !== "" ? pincode : ""}`;

  return (
    <View style={{ marginHorizontal: 15 }}>
      <DetailHeading
        label="Personal Details"
        onPress={onPress}
        viewing={viewing}
      />
      {email && email !== "" ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AppText>EMAIL:{"  "}</AppText>
          <AppText style={{ color: Colors.black }}>{email} </AppText>
        </View>
      ) : null}
      {mobile && mobile !== "" ? (
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}
        >
          <AppText>PHONE:{"  "}</AppText>
          <AppText style={{ color: Colors.black }}>{mobile} </AppText>
        </View>
      ) : null}
      {dob && dob.$date !== "" ? (
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}
        >
          <AppText>DATE OF BIRTH:{"  "}</AppText>
          <AppText style={{ color: Colors.black }}>{dob.$date} </AppText>
        </View>
      ) : null}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}
      >
        <AppText>ADDRESS:{"  "}</AppText>
        <AppText style={{ color: Colors.black }}>{address}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 36,
    width: 36,
    // borderWidth: 1,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    right: -9,
  },
  smallText: {
    fontFamily: "OpenSans-Medium",
    fontSize: 15.5,
    color: Colors.primary,
  },
});

export default PersonalDetails;
