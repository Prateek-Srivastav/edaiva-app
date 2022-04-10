import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

import AppPicker from "../components/AppPicker";
import { AppForm, ErrorMessage, SubmitButton } from "../components/forms";
import AppFormCardInput from "../components/forms/AppFormCardInput";
import CardInput from "../components/CardInput";
import DatePicker from "../components/DatePicker";
import locationApi from "../api/location";
import userApi from "../api/user";
import candidateApi from "../api/candidate";
import useApi from "../hooks/useApi";
import { useNavigation } from "@react-navigation/native";
import cache from "../utilities/cache";
import { formattedDate, formattedNumericDate } from "../utilities/date";
import AppText from "../components/AppText";
import Colors from "../constants/Colors";
import CustomHeader from "../components/CustomHeader";
import jobsApi from "../api/jobs";
import { Feather, AntDesign } from "@expo/vector-icons";
import Loading from "../components/Loading";
import showToast from "../components/ShowToast";
import CustomButton from "../components/CustomButton";

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required().label("First Name"),
  lastname: Yup.string().required().label("Last Name"),
  designation: Yup.string().required().label("Designation"),
  city: Yup.string().required().label("City"),
  pincode: Yup.string().required().label("Pincode"),
});

const SelectedInputs = (array) => {
  return array.map((item) => (
    <View
      style={{
        flexDirection: "row",
        borderWidth: 1,
        alignSelf: "flex-start",
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#0AB4F14D",
        backgroundColor: "#B9ECFF4D",
        borderRadius: 3,
        marginLeft: 10,
        marginTop: 10,
      }}
    >
      <AppText style={{ marginHorizontal: 5, color: Colors.primary }}>
        {item}
      </AppText>
      <TouchableOpacity
        onPress={() => {
          const index = array.indexOf(item);
          array.splice(index, 1);
        }}
        style={{
          borderWidth: 1,
          margin: 3,
          borderColor: "#0AB4F14D",
          borderRadius: 3,
        }}
      >
        <Feather name="x" size={17} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  ));
};

function PreferenceScreen() {
  const navigation = useNavigation();

  const [experience, setExperience] = useState(null);
  const [jobType, setJobType] = useState([]);
  const [jobTypeName, setJobTypeName] = useState([]);
  const [keywordText, setKeywordText] = useState();
  const [keywordArray, setKeywordArray] = useState([]);
  const [prefJobRoleText, setPrefJobRoleText] = useState();
  const [prefJobRoleArray, setPrefJobRoleArray] = useState([]);

  const {
    data,
    error,
    networkError,
    loading,
    request: loadProfile,
  } = useApi(candidateApi.getProfile);

  const {
    data: jobTypes,
    loading: jobTypesLoading,
    request: loadJobTypes,
  } = useApi(jobsApi.getJobTypes);

  const { request: updateProfile, res } = useApi(candidateApi.updateProfile);

  // const jobTypes = [
  //   { _id: 1, name: "Full Time" },
  //   { _id: 2, name: "Part Time" },
  //   { _id: 3, name: "Internship" },
  // ];

  const experiences = [
    { _id: 1, name: "All" },
    { _id: 2, name: "0-2 Years" },
    { _id: 3, name: "3-5 Years" },
    { _id: 4, name: "5-10 Years" },
    { _id: 5, name: "10-15 Years" },
    { _id: 6, name: "15+ Years" },
  ];

  useEffect(() => {
    loadScreen();
    loadJobTypes();
  }, []);

  const loadScreen = async () => {
    const response = await candidateApi.getProfile();

    const jobTypesResponse = await jobsApi.getJobTypes();

    console.log(response);
    if (!response.ok)
      return showToast({ type: "appError", message: "Something went wrong!" });

    setPrefJobRoleArray(
      response.data.job_preference ? response.data.job_preference.job_roles : []
    );
    setJobType(
      response.data.job_preference.job_types
        ? response.data.job_preference.job_types
        : []
    );
    setKeywordArray(
      response.data.job_preference ? response.data.job_preference.keywords : []
    );
    setExperience(response.data.job_preference.experience);

    // for (_id in jobTypes) {
    //   let typeName = jobTypes.filter((jobtype) => {
    //     if (jobtype._id === response.data.job_preference.job_type[index])
    //       return jobtype.name;
    //   });

    //   setJobTypeName(typeName);
    // }
    response.data.job_preference.job_type.forEach((e) => {
      let typeName = jobTypesResponse.data.filter((jobtype) => {
        if (jobtype._id === e) return jobtype.name;
      });
      setJobTypeName([...jobTypeName, typeName.name]);
      console.log(typeName);
    });

    console.log(jobTypeName + "helllllllllllllllllllooooooooooooooooo");
  };

  const handleSubmit = async () => {
    const val = {
      job_roles: prefJobRoleArray,
      job_type: jobType,
      keywords: keywordArray,
      experience: experience !== "All" ? experience : null,
    };

    console.log(val);

    await updateProfile({ job_preference: val });
    return navigation.goBack();
  };

  return (
    <>
      <CustomHeader
        navigation={navigation}
        backScreen="Home"
        screenName={"Job Preferences"}
      />
      {loading || jobTypesLoading ? (
        <Loading />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 15 }}
          style={styles.container}
        >
          <AppText style={{ marginBottom: 10 }}>
            Add/Update your job preferences, we will recommend jobs which is
            best match for your interest.
          </AppText>

          <AppPicker
            selectedItem={jobType}
            onSelectItem={(item) => {
              if (jobType?.find((type) => type === item._id)) {
                console.log(jobType);
                return;
              }
              setJobType([...jobType, item._id]);
              if (!jobTypeName?.find((type) => type === item.name))
                setJobTypeName([...jobTypeName, item.name]);
            }}
            multiSelect
            name="jobType"
            title={
              jobTypeName
                ? jobTypeName.map((jobtype) => jobtype + ", ")
                : "Select"
            }
            items={jobTypes}
            label="JOB TYPE"
          />

          <AppPicker
            selectedItem={experience}
            onSelectItem={(item) => {
              let exp = item.name;
              exp = exp.split(" ");
              setExperience(exp[0]);
            }}
            name="experience"
            title={
              experience
                ? experience + (experience !== "All" ? " Years" : "")
                : "Experience"
            }
            items={experiences}
            label="EXPERIENCE"
          />

          <CardInput
            label={"PREFERRED JOB ROLES"}
            name="jobRoles"
            placeholder="Type and hit enter to add."
            onChangeText={(val) => {
              setPrefJobRoleText(val);
            }}
            onSubmitEditing={() => {
              setPrefJobRoleArray([...prefJobRoleArray, prefJobRoleText]);
              setPrefJobRoleText("");
            }}
            value={prefJobRoleText}
          />

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            {SelectedInputs(prefJobRoleArray)}
          </View>

          <CardInput
            label={"SKILLS & KEYWORDS"}
            name="keywords"
            placeholder="Type and hit enter to add."
            onChangeText={(val) => {
              setKeywordText(val);
            }}
            onSubmitEditing={() => {
              setKeywordArray([...keywordArray, keywordText]);
              setKeywordText("");
            }}
            value={keywordText}
          />
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {SelectedInputs(keywordArray)}
          </View>
          <CustomButton title="Save" onPress={handleSubmit} />
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 15,
    // alignItems: "center",
    backgroundColor: Colors.bg,
  },
});

export default PreferenceScreen;
