import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import AppPicker from "../../components/AppPicker";
import CardInput from "../../components/CardInput";
import candidateApi from "../../api/candidate";
import Colors from "../../constants/Colors";
import CustomButton from "../../components/CustomButton";
import useApi from "../../hooks/useApi";
import * as Yup from "yup";
import { ErrorMessage } from "../../components/forms";
import showToast from "../../components/ShowToast";

const validationSchema = Yup.object().shape({
  link: Yup.string().url().label("Link"),
});

function AddSocialLinksScreen({ data }) {
  const [selectedSocial, setSelectedSocial] = useState();
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [value, setValue] = useState("");
  const [linkError, setLinkError] = useState(false);
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

  const socialMedia = [
    { _id: 1, name: "Facebook" },
    { _id: 2, name: "Github" },
    { _id: 3, name: "Linkedin" },
    { _id: 4, name: "Instagram" },
    { _id: 5, name: "Twitter" },
  ];

  const navigation = useNavigation();

  const {
    error,
    loading,
    request: updateProfile,
  } = useApi(candidateApi.updateProfile);

  const handleDefaultValue = (socialName) => {
    if (socialName === "Facebook") setValue(fb);
    else if (socialName === "Github") setValue(gh);
    else if (socialName === "Linkedin") setValue(li);
    else if (socialName === "Instagram") setValue(insta);
    else if (socialName === "Twitter") setValue(twt);
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

    if (linkError)
      return showToast({
        type: "appError",
        message: "Please enter a valid link!",
      });

    await updateProfile({ sociallinks: val });
    setValue("");
    setLinkError(false);
    setSelectedSocial(null);
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 15 }}
      style={styles.container}
    >
      {fb !== "" && (
        <>
          <CardInput editable={false} defaultValue={fb} label="Facebook" />
          <View style={styles.line} />
        </>
      )}
      {gh !== "" && (
        <>
          <CardInput editable={false} defaultValue={gh} label="Github" />
          <View style={styles.line} />
        </>
      )}
      {li !== "" && (
        <>
          <CardInput editable={false} defaultValue={li} label="Linkedin" />
          <View style={styles.line} />
        </>
      )}
      {insta !== "" && (
        <>
          <CardInput editable={false} defaultValue={insta} label="Instagram" />
          <View style={styles.line} />
        </>
      )}
      {twt !== "" && (
        <>
          <CardInput editable={false} defaultValue={twt} label="Twitter" />
          <View style={styles.line} />
        </>
      )}

      <AppPicker
        label="Choose social media"
        title={selectedSocial ? selectedSocial : "Select"}
        items={socialMedia}
        onSelectItem={(item) => {
          setSelectedSocial(item.name);
          handleDefaultValue(item.name);
        }}
      />
      <CardInput
        label="Link"
        placeholder="Paste Link here..."
        onChangeText={(text) => {
          validationSchema.isValid({ link: text }).then((val) => {
            return setLinkError(!val);
          });
          setValue(text);
        }}
        value={value}
      />
      <ErrorMessage error="Please enter a valid link" visible={linkError} />
      <CustomButton title="Add" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  line: {
    width: "85%",
    height: 1.6,
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: Colors.grey,
    elevation: 1,
    marginTop: 10,
    marginBottom: 20,
    opacity: 0.1,
  },
});

export default AddSocialLinksScreen;
