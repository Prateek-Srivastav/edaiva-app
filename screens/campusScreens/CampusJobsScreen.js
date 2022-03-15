import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";

import AppModal from "../../components/AppModal";
import Colors from "../../constants/Colors";
import dummyData from "../../dummyData.js/dataOriginal";
import FilterModalContent from "../../components/FilterModalContent";
import jobsApi from "../../api/jobs";
import JobCard from "../../components/JobCard";
import AppText from "../../components/AppText";
import CustomButton from "../../components/CustomButton";
import CustomAlert from "../../components/CustomAlert";
import useApi from "../../hooks/useApi";
import { formattedDate } from "../../utilities/date";
import NetworkError from "../../components/NetworkError";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import { useIsFocused } from "@react-navigation/native";
import interviewApi from "../../api/interview";
import candidateApi from "../../api/candidate";
import FilterModal from "../../components/appmodals/FilterModal";
import Card from "../../components/Card";
import formattedTime from "../../utilities/time";
import InterviewReminder from "../../components/interview/InterviewReminder";
import campusJobsApi from "../../api/campusApis/jobs";

const { width, height } = Dimensions.get("window");

function CampusJobsScreen({ navigation }) {
  const [isPressed, setIsPressed] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [filters, setFilters] = useState({});
  const [keyword, setKeyword] = useState();
  const [showOptions, setShowOptions] = useState(false);
  const [sortBy, setSortBy] = useState("latest");

  const isFocused = useIsFocused();

  const {
    data,
    error,
    networkError,
    loading,
    request: loadJobs,
  } = useApi(campusJobsApi.getCampusJobs);

  const {
    data: interviewData,
    loading: interviewLoading,
    request: loadInterviews,
  } = useApi(interviewApi.getInterviews);

  const { data: profileData, request: loadProfile } = useApi(
    candidateApi.getProfile
  );

  let jobs;

  if (data) {
    jobs = data;
  }

  useEffect(() => {
    loadJobs();
    loadInterviews();
    loadProfile();
  }, [isFocused]);

  const getFilters = (appliedFilters) => {
    if (appliedFilters) setFilters(appliedFilters);
    setIsPressed(false);
    loadJobs(appliedFilters);
  };

  const searchHandler = () => {
    loadJobs({ keyword });
  };

  const SortModal = () => {
    return (
      <CustomAlert modalWidth="90%" visible={showOptions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowOptions(false)}
        >
          <Feather name="x" size={20} color={Colors.black} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSortBy("popular");
            setShowOptions(false);
          }}
        >
          <AppText style={{ fontSize: 17 }}>Popular</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => {
            setSortBy("latest");
            setShowOptions(false);
          }}
        >
          <AppText style={{ fontSize: 17 }}>Latest</AppText>
        </TouchableOpacity>
      </CustomAlert>
    );
  };

  return (
    <View style={{ flex: 1, width }}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 15,
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            style={styles.dpContainer}
            onPress={navigation.openDrawer}
          >
            <Image
              source={
                profileData && profileData.profilepicture
                  ? { uri: profileData.profilepicture }
                  : require("../../assets/dummyDP.png")
              }
              style={{ height: 35, width: 35 }}
            />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <Feather name="search" size={24} color={Colors.primary} />
            <TextInput
              style={{ marginLeft: 5, flex: 1 }}
              onChangeText={(text) => setKeyword(text)}
              onSubmitEditing={searchHandler}
            />
          </View>
        </View>
        <View style={{ width: "100%", paddingHorizontal: 15 }}>
          <Image
            source={require("../../assets/Campus.png")}
            resizeMode="contain"
            style={{ width: "100%", marginBottom: -35, marginTop: -25 }}
          />
        </View>
        {loading || interviewLoading ? (
          <Loading />
        ) : networkError && !loading ? (
          <NetworkError onPress={() => loadJobs()} />
        ) : error && !loading ? (
          <Error onPress={() => loadJobs()} />
        ) : (
          <>
            {interviewData &&
              interviewData.length !== 0 &&
              interviewData?.map((interviewDetails) => {
                if (
                  formattedDate(interviewDetails.scheduled_from) ===
                    formattedDate(new Date()) &&
                  !interviewDetails.interview_completed
                )
                  <InterviewReminder interviewDetails={interviewDetails} />;
              })}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 15,
                marginTop: 5,
              }}
            >
              <Text
                style={{
                  ...styles.greyText,
                  fontFamily: "OpenSans-Medium",
                  color: Colors.black,
                  marginStart: 2,
                }}
              >
                {jobs ? jobs.length : ""} Jobs found
              </Text>
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                  justifyContent: "center",
                  alignSelf: "flex-end",
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={() => setShowOptions(true)}
                >
                  <Text
                    style={{
                      ...styles.greyText,
                      color: Colors.primary,
                      // marginStart: 20,
                    }}
                  >
                    {sortBy === "latest" ? "Latest" : "Popular"}
                  </Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
                <SortModal />
              </View>
            </View>
            <View
              style={{
                width: "100%",
                flex: 1,
              }}
            >
              <FlatList
                keyExtractor={(item) => item._id}
                contentContainerStyle={{
                  paddingHorizontal: 15,
                  paddingBottom: 20,
                }}
                data={jobs}
                renderItem={(itemData) => {
                  // const { city, state, country } =
                  //   itemData.item.job_location[0];

                  const location = `${itemData.item.campus_job_id.job_location[0]?.city}, ${itemData.item.campus_job_id.job_location[0]?.state}, ${itemData.item.campus_job_id.job_location[0]?.country}`;

                  return (
                    <JobCard
                      onPress={() =>
                        navigation.navigate("JobDetail", {
                          jobId: itemData.item._id,
                          isApplied:
                            itemData.item.application_status.length !== 0,
                          applicationId:
                            itemData.item.application_status[0]?._id,
                          location,
                          isCampus: true,
                        })
                      }
                      heading={itemData.item.campus_job_id.job_title}
                      companyName={itemData.item.campus_job_id.company_id.name}
                      jobType={itemData.item.campus_job_id.job_type[0].name}
                      location={location}
                      description={itemData.item.campus_job_id.job_description}
                      postedDate={formattedDate(itemData.item.createdAt)}
                      isApplied={itemData.item.application_status}
                    />
                  );
                }}
              />
            </View>
          </>
        )}
      </View>
      <FilterModal
        data={data}
        isPressed={isPressed}
        sendData={getFilters}
        sendIsPressed={() => setIsPressed(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 20,
    width: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    top: -10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDFDFD",
    paddingTop: StatusBar.currentHeight,
  },
  dpContainer: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    borderRadius: 3,
  },
  filterContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#0AB4F14D",
    borderRadius: 3,
    paddingStart: 8,
    marginHorizontal: 15,
    paddingVertical: 5,
    marginTop: 20,
  },
  filterIconContainer: {
    padding: 7,
    backgroundColor: "#FFFFFF",
    elevation: 3,
    borderRadius: 3,
  },
  filterTextContainer: {
    flexDirection: "row",
    borderRadius: 3,
    backgroundColor: "#B9ECFF4D",
    borderColor: "#0AB4F14D",
    borderWidth: 1,
    marginHorizontal: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  greyText: {
    fontSize: 13,
    fontFamily: "OpenSans-Regular",
    color: "#6C6C6C",
  },
  header: {
    backgroundColor: Colors.primary,
    elevation: 5,
    paddingTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#FFFFFF",
    elevation: 3,
    marginLeft: 10,
    borderRadius: 3,
    // width: "100%",
  },
  line: {
    height: 27,
    width: 1.2,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: "#D4D4D4",
  },

  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: "#00000040",
  },
  panelHeader: { alignItems: "center" },
});

export default CampusJobsScreen;
