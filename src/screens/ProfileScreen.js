import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { useIsFocused } from "@react-navigation/native";

import AuthContext, { UserContext } from "../auth/context";
import authStorage from "../auth/storage";
import cache from "../utilities/cache";
import campusCandidateApi from "../api/campusApis/candidate";
import Card from "../components/Card";
import Colors from "../constants/Colors";
import CustomAlert from "../components/CustomAlert";
import CustomButton from "../components/CustomButton";
import Error from "../components/Error";
import candidateApi from "../api/candidate";
import Loading from "../components/Loading";
import NetworkError from "../components/NetworkError";
import useApi from "../hooks/useApi";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import CustomHeader from "../components/CustomHeader";
import AppText from "../components/AppText";
import { Share } from "../assets/svg/icons";
import applicationApi from "../api/application";
import CreateProfileScreen from "./CreateProfileScreen";

function ProfileScreen({ navigation }) {
  const ICON_SIZE = 18;
  const ICON_COLOR = Colors.primary;

  const { isCampusStudent, isProfileComplete } = useContext(UserContext);

  const [user, setUser] = useState({});
  const [resume, setResume] = useState();
  const [applications, setApplications] = useState();
  const [showMenu, setShowMenu] = useState(false);

  const isFocused = useIsFocused();

  const {
    data: campusProfileData,
    // error,
    // networkError,
    // loading,
    request: loadCampusProfile,
  } = useApi(campusCandidateApi.getProfile);

  const NormalText = (props) => (
    <Text style={styles.normalText}>{props.children}</Text>
  );

  const LargeText = (props) => (
    <Text style={styles.largeText}>{props.children}</Text>
  );

  const {
    data,
    error,
    networkError,
    loading,
    request: loadProfile,
  } = useApi(candidateApi.getProfile);

  const {
    error: resumeError,
    networkError: resumeNetworkError,
    loading: resumeLoading,
    request: uploadResume,
  } = useApi(candidateApi.uploadResume);

  const { data: applicationData, request: loadApplications } = useApi(
    applicationApi.getApplications
  );

  useEffect(async () => {
    await loadProfile();
    loadCampusProfile();
    loadApplications();

    const userDetail = await cache.get("user");
    setUser(userDetail);
  }, [isFocused]);

  const pickDoc = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (result.type === "success") {
      let formData = new FormData();
      formData.append("media_file", {
        uri: result.uri,
        name: result.name,
        type: result.mimeType,
      });

      await uploadResume(formData);
      Toast.show({
        type: "appSuccess",
        text1: `Resume ${data.resume ? "updated" : "uploaded"} successfully!`,
      });
    }
    if (!resumeLoading && !resumeError) setResume(result.uri);

    // console.log(result);
  };

  const viewResume = async () => {
    if (!resume && !data.resume)
      return Toast.show({
        type: "appWarning",
        text1: "Upload a resume first",
      });

    let response;

    if (data.resume) {
      Toast.show({
        type: "appInfo",
        text1: "Downloading your resume!",
      });
      response = await FileSystem.downloadAsync(
        data.resume,
        FileSystem.documentDirectory + "resume.pdf"
      );
    }
    const cUri = await FileSystem.getContentUriAsync(
      resume ? resume : response.uri
    );
    // console.log(cUri);
    if (cUri)
      await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: cUri,
        flags: 1,
        type: "application/pdf",
      });
  };

  const { firstname, lastname, email } = user;

  if (networkError && !loading) return <NetworkError onPress={loadProfile} />;

  if (error) return <Error onPress={loadProfile} />;

  return (
    <>
      <CustomHeader
        navigation={navigation}
        backScreen={!isCampusStudent ? "Jobs" : "CampusJobs"}
        screenName="Profile"
        isMenu
        onRightIconPress={() => setShowMenu(!showMenu)}
      >
        {showMenu && (
          <Card
            touchable
            onPress={() => {
              setShowMenu(false);
              navigation.navigate("ChangePassword");
            }}
          >
            <AppText
              style={{ color: Colors.primary, fontFamily: "OpenSans-Medium" }}
            >
              Change Password
            </AppText>
          </Card>
        )}
      </CustomHeader>
      {loading || !data || !campusProfileData || !applicationData ? (
        <Loading />
      ) : (
        <>
          <View style={styles.container}>
            <Image
              source={
                data.profilepicture
                  ? { uri: data.profilepicture }
                  : require("../assets/dummyDP.png")
              }
              style={{
                height: 100,
                width: 100,
                marginBottom: 5,
                borderRadius: 4,
              }}
            />
            <LargeText>
              {firstname} {lastname}
            </LargeText>
            <NormalText>
              {!isCampusStudent
                ? data.designation
                : campusProfileData[0]?.institution_details[0].institute_name}
            </NormalText>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 30,
                marginBottom: 15,
              }}
            >
              <Card
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  width: "45%",
                  paddingHorizontal: 0,
                  paddingVertical: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    width: "100%",
                  }}
                  onPress={() => navigation.navigate("Applications")}
                >
                  <LargeText>{applicationData?.length}</LargeText>
                  <NormalText>Jobs Applied</NormalText>
                </TouchableOpacity>
              </Card>
              <Card
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  width: "45%",
                  paddingHorizontal: 0,
                  paddingVertical: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    width: "100%",
                  }}
                  onPress={() => navigation.navigate("InterviewsListing")}
                >
                  <LargeText>
                    {data.interview_availability
                      ? data.interview_availability.length
                      : "-"}
                  </LargeText>
                  <NormalText>Interview</NormalText>
                </TouchableOpacity>
              </Card>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: 15,
              }}
            >
              <Card
                style={{
                  alignItems: "center",
                  width: "45%",
                  alignItems: "center",
                }}
                touchable
                onPress={() =>
                  navigation.navigate(
                    !isCampusStudent ? "EditProfile" : "CampusEditProfile"
                  )
                }
              >
                <FontAwesome
                  name="edit"
                  style={styles.icon}
                  size={ICON_SIZE}
                  color={ICON_COLOR}
                />
                <NormalText>Edit Profile</NormalText>
              </Card>
              <Card
                style={{
                  alignItems: "center",
                  width: "45%",
                }}
                touchable
                onPress={() =>
                  navigation.navigate("ViewProfile", {
                    isCampus: isCampusStudent,
                    cgpa: campusProfileData[0]?.cgpa,
                    batchDetails: campusProfileData[0]?.batch_details[0],
                    instituteDetails:
                      campusProfileData[0]?.institution_details[0],
                    registrationNum: campusProfileData[0]?.registration_no,
                  })
                }
              >
                <Share color={Colors.primary} width={18} height={18} />
                <NormalText>{"  "}View Profile</NormalText>
              </Card>
            </View>

            <Card
              style={{ alignItems: "center", width: "97%" }}
              touchable
              onPress={pickDoc}
            >
              {resumeLoading ? (
                <Loading
                  size="small"
                  style={{
                    flex: 0,
                    alignSelf: "flex-end",
                    position: "absolute",
                  }}
                />
              ) : (
                <>
                  <FontAwesome5
                    name="file-upload"
                    style={styles.icon}
                    size={ICON_SIZE}
                    color={ICON_COLOR}
                  />
                  <NormalText>
                    {data.resume || resume ? "Update" : "Upload"} Resume
                  </NormalText>
                </>
              )}
            </Card>

            {(data.resume || resume) && (
              <Card
                style={{ alignItems: "center", width: "97%" }}
                touchable
                onPress={viewResume}
              >
                <FontAwesome5
                  name="file-upload"
                  style={styles.icon}
                  size={ICON_SIZE}
                  color={ICON_COLOR}
                />
                <NormalText>View Resume</NormalText>
              </Card>
            )}
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.bg,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 7,
  },
  normalText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 17,
    color: Colors.primary,
  },
  line: {
    // height: 27,
    width: "80%",
    height: 1,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "#DBDBDB",
    elevation: 1,
    marginBottom: 10,
    opacity: 0.5,
  },
  largeText: {
    fontFamily: "OpenSans-Bold",
    fontSize: 22,
    color: Colors.primary,
    marginBottom: 5,
  },
});

export default ProfileScreen;
