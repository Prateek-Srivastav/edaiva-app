import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

import AppText from "../../components/AppText";
import Card from "../../components/Card";
import Colors from "../../constants/Colors";
import JobDetails from "../../components/JobDetails";
import { BuildingIcon, Location, Share } from "../../assets/svg/icons";
import useApi from "../../hooks/useApi";
import Loading from "../../components/Loading";
import RescheduleModal from "../../components/appmodals/RescheduleModal";
import { formattedDate } from "../../utilities/date";
import formattedTime from "../../utilities/time";
import campusApplicationApi from "../../api/campusApis/application";
import Error from "../../components/Error";
import NetworkError from "../../components/NetworkError";
import CustomAlert from "../../components/CustomAlert";
import CardInput from "../../components/CardInput";
import CustomButton from "../../components/CustomButton";
import showToast from "../../components/ShowToast";
import { ErrorMessage } from "../../components/forms";

const { width, height } = Dimensions.get("screen");

function CampusApplicationStatusScreen({ route }) {
  const [showDetail, setShowDetail] = useState(1);
  const [isPressed, setIsPressed] = useState(false);
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
  const [isViewSubmissionModalVisible, setIsViewSubmissionModalVisible] =
    useState(false);

  const [position] = useState(new Animated.ValueXY());

  const { jobId, applicationId } = route.params;

  const applicationStatus = route.params.applicationStatus;

  var solution_link,
    description = "",
    solutionLinkError;

  const {
    data,
    error,
    networkError,
    loading,
    request: loadCampusApplicationDetails,
  } = useApi(campusApplicationApi.getCampusApplications);

  const {
    error: submitAssignmentError,
    networkError: submitAssignmentNetworkError,
    request: submitAssignment,
  } = useApi(campusApplicationApi.assignmentSubmission);

  useEffect(() => {
    loadCampusApplicationDetails(applicationId);
  }, []);

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

    if (applicationStatus === "hired") {
      color = "#2D811F";
      message =
        "Congratulations, you have successfully qualified for this position. You will receive offer letter soon.";
    } else if (applicationStatus === "rejected") {
      color = "#F11212";
      message =
        "We are sorry to inform you that you are not eligible for this position.";
    }

    return (
      <AppText style={{ ...styles.statusMessage, color }}>{message}</AppText>
    );
  };

  const RoundDetail = () => {
    if (
      (applicationStatus === "interviewing" &&
        data?.application_rounds?.length === 0) ||
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
    return (
      <>
        {data.current_round && (
          <View style={{ flex: 1, paddingHorizontal: 15, width }}>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.primary,
                  borderRadius: 4,
                  backgroundColor: "#FFFFFF",
                  padding: 15,
                  paddingRight: 5,
                  width: "75%",
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
                  Round {data.current_round.round_no}
                </AppText>
                <AppText>Your assignment is scheduled virtually on </AppText>
                <View>
                  <AppText
                    style={{
                      fontSize: 15,
                      color: Colors.primary,
                      fontFamily: "OpenSans-SemiBold",
                      marginBottom: 5,
                    }}
                  >
                    {formattedDate(data.current_round.start_time)}
                  </AppText>
                  <View style={{ flexDirection: "row" }}>
                    <AppText
                      style={{
                        fontSize: 15,
                        color: Colors.primary,
                        fontFamily: "OpenSans-SemiBold",
                        marginBottom: 5,
                      }}
                    >
                      {formattedTime(data.current_round.start_time)}
                    </AppText>
                    <AppText
                      style={{
                        fontSize: 14,
                        color: Colors.primary,
                        fontFamily: "OpenSans-Regular",
                        marginBottom: 5,
                      }}
                    >
                      {" "}
                      to{" "}
                    </AppText>
                    <AppText
                      style={{
                        fontSize: 15,
                        color: Colors.primary,
                        fontFamily: "OpenSans-SemiBold",
                        marginBottom: 5,
                      }}
                    >
                      {formattedTime(data.current_round.end_time)}
                    </AppText>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  width: "25%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    WebBrowser.openBrowserAsync(data.current_round.round_link)
                  }
                  style={{
                    backgroundColor: Colors.primary,
                    flex: 1,
                    width: "100%",
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
                    View
                  </AppText>
                  <AppText textAlign="center" style={{ color: "white" }}>
                    Assignment
                  </AppText>
                </TouchableOpacity>
                {data?.application_rounds[0].assignment_submission.length >
                0 ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setIsViewSubmissionModalVisible(true)}
                    style={{
                      backgroundColor: Colors.primary,
                      flex: 1,
                      width: "100%",
                      marginTop: 2,
                      borderRadius: 4,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AppText textAlign="center" style={{ color: "white" }}>
                      View
                    </AppText>
                    <AppText textAlign="center" style={{ color: "white" }}>
                      Submission
                    </AppText>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setIsSubmitModalVisible(true);
                    }}
                    style={{
                      width: "100%",
                      flex: 1,
                      backgroundColor: Colors.primary,
                      marginTop: 1,
                      flexDirection: "row",
                      borderRadius: 4,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{ height: 16, width: 16, marginRight: 7 }}
                      source={require("../../assets/send.png")}
                    />
                    <AppText textAlign="center" style={{ color: "white" }}>
                      Submit
                    </AppText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
        {data?.application_rounds?.map((interview) => {
          if (interview.round.status === "Ongoing") return null;
          return (
            <View style={{ flex: 1, paddingHorizontal: 15, width }}>
              <View style={styles.line} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    right: -3,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: "#33A000",
                    width: "15%",
                    backgroundColor: "rgba(51, 160, 0, 0.15)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Feather name="check" size={20} color="#33A000" />
                </View>
                <View
                  style={{
                    left: -2,
                    borderWidth: 1,
                    borderColor: Colors.primary,
                    borderRadius: 4,
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
                    Round {interview.round.round_no}
                  </AppText>
                  <AppText>Your assignment was scheduled virtually on</AppText>
                  <View>
                    <AppText
                      style={{
                        fontSize: 15,
                        color: Colors.primary,
                        fontFamily: "OpenSans-SemiBold",
                        marginBottom: 5,
                      }}
                    >
                      {formattedDate(data.current_round.start_time)}
                    </AppText>
                    <View style={{ flexDirection: "row" }}>
                      <AppText
                        style={{
                          fontSize: 15,
                          color: Colors.primary,
                          fontFamily: "OpenSans-SemiBold",
                          marginBottom: 5,
                        }}
                      >
                        {formattedTime(data.current_round.start_time)}
                      </AppText>
                      <AppText
                        style={{
                          fontSize: 14,
                          color: Colors.primary,
                          fontFamily: "OpenSans-Regular",
                          marginBottom: 5,
                        }}
                      >
                        {" "}
                        to{" "}
                      </AppText>
                      <AppText
                        style={{
                          fontSize: 15,
                          color: Colors.primary,
                          fontFamily: "OpenSans-SemiBold",
                          marginBottom: 5,
                        }}
                      >
                        {formattedTime(data.current_round.end_time)}
                      </AppText>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </>
    );
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
      detail = data ? <RoundDetail /> : <View></View>;
      animate(width / 5);
    } else if (show === 2) {
      detail = (
        <JobDetails data={data.campus_job_details.details} isCampus={true} />
      );
      animate(3 * (width / 5));
    }

    return (
      <ScrollView
        style={{
          paddingBottom: 20,
          width: "100%",
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

  const submitAssignmentHandler = async () => {
    const detail = {
      description,
      submission_link: solution_link,
      student_application: data?.application_rounds[0].student_application,
      student_application_round: data?.application_rounds[0]._id,
    };

    if (!solution_link) return (solutionLinkError = "true");

    await submitAssignment(detail);

    if (submitAssignmentError)
      return showToast({ type: "appError", message: "Something went wrong!" });

    if (submitAssignmentNetworkError)
      return showToast({
        type: "appError",
        message: "Internet connection lost!",
      });

    return showToast({
      type: "appSuccess",
      message: "Assignment submit successfully!",
    });
  };

  const ViewSubmissionModal = () => (
    <CustomAlert
      visible={isViewSubmissionModalVisible}
      setAlertVisible={setIsViewSubmissionModalVisible}
      modalWidth="90%"
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontFamily: "OpenSans-SemiBold", fontSize: 16 }}>
          Submit assignment
        </Text>
        <TouchableOpacity
          onPress={() => {
            setIsViewSubmissionModalVisible(false);
          }}
          style={{
            borderWidth: 1,
            borderColor: "#0AB4F14D",
            borderRadius: 3,
            alignSelf: "flex-end",
          }}
        >
          <Feather name="x" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          ...styles.line,
          width: "100%",
          elevation: 0,
          marginVertical: 5,
        }}
      />
      <Text
        style={{
          fontSize: 15,
          fontFamily: "OpenSans-Medium",
          marginBottom: 5,
          marginTop: 10,
        }}
      >
        Submitted on
      </Text>
      <AppText>
        {formattedDate(
          data?.application_rounds[0].assignment_submission[0].createdAt
        )}
      </AppText>
      <View
        style={{
          ...styles.line,
          width: "100%",
          elevation: 0,
          marginVertical: 5,
        }}
      />
      <Text
        style={{
          fontSize: 15,
          fontFamily: "OpenSans-Medium",
          marginBottom: 5,
          marginTop: 10,
        }}
      >
        Solution Link
      </Text>
      <TouchableOpacity
        onPress={() =>
          WebBrowser.openBrowserAsync(
            data?.application_rounds[0].assignment_submission[0].submission_link
          )
        }
      >
        <AppText style={{ color: Colors.primary }}>
          {data?.application_rounds[0].assignment_submission[0].submission_link}
        </AppText>
      </TouchableOpacity>
      {data?.application_rounds[0].assignment_submission[0].description.length >
        0 && (
        <>
          <View
            style={{
              ...styles.line,
              width: "100%",
              elevation: 0,
              marginVertical: 5,
            }}
          />
          <Text
            style={{
              fontSize: 15,
              fontFamily: "OpenSans-Medium",
              marginBottom: 5,
              marginTop: 10,
            }}
          >
            Description
          </Text>
          <AppText>
            {data?.application_rounds[0].assignment_submission[0].description}
          </AppText>
        </>
      )}
    </CustomAlert>
  );

  const SubmitModal = () => (
    <CustomAlert
      visible={isSubmitModalVisible}
      setAlertVisible={setIsSubmitModalVisible}
      modalWidth="90%"
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontFamily: "OpenSans-SemiBold", fontSize: 16 }}>
          Submit assignment
        </Text>
        <TouchableOpacity
          onPress={() => {
            setIsSubmitModalVisible(false);
          }}
          style={{
            borderWidth: 1,
            borderColor: "#0AB4F14D",
            borderRadius: 3,
            alignSelf: "flex-end",
          }}
        >
          <Feather name="x" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          ...styles.line,
          width: "100%",
          elevation: 0,
          marginVertical: 5,
        }}
      />
      <CardInput
        label="Solution Link*"
        onChangeText={(text) => {
          solutionLinkError = "false";
          solution_link = text;
        }}
        placeholder="Paste URL here"
      />
      <ErrorMessage
        error="Please enter solution link."
        visible={solutionLinkError === "true"}
      />
      <CardInput
        label="Description (Optional)"
        onChangeText={(text) => {
          description = text;
        }}
        placeholder="Enter solution details / explanation"
        multiline
        numberOfLines={6}
      />
      <View style={{ width: "100%", flexDirection: "row" }}>
        <CustomButton
          onPress={() => setIsSubmitModalVisible(false)}
          title="Cancel"
          titleStyle={{ color: Colors.primary }}
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#C1EFFF",
            borderWidth: 1,
            marginRight: 10,
          }}
        />
        <CustomButton
          onPress={submitAssignmentHandler}
          title="Submit"
          titleStyle={{ color: Colors.white }}
          style={{
            backgroundColor: Colors.primary,
            elevation: 3,
          }}
        />
      </View>
    </CustomAlert>
  );

  return (
    <>
      {loading || !data ? (
        <Loading />
      ) : networkError && !loading ? (
        <NetworkError onPress={() => loadApplications()} />
      ) : error && !loading ? (
        <Error onPress={() => loadApplications()} />
      ) : (
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.bg,
              alignItems: "center",
            }}
          >
            <Card style={styles.card}>
              <Text style={styles.heading}>
                {data.campus_job_details.details.job_title}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 7,
                }}
              >
                <BuildingIcon color="#BDEEFF" />

                <Text style={styles.text}>{data.company_details[0].name}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Location color="#BDEEFF" />

                <Text style={styles.text}>{route.params.location}</Text>
              </View>
              {/* {applicationData[0].offerletter.length > 0 ? (
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
          ) : ( */}
              <StatusMessage />
              {/* )} */}

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
                  width: "100%",
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
      )}
      <SubmitModal />
      <ViewSubmissionModal />
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

export default CampusApplicationStatusScreen;
