import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import AppText from "../../components/AppText";
import cache from "../../utilities/cache";
import campusCandidateApi from "../../api/campusApis/candidate";
import candidateApi from "../../api/candidate";
import Card from "../../components/Card";
import CardInput from "../../components/CardInput";
import Colors from "../../constants/Colors";
import Error from "../../components/Error";
import NetworkError from "../../components/NetworkError";
import useApi from "../../hooks/useApi";
import Loading from "../../components/Loading";
import PersonalDetails from "../../components/profileDetails/PersonalDetails";
import ViewAbout from "../../components/profileDetails/ViewAbout";
import ExperienceDetails from "../../components/profileDetails/ExperienceDetails";
import { Pencil } from "../../assets/svg/icons";
import AcademicDetails from "../../components/profileDetails/AcademicDetails";
import SkillDetails from "../../components/profileDetails/SkillDetails";
import ProjectDetails from "../../components/profileDetails/ProjectDetails";
import CertificationDetails from "../../components/profileDetails/CertificationDetails";
import AchievementDetails from "../../components/profileDetails/AchievementDetails";
import PublicationDetails from "../../components/profileDetails/PublicationDetails";
import PatentDetails from "../../components/profileDetails/PatentDetails";
import SocialLinkDetails from "../../components/profileDetails/SocialLinkDetails";
import Toast from "react-native-toast-message";
import CustomHeader from "../../components/CustomHeader";
import BatchDetails from "../../components/profileDetails/BatchDetails";
import InstituteDetails from "../../components/profileDetails/InstituteDetails";

const { width, height } = Dimensions.get("window");

const SmallText = (props) => (
  <Text style={styles.smallText}>{props.children}</Text>
);

const NormalText = (props) => (
  <Text style={styles.normalText}>{props.children}</Text>
);

const LargeText = (props) => (
  <Text style={styles.largeText}>{props.children}</Text>
);

function CampusEditProfileScreen() {
  const [user, setUser] = useState({});
  const [aboutFocused, setAboutFocused] = useState(false);
  const [about, setAbout] = useState();
  const [cgpaFocused, setCgpaFocused] = useState(false);
  const [cgpa, setCgpa] = useState();
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [profilePicture, setProfilePicture] = useState();

  const navigation = useNavigation();

  const {
    data: campusProfileData,
    error,
    networkError,
    loading,
    request: loadProfile,
  } = useApi(campusCandidateApi.getProfile);

  var data;
  if (campusProfileData) data = campusProfileData[0]?.candidate_details.profile;

  const {
    error: aboutUpdateError,
    loading: aboutUpdateLoading,
    request: updateAbout,
  } = useApi(campusCandidateApi.updateProfile);

  const {
    error: cgpaUpdateError,
    loading: cgpaUpdateLoading,
    request: updateCgpa,
  } = useApi(campusCandidateApi.updateProfile);

  const {
    loading: dpLoading,
    error: dpError,
    request: updateProfilePic,
  } = useApi(candidateApi.uploadProfilePicture);

  const isFocused = useIsFocused();

  useEffect(async () => {
    loadProfile();

    const userDetail = await cache.get("user");
    setUser(userDetail);
    setAbout(data.description);
    async () => {
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(granted);
    };
  }, [isFocused]);

  const updateDp = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      let localUri = result.uri;
      let filename = localUri.split("/").pop();

      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      let formData = new FormData();
      formData.append("media_file", { uri: localUri, name: filename, type });

      updateProfilePic(formData);
    }
    if (!dpLoading && !dpError) setProfilePicture(result.uri);
  };

  if (galleryPermission === false)
    return Toast.show({
      type: "appError",
      text1: "No access to media storage.",
    });

  if (networkError && !loading) return <NetworkError onPress={loadProfile} />;

  if (error) return <Error onPress={loadProfile} />;

  const handleAboutSubmit = (text) => {
    updateAbout({ description: about });
    setAboutFocused(false);
  };

  const handleCgpaSubmit = (text) => {
    updateCgpa({ cgpa: cgpa });
    setCgpaFocused(false);
  };

  const DetailHeading = ({ label, onPress }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // borderWidth: 1,
        width: "100%",
      }}
    >
      <SmallText>{label}</SmallText>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* <View style={styles.buttonContainer}> */}
        <TouchableOpacity onPress={onPress}>
          <View style={styles.button}>
            <Pencil />
          </View>
        </TouchableOpacity>

        {/* </View> */}
      </View>
    </View>
  );

  const AddDetails = (props) => {
    return (
      <>
        <View
          style={{
            marginHorizontal: 15,
            marginBottom: props.isNotLine ? 20 : 0,
          }}
        >
          <SmallText>{props.label.toUpperCase()}</SmallText>
          {props.children}
          <TouchableOpacity
            onPress={props.onPress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              marginBottom: 5,
            }}
          >
            <AntDesign
              name="plus"
              size={17}
              color={Colors.primary}
              style={{ marginRight: 10 }}
            />
            <NormalText>Add {props.label}</NormalText>
          </TouchableOpacity>
        </View>
        {!props.isNotLine && <View style={styles.line} />}
      </>
    );
  };

  return (
    <>
      <CustomHeader
        navigation={navigation}
        backScreen="Profile"
        screenName="Edit Profile"
      />
      {loading || !data ? (
        <Loading />
      ) : (
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              elevation: 3,
              borderRadius: 9,
              paddingVertical: 20,
              backgroundColor: "white",
              marginBottom: 5,
            }}
          >
            {dpLoading ? (
              <Loading size="small" />
            ) : (
              <TouchableOpacity onPress={updateDp}>
                <Image
                  source={
                    data.profilepicture
                      ? {
                          uri: profilePicture
                            ? profilePicture
                            : data.profilepicture,
                        }
                      : require("../../assets/dummyDP.png")
                  }
                  style={{
                    height: 70,
                    width: 70,
                    marginRight: 5,
                    marginLeft: 8,
                    borderRadius: 4,
                  }}
                />
              </TouchableOpacity>
            )}
            <View style={{ width: "70%", marginRight: 5 }}>
              <LargeText>
                {user.firstname} {user.lastname}
              </LargeText>
              {data.designation !== "" && (
                <Card
                  style={{ justifyContent: "flex-start", paddingVertical: 5 }}
                >
                  <NormalText>{data.designation}</NormalText>
                </Card>
              )}
            </View>
          </View>
          <ScrollView>
            <PersonalDetails
              data={campusProfileData[0]?.candidate_details}
              onPress={() =>
                navigation.navigate("EditProfileDetail", {
                  component: "personal",
                  data: campusProfileData[0]?.candidate_details,
                  isCampus: true,
                })
              }
              isCampus={true}
            />

            <View style={{ ...styles.line, marginTop: 15 }} />
            <View style={{ marginHorizontal: 15 }}>
              <DetailHeading
                label="ABOUT"
                onPress={() => setAboutFocused(!aboutFocused)}
              />
              {!aboutFocused ? (
                aboutUpdateLoading ? (
                  <Loading />
                ) : (
                  <ViewAbout
                    data={about && !aboutUpdateError ? about : data.description}
                  />
                )
              ) : (
                <CardInput
                  numberOfLines={6}
                  multiline
                  placeholder="Tell something about you..."
                  defaultValue={
                    about && !aboutUpdateError ? about : data?.description
                  }
                  onBlur={handleAboutSubmit}
                  onChangeText={(text) => setAbout(text)}
                  onSubmitEditing={handleAboutSubmit}
                />
              )}
            </View>
            <View style={styles.line} />
            <View style={{ marginHorizontal: 15 }}>
              <DetailHeading
                label="CGPA"
                onPress={() => setCgpaFocused(!cgpaFocused)}
              />
              {!cgpaFocused ? (
                cgpaUpdateLoading ? (
                  <Loading />
                ) : (
                  <View style={{ flexDirection: "row" }}>
                    <AppText>
                      {"  "}Current CGPA:{"  "}
                    </AppText>
                    <AppText style={{ color: Colors.black }}>
                      {cgpa && !cgpaUpdateError
                        ? cgpa
                        : campusProfileData[0]?.cgpa}
                    </AppText>
                  </View>
                )
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <AppText>Current CGPA:{"  "}</AppText>
                  <CardInput
                    style={{
                      width: "20%",
                      height: 30,

                      marginBottom: 0,
                    }}
                    numberOfLines={1}
                    defaultValue={
                      cgpa && !cgpaUpdateError
                        ? cgpa
                        : campusProfileData[0]?.cgpa
                    }
                    onBlur={handleCgpaSubmit}
                    onChangeText={(text) => setCgpa(text)}
                    onSubmitEditing={handleCgpaSubmit}
                  />
                </View>
              )}
            </View>

            <View style={styles.line} />

            <BatchDetails
              batchDetails={campusProfileData[0]?.batch_details[0]}
              data={campusProfileData}
            />

            <View style={styles.line} />

            <InstituteDetails
              instituteDetails={campusProfileData[0]?.institution_details[0]}
            />

            <View style={styles.line} />

            <AddDetails
              label="Experience"
              onPress={() =>
                navigation.navigate("EditProfileDetail", {
                  component: "exp",
                  data,
                  isCampus: true,
                })
              }
            >
              {data.experience?.map((exp) => (
                <ExperienceDetails
                  experience={exp}
                  data={data}
                  index={data.experience.indexOf(exp)}
                  isCampus={true}
                />
              ))}
            </AddDetails>
            <AddDetails
              label="Academics"
              onPress={() =>
                navigation.navigate("EditProfileDetail", {
                  component: "acad",
                  data,
                  isCampus: true,
                })
              }
            >
              {data.qualification?.map((qual) => (
                <AcademicDetails
                  academic={qual}
                  data={data}
                  index={data.qualification.indexOf(qual)}
                  isCampus={true}
                />
              ))}
            </AddDetails>
            <AddDetails
              label="Skills"
              onPress={() =>
                navigation.navigate("EditProfileDetail", {
                  component: "skills",
                  data,
                  isCampus: true,
                })
              }
            >
              {data.skills?.map((skill) => (
                <SkillDetails
                  skill={skill}
                  data={data}
                  index={data.skills.indexOf(skill)}
                  isCampus={true}
                />
              ))}
            </AddDetails>
            <AddDetails
              label="Projects"
              onPress={() =>
                navigation.navigate("EditProfileDetail", {
                  component: "projs",
                  data,
                  isCampus: true,
                })
              }
            >
              {data.projects?.map((project) => (
                <ProjectDetails
                  project={project}
                  data={data}
                  index={data.projects.indexOf(project)}
                  isCampus={true}
                />
              ))}
            </AddDetails>
            <AddDetails
              label="Certifications"
              onPress={() =>
                navigation.navigate("EditProfileDetail", {
                  component: "certs",
                  data,
                  isCampus: true,
                })
              }
            >
              {data.certifications?.map((certification) => (
                <CertificationDetails
                  certification={certification}
                  data={data}
                  index={data.certifications.indexOf(certification)}
                  isCampus={true}
                />
              ))}
            </AddDetails>
            <AddDetails
              label="Publications"
              onPress={() =>
                navigation.navigate("EditProfileDetail", {
                  component: "pubs",
                  data,
                  isCampus: true,
                })
              }
            >
              {data.publications?.map((publication) => (
                <PublicationDetails
                  publication={publication}
                  data={data}
                  index={data.publications.indexOf(publication)}
                  isCampus={true}
                />
              ))}
            </AddDetails>
            <AddDetails
              label="Patents"
              onPress={() =>
                navigation.navigate("EditProfileDetail", {
                  component: "patents",
                  data,
                  isCampus: true,
                })
              }
            >
              {data.patents?.map((patent) => (
                <PatentDetails
                  patent={patent}
                  data={data}
                  index={data.patents.indexOf(patent)}
                  isCampus={true}
                />
              ))}
            </AddDetails>
            <AddDetails
              label="Achievements"
              onPress={() =>
                navigation.navigate("EditProfileDetail", {
                  component: "achievements",
                  data,
                  isCampus: true,
                })
              }
            >
              {data.achievements?.map((achievement) => (
                <AchievementDetails
                  achievement={achievement}
                  data={data}
                  index={data.achievements.indexOf(achievement)}
                  isCampus={true}
                />
              ))}
            </AddDetails>
            <AddDetails
              isNotLine
              label="Social Links"
              onPress={() =>
                navigation.navigate("EditProfileDetail", {
                  component: "socialLinks",
                  data,
                  isCampus: true,
                })
              }
            >
              <SocialLinkDetails sociallinks={data.sociallinks} />
            </AddDetails>
          </ScrollView>
        </View>
      )}
    </>
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
  buttonContainer: {
    height: 36,
    width: 36,
    // borderWidth: 1,
    borderRadius: 18,
    overflow: "hidden",
    // position: "absolute",
    // right: 30,
  },
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // alignSelf: "space-around",
    backgroundColor: Colors.bg,
    // paddingTop: 40,
  },
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
  smallText: {
    fontFamily: "OpenSans-Medium",
    fontSize: 15.5,
    color: Colors.primary,
  },
  normalText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 17,
    color: Colors.primary,
  },
  largeText: {
    fontFamily: "OpenSans-Bold",
    fontSize: 22,
    color: Colors.primary,
    // marginBottom: 5,
  },
});

export default CampusEditProfileScreen;
