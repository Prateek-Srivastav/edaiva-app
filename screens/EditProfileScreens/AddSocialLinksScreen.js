import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import AppPicker from "../../components/AppPicker";
import CardInput from "../../components/CardInput";
import candidateApi from "../../api/candidate";
import Colors from "../../constants/Colors";
import CustomButton from "../../components/CustomButton";
import useApi from "../../hooks/useApi";

function AddSocialLinksScreen({ data }) {
  const [selectedSocial, setSelectedSocial] = useState();

  let { facebook, github, instagram, linkedin, twitter } = data.sociallinks;

  const [fb, setFb] = useState(facebook ? facebook : "");
  const [gh, setGh] = useState(github ? github : "");
  const [insta, setInsta] = useState(instagram ? instagram : "");
  const [li, setLi] = useState(linkedin ? linkedin : "");
  const [twt, setTwt] = useState(twitter ? twitter : "");
  // const [showFb, setShowFb] = useState(false);
  const [value, setValue] = useState("");

  const socialMedia = [
    { _id: 1, name: !fb || fb === "" ? "Facebook" : null },
    { _id: 2, name: !gh || gh === "" ? "Github" : null },
    { _id: 3, name: !li || li === "" ? "Linkedin" : null },
    { _id: 4, name: !insta || insta === "" ? "Instagram" : null },
    { _id: 5, name: !twt || twt === "" ? "Twitter" : null },
  ];

  const navigation = useNavigation();

  const {
    error,
    loading,
    request: updateProfile,
  } = useApi(candidateApi.updateProfile);

  const handleChangeLink = (text) => {
    if (selectedSocial === "Facebook") setFb(text);
    else if (selectedSocial === "Github") setGh(text);
    else if (selectedSocial === "Linkedin") setLi(text);
    else if (selectedSocial === "Instagram") setInsta(text);
    else if (selectedSocial === "Twitter") setTwt(text);
    setValue(text);
  };

  const handleSubmit = (values) => {
    const val = {
      facebook: fb,
      github: gh,
      instagram: insta,
      linkedin: li,
      twitter: twt,
    };

    updateProfile({ sociallinks: val });

    setValue("");
    setSelectedSocial(null);
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 15 }}
      style={styles.container}
    >
      {fb !== "" && (
        <>
          <CardInput defaultValue={fb} label="Facebook" />
          <View style={styles.line} />
        </>
      )}
      {gh !== "" && (
        <>
          <CardInput defaultValue={gh} label="Github" />
          <View style={styles.line} />
        </>
      )}
      {li !== "" && (
        <>
          <CardInput defaultValue={li} label="Linkedin" />
          <View style={styles.line} />
        </>
      )}
      {insta !== "" && (
        <>
          <CardInput defaultValue={insta} label="Instagram" />
          <View style={styles.line} />
        </>
      )}
      {twt !== "" && (
        <>
          <CardInput defaultValue={twt} label="Twitter" />
          <View style={styles.line} />
        </>
      )}

      <AppPicker
        label="Choose social media"
        title={selectedSocial ? selectedSocial : "Select"}
        items={socialMedia}
        onSelectItem={(item) => setSelectedSocial(item.name)}
      />
      <CardInput
        label="Link"
        placeholder="Paste Link here..."
        onChangeText={handleChangeLink}
        value={value}
      />
      <CustomButton title="Add" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
  line: {
    // height: 27,
    // alignSelf: "center",
    width: "85%",
    height: 1.6,
    borderRadius: 10,
    // marginHorizontal: 5,
    alignSelf: "center",
    backgroundColor: Colors.grey,
    elevation: 1,
    marginTop: 10,
    marginBottom: 20,
    opacity: 0.1,
  },
});

export default AddSocialLinksScreen;
