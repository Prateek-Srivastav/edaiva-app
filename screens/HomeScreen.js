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
  BackHandler,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";

import Colors from "../constants/Colors";
import jobsApi from "../api/jobs";
import JobCard from "../components/JobCard";
import AppText from "../components/AppText";
import CustomAlert from "../components/CustomAlert";
import useApi from "../hooks/useApi";
import { formattedDate } from "../utilities/date";
import NetworkError from "../components/NetworkError";
import Error from "../components/Error";
import Loading from "../components/Loading";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import interviewApi from "../api/interview";
import candidateApi from "../api/candidate";
import FilterModal from "../components/appmodals/FilterModal";
import InterviewReminder from "../components/interview/InterviewReminder";
import campusCandidateApi from "../api/campusApis/candidate";
import cache from "../utilities/cache";
import NoData from "../components/NoData";
import CustomButton from "../components/CustomButton";

const { width } = Dimensions.get("window");

var filterIsVisible = false;

function HomeScreen({ navigation }) {
  const [isPressed, setIsPressed] = useState(false);
  // const [interviews, setInterviews] = useState([]);
  const [filters, setFilters] = useState({});
  const [visible, setVisible] = useState(false);
  const [closeFilter, setCloseFilter] = useState(false);
  const [keyword, setKeyword] = useState();
  const [showOptions, setShowOptions] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [campusStudent, setCampusStudent] = useState(false);

  const isFocused = useIsFocused();

  const { data: campusProfileData, request: loadCampusProfile } = useApi(
    campusCandidateApi.getProfile
  );

  const {
    data,
    error,
    networkError,
    loading,
    request: loadJobs,
    res,
  } = useApi(jobsApi.getJobs);

  const {
    data: jobTypesData,
    error: jobTypesError,
    networkError: jobTypesNetworkError,
    loading: jobTypesLoading,
    request: loadJobTypes,
  } = useApi(jobsApi.getJobTypes);

  const {
    data: interviewData,
    loading: interviewLoading,
    request: loadInterviews,
  } = useApi(interviewApi.getInterviews);

  const { data: profileData, request: loadProfile } = useApi(
    candidateApi.getProfile
  );

  const isCampusStudent = async () => {
    await cache.store("isCampusStudent", true);
    const isCampus = await cache.get("isCampusStudent");
    setCampusStudent(isCampus);
  };

  useEffect(() => {
    loadCampusProfile();
    loadJobTypes();
    loadJobs({ sort: sortBy, ...filters });
    loadInterviews();
    // console.log("abcde");
    // setJobs(data.docs);
    loadProfile();
  }, [isFocused, sortBy, filters]);

  if (campusProfileData?.detail !== "Your are not a part of any institution !")
    isCampusStudent();

  const ExitApp = () => {
    return (
      <CustomAlert visible={visible}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              color: Colors.black,
              fontFamily: "OpenSans-Regular",
            }}
          >
            Sure! You want to
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: Colors.black,
              fontFamily: "OpenSans-SemiBold",
            }}
          >
            exit the app ?
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: -40,
          }}
        >
          <CustomButton
            onPress={() => {
              BackHandler.exitApp();
              setVisible(false);
            }}
            title="Yes"
            titleStyle={{ color: Colors.primary }}
            style={{ backgroundColor: "#FFFFFF", elevation: 3 }}
          />
          <CustomButton
            onPress={() => setVisible(false)}
            title="Cancel"
            titleStyle={{ color: Colors.primary }}
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#C1EFFF",
              borderWidth: 1,
              marginLeft: 10,
            }}
          />
        </View>
      </CustomAlert>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (filterIsVisible) {
          filterIsVisible = false;
          setCloseFilter(true);
          setIsPressed(false);
          return true;
        } else if (!campusStudent) {
          setVisible(true);
          return true;
        }
        navigation.navigate("CampusStack");
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const getFilters = (appliedFilters) => {
    if (appliedFilters) setFilters(appliedFilters);
    setIsPressed(false);
    // loadJobs(appliedFilters);
    // setJobs(data.docs);
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

  if (networkError && !loading) return <NetworkError onPress={loadJobs} />;

  if (error) return <Error onPress={loadJobs} />;

  return (
    <>
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
                    : require("../assets/dummyDP.png")
                }
                style={{ height: 35, width: 35 }}
              />
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <Feather name="search" size={24} color={Colors.primary} />
              <TextInput
                style={{ flex: 1, marginLeft: 5 }}
                onChangeText={(text) => setKeyword(text)}
                onSubmitEditing={searchHandler}
                placeholder="Search"
              />
            </View>
            <TouchableOpacity
              style={styles.filterIconContainer}
              onPress={() => {
                filterIsVisible = true;
                setCloseFilter(false);
                setIsPressed(true);
              }}
            >
              <Feather name="filter" size={23} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          {loading || interviewLoading || jobTypesLoading || !data?.docs ? (
            <Loading />
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
              {filters && Object.keys(filters).length !== 0 && (
                <View style={styles.filterContainer}>
                  <Text style={styles.greyText}>Filter</Text>
                  <View style={styles.line} />
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={[filters]}
                    keyExtractor={(index) => index + Math.random()}
                    renderItem={(itemData) => {
                      return (
                        <>
                          {itemData.item.country && (
                            <View style={styles.filterTextContainer}>
                              <Text
                                style={{
                                  ...styles.greyText,
                                  color: Colors.primary,
                                }}
                              >
                                {itemData.item.country}
                              </Text>
                            </View>
                          )}

                          {itemData.item.city && (
                            <View style={styles.filterTextContainer}>
                              <Text
                                style={{
                                  ...styles.greyText,
                                  color: Colors.primary,
                                }}
                              >
                                {itemData.item.city}
                              </Text>
                            </View>
                          )}
                          {itemData.item.state && (
                            <View style={styles.filterTextContainer}>
                              <Text
                                style={{
                                  ...styles.greyText,
                                  color: Colors.primary,
                                }}
                              >
                                {itemData.item.state}
                              </Text>
                            </View>
                          )}
                          {itemData.item.experience && (
                            <View style={styles.filterTextContainer}>
                              <Text
                                style={{
                                  ...styles.greyText,
                                  color: Colors.primary,
                                }}
                              >
                                {itemData.item.experience}
                              </Text>
                            </View>
                          )}
                          {itemData.item.job_type && (
                            <View style={styles.filterTextContainer}>
                              <Text
                                style={{
                                  ...styles.greyText,
                                  color: Colors.primary,
                                }}
                              >
                                {
                                  jobTypesData.filter(
                                    (type) =>
                                      itemData.item.job_type === type._id
                                  )[0].name
                                }
                              </Text>
                            </View>
                          )}
                          {itemData.item.skills?.length !== 0 &&
                            itemData.item.skills?.map((item) => {
                              return (
                                <View style={styles.filterTextContainer}>
                                  <Text
                                    style={{
                                      ...styles.greyText,
                                      color: Colors.primary,
                                    }}
                                  >
                                    {item}
                                  </Text>
                                </View>
                              );
                            })}
                        </>
                      );
                    }}
                  />
                </View>
              )}

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
                  {data.docs ? data.docs.length : ""} Jobs found
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
                {!loading &&
                !error &&
                !networkError &&
                data?.docs.length === 0 ? (
                  <NoData text="Sorry!! No jobs found." canNotRefresh />
                ) : (
                  <FlatList
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{
                      paddingHorizontal: 15,
                      paddingBottom: 20,
                    }}
                    data={data.docs}
                    renderItem={(itemData) => {
                      let location;
                      if (itemData.item.job_location?.length !== 0)
                        location = `${
                          itemData.item?.job_location[0]?.city
                            ? itemData?.item?.job_location[0]?.city + ","
                            : null
                        } ${
                          itemData.item?.job_location[0]?.state
                            ? itemData?.item?.job_location[0]?.state + ","
                            : null
                        } ${
                          itemData.item?.job_location[0]?.country
                            ? itemData?.item?.job_location[0]?.country
                            : null
                        }`;

                      return (
                        <JobCard
                          onPress={() =>
                            navigation.navigate("JobDetail", {
                              jobId: itemData.item._id,
                              isApplied: itemData.item.applied.length !== 0,
                              applicationId: itemData.item.applied[0]?._id,
                              location,
                            })
                          }
                          heading={itemData.item.job_title}
                          companyName={itemData.item.company.name}
                          jobType={itemData.item.job_type.name}
                          location={location}
                          description={itemData.item.job_description}
                          postedDate={formattedDate(itemData.item.created_on)}
                          isApplied={itemData.item.applied}
                        />
                      );
                    }}
                  />
                )}
              </View>
            </>
          )}
        </View>
        <ExitApp />
      </View>
      <FilterModal
        data={data}
        isPressed={isPressed}
        sendData={getFilters}
        closeFilter={closeFilter}
        sendIsPressed={() => setIsPressed(false)}
        jobTypes={jobTypesData}
      />
    </>
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
    marginHorizontal: 10,
    borderRadius: 3,
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

export default HomeScreen;
