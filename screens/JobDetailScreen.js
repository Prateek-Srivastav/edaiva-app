import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Share,
  BackHandler,
} from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import RenderHtml, { defaultSystemFonts } from "react-native-render-html";

import { BuildingIcon, Location } from "../assets/svg/icons";
import AppText from "../components/AppText";
import Card from "../components/Card";
import Colors from "../constants/Colors";
import CustomButton from "../components/CustomButton";
import jobsApi from "../api/jobs";
import { formattedDate } from "../utilities/date";
import dummyJobDetails from "../dummyData.js/dummyJobDetails";
import cache from "../utilities/cache";
import ApplicationModal from "../components/appmodals/ApplicationModal";
import { frontEndClient } from "../api/client";
import NetworkError from "../components/NetworkError";
import CustomHeader from "../components/CustomHeader";
import applicationApi from "../api/application";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import useApi from "../hooks/useApi";
import CustomAlert from "../components/CustomAlert";
import campusJobsApi from "../api/campusApis/jobs";
import Loading from "../components/Loading";
import Error from "../components/Error";
import campusCandidateApi from "../api/campusApis/candidate";
import showToast from "../components/ShowToast";
import { useFocusEffect } from "@react-navigation/native";
import candidateApi from "../api/candidate";

const { width, height } = Dimensions.get("window");

const NormalText = ({ children }) => (
  <Text
    style={{
      color: Colors.black,
      fontFamily: "OpenSans-Regular",
      fontSize: 14.5,
      marginTop: 5,
      marginBottom: 10,
    }}
  >
    {children}
  </Text>
);
var isVisible = false;

function JobDetailScreen({ route, navigation }) {
  const [showDetail, setShowDetail] = useState(1);
  const [isPressed, setIsPressed] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [position] = useState(new Animated.ValueXY());
  const [isApplied, setIsApplied] = useState(route.params.isApplied);
  const [applicationId, setApplicationId] = useState(
    route.params.applicationId
  );

  const jobId = route.params.jobId;

  const [jobDetails, setJobDetails] = useState(dummyJobDetails);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const [visible, setVisible] = useState(false);
  const [placementCriteria, setPlacementCriteria] = useState();

  const {
    data: campusProfileData,
    // error,
    // networkError,
    cgpaLoading,
    request: loadCampusProfile,
  } = useApi(campusCandidateApi.getProfile);

  const { data: profileData, request: loadProfile } = useApi(
    candidateApi.getProfile
  );

  useEffect(() => {
    loadCampusProfile();
    loadProfile();
  }, []);

  const revokeHandler = async () => {
    const response = await applicationApi.deleteApplication(applicationId);

    setVisible(false);
    // console.log(response);
    if (!response.ok) {
      if (response.problem === "NETWORK_ERROR") {
        return Toast.show({
          type: "appError",
          text1: "No internet connection!",
        });
      } else {
        return Toast.show({
          type: "appError",
          text1: response.data.details
            ? response.data.details
            : "Something went wrong",
        });
      }
    }
    setNetworkError(false);
    setError(false);
    setLoading(false);

    Toast.show({
      type: "appSuccess",
      text1: "Revoked successfully!",
    });

    setIsApplied(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isVisible) {
          setIsPressed(false);
          isVisible = false;
          setCloseModal(true);
          return true;
        }

        navigation.goBack();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const RevokeApplication = () => {
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
            Revoke Application
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
            onPress={revokeHandler}
            title="Revoke"
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

  const loadJobDetails = async (jobId) => {
    setLoading(true);
    let response;

    if (route.params.isCampus)
      response = await campusJobsApi.getCampusJobDetails(jobId);
    else response = await jobsApi.getJobDetails(jobId);

    if (!response.ok) {
      setLoading(false);

      if (response.problem === "NETWORK_ERROR") return setNetworkError(true);
      else return setError(true);
    }
    setNetworkError(false);
    setError(false);
    if (route.params.isCampus) {
      setJobDetails(response.data.job_detail);
      setPlacementCriteria(response.data.placement_criteria);
    } else setJobDetails(response.data);
    setLoading(false);
  };

  useEffect(() => {
    loadJobDetails(jobId);
  }, []);

  const [inWishlist, setInWishlist] = useState(false);

  const wishlistStatus = async () => {
    const wishlist = await cache.get("wishlist");
    const status = wishlist?.find((job) => job.id === jobDetails._id);
    if (status) return setInWishlist(true);
    else return setInWishlist(false);
  };
  wishlistStatus();

  const addToWishlist = async () => {
    if (route.params.isApplied) return;

    let wl = await cache.get("wishlist");

    if (!wl) wl = [];

    await cache.store("wishlist", [
      ...wl,
      {
        title: jobDetails.job_title,
        company: jobDetails.company.name,
        id: jobDetails._id,
      },
    ]);

    showToast({ type: "appSuccess", message: "Added to wishlist!" });

    setInWishlist(true);
  };

  const removeFromWishlist = async () => {
    const wl = await cache.get("wishlist");

    wl?.find((job, index) => {
      if (job.id === jobDetails._id) {
        wl.splice(index, 1);
        return true;
      }
    });
    await cache.store("wishlist", [...wl]);

    showToast({ type: "appWarning", message: "Removed from wishlist!" });

    setInWishlist(false);
  };

  console.log(isPressed, " called");
  const getData = () => {
    console.log(isPressed, "get data called");
    setIsPressed(false);
  };

  const getIsApplied = (val, applicationId) => {
    console.log("get is applied called");
    setIsPressed(false);
    setIsApplied(val);
    setApplicationId(applicationId);
  };

  const animStyles = {
    top: 0,
    borderRadius: 20,
    height: 3,
    width: width / 6,
    backgroundColor: Colors.primary,
    transform: position.getTranslateTransform(),
  };

  const Description = ({ show }) => {
    const systemFonts = [...defaultSystemFonts, "OpenSans-Regular"];

    const animate = (value) => {
      Animated.timing(position, {
        toValue: { x: value, y: 0 },
        duration: 160,
        useNativeDriver: true,
      }).start();
    };

    let detail;
    if (show === 1) {
      detail = jobDetails.job_description;
      animate(width / 20);
    } else if (show === 2) {
      detail = jobDetails.job_requirements;
      animate(width / 2.4);
    } else if (show === 3) {
      detail = jobDetails.preferred_qualification;
      animate(width / 1.44);
    }

    return (
      <View
        style={{
          paddingHorizontal: 20,
          // paddingBottom: 20,
          width: "100%",
          marginTop: show === 2 ? 0 : 10,
        }}
      >
        {show !== 3 ? (
          <RenderHtml
            contentWidth={width}
            source={{
              html: detail,
            }}
            systemFonts={systemFonts}
            baseStyle={{
              fontFamily: "OpenSans-Regular",
              fontSize: 14.5,
              color: Colors.black,
            }}
          />
        ) : (
          <>
            {jobDetails.minimum_qualification !== null && (
              <>
                <AppText>Minimum Qualification</AppText>
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: jobDetails.minimum_qualification,
                  }}
                  systemFonts={systemFonts}
                  baseStyle={{
                    fontFamily: "OpenSans-Regular",
                    fontSize: 14.5,
                    color: Colors.black,
                  }}
                />
              </>
            )}
            {jobDetails.preferred_qualification && (
              <>
                <AppText>Preferred Qualification</AppText>
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: jobDetails.preferred_qualification,
                  }}
                  systemFonts={systemFonts}
                  baseStyle={{
                    fontFamily: "OpenSans-Regular",
                    fontSize: 14.5,
                    color: Colors.black,
                  }}
                />
              </>
            )}

            <View>
              {jobDetails.job_supplement_pay[0].name &&
                jobDetails.job_supplement_pay[0].name !== "" && (
                  <>
                    <AppText>Job Supplements</AppText>
                    <NormalText>
                      {jobDetails.job_supplement_pay[0].name}
                    </NormalText>
                  </>
                )}
              <AppText>Job Schedule</AppText>
              <NormalText>
                {jobDetails.job_schedule[0]
                  ? jobDetails.job_schedule[0].name
                  : jobDetails.job_schedule.name}
              </NormalText>
              {!jobDetails.salary_undisclosed && jobDetails.salary && (
                <>
                  <AppText>Salary</AppText>
                  {jobDetails.salary.salary_from ? (
                    <NormalText>
                      ₹{jobDetails.salary.salary_from} - ₹
                      {jobDetails.salary.salary_to}{" "}
                      {jobDetails.salary.salary_type}
                    </NormalText>
                  ) : (
                    <NormalText>
                      ₹{jobDetails.salary.salary}{" "}
                      {jobDetails.salary.salary_type}
                    </NormalText>
                  )}
                </>
              )}
              <AppText>Remote</AppText>
              <NormalText>{jobDetails.job_remote.name}</NormalText>
              <AppText>Open Positions</AppText>
              <NormalText>{jobDetails.no_of_vacancy}</NormalText>
            </View>
          </>
        )}
      </View>
    );
  };

  function convertToSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }

  const onShare = async () => {
    try {
      await Share.share({
        message: `${frontEndClient}/jobs/${convertToSlug(
          jobDetails.job_title
        )}/${jobId}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <CustomHeader
        navigation={navigation}
        isShare
        backScreen={navigation.getState().routeNames[0]}
        onRightIconPress={onShare}
      />
      {loading || !campusProfileData ? (
        <Loading />
      ) : networkError && !loading ? (
        <NetworkError onPress={() => loadJobDetails(jobId)} />
      ) : error ? (
        <Error onPress={() => loadJobDetails(jobId)} />
      ) : (
        <View
          style={{
            flex: 1,
            width: width,
            height: height,
            backgroundColor: Colors.bg,
          }}
        >
          <ScrollView
            style={styles.container}
            contentContainerStyle={{ alignItems: "center" }}
          >
            <View
              style={{
                // flex: 1,
                // borderWidth: 1,
                width: "100%",
                // justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card style={styles.card}>
                <Text style={styles.heading}>{jobDetails.job_title}</Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 7,
                  }}
                >
                  <BuildingIcon color="#BDEEFF" />
                  <Text style={styles.text}>{jobDetails.company.name}</Text>
                </View>
                {route.params.location && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Location color="#BDEEFF" />
                    <Text style={styles.text}>{route.params.location}</Text>
                  </View>
                )}
                <Card
                  style={{
                    marginTop: 20,
                    paddingHorizontal: 13,
                    paddingRight: 3,
                    // marginLeft: 0,
                    alignSelf: "center",
                  }}
                >
                  <View style={styles.cardBlue}>
                    <AppText style={{ color: Colors.primary }}>
                      {jobDetails.job_type.name}
                    </AppText>
                  </View>

                  {!route.params.isApplied && (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginHorizontal: 3,
                        marginRight: 7,
                      }}
                    >
                      <AppText
                        style={{ fontSize: 12, fontFamily: "OpenSans-Medium" }}
                      >
                        Apply by
                      </AppText>
                      <AppText
                        style={{
                          fontSize: 12,
                          fontFamily: "OpenSans-Medium",
                          color: Colors.primary,
                        }}
                      >
                        {formattedDate(jobDetails.job_deadline)}
                      </AppText>
                    </View>
                  )}
                </Card>
                <Card
                  style={{
                    flexDirection: "column",
                    alignSelf: "center",
                    width: "100%",
                    // alignItems: "space-evenly",
                    paddingHorizontal: 30,
                    paddingVertical: 17,
                    // backgroundColor: "blue",
                  }}
                >
                  {jobDetails.qualification && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        // marginBottom: 20,
                        flexWrap: "wrap",
                      }}
                    >
                      <View style={{ marginBottom: 20 }}>
                        <AppText style={{ marginBottom: 6 }}>Degree</AppText>
                        {jobDetails.qualification.map((qual) => (
                          <AppText
                            style={styles.requirementText}
                            key={qual._id}
                          >
                            {qual.name}
                          </AppText>
                        ))}
                      </View>
                      <View style={{ marginBottom: 20 }}>
                        <AppText style={{ marginBottom: 6 }}>
                          Work Experience
                        </AppText>
                        <AppText style={styles.requirementText}>
                          {jobDetails.job_exp_from}-{jobDetails.job_exp_to}{" "}
                          Years
                        </AppText>
                      </View>
                    </View>
                  )}
                  {jobDetails.skills.length !== 0 && (
                    <View>
                      <AppText style={{ marginBottom: 6 }}>
                        Required skills
                      </AppText>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          marginStart: 5,
                        }}
                      >
                        {jobDetails.skills.map((skill, index) => (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 5,
                                width: 5,
                                backgroundColor: "black",
                              }}
                            />
                            <AppText style={styles.requirementText} key={index}>
                              {skill.name}
                            </AppText>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </Card>
              </Card>
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => setShowDetail(1)}>
                <AppText style={styles.detailsHeading}>DESCRIPTION</AppText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowDetail(2)}>
                <AppText style={styles.detailsHeading}>RESPONSIBILITY</AppText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowDetail(3)}>
                <AppText style={styles.detailsHeading}>MORE</AppText>
              </TouchableOpacity>
            </View>
            <View
              style={{
                // borderWidth: 1,
                width: "85%",
                // marginHorizontal: 20,
                marginTop: 3,
              }}
            >
              <Animated.View style={animStyles} />
            </View>
            <Description show={showDetail} />
          </ScrollView>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              backgroundColor: Colors.bg,
              marginBottom: 15,
              marginVertical: 10,
              paddingHorizontal: 15,
            }}
          >
            {!isApplied ? (
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  elevation: 3,
                  height: 40,
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 3,
                  backgroundColor: "white",
                  padding: 4,
                  marginRight: 10,
                }}
                onPress={inWishlist ? removeFromWishlist : addToWishlist}
              >
                <MaterialCommunityIcons
                  name={
                    inWishlist || inWishlist === undefined
                      ? "bookmark-minus"
                      : "bookmark-minus-outline"
                  }
                  size={24}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            ) : route.params.isCampus ? null : (
              <CustomButton
                icon={
                  <Entypo
                    name="squared-minus"
                    size={24}
                    color={Colors.primary}
                  />
                }
                style={{
                  backgroundColor: "white",
                  // width: "70%",
                  marginRight: 10,
                  elevation: 4,
                  paddingHorizontal: 10,
                  flex: 1.5,
                  justifyContent: "space-evenly",
                  marginVertical: 0,
                }}
                title="Revoke Application"
                titleStyle={{ color: Colors.primary }}
                onPress={() => setVisible(true)}
              />
            )}
            <CustomButton
              disabled={isApplied}
              onPress={() => {
                if (profileData?.error === "Candidate Profile not found!!")
                  return showToast({
                    type: "appError",
                    message: "Please complete your profile to apply for a job.",
                  });
                setCloseModal(false);
                isVisible = true;
                return setIsPressed(true);
              }}
              title={isApplied ? "Applied" : "Apply"}
              style={{ marginVertical: 0 }}
            />
          </View>

          <ApplicationModal
            data={jobDetails}
            isPressed={isPressed}
            closeModal={closeModal}
            sendData={getData}
            sendIsApplied={getIsApplied}
            isCampus={route.params.isCampus}
            placementCriteria={placementCriteria}
            cgpa={campusProfileData[0]?.cgpa}
            jobId={jobId}
          />
          <RevokeApplication />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    top: -5,
    flexDirection: "column",
    // flex: 0.75,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  cardBlue: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 3,
    backgroundColor: Colors.cardBlue,
    paddingVertical: 3,
    marginRight: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    // alignItems: "center",
    backgroundColor: Colors.bg,
    // width: "100%",
    // marginBottom: -10,
  },
  detailsHeading: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 15,
    color: Colors.primary,
  },
  heading: {
    fontFamily: "OpenSans-Bold",
    fontSize: 25,
    color: Colors.primary,
  },
  loading: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  requirementText: {
    fontFamily: "OpenSans-Medium",
    color: Colors.black,
    fontSize: 15,
    marginStart: 5,
    marginEnd: 10,
  },
  text: {
    fontFamily: "OpenSans-Medium",
    color: Colors.primary,
    fontSize: 15.5,
    marginStart: 3,
  },
});

export default JobDetailScreen;
