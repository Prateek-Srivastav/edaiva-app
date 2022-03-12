import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";

import AppText from "../AppText";
import Colors from "../../constants/Colors";
import { Pencil } from "../../assets/svg/icons";
import { formattedNumericDate } from "../../utilities/date";

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

function PersonalDetails({ data, onPress, viewing, isCampus }) {
  if (isCampus) {
    var { email } = data;
    var { address1, address2, city, country, state, mobile, pincode } =
      data.profile;
  } else {
    var { address1, address2, city, country, state, mobile, pincode, email } =
      data;
  }

  const { usFormat: usFormatDob } = formattedNumericDate(
    isCampus ? data.profile.dob : data.dob?.$date
  );

  const [dob, setDob] = useState(usFormatDob);

  const address = `${address1 && address1 !== "" ? address1 + ", " : ""}${
    address2 !== "" && address2 ? address2 + ", " : ""
  }${city !== "" && city ? city + ", " : ""}${
    state !== "" && state ? state + ", " : ""
  }${country && country !== "" ? country + ", " : ""}${
    pincode && pincode !== "" ? pincode : ""
  }`;

  return (
    <View style={{ marginHorizontal: 15 }}>
      <DetailHeading
        label="PERSONAL DETAILS"
        onPress={onPress}
        viewing={viewing}
      />
      <View style={{ marginLeft: 7 }}>
        {email && email !== "" ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <AppText>EMAIL:{"  "}</AppText>
            <AppText style={{ color: Colors.black }}>{email} </AppText>
          </View>
        ) : null}
        {mobile && mobile !== "" ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <AppText>PHONE:{"  "}</AppText>
            <AppText style={{ color: Colors.black }}>{mobile} </AppText>
          </View>
        ) : null}
        {dob && dob.$date !== "" ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <AppText>DATE OF BIRTH:{"  "}</AppText>
            <AppText style={{ color: Colors.black }}>{usFormatDob} </AppText>
          </View>
        ) : null}
        <View style={{ flexDirection: "row" }}>
          <AppText>ADDRESS:{"  "}</AppText>
          <AppText style={{ color: Colors.black, flex: 1 }}>{address}</AppText>
        </View>
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
