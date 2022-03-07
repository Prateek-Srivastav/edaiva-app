import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Feather, EvilIcons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

import AppText from "../components/AppText";
import Card from "../components/Card";
import Colors from "../constants/Colors";
import jobsApi from "../api/jobs";
import JobDetails from "../components/JobDetails";
import { BuildingIcon, Location, Share } from "../assets/svg/icons";
import useApi from "../hooks/useApi";
import Loading from "../components/Loading";
import interviewApi from "../api/interview";
import RescheduleModal from "../components/appmodals/RescheduleModal";
import { formattedDate } from "../utilities/date";
import formattedTime from "../utilities/time";
import applicationApi from "../api/application";
import CustomHeader from "../components/CustomHeader";

const { width, height } = Dimensions.get("screen");

function ApplicationStatusScreen({ route }) {
  const [showDetail, setShowDetail] = useState(1);
  const [isPressed, setIsPressed] = useState(false);

  const [position] = useState(new Animated.ValueXY());

  const { jobId, applicationId } = route.params;

  const applicationStatus = route.params.applicationStatus;

  const {
    data,
    error,
    networkError,
    loading,
    request: loadJobDetails,
  } = useApi(jobsApi.getJobDetails);

  const {
    data: interviewData,

    request: loadInterviews,
  } = useApi(interviewApi.getApplicationInterviews);

  const {
    data: applicationData,

    request: loadApplicationDetails,
  } = useApi(applicationApi.getApplications);

  useEffect(() => {
    loadJobDetails(jobId);
    loadInterviews(applicationId);
    loadApplicationDetails(applicationId);
  }, []);

  if (loading) return <Loading />;

  const getData = (val) => {
    setIsPressed(false);
  };

  const animStyles = {
    top: 0,
    borderRadius: 20,
    height: 3,
    width: width / 6,
    backgroundColor: Colors.primary,
    transform: position.getTranslateTransform(),
  };

  const StatusMessage = () => {
    let color;
    let message;

    if (
      applicationStatus === "hired" &&
      applicationData &&
      applicationData[0].offerletter.length === 0
    ) {
      color = "#2D811F";
      message =
        "Congratulations, you have successfully quaified for this position. You will receive offer letter soon.";
    } else if (applicationStatus === "rejected") {
      color = "#F11212";
      message =
        "We are sorry to inform you that you are not eligible for this position.";
    }

    return (
      <AppText style={{ ...styles.statusMessage, color }}>{message}</AppText>
    );
  };

  const InterviewDetail = () => {
    if (
      (applicationStatus === "interviewing" && interviewData?.length === 0) ||
      applicationStatus === "finalist"
    ) {
      return (
        <View
          style={{
            paddingHorizontal: 15,
            width,
          }}
        >
          <AppText>
            Your application has reviewed, scheduled interviews will be visible
            soon.
          </AppText>
        </View>
      );
    }
    return interviewData?.map((interview) => {
      {
        if (!interview.interview_completed)
          return (
            <View style={{ flex: 1, paddingHorizontal: 15, width }}>
              <View style={styles.line} />

              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.primary,
                    borderRadius: 4,
                    backgroundColor: "#FFFFFF",
                    padding: 15,
                    paddingRight: 5,
                    width: "80%",
                  }}
                >
                  <AppText
                    style={{
                      fontSize: 16,
                      color: Colors.primary,
                      fontFamily: "OpenSans-Medium",
                      marginBottom: 5,
                    }}
                  >
                    Round {interview.interview_round}
                  </AppText>
                  <AppText>
                    Interview is scheduled{" "}
                    {interview.interview_type === "virtual"
                      ? "virtually"
                      : "physically"}{" "}
                    on
                  </AppText>
                  <View style={{ flexDirection: "row" }}>
                    <AppText
                      style={{
                        fontSize: 15,
                        color: Colors.primary,
                        fontFamily: "OpenSans-Medium",
                        marginBottom: 5,
                      }}
                    >
                      {formattedDate(interview.scheduled_from)} from{" "}
                      {formattedTime(interview.scheduled_from)} to{" "}
                      {formattedTime(interview.scheduled_to)}
                    </AppText>
                  </View>
                  {interview.reschedule_requests.length !== 0 &&
                  !interview.reschedule_requests[0].accepted ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Feather name="info" size={18} color="#ffe957" />
                      <AppText
                        style={{ marginTop: 10, flex: 1, marginLeft: 5 }}
                      >
                        Your request to reschedule interview has been submitted.
                      </AppText>
                    </View>
                  ) : interview.reschedule_requests[0].accepted ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <EvilIcons
                        name="check"
                        size={25}
                        color={Colors.primary}
                      />
                      <AppText
                        style={{ marginTop: 10, flex: 1, marginLeft: 5 }}
                      >
                        Your request to reschedule interview has been approved.
                      </AppText>
                    </View>
                  ) : (
                    <>
                      <AppText style={{ marginTop: 10 }}>
                        Not available at the moment?
                      </AppText>
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          setIsPressed(true);
                        }}
                      >
                        <Feather
                          name="repeat"
                          size={13}
                          color={Colors.primary}
                        />
                        <AppText
                          style={{
                            color: Colors.primary,
                            fontFamily: "OpenSans-Italic",
                            marginLeft: 5,
                            textDecorationLine: "underline",
                            fontSize: 15,
                          }}
                        >
                          Reschedule
                        </AppText>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() =>
                    WebBrowser.openBrowserAsync(interview.interview_link)
                  }
                  style={{
                    backgroundColor: Colors.primary,
                    width: "20%",
                    borderRadius: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Share color="white" />
                  <AppText
                    textAlign="center"
                    style={{ color: "white", marginTop: 8 }}
                  >
                    Meeting
                  </AppText>
                  <AppText textAlign="center" style={{ color: "white" }}>
                    Link
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          );
      }
      return (
        <View style={{ flex: 1, paddingHorizontal: 15, width }}>
          <View
            style={{
              flexDirection: "row",
              // width,

              justifyContent: "center",
              // borderWidth: 1,
              // flex: 1,
            }}
          >
            <View
              style={{
                right: -3,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: "#33A000",
                width: "15%",
                // overflow: "hidden",
                backgroundColor: "rgba(51, 160, 0, 0.15)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather
                name="check"
                size={20}
                color="#33A000"
                // style={{ marginRight: 5 }}
              />
            </View>
            <View
              style={{
                left: -2,
                borderWidth: 1,
                borderColor: Colors.primary,
                borderRadius: 4,
                // overflow: "hidden",
                backgroundColor: "#FFFFFF",
                padding: 15,
                width: "87%",
              }}
            >
              <AppText
                style={{
                  fontSize: 16,
                  color: Colors.primary,
                  fontFamily: "OpenSans-Medium",
                  marginBottom: 5,
                }}
              >
                Round {interview.interview_round}
              </AppText>
              <AppText>Interview was scheduled virtually on</AppText>
              <View style={{ flexDirection: "row" }}>
                <AppText
                  style={{
                    fontSize: 15,
                    color: Colors.primary,
                    fontFamily: "OpenSans-Medium",
                    marginBottom: 5,
                  }}
                >
                  {formattedDate(interview.scheduled_from)} from{" "}
                  {formattedTime(interview.scheduled_from)} to{" "}
                  {formattedTime(interview.scheduled_to)}
                </AppText>
              </View>
            </View>
          </View>
        </View>
      );
    });
  };

  const Description = ({ show }) => {
    const animate = (value) => {
      Animated.timing(position, {
        toValue: { x: value, y: 0 },
        duration: 160,
        useNativeDriver: true,
      }).start();
    };

    let detail;
    if (show === 1) {
      detail = interviewData ? <InterviewDetail /> : <View></View>;
      animate(width / 5);
    } else if (show === 2) {
      detail = <JobDetails data={data} />;
      animate(3 * (width / 5));
    }

    return (
      <ScrollView
        style={{
          // paddingHorizontal: 20,
          paddingBottom: 20,
          width: "100%",
          // marginTop: 10,
          // marginBottom: 10,
        }}
      >
        {show === 1 && (
          <AppText
            style={{
              color: Colors.black,
              textAlign: "justify",
            }}
          >
            {detail}
          </AppText>
        )}
        {show === 2 && detail}
      </ScrollView>
    );
  };

  return !loading && data && interviewData && applicationData ? (
    <View style={styles.container}>
      {/* <CustomHeader  navigation={navigation} /> */}
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.bg,
          alignItems: "center",
        }}
      >
        <Card style={styles.card}>
          <Text style={styles.heading}>{data.job_title}</Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 7,
            }}
          >
            <BuildingIcon color="#BDEEFF" />

            <Text style={styles.text}>{data.company.name}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Location color="#BDEEFF" />

            <Text style={styles.text}>{route.params.location}</Text>
          </View>
          {applicationData[0].offerletter.length > 0 ? (
            <Card
              style={{ alignItems: "center", width: "97%" }}
              touchable
              // onPress={viewResume}
            >
              <FontAwesome5
                name="file-upload"
                style={styles.icon}
                size={ICON_SIZE}
                color={ICON_COLOR}
              />
              <NormalText>View Offer Letter</NormalText>
            </Card>
          ) : (
            <StatusMessage />
          )}

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <TouchableOpacity onPress={() => setShowDetail(1)}>
              <AppText style={styles.detailsHeading}>INTERVIEW</AppText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDetail(2)}>
              <AppText style={styles.detailsHeading}>JOB DETAILS</AppText>
            </TouchableOpacity>
          </View>
          <View
            style={{
              // borderWidth: 1,
              width: "100%",
              // marginHorizontal: 20,
              marginTop: 3,
              marginBottom: -10,
            }}
          >
            <Animated.View style={animStyles} />
          </View>
        </Card>
        <Description show={showDetail} />
      </View>

      <RescheduleModal isPressed={isPressed} sendData={getData} />
    </View>
  ) : (
    <Loading />
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
    paddingTop: 20,
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
  line: {
    // height: 27,
    width: "70%",
    height: 1,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 15,
    backgroundColor: "#DBDBDB",
    elevation: 1,
    alignSelf: "center",
    opacity: 0.5,
  },
  requirementText: {
    fontFamily: "OpenSans-Medium",
    color: Colors.black,
    fontSize: 15,
    marginStart: 5,
  },
  statusMessage: {
    marginVertical: 10,
  },
  text: {
    fontFamily: "OpenSans-Medium",
    color: Colors.primary,
    fontSize: 15.5,
    marginStart: 3,
  },
});

export default ApplicationStatusScreen;
