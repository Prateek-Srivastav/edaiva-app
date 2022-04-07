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
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [value, setValue] = useState("");
  const [editValue, setEditValue] = useState("");

  const [fb, setFb] = useState(
    data.sociallinks ? data.sociallinks.facebook : ""
  );
  const [gh, setGh] = useState(data.sociallinks ? data.sociallinks.github : "");
  const [insta, setInsta] = useState(
    data.sociallinks ? data.sociallinks.instagram : ""
  );
  const [li, setLi] = useState(
    data.sociallinks ? data.sociallinks.linkedin : ""
  );
  const [twt, setTwt] = useState(
    data.sociallinks ? data.sociallinks.twitter : ""
  );
  // const [showFb, setShowFb] = useState(false);

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
  };

  const handleSubmit = async (values) => {
    if (selectedSocial === "Facebook") setFb(value);
    else if (selectedSocial === "Github") setGh(value);
    else if (selectedSocial === "Linkedin") setLi(value);
    else if (selectedSocial === "Instagram") setInsta(value);
    else if (selectedSocial === "Twitter") setTwt(value);

    const val = {
      facebook: selectedSocial === "Facebook" ? value : fb,
      github: selectedSocial === "Github" ? value : gh,
      instagram: selectedSocial === "Instagram" ? value : insta,
      linkedin: selectedSocial === "Linkedin" ? value : li,
      twitter: selectedSocial === "Twitter" ? value : twt,
    };

    await updateProfile({ sociallinks: val });
    setValue("");
    setSelectedSocial(null);
  };

  const handleEdit = async (values) => {
    if (selectedSocial === "Facebook") setFb(value);
    else if (selectedSocial === "Github") setGh(value);
    else if (selectedSocial === "Linkedin") setLi(value);
    else if (selectedSocial === "Instagram") setInsta(value);
    else if (selectedSocial === "Twitter") setTwt(value);

    const val = {
      facebook: selectedSocial === "Facebook" ? value : fb,
      github: selectedSocial === "Github" ? value : gh,
      instagram: selectedSocial === "Instagram" ? value : insta,
      linkedin: selectedSocial === "Linkedin" ? value : li,
      twitter: selectedSocial === "Twitter" ? value : twt,
    };

    await updateProfile({ sociallinks: val });
    setValue("");
    setIsEditVisible(false);
    setSelectedSocial(null);
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 15 }}
      style={styles.container}
    >
      {fb !== "" && (
        <>
          <CardInput
            onFocus={() => setIsEditVisible(true)}
            onBlur={() => setIsEditVisible(false)}
            defaultValue={fb}
            label="Facebook"
          />
          {isEditVisible && (
            <CustomButton title="Edit" onPress={handleSubmit} />
          )}
          <View style={styles.line} />
        </>
      )}
      {gh !== "" && (
        <>
          <CardInput
            onFocus={() => setIsEditVisible(true)}
            onBlur={() => setIsEditVisible(false)}
            defaultValue={gh}
            label="Github"
          />
          {isEditVisible && (
            <CustomButton title="Edit" onPress={handleSubmit} />
          )}
          <View style={styles.line} />
        </>
      )}
      {li !== "" && (
        <>
          <CardInput
            onFocus={() => setIsEditVisible(true)}
            onBlur={() => setIsEditVisible(false)}
            defaultValue={li}
            label="Linkedin"
          />
          {isEditVisible && (
            <CustomButton title="Edit" onPress={handleSubmit} />
          )}
          <View style={styles.line} />
        </>
      )}
      {insta !== "" && (
        <>
          <CardInput
            onFocus={() => setIsEditVisible(true)}
            onBlur={() => setIsEditVisible(false)}
            defaultValue={insta}
            label="Instagram"
          />
          {isEditVisible && (
            <CustomButton title="Edit" onPress={handleSubmit} />
          )}
          <View style={styles.line} />
        </>
      )}
      {twt !== "" && (
        <>
          <CardInput
            onFocus={() => setIsEditVisible(true)}
            onBlur={() => setIsEditVisible(false)}
            defaultValue={twt}
            label="Twitter"
          />
          {isEditVisible && (
            <CustomButton title="Edit" onPress={handleSubmit} />
          )}
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
        onChangeText={(text) => setValue(text)}
        // onSubmitEditing={handleChangeLink}
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
