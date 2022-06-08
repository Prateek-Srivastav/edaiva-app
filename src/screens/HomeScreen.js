import React, { useEffect, useState, useContext } from "react";
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
import NoData from "../components/NoData";
import CustomButton from "../components/CustomButton";
import AuthContext from "../auth/context";

const { width } = Dimensions.get("window");

var filterIsVisible = false;

function HomeScreen({ navigation }) {
  const [isPressed, setIsPressed] = useState(false);
  const [filters, setFilters] = useState({});
  const [visible, setVisible] = useState(false);
  const [closeFilter, setCloseFilter] = useState(false);
  const [keyword, setKeyword] = useState();
  const [showOptions, setShowOptions] = useState(false);
  const [sortBy, setSortBy] = useState("latest");

  const isFocused = useIsFocused();
  const { isCampusStudent, setIsTabBarShown, isAuthSkipped } =
    useContext(AuthContext);

  const {
    data,
    error,
    networkError,
    loading,
    request: loadJobs,
  } = useApi(jobsApi.getJobs);

  const numOfPages = data?.pageInfo.total;

  let pageArray = [];

  for (let i = 0; i < numOfPages; i++) pageArray[i] = i + 1;

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
  console.log("IN HOMESCREEN");

  useEffect(() => {
    loadJobTypes();
    loadJobs({ sort: sortBy, ...filters });
    if (!isAuthSkipped) {
      loadInterviews();
      loadProfile();
    }
  }, [isFocused, sortBy, filters]);

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
        } else if (!isCampusStudent) {
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
        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => {
            setSortBy("acco_job_pref");
            setShowOptions(false);
          }}
        >
          <AppText style={{ fontSize: 17 }}>Job Preference</AppText>
        </TouchableOpacity>
      </CustomAlert>
    );
  };

  if (networkError && !loading) return <NetworkError onPress={loadJobs} />;

  if (error) return <Error onPress={loadJobs} />;
  6;

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
                setIsTabBarShown(false);
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
                          {itemData.item.salary && (
                            <View style={styles.filterTextContainer}>
                              <Text
                                style={{
                                  ...styles.greyText,
                                  color: Colors.primary,
                                }}
                              >
                                {itemData.item.salary}
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
                          {itemData.item.remote && (
                            <View style={styles.filterTextContainer}>
                              <Text
                                style={{
                                  ...styles.greyText,
                                  color: Colors.primary,
                                }}
                              >
                                Remote
                              </Text>
                            </View>
                          )}
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
                      {sortBy === "latest"
                        ? "Latest"
                        : sortBy === "popular"
                        ? "Popular"
                        : "Job Preference"}
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
                    renderItem={({ item, index }) => {
                      let location;
                      if (item.job_location?.length !== 0)
                        location = `${
                          item?.job_location[0]?.city
                            ? item?.job_location[0]?.city + ","
                            : null
                        } ${
                          item?.job_location[0]?.state
                            ? item?.job_location[0]?.state + ","
                            : null
                        } ${
                          item?.job_location[0]?.country
                            ? item?.job_location[0]?.country
                            : null
                        }`;

                      let deadline = new Date(item.job_deadline);

                      let daysLeft = Math.round(
                        (deadline - new Date()) / 86400000
                      );

                      if (!item.job_deadline) daysLeft = "";

                      return (
                        <>
                          <JobCard
                            onPress={() =>
                              navigation.navigate("JobDetail", {
                                jobId: item._id,
                                isApplied: item.applied.length !== 0,
                                applicationId: item.applied[0]?._id,
                                location,
                              })
                            }
                            heading={item.job_title}
                            companyName={item.company.name}
                            jobType={item.job_type.name}
                            location={location}
                            description={item.job_description}
                            postedDate={daysLeft}
                            isApplied={item.applied}
                          />
                          {index === data.docs.length - 1 && (
                            <>
                              <FlatList
                                // ref={flatListRef}
                                keyExtractor={(item) => item}
                                style={{
                                  width: "60%",
                                  marginTop: 20,
                                  borderWidth: 1,
                                  borderColor: Colors.cardBlue,
                                  borderRadius: 4,
                                  alignSelf: "center",
                                  elevation: 2,
                                  backgroundColor: "white",
                                }}
                                horizontal
                                data={pageArray}
                                renderItem={({ item, index }) => {
                                  return (
                                    <View
                                      style={{
                                        // borderWidth: 1,
                                        flexDirection: "row",
                                        // borderRightWidth: 1,
                                        // borderRadius: 4,
                                        // paddingStart: 14,
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      {index !== 0 && (
                                        <View style={styles.separator} />
                                      )}
                                      <TouchableOpacity
                                        onPress={() =>
                                          loadJobs({
                                            page: item,
                                            sort: sortBy,
                                            ...filters,
                                          })
                                        }
                                        style={{
                                          paddingHorizontal: 13,
                                          paddingVertical: 8,
                                          margin: 5,
                                          borderRadius: 4,
                                          backgroundColor:
                                            data?.pageInfo.page === item
                                              ? Colors.primary
                                              : Colors.white,
                                        }}
                                      >
                                        <AppText
                                          style={{
                                            color:
                                              data?.pageInfo.page === item
                                                ? Colors.white
                                                : Colors.black,
                                            fontSize: 18,
                                          }}
                                        >
                                          {item}
                                        </AppText>
                                      </TouchableOpacity>
                                    </View>
                                  );
                                }}
                              />
                            </>
                          )}
                        </>
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
  separator: {
    height: 23,
    width: 1.2,
    borderRadius: 10,
    // marginHorizontal: 5,
    backgroundColor: "#D4D4D4",
  },
});

export default HomeScreen;
